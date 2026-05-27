"""AI Tools Registry module for Devise Desktop Agent."""

import ipaddress
import json
import logging
import os
import socket
from typing import List, Dict, Optional, Any, Set
from pathlib import Path
import httpx


logger = logging.getLogger(__name__)

_CDN_RANGES_FILE = Path(__file__).parent / "data" / "cdn_ip_ranges.json"


class RegistryEntry:
    """Represents a single AI tool in the registry."""

    def __init__(self, data: Dict[str, Any]):
        self.domain = data.get("domain", "")
        self.tool_name = data.get("tool_name", "")
        self.category = data.get("category", "unknown")
        self.vendor = data.get("vendor", "unknown")
        self.risk_level = data.get("risk_level", "medium")
        self.enterprise_flag = data.get("enterprise_flag", False)
        self.api_domain_flag = data.get("api_domain_flag", False)
        self.cost_per_seat = data.get("cost_per_seat")
        self.suggested_alternative = data.get("suggested_alternative")
        # process_hints: list of process names that strongly indicate this tool
        self.process_hints: List[str] = [
            h.lower() for h in data.get("process_hints", [])
        ]

    def matches(self, hostname: str) -> bool:
        """Check if hostname matches this entry (exact or subdomain suffix)."""
        if not hostname or not self.domain:
            return False
        hostname_lower = hostname.lower()
        domain_lower = self.domain.lower()
        return hostname_lower == domain_lower or hostname_lower.endswith(
            "." + domain_lower
        )

    def process_matches_hint(self, process_name: str) -> bool:
        """Return True if process_name is in this entry's process_hints."""
        if not self.process_hints or not process_name:
            return False
        return process_name.lower() in self.process_hints

    def to_dict(self) -> Dict[str, Any]:
        return {
            "domain": self.domain,
            "tool_name": self.tool_name,
            "category": self.category,
            "vendor": self.vendor,
            "risk_level": self.risk_level,
            "enterprise_flag": self.enterprise_flag,
            "api_domain_flag": self.api_domain_flag,
            "process_hints": self.process_hints,
        }


class MatchResult:
    """Result of a registry lookup with confidence score."""

    __slots__ = ("entry", "confidence")

    def __init__(self, entry: RegistryEntry, confidence: int):
        self.entry = entry
        # 0-100: 100 = hostname + process hint both matched
        # 80  = hostname matched, no process hint on entry
        # 60  = process hint only (CDN IP, no hostname resolution)
        self.confidence = confidence


