# Database Catalog Tier 2 Object Coverage Work Packets

This document bundles
`docs/DATABASE_CATALOG_TIER2_OBJECT_COVERAGE_BACKLOG.md` into controlled work
packets.

Each packet is intended for balanced Codex, normal speed, medium thinking.
Live publish and cleanup still require explicit user approval.

## Token Budget Summary

| Packet | Backlog Items        |     Estimated Tokens | Approval Needed               |
| ------ | -------------------- | -------------------: | ----------------------------- |
| T2P-01 | T2OBJ-001, T2OBJ-002 |             80k-140k | No live approval              |
| T2P-02 | T2OBJ-003            |              50k-90k | No live approval              |
| T2P-03 | T2OBJ-004, T2OBJ-005 | 120k-220k per schema | No live approval              |
| T2P-04 | T2OBJ-006, T2OBJ-007 |  80k-150k per schema | Live publish approval         |
| T2P-05 | T2OBJ-008            |             50k-100k | No live approval              |
| T2P-06 | T2OBJ-009            |            100k-180k | Publish approval if live      |
| T2P-07 | T2OBJ-010            |             70k-130k | Rovo publish approval if live |
| T2P-08 | T2OBJ-011            |             60k-110k | No live approval              |

## Required Reading For Every Packet

1. `AI_README.md`
2. `AGENTS.md`
3. `docs/adr/ADR-021-Platform-Grouped-Database-Catalog.md`
4. `docs/adr/ADR-022-Complete-Tier2-Object-Pages-And-Schema-Hyperlinks.md`
5. `docs/CODEX_DATABASE_CATALOG_TIER2_OBJECT_COVERAGE_PACKET.md`
6. `docs/CONFLUENCE_DATABASE_CATALOG_LAYOUT.md`
7. `docs/CONFLUENCE_HUMAN_LINEAGE_PAGE_CONTRACT.md`
8. `docs/DATABASE_CATALOG_TIER2_OBJECT_COVERAGE_BACKLOG.md`

## Global Guardrails

- Dry-run first.
- Use the platform-grouped path:
  `Database Catalog / <Platform/Product> / <Database> / <Schema> / <Object>`.
- Do not use the old flat `Database Catalog / <Database>` path.
- Do not publish cleanup/archive/delete/move actions.
- Do not infer owner, steward, SLA, lifecycle/status, live freshness, or
  certification.
- Do not publish secrets, credentials, connection strings, raw rows, or sample
  values.
- Do not link human schema rows to Rovo pages.
- Do not treat the 25-object `Sonic_DW.dbo` pilot as complete Tier 2 coverage.

## T2P-01: Tier 2 Coverage Audit And Manifest

Backlog items: T2OBJ-001, T2OBJ-002

Status: Done

Estimated tokens: 80k-140k

### Goal

Find what Tier 2 pages exist, what was published, and what every object should
resolve to.

### Deliverables

- Current Tier 2 coverage report.
- Generated versus published count comparison.
- Object coverage manifest with expected canonical paths.
- Stale pilot artifact report.

### Acceptance Criteria

- Every publishable object has a status: missing, generated, published, stale,
  or blocked.
- Counts reconcile to Tier 1 schema indexes.
- First missing high-use objects are named.

### Completion Evidence

- Audit report:
  `docs/confluence-full-database-catalog-deployment/T2P-01-tier2-object-coverage-audit.md`
- Machine-readable manifest:
  `docs/confluence-full-database-catalog-deployment/T2P-01-tier2-object-coverage-manifest.jsonl`
- Repeatable command: `npm run confluence:full:tier2:coverage:audit`
- Summary: 5,348 publishable objects, 25 stale live pilot pages, 5,323 missing
  Tier 2 pages, and 187 high-use missing/stale objects.

## T2P-02: Link Status Evidence Contract

Backlog item: T2OBJ-003

Status: Done

Estimated tokens: 50k-90k

### Goal

Add deterministic link state to schema/database evidence without publishing.

### Deliverables

- Evidence field contract update.
- Dry-run validation for `linked`, `pending`, and `blocked` link statuses.
- Ambiguity handling rule for duplicate object names.

### Acceptance Criteria

- Schema rows can explain link status.
- No link is derived from display text alone.

### Completion Evidence

- Readback:
  `docs/confluence-full-database-catalog-deployment/T2P-02-link-status-evidence-readback.md`
- Commands passed: `npm run confluence:human:dry-run` and
  `npm run confluence:human:check`
- Summary: 5,348 schema object rows and 235 database high-use rows carry
  `canonical_page_path`, `canonical_page_exists`, `planned_in_packet`,
  `link_status`, and `link_status_reason`.

## T2P-03: One-Schema Thin Object Page And Link Dry Run

Backlog items: T2OBJ-004, T2OBJ-005

Status: Done

Estimated tokens: 120k-220k per schema

### Goal

Generate complete thin Tier 2 object coverage for one approved schema and link
that schema index in dry-run output.

### Suggested First Slice

Use `SQL Server / eLeadDW / dbo` if the user wants the schema shown in the
current Confluence screenshot. This slice includes high-use objects such as
`dwFullOpportunity`.

