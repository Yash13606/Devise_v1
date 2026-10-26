"""Per-Windows-user DPAPI storage. No plaintext or in-memory production fallback."""
import ctypes
from ctypes import wintypes
import json
import os
from pathlib import Path
import sys
from contextlib import contextmanager
import tempfile
import time


def default_state_dir():
    return Path(os.environ.get("LOCALAPPDATA", Path.home() / "AppData" / "Local")) / "Devise" / "pilot"


class _Blob(ctypes.Structure):
    _fields_ = [("cbData", wintypes.DWORD), ("pbData", ctypes.POINTER(ctypes.c_ubyte))]


def _dpapi(value: bytes, decrypt: bool = False) -> bytes:
    if sys.platform != "win32":
        raise RuntimeError("Supported pilot credential storage requires Windows DPAPI")
    buffer = ctypes.create_string_buffer(value)
    source = _Blob(len(value), ctypes.cast(buffer, ctypes.POINTER(ctypes.c_ubyte)))
    output = _Blob()
    crypt32 = ctypes.WinDLL("crypt32", use_last_error=True)
    kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
    function = crypt32.CryptUnprotectData if decrypt else crypt32.CryptProtectData
    function.argtypes = [ctypes.POINTER(_Blob), ctypes.c_void_p, ctypes.c_void_p,
                         ctypes.c_void_p, ctypes.c_void_p, wintypes.DWORD, ctypes.POINTER(_Blob)]
    function.restype = wintypes.BOOL
    kernel32.LocalFree.argtypes = [ctypes.c_void_p]
    kernel32.LocalFree.restype = ctypes.c_void_p
    # CRYPTPROTECT_UI_FORBIDDEN; user-bound protection (never LOCAL_MACHINE).
    if not function(ctypes.byref(source), None, None, None, None, 1, ctypes.byref(output)):
        raise ctypes.WinError(ctypes.get_last_error())
    try:
        return ctypes.string_at(output.pbData, output.cbData)
    finally:
        kernel32.LocalFree(output.pbData)


class WindowsCredentialStore:
    """Inject a different store explicitly in tests; production always uses DPAPI."""
    def __init__(self, state_dir=None):
        self.directory = Path(state_dir or default_state_dir())
        self.path = self.directory / "credentials.dpapi"

    @contextmanager
    def _transaction(self):
        """Short-lived cross-process lock, independent of the collector run lock."""
        if sys.platform != "win32":
            raise RuntimeError("Supported pilot credential storage requires Windows DPAPI")
        import msvcrt
        self.directory.mkdir(parents=True, exist_ok=True)
        with (self.directory / "state.lock").open("a+b") as lock:
            if lock.tell() == 0:
                lock.write(b"0")
                lock.flush()
            deadline = time.monotonic() + 10
            while True:
                lock.seek(0)
                try:
                    msvcrt.locking(lock.fileno(), msvcrt.LK_NBLCK, 1)
                    break
                except OSError:
                    if time.monotonic() >= deadline:
                        raise RuntimeError("Credential state is busy; retry the command") from None
                    time.sleep(0.01)
            try:
                yield
            finally:
                lock.seek(0)
                msvcrt.locking(lock.fileno(), msvcrt.LK_UNLCK, 1)

    def _read_unlocked(self):
        if not self.path.exists():
            return None
        return json.loads(_dpapi(self.path.read_bytes(), decrypt=True))

    def read(self):
        with self._transaction():
            return self._read_unlocked()

    def _write_unlocked(self, value):
        encrypted = _dpapi(json.dumps(value, separators=(",", ":")).encode())
        descriptor, name = tempfile.mkstemp(prefix="credentials-", suffix=".tmp", dir=self.directory)
        temporary = Path(name)
        try:
            with os.fdopen(descriptor, "wb") as stream:
                stream.write(encrypted)
                stream.flush()
                os.fsync(stream.fileno())
            os.replace(temporary, self.path)
        finally:
            temporary.unlink(missing_ok=True)

    def write(self, value):
        """Serialized replacement; production state changes must use update()."""
        with self._transaction():
            self._write_unlocked(value)

    def create(self, value):
        with self._transaction():
            if self._read_unlocked() is not None:
                raise ValueError("Already enrolled; explicitly forget before changing device identity")
            self._write_unlocked(value)

    def update(self, transform):
        """Read latest state, mutate and replace under one Windows file lock."""
        with self._transaction():
            state = self._read_unlocked()
            if state is None:
                raise ValueError("Agent is not enrolled; enroll first")
            updated = transform(state)
            if not isinstance(updated, dict):
                raise ValueError("Credential state update must return a mapping")
            self._write_unlocked(updated)
            return updated

    def forget(self):
        with self._transaction():
            self.path.unlink(missing_ok=True)
