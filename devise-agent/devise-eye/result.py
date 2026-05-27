"""Result type for explicit error handling at module seams.

Callers must handle both Ok and Err branches — errors cannot be silently
ignored the way None returns can.

Usage:
    from result import Ok, Err, Result

    def resolve(ip: str) -> Result[str]:
        try:
            return Ok(socket.gethostbyaddr(ip)[0])
        except socket.herror as e:
            return Err(f"no_reverse_dns:{e}")

    match resolve("1.2.3.4"):
        case Ok(hostname): classify(hostname)
        case Err(reason): metrics.inc("dns_errors"); log.warning(reason)
"""

from dataclasses import dataclass
from typing import TypeVar, Generic, Union

T = TypeVar("T")


@dataclass(frozen=True)
class Ok(Generic[T]):
    """Successful result carrying a value."""
    value: T

    @property
    def is_ok(self) -> bool:
        return True

    def is_err(self) -> bool:
        return False


@dataclass(frozen=True)
class Err:
    """Failed result carrying a reason string."""
    reason: str

    @property
    def is_ok(self) -> bool:
        return False

    def is_err(self) -> bool:
        return True


# Union alias — use as return type annotation
Result = Union[Ok, Err]
