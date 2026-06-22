---
name: FORCE
product_id: product-force
version: 1.0.0
status: published
domain: Fixed Operations
owner: Data Engineering
steward: Data Engineering
assets:
  - V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and
    Load.SONIC_Fact_ServiceDetail.dtsx
  - V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and
    Load.SONIC_Fact_Service.dtsx
  - V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and
    Load.SONIC_Fact_PartsSalesDetail.dtsx
  - V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and
    Load.SONIC_Dim_OpCode.dtsx
  - V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and
    Load.SONIC_Dim_Part.dtsx
  - V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and
    Load.SONIC_Dim_PricingGrid.dtsx
  - V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and
    Load.SONIC_Force_Master.dtsx
  - L1-5FSQL-01.ETL_Staging.dbo.FORCE_DateControl
  - V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and
    Load.SONIC_Force_Dims_Facts_Master.dtsx
  - L1-5FSQL-01.Sonic_DW.dbo.DM_FORCE_SUMMARY
  - L1-5FSQL-01.Sonic_DW.dbo.usp_FORCE_ServiceDetailDelete
  - V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and
    Load.SONIC_Dim_LaborType.dtsx
  - L1-5FSQL-01.Sonic_DW.dbo.usp_FORCE_MSAgg1_INCR
  - V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and
    Load.SONIC_FORCE_MSTR.dtsx
  - V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and
    Load.SONIC_FORCE_OpCodeTBD.dtsx
sla: {}
tags:
  - force
  - fixed-ops
  - service
  - parts
certified: false
certified_by: null
certification_date: null
trust_level: lineage-documented
consumers:
  - Fixed Operations reporting
  - Service leadership
  - Parts reporting
  - Operational dashboards
output_port:
  type: lineage-documented asset bundle
  location: Sonic_DW, ETL_Staging
  format: SQL Server / SSIS metadata
created_at: 2026-06-17
last_updated: 2026-06-17
---

# FORCE

## Plain-English Summary

FORCE is the fixed-operations data product for service, repair order, WIP, and parts sales reporting. The lineage points to FORCE staging/control objects and Sonic_DW fact loads for service and parts activity.

If FORCE is unavailable or stale, fixed-ops reporting can miss service, service-detail, WIP, or parts-sales activity.

## Product Domain

| Field                     | Value                    |
| ------------------------- | ------------------------ |
| Product                   | FORCE                    |
| Domain                    | Fixed Operations         |
| Evidence strength         | Strong catalog evidence  |
| Catalog objects matched   | 55                       |
| SSIS packages matched     | 16                       |
| Runtime package version   | 2026.6.13-1              |
| Runtime package generated | 2026-06-13T23:31:32.400Z |

## What This Product Appears To Do

FORCE is the fixed-operations data product for service, repair order, WIP, and parts sales reporting. The lineage points to FORCE staging/control objects and Sonic_DW fact loads for service and parts activity.

For support and upgrade planning, treat this product as a bundle of warehouse tables/views/procedures, SSIS packages, and external-feed artifacts rather than a single table. The highest-impact assets below are prioritized by lineage connectivity and available column metadata.

## Lineage Scope

### Object Types

| Type      | Count |
| --------- | ----- |
| package   | 16    |
| table     | 14    |
| dataset   | 12    |
| procedure | 11    |
| view      | 2     |

### Main Databases

| Database    | Matched Objects |
| ----------- | --------------- |
| Sonic_DW    | 17              |
| ETL_Staging | 10              |

### SSIS Folders

| SSIS Folder | Matched Objects |
| ----------- | --------------- |
| FORCE       | 27              |

### Folder Catalog Matches

| Folder | Packages | Supporting Context Records | Evidence Path                 |
| ------ | -------- | -------------------------- | ----------------------------- |
| FORCE  | 16       | 11                         | ssis/f/f-bd16a5030b/README.md |

## Important Assets To Start With

