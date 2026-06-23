# SQL Server Lineage Incremental Process

This process follows
`docs/adr/ADR-020-Source-Agnostic-Incremental-Lineage-Ingestion.md`.

## Default Rule

SQL Server lineage ingestion is incremental by default.

Use a saved SQL Server connector:

```powershell
npm run sqlserver:lineage:ingest -- --connector-id sqlserver-l1-dwasql-02-12010-eleaddw
```

Default behavior:

- uses the shared saved connector runtime;
- does not run ad hoc SQL probes outside the connector framework;
- extracts SQL Server metadata streams for schemas, tables, views, columns,
  procedures, functions, triggers, and relationships;
- compares live metadata signatures to the DevOps lineage repo;
- writes only new or changed object markdown/context artifacts;
- upserts only the connector/database slice in the DevOps catalog repo;
- does not delete stale SQL Server objects.

The DevOps repo is the machine-readable master record:

```text
../Sonic-data-lineage/registry/object-registry.jsonl
```

Each generated object context pack stores the metadata signature used for the
next comparison. The registry itself stays schema-compatible.

## Plan Only

Use plan-only before publishing a database slice:

```powershell
npm run sqlserver:lineage:ingest -- --connector-id sqlserver-l1-dwasql-02-12010-eleaddw --plan-only
```

Plan-only reports new, changed, unchanged, and stale objects without writing to
the DevOps repo.

## Full Refresh

Use full refresh only when stale SQL Server objects for the connector/database
scope should be removed or the whole slice must be rewritten:

```powershell
npm run sqlserver:lineage:ingest -- --connector-id sqlserver-l1-dwasql-02-12010-eleaddw --full-refresh
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

For local validation without live SQL Server access:

```powershell
node scripts/ingest-sqlserver-lineage-incremental.mjs --mock-metadata tmp/sqlserver-metadata.json --plan-only
```

Mock mode exercises the same comparison and report logic, but does not connect
to SQL Server.
