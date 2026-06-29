# Database Catalog Full Deployment Backlog

This backlog turns the pilot work into a full deployment across every included
cataloged database.

Use with:

- `docs/adr/ADR-016-Full-Database-Catalog-Deployment-And-Cleanup.md`
- `docs/CODEX_FULL_DATABASE_CATALOG_DEPLOYMENT_PACKET.md`
- `docs/DATABASE_CATALOG_FULL_DEPLOYMENT_WORK_PACKETS.md`

No backlog item authorizes live Confluence publish or cleanup unless the user
explicitly approves a reviewed packet.

## Principles

- Full deployment means every included cataloged database, not just `Sonic_DW`.
- The final tree is
  `Database Catalog / <Platform/Product> / <Database> / <Database.Schema> / <Database.Schema> <Object Type Bucket> / <Database.Schema.Object>`.
- Old pages such as `Schema - Sonic_DW.dbo` are superseded cleanup candidates.
- Schema pages must expose every cataloged object after blocked-schema rules.
- Thin object pages are enough for broad coverage; rich pages are priority-led.
- Tier 2 broad coverage means every publishable object, with schema/database
  rows linked to canonical pages as pages are generated or verified.
- Cleanup is separate from generation and publish.
- Rovo retrieval artifacts must link to canonical human pages but remain in the
  separated `AI Retrieval Artifacts` tree.
- Published checks must reject direct object children under schema pages and
  must verify canonical parent paths, not just page titles.
- Obvious backup (`bak`, `bk`, `bkp`, or `backup`)/temp/delete/old/deprecated/drop/remove/retired/scratch tables
  are suppressed from human and Rovo catalog output and handled as cleanup
  candidates.

## Backlog

### FDCAT-001: Inventory Every Cataloged Database

**Goal**: Build a deterministic deployment inventory across all cataloged
databases.

**Scope**:

- Read the catalog manifest/indexes used by the human catalog generator.
- List included databases, schemas, and object counts.
- Apply blocked-schema rules.
- Write a deployment inventory report.

**Acceptance Criteria**:

- Every cataloged database is either included or excluded with a reason.
- Blocked schemas are counted and named.
- Counts reconcile to the source catalog.

### FDCAT-002: Define Full Deployment Manifest

**Goal**: Add a run manifest that makes every dry run and publish auditable.

**Scope**:

- Add manifest fields for run id, source catalog version, scope, deployment
  tier, counts, page actions, validation status, and cleanup candidates.
- Include hashes or source artifact references.

**Acceptance Criteria**:

- A dry run writes one manifest for the full deployment scope.
- Page counts can be compared before and after publish.

### FDCAT-003: Tier 1 Database Page Dry Run For All Included Databases

**Goal**: Generate database pages for every included database.

**Scope**:

- Database title is `<Database>`.
- Include plain-English summary, at-a-glance counts, schema library, priority
  object tags, profile coverage, known gaps, related products, and evidence.

**Acceptance Criteria**:

- Every included database has one database page in dry-run output.
- No database page is hard-coded to `Sonic_DW`.

### FDCAT-004: Tier 1 Complete Schema Index Dry Run For All Included Schemas

**Goal**: Generate clean schema pages for every included schema.

**Scope**:

- Schema title is `<Database>.<Schema>` under its database page.
- List all cataloged objects grouped by type.
- Include tags, purpose, columns, upstream/downstream counts, profile, and
  confidence.

**Acceptance Criteria**:

- No generated schema page title starts with `Schema -`.
- Every cataloged object appears once in its schema index.
- Counts reconcile per database and schema.

### FDCAT-005: Full Duplicate And Superseded Page Report

**Goal**: Identify old navigation pages before cleanup.

**Scope**:

- Report pages like `Schema - <Database>.<Schema>`.
- Report old high-value object homes.
- Report canonical replacement path and recommended action.
- Include manual-review flags when comments, attachments, or manual edits are
  surfaced.

**Acceptance Criteria**:

- Cleanup report is generated in dry-run output.
- No cleanup action is taken.

