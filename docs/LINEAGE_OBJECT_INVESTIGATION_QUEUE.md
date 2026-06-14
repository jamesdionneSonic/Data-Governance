# Lineage Object Investigation Queue

## Purpose

This file is the durable queue for suspicious lineage objects. It is the place to add new investigations, track their status, and preserve evidence until related engine changes are batched.

## Status Legend

- `queued`: not started
- `investigating`: active
- `hold`: blocked on permissions, access, or missing evidence
- `pattern_captured`: investigation done and engine lesson recorded
- `resolved`: lineage path adequately explained

## Priority Legend

- `P1`: high business value or likely engine-pattern gap
- `P2`: useful but not urgent
- `P3`: lower priority or mostly confirmatory

## Queue

## Grouped Families

These are the current structural families in the suspicious-object pool. We should investigate by family and use 1-2 representative objects to decide whether a reusable engine rule exists.

| Family | Approx Count | Suggested Approach | Sample Objects |
| --- | --- | --- | --- |
| `Sonic_DW dbo` | 150 | Split into the subgroups below for second-pass sampling | `Sonic_DW.dbo.DimEmployee`, `Sonic_DW.dbo.DimVehicleSought` |
| `ETL_Staging wrk` | 329 | Pattern captured for live-populated work tables, sequential work-step chains, stale generated row counts, and empty staging shells; continue sampling only for new vendor/domain-specific patterns | `appointmentsdetail`, `AR_Dim_GLScheduleSummary_degen`, `AR_schedule_step_1` through `AR_schedule_step_4`, `Auto_Dim_AutoTrader_Staging`, `Auto_Fact_Working_Staging`, `BlackBook_Staging`, prior samples `DimCustomer`, `DimEmployee`, `RecallMaster*` |
| `ETL_Staging stage` | 163 | Pattern captured for SSIS/package-local staging workspaces, stage-to-DW procedure chains, and noisy customer-match contextual clusters; continue sampling only for new vendor/domain-specific patterns | `BoA_FP`, `CBAMarketKeyMapping`, `customer_Existing`, `customer_Identity`, `customer_New`, `customer_tmpUpdate`, `customer_Update`, `CustomerFzyLkupResults`, `CustomerIMAMMergeStaging`, `customerImportAll_FzyRef` |
| `ETL_Staging dbo` | 621 | Pattern captured for mixed dbo roles: SSIS-loaded reporting/staging tables, procedure-consumed staging bridges, package control tables, manual/reference seeds, and dated repair artifacts | `EchoParkGECReportMTD`, `ManualJournalData`, `Fact_CreditApp_stage`, `RouteOne_Daily_Mart_Staging`, `BoAFileList`, dated `AdSource*` / `CallRevu*` repair tables |
| `VendorData dbo` | 69 | Pattern captured for vendor-domain landing/output roles: procedure-materialized feeds, SSIS flat-file census loads, SaaS sibling clusters, and flat external outputs with unresolved final writers | `caroffer_30_day_performance`, `TSDSubsidyMetrics`, `CarGurusRelatedInventoryListing`, `DealerwareCars`, `CensusEmplWages`, `CallSourceData`, `DriversSelectCurrentInventory` |
| `Sonic_DW wrk` | 33 | Pattern captured for Sonic_DW work tables: verified SSIS work-load chains, review-only column-shape clusters, and unresolved work artifacts without executable writer evidence | `Sonic_DW.wrk.wk_Dim_DMSCustomer`, `Sonic_DW.wrk.update_Aso_data`, `Sonic_DW.wrk.ServicedataSales`, `Sonic_DW.wrk.wk_Dim_VehicleGeneral`, `Sonic_DW.wrk.FactCallsource_stg` |
| `StagingDB dbo` | 5 | Pattern captured for direct stage-to-vendor loads plus tiny test/error-output staging artifacts; no more broad sampling needed unless new exact vendor-load evidence appears | `StagingDB.dbo.JDPower_New_Staging`, `StagingDB.dbo.StgCensusEmplWages`, prior test/error-output samples |
| `START` | 3 | Pattern captured for JumpStart cross-system dependencies, including external/four-part SQL references and local ETL work-to-StagingDB staging bridges | `ETL_Staging.wrk.Jumpstart_Activity_Staging`, `StagingDB.jump.JumpstartActivity_staging`, `ETL_Staging.wrk.vw_Fact_JumpStart_source` |
| `Inventory feeds` | 3 | Pattern captured for inventory feed-to-presentation paths where procedure pages prove StagingDB/VendorData edges but target summaries remain stale or unresolved | `VendorData.dbo.DriversSelectCurrentInventory`, `VendorData.dagrp.ep_inventory`, `VendorData.dagrp.vw_EP_Inventory` |
| `VendorData buyer` | 3 | High value and already promising | `VendorData.buyer.CBAPurchasesByVIN`, `VendorData.buyer.CarfaxVINs`, `VendorData.buyer.LiveAuctionVINs` |

