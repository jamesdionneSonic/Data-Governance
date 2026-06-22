---
name: FUEL
product_id: product-fuel
version: 1.0.0
status: published
domain: Financial Accounting
owner: Data Engineering
steward: Data Engineering
assets:
  - L1-5FSQL-01.Sonic_DW.dbo.dim_GLSchedule_degen
  - L1-5FSQL-01.Sonic_DW.dbo.Fact_GLSchedule
  - V1-SSIS25-01, 11040.SSISDB.FUEL.II.TitleTracking_Wrk_GLSchdule.dtsx
  - L1-5FSQL-01.Sonic_DW.dbo.Dim_GLScheduleSummary_degen
  - V1-SSIS25-01, 11040.SSISDB.FUEL.II.FloorPlan_Master.dtsx
  - V1-SSIS25-01, 11040.SSISDB.FUEL.II.SONIC_DW_Master_GLSchedule.dtsx
  - V1-SSIS25-01, 11040.SSISDB.FUEL.II.SONIC_GLBalances_Inc.dtsx
  - L1-5FSQL-01.Sonic_DW.dbo.DimVehicleFuelType
  - L1-5FSQL-01.ETL_Staging.wrk.GLSchedule_Step_5A
  - L1-5FSQL-01.ETL_Staging.wrk.GLCheck_Step_2
  - V1-SQL-03.BI_WorkDB.dbo.GLCheck_Step_1
  - L1-5FSQL-01.Sonic_DW.dbo.vwTitleGLSchedule
  - L1-5FSQL-01.ETL_Staging.wrk.vw_AR_Dim_GLScheduleSummary_degen
  - V1-SSIS25-01, 11040.SSISDB.FUEL.II.SONIC_DW_GLChecks_Historical.dtsx
  - V1-SSIS25-01, 11040.SSISDB.FUEL.II.SONIC_DW_GLChecks_Staging_Steps.dtsx
sla: {}
tags:
  - fuel
  - fuel-ii
  - gl
  - accounting
certified: false
certified_by: null
certification_date: null
trust_level: lineage-documented
consumers:
  - Accounting
  - Finance reporting
  - GL support
  - Warehouse reporting
output_port:
  type: lineage-documented asset bundle
  location: Sonic_DW, ETL_Staging, StagingDB, BI_WorkDB, DMS
  format: SQL Server / SSIS metadata
created_at: 2026-06-17
last_updated: 2026-06-17
---

# FUEL

## Plain-English Summary

FUEL is the financial accounting and GL warehouse product. The strongest package evidence is the FUEL II chain that stages GL schedule/check/balance data and loads downstream Sonic_DW GL fact tables.

If FUEL is unavailable or stale, GL schedule, GL check, GL balance, and related accounting reporting may be incomplete.

## Product Domain

| Field                     | Value                    |
| ------------------------- | ------------------------ |
| Product                   | FUEL                     |
| Domain                    | Financial Accounting     |
| Evidence strength         | Strong catalog evidence  |
| Catalog objects matched   | 249                      |
| SSIS packages matched     | 71                       |
| Runtime package version   | 2026.6.13-1              |
| Runtime package generated | 2026-06-13T23:31:32.400Z |

## What This Product Appears To Do

FUEL is the financial accounting and GL warehouse product. The strongest package evidence is the FUEL II chain that stages GL schedule/check/balance data and loads downstream Sonic_DW GL fact tables.

For support and upgrade planning, treat this product as a bundle of warehouse tables/views/procedures, SSIS packages, and external-feed artifacts rather than a single table. The highest-impact assets below are prioritized by lineage connectivity and available column metadata.

## Lineage Scope

### Object Types

| Type      | Count |
| --------- | ----- |
| table     | 98    |
| package   | 71    |
| dataset   | 45    |
| view      | 20    |
| procedure | 15    |

### Main Databases

| Database         | Matched Objects |
| ---------------- | --------------- |
| Sonic_DW         | 42              |
| ETL_Staging      | 41              |
| StagingDB        | 27              |
| BI_WorkDB        | 17              |
| DMS              | 3               |
| echoparkwebv_veh | 1               |
| WebV             | 1               |
| webvEP           | 1               |