### FDCAT-006: Tier 1 Validation Gate

**Goal**: Prevent incomplete or duplicated navigation from being published.

**Scope**:

- Validate database coverage, schema coverage, object counts, canonical titles,
  blocked-schema suppression, and unsupported status/owner claims.

**Acceptance Criteria**:

- Fixture or dry-run output with `Schema - <Database>.<Schema>` fails.
- Fixture or dry-run output with omitted objects fails.
- Valid full inventory passes.

### FDCAT-007: Tier 1 Publish Packet

**Goal**: Prepare a reviewed publish packet for database and schema indexes.

**Scope**:

- Page list to create/update.
- Counts by database.
- Known gaps.
- Cleanup candidates.
- Rollback plan.

**Acceptance Criteria**:

- User can approve or reject Tier 1 from the packet.
- Cleanup remains separate.

### FDCAT-008: Tier 1 Live Publish And Verification

**Goal**: Publish approved database and schema index pages.

**Scope**:

- Run only after explicit approval.
- Publish reviewed dry-run output.
- Run post-publish validation.

**Acceptance Criteria**:

- Post-publish check passes.
- Old schema pages are not cleaned up unless separately approved.

### FDCAT-009: Tier 2 Thin Object Page Batch Strategy

**Goal**: Define safe batches for complete thin object page coverage.

**Scope**:

- Batch by platform/product, database, schema, object type, page-count slice, or
  priority tag.
- Set page-count limits per run.
- Define retry and rollback handling.
- Ensure the strategy does not permanently cap coverage at top-used objects.

**Acceptance Criteria**:

- Each batch can be completed at medium intelligence.
- Broad all-object publish is split into reviewable packets.
- Complete Tier 2 coverage remains the target.

### FDCAT-010: Tier 2 Thin Object Page Dry Run

**Goal**: Generate thin canonical object pages for one approved batch.

**Scope**:

- Include identity, tags, aliases, columns, lineage counts, profile signals,
  confidence, backlinks, related pages, technical evidence, and missing facts.
- Include link-status metadata for schema/database rows.

**Acceptance Criteria**:

- Object pages live under
  `Database Catalog / <Platform/Product> / <Database> / <Database.Schema> / <Database.Schema> <Object Type Bucket>`.
- Unsupported owner, SLA, lifecycle/status, live freshness, and certification
  are `not surfaced in metadata`.
- In-scope schema/database rows can link to canonical object pages or explain
  why the link remains pending.

### FDCAT-019: VehicleMart Live SQL And SSIS Lineage Refresh

**Goal**: Refresh VehicleMart from the saved SQL Server connector and fresh
live SSISDB metadata before publishing human or Rovo pages.

**Scope**:

- Run the saved VehicleMart SQL connector.
- Run the saved SSISDB connector and review VehicleMart/DimVehicle package
  metadata for package, task, and column-mapping edges.
- Rebuild catalog indexes and the runtime package.
- Confirm VehicleMart SQL objects and SSIS package edges reconcile in the
  DevOps runtime artifacts.

**Acceptance Criteria**:

- VehicleMart object counts are captured from live SQL metadata.
- SSIS VehicleMart package edges are present before Confluence/Rovo publish.
- Runtime checks and SSIS readiness checks pass.

### FDCAT-020: All-Database Typed Bucket Republish

**Goal**: Rebuild every included database to match the DMS typed page layout.

**Scope**:

- Generate database pages, schema pages, typed bucket pages, and thin object
  pages for every included non-SSISDB database.
- Publish the full human catalog packet.
- Verify every expected page under its exact parent.

**Acceptance Criteria**:

- Every included database uses the DMS-style typed buckets.
- Object leaf titles are fully qualified technical names.
- Live published check passes with no missing pages.

### FDCAT-021: Rovo And DevOps Dataset Refresh

**Goal**: Publish machine-readable artifacts after the typed human catalog is
live.

**Scope**:

- Export/sync DevOps lineage artifacts and runtime package.
- Build and publish Rovo retrieval artifacts.
- Confirm Rovo links point to typed canonical human pages.

