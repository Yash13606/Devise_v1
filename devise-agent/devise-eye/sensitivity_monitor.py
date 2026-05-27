"""Sensitivity monitor for Devise Desktop Agent.

Monitors clipboard content and active window titles to calculate local
risk scores and determine the sensitivity of data being sent to AI tools.
"""

import logging
import platform
import shutil
import subprocess
import threading
import time
import re
from typing import Dict, Any, Optional

try:
    import pyperclip
    _HAS_PYPERCLIP = True
except ImportError:
    _HAS_PYPERCLIP = False

try:
    import win32gui
    _HAS_WIN32 = True
except ImportError:
    _HAS_WIN32 = False

_PLATFORM = platform.system()
_HAS_XDOTOOL = _PLATFORM == "Linux" and shutil.which("xdotool") is not None

logger = logging.getLogger(__name__)


class SensitivityMonitor:
    """Monitors clipboard and active windows for sensitive data indicators."""

    # Keywords that suggest sensitive data might be in context
    SENSITIVE_KEYWORDS = [
        "confidential", "internal use only", "secret",
        "ssn", "social security", "password", "credential",
        "salary", "payroll", "financial", "patient data",
        "phi", "pii", "api key", "auth_token"
    ]
    
    # Regex patterns for data classification
    PATTERNS = {
        "PII_SSN": r"\b\d{3}-\d{2}-\d{4}\b",
        "PII_CREDIT_CARD": r"\b(?:[0-9]{4}[ -]?){3}[0-9]{4}\b",
        "PHI_DOB": r"\b(dob|date of birth)[\s:]*\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b",
        "FINANCIAL": r"\b(routing number|account number)[\s:]*\d{8,12}\b",
        "CODE": r"\b(function|def|class|import|const|let|var|public|private)\b",
        "SECRETS": r"\b(sk-[a-zA-Z0-9]{48}|ghp_[a-zA-Z0-9]{36})\b"
    }

    def __init__(self, poll_interval: int = 1):
        """Initialize SensitivityMonitor.

        Args:
            poll_interval: How often to check clipboard/windows (seconds)
        """
        self._poll_interval = poll_interval
        self._stop_event = threading.Event()
        self._thread: Optional[threading.Thread] = None

        self._last_clipboard_content = ""
        self._current_sensitivity_score = 0
        self._last_active_window_title = ""
        self._current_data_type = "clean"
        self._current_sensitivity_flag = None

    def _get_active_window_title(self) -> str:
        """Get the title of the currently focused window (cross-platform)."""
        if _PLATFORM == "Windows" and _HAS_WIN32:
            try:
                window = win32gui.GetForegroundWindow()
                title = win32gui.GetWindowText(window)
                return title.lower()
            except Exception as e:
                logger.debug(f"Failed to get active window title (Windows): {e}")
                return ""

        if _PLATFORM == "Darwin":
            try:
                result = subprocess.run(
                    [
                        "osascript", "-e",
                        'tell application "System Events" to get name of '
                        "first application process whose frontmost is true",
                    ],
                    capture_output=True,
                    text=True,
                    timeout=1,
                )
                return result.stdout.strip().lower()
            except Exception as e:
                logger.debug(f"Failed to get active window title (macOS): {e}")
                return ""

        if _PLATFORM == "Linux" and _HAS_XDOTOOL:
            try:
                result = subprocess.run(
                    ["xdotool", "getactivewindow", "getwindowname"],
                    capture_output=True,
                    text=True,
                    timeout=1,
                )
                return result.stdout.strip().lower()
            except Exception as e:
                logger.debug(f"Failed to get active window title (Linux): {e}")
                return ""

        return ""

    def _get_clipboard_content(self) -> str:
        """Get current text from the clipboard."""
        if not _HAS_PYPERCLIP:
            return ""
        try:
            content = pyperclip.paste()
            return content.lower() if content else ""
        except Exception as e:
            logger.debug(f"Failed to read clipboard: {e}")
            return ""

    def _calculate_sensitivity(self, text: str) -> tuple:
        """Calculate sensitivity score, data type, and flag.
        
        Returns:
            (score: int, data_type: str, flag: str|None)
        """
        score = 0
        data_type = "clean"
        flag = None
        if not text:
            return score, data_type, flag

        text_lower = text.lower()
        for keyword in self.SENSITIVE_KEYWORDS:
            if keyword in text_lower:
                score += 20

        # Pattern matching
        if re.search(self.PATTERNS["PII_SSN"], text) or re.search(self.PATTERNS["PII_CREDIT_CARD"], text):
            score += 50
            data_type = "PII"
            flag = "PII_PATTERN"
        elif re.search(self.PATTERNS["PHI_DOB"], text_lower):
            score += 60
            data_type = "PHI"
            flag = "PHI_PATTERN"
        elif re.search(self.PATTERNS["SECRETS"], text):
            score += 80
            data_type = "IP_SECRETS"
            flag = "CREDENTIALS_PATTERN"
        elif re.search(self.PATTERNS["FINANCIAL"], text_lower):
            score += 40
            data_type = "FINANCIAL"
            flag = "FINANCIAL_KEYWORDS"
        elif re.search(self.PATTERNS["CODE"], text_lower):
            data_type = "CODE"
            if "confidential" in text_lower:
                flag = "SOURCE_CODE"

        return min(score, 100), data_type, flag

    def _monitor_loop(self):
        """Main loop for polling sensors."""
        logger.info("Sensitivity monitor started.")
        while not self._stop_event.is_set():
            clipboard_text = self._get_clipboard_content()
            window_title = self._get_active_window_title()

            # Optional: only recalculate if changed
            if clipboard_text != self._last_clipboard_content or window_title != self._last_active_window_title:
                clip_score, clip_dt, clip_flag = self._calculate_sensitivity(clipboard_text)
                title_score, title_dt, title_flag = self._calculate_sensitivity(window_title)

                # Use the highest risk observed in the current context
                self._current_sensitivity_score = max(clip_score, title_score)
                self._current_data_type = clip_dt if clip_score >= title_score else title_dt
                self._current_sensitivity_flag = clip_flag if clip_score >= title_score else title_flag

                self._last_clipboard_content = clipboard_text
                self._last_active_window_title = window_title

            self._stop_event.wait(self._poll_interval)
            
        logger.info("Sensitivity monitor stopped.")

    def start(self):
        """Start the monitor thread."""
        has_any_sensor = (
            _HAS_PYPERCLIP
            or _HAS_WIN32
            or _PLATFORM == "Darwin"
            or _HAS_XDOTOOL
        )
        if not has_any_sensor:
            logger.warning("No clipboard/window sensors available. Sensitivity monitor disabled.")
            return

        if self._thread and self._thread.is_alive():
            return
            
        self._stop_event.clear()
        self._thread = threading.Thread(target=self._monitor_loop, daemon=True)
        self._thread.start()

    def stop(self):
        """Stop the monitor thread."""
        self._stop_event.set()
        if self._thread:
            self._thread.join(timeout=2.0)

    def get_current_score(self) -> int:
        """Retrieve the latest sensitivity risk score.
        
        Returns:
            Int between 0 and 100
        """
        return self._current_sensitivity_score

    def get_context_summary(self) -> Dict[str, Any]:
        """Return a summary of the current sensitive context."""
        return {
            "score": self._current_sensitivity_score,
            "window_title": self._last_active_window_title,
            "data_type": self._current_data_type,
            "sensitivity_flag": self._current_sensitivity_flag,
            # We purposely do NOT send raw clipboard data to the backend,
            # only the boolean indicator if it contained sensitive keywords.
            "clipboard_has_sensitive_data": self._calculate_sensitivity(self._last_clipboard_content)[0] > 0
        }


def create_sensitivity_monitor(poll_interval: int = 1) -> SensitivityMonitor:
    """Create a sensitivity monitor instance."""
    return SensitivityMonitor(poll_interval)
