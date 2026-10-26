"""Fixed, bounded credential/email heuristics for supported text arguments only.

Matches are candidate data classes, not verified secret ownership or universal
PII detection. No matched value is returned in audit metadata or sent to an LLM.
"""
import re

DATA_CLASSES = ("credentials", "email")
_FIELD = re.compile(r"(?:api[_-]?key|access[_-]?token|client[_-]?secret|password|secret|authorization)", re.I)
_ASSIGNMENT = r"\b(?:api[_-]?key|access[_-]?token|client[_-]?secret|password|secret)\b[\"']?[ \t]{0,16}[:=][ \t]{0,16}"
_QUOTED = (
    re.compile(_ASSIGNMENT + r"'(?P<value>[^'\r\n]{1,16384})'", re.I),
    re.compile(_ASSIGNMENT + r'"(?P<value>[^"\r\n]{1,16384})"', re.I),
)
_BARE = re.compile(_ASSIGNMENT + r"(?P<value>[^\s,;'\"]{8,512})(?=$|[\s,;])", re.I)
_TOKEN = re.compile(r"(?<![A-Za-z0-9_-])(?:sk-(?:proj-|ant-)?[A-Za-z0-9_-]{20,256}|(?:AKIA|ASIA)[A-Z0-9]{16}|gh[pousr]_[A-Za-z0-9]{20,255}|github_pat_[A-Za-z0-9_]{20,255})(?![A-Za-z0-9_-])")
_PRIVATE_KEY = re.compile(r"-----BEGIN (?P<kind>(?:RSA |EC |OPENSSH )?PRIVATE KEY)-----[\s\S]{1,16384}?-----END (?P=kind)-----")
_EMAIL = re.compile(r"(?<![A-Za-z0-9.!#$%&'*+/=?^_`{|}~-])[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.){1,10}[A-Za-z]{2,63}(?![A-Za-z0-9-])")


def _merge(spans):
    merged = []
    for start, end in sorted(spans):
        if merged and start < merged[-1][1]:
            merged[-1] = (merged[-1][0], max(end, merged[-1][1]))
        else:
            merged.append((start, end))
    return merged


def inspect_text(text, data_class, field_name=None):
    """Return source spans only; callers must not log the matching content."""
    if data_class not in DATA_CLASSES:
        raise ValueError("Unsupported deterministic data class")
    if data_class == "email":
        return [match.span() for match in _EMAIL.finditer(text)]
    if text and field_name and _FIELD.fullmatch(field_name):
        return [(0, len(text))]
    spans = [match.span() for pattern in (_TOKEN, _PRIVATE_KEY) for match in pattern.finditer(text)]
    spans += [match.span("value") for pattern in (*_QUOTED, _BARE) for match in pattern.finditer(text)]
    return _merge(spans)


def redact_text(text, data_class, replacement, field_name=None):
    pieces = []
    position = 0
    for start, end in inspect_text(text, data_class, field_name):
        pieces.extend((text[position:start], replacement))
        position = end
    pieces.append(text[position:])
    return "".join(pieces)


def contains_class(value, data_class, field_name=None):
    if isinstance(value, str):
        return bool(inspect_text(value, data_class, field_name))
    if isinstance(value, dict):
        return any(contains_class(item, data_class, key) for key, item in value.items())
    if isinstance(value, list):
        return any(contains_class(item, data_class, field_name) for item in value)
    return False


def redact_arguments(value, data_class, replacement, field_name=None):
    if isinstance(value, str):
        return redact_text(value, data_class, replacement, field_name)
    if isinstance(value, dict):
        return {key: redact_arguments(item, data_class, replacement, key) for key, item in value.items()}
    if isinstance(value, list):
        return [redact_arguments(item, data_class, replacement, field_name) for item in value]
    return value
