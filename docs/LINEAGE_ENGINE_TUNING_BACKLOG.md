# Lineage Engine Tuning Backlog

## Purpose

Track lineage-engine changes as accumulated proposals from live investigations so we can batch them into deliberate releases instead of rewriting the engine after every case.

## Rules Of Use

- Do not change extraction logic directly from a single investigation without recording it here first.
- Every proposed change must cite at least one investigated object and raw evidence path.
- Prefer additive batches of related changes over one-off fixes.
- Move an item from `Proposed` to `Ready For Batch` only after at least one real object validates the pattern.
- Move an item to `Implemented` only after code, tests, and validation commands are complete.

## Status Legend

- `Proposed`: captured from an investigation, not ready to code
- `Validated`: pattern confirmed by raw evidence and worth batching
- `Ready For Batch`: grouped with related changes for one engine pass
- `Implemented`: code landed
- `Rejected`: looked promising but should not be added

## Backlog

| ID | Status | Theme | Change | Why It Matters | Seed Evidence |
| --- | --- | --- | --- | --- | --- |
| LET-001 | Validated | Unresolved targets | Add a terminal-write status such as `final_writer_unresolved_with_strong_upstream_evidence` without suppressing the upstream path | Prevents populated tables from being mislabeled as having no lineage while preserving the strongest supported path | `VendorData.buyer.CBAPurchasesByVIN` |
| LET-002 | Validated | Training labels | Add a first-class training label for `unresolved_final_writer` | Lets the engine learn the difference between no evidence and incomplete evidence | `VendorData.buyer.CBAPurchasesByVIN` |
| LET-003 | Validated | Candidate scoring | Add column-shape similarity scoring between unresolved targets and likely upstream views/tables to surface `strongly_suggested_lineage` | Helps surface probable logical sources like business-ready source views without pretending the final writer is verified | `CBS.dbo.vwRetailDailyPurchases` vs `VendorData.buyer.CBAPurchasesByVIN` |
| LET-004 | Proposed | Multi-hop reasoning | Raise confidence when direct SQL writes, SSIS reads, stage loads, and DW loads form a consistent chain | Converts fragmented evidence into a stronger end-to-end lineage hypothesis | `StagingDB.cba.uspPurchaseDetails` -> `VendorData.cba.PurchaseDetails` -> SSIS -> `ETL_Staging.stage.FactVehiclePurchaseStaging` |
| LET-005 | Proposed | SQL Agent coverage | Add SQL Agent job-step extraction as a primary evidence source and record permission-denied gaps explicitly | Hidden final writers often live in jobs rather than modules | `CBAPurchasesByVIN` investigation blocked on `msdb` |
| LET-006 | Proposed | Dynamic SQL | Improve recovery of `sp_executesql` and `EXEC(@sql)` when SQL text can be reconstructed | Final writers are often hidden behind assembled SQL | Multiple unresolved SQL Server targets |
| LET-007 | Proposed | Application-owned tables | Add heuristics for queue/state/process tables using columns like `RetryPending`, `RetryCounter`, `RecordCreationDate` | Helps classify tables whose final writer is likely external or app-owned | `VendorData.buyer.CBAPurchasesByVIN` |
| LET-008 | Validated | Evidence hygiene | Distinguish `strongly suggested lineage` from `verified physical writer` in scoring, markdown, and UI display | Keeps the engine honest while still showing the most useful lineage path | `CBS.dbo.vwRetailDailyPurchases` vs unresolved final writer |
| LET-009 | Proposed | UI lineage display | Show `verified lineage`, `strongly suggested lineage`, and `final writer unresolved` as separate display states | Prevents unresolved last hops from collapsing large meaningful upstream paths | `VendorData.buyer.CBAPurchasesByVIN` |
| LET-010 | Validated | Family patterning | When multiple unresolved targets share a same-database automation cluster and feed-specific upstreams, surface that cluster as `strongly suggested immediate upstream lineage` even if the final writer is hidden | Lets the engine preserve high-signal family patterns instead of treating each presentation table as an isolated dead end | `VendorData.buyer.LiveAuctionVINs`, `VendorData.buyer.CarfaxVINs`, `VendorData.buyer.VINsProcByAutomation` |
| LET-011 | Validated | Connector validation | For `sql_server` and `ssis`, split connector validation into `config valid`, `live connection valid`, and `metadata discovery valid`, and make the live check open a real connection under the actual runtime account | Prevents named-instance and Windows-auth failures from being reported as valid setups, which blocks trustworthy lineage testing | `VendorData`, `StagingDB`, `ETL_Staging`, `SSIS_UAT` runtime investigation |

## Investigation-To-Backlog Workflow

1. Add suspicious objects to `docs\LINEAGE_OBJECT_INVESTIGATION_QUEUE.md`.
2. Investigate one object family at a time.
3. Record the object's evidence, verdict, and training labels in the queue.
4. If the case reveals a reusable engine lesson, add or update a row in this backlog.
5. Batch related `Validated` rows into one implementation pass.

## First Seed Case

### Object

- `L1-DWASQL-02,12010.VendorData.buyer.CBAPurchasesByVIN`

### Confirmed Positive Edges

