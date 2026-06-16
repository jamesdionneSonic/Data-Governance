# Codex Lineage Execution Packet Template

Use this template for Sonic lineage runtime, team Codex enablement, SSIS documentation, raw-evidence review, and rule-recommendation work.

The purpose is to make each story executable by a balanced Codex model at normal speed with medium thinking (`5.5 medium max`). Do not start implementation until the packet is filled in or a field is explicitly marked not applicable.

## Required Pre-Flight

Read these first:

1. `docs/SONIC_LINEAGE_RUNTIME_CONSUMER_CONTRACT.md`
2. `docs/TEAM_CODEX_LINEAGE_ENABLEMENT_BACKLOG.md`
3. `docs/adr/ADR-007-Team-Codex-Lineage-Runtime-Enablement.md`
4. `SKILL.sonic-data-lineage.tmp.md`

Read these when profile, quality, metric, sensitivity, or freshness evidence is involved:

1. `docs/PROFILE_INDEX_SPEC.md`
2. `docs/adr/ADR-003-Codex-Skills-Use-DevOps-Profile-Index-First.md`

Read these when SSIS documentation or SSIS lineage behavior is involved:

1. `docs/adr/ADR-006-SSIS-Native-Hierarchy-And-Classified-Lineage.md`
2. `docs/LINEAGE_RUNTIME_PACKAGE_BACKLOG.md`

## Upgrade And Stop Triggers

Stop and ask for stronger intelligence before implementation when the task includes any of these:

- changing ingestion engines, parser engines, extractor code, generator code, or catalog rebuild scripts
- changing semantic lineage scoring, edge promotion, confidence rules, or SSIS classification rules
- publishing to Azure Artifacts, pushing generated catalog repo changes, or syncing Confluence live
- changing auth, secrets, permissions, package feed configuration, or production deployment behavior
- touching more than five production files
- implementing more than one backlog story in one pass
- starting Phase 5 Azure platform expansion

For Phase 5 Azure platform expansion, use the mandatory stop prompt:

`STOP: Phase 5 starts Azure platform expansion. The package/plugin operating model must be accepted first. Do you want to continue into Azure platform work now?`

## Work Packet

### Backlog Item

- `TCE ID`:
- priority:
- current status:
- owner:

### Goal

One sentence describing the outcome:

### Source Mode

Choose one:

- Approved package mode
- Remote DevOps exact-file mode
- Developer diagnostic mode

Reason:

### Required Files To Read First

-

### Allowed Files

-

### Forbidden Changes

- Do not update ingestion engines.
- Do not update parser engines.
- Do not update extractor code.
- Do not update generator code.
- Do not update catalog rebuild scripts.
- Do not use private local lineage copies as authoritative.
- Do not guess package or repo paths. Use `indexes/entrypoints.json`,
  `indexes/path-contract.json`, `indexes/artifact-manifest.json`, registry rows,
  answer cards, or context packs for exact artifact paths.
- Do not bypass package validation gates.
- Do not start Azure platform work unless the Phase 5 hard stop is explicitly approved.

### Code Edits Allowed

Choose one:

- No code edits; documentation/config only.
- Test-only edits.
- Skill/plugin/docs edits only.
- Maintainer-approved implementation edits.

### Package Inputs

- package location:
- package version:
- runtime content hash:
- manifest path:
- artifact manifest path:
- path contract path:

### Raw Evidence Inputs

Use only if needed.

- evidence bundle/path:
- reason raw evidence is needed:
- object/package resolved from approved package first: yes/no

### Commands To Run

List exact commands. Mark any command that publishes, pushes, syncs, or writes outside the repo as approval-required.

-

### Expected Outputs

-

### Acceptance Criteria

-

### Validation

Minimum validation:

- `git diff --check`

Add relevant checks:

- package validation:
- answer-quality validation:
- profile-index safety validation:
- unit tests:
- smoke prompts:
- readback check:

### Rollback Or No-Change Rule

State what to do if validation fails:

If an expected artifact path is not advertised by the package contracts, stop and
report the missing contract entry instead of trying nearby paths.

### Completion Note

When finished, update:

- `docs/TEAM_CODEX_LINEAGE_ENABLEMENT_BACKLOG.md`
- any related ADR/contract if the story changes a decision or boundary

Include:

- files changed
- validation evidence
- package version/hash used, when applicable
- follow-up risks or blocked items