**Acceptance Criteria**:

- DevOps runtime package is published/synced.
- Rovo validation and live published check pass.
- Rovo canonical human page links include the typed bucket path.

### FDCAT-022: Canonical Parent Repair And Retired-Table Cleanup

**Goal**: Repair live Confluence pages that were left directly under schema
pages and archive obvious retired-table catalog pages.

**Scope**:

- Move same-title existing pages only after resolving the intended canonical
  parent path.
- Verify schema pages have typed bucket children, not direct object children.
- Suppress obvious backup (`bak`, `bk`, `bkp`, or `backup`)/temp/delete/old/deprecated/drop/remove/retired/scratch
  tables from generated human and Rovo output.
- Archive suppressed live pages only when they have no child pages,
  attachments, or comments.

**Acceptance Criteria**:

- Published check fails on direct schema object children.
- Human and Rovo dry-run checks reject obvious retired tables.
- Cleanup readback records archived/skipped pages and risk reasons.

### FDCAT-011: Tier 2 Publish Packet And Verification

**Goal**: Publish and verify one approved thin object page batch.

**Scope**:

- Prepare reviewed packet.
- Publish only after explicit approval.
- Verify page paths, sections, labels, and counts.

**Acceptance Criteria**:

- Post-publish check passes for the batch.
- Manifest records create/update counts.

### FDCAT-012: Tier 3 Rich Object Promotion Queue

**Goal**: Decide which object pages deserve rich prose first.

**Scope**:

- Promote requested, high-use, profiled, support-critical, product-critical,
  and reviewed objects.
- Keep evidence-bound LLM prompts.

**Acceptance Criteria**:

- Promotion reasons are deterministic and stored.
- Weak evidence keeps the page thin or marks it review-needed.

### FDCAT-013: Tier 3 Rich Object Dry Run

**Goal**: Generate rich pages for one priority batch.

**Scope**:

- Add business meaning, support impact, column summary, lineage explanation,
  support checks, and related navigation.

**Acceptance Criteria**:

- Generic prose fails validation.
- Summaries cite evidence-backed technical names.

### FDCAT-014: Tier 3 Publish Packet And Verification

**Goal**: Publish and verify one rich object batch after review.

**Scope**:

- Reviewed packet.
- Explicit publish approval.
- Post-publish validation.

**Acceptance Criteria**:

- Rich pages remain evidence-bound.
- Unsupported facts are not invented.

### FDCAT-015: Rovo Link Refresh For Canonical Human Pages

**Goal**: Refresh Rovo retrieval artifacts so they point to the new canonical
human page paths.

**Scope**:

- Locator pages.
- Database context pages.
- Object summary context pages.
- Lineage context pages.
- Ambiguity groups.

**Acceptance Criteria**:

- `VendorData`, `DimVehicle`, and `FactOpportunity` prompts resolve to canonical
  pages or deterministic ambiguity groups.
- Rovo artifacts remain outside the human catalog tree.

### FDCAT-016: Cleanup Approval Packet

**Goal**: Prepare cleanup for superseded pages after replacements are verified.

**Scope**:

- Old page list.
- Replacement page links.
- Risk flags.
- Recommended cleanup action.
- Rollback plan.

**Acceptance Criteria**:

- User can approve specific cleanup actions.
- Cleanup packet does not imply automatic approval.

### FDCAT-017: Approved Cleanup And Post-Cleanup Check

**Goal**: Remove or archive approved superseded pages.

**Scope**:

- Run only with explicit cleanup approval.
- Archive/delete/move only named pages.
- Verify old navigation no longer appears.

**Acceptance Criteria**:

- Only approved pages are cleaned up.
- Canonical pages remain intact.

### FDCAT-018: Final Deployment Readback

**Goal**: Capture the final deployment state for maintainers.

**Scope**:

- Summarize counts, published pages, cleanup actions, remaining gaps, and next
  recommended rich-page batches.

**Acceptance Criteria**:

- Readback can be used by a future medium-intelligence Codex session without
  re-discovering the deployment state.