### Sonic_DW dbo Second-Pass Subgroups

The broad `Sonic_DW dbo` family is too large to sample as one pattern. Use these subgroups for follow-on sampling:

| Subgroup | Status | Sampling Notes | Latest Sample |
| --- | --- | --- | --- |
| `Sonic_DW dbo canonical dimensions` | `pattern_captured` | `Dim*` tables excluding obvious backup, clone, dev, UAT, old, test, history, or date-suffixed variants; sampled objects show canonical warehouse dimensions often require SSIS master/child package orchestration, stage/work destinations, and procedure/SQL load evidence to be stitched before the target summary stops looking unresolved | `DimActivityStatus`, `DimActivityType`, `DimAdSource`, `DimApplicationSource`, `DimAssociate`, `DimAuctionSource`, `DimCallRevuDepartment`, `DimCategory`, `DimCategoryType`, `DimCustomer` |
| `Sonic_DW dbo dimension variants` | `pattern_captured` | Date-suffixed, backup, clone, old, test, UAT, dev, and history dimension variants; use safe token boundaries so names like `DimGSCDevice` are not false-classified as dev tables | `DimAdSource_orig`, `DimAssociate_bk_0413`, `DimCustomer_20250109`, `dimcustomer_bk05052022`, negative case `DimGSCDevice` |
| `Sonic_DW dbo canonical facts` | `pattern_captured` | `Fact*` / `fact*` tables excluding backup, clone, dev, old, test, and date-suffixed variants; sampled facts mostly reinforce SSIS-to-SQL chain stitching, reverse writer materialization, and component-level SSIS discovery | `FactActivity`, `FactCallSource`, `FactCBABuyerTarget`, `FactCBAMarketTarget`, `FactCollisionCSI`, `FactCreditApp` |
| `Sonic_DW dbo fact variants` | `pattern_captured` | Backup, clone, date, dev, snapshot, old, test, and other non-canonical fact variants | `Fact_HFM_Budget_T5_2025`, `Fact_HFM_bk_20230712`, `Fact_HFM_Dev`, `Fact_HFM_Dev3` |
| `Sonic_DW dbo reporting and mart tables` | `pattern_captured` | `DM_*`, `Doc_*`, mart/report/dashboard/projection/metric tables; sampled objects show procedure-first writer evidence even when package-name and exact cross-db checks are sparse | `DM_AdvertisingExpense`, `DM_CVLA`, `DM_CVLAInv`, `DM_FIREBudgets`, `DM_FIREBudgetsQuarter`, `DM_FIREBudgetsYear`, `DM_FixedOpsAvgRR`, `DM_FORCE_SUMMARY`, `DM_FUEL_Dashboard`, `Doc_Actual` |
| `Sonic_DW dbo staging work and temp tables` | `pattern_captured` | `stg_*`, `wrk_*`, temp, update, processed, audit, and one-off operational tables; sampled objects have zero-row raw catalog pages, no cross-db exact/package matches, and no executable writer evidence | `Processed_synd`, `stg_OneStream`, `stg_OneStream2`, `stg_OneStream3`, `stg_OneStream_20250819`, `stg_powersports_agg`, `stg_powersports_azure`, `update_date_1`, `update_date_2`, `wrk_Dim_HFMBrand` |
| `Sonic_DW dbo xref bridge and mapping tables` | `pattern_captured` | `xref`, `xrf`, `XREF`, bridge, mapping, relationship, lookup, and key tables; sampled objects split into loaded relationship dimensions, SSIS lookup/read sources, and unresolved manual/reference maps | `AccountScheduleBridge`, `CallSourceThirdPartyMapping`, `CustomerXREF_KeyLU`, `DimDMSLegacyDealXREF`, `DimOpportunityPositionXREF`, `DimUserDepartmentMapCDK`, `DimVehicleSoughtXref`, `Dim_CouponXref`, `eleadsThirdPartyMapping`, `MappingKey_Focus` |
| `Sonic_DW dbo operational and app-domain tables` | `pattern_captured` | Playbook, survey, security, SOX, ops, syndicate, START, and app-specific operational tables; sampled objects show same-database app/procedure ownership, update-only writers, error-log side writes, and reference/read-only operational objects rather than SSIS/package-driven loads | `Corp_Report_Permissions`, `CSI_Email_Change_Tracking`, `CSI_Email_Change_Tracking_Data`, `Doc_TXN_BulkPermissionAdd`, `Doc_TXN_Login`, `Error_Log`, `OpsReview`, `OpsReviewItem`, `PlaybookAnswer`, `PlaybookQuestions` |
| `Sonic_DW dbo views and helper objects` | `pattern_captured` | `vw_*` and helper read models should usually create `depends_on`/`reads_from` and SSIS source usage, not writer edges; sampled objects also show that `vw_` naming is not proof of object type because several `vw_*` objects are cataloged/live as base tables | `vw_CallSource`, `vw_GMB`, `vw_GoogleAds`, `vw_autotrader_inventory`, `vw_eleads_goals`, `vw_GA_Combined`, `vw_Sales_NewUsed`, `vwTitleGLSchedule`, `vwDimVehicle`, `vwFactFIRESummaryReport` |

