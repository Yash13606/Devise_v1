"""DNS resolution module for Devise Desktop Agent."""

import socket
import logging
import sys
from typing import Optional, Dict
from collections import OrderedDict
import threading

from result import Ok, Err, Result


logger = logging.getLogger(__name__)


class DNSResolver:
    """DNS resolver with LRU cache for reverse lookups."""

    def __init__(self, cache_size: int = 1000, timeout: float = 2.0):
        """Initialize DNS resolver.

        Args:
            cache_size: Maximum number of cached resolutions
            timeout: Timeout in seconds for each lookup
        """
        self._cache: OrderedDict[str, Optional[str]] = OrderedDict()
        self._cache_size = cache_size
        self._timeout = timeout
        self._lock = threading.Lock()

    @staticmethod
    def query_os_cache(ip: str) -> Optional[str]:
        """Query the Windows OS DNS client cache for which domain resolved to this IP.

        More accurate than reverse-DNS for CDN-hosted tools: tells us the exact
        domain the browser looked up rather than what PTR records say.
        Returns None on non-Windows platforms or when the IP isn't in the cache.
        """
        if sys.platform != "win32":
            return None
        try:
            import subprocess
            result = subprocess.run(
                [
                    "powershell", "-NoProfile", "-Command",
                    f"Get-DnsClientCache | Where-Object {{$_.Data -eq '{ip}'}} "
                    f"| Select-Object -First 1 -ExpandProperty Entry",
                ],
                capture_output=True,
                text=True,
                timeout=2,
                creationflags=subprocess.CREATE_NO_WINDOW,
            )
            hostname = result.stdout.strip()
            return hostname if hostname else None
        except Exception:
            return None

    def reverse_lookup_result(self, ip_address: str) -> "Result[str]":
        """Reverse DNS lookup returning a Result — callers must handle both branches.

        Prefer this over reverse_lookup() at module seams where the difference
        between 'no PTR record' and 'lookup crashed' matters for metrics.
        """
        cached = self._get_from_cache(ip_address)
        if cached is not None:
            return Ok(cached)
        if cached == "":
            return Err(f"no_ptr:{ip_address}")

        try:
            socket.setdefaulttimeout(self._timeout)
            hostname, _, _ = socket.gethostbyaddr(ip_address)
            self._add_to_cache(ip_address, hostname)
            logger.debug(f"Resolved {ip_address} -> {hostname}")
            return Ok(hostname)

        except socket.herror as e:
            self._add_to_cache(ip_address, None)
            return Err(f"no_ptr:{e}")

        except socket.timeout:
            self._add_to_cache(ip_address, None)
            return Err(f"timeout:{ip_address}")

        except Exception as e:
            self._add_to_cache(ip_address, None)
            return Err(f"error:{e}")

    def reverse_lookup(self, ip_address: str) -> Optional[str]:
        """Perform reverse DNS lookup on an IP address.

        Args:
            ip_address: IP address to resolve

        Returns:
            Hostname or None if resolution fails
        """
        # Check cache first
        cached = self._get_from_cache(ip_address)
        if cached is not None or cached == "":
            return cached

        # Perform actual lookup
        try:
            socket.setdefaulttimeout(self._timeout)
            hostname, _, _ = socket.gethostbyaddr(ip_address)

            # Cache successful result
            self._add_to_cache(ip_address, hostname)
            logger.debug(f"Resolved {ip_address} -> {hostname}")
            return hostname

        except socket.herror as e:
            # No reverse DNS record
            logger.debug(f"No reverse DNS for {ip_address}: {e}")
            self._add_to_cache(ip_address, None)
            return None

        except socket.timeout:
            logger.debug(f"DNS lookup timeout for {ip_address}")
            self._add_to_cache(ip_address, None)
            return None

        except Exception as e:
            logger.warning(f"Error resolving {ip_address}: {e}")
            self._add_to_cache(ip_address, None)
            return None

    def _get_from_cache(self, ip: str) -> Optional[str]:
        """Get value from cache.

        Args:
            ip: IP address

        Returns:
            Cached hostname or None
        """
        with self._lock:
            if ip in self._cache:
                # Move to end (most recently used)
                self._cache.move_to_end(ip)
                return self._cache[ip]
        return None

    def _add_to_cache(self, ip: str, hostname: Optional[str]) -> None:
        """Add value to cache.

        Args:
            ip: IP address
            hostname: Resolved hostname or None
        """
        with self._lock:
            # Evict oldest if cache is full
            if len(self._cache) >= self._cache_size and ip not in self._cache:
                self._cache.popitem(last=False)

            self._cache[ip] = hostname

    def resolve_multiple(self, ip_addresses: list) -> Dict[str, Optional[str]]:
        """Resolve multiple IP addresses.

        Args:
            ip_addresses: List of IP addresses

        Returns:
            Dict mapping IP to hostname
        """
        results = {}

        for ip in ip_addresses:
            hostname = self.reverse_lookup(ip)
            results[ip] = hostname

        return results

    def clear_cache(self) -> None:
        """Clear the DNS cache."""
        with self._lock:
            self._cache.clear()

    def get_cache_stats(self) -> Dict[str, int]:
        """Get cache statistics.

        Returns:
            Dict with cache stats
        """
        with self._lock:
            total = len(self._cache)
            resolved = sum(1 for v in self._cache.values() if v is not None)
            unresolved = total - resolved

            return {"total": total, "resolved": resolved, "unresolved": unresolved}


def create_resolver(cache_size: int = 1000, timeout: float = 2.0) -> DNSResolver:
    """Create a DNS resolver instance.

    Args:
        cache_size: Maximum cache size
        timeout: Lookup timeout in seconds

    Returns:
        DNSResolver instance
    """
    return DNSResolver(cache_size, timeout)