class Registry:
    """AI Tools Registry with O(1) domain lookup and CDN IP detection."""

    def __init__(
        self, registry_path: Optional[str] = None, update_url: Optional[str] = None
    ):
        self._entries: List[RegistryEntry] = []
        self._update_url = update_url
        self._ip_to_entry: Dict[str, RegistryEntry] = {}
        # O(1) domain index: normalized domain -> entry (first registered wins)
        self._domain_index: Dict[str, RegistryEntry] = {}
        # CDN networks for fast IP classification
        self._cdn_networks: List[ipaddress.IPv4Network] = []
        self._load_cdn_ranges()
        self._load_registry(registry_path)

    # ------------------------------------------------------------------
    # CDN detection
    # ------------------------------------------------------------------

    def _load_cdn_ranges(self) -> None:
        """Load CDN CIDR ranges from cdn_ip_ranges.json."""
        try:
            with open(_CDN_RANGES_FILE) as f:
                data = json.load(f)
            for entry in data.get("ranges", []):
                cidr = entry.get("cidr", "")
                if cidr:
                    try:
                        self._cdn_networks.append(
                            ipaddress.IPv4Network(cidr, strict=False)
                        )
                    except ValueError:
                        pass
            logger.debug(f"Loaded {len(self._cdn_networks)} CDN CIDR ranges")
        except Exception as e:
            logger.warning(f"Could not load CDN ranges: {e}")

    def is_cdn_ip(self, ip: str) -> bool:
        """Return True if ip falls within a known shared CDN range."""
        try:
            addr = ipaddress.IPv4Address(ip)
            return any(addr in net for net in self._cdn_networks)
        except ValueError:
            return False

    # ------------------------------------------------------------------
    # Loading and indexing
    # ------------------------------------------------------------------

    def _load_registry(self, registry_path: Optional[str]) -> None:
        if registry_path is None:
            registry_path = str(
                Path(__file__).parent / "data" / "ai_tools_registry.json"
            )

        if not os.path.exists(registry_path):
            logger.warning(f"Registry file not found: {registry_path}")
            return

        try:
            with open(registry_path, "r") as f:
                data = json.load(f)

            tools = data.get("tools", [])
            self._entries = [RegistryEntry(t) for t in tools]
            self._build_domain_index()
            logger.info(
                f"Loaded {len(self._entries)} entries from registry "
                f"(version {data.get('version', 'unknown')})"
            )
        except (json.JSONDecodeError, IOError) as e:
            logger.error(f"Failed to load registry: {e}")

    def _build_domain_index(self) -> None:
        """Build O(1) lookup dict from domain -> entry."""
        self._domain_index = {}
        for entry in self._entries:
            d = entry.domain.lower()
            if d not in self._domain_index:
                self._domain_index[d] = entry
            # Also index without leading www.
            if d.startswith("www."):
                bare = d[4:]
                if bare not in self._domain_index:
                    self._domain_index[bare] = entry

    # ------------------------------------------------------------------
    # DNS pre-resolution
    # ------------------------------------------------------------------

    def preload_dns(self) -> None:
        """Resolve all registry domains to IPs at startup.

        IPs claimed by more than one tool (shared CDN) OR that fall within
        a known CDN range are excluded from the IP map.
        """
        ip_claimants: Dict[str, List[RegistryEntry]] = {}

        for entry in self._entries:
            try:
                results = socket.getaddrinfo(entry.domain, None)
                for r in results:
                    ip = r[4][0]
                    ip_claimants.setdefault(ip, []).append(entry)
            except Exception:
                pass

        cdn_skipped = 0
        ambiguous = 0
        for ip, entries in ip_claimants.items():
            if self.is_cdn_ip(ip):
                cdn_skipped += 1
                continue
            if len(entries) == 1:
                self._ip_to_entry[ip] = entries[0]
            else:
                ambiguous += 1

        logger.info(
            f"Pre-resolved {len(self._ip_to_entry)} unambiguous IPs "
            f"({cdn_skipped} CDN IPs skipped, {ambiguous} shared IPs excluded)"
        )

    # ------------------------------------------------------------------
    # Lookups
    # ------------------------------------------------------------------

    def find_match_by_ip(self, ip: str) -> Optional[RegistryEntry]:
        """Direct IP lookup for non-CDN dedicated IPs."""
        return self._ip_to_entry.get(ip)

    def find_match(self, hostname: str) -> Optional[RegistryEntry]:
        """Find registry entry matching hostname (O(1) dict first, suffix fallback).

        Args:
            hostname: Hostname to match (e.g. "api2.cursor.sh")

        Returns:
            Best matching RegistryEntry or None
        """
        if not hostname:
            return None

        hn = hostname.lower().rstrip(".")

        # 1. Exact match in index
        entry = self._domain_index.get(hn)
        if entry:
            return entry

        # 2. Strip subdomains one level at a time and check index
        parts = hn.split(".")
        for i in range(1, len(parts) - 1):
            candidate = ".".join(parts[i:])
            entry = self._domain_index.get(candidate)
            if entry:
                return entry

        # 3. Fallback: linear suffix scan for any entries with wildcards
        for entry in self._entries:
            if entry.matches(hn):
                return entry

        return None

    def find_match_with_confidence(
        self, hostname: Optional[str], process_name: Optional[str]
    ) -> Optional[MatchResult]:
        """Find best match and compute a confidence score (0-100).

        Confidence scoring:
        - 100: hostname matched AND process_name matched a process_hint
        - 80:  hostname matched, no process hints defined for this entry
        - 70:  hostname matched but process_name is a generic browser/shell
        - 0:   no match

        Args:
            hostname: Resolved hostname or None
            process_name: Process name (e.g. "cursor.exe") or None

        Returns:
            MatchResult or None
        """
        entry = self.find_match(hostname) if hostname else None
        if entry is None:
            return None

        if entry.process_hints:
            if process_name and entry.process_matches_hint(process_name):
                confidence = 100
            else:
                confidence = 70
        else:
            confidence = 80

        return MatchResult(entry, confidence)

    def find_by_process_hint(self, process_name: str) -> Optional[MatchResult]:
        """Find entry matching purely by process name hint (CDN fallback).

        Used when reverse DNS fails and the IP is a known CDN range. Returns
        the first entry whose process_hints match the given process name.
        Confidence is 60 (lower because no hostname confirmed it).

        Args:
            process_name: Raw process name from psutil

        Returns:
            MatchResult with confidence=60 or None
        """
        if not process_name:
            return None
        pn = process_name.lower()
        for entry in self._entries:
            if pn in entry.process_hints:
                return MatchResult(entry, 60)
        return None

    # ------------------------------------------------------------------
    # Registry management
    # ------------------------------------------------------------------

    async def check_for_updates(self) -> bool:
        """Check for registry updates from backend."""
        if not self._update_url:
            return False

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(self._update_url)
                response.raise_for_status()
                data = response.json()
                new_entries = [RegistryEntry(t) for t in data.get("tools", [])]
                if new_entries:
                    self._entries = new_entries
                    self._build_domain_index()
                    logger.info(f"Updated registry with {len(new_entries)} entries")
                    return True
        except Exception as e:
            logger.warning(f"Failed to check for registry updates: {e}")

        return False

    def find_all_matches(self, hostname: str) -> List[RegistryEntry]:
        """Find all entries matching hostname (linear scan)."""
        return [e for e in self._entries if e.matches(hostname)]

    @property
    def entries(self) -> List[RegistryEntry]:
        return self._entries

    @property
    def entry_count(self) -> int:
        return len(self._entries)

    def get_tools_by_category(self, category: str) -> List[RegistryEntry]:
        return [e for e in self._entries if e.category == category]

    def get_tools_by_vendor(self, vendor: str) -> List[RegistryEntry]:
        return [e for e in self._entries if e.vendor == vendor]


def create_registry(
    registry_path: Optional[str] = None, update_url: Optional[str] = None
) -> Registry:
    return Registry(registry_path, update_url)
