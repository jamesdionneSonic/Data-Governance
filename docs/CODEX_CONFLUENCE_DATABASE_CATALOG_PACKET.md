# Codex Confluence Database Catalog Packet

Use this packet when changing the Sonic Data Lineage `Database Catalog` pages,
schema indexes, canonical object pages, or object tags.

This packet is for the human Confluence catalog. It is not for ADF/SSIS/SSRS
support documentation roots and not for the teammate lineage consumer kit.

## Required Reading

Before making changes, read:

1. `docs/adr/ADR-013-Complete-Database-Catalog-And-Object-Library-Pages.md`
2. `docs/adr/ADR-014-Canonical-Object-Catalog-Trust-Signals-And-Medium-Backlog.md`
3. `docs/adr/ADR-015-Rovo-Optimized-AI-Retrieval-Artifacts.md`
4. `docs/adr/ADR-016-Full-Database-Catalog-Deployment-And-Cleanup.md`
5. `docs/adr/ADR-009-Human-Centered-Confluence-Lineage-Catalog.md`
6. `docs/CONFLUENCE_DATABASE_CATALOG_LAYOUT.md`
7. `docs/CONFLUENCE_HUMAN_LINEAGE_PAGE_CONTRACT.md`
8. `docs/ROVO_AI_RETRIEVAL_ARTIFACTS_CONTRACT.md`
9. `docs/CONFLUENCE_LINEAGE_REPOSITORY.md`
10. `docs/CONFLUENCE_FULL_REBUILD_SCOPE.md`
11. `docs/DATABASE_CATALOG_MEDIUM_BACKLOG.md`
12. `AI_README.md`
13. `AGENTS.md`

## Goal

Make the database catalog a complete, trustworthy object library:

- database pages summarize schema inventory;
- schema pages list every cataloged object in grouped sections;
- canonical object pages provide human-readable table/view/procedure support
  documentation;
- object tags signal high-value, high-use, profile availability, support
  criticality, product criticality, review needs, and lineage hotspots;
- thin object pages provide canonical coverage; rich pages add bounded
  plain-English support detail when evidence and tags justify it;
- page-level confidence, aliases, backlinks, and missing-facts sections protect
  users from false authority;
- DevOps runtime artifacts remain the machine-readable source of truth.
- Rovo retrieval artifacts provide compact lookup/context pages so Rovo can
  answer database, object, and lineage questions without scanning the whole
  human catalog.

## Canonical Page Tree

Use this tree:

```text
Sonic Data Lineage
  Database Catalog
    <Database>
      <Schema>
        <Canonical Object Page>
```

Use short page titles in the tree:

| Page     | Title                                                |
| -------- | ---------------------------------------------------- |
| Database | `<Database>`                                         |
| Schema   | `<Schema>`                                           |
| Object   | `<ObjectName>` unless collision requires a qualifier |

Do not create schema pages titled `Schema - <Database>.<Schema>` under the
database page. That full identity belongs inside the page body and evidence
packet.

## Medium-Safe Scope

Choose one bounded slice:

```text
Sonic_DW.dbo
one database page
one schema page
one object type within one schema
up to 25 canonical object pages
```

Allowed:

- generate dry-run markdown/HTML;
- add deterministic complete object lists to schema pages;
- add object-page evidence packets;
- add bounded LLM prose using packet facts only;
- report duplicate/superseded page titles;
- update validators and docs.

Not allowed without separate approval:

- live Confluence publish;
- deleting, archiving, or moving Confluence pages;
- broad full-catalog object-page generation;
- changing ingestion, parser, extractor, or semantic-lineage scoring behavior;
- using unrestricted raw markdown as LLM input;
- mixing AI retrieval artifact pages into the human catalog tree.
- changing Rovo retrieval artifact shape without
  `docs/CODEX_ROVO_AI_RETRIEVAL_PACKET.md`.

## Required Schema Page Evidence

Every schema page packet must include:

```json
{
  "page_type": "schema",
  "page_title": "<Schema>",
  "canonical_id": "schema:<database>.<schema>",
  "full_name": "<Database>.<Schema>",
  "database": "",
  "schema": "",
  "object_counts": {
    "total": 0,
    "tables": 0,
    "views": 0,
    "procedures": 0,
    "other": 0
  },
  "objects": [],
  "object_tags": [],
  "profile_coverage": {},
  "high_usage_objects": [],
  "objects_needing_review": [],
  "duplicate_page_candidates": [],
  "source_artifact_paths": [],
  "evidence_hash": ""
}
```

Each object row should include:

```json
{
  "name": "",
  "type": "",
  "full_name": "",
  "object_id": "",
  "column_count": null,
  "upstream_count": null,
  "downstream_count": null,
  "profile_status": "",
  "tags": [],
  "tag_reasons": [],
  "aliases": [],
  "confidence": "",
  "page_confidence": {},
  "not_surfaced_facts": [],
  "purpose": "",
  "canonical_page_path": "",
  "devops_artifact_path": ""
}
```

## Required Object Page Evidence

Canonical object pages must include:

```json
{
  "page_type": "object",
  "page_title": "<ObjectName>",
  "canonical_id": "object:<stable-object-id>",
  "object": {
    "name": "",
    "type": "",
    "database": "",
    "schema": "",
    "full_name": ""
  },
  "columns": [],
  "lineage": {
    "upstream_loaders": [],
    "upstream_sources": [],
    "orchestrators": [],
    "downstream_consumers": [],
    "downstream_reports": [],
    "maintenance_reads": []
  },
  "profile_signals": {},
  "aliases": [],
  "tags": [],
  "tag_reasons": [],
  "support_checks": [],
  "confidence": {
    "lineage_confidence": "",
    "description_confidence": "",
    "profile_confidence": "",
    "documentation_confidence": ""
  },
  "not_surfaced_facts": [],
  "backlinks": [],
  "source_artifact_paths": [],
  "evidence_hash": ""
}
```

## LLM Rules

LLM use is optional and bounded.

Allowed:

- turn packet fields into concise plain-English summaries;
- explain lineage roles from already-classified evidence;
- write support checks using named objects already in the packet.

Forbidden:

- deciding upstream/downstream relationships;
- counting objects;
- choosing Confluence paths;
- inventing owners, SLAs, source systems, or business meaning;
- inferring live freshness, lifecycle/status, or certification;
- summarizing unrestricted raw source rows or credentials;
- masking missing facts with generic language.

When evidence is missing, write `not surfaced in metadata`.

## Dry-Run Review Questions

Before live publish, answer:

1. Does the database page point to canonical schema pages?
2. Does the schema page list every cataloged table/view/procedure?
3. Are large sections grouped and readable?
4. Are high-use and high-value tags easy to find before the complete inventory?
5. Do canonical object pages show columns and plain-English lineage?
6. Are duplicate titles such as `Schema - Sonic_DW.dbo` reported?
7. Are superseded `High-Value Object - ...` pages reported instead of reused as
   canonical object homes?
8. Do object pages include aliases, backlinks, page-level confidence, and
   missing facts?
9. Are owner, lifecycle/status, and live freshness omitted or marked not
   surfaced unless explicit evidence exists?
10. Are AI retrieval artifacts kept out of the human tree?
11. Are Rovo locator/context links present when the object is expected to be
    answerable by Rovo?
12. Did the run avoid live publish and cleanup unless explicitly approved?

## Suggested Commands

Use the current wrapper commands until ADR-012 migration moves implementation
under `engines/`:

```powershell
npm run confluence:human:dry-run
npm run confluence:human:check
```

Do not run live publish commands from this packet unless the user explicitly
approves the reviewed dry run.

For catalog-wide deployment across every included database, use
`docs/CODEX_FULL_DATABASE_CATALOG_DEPLOYMENT_PACKET.md` instead of this pilot
packet.
