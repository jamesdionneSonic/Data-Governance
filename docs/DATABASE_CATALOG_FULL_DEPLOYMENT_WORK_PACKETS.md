# Database Catalog Full Deployment Work Packets

This document bundles `docs/DATABASE_CATALOG_FULL_DEPLOYMENT_BACKLOG.md` into
medium-intelligence work packets.

Each packet is intended for balanced Codex, normal speed, medium thinking.
Live publish and cleanup still require explicit user approval.

## Token Budget Summary

| Packet | Backlog Items                              |    Estimated Tokens | Approval Needed               |
| ------ | ------------------------------------------ | ------------------: | ----------------------------- |
| FDP-01 | FDCAT-001, FDCAT-002                       |            70k-120k | No live approval              |
| FDP-02 | FDCAT-003, FDCAT-004, FDCAT-005, FDCAT-006 |           180k-300k | No live approval              |
| FDP-03 | FDCAT-007, FDCAT-008                       |            80k-140k | Live publish approval         |
| FDP-04 | FDCAT-009, FDCAT-010, FDCAT-011            | 170k-280k per batch | Live publish approval         |
| FDP-05 | FDCAT-012, FDCAT-013, FDCAT-014            | 160k-260k per batch | Live publish approval         |
| FDP-06 | FDCAT-015                                  |           110k-190k | Rovo publish approval if live |
| FDP-07 | FDCAT-016, FDCAT-017, FDCAT-018            |           100k-180k | Cleanup approval              |

Expected full deployment planning and first broad rollout: 870k-1.47M tokens,
plus additional Tier 2/Tier 3 batches as needed for page volume.

## Required Reading For Every Packet

1. `AI_README.md`
2. `AGENTS.md`
3. `docs/adr/ADR-016-Full-Database-Catalog-Deployment-And-Cleanup.md`
4. `docs/CODEX_FULL_DATABASE_CATALOG_DEPLOYMENT_PACKET.md`
5. `docs/DATABASE_CATALOG_FULL_DEPLOYMENT_BACKLOG.md`
6. `docs/CONFLUENCE_DATABASE_CATALOG_LAYOUT.md`
7. `docs/CONFLUENCE_FULL_REBUILD_SCOPE.md`
8. `docs/CONFLUENCE_HUMAN_LINEAGE_PAGE_CONTRACT.md`

## Global Guardrails

- Dry-run first.
- Full deployment means every included cataloged database.
- Do not hard-code `Sonic_DW` as the only database.
- Do not publish old `Schema - <Database>.<Schema>` pages as canonical schema
  nodes.
- Do not cleanup, archive, delete, or move pages without separate approval.
- Do not infer owners, stewards, SLAs, lifecycle/status, live freshness, or
  certification.
- Do not publish secrets, credentials, connection strings, raw rows, or sample
  values.
- Keep Rovo retrieval artifacts outside the human catalog tree.

## FDP-01: Full Inventory And Manifest

Backlog items: FDCAT-001, FDCAT-002

Estimated tokens: 70k-120k

### Goal

Create the catalog-wide deployment inventory and run manifest.

### Deliverables

- Included/excluded database inventory.
- Blocked-schema report.
- Object counts by database and schema.
- Deployment manifest shape.

### Acceptance Criteria

- Every cataloged database is accounted for.
- Counts reconcile to source catalog artifacts.
- Manifest can be reused by later packets.

## FDP-02: Tier 1 Full Dry Run And Validation

Backlog items: FDCAT-003, FDCAT-004, FDCAT-005, FDCAT-006

Estimated tokens: 180k-300k

### Goal

Generate and validate the full Tier 1 dry run: database pages and complete
schema indexes for every included database.

### Deliverables

- Dry-run database pages.
- Dry-run clean schema pages.
- Complete object indexes.
- Duplicate/superseded-page report.
- Validation report.

### Acceptance Criteria

- Every included database has a page.
- Every included schema has a clean schema page.
- Every cataloged object appears once on its schema index.
- Old `Schema - ...` pages are reported as cleanup candidates.
- No live Confluence write occurs.

## FDP-03: Tier 1 Publish And Verify

Backlog items: FDCAT-007, FDCAT-008

Estimated tokens: 80k-140k

### Goal

Publish approved database and schema index pages, then verify.

### Deliverables

- Reviewed Tier 1 publish packet.
- Live publish output after approval.
- Post-publish validation report.
- Rollback notes.

### Acceptance Criteria

- User explicitly approves live publish.
- Post-publish check passes.
- Cleanup candidates remain untouched.

## FDP-04: Tier 2 Thin Object Page Batches

Backlog items: FDCAT-009, FDCAT-010, FDCAT-011

Estimated tokens: 170k-280k per batch

### Goal

Roll out thin canonical object pages in safe batches.

### Deliverables

- Batch plan.
- Thin object page dry run.
- Publish packet.
- Live publish and verification after approval.

### Acceptance Criteria

- Object pages live under `Database Catalog / <Database> / <Schema>`.
- Pages include identity, tags, aliases, columns, lineage counts, profile
  signals, confidence, backlinks, related pages, evidence, and missing facts.
- Unsupported governance fields are not inferred.

## FDP-05: Tier 3 Rich Priority Object Batches

Backlog items: FDCAT-012, FDCAT-013, FDCAT-014

Estimated tokens: 160k-260k per batch

### Goal

Promote priority objects from thin pages to rich support pages.

### Deliverables

- Promotion queue.
- Rich object page dry run.
- Publish packet.
- Live publish and verification after approval.

### Acceptance Criteria

- Promotion reasons are deterministic.
- LLM prose uses bounded evidence packets only.
- Generic or unsupported prose fails validation.

## FDP-06: Rovo Canonical Link Refresh

Backlog item: FDCAT-015

Estimated tokens: 110k-190k

### Goal

Refresh Rovo retrieval artifacts to point to the new canonical human catalog
paths.

### Deliverables

- Locator refresh.
- Database/object/lineage context refresh.
- Ambiguity context refresh.
- Evaluation prompt check.

### Acceptance Criteria

- Rovo can resolve `VendorData`, `DimVehicle`, and `FactOpportunity`.
- Rovo context links to canonical human pages when present.
- Rovo artifacts remain under `AI Retrieval Artifacts`.

## FDP-07: Cleanup And Final Readback

Backlog items: FDCAT-016, FDCAT-017, FDCAT-018

Estimated tokens: 100k-180k

### Goal

Clean up approved superseded pages and document final deployment state.

### Deliverables

- Cleanup approval packet.
- Approved cleanup execution.
- Post-cleanup check.
- Final deployment readback.

### Acceptance Criteria

- Only explicitly approved pages are archived/deleted/moved.
- Canonical pages remain intact.
- Final readback records counts, actions, remaining gaps, and next recommended
  batches.

## Recommended Sequence

1. FDP-01: inventory and manifest.
2. FDP-02: full Tier 1 dry run.
3. FDP-03: approved Tier 1 publish.
4. FDP-04: thin object page batches.
5. FDP-05: rich priority object batches.
6. FDP-06: Rovo link refresh.
7. FDP-07: approved cleanup and final readback.

## Medium-Intelligence Handoff Prompt

Use this prompt when starting a packet:

```text
We are deploying the Sonic Data Lineage Database Catalog across every included
cataloged database using ADR-016. Read the required packet docs, stay in dry-run
mode unless I explicitly approve live publish or cleanup, and complete
<packet id>. The final tree is Database Catalog / <Database> / <Schema> /
<Object>. Old Schema - <Database>.<Schema> pages are cleanup candidates only.
```
