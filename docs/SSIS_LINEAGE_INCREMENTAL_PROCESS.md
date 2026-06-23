# SSIS Lineage Incremental Process

## Default Rule

SSIS lineage ingestion is incremental by default.

Use a saved SSIS connector:

```powershell
npm run ssis:lineage:ingest -- --connector-id <saved-ssis-connector-id>
```

Default behavior:

- uses the shared saved connector runtime;
- does not run ad hoc SQL Server or SSISDB probes outside the connector
  framework;
- extracts SSIS catalog, package XML metadata, tasks, connection managers,
  parameters, environments, SQL Agent references, and lineage edges;
- compares package metadata signatures to the DevOps lineage repo;
- writes only new or changed package markdown/context artifacts;
- upserts only the SSIS connector scope in the DevOps catalog repo;
- does not delete stale SSIS packages.

The DevOps repo is the machine-readable master record:

```text
../Sonic-data-lineage/registry/object-registry.jsonl
```

Each generated package context pack stores the metadata signature used for the
next comparison. The registry itself stays schema-compatible.

## Plan Only

Use plan-only before publishing an SSIS slice:

```powershell
npm run ssis:lineage:ingest -- --connector-id <saved-ssis-connector-id> --plan-only
```

Plan-only reports new, changed, unchanged, and stale packages without writing to
the DevOps repo.

## Scope Filters

Use filters when refreshing one folder, project, or package:

```powershell
npm run ssis:lineage:ingest -- --connector-id <saved-ssis-connector-id> --folder FinanceETL
npm run ssis:lineage:ingest -- --connector-id <saved-ssis-connector-id> --folder FinanceETL --project DailyLoads
npm run ssis:lineage:ingest -- --connector-id <saved-ssis-connector-id> --package LoadVehicle.dtsx
```

## Full Refresh

Use full refresh only when stale SSIS packages for the connector scope should be
removed or the whole slice must be rewritten:

```powershell
npm run ssis:lineage:ingest -- --connector-id <saved-ssis-connector-id> --full-refresh
```

After a successful write run, rebuild and sync the runtime package:

```powershell
npm run lineage:runtime:package
npm run lineage:runtime:check
npm run lineage:answers:check
npm run lineage:runtime:sync
```

Live Confluence publish remains a separate approved step after dry-run review.

## Test Seam

For local validation without live SSISDB access:

```powershell
node scripts/ingest-ssis-lineage-incremental.mjs --mock-metadata tests/fixtures/ssis-incremental-metadata.json --plan-only
```

Mock mode exercises the same comparison and report logic, but does not connect
to SSISDB.
