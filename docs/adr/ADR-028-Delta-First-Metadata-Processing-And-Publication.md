# ADR-028: Delta-First Metadata Processing And Publication

## Status

Accepted

## Date

2026-06-29

## Context

Source metadata capture is becoming broader as the platform adds SQL Server,
SSIS, Snowflake, ADF, SSRS, BI, and future connector families. Running AI
summarization, DevOps export, Rovo artifact generation, and Confluence
publication against every discovered object on every refresh creates avoidable
cost, broad diffs, review fatigue, and publication risk.

AWS and other non-database sources add another risk: their assets do not always
fit `database.schema.object`. The delta contract must therefore accept native
platform identifiers, such as AWS S3 buckets, Glue tables, Athena workgroups,
and QuickSight dashboards, without forcing them into misleading database
shapes.

ADR-020 requires source-agnostic incremental ingestion. This ADR extends that
standard past ingestion: once source metadata is acquired and normalized, every
downstream processing step must be driven by the resulting delta unless a
reviewed full refresh is explicitly approved.

The DevOps lineage repository remains the machine-readable baseline:

`../Sonic-data-lineage`

Rovo and Confluence artifacts are generated outputs. They are not the baseline
used to decide whether source metadata changed.

## Decision

All metadata capture and publication workflows must be delta-first.

The required sequence is:

1. acquire fresh source metadata through the approved saved connector/runtime;
2. normalize the metadata into a connector-agnostic canonical shape;
3. compare the normalized metadata against the DevOps machine-readable baseline;
4. produce a delta manifest;
5. run AI summarization, documentation generation, DevOps export, Rovo artifact
   generation, and Confluence dry-run/live publication only for new or changed
   objects and directly impacted index/shard pages;
6. retain unchanged objects without regeneration;
7. require explicit approval for a scoped full refresh.

The delta manifest is the handoff contract between source ingestion and
downstream documentation/publication work.

## Delta Baseline

The comparison baseline is the DevOps lineage repo, primarily:

- `registry/object-registry.jsonl`;
- object context packs;
- source-family reports under `reports/`;
- runtime package registries and answer indexes after validated rebuild.

Rovo retrieval pages and Confluence human/support pages must not be used as the
authoritative comparison baseline. They may be used only as downstream targets
to update after the delta is known.

## Required Delta Manifest

Each source metadata capture must produce a compact machine-readable delta
manifest before any downstream write.

Minimum fields:

```json
{
  "schema_version": "1.0",
  "connector_id": "",
  "source_family": "",
  "source_scope": "",
  "baseline": "devops-lineage-repo",
  "generated_at": "",
  "mode": "plan_only|incremental|full_refresh",
  "counts": {
    "new": 0,
    "changed": 0,
    "unchanged": 0,
    "retained_stale": 0,
    "removed_stale": 0
  },
  "objects": [
    {
      "canonical_id": "",
      "status": "new|changed|unchanged|retained_stale|removed_stale",
      "prior_signature": "",
      "next_signature": "",
      "affected_targets": ["devops", "runtime", "rovo", "confluence"]
    }
  ]
}
```

The manifest must be stored with the run readback or packet output so reviewers
can prove why a downstream page, package file, or Rovo artifact changed.

## Signature Rules

Metadata signatures must be deterministic and must include stable facts that
change the meaning or dependency behavior of an object, such as:

- object identity, type, source system, database/schema/path, and parent;
- columns, fields, parameters, and data types when surfaced;
- definitions, SQL text hashes, package/pipeline structure, and report dataset
  query hashes when allowed;
- lineage edges and relationship classifications;
- ADF trigger active state, schedule metadata, pipeline child calls, datasets,
  linked-service references without secret values, and integration runtime
  references;
- cloud-native asset identity, such as AWS account, region, service, bucket,
  prefix, Glue database/table/column, Athena catalog/database/table/workgroup,
  named-query hash/references, and deterministic AWS edge rules;
- profile metadata and freshness/status signals only when those are part of the
  target artifact contract.

Signatures must exclude volatile values unless the target explicitly documents
them as runtime evidence:

- extraction timestamp;
- local file path timestamp;
- profile run id;
- activity run id;
- pipeline run id;
- transient duration;
- pagination order;
- raw payload order when a sorted canonical form is possible.

## Downstream Processing Rule

AI and publication steps must consume the delta manifest.

- DevOps updates should write only new or changed object artifacts and any
  impacted index files required to keep lookup complete.
- Runtime package rebuilds may rebuild indexes for consistency, but changed
  object content must be traceable to the delta.
- Rovo retrieval artifacts should update only impacted locator/context shards,
  ambiguity groups, and evaluation prompts.
- Confluence dry runs should include only affected human/support pages and
  directly impacted index pages.
- Live Confluence publication must publish only the reviewed dry-run scope.
- LLM summarization must run only for new or changed bounded evidence packets.

Whole-catalog AI summarization or whole-tree publication requires an explicit
full-refresh packet.

## Work Ordering

This delta-first publication work is queued after the current ADF multi-factory
work packages in `docs/ADF_MULTI_FACTORY_INGESTION_BACKLOG.md`.

Do not interrupt or retrofit the active ADF ingestion sequence mid-run unless a
new ADF packet is explicitly re-scoped. After ADF-MF-08 is complete or formally
paused, implement the source-agnostic delta engine and then require all future
connector ingestion/publication work to use it.

## Consequences

- Routine refreshes become smaller, cheaper, and easier to review.
- AI work is bounded to the metadata that actually changed.
- DevOps remains the computer-friendly source of truth.
- Rovo and Confluence become deterministic projections from reviewed deltas.
- Publication churn is reduced.
- Full refreshes remain possible but require explicit scope, reason, dry-run,
  and approval.

## Validation

Minimum validation before enabling a connector family:

- first-run fixture reports all objects as new;
- second-run fixture reports all objects as unchanged;
- modified fixture reports only the changed object and impacted indexes;
- `--plan-only` produces the same delta counts without writes;
- unchanged metadata produces no AI summarization requests;
- unchanged metadata produces no Confluence live publish candidates;
- unchanged metadata produces no Rovo shard rewrite except stable manifest or
  run-readback files when explicitly allowed;
- full refresh requires an explicit override and records the reason.

For AWS and other non-database sources, validation must also prove that AI
description packets contain bounded evidence only, preserve platform-native
identity, and mark unsupported relationships as gaps instead of guessed edges.

## Related Documents

- `docs/adr/ADR-004-Single-Shared-Connector-Runtime.md`
- `docs/adr/ADR-009-Human-Centered-Confluence-Lineage-Catalog.md`
- `docs/adr/ADR-011-Unified-Support-Documentation-Refresh-Contract.md`
- `docs/adr/ADR-015-Rovo-Optimized-AI-Retrieval-Artifacts.md`
- `docs/adr/ADR-020-Source-Agnostic-Incremental-Lineage-Ingestion.md`
- `docs/adr/ADR-027-Multi-Factory-ADF-Ingestion-And-Documentation-Backlog.md`
- `docs/adr/ADR-029-AWS-And-Non-Database-Lineage-Ingestion.md`
- `docs/AWS_LINEAGE_INGESTION.md`
- `docs/SOURCE_METADATA_DELTA_BACKLOG.md`
- `docs/SOURCE_METADATA_DELTA_WORK_PACKAGES.md`
