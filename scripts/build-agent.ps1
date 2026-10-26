[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$repo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$python = Join-Path $repo '.venv/Scripts/python.exe'
if (-not (Test-Path -LiteralPath $python)) { throw 'Missing repository .venv. Run local setup first.' }
& $python -c 'import PyInstaller'
if ($LASTEXITCODE -ne 0) { throw 'PyInstaller missing from .venv. Install requirements-build.lock with this Python first.' }
$agent = Join-Path $repo 'devise-agent/devise-eye'
$version = (& $python -c "import sys; sys.path.insert(0, sys.argv[1]); from pilot_agent import VERSION; print(VERSION)" $agent).Trim()
if ($LASTEXITCODE -ne 0 -or $version -notmatch '^[a-zA-Z0-9._-]+$') { throw 'Cannot determine a safe agent version.' }
$buildId = (Get-Date).ToUniversalTime().ToString('yyyyMMddTHHmmssfffZ') + '-' + [guid]::NewGuid().ToString('N').Substring(0, 8)
$output = Join-Path $repo ".local/packages/$version/$buildId"
New-Item -ItemType Directory -Path $output -Force | Out-Null
$output = (Resolve-Path -LiteralPath $output).Path
$allowed = [IO.Path]::GetFullPath((Join-Path $repo '.local/packages')) + [IO.Path]::DirectorySeparatorChar
if (-not $output.StartsWith($allowed, [StringComparison]::OrdinalIgnoreCase)) { throw 'Package output escaped workspace.' }
# Unique directories: never delete or overwrite previous packages or credential state.
$portable = Join-Path $output 'portable'
New-Item -ItemType Directory -Path $portable | Out-Null
$sourceFiles = @(Get-ChildItem -LiteralPath $agent -File -Filter '*.py') + @(Get-Item -LiteralPath (Join-Path $agent 'data/ai_tools_registry.json')) + @(Get-ChildItem -LiteralPath (Join-Path $repo 'packaging') -File) + @(Get-Item -LiteralPath $PSCommandPath)
$sourceHashes = @{}
foreach ($file in $sourceFiles) { $sourceHashes[$file.FullName.Substring($repo.Length + 1).Replace('\', '/')] = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant() }
$registry = Join-Path $agent 'data/ai_tools_registry.json'
$buildLog = Join-Path $output 'pyinstaller.log'
$ErrorActionPreference = 'Continue' # Windows PowerShell treats native informational stderr as ErrorRecords.
try {
    & $python -m PyInstaller --noconfirm --onefile --console --noupx --name DeviseAgent --paths $agent --add-data "$registry;data" --distpath $portable --workpath (Join-Path $output 'work') --specpath $output (Join-Path $repo 'packaging/agent_entry.py') *> $buildLog
} finally { $ErrorActionPreference = 'Stop' }
if ($LASTEXITCODE -ne 0) { throw "PyInstaller failed; see $buildLog" }
foreach ($file in $sourceFiles) { if ($sourceHashes[$file.FullName.Substring($repo.Length + 1).Replace('\', '/')] -ne (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant()) { throw "Source changed during build: $($file.Name). Rebuild after edits finish." } }
$exe = Join-Path $portable 'DeviseAgent.exe'
Push-Location $output
try {
    $helpText = (& $exe --help | Out-String)
    if ($LASTEXITCODE -ne 0 -or $helpText -notmatch 'enroll' -or $helpText -notmatch 'forget') { throw 'Packaged CLI help failed.' }
    $checkText = (& $exe --package-check | Out-String)
    if ($LASTEXITCODE -ne 0) { throw 'Frozen registry check failed.' }
    $check = $checkText | ConvertFrom-Json
    if (-not $check.frozen -or $check.monitoring_started -or $check.registry_entries -lt 1 -or $check.registry_sha256 -ne (Get-FileHash -LiteralPath $registry -Algorithm SHA256).Hash.ToLowerInvariant()) { throw 'Frozen registry hash/check mismatch.' }
    $statusText = (& $exe --state-dir (Join-Path $output 'smoke-state') status | Out-String)
    if ($LASTEXITCODE -ne 0 -or ($statusText | ConvertFrom-Json).enrolled) { throw 'Fresh-state packaged status failed.' }
} finally { Pop-Location }
Copy-Item -LiteralPath (Join-Path $repo 'packaging/PORTABLE_README.md') -Destination (Join-Path $portable 'README.md')
$manifest = [ordered]@{
    schema_version = 1; version = $version; built_at_utc = (Get-Date).ToUniversalTime().ToString('o'); build_id = $buildId
    signed = $false; format = 'PyInstaller onefile console'; python = (& $python --version | Out-String).Trim(); pyinstaller = (& $python -m PyInstaller --version | Out-String).Trim()
    source_sha256 = $sourceHashes; executable_sha256 = (Get-FileHash -LiteralPath $exe -Algorithm SHA256).Hash.ToLowerInvariant()
    smoke = @{ help = 'pass'; fresh_state_status = ($statusText | ConvertFrom-Json); registry = $check }
    limitations = @('Same-machine smoke only', 'Unsigned', 'No clean-device or upgrade/uninstall validation', 'Monitoring not started')
}
$manifest | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $portable 'manifest.json') -Encoding UTF8
$zip = Join-Path $output "DeviseAgent-$version-windows-unsigned.zip"
Compress-Archive -LiteralPath $exe,(Join-Path $portable 'README.md'),(Join-Path $portable 'manifest.json') -DestinationPath $zip
$hash = (Get-FileHash -LiteralPath $zip -Algorithm SHA256).Hash.ToLowerInvariant()
"$hash  $([IO.Path]::GetFileName($zip))" | Set-Content -LiteralPath "$zip.sha256" -Encoding ASCII
Write-Output "Package: $zip"
Write-Output "SHA256: $hash"
Write-Output 'Smoke passed: help, fresh-state status, frozen registry load/hash. Monitoring was not started.'
