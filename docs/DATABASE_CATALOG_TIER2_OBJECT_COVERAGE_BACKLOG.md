# Database Catalog Tier 2 Object Coverage Backlog

This backlog turns Tier 2 from a small pilot into complete canonical object-page
coverage with schema/database hyperlinks.

Use with:

- `docs/adr/ADR-022-Complete-Tier2-Object-Pages-And-Schema-Hyperlinks.md`
- `docs/CODEX_DATABASE_CATALOG_TIER2_OBJECT_COVERAGE_PACKET.md`
- `docs/DATABASE_CATALOG_TIER2_OBJECT_COVERAGE_WORK_PACKETS.md`

No backlog item authorizes live Confluence publish or cleanup unless the user
explicitly approves a reviewed packet.

## Principles

- Tier 1 pages are indexes.
- Tier 2 pages are canonical object destinations.
- Tier 3 pages are richer support pages for priority objects.
- Complete Tier 2 coverage means every publishable object, not only high-use
  objects.
- Hyperlinks must use canonical object identity, not name-only matching.
- The canonical path includes platform/product:
  `Database Catalog / <Platform/Product> / <Database> / <Schema> / <Object>`.
- Rovo retrieval artifacts are not replacements for human object pages.
- Cleanup remains separate from generation and publish.

## Backlog

### T2OBJ-001: Audit Current Tier 2 Coverage

**Status**: Done in T2P-01.

**Goal**: Establish the actual current state before more generation.

**Scope**:

- Count generated Tier 2 object pages by platform, database, schema, and type.
- Count published/readback Tier 2 pages from existing packets.
- Identify schemas with high-use objects but no object pages.
- Identify stale pre-platform-grouped artifacts that must not be reused as final
  pages.

**Acceptance Criteria**:

- Report shows generated versus published Tier 2 counts.
- Report lists first missing high-use objects, including eLeadDW examples when
  present.
- Report distinguishes current-standard pages from stale pilot artifacts.

**Completion Evidence**:

- `docs/confluence-full-database-catalog-deployment/T2P-01-tier2-object-coverage-audit.md`
- `docs/confluence-full-database-catalog-deployment/T2P-01-tier2-object-coverage-manifest.jsonl`
- `npm run confluence:full:tier2:coverage:audit`

### T2OBJ-002: Define Object Coverage Manifest

**Status**: Done in T2P-01.

**Goal**: Build the machine-readable list of every publishable object that needs
or already has a Tier 2 page.

**Scope**:

- Read the full human catalog manifest and DevOps object registry.
- Apply blocked-schema rules.
- Assign canonical platform-grouped page paths.
- Mark object page status as missing, generated, published, stale, or blocked.

**Acceptance Criteria**:

- Every publishable object has one expected canonical page path.
- Ambiguous name-only cases are explicit.
- Counts reconcile to Tier 1 schema object counts.

**Completion Evidence**:

- `docs/confluence-full-database-catalog-deployment/T2P-01-tier2-object-coverage-manifest.jsonl`
- Manifest summary: 5,348 publishable objects, 25 stale live pilot pages,
  5,323 missing Tier 2 pages, and 187 high-use missing/stale objects.

### T2OBJ-003: Add Link Status To Schema Evidence

**Status**: Done in T2P-02.

**Goal**: Make schema pages know whether each row can link to a Tier 2 page.

**Scope**:

- Add `canonical_page_path`, `canonical_page_exists`, `planned_in_packet`, and
  `link_status` fields to schema/database object-row evidence.
- Preserve pending links during dry runs.

**Acceptance Criteria**:

- Schema evidence can explain why an object name is linked or pending.
- No row depends on display-name-only matching.

**Completion Evidence**:

- `docs/confluence-full-database-catalog-deployment/T2P-02-link-status-evidence-readback.md`
- `npm run confluence:human:dry-run`
- `npm run confluence:human:check`
- Readback summary: 5,348 schema object rows and 235 database high-use rows
  checked with zero missing link-state fields.

