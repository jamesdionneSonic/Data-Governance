# Lineage Brain Mini Backlog

## Purpose

This backlog covers the next steps before the first correction run and before any reprocessing pass that should converge toward zero new changes.

## 1. Template Wiring

- [x] Make sure every correction pass writes markdown using the shared lineage template.
- [x] Make sure fresh population runs also write the same template shape.
- [x] Confirm the template fields are stable for SSIS and SQL Server sources.
- [x] Add a controlled batch runner that can write corrected markdown files only when explicitly enabled.

## 2. Provenance Fields

- [x] Populate `lineage_confidence`.
- [x] Populate `edge_quality_score`.
- [x] Populate `lineage_strategy`.
- [x] Populate `lineage_pattern_class`.
- [x] Populate `lineage_source`.
- [x] Populate `lineage_source_path`.
- [x] Populate `lineage_evidence_hash`.
- [x] Populate `extraction_warnings`.

## 3. Classification Rules

- [x] Distinguish legitimate high-fanout objects from overcapture bugs.
- [x] Preserve allowlists for reference, lookup, mapping, staging, audit, xref, and history patterns.
- [x] Keep direct edges separate from inferred or context-only references.

## 4. Reprocessing Safety

- [x] Add a diff report after each run.
- [x] Track which files changed on the first pass.
- [x] Re-run the extractor and confirm the second pass is stable.

## 5. Engine Learning

- [x] Persist extraction lessons in a rules file.
- [x] Reuse prior lessons when new data sources are added.
- [x] Keep prompt templates short and stable for low-cost runs.
- [x] Propose new rules for review instead of auto-promoting them.

## 6. Validation

- [x] Verify the SSIS prompt generator still finds a DimVehicle baseline.
- [x] Verify the table prompt generator still finds a stable baseline and one true anomaly.
- [x] Validate the rendered markdown template on at least one SSIS object and one SQL object before mass updates.

## 7. Next After Correction

- [x] Diff the corrected markdown against the original files.
- [x] Re-run extraction on the corrected corpus.
- [x] Confirm the second pass produces no new changes or only known, intentional adjustments.
- [x] Promote any stable lesson into the extraction rules so future sources inherit it automatically.

## 8. Semantic Lineage Rollout

- [x] Add an orchestrated refresh command for the full semantic lineage pipeline. (`npm run lineage:semantic:refresh`)
- [ ] Re-run the raw SQL Server and SSIS extraction pipeline after semantic lineage answer-planner changes land.
- [ ] Rewrite local markdown/context outputs so semantic lineage summaries and maintenance-read classifications are embedded across the corpus.
- [ ] Rebuild runtime indexes, answer packs, and package artifacts from the corrected markdown.
- [ ] Export the refreshed corpus to the DevOps catalog repo and review the diff before publish.
- [ ] Publish or push the validated DevOps repo and runtime package updates together so the app, Codex, and downstream consumers stay in sync.

## Operational Notes

- Active reviewed rules live in `config/lineage-brain-rules.yml`.
- Proposed rules are written to `data/lineage-brain/proposed-rules.jsonl` with `status: needs_review`.
- Rejected rules can be recorded in `data/lineage-brain/rejected-rules.jsonl` to suppress repeat suggestions.
- The engine never silently promotes proposed rules into active rules; a human review/commit is required.
