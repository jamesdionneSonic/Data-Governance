---
name: FIRE
product_id: product-fire
version: 1.0.0
status: published
domain: Retail Sales and Finance
owner: Data Engineering
steward: Data Engineering
assets:
  - L1-5FSQL-01.Sonic_DW.dbo.factFIRE
  - V1-SSIS25-01, 11040.SSISDB.FIRE.Dims.FIRE_Bookings.dtsx
  - L1-5FSQL-01.Sonic_DW.dbo.factFIRE_A
  - L1-5FSQL-01.Sonic_DW.dbo.FactFireSummary
  - V1-SSIS25-01, 11040.SSISDB.FIRE.Dims.FIRE_pWrkToFact.dtsx
  - L1-5FSQL-01.Sonic_DW.dbo.vwFactFIRESummaryReport
  - L1-5FSQL-01.Sonic_DW.dbo.FactFireBookings_preDW
  - V1-SSIS25-01, 11040.SSISDB.FIRE.Dims.FIRE_pVSCtoStg.dtsx
  - L1-5FSQL-01.ETL_Staging.wrk.factFIRE_pre_DW
  - L1-5FSQL-01.Sonic_DW.dbo.factFIREBookingsWeOwe
  - L1-5FSQL-01.ETL_Staging.wrk.stgFIREWeOwe
  - L1-5FSQL-01.ETL_Staging.wrk.FireSummary_Detail
  - L1-5FSQL-01.Sonic_DW.dbo.vwFireSummaryDetailEP
  - L1-5FSQL-01.Sonic_DW.dbo.vwFireSummaryDetailSonic
  - L1-5FSQL-01.ETL_Staging.wrk.wrkFactFIRE_M2
sla: {}
tags:
  - fire
  - retail-sales
  - finance
  - sales-summary
certified: false
certified_by: null
certification_date: null
trust_level: lineage-documented
consumers:
  - Retail Sales reporting
  - Finance reporting
  - Operational dashboards
  - External sales feeds
output_port:
  type: lineage-documented asset bundle
  location: Sonic_DW, ETL_Staging, SIMS6200Retail, DMS
  format: SQL Server / SSIS metadata
created_at: 2026-06-17
last_updated: 2026-06-17
---

# FIRE

## Plain-English Summary

FIRE is the retail sales and finance reporting product. It centers on sales activity, gross, deal status, dealership/entity attributes, and FIRE summary outputs used by reports, downstream feeds, and operational dashboards.

If FIRE is unavailable or stale, retail sales reporting, sales gross reporting, and some outbound sales/feed processes may show incomplete or stale results.

## Product Domain

| Field                     | Value                    |
| ------------------------- | ------------------------ |
| Product                   | FIRE                     |
| Domain                    | Retail Sales and Finance |
| Evidence strength         | Strong catalog evidence  |
| Catalog objects matched   | 177                      |
| SSIS packages matched     | 30                       |
| Runtime package version   | 2026.6.13-1              |
| Runtime package generated | 2026-06-13T23:31:32.400Z |

## What This Product Appears To Do

FIRE is the retail sales and finance reporting product. It centers on sales activity, gross, deal status, dealership/entity attributes, and FIRE summary outputs used by reports, downstream feeds, and operational dashboards.

For support and upgrade planning, treat this product as a bundle of warehouse tables/views/procedures, SSIS packages, and external-feed artifacts rather than a single table. The highest-impact assets below are prioritized by lineage connectivity and available column metadata.

## Lineage Scope

### Object Types

| Type      | Count |
| --------- | ----- |
| table     | 59    |
| view      | 45    |
| dataset   | 31    |
| package   | 30    |
| procedure | 12    |

### Main Databases

| Database       | Matched Objects |
| -------------- | --------------- |
| Sonic_DW       | 59              |
| ETL_Staging    | 54              |
| SIMS6200Retail | 2               |
| DMS            | 1               |

### SSIS Folders