| Asset                                                                                                   | Type      | Upstream | Downstream | Columns | Confidence   |
| ------------------------------------------------------------------------------------------------------- | --------- | -------- | ---------- | ------- | ------------ |
| `V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and Load.SONIC_Fact_ServiceDetail.dtsx`      | package   | 13       | 10         | 0       | medium       |
| `V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and Load.SONIC_Fact_Service.dtsx`            | package   | 8        | 13         | 0       | high         |
| `V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and Load.SONIC_Fact_PartsSalesDetail.dtsx`   | package   | 14       | 4          | 0       | high         |
| `V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and Load.SONIC_Dim_OpCode.dtsx`              | package   | 6        | 4          | 0       | high         |
| `V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and Load.SONIC_Dim_Part.dtsx`                | package   | 7        | 3          | 0       | medium       |
| `V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and Load.SONIC_Dim_PricingGrid.dtsx`         | package   | 6        | 4          | 0       | medium       |
| `V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and Load.SONIC_Force_Master.dtsx`            | package   | 0        | 10         | 0       | very_high    |
| `L1-5FSQL-01.ETL_Staging.dbo.FORCE_DateControl`                                                         | table     | 3        | 6          | 3       | very_high    |
| `V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and Load.SONIC_Force_Dims_Facts_Master.dtsx` | package   | 0        | 9          | 0       | very_high    |
| `L1-5FSQL-01.Sonic_DW.dbo.DM_FORCE_SUMMARY`                                                             | table     | 3        | 3          | 91      | very_high    |
| `L1-5FSQL-01.Sonic_DW.dbo.usp_FORCE_ServiceDetailDelete`                                                | procedure | 7        | 0          | 0       | needs_review |
| `V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and Load.SONIC_Dim_LaborType.dtsx`           | package   | 4        | 3          | 0       | very_high    |
| `L1-5FSQL-01.Sonic_DW.dbo.usp_FORCE_MSAgg1_INCR`                                                        | procedure | 5        | 1          | 0       | medium       |
| `V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and Load.SONIC_FORCE_MSTR.dtsx`              | package   | 2        | 4          | 0       | very_high    |
| `V1-SSIS25-01, 11040.SSISDB.FORCE.FORCE - Dependency Check and Load.SONIC_FORCE_OpCodeTBD.dtsx`         | package   | 4        | 2          | 0       | high         |

## SSIS / Orchestration Evidence

