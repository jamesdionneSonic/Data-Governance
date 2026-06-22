---
name: TRAC
product_id: product-trac
version: 1.0.0
status: published
domain: Traffic and Marketing Attribution
owner: Data Engineering
steward: Data Engineering
assets:
  - V1-SSIS25-01,
    11040.SSISDB.FOCUS.Incremental.FOCUS_Sonic_Extract_Daily_Buffered_Update.dtsx
  - V1-SSIS25-01, 11040.SSISDB.FOCUS.FOCUS - Integrate Diff into
    Full.eLead_wrk_StageTrafficSummary_FTSDailyUpdate.dtsx
  - V1-SSIS25-01, 11040.SSISDB.FOCUS.Incremental.Sonic_Extract_Fact_Activity.dtsx
  - V1-SSIS25-01, 11040.SSISDB.FOCUS.FOCUS - Integrate Diff into
    Full.FOCUS_Sonic_Extract_Historical_Elead.dtsx
  - L1-5FSQL-01.Sonic_DW.dbo.FactTrafficSummarySubSource
  - L1-DWASQL-02,12010.VendorData.ga.GoogleAnalyticsReport
  - L1-5FSQL-01.Sonic_DW.dbo.FactTrafficSummaryDaily
  - L1-5FSQL-01.ETL_Staging.JMA.LOAD_FACT_JMA_CONTRACT_TBL
  - L1-5FSQL-01.ETL_Staging.dbo.TrafficSummaryEleadStoreList
  - V1-SSIS25-01, 11040.SSISDB.FUEL.II.TitleTracking_Wrk_GLSchdule.dtsx
  - L1-5FSQL-01.Sonic_DW.dbo.FactTrafficSummaryDailyDept
  - L1-5FSQL-01.ETL_Staging.extract.eLead_Opportunity_Activities
  - V1-SSIS25-01,
    11040.SSISDB.TrueCar.TrueCar.TrueCar_Transaction_Staging_Historical.dtsx
  - L1-5FSQL-01.ETL_Staging.dbo.StageTrafficDailySourceSubSourceAgg
  - L1-5FSQL-01.ETL_Staging.dbo.StageTrafficSummaryDaily
sla: {}
tags:
  - trac
  - traffic
  - marketing
  - ga4
  - attribution
certified: false
certified_by: null
certification_date: null
trust_level: lineage-documented
consumers:
  - Marketing analytics
  - Traffic reporting
  - Lead attribution
  - Executive dashboards
output_port:
  type: lineage-documented asset bundle
  location: ETL_Staging, StagingDB, Sonic_DW, VendorData, Google
  format: SQL Server / SSIS metadata
created_at: 2026-06-17
last_updated: 2026-06-17
---

# TRAC

## Plain-English Summary

TRAC is modeled as the traffic, source/subsource, campaign, and web-analytics product area. The lineage evidence is strongest around Traffic, Google Analytics/GA4, AutoTrader, TrueCar, DDC, and related lead/traffic staging objects.

If TRAC-related data is unavailable or stale, traffic attribution, marketing-source reporting, and lead funnel analysis may be incomplete.

## Product Domain

| Field                     | Value                             |
| ------------------------- | --------------------------------- |
| Product                   | TRAC                              |
| Domain                    | Traffic and Marketing Attribution |
| Evidence strength         | Strong catalog evidence           |
| Catalog objects matched   | 389                               |
| SSIS packages matched     | 63                                |
| Runtime package version   | 2026.6.13-1                       |
| Runtime package generated | 2026-06-13T23:31:32.400Z          |

## What This Product Appears To Do

TRAC is modeled as the traffic, source/subsource, campaign, and web-analytics product area. The lineage evidence is strongest around Traffic, Google Analytics/GA4, AutoTrader, TrueCar, DDC, and related lead/traffic staging objects.

For support and upgrade planning, treat this product as a bundle of warehouse tables/views/procedures, SSIS packages, and external-feed artifacts rather than a single table. The highest-impact assets below are prioritized by lineage connectivity and available column metadata.

## Lineage Scope

### Object Types

| Type      | Count |
| --------- | ----- |
| table     | 191   |
| dataset   | 68    |
| package   | 63    |
| procedure | 54    |
| view      | 10    |
| synonym   | 3     |

### Main Databases

| Database      | Matched Objects |
| ------------- | --------------- |
| ETL_Staging   | 82              |
| StagingDB     | 60              |
| Sonic_DW      | 58              |
| VendorData    | 41              |
| Google        | 5               |
| Speed         | 3               |
| TitleTracking | 3               |
| VehicleMart   | 3               |
| DMS           | 1               |
| eLeadDW       | 1               |
| SSIS          | 1               |

### SSIS Folders

