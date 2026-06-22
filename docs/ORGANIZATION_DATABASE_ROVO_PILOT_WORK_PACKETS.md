# Organization Database Rovo Description Pilot Work Packets

This document bundles
`docs/ORGANIZATION_DATABASE_ROVO_PILOT_BACKLOG.md` into medium-intelligence work
packets.

The pilot target is:

```text
D1-SQL-07A\INST1.Organization
```

## Credit And Token Estimate

The goal is to keep Codex out of the description-writing LLM path. Codex cost is
therefore limited to implementation, deterministic extraction orchestration,
validation, publishing support, and troubleshooting.

| Packet | Backlog Items            | Estimated Codex Tokens | Estimated Codex Credits\* |
| ------ | ------------------------ | ---------------------: | ------------------------: |
| ORG-01 | ORGROVO-001, ORGROVO-002 |                45k-75k |                     45-75 |
| ORG-02 | ORGROVO-003, ORGROVO-004 |               70k-120k |                    70-120 |
| ORG-03 | ORGROVO-005, ORGROVO-006 |                55k-95k |                     55-95 |
| ORG-04 | ORGROVO-007, ORGROVO-008 |               65k-110k |                    65-110 |
| ORG-05 | ORGROVO-009, ORGROVO-010 |                55k-95k |                     55-95 |

Estimated total: 290k-495k Codex tokens, or about 290-495 Codex credits if the
local planning conversion is 1 credit per 1,000 blended Codex tokens.

\*Actual credits depend on the active Codex billing conversion. Rovo generation
cost is intentionally outside this Codex estimate.

## Required Reading For Every Packet

1. `AI_README.md`
2. `AGENTS.md`
3. `docs/adr/ADR-017-Rovo-Assisted-Plain-English-Catalog-Descriptions.md`
4. `docs/ROVO_DESCRIPTION_GENERATION_CONTRACT.md`
5. `docs/CODEX_ROVO_DESCRIPTION_GENERATION_PACKET.md`
6. `docs/ORGANIZATION_DATABASE_ROVO_PILOT_BACKLOG.md`

## Global Guardrails

- Dry-run first.
- Use changed-only incremental scope.
- Do not use Codex as the description-writing LLM.
- Do not publish live Confluence pages without explicit approval.
- Do not publish secrets, credentials, connection strings, raw rows, or sample
  values.
- Keep Rovo context hidden from normal navigation but readable by intended Rovo
  users.
- Weak evidence gets deterministic support text, not Rovo-authored meaning.
- Human-approved overrides win on every refresh.

## ORG-01: Scope And Metadata Inventory

Backlog items: ORGROVO-001, ORGROVO-002

Estimated Codex tokens: 45k-75k

### Goal

Make `D1-SQL-07A\INST1.Organization` addressable as an incremental catalog
scope and produce a deterministic inventory.

### Deliverables

- Connector/scope configuration.
- Inventory manifest.
- Object and column counts.
- Include/exclude schema report.

### Acceptance Criteria

- Organization can be processed without full-catalog rebuild.
- Counts reconcile to extracted metadata.
- No raw data values are captured.

## ORG-02: Evidence Packets And Hidden Rovo Context

Backlog items: ORGROVO-003, ORGROVO-004

Estimated Codex tokens: 70k-120k

### Goal

Build bounded evidence packets, confidence scores, and hidden Rovo context.

### Deliverables

- Evidence packet files.
- Confidence report.
- Rovo locator/context pages.
- Ambiguity context.

### Acceptance Criteria

- Strong/medium/weak counts are reported.
- Rovo context is outside primary human navigation.
- Context contains no secrets, rows, samples, or credentials.

## ORG-03: Rovo Description Queue And Import

Backlog items: ORGROVO-005, ORGROVO-006

Estimated Codex tokens: 55k-95k

### Goal

Create the Rovo description queue and import validated Rovo outputs.

### Deliverables

- Rovo queue JSON.
- Rovo agent instruction artifact.
- Import file shape.
- Description validation report.

### Acceptance Criteria

- Queue includes only strong/medium evidence.
- Codex does not write the generated descriptions.
- Invalid or unsupported Rovo text falls back to deterministic support text.

## ORG-04: Overrides And Human Catalog Dry Run

Backlog items: ORGROVO-007, ORGROVO-008

Estimated Codex tokens: 65k-110k

### Goal

Add durable overrides and generate the Organization human catalog dry run.

### Deliverables

- Override store and validation.
- Database, schema, and object page dry run.
- Footer and support language.
- Page validation report.

### Acceptance Criteria

- Overrides beat Rovo and fallback text.
- Every included object appears once.
- Metadata detail is complete even when description confidence is weak.

## ORG-05: Rovo Evaluation, Publish Packet, And Readback

Backlog items: ORGROVO-009, ORGROVO-010

Estimated Codex tokens: 55k-95k

### Goal

Validate answer readiness and prepare live publish after approval.

### Deliverables

- Rovo evaluation prompts.
- Expected-answer checks.
- Publish packet.
- Live readback if approved and executed.

### Acceptance Criteria

- Rovo prompt set covers database, object, lineage, column, ambiguity, and
  unsupported fact questions.
- Publish packet is changed-only.
- No live publish occurs without explicit approval.

## Medium-Intelligence Handoff Prompt

```text
We are implementing the Organization database Rovo description pilot using
ADR-017. Keep scope limited to D1-SQL-07A\INST1.Organization. Codex may build
the pipeline, deterministic evidence, validation, and publish packets, but Codex
must not be the LLM author for catalog descriptions. Rovo generates
strong/medium descriptions from hidden context; weak evidence uses deterministic
support text. Start work packet <ORG-##> in dry-run mode.
```
