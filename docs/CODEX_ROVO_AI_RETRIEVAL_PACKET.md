# Codex Rovo AI Retrieval Packet

Use this packet when changing Sonic Data Lineage AI retrieval artifacts intended
for Atlassian Rovo.

This packet is not for the human database catalog page shape and not for live
Confluence publishing by itself.

## Required Reading

Before making changes, read:

1. `docs/adr/ADR-015-Rovo-Optimized-AI-Retrieval-Artifacts.md`
2. `docs/ROVO_AI_RETRIEVAL_ARTIFACTS_CONTRACT.md`
3. `docs/adr/ADR-028-Delta-First-Metadata-Processing-And-Publication.md`
4. `docs/CONFLUENCE_LINEAGE_REPOSITORY.md`
5. `docs/CONFLUENCE_FULL_REBUILD_SCOPE.md`
6. `docs/CONFLUENCE_DATABASE_CATALOG_LAYOUT.md`
7. `docs/DATABASE_CATALOG_MEDIUM_BACKLOG.md`
8. `AI_README.md`
9. `AGENTS.md`

## Goal

Make Rovo able to answer common Sonic lineage questions by searching compact,
structured Confluence retrieval pages.

The first supported question patterns are:

```text
Tell me about the database VendorData.
Tell me about the DimVehicle table.
Show me the lineage of the FactOpportunity table.
```

## Required Artifact Families

```text
Rovo Start Here
Rovo Object Locator ###
Rovo Database Context ###
Rovo Object Summary Context ###
Rovo Upstream Context ###
Rovo Downstream Context ###
Rovo Column Context ###
Rovo Profile Context ###
Rovo Ambiguity Context ###
Rovo Evaluation Prompts
```

## Medium-Safe Scope

Choose one bounded slice:

```text
one database, such as VendorData
one schema, such as Sonic_DW.dbo
one object family, such as DimVehicle or FactOpportunity
one retrieval artifact type
dry-run only
```

Allowed:

- generate local markdown/HTML dry-run output;
- add deterministic locator rows;
- add database context rows;
- add object summary context rows;
- add upstream/downstream context rows;
- add column context rows;
- add ambiguity groups;
- add evaluation prompts;
- update validators.
- update only the Rovo locator/context/evaluation shards impacted by a reviewed
  source metadata delta manifest.

Not allowed without separate approval:

- live Confluence publish;
- broad full-catalog page generation;
- broad Rovo corpus regeneration when a smaller source metadata delta exists;
- changing ingestion, parser, extractor, or semantic-lineage scoring behavior;
- using unrestricted raw markdown as LLM input;
- publishing secrets, credentials, raw rows, sample values, or connection
  strings;
- deleting, archiving, or moving Confluence pages.

Rovo output must not reintroduce human-catalog-suppressed objects. Exclude
obvious backup (`bak`, `bk`, `bkp`, or `backup`), temporary, old, deprecated, delete/drop/remove, retired,
scratch, `tmp`, `temp`, or `zzz` table names from locator rows and context
pages unless a reviewed exception says the table is a valid business asset.

## Required Locator Evidence

Every locator row must include:

```json
{
  "lookup_key": "",
  "canonical_id": "",
  "type": "",
  "database": "",
  "schema": "",
  "object": "",
  "aliases": [],
  "quick_context_page": "",
  "canonical_human_page": "",
  "confidence": "",
  "evidence_hash": ""
}
```

## Required Delta Evidence

Before generating or publishing Rovo artifacts from refreshed metadata, record:

```json
{
  "delta_manifest_path": "",
  "delta_mode": "plan_only|incremental|full_refresh",
  "new_objects": 0,
  "changed_objects": 0,
  "unchanged_objects": 0,
  "impacted_rovo_artifacts": []
}
```

Do not run LLM summary generation across unchanged Rovo records during a routine
refresh.

## Required Database Context Evidence

Every database context row or page block must include:

```json
{
  "canonical_id": "database:<database>",
  "database": "",
  "aliases": [],
  "plain_english_summary": "",
  "schemas": [],
  "object_counts": {},
  "tagged_objects": [],
  "profile_coverage": {},
  "related_products": [],
  "known_gaps": [],
  "confidence": {},
  "canonical_human_page": "",
  "generated_at": "",
  "evidence_hash": ""
}
```

## Required Object Summary Evidence

Every object summary context record must include:

```json
{
  "canonical_id": "object:<stable-object-id>",
  "full_name": "",
  "type": "",
  "database": "",
  "schema": "",
  "object": "",
  "aliases": [],
  "tags": [],
  "plain_english_summary": "",
  "column_count": null,
  "key_columns": [],
  "upstream_summary": "",
  "downstream_summary": "",
  "profile_status": "",
  "confidence": {},
  "missing_facts": [],
  "canonical_human_page": "",
  "generated_at": "",
  "evidence_hash": ""
}
```

## Required Lineage Context Evidence

Every upstream/downstream context record must include:

```json
{
  "canonical_id": "object:<stable-object-id>",
  "full_name": "",
  "upstream_sources": [],
  "upstream_loaders": [],
  "orchestrators": [],
  "downstream_consumers": [],
  "downstream_reports": [],
  "maintenance_reads": [],
  "relationship_confidence": {},
  "caveats": [],
  "canonical_human_page": "",
  "source_artifact_paths": [],
  "evidence_hash": ""
}
```

## LLM Rules

LLM use is optional and bounded.

Allowed:

- turn context records into short summaries;
- write answer-style snippets for database, object, and lineage questions;
- simplify role labels already classified by deterministic lineage processing.

Forbidden:

- resolving object identity;
- deciding lineage relationships;
- counting objects;
- choosing Confluence paths;
- inventing owners, SLAs, lifecycle/status, live freshness, certification, or
  business meaning;
- summarizing raw unrestricted source data.

When facts are missing, write `not surfaced in metadata`.

## Rovo Evaluation

Every changed artifact family should add or update evaluation prompts.

Prompt categories:

- database summary;
- exact object summary;
- normalized alias lookup;
- misspelling or casing variant;
- lineage explanation;
- column question;
- ambiguous name;
- unsupported owner/freshness/status question.

Expected responses should verify:

- the resolved canonical id;
- the retrieval page used;
- whether ambiguity was handled correctly;
- that unsupported facts were not invented.

## Dry-Run Review Questions

Before live publish, answer:

1. Can Rovo resolve `VendorData` as a database?
2. Can Rovo resolve `DimVehicle` to the best canonical object or identify
   ambiguity?
3. Can Rovo answer `FactOpportunity` lineage from upstream/downstream context?
4. Are database, object, lineage, and column contexts split by intent?
5. Are canonical human page links present?
6. Are generated pages small enough for reliable retrieval?
7. Are unsupported owner, SLA, lifecycle/status, live freshness, and
   certification facts marked as not surfaced?
8. Are raw rows, samples, secrets, and credentials absent?
9. Is there an evaluation prompt for each changed behavior?
10. Did the run avoid live publish unless explicitly approved?
11. Did the run use the reviewed delta manifest and skip unchanged objects?

## Suggested Commands

Use the current wrapper commands until ADR-012 migration moves implementation
under `engines/`:

```powershell
npm run metadata:delta:check -- --manifest <manifest.json>
npm run confluence:export
npm run confluence:check
npm run confluence:dry-run
```

Do not run live publish commands from this packet unless the user explicitly
approves the reviewed dry run.