### DimVehicle Live Verification - June 12, 2026

Object:
- `Sonic_DW.dbo.DimVehicle`

Status:
- `resolved`

Verdict:
- The original generated table page was stale/misleading. It showed `row_count: 0`, `created_by: []`, and `lineage_status: creator_unresolved`; fresh live profiling through the saved `GPA` connector found `171,158` rows on June 12, 2026. The regenerated markdown now carries `live_row_count: 171158`, `catalog_freshness: generated_row_count_zero_but_live_row_count_positive`, and `lineage_status: creator_found`.
- The correct writer chain is supported by live SQL/SSIS evidence: `SSIS_UAT` package `DimVehicle.DimVehicle.DimVehicle_DIM_DimVehicle.dtsx` calls `Sonic_DW.dbo.usp_DimVehicle`, and `Sonic_DW.dbo.usp_DimVehicle` writes `Sonic_DW.dbo.DimVehicle`.
- The upstream source bridge is `Sonic_DW.dbo.SynWrkDimVehicleVehicle`, whose synonym base object is `ETL_Staging.wrk.DimVehicle_Vehicle`. Fresh live profiling through the saved `ETL_Staging` connector found `61,600` rows on June 12, 2026. The regenerated markdown now carries `live_row_count: 61600` and a catalog freshness conflict instead of treating the work table as empty.
- `Sonic_DW.dbo.vwDimVehicle` is a downstream read model. It depends on `DimVehicle`, `DimVin`, and vehicle lookup dimensions; it should not be treated as the writer for `DimVehicle`.
- A graph showing more than 40 upstream objects for `DimVehicle` is overcaptured. Most of that count comes from lookup/reference dimensions and contextual FK reads being traversed as if they were physical source feeds. Those lookup objects should remain visible as technical/context dependencies, but they should not inflate the primary upstream feed count.
- Focused validation after the rule fix shows `4` physical upstream objects for the DimVehicle family sample: the SSIS package, `usp_DimVehicle`, `SynWrkDimVehicleVehicle`, and `ETL_Staging.wrk.DimVehicle_Vehicle`. Lookup samples such as `DimVehicleMake` and `DimVehicleModel` remain visible as `contextual_read` edges, not physical upstream feeds.

Evidence:
- [dbo__DimVehicle.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/Sonic_DW/tables/dbo__DimVehicle.md:1)
- [dbo__usp_DimVehicle.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/Sonic_DW/stored_procedures/dbo__usp_DimVehicle.md:1)
- [dbo__SynWrkDimVehicleVehicle.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/Sonic_DW/synonyms/dbo__SynWrkDimVehicleVehicle.md:27)
- [wrk__DimVehicle_Vehicle.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/tables/wrk__DimVehicle_Vehicle.md:1)
- [dbo__vwDimVehicle.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/Sonic_DW/views/dbo__vwDimVehicle.md:1)
- [DimVehicle_DIM_DimVehicle.dtsx.md](/C:/projects/Data%20Governence/data/markdown/servers/V1-SSIS25-01,_11040/ssis_packages/DimVehicle/DimVehicle/DimVehicle_DIM_DimVehicle.dtsx.md:1)

