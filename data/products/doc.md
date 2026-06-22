---
name: DOC
product_id: product-doc
version: 1.0.0
status: published
domain: Dealership Operations and Accounting
owner: Data Engineering
steward: Data Engineering
assets:
  - V1-SSIS25-01, 11040.SSISDB.DOC.Projection.DOCInsertProjection.dtsx
  - V1-SSIS25-01, 11040.SSISDB.FUEL.DOC.Sonic_DW_FUEL_DOC_Actuals_Master.dtsx
  - V1-SSIS25-01, 11040.SSISDB.FIRE.DOC.Sonic_DW_FIRE_DOC_MSTR_Master.dtsx
  - V1-SSIS25-01, 11040.SSISDB.DOC.Projection.DOCMaster.dtsx
sla: {}
tags:
  - doc
  - projection
  - accounting
certified: false
certified_by: null
certification_date: null
trust_level: lineage-documented
consumers:
  - Accounting support
  - Dealership operations support
output_port:
  type: lineage-documented asset bundle
  location: ''
  format: SQL Server / SSIS metadata
created_at: 2026-06-17
last_updated: 2026-06-17
---

# DOC

## Plain-English Summary

DOC is a smaller documented product area around DOC projection / document-related accounting outputs. Current lineage evidence is mostly SSIS package-level, with limited downstream object evidence.

If DOC jobs are unavailable, projection or document-fee related downstream outputs may not refresh, but the current lineage package has limited evidence on final consumers.

## Product Domain

| Field                     | Value                                |
| ------------------------- | ------------------------------------ |
| Product                   | DOC                                  |
| Domain                    | Dealership Operations and Accounting |
| Evidence strength         | Limited catalog evidence             |
| Catalog objects matched   | 4                                    |
| SSIS packages matched     | 4                                    |
| Runtime package version   | 2026.6.13-1                          |
| Runtime package generated | 2026-06-13T23:31:32.400Z             |

## What This Product Appears To Do

DOC is a smaller documented product area around DOC projection / document-related accounting outputs. Current lineage evidence is mostly SSIS package-level, with limited downstream object evidence.

For support and upgrade planning, treat this product as a bundle of warehouse tables/views/procedures, SSIS packages, and external-feed artifacts rather than a single table. The highest-impact assets below are prioritized by lineage connectivity and available column metadata.

## Lineage Scope

### Object Types

| Type    | Count |
| ------- | ----- |
| package | 4     |

### Main Databases

_No lineage evidence found in the current package._

### SSIS Folders

| SSIS Folder | Matched Objects |
| ----------- | --------------- |
| DOC         | 2               |
| FIRE        | 1               |
| FUEL        | 1               |

### Folder Catalog Matches

| Folder | Packages | Supporting Context Records | Evidence Path                 |
| ------ | -------- | -------------------------- | ----------------------------- |
| DOC    | 2        | 0                          | ssis/f/f-c9ff9d7d29/README.md |

## Important Assets To Start With

| Asset                                                                       | Type    | Upstream | Downstream | Columns | Confidence |
| --------------------------------------------------------------------------- | ------- | -------- | ---------- | ------- | ---------- |
| `V1-SSIS25-01, 11040.SSISDB.DOC.Projection.DOCInsertProjection.dtsx`        | package | 1        | 4          | 0       | very_high  |
| `V1-SSIS25-01, 11040.SSISDB.FUEL.DOC.Sonic_DW_FUEL_DOC_Actuals_Master.dtsx` | package | 0        | 5          | 0       | very_high  |
| `V1-SSIS25-01, 11040.SSISDB.FIRE.DOC.Sonic_DW_FIRE_DOC_MSTR_Master.dtsx`    | package | 0        | 4          | 0       | very_high  |
| `V1-SSIS25-01, 11040.SSISDB.DOC.Projection.DOCMaster.dtsx`                  | package | 0        | 1          | 0       | very_high  |

## SSIS / Orchestration Evidence

| Package                                          | Upstream | Downstream | Evidence Path                                                                                |
| ------------------------------------------------ | -------- | ---------- | -------------------------------------------------------------------------------------------- |
| `DOC.Projection.DOCInsertProjection.dtsx`        | 1        | 4          | servers/V1-SSIS25-01,\_11040/ssis_packages/DOC/Projection/DOCInsertProjection.dtsx.md        |
| `FUEL.DOC.Sonic_DW_FUEL_DOC_Actuals_Master.dtsx` | 0        | 5          | servers/V1-SSIS25-01,\_11040/ssis_packages/FUEL/DOC/Sonic_DW_FUEL_DOC_Actuals_Master.dtsx.md |
| `FIRE.DOC.Sonic_DW_FIRE_DOC_MSTR_Master.dtsx`    | 0        | 4          | servers/V1-SSIS25-01,\_11040/ssis_packages/FIRE/DOC/Sonic_DW_FIRE_DOC_MSTR_Master.dtsx.md    |
| `DOC.Projection.DOCMaster.dtsx`                  | 0        | 1          | servers/V1-SSIS25-01,\_11040/ssis_packages/DOC/Projection/DOCMaster.dtsx.md                  |

## Consumers And Support Impact

- Accounting support
- Dealership operations support

## Known Gaps / Caveats

- DOC is a short token and can appear in non-product words. The generated evidence prioritizes SSIS folder/project/package evidence to avoid noisy matches.

## Evidence

- Runtime package: `sonic-data-lineage-runtime` version `2026.6.13-1`, hash `514712d9e99a5e3c8e35dcb5f8fb3f74c44e98babcab3585f8a3e1957250aaff`
- Registry: `registry/canonical-objects.jsonl`
- SSIS folder index: `ssis/README.md`
- Generated from local lineage package on 2026-06-17