### SSIS Folders

| SSIS Folder | Matched Objects |
| ----------- | --------------- |
| FUEL        | 86              |
| PostGres    | 18              |
| Account     | 2               |
| Vehicle     | 2               |
| WebV        | 2               |
| Check       | 1               |
| Dims        | 1               |

### Folder Catalog Matches

| Folder | Packages | Supporting Context Records | Evidence Path                 |
| ------ | -------- | -------------------------- | ----------------------------- |
| FUEL   | 56       | 30                         | ssis/f/f-0e2f3c1696/README.md |

## Important Assets To Start With

| Asset                                                                     | Type    | Upstream | Downstream | Columns | Confidence |
| ------------------------------------------------------------------------- | ------- | -------- | ---------- | ------- | ---------- |
| `L1-5FSQL-01.Sonic_DW.dbo.dim_GLSchedule_degen`                           | table   | 10       | 14         | 20      | very_high  |
| `L1-5FSQL-01.Sonic_DW.dbo.Fact_GLSchedule`                                | table   | 4        | 12         | 28      | very_high  |
| `V1-SSIS25-01, 11040.SSISDB.FUEL.II.TitleTracking_Wrk_GLSchdule.dtsx`     | package | 7        | 6          | 0       | high       |
| `L1-5FSQL-01.Sonic_DW.dbo.Dim_GLScheduleSummary_degen`                    | table   | 3        | 8          | 19      | very_high  |
| `V1-SSIS25-01, 11040.SSISDB.FUEL.II.FloorPlan_Master.dtsx`                | package | 0        | 11         | 0       | very_high  |
| `V1-SSIS25-01, 11040.SSISDB.FUEL.II.SONIC_DW_Master_GLSchedule.dtsx`      | package | 1        | 9          | 0       | medium     |
| `V1-SSIS25-01, 11040.SSISDB.FUEL.II.SONIC_GLBalances_Inc.dtsx`            | package | 4        | 6          | 0       | high       |
| `L1-5FSQL-01.Sonic_DW.dbo.DimVehicleFuelType`                             | table   | 4        | 5          | 9       | very_high  |
| `L1-5FSQL-01.ETL_Staging.wrk.GLSchedule_Step_5A`                          | table   | 2        | 6          | 35      | very_high  |
| `L1-5FSQL-01.ETL_Staging.wrk.GLCheck_Step_2`                              | table   | 4        | 4          | 33      | very_high  |
| `V1-SQL-03.BI_WorkDB.dbo.GLCheck_Step_1`                                  | table   | 4        | 4          | 28      | very_high  |
| `L1-5FSQL-01.Sonic_DW.dbo.vwTitleGLSchedule`                              | view    | 6        | 2          | 17      | high       |
| `L1-5FSQL-01.ETL_Staging.wrk.vw_AR_Dim_GLScheduleSummary_degen`           | view    | 6        | 2          | 5       | high       |
| `V1-SSIS25-01, 11040.SSISDB.FUEL.II.SONIC_DW_GLChecks_Historical.dtsx`    | package | 4        | 4          | 0       | high       |
| `V1-SSIS25-01, 11040.SSISDB.FUEL.II.SONIC_DW_GLChecks_Staging_Steps.dtsx` | package | 4        | 4          | 0       | high       |

## SSIS / Orchestration Evidence