Live connector validation:
- `SSIS_UAT` scoped package extraction succeeded through the shared connector runtime on June 12, 2026. It returned `1` package, `2` SQL tasks, `3` connections, and `2` lineage edges.
- The package connection `OLEDB_Sonic_DW` points to `V1-SQL-03\INST1,11041`, database `Sonic_DW`, and the task `TSQL - usp_DimVehicle` executes `usp_DimVehicle`.
- After the scoped SSIS filter fix, unrelated SQL Agent job edges no longer appear in the DimVehicle package trace.

Edge findings:
- `SSIS_UAT.DimVehicle.DimVehicle.DimVehicle_DIM_DimVehicle.dtsx` -> `Sonic_DW.dbo.usp_DimVehicle` | class=`calls` | score=`1.00` | label=`positive`
- `Sonic_DW.dbo.usp_DimVehicle` -> `Sonic_DW.dbo.DimVehicle` | class=`writes_to` | score=`1.00` | label=`positive`
- `Sonic_DW.dbo.usp_DimVehicle` -> `Sonic_DW.dbo.SynWrkDimVehicleVehicle` | class=`reads_from` | score=`1.00` | label=`positive`
- `Sonic_DW.dbo.SynWrkDimVehicleVehicle` -> `ETL_Staging.wrk.DimVehicle_Vehicle` | class=`depends_on` | score=`1.00` | label=`positive`
- `Sonic_DW.dbo.vwDimVehicle` -> `Sonic_DW.dbo.DimVehicle` | class=`reads_from` | score=`1.00` | label=`positive`; downstream view/read edge only, not writer evidence.
- Unrelated SQL Agent job edges returned during a package-scoped extraction | class=`rejected` | score=`0.00` | label=`negative`; fixed by filtering Agent steps to the selected SSIS folder/project/package scope before edge building.

Engine lessons reinforced:
- Materialize verified procedure writer evidence back onto target table summaries.
- Treat live row count/profile data as fresher than generated markdown when markdown reports `row_count: 0`.
- Preserve the SSIS package -> stored procedure -> target table chain as hard lineage.
- Expand synonym base objects when building upstream source chains.
- Keep lookup/reference/FK objects in a separate `lookup_dependencies` or `contextual_read` lane. Do not let `contextual_reads` participate in generic physical upstream traversal.
- Normalize SSIS connection endpoints such as `V1-SQL-03\INST1,11041.Sonic_DW` to the same database identity family as generated `L1-5FSQL-01.Sonic_DW` artifacts before creating separate graph nodes.
- Keep package-scoped SSIS extraction local to the selected folder/project/package; do not include global Agent job edges unless they match that scope.
- Keep `vwDimVehicle` as a downstream read/dependency surface, not a writer.

## Recommended First Investigation Clusters

1. `VendorData buyer`
   Representative objects:
   `VendorData.buyer.CBAPurchasesByVIN`, `VendorData.buyer.LiveAuctionVINs`

2. `Inventory feeds`
   Representative objects:
   `VendorData.dbo.DriversSelectCurrentInventory`, `VendorData.dagrp.ep_inventory`

3. `START`
   Representative objects:
   `ETL_Staging.wrk.Jumpstart_Activity_Staging`, `StagingDB.jump.JumpstartActivity_staging`

## Current Family Hypothesis: `VendorData buyer`

Working hypothesis from the first three buyer objects:

- `CBAPurchasesByVIN` is a buyer-facing flattened purchase target with a strong likely source in `CBS.dbo.vwRetailDailyPurchases`
- `LiveAuctionVINs` and `CarfaxVINs` look like buyer-facing auction-feed targets
- `LiveAuctionVINs`, `CarfaxVINs`, `DirectSitesVINsHeader`, and `AppDirectSitesVINsHeader` share a strong shape overlap with `VINsProcByAutomation`
- `VINsProcByAutomation` appears to be a shared buyer-side automation/normalization table for auction and direct-site VIN processing
- the likely family pattern is:
  external auction or vehicle-history feed
  -> feed-specific stage/load
  -> buyer automation layer such as `VINsProcByAutomation` / `DirectSitesVINsHeader` / `AppDirectSitesVINsHeader`
  -> buyer-facing final tables