| SSIS Folder         | Matched Objects |
| ------------------- | --------------- |
| FOCUS               | 25              |
| FUEL                | 15              |
| Google              | 14              |
| DDC                 | 9               |
| EPPricingDataLoad   | 9               |
| TrueCar             | 8               |
| CarGurus-VDP        | 3               |
| GA4                 | 3               |
| VehicleMart         | 3               |
| AFScrapeDataRefresh | 2               |
| AutoTrader          | 2               |
| AutoTraderFileCheck | 2               |

### Folder Catalog Matches

| Folder               | Packages | Supporting Context Records | Evidence Path                 |
| -------------------- | -------- | -------------------------- | ----------------------------- |
| TrafficSummaryExport | 1        | 1                          | ssis/f/f-1231af0f85/README.md |
| DDC                  | 5        | 4                          | ssis/f/f-1b3ba75446/README.md |
| TrueCar              | 6        | 2                          | ssis/f/f-7e1f499c1a/README.md |
| CarGurus-VDP         | 2        | 1                          | ssis/f/f-aab53bb45b/README.md |
| Google               | 8        | 6                          | ssis/f/f-ce770667e5/README.md |
| GA4                  | 2        | 1                          | ssis/f/f-d7409e050a/README.md |
| AutoTrader           | 1        | 1                          | ssis/f/f-f073dd8432/README.md |

## Important Assets To Start With

| Asset                                                                                                                 | Type      | Upstream | Downstream | Columns | Confidence |
| --------------------------------------------------------------------------------------------------------------------- | --------- | -------- | ---------- | ------- | ---------- |
| `V1-SSIS25-01, 11040.SSISDB.FOCUS.Incremental.FOCUS_Sonic_Extract_Daily_Buffered_Update.dtsx`                         | package   | 31       | 26         | 0       | medium     |
| `V1-SSIS25-01, 11040.SSISDB.FOCUS.FOCUS - Integrate Diff into Full.eLead_wrk_StageTrafficSummary_FTSDailyUpdate.dtsx` | package   | 7        | 30         | 0       | high       |
| `V1-SSIS25-01, 11040.SSISDB.FOCUS.Incremental.Sonic_Extract_Fact_Activity.dtsx`                                       | package   | 17       | 16         | 0       | high       |
| `V1-SSIS25-01, 11040.SSISDB.FOCUS.FOCUS - Integrate Diff into Full.FOCUS_Sonic_Extract_Historical_Elead.dtsx`         | package   | 14       | 16         | 0       | very_high  |
| `L1-5FSQL-01.Sonic_DW.dbo.FactTrafficSummarySubSource`                                                                | table     | 17       | 6          | 56      | very_high  |
| `L1-DWASQL-02,12010.VendorData.ga.GoogleAnalyticsReport`                                                              | synonym   | 1        | 20         | 0       | very_high  |
| `L1-5FSQL-01.Sonic_DW.dbo.FactTrafficSummaryDaily`                                                                    | table     | 13       | 5          | 55      | very_high  |
| `L1-5FSQL-01.ETL_Staging.JMA.LOAD_FACT_JMA_CONTRACT_TBL`                                                              | procedure | 13       | 1          | 0       | high       |
| `L1-5FSQL-01.ETL_Staging.dbo.TrafficSummaryEleadStoreList`                                                            | table     | 5        | 8          | 3       | very_high  |
| `V1-SSIS25-01, 11040.SSISDB.FUEL.II.TitleTracking_Wrk_GLSchdule.dtsx`                                                 | package   | 7        | 6          | 0       | high       |
| `L1-5FSQL-01.Sonic_DW.dbo.FactTrafficSummaryDailyDept`                                                                | table     | 12       | 0          | 37      | very_high  |
| `L1-5FSQL-01.ETL_Staging.extract.eLead_Opportunity_Activities`                                                        | table     | 6        | 4          | 104     | very_high  |
| `V1-SSIS25-01, 11040.SSISDB.TrueCar.TrueCar.TrueCar_Transaction_Staging_Historical.dtsx`                              | package   | 8        | 3          | 0       | high       |
| `L1-5FSQL-01.ETL_Staging.dbo.StageTrafficDailySourceSubSourceAgg`                                                     | table     | 3        | 7          | 36      | very_high  |
| `L1-5FSQL-01.ETL_Staging.dbo.StageTrafficSummaryDaily`                                                                | table     | 3        | 7          | 35      | very_high  |

## SSIS / Orchestration Evidence

