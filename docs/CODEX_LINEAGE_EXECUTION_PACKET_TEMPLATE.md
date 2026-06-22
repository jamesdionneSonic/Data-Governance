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

Read these when Confluence lineage documentation, human catalog pages, product
pages, database/schema pages, object pages, or plain-English generated
descriptions are involved:

1. `docs/adr/ADR-009-Human-Centered-Confluence-Lineage-Catalog.md`
2. `docs/CONFLUENCE_LINEAGE_REPOSITORY.md`
3. `docs/CONFLUENCE_HUMAN_LINEAGE_PAGE_CONTRACT.md`
4. `docs/CONFLUENCE_SPACE_MAP.md`

For SSIS runtime-baseline support documentation, keep the task medium-safe by
using the ADR-006 "Top-Most Runtime Baselines" scope:

1. Add runtime support evidence only to top-most workflow package pages: SQL
   Agent entry packages, master/orchestration packages with no package parent,
   or standalone packages not called by another package.
2. Use a bounded lookback window, default `90` days.
3. Summarize only support-useful signals: last success, last failure, typical
   successful runtime range or median/p90, recent failure count, latest
   meaningful redacted error, and meaningful row-count samples when available.
4. Label row-count evidence as observed SSISDB data-flow movement, not official
   source or target table counts.
5. Include an `as of` timestamp and stale-data caveat.
6. Do not add full runtime sections to every child or grandchild package page.

## Upgrade And Stop Triggers

Stop and ask for stronger intelligence before implementation when the task includes any of these:

- changing ingestion engines, parser engines, extractor code, generator code, or catalog rebuild scripts
- changing semantic lineage scoring, edge promotion, confidence rules, or SSIS classification rules
- publishing to Azure Artifacts, pushing generated catalog repo changes, or syncing Confluence live
- broad Confluence information-architecture changes, full-catalog page
  generation, or live publish without a reviewed dry run
- using an LLM to summarize unrestricted raw markdown instead of bounded
  evidence packets
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
- For human-facing Confluence lineage documentation, do not use Confluence as
  the machine-readable source for Sonic lineage skill answers. DevOps artifacts
  and runtime packages remain authoritative for machine retrieval.
- For human-facing Confluence summaries, do not allow an LLM to invent business
  meaning. Build a structured evidence packet first, then generate prose only
  from that evidence. Missing facts must be labeled as not surfaced in metadata.
- Do not create one page per object across the full catalog in the first pass.
  Start with product pages, database/schema browse pages, or a small set of
  high-value object pages.
- For SSIS runtime-baseline work, do not extract unbounded SSISDB message
  history, publish raw event-message dumps, expose credentials or sensitive
  runtime parameter values, or convert static SSIS support pages into a runtime
  dashboard.

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

For human-centered Confluence lineage catalog work, include:

- The page type is explicitly named: product, database, schema, object, operating
  guide, confidence/gaps, or AI retrieval artifact.
- The page starts with plain-English purpose and business/support impact before
  raw lineage fields.
- The page names upstream loaders/sources and downstream consumers/targets when
  surfaced by metadata.
- The page has concrete support checks.
- The page includes confidence, caveats, unresolved facts, or `not surfaced in
metadata` wording where evidence is weak.
- Any LLM-generated prose is based on a bounded evidence packet, not raw
  unrestricted markdown.
- AI retrieval artifacts remain separated from the primary human navigation
  tree.
- A dry run is reviewed before any live Confluence publish.

For SSIS top-most runtime-baseline work, include:

- Top-most workflow detection is documented and tested against at least one
  master package with child packages.
- Runtime extraction uses a bounded lookback window.
- Runtime values are redacted before markdown/export/Confluence output.
- Child/grandchild pages do not receive routine runtime sections.
- At least one top-most package page shows a compact `Runtime Baseline` section.
- The page states that runtime values are support baselines as of the generated
  timestamp, not service-level guarantees.

### Validation

Minimum validation:

- `git diff --check`

Add relevant checks:

- package validation:
- answer-quality validation:
- human Confluence page review:
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
