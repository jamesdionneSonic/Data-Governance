# ADR-006: Use Native SSIS Hierarchy And Classified Lineage Summaries

## Status

Accepted

## Date

2026-06-16

## Context

The SSIS documentation pipeline currently preserves real package paths in raw markdown and context-pack paths, but several generated summaries flatten that structure into broad rollups that are easy to misread. Folder pages can imply that all counts represent direct package movement, while sidecar evidence records such as column-mapping chunks appear beside packages without enough explanation.

The same problem appears in lineage totals. A single "read edges" or "write edges" number mixes together different behaviors:

- direct source reads
- lookup and reference reads
- target-maintenance reads used for match or dedupe logic
- direct writes
- insert, update, delete, or upsert maintenance writes

That makes package families such as `FOCUS` look implausibly large or suspicious when the totals actually include orchestration, validation, lookup, and maintenance activity. Operators need the real SSIS folder and project path first, the actual package pages second, and only then the supporting evidence records and classified lineage detail.

The platform also needs a repeatable publication process so local markdown, the exported DevOps catalog repo, and downstream runtime packages all tell the same story from the same raw SSIS XML evidence.

## Decision

SSIS documentation and lineage exports must use the native SSIS hierarchy as the primary navigation model:

- SSIS root page
- native SSIS folder page
- native SSIS project page
- package pages for actual executable work
- sidecar evidence pages only as secondary supporting records under the owning project or package

Derived grouping is still allowed for analytics or troubleshooting, but it must be labeled as derived and must never replace the primary native hierarchy.

SSIS lineage summaries must classify read and write activity instead of collapsing everything into one total. The generated markdown and exported catalog must distinguish, at minimum:

- direct source reads
- lookup reads
- target-maintenance reads
- business-consumer or contextual reads when present
- direct writes
- insert writes
- update writes
- delete writes
- upsert or maintenance writes
- package calls

Raw SSIS XML remains the source of truth for package extraction. Generated markdown, runtime context packs, and exported repo artifacts must be rebuilt from raw XML and shared semantic rules rather than edited by hand.

## Consequences

- SSIS folder and project pages become easier to trust because they match what exists in SSISDB.
- Package counts stop being inflated by evidence sidecars or misread as pure movement counts.
- Read and write totals become explainable in plain English.
- The extractor, markdown builder, runtime export, and repo sync pipeline must stay aligned on one classification model.
- Future SSIS UI or documentation work must keep native path navigation primary and treat evidence sidecars as drilldown material.

## Implementation Rules

- Primary SSIS navigation must be native `folder -> project -> package`.
- Generated copy must say `native SSIS folder/project` when that is the source, not `inferred`.
- Folder and project rollups must count executable packages separately from supporting evidence sidecars.
- Sidecar records such as SSIS column-mapping chunks must never be presented as peer packages.
- Package markdown must preserve both the raw `reads_from` and `writes_to` lists and a classified SSIS edge summary.
- Classified summaries must reuse shared semantic lineage rules whenever possible so markdown, runtime exports, and question-answering stay consistent.
- If a derived grouping or support pattern is shown, it must be labeled as derived context and must not replace the package index.
- Publication order for SSIS corrections is:
  1. rebuild package markdown from raw SSIS XML
  2. rebuild the exported catalog repo artifacts
  3. rebuild runtime-package artifacts that depend on the exported repo
  4. sync the generated artifacts into the DevOps catalog repo
- Manual edits to generated SSIS markdown or exported repo pages are temporary only and must be replaced by generator changes.

## Process

1. Parse raw SSIS XML and build raw package edges.
2. Normalize package, folder, and project identity from native SSIS paths.
3. Build package markdown with raw edges plus classified SSIS edge summaries.
4. Export the catalog repo with native SSIS navigation pages and separate evidence-sidecar counts.
5. Rebuild runtime-package and downstream AI navigation artifacts from the exported repo.
6. Sync the generated outputs into the DevOps catalog repo.

## Related Documents

- `docs/adr/ADR-005-Workflow-Led-UI-Surfaces.md`
- `docs/PROJECT_BACKLOG.md`
- `CONTRIBUTOR.md`
- `CONTRIBUTING.md`
