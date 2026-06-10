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
| `Sonic_DW dbo` | 150 | Likely too broad; split later into dims, facts, and reporting-style tables | `Sonic_DW.dbo.DimEmployee`, `Sonic_DW.dbo.DimVehicleSought` |
| `ETL_Staging wrk` | 38 | Good candidate for work-table and intermediate-load patterns | `ETL_Staging.wrk.Auto_Fact_Working_Staging`, `ETL_Staging.wrk.DimCustomer` |
| `ETL_Staging stage` | 28 | Good candidate for SSIS stage-load patterns | `ETL_Staging.stage.BoA_FP`, `ETL_Staging.stage.FactRemedyTicketData` |
| `ETL_Staging dbo` | 18 | Likely mixed; separate manual or reporting tables from true ETL targets | `ETL_Staging.dbo.EchoParkGECReportMTD`, `ETL_Staging.dbo.ManualJournalData` |
| `VendorData dbo` | 8 | Good candidate for external feeds and flattened downstream outputs | `VendorData.dbo.caroffer_30_day_performance`, `VendorData.dbo.TSDSubsidyMetrics` |
| `Sonic_DW wrk` | 6 | Good candidate for unresolved work-table writers | `Sonic_DW.wrk.ServicedataSales`, `Sonic_DW.wrk.wk_Dim_VehicleGeneral` |
| `StagingDB dbo` | 5 | Good candidate for direct stage-to-vendor patterns | `StagingDB.dbo.JDPower_New_Staging`, `StagingDB.dbo.StgCensusEmplWages` |
| `START` | 3 | Good candidate for one compact family-level investigation | `ETL_Staging.wrk.Jumpstart_Activity_Staging`, `StagingDB.jump.JumpstartActivity_staging` |
| `Inventory feeds` | 3 | High value; may reveal reusable feed-to-presentation pattern | `VendorData.dbo.DriversSelectCurrentInventory`, `VendorData.dagrp.ep_inventory` |
| `VendorData buyer` | 3 | High value and already promising | `VendorData.buyer.CBAPurchasesByVIN`, `VendorData.buyer.CarfaxVINs`, `VendorData.buyer.LiveAuctionVINs` |

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