| Package                                                                                    | Upstream | Downstream | Evidence Path                                                                                                                          |
| ------------------------------------------------------------------------------------------ | -------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `FOCUS.Incremental.FOCUS_Sonic_Extract_Daily_Buffered_Update.dtsx`                         | 31       | 26         | servers/V1-SSIS25-01,\_11040/ssis_packages/FOCUS/Incremental/FOCUS_Sonic_Extract_Daily_Buffered_Update.dtsx.md                         |
| `FOCUS.FOCUS - Integrate Diff into Full.eLead_wrk_StageTrafficSummary_FTSDailyUpdate.dtsx` | 7        | 30         | servers/V1-SSIS25-01,_11040/ssis_packages/FOCUS/FOCUS_-\_Integrate_Diff_into_Full/eLead_wrk_StageTrafficSummary_FTSDailyUpdate.dtsx.md |
| `FOCUS.Incremental.Sonic_Extract_Fact_Activity.dtsx`                                       | 17       | 16         | servers/V1-SSIS25-01,\_11040/ssis_packages/FOCUS/Incremental/Sonic_Extract_Fact_Activity.dtsx.md                                       |
| `FOCUS.FOCUS - Integrate Diff into Full.FOCUS_Sonic_Extract_Historical_Elead.dtsx`         | 14       | 16         | servers/V1-SSIS25-01,_11040/ssis_packages/FOCUS/FOCUS_-\_Integrate_Diff_into_Full/FOCUS_Sonic_Extract_Historical_Elead.dtsx.md         |
| `FUEL.II.TitleTracking_Wrk_GLSchdule.dtsx`                                                 | 7        | 6          | servers/V1-SSIS25-01,\_11040/ssis_packages/FUEL/II/TitleTracking_Wrk_GLSchdule.dtsx.md                                                 |
| `TrueCar.TrueCar.TrueCar_Transaction_Staging_Historical.dtsx`                              | 8        | 3          | servers/V1-SSIS25-01,\_11040/ssis_packages/TrueCar/TrueCar/TrueCar_Transaction_Staging_Historical.dtsx.md                              |
| `GA4.GA4.GA4_DataLoad.dtsx`                                                                | 4        | 6          | servers/V1-SSIS25-01,\_11040/ssis_packages/GA4/GA4/GA4_DataLoad.dtsx.md                                                                |
| `TMRSummary.eLead.eLead_wrk_StageTrafficSummary_TMR_Export.dtsx`                           | 5        | 5          | servers/V1-SSIS25-01,\_11040/ssis_packages/TMRSummary/eLead/eLead_wrk_StageTrafficSummary_TMR_Export.dtsx.md                           |
| `DOWC.DOWC.Dowc_ContractFileLoad.dtsx`                                                     | 2        | 7          | servers/V1-SSIS25-01,\_11040/ssis_packages/DOWC/DOWC/Dowc_ContractFileLoad.dtsx.md                                                     |
| `TrueCar.TrueCar.TrueCar_Sales_Staging_Historical.dtsx`                                    | 6        | 3          | servers/V1-SSIS25-01,\_11040/ssis_packages/TrueCar/TrueCar/TrueCar_Sales_Staging_Historical.dtsx.md                                    |
| `CarGurus-VDP.Price.CarGurusDataLoad.dtsx`                                                 | 3        | 5          | servers/V1-SSIS25-01,\_11040/ssis_packages/CarGurus-VDP/Price/CarGurusDataLoad.dtsx.md                                                 |
| `DDC.VehicleViews.Sonic_Fact_DDCCarViews.dtsx`                                             | 3        | 4          | servers/V1-SSIS25-01,\_11040/ssis_packages/DDC/VehicleViews/Sonic_Fact_DDCCarViews.dtsx.md                                             |
| `DDC.VehicleViews.Vehicle_VehicleInventory_2.dtsx`                                         | 5        | 2          | servers/V1-SSIS25-01,\_11040/ssis_packages/DDC/VehicleViews/Vehicle_VehicleInventory_2.dtsx.md                                         |
| `DDC.VehicleViews.DDCVehicle_views.dtsx`                                                   | 3        | 3          | servers/V1-SSIS25-01,\_11040/ssis_packages/DDC/VehicleViews/DDCVehicle_views.dtsx.md                                                   |
| `DimAssociate.Sonic.Sonic_Extract_DimAssociate.dtsx`                                       | 3        | 3          | servers/V1-SSIS25-01,\_11040/ssis_packages/DimAssociate/Sonic/Sonic_Extract_DimAssociate.dtsx.md                                       |

## Consumers And Support Impact

- Marketing analytics
- Traffic reporting
- Lead attribution
- Executive dashboards

## Known Gaps / Caveats

- The catalog does not expose a clean SSIS folder named `TRAC`; this page groups the traffic and attribution evidence that appears to support the product.

## Evidence

- Runtime package: `sonic-data-lineage-runtime` version `2026.6.13-1`, hash `514712d9e99a5e3c8e35dcb5f8fb3f74c44e98babcab3585f8a3e1957250aaff`
- Registry: `registry/canonical-objects.jsonl`
- SSIS folder index: `ssis/README.md`
- Generated from local lineage package on 2026-06-17
