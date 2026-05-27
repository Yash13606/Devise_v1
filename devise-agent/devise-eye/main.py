"""Devise Desktop Agent - Main Entry Point."""

import asyncio
import signal
import sys
import logging
import os
from pathlib import Path
from typing import Optional, Tuple
from datetime import datetime, timezone

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class DeviseAgent:
    """Main Devise Desktop Agent application."""

    def __init__(self, config_path: Optional[str] = None):
        from config import get_config, ConfigPoller
        from identity import get_identity
        from detector import create_detector
        from process_resolver import create_process_resolver
        from dns_resolver import create_resolver
        from registry import create_registry
        from deduplicator import create_deduplicator
        from event_builder import create_event_builder
        from reporter import SupabaseReporter
        from event_queue import create_event_queue
        from heartbeat import HeartbeatSender
        from frequency_tracker import FrequencyTracker
        from liveness_monitor import LivenessMonitor
        from tamper_guard import TamperGuard
        from firewall_monitor import create_firewall_monitor
        from sensitivity_monitor import create_sensitivity_monitor
        from settings import build_agent_settings, ReporterSettings, HeartbeatSettings, FirewallSettings

        # C2: Single config read — build typed Settings, pass them downstream
        raw_config = get_config(config_path)
        self._identity_resolver = get_identity(config=raw_config)
        self._settings = build_agent_settings(raw_config, self._identity_resolver.device_id)

        s = self._settings  # shorthand

        # Encrypted offline queue
        self._queue = create_event_queue(
            encrypted=True,
            api_key=s.api_key,
            device_id=s.device_id,
        )

        # C5: DNS resolver owns both LRU cache and OS DNS cache query
        if s.doh_enabled:
            try:
                from doh_resolver import create_doh_resolver
                self._dns_resolver = create_doh_resolver()
                logger.info("DNS-over-HTTPS resolver active (Cloudflare primary)")
            except Exception as e:
                logger.warning(f"DoH resolver init failed, falling back to system DNS: {e}")
                self._dns_resolver = create_resolver()
        else:
            self._dns_resolver = create_resolver()

        self._process_resolver = create_process_resolver()
        self._detector = create_detector(
            5, process_resolver=self._process_resolver,
            dedup_window=s.deduplication_window,
        )

        # C3: Registry with unified lookup() interface
        self._registry = create_registry(update_url=s.registry_update_url)
        self._registry.warm_cache()  # renamed from preload_dns — explicit, not in __init__

        self._deduplicator = create_deduplicator(s.deduplication_window)
        self._event_builder = create_event_builder(
            self._identity_resolver.identity,
            s.device_id,
            s.org_id,
        )

        # C2: Typed settings injected into Reporter and HeartbeatSender
        reporter_settings = ReporterSettings(
            supabase_url=s.supabase_url,
            supabase_key=s.supabase_key,
        )
        self._reporter = SupabaseReporter.from_settings(reporter_settings, queue=self._queue)

        heartbeat_settings = HeartbeatSettings(
            device_id=s.device_id,
            org_id=s.org_id,
            user_email=self._identity_resolver.user_email,
            agent_version=s.agent_version,
            supabase_url=s.supabase_url,
            supabase_key=s.supabase_key,
        )
        self._heartbeat = HeartbeatSender.from_settings(heartbeat_settings, queue=self._queue)

        self._frequency_tracker = FrequencyTracker()
        self._liveness_monitor = LivenessMonitor(
            poll_interval=s.poll_interval,
            version=s.agent_version,
        )
        self._tamper_guard = TamperGuard()

        firewall_settings = FirewallSettings(
            supabase_url=s.supabase_url,
            supabase_key=s.supabase_key,
            org_id=s.org_id,
        )
        self._firewall_monitor = create_firewall_monitor(
            supabase_url=firewall_settings.supabase_url,
            supabase_key=firewall_settings.supabase_key,
            org_id=firewall_settings.org_id,
        )
        self._sensitivity_monitor = create_sensitivity_monitor()

        self._config_poller: Optional[ConfigPoller] = None
        if s.config_endpoint:
            self._config_poller = ConfigPoller(raw_config, s.device_id)

        self._running = False
        self._shutdown_event = asyncio.Event()
        self._setup_signal_handlers()

    def _setup_signal_handlers(self) -> None:
        if sys.platform != "win32":
            signal.signal(signal.SIGTERM, self._handle_shutdown)
            signal.signal(signal.SIGINT, self._handle_shutdown)

    def _handle_shutdown(self, signum, frame) -> None:
        logger.info(f"Received signal {signum}, initiating graceful shutdown...")
        self._running = False
        self._shutdown_event.set()

    # ── C1: _process_connection decomposed into named single-concern methods ──

    def _classify_connection(self, remote_ip: str) -> "Optional[RegistryEntry]":
        """Resolve a remote IP to a registry entry via 3-phase DNS waterfall.

        Phase 0 (Windows OS DNS cache) wins over Phase 1 (IP map) because it
        tells us which domain the user's browser actually resolved — critical
        for CDN disambiguation (multiple tools sharing the same Cloudflare IP).
        """
        from registry import LookupHint

        # Phase 0: Windows OS DNS client cache — most accurate for browser traffic
        os_hostname = self._dns_resolver.query_os_cache(remote_ip)
        if os_hostname:
            match = self._registry.lookup(LookupHint(hostname=os_hostname))
            if match.is_match:
                logger.debug(f"OS cache match: {remote_ip} → {os_hostname} → {match.entry.tool_name}")
                return match.entry

        # Phase 1: Preloaded IP map — fast, dedicated IPs only
        match = self._registry.lookup(LookupHint(ip=remote_ip))
        if match.is_match:
            return match.entry

        # Phase 2: Reverse DNS — slow, last resort (C4: Result type surfaces errors)
        rev_result = self._dns_resolver.reverse_lookup_result(remote_ip)
        if rev_result.is_ok:
            match = self._registry.lookup(LookupHint(hostname=rev_result.value))
            if match.is_match:
                return match.entry
        elif rev_result.is_err():
            logger.debug(f"Reverse DNS failed for {remote_ip}: {rev_result.reason}")

        return None

    def _attribute_process(self, connection: dict, pid: Optional[int]) -> Tuple[str, str]:
        """Resolve process name and path from connection dict, falling back to PID lookup."""
        process_name = connection.get("process_name", "unknown")
        process_path = connection.get("process_path", "")
        if not process_name or process_name == "unknown":
            if pid:
                info = self._detector.get_process_info(pid)
                process_name = info.get("process_name", "unknown")
                process_path = info.get("process_path", "")
        return process_name or "unknown", process_path or ""

    def _read_io_counters(self, pid: Optional[int]) -> Tuple[Optional[int], Optional[int]]:
        """Read process I/O byte counters. Returns (bytes_read, bytes_write)."""
        if not pid:
            return None, None
        try:
            info = self._process_resolver.resolve_with_io(pid)
            return info.bytes_read, info.bytes_write
        except Exception:
            return None, None

    def _enforce_block(self, pid: int, domain: str) -> None:
        """Terminate a process that violated a firewall block rule."""
        try:
            import psutil
            psutil.Process(pid).terminate()
            logger.warning(f"BLOCKED AND TERMINATED: Process {pid} connecting to {domain}")
        except Exception as e:
            logger.error(f"Failed to terminate blocked process {pid}: {e}")

    async def _process_connection(self, connection: dict) -> None:
        """Process a single detected connection — thin pipeline over named helpers."""
        remote_ip = connection.get("remote_addr")
        pid = connection.get("pid")
        if not remote_ip:
            return

        # Step 1: Identify the tool (C1: extracted, C3: uses Registry.lookup)
        entry = self._classify_connection(remote_ip)
        if not entry:
            logger.debug(f"No registry match for IP {remote_ip}")
            return

        # Step 2: Attribute the process (C1: extracted)
        process_name, process_path = self._attribute_process(connection, pid)

        # Step 3: Deduplicate by tool + process name (not PID — browsers spawn per tab)
        dedup_key = process_name if process_name != "unknown" else str(pid)
        if not self._deduplicator.should_report(entry.tool_name, dedup_key):
            return

        # Step 4: Gather analytics signals (C1: extracted helpers)
        bytes_read, bytes_write = self._read_io_counters(pid)
        is_blocked = self._firewall_monitor.is_blocked(entry.domain)
        sensitivity_score = self._sensitivity_monitor.get_current_score()
        freq_result = self._frequency_tracker.record(entry.domain)

        # Step 5: Enforce firewall block
        if is_blocked and pid:
            self._enforce_block(pid, entry.domain)

        # Step 6: Build and report event
        event = self._event_builder.build_event(
            tool_name=entry.tool_name,
            domain=entry.domain,
            category=entry.category,
            vendor=entry.vendor,
            risk_level=entry.risk_level,
            process_name=process_name,
            process_path=process_path,
            is_approved=entry.enterprise_flag,
            is_blocked=is_blocked,
            sensitivity_score=sensitivity_score,
            connection_frequency=freq_result.count_5min,
            high_frequency=freq_result.high_frequency,
            bytes_read=bytes_read,
            bytes_write=bytes_write,
        )
        self._heartbeat.update_last_detection(datetime.now(timezone.utc))

        success = await self._reporter.report_event(event)
        if success:
            logger.info(f"Reported: {entry.tool_name} from {process_name}")
        else:
            logger.warning(f"Failed to report: {entry.tool_name}, queued for retry")

    # ── Lifecycle helpers ──

    async def _check_registry_updates(self) -> None:
        if self._settings.registry_update_url:
            try:
                await self._registry.check_for_updates()
            except Exception as e:
                logger.warning(f"Registry update check failed: {e}")

    async def _check_remote_config(self) -> None:
        poller = self._config_poller
        if poller and poller.should_poll():
            try:
                await poller.fetch_config()
            except Exception as e:
                logger.warning(f"Remote config poll failed: {e}")

    async def _flush_queue(self) -> None:
        if self._queue.get_queue_depth() > 0:
            logger.info(f"Flushing {self._queue.get_queue_depth()} queued events")
            try:
                await self._reporter.flush_queue()
            except Exception as e:
                logger.warning(f"Queue flush failed: {e}")

    async def _send_tamper_alert(self, result) -> None:
        logger.warning(f"Tamper alert would be sent to backend: {result.message}")

    async def _send_gap_event(self, gap) -> None:
        logger.info(f"Agent gap detected: {gap.gap_seconds:.1f}s gap")

    async def _detection_loop(self) -> None:
        heartbeat_counter = 0
        config_check_counter = 0
        s = self._settings

        logger.info(f"Starting detection loop (interval: {s.poll_interval}s)")

        while self._running:
            try:
                config_check_counter += 1
                if config_check_counter >= 10:
                    await self._check_remote_config()
                    config_check_counter = 0

                heartbeat_counter += 1
                if heartbeat_counter >= 10:
                    try:
                        await self._heartbeat.send_heartbeat()
                    except Exception as e:
                        logger.warning(f"Heartbeat failed: {e}")
                    heartbeat_counter = 0
                    await self._flush_queue()

                connections = self._detector.run_detection_cycle()
                logger.debug(f"Found {len(connections)} new connections")

                for connection in connections:
                    await self._process_connection(connection)

                self._deduplicator.cleanup_old_entries()
                self._liveness_monitor.write_liveness()

            except Exception as e:
                logger.error(f"Error in detection loop: {e}")

            try:
                await asyncio.wait_for(self._shutdown_event.wait(), timeout=5.0)
                break
            except asyncio.TimeoutError:
                continue

    async def run(self) -> None:
        logger.info("Devise Desktop Agent starting...")
        s = self._settings

        poller = self._config_poller
        if poller:
            await poller.start()

        self._firewall_monitor.start()
        self._sensitivity_monitor.start()

        gap = self._liveness_monitor.check_gap()
        if gap:
            logger.warning(
                f"Liveness gap detected: {gap.gap_seconds:.1f}s (suspicious={gap.suspicious})"
            )
            asyncio.ensure_future(self._send_gap_event(gap))

        tamper_result = self._tamper_guard.check_integrity()
        if not tamper_result.ok:
            logger.error(f"Tamper check failed: {tamper_result.message}")
            asyncio.ensure_future(self._send_tamper_alert(tamper_result))

        await self._check_registry_updates()

        logger.info(f"Registry loaded with {self._registry.entry_count} entries")
        logger.info(f"Identity: {self._identity_resolver.user_email}")
        logger.info(f"Device: {s.device_id}")
        logger.info(f"Queue depth: {self._queue.get_queue_depth()}")
        logger.info(f"DoH enabled: {s.doh_enabled}")

        try:
            await self._heartbeat.send_heartbeat()
        except Exception as e:
            logger.warning(f"Initial heartbeat failed: {e}")

        self._running = True

        try:
            await self._detection_loop()
        finally:
            await self._flush_queue()
            await self._reporter.close()

            poller = self._config_poller
            if poller:
                await poller.stop()

            self._firewall_monitor.stop()
            self._sensitivity_monitor.stop()
            logger.info("Devise Desktop Agent stopped")

    def start(self) -> None:
        try:
            asyncio.run(self.run())
        except KeyboardInterrupt:
            logger.info("Agent interrupted by user")
        except Exception as e:
            logger.error(f"Agent error: {e}")
            sys.exit(1)


def main():
    config_path = os.environ.get("DEVISE_CONFIG_PATH") or None
    agent = DeviseAgent(config_path)
    agent.start()


if __name__ == "__main__":
    main()
