param(
  [ValidateSet("profile", "daily", "daily_summary", "detail", "detail_exceptions")]
  [string]$Mode = "profile",

  [int]$DaysBack = 30,

  [int]$RowLimit = 1000,

  [switch]$PlanOnly
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$runner = Join-Path $scriptDir "run_validation.mjs"

if ($Mode -eq "daily") {
  $runnerMode = "daily_summary"
} elseif ($Mode -eq "detail") {
  $runnerMode = "detail_exceptions"
} else {
  $runnerMode = $Mode
}

$argsList = @("--mode", $runnerMode, "--days-back", "$DaysBack", "--row-limit", "$RowLimit")
if ($PlanOnly) {
  $argsList += "--plan-only"
}

& node $runner @argsList
exit $LASTEXITCODE
