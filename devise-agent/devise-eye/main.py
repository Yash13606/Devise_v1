"""Devise Desktop Agent - Main Entry Point."""

import asyncio
import signal
import sys
import logging
import os
import time
import subprocess
from pathlib import Path
from typing import Optional, Dict, Any
from datetime import datetime

# Add parent devise-agent dir to path so prompt_injection_detector is importable
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class DeviseAgent:
    """Main Devise Desktop Agent application."""

    def __init__(self, config_path: Optional[str] = None):
        """Initialize the agent.

        Args:
            config_path: Optional config file path
        """
        from config import get_config, ConfigPoller
        from identity import get_identity
        from detector import create_detector
        from process_resolver import create_process_resolver
        from dns_resolver import create_resolver
        from registry import create_registry
        from deduplicator import create_deduplicator
        from event_builder import create_event_builder
        from reporter import create_reporter
        from event_queue import create_event_queue
        from heartbeat import create_heartbeat_sender
        from frequency_tracker import FrequencyTracker
        from liveness_monitor import LivenessMonitor
        from tamper_guard import TamperGuard
        from firewall_monitor import create_firewall_monitor
        from sensitivity_monitor import create_sensitivity_monitor
        from process_context import create_process_context_resolver

        # Load configuration
        self._config = get_config(config_path)

        # Initialize components
        self._identity_resolver = get_identity(config_path)

        # Initialize process resolver for FR-06, FR-07, FR-11
        self._process_resolver = create_process_resolver()

        # Initialize queue for FR-18 (offline buffering)
        # Pass api_key + device_id for encrypted queue key derivation
        _api_key = self._config.api_key or "dev-api-key"
        _device_id = self._config.device_id or self._identity_resolver.device_id
        _org_id = self._config.org_id or "local-org"
        self._queue = create_event_queue(
            encrypted=True,
            api_key=_api_key,
            device_id=_device_id,
        )

        # Initialize DNS resolver — DoH if enabled (FR-09), else system DNS
        if self._config.doh_enabled:
            try:
                from doh_resolver import create_doh_resolver

                self._dns_resolver = create_doh_resolver()
                logger.info("DNS-over-HTTPS resolver active (Cloudflare primary)")
            except Exception as e:
                logger.warning(
                    f"DoH resolver init failed, falling back to system DNS: {e}"
                )
                self._dns_resolver = create_resolver()
        else:
            self._dns_resolver = create_resolver()

        # Initialize detector with process resolver
        self._detector = create_detector(
            5, process_resolver=self._process_resolver,
            dedup_window=self._config.deduplication_window
        )
        self._registry = create_registry(update_url=self._config.registry_update_url)
        self._registry.preload_dns()
        
        self._deduplicator = create_deduplicator(self._config.deduplication_window)
        self._event_builder = create_event_builder(
            self._identity_resolver.identity,
            _device_id,
            _org_id
        )

        # Initialize reporter with queue for FR-17 (retry logic)
        self._reporter = create_reporter(
            supabase_url=self._config.supabase_url or "http://localhost:8000",
            supabase_key=self._config.supabase_key or "dummy-key",
            queue=self._queue,
        )

        # Initialize heartbeat for FR-20
        self._heartbeat = create_heartbeat_sender(
            device_id=self._identity_resolver.device_id,
            org_id=_org_id,
            user_email=self._identity_resolver.user_email,
            agent_version=self._config.agent_version,
            supabase_url=self._config.supabase_url or "http://localhost:8000",
            supabase_key=self._config.supabase_key or "dummy-key",
            queue=self._queue,
        )

        # Phase 3: Advanced modules
        self._frequency_tracker = FrequencyTracker()
        self._liveness_monitor = LivenessMonitor(
            poll_interval=self._config.poll_interval,
            version=self._config.agent_version,
        )
        self._tamper_guard = TamperGuard()
        
        # Initialize Phase 2 Advanced Features
        self._firewall_monitor = create_firewall_monitor(
            supabase_url=self._config.supabase_url or "http://localhost:8000",
            supabase_key=self._config.supabase_key or "dummy-key",
            org_id=_org_id,
        )
        self._sensitivity_monitor = create_sensitivity_monitor()

        # Process context resolver for VS Code extension attribution
        self._process_context_resolver = create_process_context_resolver()

        # Short-lived Windows DNS cache result (5s window to avoid per-connection
        # PowerShell subprocess spawns on every psutil detection cycle)
        self._dns_cache_snapshot: Dict[str, str] = {}
        self._dns_cache_snapshot_ts: float = 0.0
        self._dns_cache_snapshot_ttl: float = 5.0

        # Initialize config poller for FR-30 (remote config)
        self._config_poller: Optional[ConfigPoller] = None
        if self._config.remote_config_enabled:
            self._config_poller = ConfigPoller(
                self._config,
                self._identity_resolver.device_id,
            )

        self._running = False
        self._shutdown_event = asyncio.Event()

        # Setup signal handlers
        self._setup_signal_handlers()

    def _setup_signal_handlers(self) -> None:
        """Setup graceful shutdown signal handlers."""
        if sys.platform != "win32":
            signal.signal(signal.SIGTERM, self._handle_shutdown)
            signal.signal(signal.SIGINT, self._handle_shutdown)

    def _handle_shutdown(self, signum, frame) -> None:
        """Handle shutdown signals."""
        logger.info(f"Received signal {signum}, initiating graceful shutdown...")
        self._running = False
        self._shutdown_event.set()

    async def _check_registry_updates(self) -> None:
        """Check for registry updates on startup."""
        if self._config.registry_update_url:
            try:
                await self._registry.check_for_updates()
            except Exception as e:
                logger.warning(f"Registry update check failed: {e}")

    async def _check_remote_config(self) -> None:
        """Check for remote config updates."""
        poller = self._config_poller
        if poller and poller.should_poll():
            try:
                await poller.fetch_config()
            except Exception as e:
                logger.warning(f"Remote config poll failed: {e}")

    async def _flush_queue(self) -> None:
        """Flush queued events to backend."""
        if self._queue.get_queue_depth() > 0:
            logger.info(f"Flushing {self._queue.get_queue_depth()} queued events")
            try:
                await self._reporter.flush_queue()
            except Exception as e:
                logger.warning(f"Queue flush failed: {e}")

    async def _send_tamper_alert(self, result) -> None:
        """Send tamper detection alert to backend (fire-and-forget)."""
        logger.warning(f"Tamper alert would be sent to backend: {result.message}")
        # Disable legacy HTTP post to missing tamper-alert API for Supabase
        pass

    async def _send_gap_event(self, gap) -> None:
        """Send agent gap event to backend."""
        logger.info(f"Agent gap detected: {gap.gap_seconds:.1f}s gap")
        # Disable legacy HTTP post to missing event API for Supabase
        pass

    def _refresh_dns_cache_snapshot(self) -> None:
        """Refresh the Windows DNS client cache snapshot (at most every 5 s).

        Spawning PowerShell per connection is expensive. Instead we batch-fetch
        the entire DNS cache once and serve lookups from the in-memory dict for
        up to _dns_cache_snapshot_ttl seconds.
        """
        if sys.platform != "win32":
            return
        now = time.monotonic()
        if now - self._dns_cache_snapshot_ts < self._dns_cache_snapshot_ttl:
            return
        try:
            import subprocess
            result = subprocess.run(
                [
                    "powershell", "-NoProfile", "-Command",
                    "Get-DnsClientCache | Select-Object Entry, Data "
                    "| ConvertTo-Csv -NoTypeInformation",
                ],
                capture_output=True,
                text=True,
                timeout=3,
                creationflags=subprocess.CREATE_NO_WINDOW,
            )
            snapshot: Dict[str, str] = {}
            lines = result.stdout.strip().splitlines()
            for line in lines[1:]:  # skip CSV header
                parts = line.strip().strip('"').split('","')
                if len(parts) == 2:
                    hostname, ip = parts[0], parts[1]
                    if hostname and ip:
                        snapshot[ip] = hostname
            self._dns_cache_snapshot = snapshot
            self._dns_cache_snapshot_ts = now
        except Exception as e:
            logger.debug(f"DNS cache snapshot refresh failed: {e}")

    def _get_hostname_from_dns_cache(self, ip: str) -> Optional[str]:
        """Return hostname from the batched Windows DNS cache snapshot."""
        if sys.platform != "win32":
            return None
        return self._dns_cache_snapshot.get(ip)

    async def _process_connection(self, connection: dict) -> None:
        """Process a single connection.

        Args:
            connection: Connection dict from detector
        """
        remote_ip = connection.get("remote_addr")
        pid = connection.get("pid")

        if not remote_ip:
            return

        # ── Prompt-injection guard ────────────────────────────────────────────
        # Screen any process_name / metadata text that will be forwarded to an
        # LLM before it reaches the registry or reporter pipeline.
        _proc_text = connection.get("process_name", "") or ""
        if _proc_text:
            try:
                from prompt_injection_detector import detect_prompt_injection
                _guard = detect_prompt_injection(_proc_text)
                if _guard.get("injected"):
                    logger.warning(
                        f"Prompt injection detected in connection metadata "
                        f"(ip={remote_ip}, pid={pid}): {_guard.get('description')}"
                    )
                    return  # Drop the connection — do not process further
            except Exception as _guard_err:
                logger.debug(f"Injection guard skipped: {_guard_err}")
        # ─────────────────────────────────────────────────────────────────────

        # Resolve rich process context early — needed for CDN fallback phase
        process_name = connection.get("process_name", "unknown")
        process_path = connection.get("process_path", "")
        if (not process_name or process_name == "unknown") and pid:
            proc_info = self._detector.get_process_info(pid)
            process_name = proc_info.get("process_name", "unknown")
            process_path = proc_info.get("process_path", "")

        if pid:
            ctx = self._process_context_resolver.resolve(pid, process_name)
            # Use the narrowed tool hint (e.g. "cursor.exe" for a Cursor fork of Code)
            if ctx.tool_hint:
                process_name = ctx.tool_hint
            if ctx.exe_path and not process_path:
                process_path = ctx.exe_path

        from registry import MatchResult
        match: Optional[MatchResult] = None

        # Phase 0: Windows DNS cache snapshot (batch refresh every 5 s)
        self._refresh_dns_cache_snapshot()
        cached_hostname = self._get_hostname_from_dns_cache(remote_ip)
        if cached_hostname:
            match = self._registry.find_match_with_confidence(cached_hostname, process_name)
            if match:
                logger.debug(
                    f"DNS-cache match: {remote_ip} → {cached_hostname} → "
                    f"{match.entry.tool_name} (conf={match.confidence})"
                )

        # Phase 1: Pre-resolved unambiguous IP map (skips CDN IPs automatically)
        if not match:
            entry = self._registry.find_match_by_ip(remote_ip)
            if entry:
                confidence = 100 if entry.process_matches_hint(process_name) else 80
                match = MatchResult(entry, confidence)

        # Phase 2: Reverse DNS (skip if this IP is a known CDN range)
        if not match:
            if self._registry.is_cdn_ip(remote_ip):
                # CDN IP — reverse DNS won't help; try process-hint fallback
                match = self._registry.find_by_process_hint(process_name)
                if match:
                    logger.debug(
                        f"CDN IP {remote_ip} attributed to {match.entry.tool_name} "
                        f"via process hint '{process_name}' (conf={match.confidence})"
                    )
            else:
                hostname = self._dns_resolver.reverse_lookup(remote_ip)
                if hostname:
                    match = self._registry.find_match_with_confidence(hostname, process_name)

        if not match:
            logger.debug(f"No registry match for IP {remote_ip} (process={process_name})")
            return

        entry = match.entry
        confidence = match.confidence

        # Deduplicate by tool + process NAME (not PID).
        dedup_process = process_name if process_name and process_name != "unknown" else str(pid)
        if not self._deduplicator.should_report(entry.tool_name, dedup_process):
            return

        # Get I/O counters (FR-11)
        bytes_read = None
        bytes_write = None
        if pid:
            try:
                proc_info = self._process_resolver.resolve_with_io(pid)
                bytes_read = proc_info.bytes_read
                bytes_write = proc_info.bytes_write
            except Exception:
                pass

        # Check local firewall policy
        is_blocked = self._firewall_monitor.is_blocked(entry.domain)

        # ACTIVE INTERCEPTION (FR-15): Terminate process if firewall rule blocks it
        if is_blocked and pid:
            try:
                import psutil
                psutil.Process(pid).terminate()
                logger.warning(
                    f"BLOCKED AND TERMINATED: Process {pid} connecting to {entry.domain}"
                )
                
                # Coaching Notification
                msg = f"Devise Policy Block: {entry.tool_name} is not approved."
                if hasattr(entry, 'suggested_alternative') and entry.suggested_alternative:
                    msg += f" Please use {entry.suggested_alternative} instead."
                
                try:
                    subprocess.run(["notify-send", "AI Security Alert", msg, "-u", "critical"], timeout=2)
                except Exception:
                    pass
            except Exception as e:
                logger.error(f"Failed to terminate blocked process {pid}: {e}")

        # Get context sensitivity details
        sensitivity_context = self._sensitivity_monitor.get_context_summary()
        sensitivity_score = sensitivity_context.get("score", 0)
        data_type = sensitivity_context.get("data_type", "clean")
        sensitivity_flag = sensitivity_context.get("sensitivity_flag")

        # Track connection frequency (FR-10)
        freq_result = self._frequency_tracker.record(entry.domain)

        # Build event with confidence score + smart event_type
        event = self._event_builder.build_event(
            tool_name=entry.tool_name,
            domain=entry.domain,
            category=entry.category,
            vendor=entry.vendor,
            risk_level=entry.risk_level,
            process_name=process_name or "unknown",
            process_path=process_path or "",
            is_approved=entry.enterprise_flag,
            is_blocked=is_blocked,
            sensitivity_score=sensitivity_score,
            connection_frequency=freq_result.count_5min,
            high_frequency=freq_result.high_frequency,
            bytes_read=bytes_read,
            bytes_write=bytes_write,
            confidence=confidence,
            data_type=data_type,
            sensitivity_flag=sensitivity_flag,
        )

        # Update heartbeat with last detection time (FR-20)
        from datetime import timezone
        self._heartbeat.update_last_detection(datetime.now(timezone.utc))

        # Report event (with retry logic - FR-17)
        success = await self._reporter.report_event(event)

        if success:
            logger.info(
                f"Reported: {entry.tool_name} from {process_name} "
                f"(conf={confidence}, type={event['event_type']})"
            )
        else:
            logger.warning(f"Failed to report: {entry.tool_name}, queued for retry")

    async def _detection_loop(self) -> None:
        """Main detection loop - runs every poll_interval seconds."""
        heartbeat_counter = 0
        config_check_counter = 0

        logger.info(
            f"Starting detection loop (interval: {self._config.poll_interval}s)"
        )

        while self._running:
            try:
                # Check remote config periodically (every ~5 minutes)
                config_check_counter += 1
                if config_check_counter >= 10:  # Every ~5 minutes
                    await self._check_remote_config()
                    config_check_counter = 0

                # Send heartbeat periodically (every ~5 minutes)
                heartbeat_counter += 1
                if heartbeat_counter >= 10:  # Every ~5 minutes (10 * 30s)
                    try:
                        await self._heartbeat.send_heartbeat()
                    except Exception as e:
                        logger.warning(f"Heartbeat failed: {e}")
                    heartbeat_counter = 0

                    # Also try to flush queue on heartbeat
                    await self._flush_queue()

                # Get new connections
                connections = self._detector.run_detection_cycle()

                logger.debug(f"Found {len(connections)} new connections")

                # Process each connection
                for connection in connections:
                    await self._process_connection(connection)

                # Cleanup old deduplication entries
                self._deduplicator.cleanup_old_entries()

                # Evict stale process context cache entries every ~5 minutes
                if heartbeat_counter == 0:
                    self._process_context_resolver.clear_cache()

                # Write liveness heartbeat (FR-29)
                self._liveness_monitor.write_liveness()

            except Exception as e:
                logger.error(f"Error in detection loop: {e}")

            # Wait for next cycle or shutdown
            try:
                await asyncio.wait_for(
                    self._shutdown_event.wait(), timeout=5.0
                )
                # Shutdown was requested
                break
            except asyncio.TimeoutError:
                # Normal timeout - continue loop
                continue

    async def run(self) -> None:
        """Run the agent."""
        logger.info("Devise Desktop Agent starting...")

        # Start config poller
        poller = self._config_poller
        if poller:
            await poller.start()
            
        # Start Phase 2 background monitors
        self._firewall_monitor.start()
        self._sensitivity_monitor.start()

        # Phase 3: Check for liveness gap (FR-29) — detect unexpected kill/suspend
        gap = self._liveness_monitor.check_gap()
        if gap:
            logger.warning(
                f"Liveness gap detected: {gap.gap_seconds:.1f}s "
                f"(suspicious={gap.suspicious})"
            )
            # Fire-and-forget gap event (don't block startup)
            asyncio.ensure_future(self._send_gap_event(gap))

        # Phase 3: Check binary integrity (FR-28)
        tamper_result = self._tamper_guard.check_integrity()
        if not tamper_result.ok:
            logger.error(f"Tamper check failed: {tamper_result.message}")
            # Fire-and-forget tamper alert (don't block startup)
            asyncio.ensure_future(self._send_tamper_alert(tamper_result))

        # Check for registry updates
        await self._check_registry_updates()

        logger.info(f"Registry loaded with {self._registry.entry_count} entries")
        logger.info(f"Identity: {self._identity_resolver.user_email}")
        logger.info(f"Device: {self._identity_resolver.device_id}")
        logger.info(f"Queue depth: {self._queue.get_queue_depth()}")
        logger.info(f"DoH enabled: {self._config.doh_enabled}")

        # Send initial heartbeat
        try:
            await self._heartbeat.send_heartbeat()
        except Exception as e:
            logger.warning(f"Initial heartbeat failed: {e}")

        self._running = True

        try:
            await self._detection_loop()
        finally:
            # Final flush on shutdown
            await self._flush_queue()
            await self._reporter.close()

            # Stop config poller
            poller = self._config_poller
            if poller:
                await poller.stop()
                
            # Stop Phase 2 background monitors
            self._firewall_monitor.stop()
            self._sensitivity_monitor.stop()

            logger.info("Devise Desktop Agent stopped")

    def start(self) -> None:
        """Start the agent (sync wrapper)."""
        try:
            asyncio.run(self.run())
        except KeyboardInterrupt:
            logger.info("Agent interrupted by user")
        except Exception as e:
            logger.error(f"Agent error: {e}")
            sys.exit(1)


def main():
    """Main entry point."""
    # Determine config path
    config_path = os.environ.get("DEVISE_CONFIG_PATH") or None

    agent = DeviseAgent(config_path)
    agent.start()


if __name__ == "__main__":
    main()
