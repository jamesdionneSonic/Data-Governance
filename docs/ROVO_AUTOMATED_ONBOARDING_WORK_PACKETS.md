# Rovo Automated Database Onboarding Work Packets

This document bundles `docs/ROVO_AUTOMATED_ONBOARDING_BACKLOG.md` into
medium-intelligence work packets.

## Hard Stop

Do `ROVOAUTO-01` first, then stop. The rest of the work is intentionally blocked
until the Rovo output path is proven and reviewed.

## Codex Credit Estimate

| Packet      | Backlog Items              | Estimated Codex Tokens | Estimated Codex Credits\* | Gate                      |
| ----------- | -------------------------- | ---------------------: | ------------------------: | ------------------------- |
| ROVOAUTO-01 | ROVOAUTO-001               |                35k-70k |                     35-70 | Hard stop after readback  |
| ROVOAUTO-02 | ROVOAUTO-002, ROVOAUTO-003 |               60k-100k |                    60-100 | Requires spike approval   |
| ROVOAUTO-03 | ROVOAUTO-004, ROVOAUTO-005 |               80k-140k |                    80-140 | Requires spike approval   |
| ROVOAUTO-04 | ROVOAUTO-006               |               75k-130k |                    75-130 | Requires spike approval   |
| ROVOAUTO-05 | ROVOAUTO-007, ROVOAUTO-008 |               90k-160k |                    90-160 | Requires spike approval   |
| ROVOAUTO-06 | ROVOAUTO-009               |                55k-95k |                     55-95 | Requires publish approval |

Initial required spend before the pivot decision: 35k-70k Codex tokens, or
about 35-70 Codex credits using the planning conversion of 1 credit per 1,000
blended Codex tokens.

Full build if the spike passes: 395k-695k Codex tokens, or about 395-695 Codex
credits.

\*Actual credits depend on active Codex billing conversion. Rovo/Atlassian usage
is separate.

## Required Reading For Every Packet

1. `AI_README.md`
2. `AGENTS.md`
3. `docs/adr/ADR-018-Automated-Npm-Catalog-Onboarding-With-Rovo-Hard-Gate.md`
4. `docs/ROVO_AUTOMATED_ONBOARDING_CONTRACT.md`
5. `docs/CODEX_ROVO_AUTOMATED_ONBOARDING_PACKET.md`
6. `docs/ROVO_AUTOMATED_ONBOARDING_BACKLOG.md`

## ROVOAUTO-01: Rovo Output Spike

Backlog item: ROVOAUTO-001

Estimated Codex tokens: 35k-70k

### Goal

Prove whether Node.js can use Rovo output as a structured description source.

### Deliverables

- One evidence packet.
- Rovo invocation or automation bridge test.
- Retrieved output artifact.
- Validation result.
- Spike readback and recommendation.

### Acceptance Criteria

- Rovo output is machine-usable, or the failure reason is clear.
- Codex did not write the description.
- Work stops after the readback.

## ROVOAUTO-02: Command Interface And Incremental Scope

Backlog items: ROVOAUTO-002, ROVOAUTO-003

Estimated Codex tokens: 60k-100k

### Goal

Build the npm command shell and changed-only scope resolver.

### Deliverables

- CLI argument parser.
- Saved connection/database resolver.
- Changed-only manifest.
- Dry-run readback.

### Acceptance Criteria

- Organization can run as one database scope.
- `--publish` remains false by default.

## ROVOAUTO-03: Evidence And Hidden Context

Backlog items: ROVOAUTO-004, ROVOAUTO-005

Estimated Codex tokens: 80k-140k

### Goal

Generate confidence-scored evidence packets and hidden Rovo context.

### Deliverables

- Evidence packet generator.
- Confidence report.
- Hidden Rovo context output.
- Context validation.

### Acceptance Criteria

- Strong/medium/weak gates are deterministic.
- No sensitive data is published or staged.

## ROVOAUTO-04: Rovo Auto Invocation

Backlog item: ROVOAUTO-006

Estimated Codex tokens: 75k-130k

### Goal

Productionize the Rovo invocation path proven by the spike.

### Deliverables

- Queue runner.
- Trigger/poll/retrieve implementation.
- Timeout and retry handling.
- Rovo run readback.

### Acceptance Criteria

- Strong/medium descriptions can be generated without Codex orchestration.
- Failures are resumable and auditable.

## ROVOAUTO-05: Import, Overrides, And Human Catalog Dry Run

Backlog items: ROVOAUTO-007, ROVOAUTO-008

Estimated Codex tokens: 90k-160k

### Goal

Validate descriptions, apply overrides, and generate Organization human catalog
pages.

### Deliverables

- Rovo import validator.
- Override store.
- Deterministic fallback.
- Human catalog dry run.

### Acceptance Criteria

- Overrides win.
- Weak evidence uses fallback.
- Every object is represented once.

## ROVOAUTO-06: Publish Packet And Live Readback

Backlog item: ROVOAUTO-009

Estimated Codex tokens: 55k-95k

### Goal

Publish changed pages only after approval and verify the live state.

### Deliverables

- Publish packet.
- Live publish after explicit approval.
- Post-publish verification.
- Final readback.

### Acceptance Criteria

- No live publish happens without approval.
- Organization catalog and hidden Rovo context are verified.

## Handoff Prompt

```text
We are building Option B for automated npm-driven database onboarding using
ADR-018. Start with ROVOAUTO-01 only. The goal is to prove whether Rovo can
produce structured, retrievable, validated descriptions from one evidence packet
without Codex acting as the LLM. Stop after the spike readback and do not start
later packets until I approve the pivot decision.
```
