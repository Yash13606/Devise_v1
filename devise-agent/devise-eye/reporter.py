"""HTTP reporter module for Devise Desktop Agent using Supabase.

Writes events directly to Supabase PostgREST API.
Falls back to offline queue on failure.
"""

import asyncio
import logging
from typing import Dict, Any, Optional, List
import httpx

logger = logging.getLogger(__name__)

# Backoff intervals in seconds
BACKOFF_INTERVALS = [30, 60, 120, 300]
MAX_RETRIES = 4
BATCH_SIZE = 100


class TransportFailure(RuntimeError):
    def __init__(self, status=None):
        self.status = status
        super().__init__(f"Device API failure ({status or 'network unavailable'})")


class CredentialRevoked(TransportFailure):
    """Device authentication rejected; observation must stop."""


def validate_api_url(value):
    from urllib.parse import urlsplit
    import ipaddress
    parsed = urlsplit(value)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname or parsed.username or parsed.password or parsed.query or parsed.fragment or parsed.path not in {"", "/"}:
        raise ValueError("API URL must be an http(s) origin without credentials, path, query or fragment")
    try:
        loopback = ipaddress.ip_address(parsed.hostname).is_loopback
    except ValueError:
        loopback = parsed.hostname.lower() == "localhost"
    if parsed.scheme == "http" and not loopback:
        raise ValueError("Remote API URL requires HTTPS; HTTP is allowed only on loopback")
    # Force port parsing so invalid ports fail before storing a credential.
    parsed.port
    return value.rstrip("/")


class DeviceTransport:
    """Opaque device token only. Never redirects, uses proxies, or logs bodies."""
    def __init__(self, api_url, token=None, transport=None):
        self.api_url = validate_api_url(api_url)
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        self.client = httpx.Client(base_url=self.api_url, headers=headers,
                                   timeout=httpx.Timeout(10, connect=3), follow_redirects=False,
                                   trust_env=False, transport=transport)

    def close(self):
        self.client.close()

    def request(self, method, path, payload=None):
        if not path.startswith("/api/") or "://" in path or ".." in path:
            raise ValueError("Only scoped API paths are supported")
        try:
            with self.client.stream(method, path, json=payload) as response:
                if response.status_code in {401, 403}:
                    raise CredentialRevoked(response.status_code)
                if response.status_code < 200 or response.status_code >= 300:
                    raise TransportFailure(response.status_code)
                content = bytearray()
                for chunk in response.iter_bytes():
                    content.extend(chunk)
                    if len(content) > 65536:
                        raise TransportFailure("oversized_response")
                import json
                result = json.loads(content)
                if not isinstance(result, dict):
                    raise TransportFailure("invalid_response")
                return result
        except (httpx.HTTPError, ValueError) as error:
            raise TransportFailure() from error


class QueueDelivery:
    """Persist once, send existing records, remove only a fully acknowledged batch."""
    def __init__(self, queue, transport):
        import threading
        self.queue = queue
        self.transport = transport
        self.batch_size = 100
        self.retryable_failure = False
        self._lock = threading.Lock()

    def flush(self):
        with self._lock:
            self.retryable_failure = False
            rows = self.queue.pending(self.batch_size)
            if not rows:
                return 0
            ids = [row["event_id"] for row in rows]
            try:
                result = self.transport.request("POST", "/api/events/batch", {"schema_version": 1, "events": [row["event"] for row in rows]})
                accepted, duplicates = result.get("accepted"), result.get("duplicates")
                if type(accepted) is not int or type(duplicates) is not int or accepted < 0 or duplicates < 0 or accepted + duplicates != len(rows):
                    self.retryable_failure = True
                    self.queue.record_error("invalid_batch_acknowledgement")
                    return 0
                self.queue.acknowledge(ids)
                return len(rows)
            except CredentialRevoked:
                self.queue.record_error("credential_revoked")
                raise
            except TransportFailure as error:
                reason = f"http_{error.status}" if error.status else "network_unavailable"
                if error.status in {400, 404, 405, 409, 410, 413, 415, 422}:
                    self.queue.quarantine(ids, reason)
                else:
                    self.retryable_failure = True
                    self.queue.record_error(reason)
                return 0

