import re

with open('/home/yash/Devise-CAD/devise-agent/devise-eye/sensitivity_monitor.py', 'r') as f:
    content = f.read()

# Add regex imports and patterns
if 'import re' not in content:
    content = content.replace('import time', 'import time\nimport re')

new_class_content = """class SensitivityMonitor:
    \"\"\"Monitors clipboard and active windows for sensitive data indicators.\"\"\"

    # Keywords that suggest sensitive data might be in context
    SENSITIVE_KEYWORDS = [
        "confidential", "internal use only", "secret",
        "ssn", "social security", "password", "credential",
        "salary", "payroll", "financial", "patient data",
        "phi", "pii", "api key", "auth_token"
    ]
    
    # Regex patterns for data classification
    PATTERNS = {
        "PII_SSN": r"\\b\\d{3}-\\d{2}-\\d{4}\\b",
        "PII_CREDIT_CARD": r"\\b(?:\\d[ -]*?){13,16}\\b",
        "PHI_DOB": r"\\b(dob|date of birth)[\s:]*\\d{1,2}[-/]\\d{1,2}[-/]\\d{2,4}\\b",
        "FINANCIAL": r"\\b(routing number|account number)[\s:]*\\d{8,12}\\b",
        "CODE": r"\\b(function|def|class|import|const|let|var|public|private)\\b",
        "SECRETS": r"\\b(sk-[a-zA-Z0-9]{48}|ghp_[a-zA-Z0-9]{36})\\b"
    }

    def __init__(self, poll_interval: int = 1):
        \"\"\"Initialize SensitivityMonitor.

        Args:
            poll_interval: How often to check clipboard/windows (seconds)
        \"\"\"
        self._poll_interval = poll_interval
        self._stop_event = threading.Event()
        self._thread: Optional[threading.Thread] = None

        self._last_clipboard_content = ""
        self._current_sensitivity_score = 0
        self._last_active_window_title = ""
        self._current_data_type = "clean"
        self._current_sensitivity_flag = None"""

content = re.sub(r'class SensitivityMonitor:.*?(?=    def _get_active_window_title)', new_class_content + '\n\n', content, flags=re.DOTALL)

calc_old = """    def _calculate_sensitivity(self, text: str) -> int:
        \"\"\"Calculate a basic sensitivity score based on keyword matching.
        
        Args:
            text: The text to analyze
            
        Returns:
            Score from 0 to 100 based on hits.
        \"\"\"
        score = 0
        if not text:
            return score

        for keyword in self.SENSITIVE_KEYWORDS:
            if keyword in text:
                score += 20  # +20 risk per keyword hit

        return min(score, 100)  # Cap at 100"""

calc_new = """    def _calculate_sensitivity(self, text: str) -> tuple:
        \"\"\"Calculate sensitivity score, data type, and flag.
        
        Returns:
            (score: int, data_type: str, flag: str|None)
        \"\"\"
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

        return min(score, 100), data_type, flag"""

content = content.replace(calc_old, calc_new)

loop_old = """                clip_score = self._calculate_sensitivity(clipboard_text)
                title_score = self._calculate_sensitivity(window_title)

                # Use the highest risk observed in the current context
                self._current_sensitivity_score = max(clip_score, title_score)"""

loop_new = """                clip_score, clip_dt, clip_flag = self._calculate_sensitivity(clipboard_text)
                title_score, title_dt, title_flag = self._calculate_sensitivity(window_title)

                self._current_sensitivity_score = max(clip_score, title_score)
                self._current_data_type = clip_dt if clip_score >= title_score else title_dt
                self._current_sensitivity_flag = clip_flag if clip_score >= title_score else title_flag"""

content = content.replace(loop_old, loop_new)

get_summary_old = """    def get_context_summary(self) -> Dict[str, Any]:
        \"\"\"Return a summary of the current sensitive context.\"\"\"
        return {
            "score": self._current_sensitivity_score,
            "window_title": self._last_active_window_title,
            # We purposely do NOT send raw clipboard data to the backend,
            # only the boolean indicator if it contained sensitive keywords.
            "clipboard_has_sensitive_data": self._calculate_sensitivity(self._last_clipboard_content) > 0
        }"""

get_summary_new = """    def get_context_summary(self) -> Dict[str, Any]:
        \"\"\"Return a summary of the current sensitive context.\"\"\"
        return {
            "score": self._current_sensitivity_score,
            "window_title": self._last_active_window_title,
            "data_type": self._current_data_type,
            "sensitivity_flag": self._current_sensitivity_flag,
            "clipboard_has_sensitive_data": self._calculate_sensitivity(self._last_clipboard_content)[0] > 0
        }"""

content = content.replace(get_summary_old, get_summary_new)

with open('/home/yash/Devise-CAD/devise-agent/devise-eye/sensitivity_monitor.py', 'w') as f:
    f.write(content)
