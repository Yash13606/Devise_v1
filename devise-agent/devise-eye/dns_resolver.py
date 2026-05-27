"""DNS resolution module for Devise Desktop Agent."""

import socket
import logging
import time
from typing import Optional, Dict, Tuple
from collections import OrderedDict
import threading


logger = logging.getLogger(__name__)


class DNSResolver:
    """DNS resolver with LRU cache for reverse lookups."""

    def __init__(self, cache_size: int = 2048, timeout: float = 2.0, cache_ttl: int = 3600):
        """Initialize DNS resolver.

        Args:
            cache_size: Maximum number of cached resolutions
            timeout: Timeout in seconds for each lookup
            cache_ttl: Seconds before a cached entry expires (default 1 hour)
        """
        # Each cache value is (hostname_or_None, expiry_monotonic_time)
        self._cache: OrderedDict[str, Tuple[Optional[str], float]] = OrderedDict()
        self._cache_size = cache_size
        self._timeout = timeout
        self._cache_ttl = cache_ttl
        self._lock = threading.Lock()

    def reverse_lookup(self, ip_address: str) -> Optional[str]:
        """Perform reverse DNS lookup on an IP address.

        Args:
            ip_address: IP address to resolve

        Returns:
            Hostname or None if resolution fails
        """
        # Check TTL-aware cache first
        cached = self._get_from_cache(ip_address)
        if cached is not False:
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

    def _get_from_cache(self, ip: str):
        """Get value from TTL-aware cache.

        Returns:
            Cached hostname (may be None for a negative result), or False
            if the entry is absent or expired.
        """
        now = time.monotonic()
        with self._lock:
            if ip in self._cache:
                hostname, expiry = self._cache[ip]
                if now < expiry:
                    self._cache.move_to_end(ip)
                    return hostname
                # Expired — evict
                del self._cache[ip]
        return False

    def _add_to_cache(self, ip: str, hostname: Optional[str]) -> None:
        """Add value to cache with TTL."""
        expiry = time.monotonic() + self._cache_ttl
        with self._lock:
            if len(self._cache) >= self._cache_size and ip not in self._cache:
                self._cache.popitem(last=False)
            self._cache[ip] = (hostname, expiry)

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
            resolved = sum(1 for v, _ in self._cache.values() if v is not None)
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