- `StagingDB.cba.uspPurchaseDetails -> VendorData.cba.PurchaseDetails`
- `VendorData.cba.PurchaseDetails -> CBA_FactVehiclePurchase.dtsx`
- `CBA_FactVehiclePurchase.dtsx -> ETL_Staging.stage.FactVehiclePurchaseStaging`
- `ETL_Staging.dbo.usp_DimVehicleMissingVins -> Sonic_DW.dbo.DimVin`
- `Sonic_DW.dbo.spLoadFactVehiclePurchase -> Sonic_DW.dbo.FactVehiclePurchase`

### Confirmed Review Edges

- `CBS.dbo.vwRetailDailyPurchases -> VendorData.buyer.CBAPurchasesByVIN`
- `CBS.dbo.DealerDMSMapping -> VendorData.buyer.CBAPurchasesByVIN`

### Confirmed Unresolved Edge

- `unknown final writer -> VendorData.buyer.CBAPurchasesByVIN`

### Display Guidance

- Preserve the verified upstream chain as `verified lineage`
- Surface `CBS.dbo.vwRetailDailyPurchases` and `CBS.dbo.DealerDMSMapping` as `strongly suggested lineage`
- Mark only the terminal write into `VendorData.buyer.CBAPurchasesByVIN` as unresolved

## Second Seed Case

### Family

- `VendorData buyer / auction and direct-site feeds`

### Confirmed Family Pattern

- `VendorData.buyer.LiveAuctionVINs` and `VendorData.buyer.CarfaxVINs` behave like buyer-facing presentation tables rather than source-system base tables
- both align strongly to feed-specific upstreams:
  - `auction / Manheim-style SSIS` for `LiveAuctionVINs`
  - `Carfax_BlackBook SSIS` for `CarfaxVINs`
- both also align to the same buyer automation cluster in `VendorData`:
  - `VendorData.buyer.VINsProcByAutomation`
  - `VendorData.buyer.DirectSitesVINsHeader`
  - `VendorData.buyer.AppDirectSitesVINsHeader`
  - `VendorData.buyer.AuctionAndDirectSitesExecutions`

### Confirmed Review Edges

- `auction-feed / Manheim-style SSIS path -> VendorData.buyer.LiveAuctionVINs`
- `Carfax_BlackBook SSIS path -> VendorData.buyer.CarfaxVINs`
- `VendorData.buyer.VINsProcByAutomation -> VendorData.buyer.LiveAuctionVINs`
- `VendorData.buyer.VINsProcByAutomation -> VendorData.buyer.CarfaxVINs`
- `VendorData.buyer.AppDirectSitesVINsHeader -> VendorData.buyer.CarfaxVINs`
- `VendorData.buyer.DirectSitesVINsHeader -> VendorData.buyer.LiveAuctionVINs`

### Confirmed Unresolved Edges

- `unknown final writer -> VendorData.buyer.LiveAuctionVINs`
- `unknown final writer -> VendorData.buyer.CarfaxVINs`

### Display Guidance

- Preserve feed-specific upstreams as `strongly suggested lineage`
- Surface the shared buyer automation cluster as `strongly suggested immediate upstream lineage`
- Mark only the terminal write into the presentation tables as unresolved

### Key Evidence

- [buyer__LiveAuctionVINs.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/buyer__LiveAuctionVINs.md:1)
- [buyer__CarfaxVINs.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/buyer__CarfaxVINs.md:1)
- [buyer__VINsProcByAutomation.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/buyer__VINsProcByAutomation.md:1)
- [buyer__DirectSitesVINsHeader.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/buyer__DirectSitesVINsHeader.md:1)
- [buyer__AppDirectSitesVINsHeader.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/buyer__AppDirectSitesVINsHeader.md:1)
- [buyer__AuctionAndDirectSitesExecutions.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/buyer__AuctionAndDirectSitesExecutions.md:1)
- [0646_AuctionDW_Manheim_DataLoad.dtsx.xml](/C:/projects/Data%20Governence/data/analysis/raw/ssis/xml/0646_AuctionDW_Manheim_DataLoad.dtsx.xml:16978)
- [0829_EPVehicleNewDataLoad_CarFax_BlackBook.dtsx.xml](/C:/projects/Data%20Governence/data/analysis/raw/ssis/xml/0829_EPVehicleNewDataLoad_CarFax_BlackBook.dtsx.xml:6589)

### Key Evidence

- [buyer__CBAPurchasesByVIN.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/buyer__CBAPurchasesByVIN.md:1)
- [cba__uspPurchaseDetails.md](/C:/projects/Data%20Governence/data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/StagingDB/stored_procedures/cba__uspPurchaseDetails.md:1)
- [0016_CBA_Purchase_Emails_CBA_PurchaseEmail.dtsx.xml](/C:/projects/Data%20Governence/data/analysis/raw/ssis/xml/0016_CBA_Purchase_Emails_CBA_PurchaseEmail.dtsx.xml:714)
- [0025_CBADW_CBA_FactVehiclePurchase.dtsx.xml](/C:/projects/Data%20Governence/data/analysis/raw/ssis/xml/0025_CBADW_CBA_FactVehiclePurchase.dtsx.xml:3550)
