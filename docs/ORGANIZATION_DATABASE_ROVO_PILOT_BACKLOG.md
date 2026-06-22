# Organization Database Rovo Description Pilot Backlog

This backlog defines the incremental pilot for:

```text
D1-SQL-07A\INST1.Organization
```

Use with:

- `docs/adr/ADR-017-Rovo-Assisted-Plain-English-Catalog-Descriptions.md`
- `docs/ROVO_DESCRIPTION_GENERATION_CONTRACT.md`
- `docs/CODEX_ROVO_DESCRIPTION_GENERATION_PACKET.md`

No item authorizes live Confluence publish unless the user explicitly approves a
reviewed publish packet.

## Principles

- Codex is not the description-writing LLM.
- Node.js computes facts, confidence, evidence packets, and page structure.
- Rovo writes descriptions only for strong/medium evidence.
- Weak evidence uses deterministic direct support language.
- Human-approved overrides win forever.
- Publish changed pages only.

## Backlog

### ORGROVO-001: Register Organization As Incremental Catalog Scope

**Goal**: Define `D1-SQL-07A\INST1.Organization` as a bounded pilot scope.

**Scope**:

- Add or verify connector configuration through the existing framework.
- Define include/exclude schema rules.
- Confirm no SSIS package artifacts are treated as database objects.

**Acceptance Criteria**:

- The pilot scope is addressable by command.
- The scope does not trigger a full-catalog rebuild.

### ORGROVO-002: Extract Organization Metadata Inventory

**Goal**: Create deterministic inventory for the Organization database.

**Scope**:

- Extract schemas, objects, object types, columns, and available lineage links.
- Write an inventory manifest with counts and source references.

**Acceptance Criteria**:

- Counts reconcile to extracted metadata.
- No raw rows or sample values are written.

### ORGROVO-003: Build Evidence Packets And Confidence Scores

**Goal**: Produce bounded evidence packets for database, schema, and object
pages.

**Scope**:

- Build evidence packets from metadata only.
- Score each packet as strong, medium, or weak.
- Record confidence reasons and missing facts.

**Acceptance Criteria**:

- Strong/medium/weak counts are reported.
- Weak packets are excluded from Rovo description auto-generation.

### ORGROVO-004: Generate Hidden Rovo Context

**Goal**: Create hidden-from-navigation Rovo context artifacts for Organization.

**Scope**:

- Object locator rows.
- Database context.
- Object summary context.
- Upstream/downstream context where surfaced.
- Column context.
- Ambiguity context.

**Acceptance Criteria**:

- Rovo context links to canonical human pages.
- Context pages are outside the primary human catalog tree.

### ORGROVO-005: Generate Rovo Description Queue

**Goal**: Create the Rovo work queue for strong/medium descriptions.

**Scope**:

- Queue database, schema, and object packets with strong/medium confidence.
- Include evidence page links and required output schema.
- Exclude weak evidence from Rovo generation.

**Acceptance Criteria**:

- Queue contains only strong/medium packets.
- Each queued item has an evidence hash and canonical id.

### ORGROVO-006: Import And Validate Rovo Descriptions

**Goal**: Import Rovo-generated descriptions into the local cache.

**Scope**:

- Read structured Rovo output.
- Validate required fields, evidence hash, forbidden claims, and style.
- Fail unsafe or unsupported descriptions.

**Acceptance Criteria**:

- Valid descriptions are stored as Rovo-generated text.
- Invalid descriptions fall back to deterministic support text.

### ORGROVO-007: Implement Human Override Store

**Goal**: Preserve corrected descriptions across refreshes.

**Scope**:

- Add repo-backed override file shape.
- Make overrides win over Rovo and deterministic text.
- Add validation for override structure.

**Acceptance Criteria**:

- A corrected description survives regeneration.
- Overrides are not overwritten by Rovo import.

### ORGROVO-008: Generate Organization Human Catalog Dry Run

**Goal**: Create human catalog pages for Organization in dry-run mode.

**Scope**:

- Database page.
- Schema pages.
- Object pages.
- Metadata detail, lineage, columns, support checks, footer.

**Acceptance Criteria**:

- Every included object appears once.
- Pages use Rovo text, override text, or fallback text by precedence.

### ORGROVO-009: Validate Rovo Answer Readiness

**Goal**: Prove Rovo can answer Organization pilot prompts from context.

**Scope**:

- Add evaluation prompts.
- Include database summary, object summary, lineage, column, ambiguity, and
  unsupported owner/freshness prompts.

**Acceptance Criteria**:

- Expected answers cite canonical ids or context pages.
- Unsupported facts are not invented.

### ORGROVO-010: Publish Packet And Live Readback

**Goal**: Prepare and execute live publish only after approval.

**Scope**:

- Publish packet with page counts, changed-only scope, known gaps, and rollback
  notes.
- Live publish after explicit approval.
- Post-publish verification and readback.

**Acceptance Criteria**:

- No live publish occurs without approval.
- Post-publish check confirms Organization pages and Rovo context.