| Package                                                     | Upstream | Downstream | Evidence Path                                                                                           |
| ----------------------------------------------------------- | -------- | ---------- | ------------------------------------------------------------------------------------------------------- |
| `FUEL.II.TitleTracking_Wrk_GLSchdule.dtsx`                  | 7        | 6          | servers/V1-SSIS25-01,\_11040/ssis_packages/FUEL/II/TitleTracking_Wrk_GLSchdule.dtsx.md                  |
| `FUEL.II.FloorPlan_Master.dtsx`                             | 0        | 11         | servers/V1-SSIS25-01,\_11040/ssis_packages/FUEL/II/FloorPlan_Master.dtsx.md                             |
| `FUEL.II.SONIC_DW_Master_GLSchedule.dtsx`                   | 1        | 9          | servers/V1-SSIS25-01,\_11040/ssis_packages/FUEL/II/SONIC_DW_Master_GLSchedule.dtsx.md                   |
| `FUEL.II.SONIC_GLBalances_Inc.dtsx`                         | 4        | 6          | servers/V1-SSIS25-01,\_11040/ssis_packages/FUEL/II/SONIC_GLBalances_Inc.dtsx.md                         |
| `FUEL.II.SONIC_DW_GLChecks_Historical.dtsx`                 | 4        | 4          | servers/V1-SSIS25-01,\_11040/ssis_packages/FUEL/II/SONIC_DW_GLChecks_Historical.dtsx.md                 |
| `FUEL.II.SONIC_DW_GLChecks_Staging_Steps.dtsx`              | 4        | 4          | servers/V1-SSIS25-01,\_11040/ssis_packages/FUEL/II/SONIC_DW_GLChecks_Staging_Steps.dtsx.md              |
| `FUEL.II.SONIC_Fact_GLScheduleSummary.dtsx`                 | 4        | 4          | servers/V1-SSIS25-01,\_11040/ssis_packages/FUEL/II/SONIC_Fact_GLScheduleSummary.dtsx.md                 |
| `FUEL.II.SONIC_GLSchedule_Stg_Step_5.dtsx`                  | 4        | 4          | servers/V1-SSIS25-01,\_11040/ssis_packages/FUEL/II/SONIC_GLSchedule_Stg_Step_5.dtsx.md                  |
| `WebV.Daily - WebV - Vehicle_Group.WebV_veh_fuel_type.dtsx` | 3        | 5          | servers/V1-SSIS25-01,_11040/ssis_packages/WebV/Daily_-_WebV_-\_Vehicle_Group/WebV_veh_fuel_type.dtsx.md |
| `Dims.Facts.Sonic_DW_FUEL_Dims_Facts_Master.dtsx`           | 0        | 7          | servers/V1-SSIS25-01,\_11040/ssis_packages/Dims/Facts/Sonic_DW_FUEL_Dims_Facts_Master.dtsx.md           |
| `FUEL.II.SONIC_Dim_GLScheduleSummary_degen.dtsx`            | 3        | 4          | servers/V1-SSIS25-01,\_11040/ssis_packages/FUEL/II/SONIC_Dim_GLScheduleSummary_degen.dtsx.md            |
| `FUEL.II.SONIC_GLSchedule_Stg_Step_6A.dtsx`                 | 4        | 3          | servers/V1-SSIS25-01,\_11040/ssis_packages/FUEL/II/SONIC_GLSchedule_Stg_Step_6A.dtsx.md                 |
| `Vehicle.WebVEP.WebVEP_Veh_fuel_type.dtsx`                  | 3        | 4          | servers/V1-SSIS25-01,\_11040/ssis_packages/Vehicle/WebVEP/WebVEP_Veh_fuel_type.dtsx.md                  |
| `FUEL.II.GLScheduleSummary_Staging_Steps.dtsx`              | 3        | 3          | servers/V1-SSIS25-01,\_11040/ssis_packages/FUEL/II/GLScheduleSummary_Staging_Steps.dtsx.md              |
| `FUEL.II.SONIC_GLSchedule_Stg_Step_1.dtsx`                  | 3        | 3          | servers/V1-SSIS25-01,\_11040/ssis_packages/FUEL/II/SONIC_GLSchedule_Stg_Step_1.dtsx.md                  |

## Consumers And Support Impact

- Accounting
- Finance reporting
- GL support
- Warehouse reporting

## Known Gaps / Caveats

- FUEL II is represented as project `II` under the `FUEL` SSIS folder.
- Not every final table has `FUEL` in the table name; several are GL-subject fact tables.

## Evidence

- Runtime package: `sonic-data-lineage-runtime` version `2026.6.13-1`, hash `514712d9e99a5e3c8e35dcb5f8fb3f74c44e98babcab3585f8a3e1957250aaff`
- Registry: `registry/canonical-objects.jsonl`
- SSIS folder index: `ssis/README.md`
- Generated from local lineage package on 2026-06-17
