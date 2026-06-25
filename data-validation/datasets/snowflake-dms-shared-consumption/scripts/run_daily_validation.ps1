param(
  [int]$DaysBack = 30,

  [int]$RowLimit = 1000,

  [switch]$SkipWorkbook
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$datasetDir = Split-Path -Parent $scriptDir
$repoRoot = Resolve-Path (Join-Path $datasetDir "..\..\..")
$runValidation = Join-Path $scriptDir "run_validation.ps1"
$workbookBuilder = Join-Path $repoRoot ".codex-spreadsheet-wp8\build_validation_workbook.mjs"
$nodeExe = "C:\Users\james.dionne\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$operatorStatusPath = Join-Path $datasetDir "current\audit\daily_operator_status.json"
$workbookPath = Join-Path $datasetDir "excel\Snowflake_DMS_Shared_Consumption_Validation.xlsx"
$fallbackWorkbookPath = Join-Path $datasetDir ("excel\Snowflake_DMS_Shared_Consumption_Validation_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".xlsx")

function Read-JsonFile {
  param([string]$Path)
  if (-not (Test-Path $Path)) {
    return $null
  }
  return Get-Content -Path $Path -Raw | ConvertFrom-Json
}

$startedAt = (Get-Date).ToUniversalTime().ToString("o")
$status = [ordered]@{
  dataset_id = "snowflake-dms-shared-consumption"
  started_at = $startedAt
  completed_at = $null
  status = "running"
  days_back = $DaysBack
  row_limit = $RowLimit
  detail_run_id = $null
  detail_status = "not_run"
  workbook_status = if ($SkipWorkbook) { "skipped" } else { "not_run" }
  workbook_path = $workbookPath
  open_exceptions = $null
  resolved_since_last_run = $null
  warning_count = 0
  error_count = 0
  error_message = $null
}

try {
  & powershell -ExecutionPolicy Bypass -File $runValidation -Mode detail -DaysBack $DaysBack -RowLimit $RowLimit
  if ($LASTEXITCODE -ne 0) {
    throw "Detail exception run failed with exit code $LASTEXITCODE."
  }

  $manifestPath = Join-Path $datasetDir "current\audit\run_manifest.json"
  $manifest = Read-JsonFile -Path $manifestPath
  $status.detail_run_id = $manifest.run_id
  $status.detail_status = $manifest.status
  $status.warning_count = [int]$manifest.warnings.Count
  $status.error_count = [int]$manifest.errors.Count

  $exceptionCounts = $manifest.outputs | Where-Object { $_.output -eq "exception_counts" } | Select-Object -First 1
  if ($exceptionCounts) {
    $status.open_exceptions = [int]$exceptionCounts.counts.open_exceptions_written
    $status.resolved_since_last_run = [int]$exceptionCounts.counts.resolved_since_last_run_written
  }

  if (-not $SkipWorkbook) {
    if (-not (Test-Path $nodeExe)) {
      throw "Bundled Node.js executable not found: $nodeExe"
    }
    if (-not (Test-Path $workbookBuilder)) {
      throw "Workbook builder not found: $workbookBuilder"
    }
    & $nodeExe $workbookBuilder
    if ($LASTEXITCODE -ne 0) {
      $status.warning_count = [int]$status.warning_count + 1
      $env:DATA_VALIDATION_WORKBOOK_PATH = $fallbackWorkbookPath
      try {
        & $nodeExe $workbookBuilder
      } finally {
        Remove-Item Env:\DATA_VALIDATION_WORKBOOK_PATH -ErrorAction SilentlyContinue
      }
      if ($LASTEXITCODE -ne 0) {
        throw "Workbook rebuild failed with exit code $LASTEXITCODE."
      }
      $status.workbook_path = $fallbackWorkbookPath
    }
    $status.workbook_status = "succeeded"
  }

  $status.status = "succeeded"
} catch {
  $status.status = "failed"
  $status.error_count = [int]$status.error_count + 1
  $status.error_message = $_.Exception.Message
  throw
} finally {
  $status.completed_at = (Get-Date).ToUniversalTime().ToString("o")
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $operatorStatusPath) | Out-Null
  $statusJson = $status | ConvertTo-Json -Depth 8
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($operatorStatusPath, $statusJson, $utf8NoBom)
  Write-Host $statusJson
}
