# Devise Windows agent (unsigned local pilot)

Extract the ZIP into a user-owned folder. Open PowerShell there. Python is not required on the target; this console executable contains its runtime. Keep the console visible while running. No administrator privileges, service, startup entry or installer is required.

```powershell
.\DeviseAgent.exe --help
.\DeviseAgent.exe --package-check
.\DeviseAgent.exe status
.\DeviseAgent.exe enroll --api-url http://127.0.0.1:8000 --token '<single-use token from an administrator>'
.\DeviseAgent.exe run --consent
```

Use a real administrator-issued enrollment token; enrollment starts paused with no consent. Only run `run --consent` after reviewing metadata collection below. The enrollment token is passed on the command line and may be visible in local process inspection or shell history; do not paste real tokens into shared transcripts. The API must already be running. Loopback HTTP is for local development; remote APIs require HTTPS.

From another PowerShell window in the same folder:

```powershell
.\DeviseAgent.exe status
.\DeviseAgent.exe pause
.\DeviseAgent.exe resume
```

Pause suspends observation while the console process remains active. Resume requires previous consent and an active credential. Ctrl+C stops the console process. After stopping, `status` reports it stopped. `forget` removes the local credential/key and encrypted queue; first revoke the device in the administrator dashboard to disable its server credential. Forget does not delete server records. Use the dashboard privacy operations for server data.

```powershell
.\DeviseAgent.exe forget
```

Credentials, consent and encrypted queue are stored under `%LOCALAPPDATA%\Devise\pilot`, protected for the current Windows user with DPAPI. They are outside this package. Do not distribute this state directory. An optional global `--state-dir PATH` must precede the command; use the same path for every lifecycle command. Keep it outside the extracted package.

The supported monitor observes registry hostnames from the existing Windows DNS cache and network process names. These are metadata evidence, not proof of an AI request, license or spending. It does not collect clipboard, titles, command lines or content; it does not terminate processes. The registry check only loads bundled data, without observing or enrolling.

This package is unsigned. Windows reputation/security products may warn or block it. Follow your organization's review procedure; do not disable protection. `manifest.json` records build tools, source and executable SHA256 hashes. The adjacent ZIP `.sha256` file verifies transport integrity only, not publisher identity. This is a same-machine local pilot artifact; signing, independent security review, clean-device compatibility, installation/upgrade/uninstall and customer acceptance remain open.

To replace the binary, stop it with Ctrl+C, retain the external state directory, extract a new package and check status. This replacement procedure has not been validated as a clean-device upgrade. Delete the extracted package when no longer needed; it installs no service or startup entry. Revoke and forget first when retiring a device.