| SSIS Folder | Matched Objects |
| ----------- | --------------- |
| FIRE        | 50              |
| FIRE-       | 4               |
| KPI         | 2               |
| Check       | 1               |

### Folder Catalog Matches

| Folder | Packages | Supporting Context Records | Evidence Path                 |
| ------ | -------- | -------------------------- | ----------------------------- |
| FIRE-  | 2        | 2                          | ssis/f/f-2345ad7d20/README.md |
| FIRE   | 26       | 24                         | ssis/f/f-f27f17e3f0/README.md |

## Important Assets To Start With

| Asset                                                       | Type    | Upstream | Downstream | Columns | Confidence |
| ----------------------------------------------------------- | ------- | -------- | ---------- | ------- | ---------- |
| `L1-5FSQL-01.Sonic_DW.dbo.factFIRE`                         | table   | 9        | 45         | 93      | very_high  |
| `V1-SSIS25-01, 11040.SSISDB.FIRE.Dims.FIRE_Bookings.dtsx`   | package | 12       | 15         | 0       | high       |
| `L1-5FSQL-01.Sonic_DW.dbo.factFIRE_A`                       | table   | 4        | 18         | 47      | very_high  |
| `L1-5FSQL-01.Sonic_DW.dbo.FactFireSummary`                  | table   | 4        | 12         | 158     | very_high  |
| `V1-SSIS25-01, 11040.SSISDB.FIRE.Dims.FIRE_pWrkToFact.dtsx` | package | 8        | 11         | 0       | high       |
| `L1-5FSQL-01.Sonic_DW.dbo.vwFactFIRESummaryReport`          | view    | 5        | 4          | 159     | high       |
| `L1-5FSQL-01.Sonic_DW.dbo.FactFireBookings_preDW`           | table   | 5        | 6          | 54      | very_high  |
| `V1-SSIS25-01, 11040.SSISDB.FIRE.Dims.FIRE_pVSCtoStg.dtsx`  | package | 5        | 7          | 0       | high       |
| `L1-5FSQL-01.ETL_Staging.wrk.factFIRE_pre_DW`               | table   | 4        | 5          | 107     | very_high  |
| `L1-5FSQL-01.Sonic_DW.dbo.factFIREBookingsWeOwe`            | table   | 5        | 5          | 55      | very_high  |
| `L1-5FSQL-01.ETL_Staging.wrk.stgFIREWeOwe`                  | table   | 5        | 5          | 23      | very_high  |
| `L1-5FSQL-01.ETL_Staging.wrk.FireSummary_Detail`            | table   | 4        | 4          | 109     | very_high  |
| `L1-5FSQL-01.Sonic_DW.dbo.vwFireSummaryDetailEP`            | view    | 6        | 2          | 105     | high       |
| `L1-5FSQL-01.Sonic_DW.dbo.vwFireSummaryDetailSonic`         | view    | 6        | 2          | 105     | high       |
| `L1-5FSQL-01.ETL_Staging.wrk.wrkFactFIRE_M2`                | table   | 4        | 4          | 103     | very_high  |

## SSIS / Orchestration Evidence

