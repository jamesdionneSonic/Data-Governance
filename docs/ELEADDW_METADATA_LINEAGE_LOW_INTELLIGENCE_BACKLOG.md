# eLeadDW Metadata And Lineage Low-Intelligence Backlog

This backlog decomposes `eLeadDW` onboarding into small, mechanical tasks that
can be executed one at a time with low thinking.

Use `docs/CODEX_ELEADDW_LOW_INTELLIGENCE_ONBOARDING_PACKET.md` before every
task.

No task authorizes live Azure DevOps publish, live Confluence publish, page
cleanup, auth changes, parser changes, extractor changes, or lineage-scoring
changes unless explicitly stated and separately approved.

## Current Known State

- Permanent connector exists: `sqlserver-l1-dwasql-02-12010-eleaddw`.
- Connector endpoint is configured as `L1-DWASQL-02,12010`.
- Database is `eLeadDW`.
- Framework connector test passed on 2026-06-20.
- SQL Server reported by test: `D1-DWASQL-01\INST1`.
- Step 2 metadata scope is approved by the user.

## Backlog

### ELDW-001: Record Connector Test Readback

**Goal**: Capture the current connector test status in a reviewable note.

**Inputs**:

- connector id `sqlserver-l1-dwasql-02-12010-eleaddw`;
- command from the onboarding packet Step 1.

**Deliverables**:

- a short readback note with status, server reported, database, login, and
  timestamp.

**Acceptance Criteria**:

- status is `succeeded`;
- database is `eLeadDW`;
- no secret values are written;
- no metadata extraction runs in this task.

### ELDW-002: Run eLeadDW Metadata Extraction Through Saved Connector

**Goal**: Extract approved metadata streams through the shared connector runtime.

**Inputs**:

- approved Step 2 scope;
- connector id `sqlserver-l1-dwasql-02-12010-eleaddw`.

**Streams**:

- schemas
- tables
- views
- columns
- procedures
- functions
- triggers
- relationships

**Deliverables**:

- extraction summary;
- stream result counts;
- error list;
- artifact path list.

**Acceptance Criteria**:

- object count is greater than zero;
- column count is greater than zero;
- raw business rows are not captured;
- failed streams are documented and triaged before downstream work.

### ELDW-003: Reconcile Extracted Metadata Counts

**Goal**: Verify extraction counts before building catalog artifacts.

**Inputs**:

- extraction summary from ELDW-002;
- local metadata artifact paths.

**Deliverables**:

- reconciliation note for schemas, objects, columns, procedures, functions,
  triggers, and relationship edges.

**Acceptance Criteria**:

- counts reconcile or differences are explained;
- zero-count object categories are explicitly marked as zero, not missing;
- no catalog publish occurs.

### ELDW-004: Build Local Catalog Artifacts

**Goal**: Convert extracted metadata into local catalog-ready records.

**Deliverables**:

- local markdown/catalog artifacts for `eLeadDW`;
- manifest update or dry-run manifest;
- canonical object list for `eLeadDW.dbo`.

**Acceptance Criteria**:

- `eLeadDW` appears in the local database manifest;
- `eLeadDW.dbo` appears in schema inventory;
- every extracted object has a stable identity;
- no generated owner, steward, status, SLA, freshness, or certification is
  invented.

### ELDW-005: Build And Validate Local Lineage Edges

**Goal**: Process lineage for `eLeadDW` and classify confidence.

**Deliverables**:

- upstream/downstream edge summary;
- low-confidence/review-needed edge report;
- known cross-database references report.

**Acceptance Criteria**:

- edges cite deterministic metadata or SQL/procedure evidence;
- ambiguous edges are not promoted as high confidence;
- known references into `ETL_Staging`, `Sonic_DW`, `VendorData`, `StagingDB`,
  SSIS, ADF, and SSRS are surfaced when evidence exists.

### ELDW-006: Build Azure DevOps Runtime Package Dry Run

**Goal**: Prepare machine-readable runtime artifacts without publishing.

**Deliverables**:

- object registry dry-run output;
- canonical object records;
- alias indexes;
- context packs;
- answer cards;
- upstream/downstream answer data;
- validation report.

**Acceptance Criteria**:

- `eLeadDW` records are present and count-reconciled;
- no secrets, credentials, connection strings, raw rows, or sample data appear;
- teammate consumer-kit boundaries are respected;
- live publish does not occur.

### ELDW-007: Build Human Confluence Catalog Dry Run

**Goal**: Generate human-facing database/schema pages for review only.

**Deliverables**:

- dry-run `Database Catalog / eLeadDW` page;
- dry-run `Database Catalog / eLeadDW / dbo` schema page;
- duplicate/superseded page report;
- validation report.

**Acceptance Criteria**:

- schema page is titled `dbo`, not `Schema - eLeadDW.dbo`;
- object list is complete for included schema scope;
- missing governance facts say `not surfaced in metadata`;
- no live Confluence publish occurs.

### ELDW-008: Build Rovo Retrieval Dry Run

**Goal**: Make `eLeadDW` answerable by Rovo without relying on full-page scans.

**Deliverables**:

- database context row/page;
- object locator rows;
- upstream/downstream context for priority objects;
- ambiguity context where needed;
- evaluation prompts.

**Acceptance Criteria**:

- artifacts live under AI retrieval dry-run output, not the human catalog tree;
- `Tell me about eLeadDW` has a compact deterministic answer source;
- `dwFullOpportunity` can be located if it exists in extracted metadata;
- no live publish occurs.

### ELDW-009: Review Dry Runs And Request Approval

**Goal**: Present the dry-run results and ask whether to publish.

**Deliverables**:

- summary of extraction counts;
- lineage confidence summary;
- Azure DevOps dry-run validation;
- Confluence dry-run validation;
- Rovo dry-run validation;
- explicit publish request.

**Acceptance Criteria**:

- user can approve or reject DevOps publish separately from Confluence publish;
- cleanup is not bundled with publish approval;
- unresolved failures are clearly listed.

### ELDW-010: Publish To Azure DevOps After Approval

**Goal**: Publish machine-readable artifacts only after explicit approval.

**Precondition**:

- ELDW-009 approval for Azure DevOps publish.

**Acceptance Criteria**:

- publish command succeeds;
- post-publish readback confirms `eLeadDW` objects;
- teammate-facing repos do not receive ingestion/parser/generator code.

### ELDW-011: Publish To Confluence After Approval

**Goal**: Publish human catalog and Rovo pages only after explicit approval.

**Precondition**:

- ELDW-009 approval for Confluence publish.

**Acceptance Criteria**:

- publish command succeeds;
- post-publish readback checks database, schema, and priority object pages;
- cleanup candidates remain untouched.

### ELDW-012: Final Readback And Handoff

**Goal**: Verify the full outcome and prepare handoff notes.

**Deliverables**:

- final readback answers;
- known limitations;
- refresh recommendation;
- follow-up backlog for low-confidence edges.

**Acceptance Criteria**:

- readback prompts from the packet pass;
- known gaps are explicit;
- no unsupported facts are presented as certified.
