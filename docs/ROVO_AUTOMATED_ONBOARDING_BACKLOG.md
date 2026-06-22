# Rovo Automated Database Onboarding Backlog

This backlog turns Option B into a buildable plan.

Use with:

- `docs/adr/ADR-018-Automated-Npm-Catalog-Onboarding-With-Rovo-Hard-Gate.md`
- `docs/ROVO_AUTOMATED_ONBOARDING_CONTRACT.md`
- `docs/CODEX_ROVO_AUTOMATED_ONBOARDING_PACKET.md`

## Hard Stop

Complete `ROVOAUTO-001` first and stop. Do not start later backlog items until
the Rovo output spike is reviewed and accepted.

## Backlog

### ROVOAUTO-001: Prove Rovo Output Usability

**Goal**: Determine whether Option B is technically viable.

**Scope**:

- Build one bounded evidence packet.
- Test direct Rovo invocation or an Atlassian automation bridge.
- Retrieve structured Rovo output.
- Validate the output.
- Write a readback and recommendation.

**Acceptance Criteria**:

- Node.js can retrieve machine-usable Rovo output, or the readback clearly
  explains why not.
- Codex is not used as the description-writing LLM.
- Hard stop occurs after readback.

### ROVOAUTO-002: Define Onboarding Command Interface

**Goal**: Finalize the npm command contract after the spike passes.

**Scope**:

- Add CLI arguments for connection, database, mode, Rovo mode, publish flag,
  page limit, timeout, and readback path.
- Define dry-run defaults.

**Acceptance Criteria**:

- Command can be called consistently for any saved SQL connection.
- Publish remains off by default.

### ROVOAUTO-003: Implement Incremental Scope Resolver

**Goal**: Resolve the requested connection/database without triggering a full
catalog rebuild.

**Scope**:

- Load saved connector.
- Resolve database and schemas.
- Compare current manifest to prior run.
- Build changed-only scope.

**Acceptance Criteria**:

- Organization can be selected as a single database scope.
- Existing full-catalog paths are not required for the pilot.

### ROVOAUTO-004: Implement Evidence And Confidence Pipeline

**Goal**: Generate evidence packets and confidence scores from extracted
metadata.

**Scope**:

- Database, schema, and object packets.
- Strong/medium/weak scoring.
- Missing-facts and caveat reporting.

**Acceptance Criteria**:

- Strong/medium packets are eligible for Rovo.
- Weak packets are excluded from Rovo auto-description.

### ROVOAUTO-005: Implement Hidden Rovo Context Publisher

**Goal**: Generate hidden-from-navigation context needed by Rovo.

**Scope**:

- Locator context.
- Database/object/column/lineage context.
- Ambiguity context.
- No normal-user navigation placement.

**Acceptance Criteria**:

- Context pages are findable by Rovo but not part of the main human catalog.
- Sensitive content is excluded.

### ROVOAUTO-006: Implement Rovo Auto Invocation And Retrieval

**Goal**: Productionize the invocation path proven in `ROVOAUTO-001`.

**Scope**:

- Queue management.
- Rovo trigger or automation bridge.
- Polling or retrieval.
- Timeout and retry behavior.

**Acceptance Criteria**:

- Strong/medium description batch can be run without Codex.
- Failures are deterministic and readable.

### ROVOAUTO-007: Implement Description Import, Validation, And Overrides

**Goal**: Make imported descriptions safe to publish.

**Scope**:

- Structured import.
- Validator.
- Human override precedence.
- Deterministic fallback.

**Acceptance Criteria**:

- Bad Rovo output is blocked or replaced with fallback.
- Human overrides survive refresh.

### ROVOAUTO-008: Implement Human Catalog Generation And Validation

**Goal**: Generate Organization catalog pages from metadata, Rovo descriptions,
overrides, and fallbacks.

**Scope**:

- Database, schema, and object pages.
- Metadata detail.
- Support footer.
- Validation.

**Acceptance Criteria**:

- Every included object appears once.
- Codex-authored descriptions are not present.

### ROVOAUTO-009: Implement Publish Packet, Live Publish, And Readback

**Goal**: Publish changed pages only after approval and verify.

**Scope**:

- Publish packet.
- Changed-only publish.
- Verification.
- Run readback.

**Acceptance Criteria**:

- Live publish requires explicit flag/approval.
- Readback records extraction, Rovo, validation, and publish outcomes.