| Package                                         | Upstream | Downstream | Evidence Path                                                                               |
| ----------------------------------------------- | -------- | ---------- | ------------------------------------------------------------------------------------------- |
| `FIRE.Dims.FIRE_Bookings.dtsx`                  | 12       | 15         | servers/V1-SSIS25-01,\_11040/ssis_packages/FIRE/Dims/FIRE_Bookings.dtsx.md                  |
| `FIRE.Dims.FIRE_pWrkToFact.dtsx`                | 8        | 11         | servers/V1-SSIS25-01,\_11040/ssis_packages/FIRE/Dims/FIRE_pWrkToFact.dtsx.md                |
| `FIRE.Dims.FIRE_pVSCtoStg.dtsx`                 | 5        | 7          | servers/V1-SSIS25-01,\_11040/ssis_packages/FIRE/Dims/FIRE_pVSCtoStg.dtsx.md                 |
| `FIRE-.Run.SONIC_FTP_Sales.dtsx`                | 6        | 3          | servers/V1-SSIS25-01,\_11040/ssis_packages/FIRE-/Run/SONIC_FTP_Sales.dtsx.md                |
| `FIRE.Dims.FIRE_pGLtoStg.dtsx`                  | 4        | 5          | servers/V1-SSIS25-01,\_11040/ssis_packages/FIRE/Dims/FIRE_pGLtoStg.dtsx.md                  |
| `FIRE.Dims.SONIC_Dim_DMSEmployee.dtsx`          | 4        | 4          | servers/V1-SSIS25-01,\_11040/ssis_packages/FIRE/Dims/SONIC_Dim_DMSEmployee.dtsx.md          |
| `FIRE.SAP.Callidus_FI_Individual_GetData.dtsx`  | 6        | 2          | servers/V1-SSIS25-01,\_11040/ssis_packages/FIRE/SAP/Callidus_FI_Individual_GetData.dtsx.md  |
| `FIRE.Summary.FIRESummary_Fact.dtsx`            | 3        | 5          | servers/V1-SSIS25-01,\_11040/ssis_packages/FIRE/Summary/FIRESummary_Fact.dtsx.md            |
| `FIRE.SIMS.SIMS_FIRE_DealData.dtsx`             | 4        | 3          | servers/V1-SSIS25-01,\_11040/ssis_packages/FIRE/SIMS/SIMS_FIRE_DealData.dtsx.md             |
| `KPI.DataLoad.KPI_FIRE.dtsx`                    | 2        | 5          | servers/V1-SSIS25-01,\_11040/ssis_packages/KPI/DataLoad/KPI_FIRE.dtsx.md                    |
| `FIRE-.Run.SONIC_FTP_Inventory.dtsx`            | 3        | 3          | servers/V1-SSIS25-01,\_11040/ssis_packages/FIRE-/Run/SONIC_FTP_Inventory.dtsx.md            |
| `FIRE.Dims.Sonic_DW_FIRE_Dims_Fact_Master.dtsx` | 0        | 6          | servers/V1-SSIS25-01,\_11040/ssis_packages/FIRE/Dims/Sonic_DW_FIRE_Dims_Fact_Master.dtsx.md |
| `FIRE.SIMS.SIMS_FIREDealDataSummary.dtsx`       | 2        | 3          | servers/V1-SSIS25-01,\_11040/ssis_packages/FIRE/SIMS/SIMS_FIREDealDataSummary.dtsx.md       |
| `FIRE.Summary.FIRESummary_wrk_DetailSonic.dtsx` | 3        | 2          | servers/V1-SSIS25-01,\_11040/ssis_packages/FIRE/Summary/FIRESummary_wrk_DetailSonic.dtsx.md |
| `FIRE.DOC.Sonic_DW_FIRE_DOC_MSTR_Master.dtsx`   | 0        | 4          | servers/V1-SSIS25-01,\_11040/ssis_packages/FIRE/DOC/Sonic_DW_FIRE_DOC_MSTR_Master.dtsx.md   |

## Consumers And Support Impact

- Retail Sales reporting
- Finance reporting
- Operational dashboards
- External sales feeds

## Known Gaps / Caveats

- FIRE appears as both `FIRE` and `FIRE-` SSIS folders in the catalog.
- Some SSRS report references use `factFIRE` while package evidence also references `FactFireSummary`.

## Evidence

- Runtime package: `sonic-data-lineage-runtime` version `2026.6.13-1`, hash `514712d9e99a5e3c8e35dcb5f8fb3f74c44e98babcab3585f8a3e1957250aaff`
- Registry: `registry/canonical-objects.jsonl`
- SSIS folder index: `ssis/README.md`
- Generated from local lineage package on 2026-06-17
