# Supported Windows pilot agent

`main.py` routes to `pilot_agent.py`. The old direct-Supabase orchestrator is disabled. Other historical collectors, demos, installer scripts and executable files in this directory are legacy artifacts and are not the supported pilot installation path. They must not be used as release evidence.

From the repository root, with the local Python 3.12 environment:

```powershell
.venv/Scripts/python.exe -m pip install -r devise-agent/devise-eye/requirements.txt
.venv/Scripts/python.exe devise-agent/devise-eye/pilot_agent.py enroll --api-url http://127.0.0.1:8000 --token ENROLLMENT_TOKEN
.venv/Scripts/python.exe devise-agent/devise-eye/pilot_agent.py run --consent
.venv/Scripts/python.exe devise-agent/devise-eye/pilot_agent.py status
.venv/Scripts/python.exe devise-agent/devise-eye/pilot_agent.py pause
.venv/Scripts/python.exe devise-agent/devise-eye/pilot_agent.py resume
```

An organization administrator creates the short-lived single-use enrollment token through the dashboard/API. Enrollment alone does not start monitoring. `run --consent --once` performs one actual cycle for local integration checks. No event is fabricated when no supported hostname is observed. `--state-dir PATH` is a global option placed **before** the command; separate directories create separate local device installations. `--verbose` enables module debugging while HTTP wire logs remain suppressed. A single Windows file lock prevents simultaneous collectors for one state directory.

Monitoring records registry tool/domain/category/vendor/risk, event UUID/time, process executable name, and evidence/confidence. It reads established connection metadata and the local Windows DNS cache once per cycle. Shared addresses with multiple cached names are excluded. A single cached name remains observational evidence, not proof that a request was sent, content inspected, a license used or spend incurred. The collector performs no reverse DNS or external registry probing. Missing permissions/cache evidence can result in no observations. Clipboard, window titles, full executable paths, command lines, prompt content, and process termination are never enabled by server config.

The per-user Windows **Data Protection API (DPAPI)** protects `credentials.dpapi`, including the opaque scoped device token, random Fernet queue key, identity and consent/config state. Default storage is `%LOCALAPPDATA%\Devise\pilot`. No database credentials, Supabase service keys or plaintext credential fallback are used. Tests inject an explicit memory store; production CLI always uses DPAPI and is Windows-only. Moving encrypted files to another Windows account/machine is unsupported.

A short-lived Windows `state.lock` transaction serializes credential reads, mutations and protected file replacement across processes. Heartbeat config updates change only config fields in the latest state, preserving acknowledged operator pause, revocation and consent. Unique encrypted temporary files avoid writer collisions. This lock is separate from the long-lived `run.lock`, so pause/resume remain available while the collector runs.

`pilot_queue.db` contains Fernet-encrypted event bodies. UUIDs, creation times, counts and fixed error codes remain visible SQLite metadata. The default queue holds at most 10,000 retained records with 7-day pending TTL. Full queues refuse the new event, report `queue_full` and pause collection; they do not evict old records. Expiry and permanent ingestion errors retain encrypted dead letters that consume capacity and appear in `status`. Network errors retain pending events. Accepted/duplicate acknowledgements remove only their original rows; flush never re-enqueues. Retries use the same event UUID, so an acknowledgement lost after server persistence is safely deduplicated by the API. Invalid acknowledgements retain records. Authentication rejection marks the local credential revoked and stops observation.

`status` reports enrollment, live collector lock, pause/revocation/consent/config state, pending/dead-letter counts and the last queue error code. Pause/resume changes apply at the next poll. Pause stops observation but continues queue delivery and heartbeat. Remote poll/heartbeat intervals, batch size, monitoring-enabled and config version update the running objects. Remote policy cannot bypass local pause/consent. Default API config may set the poll interval to 30 seconds. Network outages still allow encrypted offline buffering.

Stop the running console with **Ctrl+C** before forgetting. Revoke the device through the administrator API/dashboard if server access must also end:

```powershell
.venv/Scripts/python.exe devise-agent/devise-eye/pilot_agent.py forget
```

Forget explicitly destroys this installation's protected token/key and local encrypted queue (including retained failures). It does not revoke server credentials or delete server records. To recover from revocation or change identity, revoke if necessary, forget, then enroll again. No silent automatic upgrade or background service is installed. Source upgrades retain state; test restart/delivery before rollout. Unsigned packaging/signing, clean-device install/service lifecycle and customer acceptance remain separate gates.

Remote API origins require HTTPS. HTTP is accepted only for loopback literals/localhost. URLs cannot embed credentials, paths or query strings; token-bearing requests never follow redirects or use environment proxies. Request connection/overall timeouts and response/batch/event sizes are bounded.

Verification:

```powershell
.venv/Scripts/python.exe -m pytest devise-agent/devise-eye/tests -q
```
