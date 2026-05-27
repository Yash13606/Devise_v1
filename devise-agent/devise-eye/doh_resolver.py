"""DNS-over-HTTPS (DoH) resolver for Devise Desktop Agent.

Provides privacy-preserving DNS resolution via Cloudflare/Google DoH APIs
with automatic fallback to system DNS.
"""

import logging
import threading
import time
from typing import Optional, Tuple

import httpx

from result import Ok, Err, Result

logger = logging.getLogger(__name__)

# DoH endpoint URLs
CLOUDFLARE_DOH_URL = "https://cloudflare-dns.com/dns-query"
GOOGLE_DOH_URL = "https://dns.google/resolve"

# Timeout for DoH requests (seconds)
DOH_TIMEOUT = 2.0


def _ip_to_ptr(ip: str) -> str:
    """Convert IP address to PTR record format.

    Args:
        ip: IPv4 address (e.g., "1.2.3.4")

    Returns:
        PTR format string (e.g., "4.3.2.1.in-addr.arpa")
    """
    parts = ip.strip().split(".")
    return ".".join(reversed(parts)) + ".in-addr.arpa"


class DoHResolver:
    """DNS-over-HTTPS resolver with Cloudflare/Google fallback and LRU cache.

    Interface matches dns_resolver.DNSResolver for drop-in compatibility.
    Resolution order:
      1. Cloudflare DoH (primary)
      2. Google DoH (fallback on Cloudflare timeout/error)
      3. System DNS via dns_resolver.DNSResolver (final fallback)
    """

    def __init__(self, timeout: float = DOH_TIMEOUT, cache_ttl: int = 3600):
        """Initialize DoH resolver.

        Args:
            timeout: HTTP request timeout in seconds
            cache_ttl: Seconds before a cached result expires (default 1 hour)
        """
        self._timeout = timeout
        self._cache_ttl = cache_ttl
        # {ip: (hostname_or_None, expiry_timestamp)}
        self._cache: dict[str, Tuple[Optional[str], float]] = {}
        self._cache_lock = threading.Lock()
        # Use a single shared httpx client for connection reuse
        self._client = httpx.Client(timeout=self._timeout)

    def _query_cloudflare(self, ptr_name: str) -> Optional[str]:
        """Query Cloudflare DoH for PTR record.

        Args:
            ptr_name: PTR record name (e.g., "4.3.2.1.in-addr.arpa")

        Returns:
            Hostname string or None
        """
        try:
            response = self._client.get(
                CLOUDFLARE_DOH_URL,
                params={"name": ptr_name, "type": "PTR"},
                headers={"Accept": "application/dns-json"},
            )
            response.raise_for_status()
            data = response.json()
            answers = data.get("Answer", [])
            for answer in answers:
                if answer.get("type") == 12:  # PTR record type
                    return answer.get("data", "").rstrip(".")
        except httpx.TimeoutException:
            logger.debug(f"Cloudflare DoH timeout for {ptr_name}")
        except Exception as e:
            logger.debug(f"Cloudflare DoH error for {ptr_name}: {e}")
        return None

    def _query_google(self, ptr_name: str) -> Optional[str]:
        """Query Google DoH for PTR record.

        Args:
            ptr_name: PTR record name (e.g., "4.3.2.1.in-addr.arpa")

        Returns:
            Hostname string or None
        """
        try:
            response = self._client.get(
                GOOGLE_DOH_URL,
                params={"name": ptr_name, "type": "PTR"},
                headers={"Accept": "application/dns-json"},
            )
            response.raise_for_status()
            data = response.json()
            answers = data.get("Answer", [])
            for answer in answers:
                if answer.get("type") == 12:  # PTR record type
                    return answer.get("data", "").rstrip(".")
        except httpx.TimeoutException:
            logger.debug(f"Google DoH timeout for {ptr_name}")
        except Exception as e:
            logger.debug(f"Google DoH error for {ptr_name}: {e}")
        return None

    def _query_system_dns(self, ip: str) -> Optional[str]:
        """Fall back to system DNS resolver.

        Args:
            ip: IP address to resolve

        Returns:
            Hostname string or None
        """
        try:
            from dns_resolver import DNSResolver

            fallback = DNSResolver()
            return fallback.reverse_lookup(ip)
        except Exception as e:
            logger.debug(f"System DNS fallback error for {ip}: {e}")
        return None

    def reverse_lookup(self, ip: str) -> Optional[str]:
        """Perform reverse DNS lookup via DoH with fallback chain.

        Resolution order: Cloudflare DoH → Google DoH → System DNS
        Results are cached with a TTL to prevent stale entries in long-running
        service processes.

        Args:
            ip: IP address to resolve (e.g., "1.2.3.4")

        Returns:
            Hostname or None if all methods fail
        """
        # Check TTL-aware cache
        now = time.monotonic()
        with self._cache_lock:
            cached = self._cache.get(ip)
            if cached is not None:
                hostname, expiry = cached
                if now < expiry:
                    return hostname
                del self._cache[ip]

        ptr_name = _ip_to_ptr(ip)
        logger.debug(f"DoH reverse lookup: {ip} → {ptr_name}")

        # Primary: Cloudflare DoH
        hostname = self._query_cloudflare(ptr_name)
        if hostname:
            logger.debug(f"Cloudflare DoH resolved {ip} → {hostname}")
        else:
            # Fallback: Google DoH
            hostname = self._query_google(ptr_name)
            if hostname:
                logger.debug(f"Google DoH resolved {ip} → {hostname}")
            else:
                # Final fallback: system DNS
                hostname = self._query_system_dns(ip)
                if hostname:
                    logger.debug(f"System DNS resolved {ip} → {hostname}")
                else:
                    logger.debug(f"All DNS methods failed for {ip}")

        with self._cache_lock:
            self._cache[ip] = (hostname, now + self._cache_ttl)

        return hostname

    @staticmethod
    def query_os_cache(ip: str) -> Optional[str]:
        """Delegate to DNSResolver.query_os_cache — Windows OS DNS client cache lookup."""
        from dns_resolver import DNSResolver
        return DNSResolver.query_os_cache(ip)

    def reverse_lookup_result(self, ip: str) -> "Result[str]":
        """Reverse DNS lookup returning a Result — mirrors DNSResolver.reverse_lookup_result."""
        hostname = self.reverse_lookup(ip)
        if hostname:
            return Ok(hostname)
        return Err(f"no_ptr:{ip}")

    def close(self) -> None:
        """Close the HTTP client."""
        try:
            self._client.close()
        except Exception:
            pass


def create_doh_resolver(timeout: float = DOH_TIMEOUT) -> DoHResolver:
    """Create a DoH resolver instance.

    Args:
        timeout: HTTP timeout in seconds

    Returns:
        DoHResolver instance
    """
    return DoHResolver(timeout)
