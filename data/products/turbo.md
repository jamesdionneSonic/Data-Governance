---
name: TURBO
product_id: product-turbo
version: 1.0.0
status: published
domain: Sales Appointments and Operational Metrics
owner: Data Engineering
steward: Data Engineering
assets:
  - V1-SSIS25-01, 11040.SSISDB.FOCUS.FOCUS - Integrate Diff into
    Full.TURBO_Productivity_MSCTasks.dtsx
  - L1-5FSQL-01.Sonic_DW.Metric.DM_TURBO_METRICS_VW
  - V1-SSIS25-01,
    11040.SSISDB.TURBO_SameDayAppointments.TURBO_SameDayAppointments.TURBO_SameDayAppts.dtsx
  - V1-SSIS25-01, 11040.SSISDB.DQMetrics.DQ.DQ_Turbo_Consistency.dtsx
  - V1-SSIS25-01, 11040.SSISDB.DQMetrics.DQ.DQ_Turbo_Timeliness.dtsx
  - V1-SSIS25-01, 11040.SSISDB.DQMetrics.DQ.DQ_Turbo_Master_LocalRun.dtsx
  - V1-SSIS25-01, 11040.SSISDB.DQMetrics.DQ.DQ_Turbo_Master.dtsx
  - L1-5FSQL-01.Sonic_DW.dbo.Turbo_WTD_Statistics_Goals_EP
  - L1-5FSQL-01.ETL_Staging.dbo.TURBODateLoops
  - V1-SSIS25-01, 11040.SSISDB.DQMetrics.Package.Package.dtsx
sla: {}
tags:
  - turbo
  - appointments
  - quality
certified: false
certified_by: null
certification_date: null
trust_level: lineage-documented
consumers:
  - Sales operations
  - Appointment reporting
  - Data quality monitoring
output_port:
  type: lineage-documented asset bundle
  location: Sonic_DW, ETL_Staging
  format: SQL Server / SSIS metadata
created_at: 2026-06-17
last_updated: 2026-06-17
---

# TURBO

## Plain-English Summary

TURBO is modeled around same-day appointment and Turbo consistency evidence. The current lineage package shows a small SSIS footprint and quality/consistency package evidence.

If TURBO is unavailable or stale, same-day appointment or Turbo consistency metrics may be delayed.

## Product Domain

| Field                     | Value                                      |
| ------------------------- | ------------------------------------------ |
| Product                   | TURBO                                      |
| Domain                    | Sales Appointments and Operational Metrics |
| Evidence strength         | Moderate catalog evidence                  |
| Catalog objects matched   | 13                                         |
| SSIS packages matched     | 7                                          |
| Runtime package version   | 2026.6.13-1                                |
| Runtime package generated | 2026-06-13T23:31:32.400Z                   |

## What This Product Appears To Do

TURBO is modeled around same-day appointment and Turbo consistency evidence. The current lineage package shows a small SSIS footprint and quality/consistency package evidence.

For support and upgrade planning, treat this product as a bundle of warehouse tables/views/procedures, SSIS packages, and external-feed artifacts rather than a single table. The highest-impact assets below are prioritized by lineage connectivity and available column metadata.

## Lineage Scope

### Object Types

| Type    | Count |
| ------- | ----- |
| package | 7     |
| dataset | 3     |
| table   | 2     |
| view    | 1     |

### Main Databases

| Database    | Matched Objects |
| ----------- | --------------- |
| Sonic_DW    | 2               |
| ETL_Staging | 1               |

### SSIS Folders

| SSIS Folder               | Matched Objects |
| ------------------------- | --------------- |
| DQMetrics                 | 6               |
| FOCUS                     | 2               |
| TURBO_SameDayAppointments | 2               |

### Folder Catalog Matches

| Folder                    | Packages | Supporting Context Records | Evidence Path                 |
| ------------------------- | -------- | -------------------------- | ----------------------------- |
| DQMetrics                 | 5        | 1                          | ssis/f/f-33afcc946d/README.md |
| TURBO_SameDayAppointments | 1        | 1                          | ssis/f/f-374a262d01/README.md |

## Important Assets To Start With