### Deliverables

- Thin object pages for every publishable object in the selected schema.
- Refreshed schema page with linked object names where pages are generated.
- Validation report.

### Acceptance Criteria

- Object-page count equals publishable object count for the selected schema.
- Schema rows link to canonical human object pages.
- No live publish occurs.

### Completion Evidence

- Readback:
  `docs/confluence-full-database-catalog-deployment/T2P-03-eleaddw-dbo-thin-object-dry-run-readback.md`
- Command passed: `npm run confluence:full:tier2:eleaddw-dbo:dry-run`
- Summary: 57 dry-run pages generated for `SQL Server / eLeadDW / dbo`,
  including 55 thin object pages for 55 publishable schema objects. The schema
  page renders canonical links for `Most Used Objects` and grouped object rows.

## T2P-04: One-Schema Publish And Readback

Backlog items: T2OBJ-006, T2OBJ-007

Status: Publish packet ready; live publish and readback pending explicit approval

Estimated tokens: 80k-150k per schema

### Goal

Publish and verify one approved schema-level Tier 2 slice.

### Deliverables

- Reviewed publish packet.
- Live publish after explicit approval.
- Post-publish object page and hyperlink readback.

### Acceptance Criteria

- User explicitly approves live publish.
- Object pages exist under the approved parent path.
- Schema links resolve to object pages.
- Cleanup candidates are untouched.

### Current Evidence

- Publish packet readback:
  `docs/confluence-full-database-catalog-deployment/T2P-04-eleaddw-dbo-publish-packet-readback.md`
- Publish packet JSON:
  `docs/confluence-full-database-catalog-deployment/T2P-04-eleaddw-dbo-tier2-publish-packet.json`
- Publish packet markdown:
  `docs/confluence-full-database-catalog-deployment/T2P-04-eleaddw-dbo-tier2-publish-packet.md`
- Command passed: `npm run confluence:full:tier2:eleaddw-dbo:publish:dry-run`
- Summary: 59 planned entries: 2 reference parent pages, 2 database/schema
  link-refresh pages, and 55 thin object pages. Live publish and post-publish
  readback are not complete until explicitly approved and run.

## T2P-05: Repeatable Batch Strategy

Backlog item: T2OBJ-008

Status: Done

Estimated tokens: 50k-100k

### Goal

Define repeatable batches for the rest of the catalog.

### Deliverables

- Batch sizing rules.
- Priority ordering.
- Retry/readback process.
- Hand-off prompt for the next schema/database batch.

### Acceptance Criteria

- Future batches can run without hard-coded `Sonic_DW.dbo`.
- Each batch is small enough for medium-intelligence execution.

### Completion Evidence

- Strategy doc: `docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md`
- Machine-readable strategy:
  `docs/confluence-full-database-catalog-deployment/T2P-05-tier2-batch-strategy.json`
- Readback:
  `docs/confluence-full-database-catalog-deployment/T2P-05-tier2-batch-strategy.md`
- Command passed: `npm run confluence:full:tier2:batch-strategy`
- Summary: T2P-04 remains the current live publish gate for
  `SQL Server / eLeadDW / dbo`; after that gate, the strategy queues 245
  bounded batches capped at 75 object pages each.

## T2P-06: Pilot Page Refresh

Backlog item: T2OBJ-009

Estimated tokens: 100k-180k

### Goal

Refresh existing pilot Tier 2 pages to the platform-grouped objective schema.

### Deliverables

- Current pilot page compliance report.
- Refresh dry run.
- Publish packet if live refresh is requested.

### Acceptance Criteria

- Existing `Sonic_DW.dbo` pages comply with ADR-021 and ADR-022 or are queued
  as stale.
- Tier 1 links point to current canonical object pages.

## T2P-07: Rovo Link Alignment

Backlog item: T2OBJ-010

Estimated tokens: 70k-130k

### Goal

Align Rovo retrieval links after Tier 2 object pages are published.

### Deliverables

- Rovo locator/context refresh dry run.
- Human page link reconciliation.
- Rovo publish packet if requested.

### Acceptance Criteria

- Rovo pages remain under `AI Retrieval Artifacts`.
- Rovo links point to canonical human pages when available.

## T2P-08: Full Tier 2 Coverage Readiness Gate

Backlog item: T2OBJ-011

Estimated tokens: 60k-110k

### Goal

Prove whether Tier 2 is complete.

### Deliverables

- Coverage manifest versus Confluence readback comparison.
- Missing/stale/blocked object list.
- Final readiness report.

### Acceptance Criteria

- Tier 2 is not called complete unless every publishable object is generated
  and published or explicitly blocked.
- Remaining work is listed as concrete next packets.

## Starting Prompt

```text
Start the next Tier 2 object coverage packet from
docs/DATABASE_CATALOG_TIER2_OBJECT_COVERAGE_WORK_PACKETS.md. Read the required
docs, stay dry-run only unless I explicitly approve live publish, and use the
platform-grouped path Database Catalog / <Platform/Product> / <Database> /
<Schema> / <Object>. Do not cleanup pages or infer unsupported governance
facts.
```
