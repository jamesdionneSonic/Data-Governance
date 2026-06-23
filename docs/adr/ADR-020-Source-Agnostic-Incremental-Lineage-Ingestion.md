# ADR-020: Source-Agnostic Incremental Lineage Ingestion

## Status

Accepted

## Date

2026-06-23

## Context

The lineage platform now ingests metadata from multiple source families,
including SQL Server, SSIS, Snowflake, ADF, SSRS, and future cloud or SaaS
metadata sources.

Historically, broad catalog refreshes could rebuild more of the lineage system
than the changed source required. That creates avoidable runtime, broad diffs,
larger DevOps updates, and higher Confluence publication risk.

The DevOps lineage repository is the machine-readable master record for
published lineage metadata:

`../Sonic-data-lineage`

The same rule must apply no matter which source type is being refreshed:

- first ingest establishes the baseline because no prior published record exists;
- later ingests compare against the baseline/master record;
- default processing writes only new or changed metadata;
- stale removals and whole-slice rewrites require an explicit override.

## Decision

All source metadata ingestion workflows must be incremental by default.

Each source-family ingest command must:

- read source metadata through the approved saved connector/runtime path;
- compare source metadata against the DevOps lineage repo master record;
- compute a deterministic metadata signature for each published lineage unit;
- treat missing prior signatures as a first-run baseline and process all
  discovered objects in that scope;
- write only new or changed artifacts after the baseline exists;
- retain stale objects by default;
- require an explicit `--full-refresh` or documented equivalent before removing
  stale objects or rewriting the entire source slice;
- support a `--plan-only` or documented dry-run equivalent before live DevOps or
  Confluence publication;
- write a compact run report that lists new, changed, unchanged, retained stale,
  and removed stale counts.

The default ingest mode is:

```text
incremental
```

The explicit override mode is:

```text
full_refresh
```

## Baseline Rule

The first run for a connector/source scope has no prior master record to compare
against. Therefore, the first run is allowed and expected to process every
discovered object in that scope.

This is not considered a full refresh. It is an incremental baseline run.

After that baseline exists, the same command must process only new or changed
metadata unless a user explicitly requests `--full-refresh`.

## Source Scope

The source scope must be explicit and bounded. A source scope can be:

- one connector;
- one database;
- one schema;
- one SSIS folder/project/package;
- one BI/reporting workspace or folder;
- one cloud account/database/schema;
- another documented connector-specific boundary.

Broad all-system refreshes are not the default operating mode. They require a
separate approved work packet or explicit user request.

## Master Record

The DevOps lineage repo remains the machine-readable master record used for
incremental comparison and downstream AI retrieval:

- `registry/object-registry.jsonl`;
- object context packs;
- runtime package registry and answer indexes after rebuild/sync;
- connector/source-specific reports under `reports/`.

Human Confluence pages are not the master record. Confluence is the human
navigation and explanation layer generated from reviewed machine-readable
artifacts.

## Publication Rule

Changed-only metadata ingestion does not automatically imply live publication.

The publication sequence is:

1. Run source ingest in `--plan-only` or dry-run mode when the scope is new,
   broad, or risky.
2. Run the changed-only ingest for the approved source scope.
3. Rebuild and validate the runtime package.
4. Sync DevOps machine-readable artifacts.
5. Generate Confluence dry-runs for the affected page slice.
6. Publish Confluence only after explicit approval when required by the relevant
   Confluence/support-documentation ADR.

## Override Rule

Use `--full-refresh` only when at least one of these is true:

- stale objects must be removed from the source slice;
- the metadata signature logic changed and all objects must be re-evaluated;
- the source connector identity or canonical object ID strategy changed;
- the prior baseline is known to be corrupt or incomplete;
- a user explicitly requests a full refresh for that source scope.

Full refresh must stay scoped to the requested source boundary. It must not
silently expand to the whole lineage estate.

## Current Implementations

Accepted source-family implementations:

| Source family | Command                            | Default mode | Override         |
| ------------- | ---------------------------------- | ------------ | ---------------- |
| Snowflake     | `npm run snowflake:lineage:ingest` | incremental  | `--full-refresh` |
| SQL Server    | `npm run sqlserver:lineage:ingest` | incremental  | `--full-refresh` |
| SSIS          | `npm run ssis:lineage:ingest`      | incremental  | `--full-refresh` |

Future source-family ingest commands must follow this ADR before they are used
for DevOps or Confluence publication.

## Consequences

- First-run onboarding remains complete because every discovered object is new.
- Routine refreshes produce smaller, reviewable diffs.
- DevOps remains the authoritative computer-friendly source of truth.
- Confluence publication can be limited to affected pages.
- Stale deletion becomes deliberate instead of accidental.
- Connector-specific implementations still have room to define their own
  metadata signature inputs and scope filters.

## Validation

Minimum validation for a source-family incremental ingest implementation:

- a no-live-source mock or fixture proves first-run objects are new;
- a second run against the same metadata proves unchanged detection;
- a changed fixture or real metadata change proves changed-object detection;
- `--plan-only` produces no DevOps writes;
- `--full-refresh` reports stale removals for the scoped source when stale rows
  exist;
- registry schema compatibility is preserved;
- runtime package checks pass after a real write:

```powershell
npm run lineage:runtime:package
npm run lineage:runtime:check
npm run lineage:answers:check
```

Before live Confluence publication, generate and review the affected page
dry-run according to the relevant Confluence ADR.

## Related Documents

- `docs/SNOWFLAKE_LINEAGE_INCREMENTAL_PROCESS.md`
- `docs/SQLSERVER_LINEAGE_INCREMENTAL_PROCESS.md`
- `docs/SSIS_LINEAGE_INCREMENTAL_PROCESS.md`
- `docs/SONIC_LINEAGE_RUNTIME_CONSUMER_CONTRACT.md`
- `docs/CONFLUENCE_LINEAGE_REPOSITORY.md`
- `docs/adr/ADR-004-Single-Shared-Connector-Runtime.md`
- `docs/adr/ADR-009-Human-Centered-Confluence-Lineage-Catalog.md`
- `docs/adr/ADR-015-Rovo-Optimized-AI-Retrieval-Artifacts.md`
- `docs/adr/ADR-019-Linked-Server-Alias-Lineage-Refresh.md`