class SupabaseReporter:
    """Reports events to Supabase REST API."""

    @classmethod
    def from_settings(cls, settings: "ReporterSettings", queue=None) -> "SupabaseReporter":
        """Create from a typed ReporterSettings instance."""
        from settings import ReporterSettings  # noqa: F401 — imported for type check
        return cls(
            supabase_url=settings.supabase_url,
            supabase_key=settings.supabase_key,
            timeout=settings.timeout,
            queue=queue,
        )

    def __init__(
        self,
        supabase_url: str,
        supabase_key: str,
        timeout: float = 10.0,
        queue=None,
    ):
        """Initialize Supabase reporter.

        Args:
            supabase_url: Supabase project URL
            supabase_key: Supabase API Key (Anon or Service Role)
            timeout: Request timeout in seconds
            queue: Optional EventQueue for offline buffering
        """
        self._supabase_url = supabase_url.rstrip("/")
        self._supabase_key = supabase_key
        self._timeout = timeout
        self._queue = queue
        self._client: Optional[httpx.AsyncClient] = None

    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create async HTTP client with Supabase auth headers."""
        if self._client is not None:
            return self._client

        self._client = httpx.AsyncClient(
            timeout=self._timeout,
            headers={
                "apikey": self._supabase_key,
                "Authorization": f"Bearer {self._supabase_key}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
        )
        return self._client

    def _build_collection_url(self, collection: str) -> str:
        """Build Supabase REST URL for a table."""
        return f"{self._supabase_url}/rest/v1/{collection}"

    async def _write_to_supabase(
        self, event: Dict[str, Any], collection: str = "detection_events"
    ) -> bool:
        """Write a single event document to Supabase."""
        url = self._build_collection_url(collection)
        
        # Clean the event dictionary of potential python objects if needed
        # but typical events are already JSON serializable from the event builder
        body = event

        for attempt in range(MAX_RETRIES + 1):
            try:
                client = await self._get_client()
                response = await client.post(url, json=body)

                response.raise_for_status()
                # 201 Created is typical for PostgREST inserts
                logger.debug(f"Supabase write OK: {response.status_code}")
                return True

            except httpx.HTTPStatusError as e:
                # Client errors (4xx) unlikely to be transient unless rate limiting (429)
                if 400 <= e.response.status_code < 500 and e.response.status_code != 429:
                    logger.warning(
                        f"Supabase client error {e.response.status_code}: {e.response.text[:200]}"
                    )
                    return False
                logger.warning(
                    f"Supabase server error (attempt {attempt + 1}): {e.response.status_code}"
                )
            except httpx.RequestError as e:
                logger.warning(f"Network error (attempt {attempt + 1}): {e}")
            except Exception as e:
                logger.warning(f"Unexpected error (attempt {attempt + 1}): {e}")

            if attempt < MAX_RETRIES:
                backoff = BACKOFF_INTERVALS[attempt]
                logger.info(f"Retrying Supabase write in {backoff}s...")
                await asyncio.sleep(backoff)

        return False

    def set_queue(self, queue) -> None:
        """Set the event queue for offline buffering."""
        self._queue = queue

    async def report_event(
        self, event: Dict[str, Any], collection: str = "detection_events"
    ) -> bool:
        """Report event to Supabase with retry/queue fallback."""
        success = await self._write_to_supabase(event, collection)

        if not success:
            if self._queue:
                logger.info("Supabase write failed — queueing event for later")
                self._queue.enqueue(event)
            else:
                logger.warning("Supabase write failed and no queue configured")
            return False

        return True

    async def report_events(self, events: List[Dict[str, Any]]) -> Dict[str, int]:
        """Report multiple events."""
        results = {"success": 0, "failure": 0, "queued": 0}

        for event in events:
            if await self.report_event(event):
                results["success"] += 1
            else:
                results["failure"] += 1

        return results

    async def flush_queue(self) -> Dict[str, int]:
        """Flush queued events to Supabase."""
        if not self._queue:
            return {"success": 0, "failure": 0, "skipped": 0}

        results = {"success": 0, "failure": 0, "skipped": 0}
        pending = self._queue.get_pending(limit=BATCH_SIZE)

        if not pending:
            logger.debug("No pending events in queue")
            return results

        logger.info(f"Flushing {len(pending)} queued events to Supabase")

        success_ids = []
        failed_ids = []

        for event in pending:
            queue_id = event.get("_queue_id")
            
            # Strip ALL internal queue metadata before sending to Supabase
            clean_event = event.copy()
            clean_event.pop("_queue_id", None)
            clean_event.pop("_retry_count", None)
            clean_event.pop("_created_at", None)
            
            if await self.report_event(clean_event):
                if queue_id:
                    success_ids.append(queue_id)
                results["success"] += 1
            else:
                if queue_id:
                    failed_ids.append(queue_id)
                results["failure"] += 1

        if success_ids:
            self._queue.mark_success(success_ids)
        if failed_ids:
            self._queue.mark_failed(failed_ids)

        logger.info(
            f"Queue flush done: {results['success']} sent, {results['failure']} failed"
        )
        return results

    async def close(self) -> None:
        """Close HTTP client."""
        if self._client:
            await self._client.aclose()
            self._client = None

    async def __aenter__(self) -> "SupabaseReporter":
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
        await self.close()

# Keep legacy class name as alias for backward compatibility
Reporter = SupabaseReporter

def create_reporter(
    supabase_url: str = "",
    supabase_key: str = "",
    timeout: float = 10.0,
    queue=None,
    **kwargs
) -> SupabaseReporter:
    """Create a Supabase reporter instance."""
    return SupabaseReporter(
        supabase_url=supabase_url,
        supabase_key=supabase_key,
        timeout=timeout,
        queue=queue,
    )
