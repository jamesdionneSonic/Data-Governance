# ADR-004: Use One Shared Connector Runtime

## Status

Accepted

## Date

2026-06-11

## Context

The platform had multiple ways to connect to the same source family. Ingestion Studio could connect to SQL Server successfully, while saved connector testing and profile scheduling used different code paths with different timeout, certificate, Windows-auth, diagnostics, and extraction behavior. This caused a misleading operator experience: one workflow appeared healthy, another timed out, and profile schedules could report success while extracting no live profile data.

The immediate failure pattern was observed with `VendorData`, `StagingDB`, `ETL_Staging`, and `SSIS_UAT`. Saved connector tests behaved like full metadata harvests instead of lightweight probes, and a live profile schedule selected assets with empty column metadata, planned zero actions, skipped the assets, and still reported success.

## Decision

All source access must go through one shared connector runtime per source family. For SQL Server and SSIS, Ingestion Studio, saved connectors, test buttons, profile schedules, live profile execution, metadata enrichment, and lineage extraction must reuse the same connection factory, adapter contract, diagnostics model, and error envelope.

This applies to troubleshooting too. AI agents, scripts, and developers must not bypass the runtime with direct SQL Server, ODBC, `mssql`, `msnodesqlv8`, `sqlcmd`, or SSIS probes. Any deeper diagnostic capability must be implemented as a guarded shared-runtime diagnostic with hard timeout behavior, structured diagnostics, and tests.

Connection testing is a separate test-only operation. It validates the saved connector through the shared runtime and returns diagnostics; it must not run full extraction, profile planning, schedule work, or lineage harvesting.

Recurring profile schedules must be live operational jobs. They cannot be persisted as dry-run-only schedules. Dry-run behavior remains valid for explicit ad-hoc planning and manual preview endpoints only.

Live profile scheduling must repair missing column metadata before giving up. When selected live assets do not have columns, the scheduler must fetch the missing metadata through the saved connector, update the runtime/catalog metadata needed by the planner, and replan the same run. If enrichment fails, the run must fail or partial-fail with a clear reason. It must not report success when zero live actions were produced because metadata was missing.

## Consequences

- Source-family behavior stays consistent across UI workflows, APIs, schedulers, and lineage/profile engines.
- Windows auth, named instances, port handling, certificate trust, timeouts, and runtime identity diagnostics are fixed once in the shared runtime.
- Connector tests become fast and operator-friendly because they validate connectivity rather than starting harvests.
- Profile schedules stop hiding no-op runs behind successful metadata-only summaries.
- New source support requires extending adapters and shared runtime contracts, not adding one-off route or UI connection code.

## Implementation Rules

- Do not create a second SQL Server or SSIS connection builder outside the shared runtime.
- Do not run direct SQL Server, ODBC, `mssql`, `msnodesqlv8`, `sqlcmd`, or SSIS probes outside the shared runtime, even during AI/debugging sessions.
- Do not let UI buttons select or test connectors through stale wizard state when an explicit connector id is available.
- Do not persist recurring profile schedules with `dry_run: true`.
- Do not mark a live profile schedule successful when `selected_for_this_run > 0` and `actions_planned === 0` because required column metadata is missing.
- Add parity tests whenever source connectivity, connector tests, Ingestion Studio, profile schedules, or live profiling change.

## Related Documents

- `CONTRIBUTOR.md`
- `docs/CONNECTOR_EXTRACTION_FRAMEWORK.md`
- `docs/PROFILING_EXECUTION_FRAMEWORK.md`
- `docs/CONNECTOR_RUNTIME_FIX_PLAN.md`
