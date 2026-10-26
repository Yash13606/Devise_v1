# Local unsigned Windows package

Run `powershell -NoProfile -File scripts/build-agent.ps1` at the repository root after local Python setup and installing `requirements-build.lock` into `.venv`. The script requires the repository virtual environment and reports a missing PyInstaller dependency. It does not install dependencies automatically.

Each invocation creates a unique ignored `.local/packages/<agent-version>/<timestamp-id>/` directory. It builds one console `DeviseAgent.exe`, a portable ZIP, a ZIP SHA256 sidecar, and a manifest with tool versions, source hashes and executable hash. It never recursively deletes output or accesses enrollment state. The full build log remains beside the ZIP. The procedure is reproducible from declared source/tool dependencies; byte-identical output is not promised.

The packaging launcher delegates normal commands to supported `pilot_agent.main`. Its observation-free `--package-check` loads the real registry, checks a known domain and reports the data hash. PyInstaller places `data/ai_tools_registry.json` beside the frozen `registry.py` module under the onefile extraction directory, matching the runtime's `Path(__file__).parent / 'data'` lookup. No current-directory assumption or runtime patch is necessary.

Build smoke runs the frozen executable from the unique output directory: CLI help must expose enrollment/forget; bundled registry must load, match a known domain, and hash identically to the source; status uses a fresh, isolated state directory and must report unenrolled. No monitoring, token exchange, user state access or network observation is performed. See the generated manifest for results, and `.local/reports/windows-package.md` for local evidence.

Operator setup/enroll/run/status/pause/resume/forget and privacy instructions live in `packaging/PORTABLE_README.md` and are copied into the ZIP as `README.md`. Packages contain only the executable, this README and the manifest, never `.env`, device credentials or runtime queue files.

This is an unsigned local build, not a signed installer or production release. It creates no service, autostart entry or elevation flow. Authenticode signing, clean-device compatibility, upgrade/uninstall testing and owner/customer acceptance remain unverified. Build and smoke again after source changes before distributing an artifact; a manifest describes only its recorded source snapshot.