| Asset                                                                                                    | Type    | Upstream | Downstream | Columns | Confidence   |
| -------------------------------------------------------------------------------------------------------- | ------- | -------- | ---------- | ------- | ------------ |
| `V1-SSIS25-01, 11040.SSISDB.FOCUS.FOCUS - Integrate Diff into Full.TURBO_Productivity_MSCTasks.dtsx`     | package | 2        | 10         | 0       | very_high    |
| `L1-5FSQL-01.Sonic_DW.Metric.DM_TURBO_METRICS_VW`                                                        | view    | 5        | 0          | 12      | high         |
| `V1-SSIS25-01, 11040.SSISDB.TURBO_SameDayAppointments.TURBO_SameDayAppointments.TURBO_SameDayAppts.dtsx` | package | 1        | 4          | 0       | needs_review |
| `V1-SSIS25-01, 11040.SSISDB.DQMetrics.DQ.DQ_Turbo_Consistency.dtsx`                                      | package | 2        | 2          | 0       | medium       |
| `V1-SSIS25-01, 11040.SSISDB.DQMetrics.DQ.DQ_Turbo_Timeliness.dtsx`                                       | package | 2        | 2          | 0       | very_high    |
| `V1-SSIS25-01, 11040.SSISDB.DQMetrics.DQ.DQ_Turbo_Master_LocalRun.dtsx`                                  | package | 0        | 2          | 0       | medium       |
| `V1-SSIS25-01, 11040.SSISDB.DQMetrics.DQ.DQ_Turbo_Master.dtsx`                                           | package | 0        | 2          | 0       | medium       |
| `L1-5FSQL-01.Sonic_DW.dbo.Turbo_WTD_Statistics_Goals_EP`                                                 | table   | 0        | 0          | 4       | medium       |
| `L1-5FSQL-01.ETL_Staging.dbo.TURBODateLoops`                                                             | table   | 0        | 0          | 2       | medium       |
| `V1-SSIS25-01, 11040.SSISDB.DQMetrics.Package.Package.dtsx`                                              | package | 0        | 0          | 0       | high         |

## SSIS / Orchestration Evidence

| Package                                                                       | Upstream | Downstream | Evidence Path                                                                                                             |
| ----------------------------------------------------------------------------- | -------- | ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| `FOCUS.FOCUS - Integrate Diff into Full.TURBO_Productivity_MSCTasks.dtsx`     | 2        | 10         | servers/V1-SSIS25-01,_11040/ssis_packages/FOCUS/FOCUS_-\_Integrate_Diff_into_Full/TURBO_Productivity_MSCTasks.dtsx.md     |
| `TURBO_SameDayAppointments.TURBO_SameDayAppointments.TURBO_SameDayAppts.dtsx` | 1        | 4          | servers/V1-SSIS25-01,\_11040/ssis_packages/TURBO_SameDayAppointments/TURBO_SameDayAppointments/TURBO_SameDayAppts.dtsx.md |
| `DQMetrics.DQ.DQ_Turbo_Consistency.dtsx`                                      | 2        | 2          | servers/V1-SSIS25-01,\_11040/ssis_packages/DQMetrics/DQ/DQ_Turbo_Consistency.dtsx.md                                      |
| `DQMetrics.DQ.DQ_Turbo_Timeliness.dtsx`                                       | 2        | 2          | servers/V1-SSIS25-01,\_11040/ssis_packages/DQMetrics/DQ/DQ_Turbo_Timeliness.dtsx.md                                       |
| `DQMetrics.DQ.DQ_Turbo_Master_LocalRun.dtsx`                                  | 0        | 2          | servers/V1-SSIS25-01,\_11040/ssis_packages/DQMetrics/DQ/DQ_Turbo_Master_LocalRun.dtsx.md                                  |
| `DQMetrics.DQ.DQ_Turbo_Master.dtsx`                                           | 0        | 2          | servers/V1-SSIS25-01,\_11040/ssis_packages/DQMetrics/DQ/DQ_Turbo_Master.dtsx.md                                           |
| `DQMetrics.Package.Package.dtsx`                                              | 0        | 0          | servers/V1-SSIS25-01,\_11040/ssis_packages/DQMetrics/Package/Package.dtsx.md                                              |

## Consumers And Support Impact

- Sales operations
- Appointment reporting
- Data quality monitoring

## Known Gaps / Caveats

- Current lineage evidence is narrow; this product should be rechecked if additional Turbo databases or BI assets are added later.

## Evidence

- Runtime package: `sonic-data-lineage-runtime` version `2026.6.13-1`, hash `514712d9e99a5e3c8e35dcb5f8fb3f74c44e98babcab3585f8a3e1957250aaff`
- Registry: `registry/canonical-objects.jsonl`
- SSIS folder index: `ssis/README.md`
- Generated from local lineage package on 2026-06-17
