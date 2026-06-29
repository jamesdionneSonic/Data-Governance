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

On 2026-06-26, additional production ADF connectors were registered for future
ingestion. They must follow this incremental baseline model and the work
packages in `docs/ADF_MULTI_FACTORY_INGESTION_BACKLOG.md`.

On 2026-06-29, ADR-028 extended this rule past ingestion. The same delta that
protects source ingestion must also control AI summarization, DevOps export,
Rovo retrieval artifacts, Confluence dry-runs, and live publication.

On 2026-06-29, ADR-029 added AWS and non-database metadata as first-class
lineage sources. AWS uses native platform identity and deterministic cloud edge
rules before it enters the same delta-first ingestion workflow.

## Decision

All source metadata ingestion workflows must be incremental by default.

Each source-family ingest command must:

- read source metadata through the approved saved connector/runtime path;
- compare source metadata against the DevOps lineage repo master record;
- compute a deterministic metadata signature for each published lineage unit;
- produce a delta manifest before any generated artifact, AI summarization, or
  publication step runs;
- treat missing prior signatures as a first-run baseline and process all
  discovered objects in that scope;
- write only new or changed artifacts after the baseline exists;
- pass only new or changed objects, plus directly impacted index/shard pages, to
  downstream DevOps, runtime, Rovo, Confluence, and AI documentation steps;
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

For ADF, the source scope must be one saved ADF connector or a small approved
batch of saved ADF connectors. Multi-factory ADF ingestion must not start while
another source ingestion is already running.

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
It also does not authorize broad downstream regeneration.

The publication sequence is:

1. Run source ingest in `--plan-only` or dry-run mode when the scope is new,
   broad, or risky.
2. Review the delta manifest for new, changed, unchanged, retained stale, and
   removed stale counts.
3. Run the changed-only ingest for the approved source scope.
4. Run AI summarization and documentation generation only for new or changed
   bounded evidence packets.
5. Rebuild and validate the runtime package using the changed object set and
   required impacted indexes.
6. Sync DevOps machine-readable artifacts only for changed objects and required
   indexes/manifests.
7. Generate Rovo and Confluence dry-runs only for affected page/shard slices.
8. Publish Confluence only after explicit approval when required by the relevant
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
| AWS           | `npm run aws:lineage:ingest`       | plan_only    | `--full-refresh` |

Future source-family ingest commands must follow this ADR before they are used
for DevOps or Confluence publication.

The newly registered ADF connectors are not approved for immediate ingestion by
this ADR. They require the explicit stop-gate clearance and work packet sequence
in `docs/ADF_MULTI_FACTORY_INGESTION_BACKLOG.md`.

The source-agnostic delta-first publication engine is queued after the ADF
multi-factory work packages. See `docs/SOURCE_METADATA_DELTA_BACKLOG.md` and
`docs/SOURCE_METADATA_DELTA_WORK_PACKAGES.md`.

## Consequences

- First-run onboarding remains complete because every discovered object is new.
- Routine refreshes produce smaller, reviewable diffs.
- DevOps remains the authoritative computer-friendly source of truth.
- Confluence publication can be limited to affected pages.
- Rovo retrieval artifacts and LLM-generated descriptions can be limited to
  impacted shards and changed bounded evidence packets.
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
- `docs/AWS_LINEAGE_INGESTION.md`
- `docs/ADF_MULTI_FACTORY_INGESTION_BACKLOG.md`
- `docs/SOURCE_METADATA_DELTA_BACKLOG.md`
- `docs/SOURCE_METADATA_DELTA_WORK_PACKAGES.md`
- `docs/SONIC_LINEAGE_RUNTIME_CONSUMER_CONTRACT.md`
- `docs/CONFLUENCE_LINEAGE_REPOSITORY.md`
- `docs/adr/ADR-004-Single-Shared-Connector-Runtime.md`
- `docs/adr/ADR-009-Human-Centered-Confluence-Lineage-Catalog.md`
- `docs/adr/ADR-015-Rovo-Optimized-AI-Retrieval-Artifacts.md`
- `docs/adr/ADR-019-Linked-Server-Alias-Lineage-Refresh.md`
- `docs/adr/ADR-028-Delta-First-Metadata-Processing-And-Publication.md`
- `docs/adr/ADR-029-AWS-And-Non-Database-Lineage-Ingestion.md`
