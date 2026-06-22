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

SSISDB runtime history may be used as support context, but it must not turn
static documentation into a full SSIS reporting clone. Runtime evidence is
approved only as a compact baseline on top-most workflow pages: SQL Agent entry
packages, master/orchestration packages with no package parent, or standalone
packages that are not called by another package. Child and grandchild package
pages should not receive routine runtime sections unless they are the top-most
workflow for that execution chain or a specific support exception is approved.

The runtime baseline must be framed as stale-able support evidence captured as
of the generation timestamp. It should prefer operational signals that help a
support analyst decide where to start:

- last successful run
- last failed run
- typical successful runtime, preferably median/p90 or a range rather than only
  arithmetic average
- recent failure count over a bounded lookback window
- latest meaningful redacted error or warning
- child package or task that appears to be the failure point when visible
- row-count evidence only when SSISDB captured it and it is tied to a meaningful
  source-to-target data-flow step

Do not publish broad averages, every task duration, or every row-count path by
default. These values become misleading when logging levels change, files are
empty by design, backfills run, deployments change behavior, or the catalog is
not refreshed regularly.

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
- SSISDB runtime extraction must be bounded by a lookback window, defaulting to
  90 days unless the work packet says otherwise.
- Runtime values must be redacted before being written to raw JSON, markdown,
  exported repo artifacts, runtime packages, or Confluence.
- Runtime baseline sections belong near the top of top-most workflow pages and
  may have an expandable detail block. They must not be added to every child
  package page by default.
- Runtime sections must include an `as of` timestamp and a short caveat that the
  values are support baselines, not service-level guarantees.
- Row-count evidence must be labeled as observed SSISDB data-flow movement, not
  an official source or target table count.

## Process

1. Parse raw SSIS XML and build raw package edges.
2. Normalize package, folder, and project identity from native SSIS paths.
3. Build package markdown with raw edges plus classified SSIS edge summaries.
4. Export the catalog repo with native SSIS navigation pages and separate evidence-sidecar counts.
5. Rebuild runtime-package and downstream AI navigation artifacts from the exported repo.
6. Sync the generated outputs into the DevOps catalog repo.

## Medium-Intelligence Work Packet: Top-Most Runtime Baselines

This enhancement is intentionally scoped so a balanced Codex model at normal
speed with medium thinking can implement it safely.

1. Identify top-most workflow pages from the package call graph and SQL Agent
   SSIS job steps.
2. Extract bounded runtime support data from `SSISDB.catalog.executions`,
   `catalog.event_messages`, `catalog.executable_statistics`, and, only when
   populated, `catalog.execution_data_statistics`.
3. Summarize by package key: last success, last failure, successful runtime
   median/p90 or range, failure count, latest redacted meaningful error, and
   meaningful row-count samples when present.
4. Add a compact `Runtime Baseline` section only to top-most workflow package
   pages, with optional expandable detail.
5. Rebuild local markdown, exported catalog repo artifacts, and Confluence SSIS
   pages after spot-checking at least one master package with children and one
   standalone package.

Do not broaden this work to historical dashboards, all child package pages,
unbounded event-message extraction, or raw message dumps without a separate ADR
or explicit user approval.

## Related Documents

- `docs/adr/ADR-005-Workflow-Led-UI-Surfaces.md`
- `docs/PROJECT_BACKLOG.md`
- `CONTRIBUTOR.md`
- `CONTRIBUTING.md`
