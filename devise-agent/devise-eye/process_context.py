"""Process context resolution for accurate AI tool attribution.

When a connection's remote IP is a shared CDN address (Cloudflare, CloudFront,
etc.) reverse DNS returns nothing useful. This module uses process-level signals
— command-line args, executable path, open VS Code extension files — to infer
which AI tool the process is actually talking to.
"""

import logging
import platform
import sys
from typing import Optional, Dict, Any

import psutil

logger = logging.getLogger(__name__)

# Processes that host VS Code extensions — Copilot, Codeium, Cursor, etc.
# all run in one of these host processes.
VSCODE_HOST_PROCESSES = {"code.exe", "code", "code - insiders.exe", "code-insiders"}

# Map known executable path substrings to a tool hint that matches process_hints
# in the registry. Checked in order — first match wins.
_EXE_PATH_HINTS: list[tuple[str, str]] = [
    # Cursor ships its own binary at a distinct path
    ("cursor", "cursor.exe"),
    ("windsurf", "windsurf.exe"),
    ("zed", "zed.exe"),
    ("claude", "claude.exe"),
    ("chatgpt", "chatgpt.exe"),
]


class ProcessContext:
    """Resolved context for a single PID."""

    __slots__ = ("pid", "raw_name", "exe_path", "cmdline", "tool_hint")

    def __init__(
        self,
        pid: int,
        raw_name: str,
        exe_path: str,
        cmdline: str,
        tool_hint: Optional[str],
    ):
        self.pid = pid
        self.raw_name = raw_name
        self.exe_path = exe_path
        self.cmdline = cmdline
        # tool_hint is a process name key that maps to process_hints in registry
        # (e.g. "cursor.exe", "code.exe"). None means we couldn't narrow it down.
        self.tool_hint = tool_hint


class ProcessContextResolver:
    """Resolve per-PID context to improve AI tool attribution accuracy."""

    def __init__(self):
        # PID -> ProcessContext cache (cleared periodically in main loop)
        self._cache: Dict[int, ProcessContext] = {}

    def resolve(self, pid: int, raw_process_name: str) -> ProcessContext:
        """Resolve rich context for pid, using cache when available."""
        if pid in self._cache:
            return self._cache[pid]

        exe_path = ""
        cmdline = ""
        tool_hint: Optional[str] = None

        try:
            proc = psutil.Process(pid)
            try:
                exe_path = proc.exe() or ""
            except (psutil.AccessDenied, psutil.NoSuchProcess, OSError):
                pass

            try:
                cmdline = " ".join(proc.cmdline())
            except (psutil.AccessDenied, psutil.NoSuchProcess, OSError):
                pass

            tool_hint = self._infer_tool_hint(raw_process_name, exe_path, cmdline)

        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
        except Exception as e:
            logger.debug(f"ProcessContextResolver error for pid {pid}: {e}")

        ctx = ProcessContext(
            pid=pid,
            raw_name=raw_process_name,
            exe_path=exe_path,
            cmdline=cmdline,
            tool_hint=tool_hint,
        )
        self._cache[pid] = ctx
        return ctx

    def _infer_tool_hint(
        self, raw_name: str, exe_path: str, cmdline: str
    ) -> Optional[str]:
        """Return a process_hints-compatible name for this process."""
        name_lower = raw_name.lower()
        path_lower = exe_path.lower()

        # Direct name matches first (most reliable)
        for known, hint in _EXE_PATH_HINTS:
            if known in name_lower or known in path_lower:
                return hint

        # VS Code host processes: try to narrow down which extension is running
        if name_lower in VSCODE_HOST_PROCESSES:
            return self._resolve_vscode_extension(exe_path, cmdline)

        return raw_name if raw_name else None

    def _resolve_vscode_extension(
        self, exe_path: str, cmdline: str
    ) -> Optional[str]:
        """Try to distinguish Cursor-as-VS-Code-fork from plain VS Code.

        Cursor ships a custom VS Code build — its executable path contains
        "cursor" even though the process name is "code.exe" on Windows.
        Similarly Windsurf's fork contains "windsurf" in its path.
        """
        path_lower = exe_path.lower()
        cmd_lower = cmdline.lower()

        if "cursor" in path_lower or "cursor" in cmd_lower:
            return "cursor.exe"
        if "windsurf" in path_lower or "windsurf" in cmd_lower:
            return "windsurf.exe"

        return "code.exe"

    def clear_cache(self) -> None:
        """Clear the PID cache. Call periodically to release stale entries."""
        self._cache.clear()

    def evict(self, pid: int) -> None:
        """Remove a single PID from cache."""
        self._cache.pop(pid, None)


def create_process_context_resolver() -> ProcessContextResolver:
    return ProcessContextResolver()