| Package                                                                        | Upstream | Downstream | Evidence Path                                                                                                              |
| ------------------------------------------------------------------------------ | -------- | ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| `FORCE.FORCE - Dependency Check and Load.SONIC_Fact_ServiceDetail.dtsx`        | 13       | 10         | servers/V1-SSIS25-01,_11040/ssis_packages/FORCE/FORCE_-\_Dependency_Check_and_Load/SONIC_Fact_ServiceDetail.dtsx.md        |
| `FORCE.FORCE - Dependency Check and Load.SONIC_Fact_Service.dtsx`              | 8        | 13         | servers/V1-SSIS25-01,_11040/ssis_packages/FORCE/FORCE_-\_Dependency_Check_and_Load/SONIC_Fact_Service.dtsx.md              |
| `FORCE.FORCE - Dependency Check and Load.SONIC_Fact_PartsSalesDetail.dtsx`     | 14       | 4          | servers/V1-SSIS25-01,_11040/ssis_packages/FORCE/FORCE_-\_Dependency_Check_and_Load/SONIC_Fact_PartsSalesDetail.dtsx.md     |
| `FORCE.FORCE - Dependency Check and Load.SONIC_Dim_OpCode.dtsx`                | 6        | 4          | servers/V1-SSIS25-01,_11040/ssis_packages/FORCE/FORCE_-\_Dependency_Check_and_Load/SONIC_Dim_OpCode.dtsx.md                |
| `FORCE.FORCE - Dependency Check and Load.SONIC_Dim_Part.dtsx`                  | 7        | 3          | servers/V1-SSIS25-01,_11040/ssis_packages/FORCE/FORCE_-\_Dependency_Check_and_Load/SONIC_Dim_Part.dtsx.md                  |
| `FORCE.FORCE - Dependency Check and Load.SONIC_Dim_PricingGrid.dtsx`           | 6        | 4          | servers/V1-SSIS25-01,_11040/ssis_packages/FORCE/FORCE_-\_Dependency_Check_and_Load/SONIC_Dim_PricingGrid.dtsx.md           |
| `FORCE.FORCE - Dependency Check and Load.SONIC_Force_Master.dtsx`              | 0        | 10         | servers/V1-SSIS25-01,_11040/ssis_packages/FORCE/FORCE_-\_Dependency_Check_and_Load/SONIC_Force_Master.dtsx.md              |
| `FORCE.FORCE - Dependency Check and Load.SONIC_Force_Dims_Facts_Master.dtsx`   | 0        | 9          | servers/V1-SSIS25-01,_11040/ssis_packages/FORCE/FORCE_-\_Dependency_Check_and_Load/SONIC_Force_Dims_Facts_Master.dtsx.md   |
| `FORCE.FORCE - Dependency Check and Load.SONIC_Dim_LaborType.dtsx`             | 4        | 3          | servers/V1-SSIS25-01,_11040/ssis_packages/FORCE/FORCE_-\_Dependency_Check_and_Load/SONIC_Dim_LaborType.dtsx.md             |
| `FORCE.FORCE - Dependency Check and Load.SONIC_FORCE_MSTR.dtsx`                | 2        | 4          | servers/V1-SSIS25-01,_11040/ssis_packages/FORCE/FORCE_-\_Dependency_Check_and_Load/SONIC_FORCE_MSTR.dtsx.md                |
| `FORCE.FORCE - Dependency Check and Load.SONIC_FORCE_OpCodeTBD.dtsx`           | 4        | 2          | servers/V1-SSIS25-01,_11040/ssis_packages/FORCE/FORCE_-\_Dependency_Check_and_Load/SONIC_FORCE_OpCodeTBD.dtsx.md           |
| `FORCE.FORCE - Dependency Check and Load.Fact_Service_WIP_Snapshot.dtsx`       | 1        | 2          | servers/V1-SSIS25-01,_11040/ssis_packages/FORCE/FORCE_-\_Dependency_Check_and_Load/Fact_Service_WIP_Snapshot.dtsx.md       |
| `FORCE.FORCE - Dependency Check and Load.ForceFactOnetimeUpdate.dtsx`          | 1        | 2          | servers/V1-SSIS25-01,_11040/ssis_packages/FORCE/FORCE_-\_Dependency_Check_and_Load/ForceFactOnetimeUpdate.dtsx.md          |
| `FORCE.FORCE - Dependency Check and Load.SONIC_FORCE_OPC_Transact_Upload.dtsx` | 1        | 2          | servers/V1-SSIS25-01,_11040/ssis_packages/FORCE/FORCE_-\_Dependency_Check_and_Load/SONIC_FORCE_OPC_Transact_Upload.dtsx.md |
| `FORCE.FORCE - Dependency Check and Load.SONIC_Force_MSTR_Master.dtsx`         | 0        | 2          | servers/V1-SSIS25-01,_11040/ssis_packages/FORCE/FORCE_-\_Dependency_Check_and_Load/SONIC_Force_MSTR_Master.dtsx.md         |

## Consumers And Support Impact

- Fixed Operations reporting
- Service leadership
- Parts reporting
- Operational dashboards

## Known Gaps / Caveats

- The final warehouse facts are named for the service/parts subject area rather than only `FORCE`.

## Evidence

- Runtime package: `sonic-data-lineage-runtime` version `2026.6.13-1`, hash `514712d9e99a5e3c8e35dcb5f8fb3f74c44e98babcab3585f8a3e1957250aaff`
- Registry: `registry/canonical-objects.jsonl`
- SSIS folder index: `ssis/README.md`
- Generated from local lineage package on 2026-06-17