What is verified so far:

- `VINsProcByAutomation` has contextual reads to:
  - `AppDirectSitesVINsHeader`
  - `DirectSitesVINsHeader`
  - `AuctionAndDirectSitesExecutions`
- `AppDirectSitesVINsHeader` and `DirectSitesVINsHeader` both have contextual reads and column matches tied to the same buyer automation family
- `CarfaxVINs` strongly aligns to the `Carfax_BlackBook` SSIS stream
- `LiveAuctionVINs` strongly aligns to auction-feed patterns and shares many buyer automation columns
- `Sonic_DW`, `ETL_Staging`, and extracted SSIS package text do not directly reference `LiveAuctionVINs` or `CarfaxVINs` by name
- the extracted trigger on `DirectSitesVINsHeader` exists, but its current markdown capture is metadata-only and does not close the writer path

What is still unresolved:

- the exact final physical writer into `CarfaxVINs`
- the exact final physical writer into `LiveAuctionVINs`
- whether `VINsProcByAutomation` is the direct source or an adjacent shared staging layer

Family verdict:

- `pattern_captured`

Family display guidance:

- show feed-specific upstreams as `strongly suggested lineage`
- show the buyer automation cluster as `strongly suggested immediate upstream lineage`
- keep the last write into the final buyer-facing tables as unresolved

### 1. VendorData.buyer.CBAPurchasesByVIN

Object:
- `L1-DWASQL-02,12010.VendorData.buyer.CBAPurchasesByVIN`

Family:
- `CBS / CBA purchase lineage`

Priority:
- `P1`

Status:
- `pattern_captured`

Why suspicious:
- Large populated table
- Current catalog shows unresolved lineage
- Table contains business-real purchase, VIN, feature, and process-state columns

Evidence:
- [buyer__CBAPurchasesByVIN.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/buyer__CBAPurchasesByVIN.md:1)
- [cba__uspPurchaseDetails.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/StagingDB/stored_procedures/cba__uspPurchaseDetails.md:1)
- [0016_CBA_Purchase_Emails_CBA_PurchaseEmail.dtsx.xml](/C:/projects/Data%20Governence/data/analysis/raw/ssis/xml/0016_CBA_Purchase_Emails_CBA_PurchaseEmail.dtsx.xml:714)
- [0025_CBADW_CBA_FactVehiclePurchase.dtsx.xml](/C:/projects/Data%20Governence/data/analysis/raw/ssis/xml/0025_CBADW_CBA_FactVehiclePurchase.dtsx.xml:3550)
- [dbo__usp_DimVehicleMissingVins.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/stored_procedures/dbo__usp_DimVehicleMissingVins.md:715)

Validated edges:
- `StagingDB.cba.uspPurchaseDetails -> VendorData.cba.PurchaseDetails`
- `VendorData.cba.PurchaseDetails -> CBA_FactVehiclePurchase.dtsx`
- `CBA_FactVehiclePurchase.dtsx -> ETL_Staging.stage.FactVehiclePurchaseStaging`
- `ETL_Staging.dbo.usp_DimVehicleMissingVins -> Sonic_DW.dbo.DimVin`
- `Sonic_DW.dbo.spLoadFactVehiclePurchase -> Sonic_DW.dbo.FactVehiclePurchase`

Review edges:
- `CBS.dbo.vwRetailDailyPurchases -> VendorData.buyer.CBAPurchasesByVIN`
- `CBS.dbo.DealerDMSMapping -> VendorData.buyer.CBAPurchasesByVIN`

Unresolved edges:
- `unknown final writer -> VendorData.buyer.CBAPurchasesByVIN`

Potential engine lessons:
- unresolved populated targets need a stronger terminal-write status than `external_or_unresolved`
- strongly suggested lineage should be captured even when the physical writer is hidden
- multi-hop SQL plus SSIS evidence should increase confidence
- SQL Agent and dynamic SQL remain likely blind spots

Next best step:
- Investigate the next unresolved populated object in the same CBS/CBA family to see whether the same hidden-writer pattern repeats

### 2. VendorData.buyer.LiveAuctionVINs

Object:
- `L1-DWASQL-02,12010.VendorData.buyer.LiveAuctionVINs`

Family:
- `VendorData buyer / auction feeds`

Priority:
- `P1`

Status:
- `pattern_captured`