### T2OBJ-004: Generate Thin Object Pages For One Schema

**Status**: Done in T2P-03.

**Goal**: Prove complete Tier 2 coverage for one schema, not just top 25.

**Scope**:

- Select one approved platform/database/schema.
- Generate thin object pages for every publishable object in that schema.
- Include required identity, aliases, tags, columns, lineage, profile,
  confidence, backlinks, gaps, and evidence sections.

**Acceptance Criteria**:

- Object count matches publishable schema object count.
- Object pages live under the platform-grouped schema path.
- Unsupported governance facts are not inferred.

**Completion Evidence**:

- `docs/confluence-full-database-catalog-deployment/T2P-03-eleaddw-dbo-thin-object-dry-run-readback.md`
- `npm run confluence:full:tier2:eleaddw-dbo:dry-run`
- Readback summary: 55 thin object pages generated for 55 publishable
  `SQL Server / eLeadDW / dbo` objects, including `dwFullOpportunity`.

### T2OBJ-005: Hyperlink One Schema Index

**Status**: Done in T2P-03.

**Goal**: Refresh one schema page so every in-scope object row links to the
canonical Tier 2 page.

**Scope**:

- Update `Most Used Objects`, grouped object sections, profile rows, and review
  rows.
- Link only when the object page is generated in the packet or confirmed live.
- Leave deterministic pending metadata for excluded objects.

**Acceptance Criteria**:

- Every generated object page has a schema-row link.
- No link points to Rovo, old flat paths, or high-value pages.
- Ambiguous names are resolved by canonical identity.

**Completion Evidence**:

- `docs/confluence-full-database-catalog-deployment/T2P-03-eleaddw-dbo-thin-object-dry-run-readback.md`
- `npm run confluence:full:tier2:eleaddw-dbo:dry-run`
- Readback summary: schema `Most Used Objects` and grouped object rows link to
  canonical object paths under
  `Database Catalog / SQL Server / eLeadDW / dbo / <Object>`.

### T2OBJ-006: Publish Packet For One Schema

**Status**: Publish packet ready in T2P-04; live publish pending approval.

**Goal**: Prepare a reviewed Confluence publish packet for the first complete
schema-level Tier 2 slice.

**Scope**:

- Include object pages.
- Include schema/database link refresh pages as needed.
- Include counts, actions, validation results, and rollback notes.

**Acceptance Criteria**:

- Packet can be reviewed before live publish.
- Cleanup remains report-only.

**Completion Evidence**:

- `docs/confluence-full-database-catalog-deployment/T2P-04-eleaddw-dbo-publish-packet-readback.md`
- `docs/confluence-full-database-catalog-deployment/T2P-04-eleaddw-dbo-tier2-publish-packet.json`
- `docs/confluence-full-database-catalog-deployment/T2P-04-eleaddw-dbo-tier2-publish-packet.md`
- `npm run confluence:full:tier2:eleaddw-dbo:publish:dry-run`

### T2OBJ-007: Live Publish And Readback For One Schema

**Status**: Pending explicit live publish approval.

**Goal**: Publish one approved schema-level Tier 2 slice and verify links.

**Scope**:

- Run live publish only after explicit approval.
- Verify object pages, parent paths, labels, required sections, and schema links.

**Acceptance Criteria**:

- Post-publish readback passes.
- Published schema links resolve to human object pages.

### T2OBJ-008: Expand Batch Strategy Across Databases

**Status**: Done in T2P-05.

**Goal**: Turn the one-schema pattern into repeatable database/platform batches.

**Scope**:

- Batch by platform/database/schema/type/page-count.
- Define max pages per run.
- Define retry/readback expectations.
- Prioritize high-use and requested schemas without losing complete coverage.

**Acceptance Criteria**:

- Future batches can run at medium intelligence.
- Batches do not depend on hard-coded `Sonic_DW.dbo` selection.

**Completion Evidence**:

- `docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md`
- `docs/confluence-full-database-catalog-deployment/T2P-05-tier2-batch-strategy.json`
- `docs/confluence-full-database-catalog-deployment/T2P-05-tier2-batch-strategy.md`
- `npm run confluence:full:tier2:batch-strategy`
- Readback summary: 245 queued batches after the current T2P-04 live publish
  gate, capped at 75 object pages per batch.

### T2OBJ-009: Refresh Existing Pilot Tier 2 Pages

**Status**: Refresh packet ready; live Confluence publish pending explicit
approval.

**Goal**: Bring already-published pilot pages up to the current objective
schema.

**Scope**:

- Compare existing Tier 2 pages to ADR-021/ADR-022 path and content rules.
- Regenerate or mark stale pages where needed.
- Refresh links from Tier 1 pages.

**Acceptance Criteria**:

- Existing `Sonic_DW.dbo` pilot pages either comply or are queued for refresh.
- No old path pattern remains treated as canonical.

**Completion Evidence**:

- `docs/confluence-full-database-catalog-deployment/T2P-06-sonic-dw-dbo-pilot-refresh-packet.json`
- `docs/confluence-full-database-catalog-deployment/T2P-06-sonic-dw-dbo-pilot-refresh-packet.md`
- `docs/confluence-full-database-catalog-deployment/T2P-06-sonic-dw-dbo-pilot-refresh-readback.md`
- `npm run confluence:full:tier2:pilot-refresh:dry-run`
- Readback summary: 25 existing live `Sonic_DW.dbo` pilot pages identified as
  stale flat-path pages and queued for platform-grouped refresh under
  `SQL Server / Sonic_DW / dbo`; no cleanup or live publish was performed.

### T2OBJ-010: Rovo Link Alignment After Tier 2 Coverage

**Status**: Dry-run packet ready; live Rovo Confluence publish pending explicit
approval.

**Goal**: Keep Rovo retrieval links aligned with canonical human pages after
Tier 2 batches publish.

**Scope**:

- Refresh Rovo object locator/context page links after human page readback.
- Keep Rovo pages under `AI Retrieval Artifacts`.
- Do not use Rovo pages as human object-page substitutes.

**Acceptance Criteria**:

- Rovo links point to canonical human pages when pages exist.
- Missing human pages are marked pending rather than invented.

**Completion Evidence**:

- `docs/confluence-full-database-catalog-deployment/T2P-07-rovo-link-alignment-packet.json`
- `docs/confluence-full-database-catalog-deployment/T2P-07-rovo-link-alignment-packet.md`
- `docs/confluence-full-database-catalog-deployment/T2P-07-rovo-link-alignment-readback.md`
- `npm run confluence:full:tier2:rovo-link-align:dry-run`
- Readback summary: 527 Rovo human-link rows checked, 49 links aligned to the
  pending T2P-06 publish packet, 478 links explicitly marked pending, and 0 old
  flat `Database Catalog / <Database>` links remaining.

### T2OBJ-011: Full Coverage Readiness Gate

**Status**: Done; readiness gate says Tier 2 is not complete.

**Goal**: Prevent declaring Tier 2 complete until all publishable objects are
accounted for.

**Scope**:

- Compare object coverage manifest to Confluence readback.
- Report generated, published, pending, blocked, and stale counts.
- Identify remaining schemas and top missing objects.

**Acceptance Criteria**:

- Tier 2 complete means zero missing publishable objects except approved
  blocked/excluded objects.
- Final readback records gaps and next packets.

**Completion Evidence**:

- `docs/confluence-full-database-catalog-deployment/T2P-08-tier2-readiness-gate.json`
- `docs/confluence-full-database-catalog-deployment/T2P-08-tier2-readiness-gate.md`
- `docs/confluence-full-database-catalog-deployment/T2P-08-tier2-readiness-gate-readback.md`
- `npm run confluence:full:tier2:readiness-gate`
- Readback summary: 5,348 publishable Tier 2 objects, 0 current live
  platform-path object pages confirmed, 80 reviewed pending object pages, 5,268
  objects still remaining after pending packets publish, and 245 queued batches
  after the current gate.
