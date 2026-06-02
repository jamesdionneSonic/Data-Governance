# Lineage Brain Mini Backlog

## Purpose

This backlog covers the next steps before the first correction run and before any reprocessing pass that should converge toward zero new changes.

## 1. Template Wiring

- Make sure every correction pass writes markdown using the shared lineage template.
- Make sure fresh population runs also write the same template shape.
- Confirm the template fields are stable for SSIS and SQL Server sources.
- Add a controlled batch runner that can write corrected markdown files only when explicitly enabled.

## 2. Provenance Fields

- Populate `lineage_confidence`.
- Populate `edge_quality_score`.
- Populate `lineage_strategy`.
- Populate `lineage_pattern_class`.
- Populate `lineage_source`.
- Populate `lineage_source_path`.
- Populate `lineage_evidence_hash`.
- Populate `extraction_warnings`.

## 3. Classification Rules

- Distinguish legitimate high-fanout objects from overcapture bugs.
- Preserve allowlists for reference, lookup, mapping, staging, audit, xref, and history patterns.
- Keep direct edges separate from inferred or context-only references.

## 4. Reprocessing Safety

- Add a diff report after each run.
- Track which files changed on the first pass.
- Re-run the extractor and confirm the second pass is stable.

## 5. Engine Learning

- Persist extraction lessons in a rules file.
- Reuse prior lessons when new data sources are added.
- Keep prompt templates short and stable for low-cost runs.

## 6. Validation

- Verify the SSIS prompt generator still finds a DimVehicle baseline.
- Verify the table prompt generator still finds a stable baseline and one true anomaly.
- Validate the rendered markdown template on at least one SSIS object and one SQL object before mass updates.

## 7. Next After Correction

- Diff the corrected markdown against the original files.
- Re-run extraction on the corrected corpus.
- Confirm the second pass produces no new changes or only known, intentional adjustments.
- Promote any stable lesson into the extraction rules so future sources inherit it automatically.