Why suspicious:
- buyer-facing VIN table with unresolved lineage
- looks like an auction feed output rather than a source-system base table
- shares many columns with buyer automation and feed-processing tables

Evidence:
- [buyer__LiveAuctionVINs.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/buyer__LiveAuctionVINs.md:1)
- [buyer__VINsProcByAutomation.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/buyer__VINsProcByAutomation.md:1)
- [buyer__DirectSitesVINsHeader.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/buyer__DirectSitesVINsHeader.md:1)
- [buyer__AuctionAndDirectSitesExecutions.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/buyer__AuctionAndDirectSitesExecutions.md:1)
- [0646_AuctionDW_Manheim_DataLoad.dtsx.xml](/C:/projects/Data%20Governence/data/analysis/raw/ssis/xml/0646_AuctionDW_Manheim_DataLoad.dtsx.xml:16978)

Validated edges:
- none yet for the final target

Review edges:
- `auction-feed / Manheim-style SSIS path -> VendorData.buyer.LiveAuctionVINs`
- `VendorData.buyer.VINsProcByAutomation -> VendorData.buyer.LiveAuctionVINs`
- `VendorData.buyer.DirectSitesVINsHeader -> VendorData.buyer.LiveAuctionVINs`
- `VendorData.buyer.AuctionAndDirectSitesExecutions -> VendorData.buyer.LiveAuctionVINs`

Unresolved edges:
- `unknown final writer -> VendorData.buyer.LiveAuctionVINs`

Potential engine lessons:
- buyer auction-feed targets may share a common automation layer
- SSIS feed-specific loads may need to be connected to buyer-side automation tables before final targets
- when ETL/DW systems have no direct references, same-database automation clusters may still be the best immediate-upstream evidence

Next best step:
- move to the next family or return later if SQL Agent or live module-text access becomes available

### 3. VendorData.buyer.CarfaxVINs

Object:
- `L1-DWASQL-02,12010.VendorData.buyer.CarfaxVINs`

Family:
- `VendorData buyer / vehicle-history and auction feeds`

Priority:
- `P1`

Status:
- `pattern_captured`

Why suspicious:
- buyer-facing VIN table with unresolved lineage
- clearly tied to Carfax and auction enrichment
- strongly resembles buyer automation and direct-site feed structures

Evidence:
- [buyer__CarfaxVINs.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/buyer__CarfaxVINs.md:1)
- [buyer__VINsProcByAutomation.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/buyer__VINsProcByAutomation.md:1)
- [buyer__AppDirectSitesVINsHeader.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/buyer__AppDirectSitesVINsHeader.md:1)
- [buyer__AuctionAndDirectSitesExecutions.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/buyer__AuctionAndDirectSitesExecutions.md:1)
- [0829_EPVehicleNewDataLoad_CarFax_BlackBook.dtsx.xml](/C:/projects/Data%20Governence/data/analysis/raw/ssis/xml/0829_EPVehicleNewDataLoad_CarFax_BlackBook.dtsx.xml:6589)

Validated edges:
- none yet for the final target

Review edges:
- `Carfax_BlackBook SSIS path -> VendorData.buyer.CarfaxVINs`
- `VendorData.buyer.VINsProcByAutomation -> VendorData.buyer.CarfaxVINs`
- `VendorData.buyer.AppDirectSitesVINsHeader -> VendorData.buyer.CarfaxVINs`
- `VendorData.buyer.AuctionAndDirectSitesExecutions -> VendorData.buyer.CarfaxVINs`

Unresolved edges:
- `unknown final writer -> VendorData.buyer.CarfaxVINs`

Potential engine lessons:
- Carfax/BlackBook feed pipelines may terminate in shared buyer automation tables before final presentation tables
- strongly suggested lineage should be preserved even when the last writer remains hidden
- same-database automation clusters can be a higher-value immediate-upstream clue than distant warehouse systems

Next best step:
- move to the next family or return later if SQL Agent or live module-text access becomes available

## Intake Template

Copy this block for the next object:

```text
### N. <database.schema.object>

Object:
- `<canonical id>`

Family:
- `<source family>`

Priority:
- `P1`

Status:
- `queued`

Why suspicious:
- ...

Evidence:
- ...

Validated edges:
- ...

Review edges:
- ...

Unresolved edges:
- ...

Potential engine lessons:
- ...

Next best step:
- ...
```
