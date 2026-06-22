---
name: MCI
product_id: product-mci
version: 1.0.0
status: published
domain: External Franchise Feed
owner: Data Engineering
steward: Data Engineering
assets:
  - L1-5FSQL-01.Sonic_DW.dbo.usp_MCIDMSServicedata
  - V1-SSIS25-01, 11040.SSISDB.MCI.Franchise.MCI_FranchiseDMS_CreateFile.dtsx
  - V1-SSIS25-01, 11040.SSISDB.FOCUS.FOCUS - Integrate Diff into
    Full.MCI_Franchise_Master.dtsx
  - V1-SSIS25-01, 11040.SSISDB.MCI.Franchise.MCI_FranchiseDMS_Master.dtsx
  - V1-SSIS25-01, 11040.SSISDB.MCI.Franchise.MCI_FranchiseDMS_MoveFile.dtsx
sla: {}
tags:
  - mci
  - franchise
  - outbound-file
certified: false
certified_by: null
certification_date: null
trust_level: lineage-documented
consumers:
  - MCI franchise feed consumers
  - External/franchise reporting support
output_port:
  type: lineage-documented asset bundle
  location: Sonic_DW
  format: SQL Server / SSIS metadata
created_at: 2026-06-17
last_updated: 2026-06-17
---

# MCI

## Plain-English Summary

MCI is an outbound franchise data feed. The SSIS evidence shows a master package, create-file package, and move-file step; the create-file package reads Sonic_DW sales/franchise data and creates an outbound file artifact.

If MCI is unavailable, franchise outbound file delivery may fail or send stale sales/franchise data.

## Product Domain

| Field                     | Value                     |
| ------------------------- | ------------------------- |
| Product                   | MCI                       |
| Domain                    | External Franchise Feed   |
| Evidence strength         | Moderate catalog evidence |
| Catalog objects matched   | 7                         |
| SSIS packages matched     | 4                         |
| Runtime package version   | 2026.6.13-1               |
| Runtime package generated | 2026-06-13T23:31:32.400Z  |

## What This Product Appears To Do

MCI is an outbound franchise data feed. The SSIS evidence shows a master package, create-file package, and move-file step; the create-file package reads Sonic_DW sales/franchise data and creates an outbound file artifact.

For support and upgrade planning, treat this product as a bundle of warehouse tables/views/procedures, SSIS packages, and external-feed artifacts rather than a single table. The highest-impact assets below are prioritized by lineage connectivity and available column metadata.

## Lineage Scope

### Object Types

| Type      | Count |
| --------- | ----- |
| package   | 4     |
| dataset   | 2     |
| procedure | 1     |

### Main Databases

| Database | Matched Objects |
| -------- | --------------- |
| Sonic_DW | 1               |

### SSIS Folders

| SSIS Folder | Matched Objects |
| ----------- | --------------- |
| MCI         | 4               |
| FOCUS       | 1               |

### Folder Catalog Matches

| Folder | Packages | Supporting Context Records | Evidence Path                 |
| ------ | -------- | -------------------------- | ----------------------------- |
| MCI    | 3        | 1                          | ssis/f/f-1468a82caa/README.md |

## Important Assets To Start With

| Asset                                                                                         | Type      | Upstream | Downstream | Columns | Confidence |
| --------------------------------------------------------------------------------------------- | --------- | -------- | ---------- | ------- | ---------- |
| `L1-5FSQL-01.Sonic_DW.dbo.usp_MCIDMSServicedata`                                              | procedure | 11       | 0          | 0       | high       |
| `V1-SSIS25-01, 11040.SSISDB.MCI.Franchise.MCI_FranchiseDMS_CreateFile.dtsx`                   | package   | 7        | 2          | 0       | medium     |
| `V1-SSIS25-01, 11040.SSISDB.FOCUS.FOCUS - Integrate Diff into Full.MCI_Franchise_Master.dtsx` | package   | 0        | 2          | 0       | very_high  |
| `V1-SSIS25-01, 11040.SSISDB.MCI.Franchise.MCI_FranchiseDMS_Master.dtsx`                       | package   | 0        | 2          | 0       | very_high  |
| `V1-SSIS25-01, 11040.SSISDB.MCI.Franchise.MCI_FranchiseDMS_MoveFile.dtsx`                     | package   | 2        | 0          | 0       | very_high  |

## SSIS / Orchestration Evidence

| Package                                                            | Upstream | Downstream | Evidence Path                                                                                                  |
| ------------------------------------------------------------------ | -------- | ---------- | -------------------------------------------------------------------------------------------------------------- |
| `MCI.Franchise.MCI_FranchiseDMS_CreateFile.dtsx`                   | 7        | 2          | servers/V1-SSIS25-01,\_11040/ssis_packages/MCI/Franchise/MCI_FranchiseDMS_CreateFile.dtsx.md                   |
| `FOCUS.FOCUS - Integrate Diff into Full.MCI_Franchise_Master.dtsx` | 0        | 2          | servers/V1-SSIS25-01,_11040/ssis_packages/FOCUS/FOCUS_-\_Integrate_Diff_into_Full/MCI_Franchise_Master.dtsx.md |
| `MCI.Franchise.MCI_FranchiseDMS_Master.dtsx`                       | 0        | 2          | servers/V1-SSIS25-01,\_11040/ssis_packages/MCI/Franchise/MCI_FranchiseDMS_Master.dtsx.md                       |
| `MCI.Franchise.MCI_FranchiseDMS_MoveFile.dtsx`                     | 2        | 0          | servers/V1-SSIS25-01,\_11040/ssis_packages/MCI/Franchise/MCI_FranchiseDMS_MoveFile.dtsx.md                     |

## Consumers And Support Impact

- MCI franchise feed consumers
- External/franchise reporting support

## Known Gaps / Caveats

- The package evidence is file-feed oriented; no MCI-named final warehouse fact table was found.

## Evidence

- Runtime package: `sonic-data-lineage-runtime` version `2026.6.13-1`, hash `514712d9e99a5e3c8e35dcb5f8fb3f74c44e98babcab3585f8a3e1957250aaff`
- Registry: `registry/canonical-objects.jsonl`
- SSIS folder index: `ssis/README.md`
- Generated from local lineage package on 2026-06-17
