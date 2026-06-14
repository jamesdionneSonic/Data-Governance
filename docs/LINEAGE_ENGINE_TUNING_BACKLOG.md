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
| LET-011 | Implemented | Connector validation | For `sql_server` and `ssis`, split connector validation into `config valid`, `live connection valid`, and `metadata discovery valid`, and make the live check open a real connection under the actual runtime account | Prevents named-instance and Windows-auth failures from being reported as valid setups, which blocks trustworthy lineage testing | `VendorData`, `StagingDB`, `ETL_Staging`, `SSIS_UAT` runtime investigation; live diagnostics passed June 12, 2026 |
| LET-012 | Implemented | Connector runtime parity | Unify `Ingestion Studio` and managed connector SQL/SSIS runtime paths behind one shared Windows-auth connection builder, one shared probe flow, and one shared diagnostics model that records the actual runtime identity, endpoint, and connection variant | Prevents "Studio connects but profiling fails" drift, which blocks live profiling and lineage extraction from saved connectors | `VendorData`, `StagingDB`, `ETL_Staging`, `SSIS_UAT`, `Ingestion Studio` API path review; live diagnostics passed June 12, 2026 |
| LET-013 | Validated | SSIS-to-SQL chain stitching | Promote a connected pattern where an SSIS master package invokes work-load packages, those packages write an ETL work table, a child SSIS package executes a stored procedure, and that procedure `MERGE`s the work table into a warehouse dimension | Prevents warehouse dimensions with clear SSIS plus SQL evidence from being grouped as edge-less just because the final write is split across package orchestration and a stored procedure | `SSIS_UAT DimEmployee_Master.dtsx` -> `DimEmployee_WRK_DMS.dtsx` -> `ETL_Staging.wrk.DimEmployee` -> `ETL_Staging.dbo.uspInsDimEmployee` -> `Sonic_DW.dbo.DimEmployee` |
| LET-014 | Validated | Reverse writer materialization | Propagate verified procedure and SSIS writer evidence back onto target table summaries, and prefer executed SQL targets over misleading comments or near-name aliases | Prevents real target tables from remaining `external_or_unresolved` when writer procs already expose `writes_to`, and prevents stale underscore/non-underscore aliases from being trained as writers | `Sonic_Transform_DimVehicleSought.dtsx` -> `ETL_Staging.clean.DimVehicleSought` -> `Sonic_Load_DimVehicleSought.dtsx` -> `Sonic_DW.dbo.usp_Load_DimVehicleSought` -> `Sonic_DW.dbo.DimVehicleSought`; negative review target `Sonic_DW.dbo.Dim_VehicleSought` |
| LET-015 | Validated | Catalog freshness conflicts | Add a freshness/conflict marker when live metadata disagrees with generated table markdown for row counts or object existence, and avoid treating stale `row_count: 0` as evidence that a work, stage, dbo staging, or vendor feed table is empty | Prevents populated ETL/vendor tables from being deprioritized or mislabeled when the generated catalog snapshot is stale | Live `ETL_Staging.wrk.DimCustomer` row count `42080464`, `ETL_Staging.wrk.Fact_HFM_Staging_wrk` row count `6532897`, `ETL_Staging.wrk.DimVehicle_MissingVins` row count `354854`, `ETL_Staging.stage.FactRemedyTicketData` row count `10`, `ETL_Staging.stage.FactVehiclePurchaseStaging` row count `38`, `ETL_Staging.stage.dwFullOpportunity` row count `91839277`, `ETL_Staging.dbo.opportunity` row count `2931107`, `ETL_Staging.dbo.opportunity_EP` row count `102201`, `VendorData.dbo.CarGurusIDVinMapping` row count `20753169`, `VendorData.dbo.CarGurusVehicleDetails` row count `46184085`, and `VendorData.dbo.CarGurusRelatedInventoryListing` row count `76373786` while raw markdown reports `row_count: 0` |
| LET-016 | Validated | Schema-exact identity | Treat server, database, schema, and object name as the object identity key when scoring, stitching, and presenting lineage, and flag same-name cross-schema objects instead of collapsing them | Prevents edges for large same-name tables from being merged across `dbo`, `stage`, `wrk`, or source schemas when they are different physical objects with different row counts and consumers | `ETL_Staging.dbo.dwFullOpportunity` live row count `56189994` and `ETL_Staging.stage.dwFullOpportunity` live row count `91839277`, with ETL/Sonic_DW modules referencing both schema-qualified forms |
| LET-017 | Validated | Generic-name lexical guard | For generic operational names such as `contact`, `opportunity`, and `customer`, do not create lineage candidates from substring matches alone; require exact qualified object/dependency/writer evidence or a scored alias bridge | Prevents unrelated same-word objects in other schemas/databases from being treated as lineage evidence and keeps expensive broad module scans from timing out | `ETL_Staging.dbo.contact` versus `VendorData.uccx.ContactCallDetail`; `ETL_Staging.dbo.opportunity` versus opportunity-family tables and SSIS packages; `ETL_Staging.dbo.DMScustomer` versus DMS customer dimensions/staging |
| LET-018 | Validated | Vendor feed procedure materialization | Materialize same-database vendor-feed stored procedure writer evidence back onto target table summaries even when there is no SSIS or warehouse hop | Prevents populated vendor feed tables from appearing edge-less when procedure pages already contain `update_target`, `merge_key`, and executable `MERGE`/`INSERT` evidence | `VendorData.dbo.uspCargurusDataLoad` -> `VendorData.dbo.CarGurusVehicleDetails`; `VendorData.dbo.uspCargurusInventoryDataLoad` -> `VendorData.dbo.CarGurusRelatedInventoryListing`; `VendorData.dbo.uspCargurusScrapingDataLoad` -> `VendorData.dbo.CarGurusIDVinMapping` |
| LET-019 | Validated | Work-table direction guard | Treat `wrk`, `stage`, `tmp`, `newdata`, and `update_*` table column-shape matches as similarity/context only until executable SQL or SSIS evidence proves writer/reader direction | Prevents final dimension/reporting tables from being inferred as upstream writers into work tables merely because their columns overlap, while still allowing real SSIS destinations to become writer evidence | `Sonic_DW.wrk.wk_Dim_DMSCustomer` has SSIS OLE DB destination evidence in `0616_Daily_-_CoraAccount_Dim_DMSCustomer_Inc.dtsx.xml`, while generated `column_match` edges link final/customer tables to `Sonic_DW.wrk.wk_Dim_DMSCustomer`; `Sonic_DW.wrk.update_Aso_data` has many final-table column matches that should remain review-only without executable writer evidence |
| LET-020 | Validated | SSIS component-level table discovery | Mine SSIS data-flow component names, OLE DB source/destination `OpenRowset` values, SQL task statements, and component lineage IDs before falling back to package-name matching | Prevents deployed package-name searches from missing real lineage when the package name is generic but internal components explicitly read/write the target table | `0507_RouteOne_RouteOne_Daily.dtsx.xml` has `DODB - RouteOne_Staging` with `OpenRowset [dbo].[RouteOne_Staging]`; `0748_CensusDataLoad_CensusDataLoad.dtsx.xml` has `DODB - StgCensusEmplWages`, `SODB - StgCensusEmplWages`, `TRUNCATE TABLE [dbo].[StgCensusEmplWages]`, and `Exec [dbo].[usp_Census_Cleanup]`; `0669_KBB_KBBSales.dtsx.xml` has `DODB - KBB Sales Staging` and `TRUNCATE TABLE [dbo].[KBBSalesStaging]` |
| LET-021 | Validated | Four-part external SQL dependency normalization | Preserve SQL Server four-part names from views/procs as first-class dependency identities, including external servers not present in the local catalog | Prevents cross-server reference tables from disappearing when ETL views bridge local staging to warehouse facts | `ETL_Staging.wrk.vw_Fact_JumpStart_source` reads `ETL_Staging.wrk.Jumpstart_Activity_Staging` and joins `[COR-SQL-02].[Speed].Jump.Entity` plus Sonic_DW dimensions; package-name and stored-procedure searches did not reveal the final `Fact_Jumpstart` writer |
| LET-022 | Validated | Cross-database vendor load materialization | Materialize stored-procedure writer evidence from cross-database staging-to-vendor loads back onto the VendorData target table summaries | Prevents populated vendor presentation/feed tables from appearing edge-less when procedure pages already prove the staging source and target writes | `VendorData.dbo.usp_VINSolutionDataLoad` reads `StagingDB.dbo.StgDriversSelectCurrentInventory` and writes `VendorData.dbo.DriversSelectCurrentInventory`; `StagingDB.dbo.usp_VINSolution_Cleanup` updates the staging table before the vendor load |
| LET-023 | Proposed | Clone/dev/backup table classification | Detect date-suffixed, `_bk`, `Backup`, `Dev`, and similar clone table names and classify them separately from canonical production targets unless explicit copy/writer evidence exists | Prevents warehouse clone tables from flooding the suspicious-object queue as unresolved production lineage and prevents the engine from inventing lineage solely from column-shape similarity to the canonical table | `Sonic_DW.dbo.Fact_HFM_Budget_T5_2025`, `Sonic_DW.dbo.Fact_HFM_bk_20230712`, `Sonic_DW.dbo.Fact_HFM_Dev`, `Sonic_DW.dbo.Fact_HFM_Dev3` |
| LET-024 | Proposed | Malformed qualified-name quarantine | Quarantine catalog objects whose extracted table name contains embedded schema tokens, unmatched brackets, or typo schemas unless live metadata confirms the exact identity | Prevents parser artifacts such as `dbo.wrk.RecallMasterService` and `dbo.wrrk.RecallMasterSales3` from becoming real lineage nodes or training labels, while preserving the true `wrk` and `stage` RecallMaster tables | `ETL_Staging.dbo.wrk.RecallMasterService`, `ETL_Staging.dbo.wrrk.RecallMasterSales3`, `ETL_Staging.wrk.RecallMasterServiceNew`, `ETL_Staging.stage.RecallMasterSalesI` |
| LET-025 | Proposed | Manual/reference seed classification | Classify small live tables with explicit manual/reference naming and no executable writer evidence as `manual_or_reference_seed_unresolved` instead of ordinary broken lineage | Prevents intentionally maintained seed/manual tables from being treated like failed ETL extraction gaps while still surfacing them for stewardship review | `ETL_Staging.dbo.ManualJournalData` is live with `3` rows, generated markdown reports `row_count: 0`, and no matching SQL/SSIS writer evidence was found in the sampled corpus |
| LET-026 | Proposed | Test/error-output staging classification | Classify tiny live tables with test/error-output naming and only broad column-match/contextual evidence as `test_or_error_artifact_unresolved` instead of production lineage gaps | Prevents scratch, failed-row, and SSIS error-output tables from dominating suspicious-object queues or becoming false positive lineage from shape overlap | `StagingDB.dbo.test_load_bad1`, `StagingDB.dbo.Pgc_Vehicle_Staging_error_Output`, `StagingDB.dbo.test_load_bad`, and `StagingDB.dbo.commongrouperroroutput` are live with `0-4` rows and no exact SQL/SSIS writer found in this sample |
| LET-027 | Proposed | Reporting mart procedure-first materialization | For `DM_*`, `Doc_*`, dashboard, report, metric, projection, and mart tables, prioritize exact SQL procedure `writes_to` evidence before package-name heuristics or unresolved presentation-table classification | Prevents reporting/data-mart tables from remaining edge-less when same-database stored procedures already prove the writer, while avoiding broad name-similarity false positives | `Sonic_DW.dbo.usp_Load_DM_AdvertistingExpense` -> `Sonic_DW.dbo.DM_AdvertisingExpense`; `Sonic_DW.dbo.usp_FORCE_MSAgg1` / `usp_FORCE_MSAgg1_INCR` -> `Sonic_DW.dbo.DM_FORCE_SUMMARY`; `Sonic_DW.dbo.usp_Fuel_Incremental_DM` -> `Sonic_DW.dbo.DM_FUEL_Dashboard`; `Sonic_DW.dbo.usp_DOC_Actuals_INCR` -> `Sonic_DW.dbo.Doc_Actual` |
| LET-028 | Proposed | Transient staging/work artifact classification | Classify zero-evidence same-database `stg_*`, `wrk_*`, `update_*`, processed, temp, and audit-style Sonic_DW dbo tables separately from production lineage gaps unless executable writer evidence or live population proves activity | Prevents empty scratch/intermediate objects from dominating suspicious-object queues while preserving them as reviewable transient artifacts | `Sonic_DW.dbo.Processed_synd`, `stg_OneStream*`, `stg_powersports_*`, `update_date_*`, and `wrk_Dim_HFMBrand` show generated `row_count: 0`, no raw SQL/SSIS writer hits, no ETL exact matches, and no SSIS package-name matches |
| LET-029 | Proposed | XREF/bridge/map role classification | Classify XREF, bridge, mapping, lookup, and relationship tables by observed role: loaded relationship dimension, SSIS lookup/read source, or manual/reference map, rather than treating the name family as one unresolved pattern | Prevents real XREF procedure writers from being missed and prevents SSIS lookup reads or small reference maps from being promoted as hard writer lineage | `DimDMSLegacyDealXREF`, `DimOpportunityPositionXREF`, and `DimVehicleSoughtXref` have procedure/package writer evidence; `CustomerXREF_KeyLU` is an SSIS lookup/read source into `ETL_Staging.wrk.GLSchedule_CustLook`; several small mapping tables have no writer evidence |
| LET-030 | Proposed | Operational app/procedure table ownership | Classify operational/app-domain Sonic_DW tables by same-database procedure evidence before treating them as ETL lineage gaps: procedure-written app state, update-only operational tables, error-log side writes, or read-only/manual reference objects | Prevents app workflow, audit, permission, playbook, and error tables from appearing as failed SSIS/ETL targets when their ownership is inside Sonic_DW procedures or external app/manual workflows | `usp_AddDOCPermissionBulk` -> `Doc_TXN_BulkPermissionAdd`; `usp_CreateOpsReview` -> `OpsReview` / `OpsReviewItem`; `JMA_Load_Dim_Tables*` -> `Error_Log`; `update_CSI_email_change_tracking` updates `CSI_Email_Change_Tracking`; `usp_Update_PB_Answer` updates `PlaybookAnswer` but frontmatter missed the update target |
| LET-031 | Proposed | View/helper read-model classification | Classify SQL views and helper read models as dependency/read surfaces, materialize SSIS source usage as `reads_from`, and treat `vw_` prefixes as naming hints rather than object-type proof | Prevents read-only views from becoming broken writer targets, preserves downstream package consumers, and avoids misclassifying base tables named with `vw_` | `vwTitleGLSchedule`, `vwDimVehicle`, and `vwFactFIRESummaryReport` have `CREATE VIEW` dependency evidence; SSIS packages read `vwTitleGLSchedule`, `vwDimVehicle`, and `vwFactFIRESummaryReport`; `VendorData.dbo.vw_GoogleAds` and `vw_GA_Combined` are live base tables despite `vw_` names |
| LET-032 | Validated | Canonical dimension chain stitching | Generalize canonical `Dim*` warehouse dimensions as orchestration chains that may span SSIS master packages, staging data-flow destinations, child load packages, synonym bridges, and SQL procedure/command writers before the Sonic_DW target is materialized | Prevents production dimension tables from remaining `creator_unresolved` when the evidence is split across stage-load packages, synonyms, and later dimension-load steps instead of appearing on the target table page | `CallRevu_Master.dtsx` calls `CallRevu_DimAdSourceStaging.dtsx` and `CallRevu_DimAdSource.dtsx`; `CallRevu_DimAdSourceStaging.dtsx` truncates/writes `ETL_Staging.stage.DimAdSource`; live `DimVehicle_DIM_DimVehicle.dtsx` calls `Sonic_DW.dbo.usp_DimVehicle`, which reads synonym `SynWrkDimVehicleVehicle` over `ETL_Staging.wrk.DimVehicle_Vehicle` and writes `Sonic_DW.dbo.DimVehicle`; sampled target pages still show empty `created_by` / stale `row_count: 0` |
| LET-033 | Proposed | Sequential ETL work-step chain materialization | Detect and stitch populated `ETL_Staging.wrk` step tables where SSIS truncates/loads `wrk` destinations from `wrk` views and later consumes a downstream step into a fact/dimension target | Prevents live-populated work tables from appearing as isolated unresolved objects and preserves step-by-step transformations without turning every column-shape match into hard lineage | `0337_FUEL_II_-_Dependency_Check_and_Load_SONIC_Fact_GLScheduleSummary.dtsx.xml` loads `wrk.AR_schedule_step_3`, then `wrk.AR_schedule_step_4`, then reads `wrk.AR_schedule_step_4` into `Fact_GLScheduleSummary`; `0333_FUEL_II_-_Dependency_Check_and_Load_SONIC_Dim_GLScheduleSummary_degen.dtsx.xml` truncates/writes `wrk.AR_Dim_GLScheduleSummary_degen`; live `wrk.AR_schedule_step_*` rows are about `1.18M` while generated markdown says `0` |
| LET-034 | Proposed | Package-local stage workspace stitching | Detect `ETL_Staging.stage` tables that are truncated/loaded inside SSIS packages and then read by downstream package SQL or stored procedures into Sonic_DW targets, while downgrading broad same-family contextual reads to review-only | Prevents real stage workspaces from staying `external_or_unresolved` and prevents noisy customer-match clusters from training false hard edges | `0025_CBADW_CBA_FactVehiclePurchase.dtsx.xml` truncates and loads `stage.CBAMarketKeyMapping`; `0201_ELeadDuplicate_eLeadDupe_CustomerMatchResult.dtsx.xml` truncates and writes `stage.CustomerIMAMMergeStaging` and related match tables; `dbo.spLoadeLead_CustomerMatchResult` reads `stage.CustomerMatchStaging` and writes `Sonic_DW.dbo.CustomerMatchResult` |
| LET-035 | Proposed | Mixed ETL dbo role classification | Classify `ETL_Staging.dbo` tables by observed role before treating them as unresolved targets: SSIS-loaded reporting/staging tables, procedure-consumed stage bridges, package control/file-list tables, manual/reference seeds, and dated repair artifacts | Prevents the large `dbo` family from collapsing into one unresolved bucket and keeps control/manual/repair objects from polluting hard lineage training while preserving real SSIS/procedure chains | `0390_KPI_DataLoad_KPI_EleadGEC.dtsx.xml` truncates/writes `dbo.EchoParkGECReportMTD`; `0508_RouteOne_RouteOne_Daily_Mart.dtsx.xml` truncates/loads `dbo.RouteOne_Daily_Mart_Staging`; `insert_*` procedures read `dbo.Fact_CreditApp_stage` and write Sonic_DW dimensions/facts; `0015_CashManagement_CashProBoADataLoad.dtsx.xml` truncates/inserts `dbo.BoAFileList`; `ManualJournalData` and dated `AdSource*`/`CallRevu*` repair tables need nonstandard role classification |
| LET-036 | Proposed | Vendor SaaS/feed family role classification | Classify `VendorData.dbo` tables by vendor-domain load pattern: procedure-materialized feed tables, SSIS flat-file/public-data loads, same-vendor sibling clusters, and flat external outputs whose final writer remains unresolved | Preserves real vendor feed writers while preventing sibling tables from the same SaaS family from becoming false lineage edges solely because they share vendor names and columns | `uspCargurusInventoryDataLoad` writes `CarGurusRelatedInventoryListing`; `usp_DealerwareCars` / `usp_DealerwareCompanies` write Dealerware tables from staging sources; `0748_CensusDataLoad_CensusDataLoad.dtsx.xml` loads VendorData Census data from `StgCensusEmplWages`; `caroffer_30_day_performance` and `TSDSubsidyMetrics` remain flat external outputs when no exact writer is found |
| LET-037 | Implemented | Scoped SSIS extraction hygiene | Filter SQL Agent SSIS job-step evidence to the selected SSIS folder/project/package when a focused extraction scope is provided, while preserving global Agent job extraction for unscoped runs | Prevents one-object/package investigations from inheriting unrelated scheduler edges and training false positives into the graph | Live scoped `SSIS_UAT` DimVehicle extraction initially returned unrelated `GPA_AnswersExport` and `EPBlackBookandChrome_OnDemandRun` Agent edges; after the filter it returns only the DimVehicle package audit write and `usp_DimVehicle` call |
| LET-038 | Implemented | Physical upstream versus contextual lookup split | Keep `contextual_reads`, lookup/reference procedure reads, lookup/reference `depends_on`, and lookup `used_by` reverse edges out of the generic physical upstream traversal graph while preserving them as typed `contextual_read` / lookup evidence | Prevents FK/reference/lookup dimensions from making one target look like it has dozens of physical source feeds, while still showing technical enrichment dependencies where they belong | `Sonic_DW.dbo.DimVehicle` showed 40+ upstream objects because vehicle lookup dimensions and contextual FK/read/use edges were traversed as upstream feeds; after the rule fix, the focused physical upstream sample is 4 objects: SSIS package -> `usp_DimVehicle` -> `SynWrkDimVehicleVehicle` -> `ETL_Staging.wrk.DimVehicle_Vehicle`, with lookup dimensions displayed separately |

## Investigation-To-Backlog Workflow

1. Add suspicious objects to `docs\LINEAGE_OBJECT_INVESTIGATION_QUEUE.md`.
2. Investigate one object family at a time.
3. Record the object's evidence, verdict, and training labels in the queue.
4. If the case reveals a reusable engine lesson, add or update a row in this backlog.
5. Batch related `Validated` rows into one implementation pass.

## Codex Implementation Prompts

### LET-015: Mark Live-Vs-Catalog Freshness Conflicts

```text
We need to modify the lineage ingestion engine to mark live metadata conflicts when runtime discovery disagrees with generated table markdown, without rewriting the engine.

Context:
The `ETL_Staging.wrk` family trace found several live work tables with real row counts even though the generated raw table pages report `row_count: 0` and unresolved lineage. Live connector metadata is fresher than the generated markdown snapshot in these cases.

Validated seed observations:
- Live `ETL_Staging.wrk.DimCustomer` row count: `42080464`; generated markdown row count: `0`.
- Live `ETL_Staging.wrk.Fact_HFM_Staging_wrk` row count: `6532897`; generated markdown row count: `0`.
- Live `ETL_Staging.wrk.DimVehicle_MissingVins` row count: `354854`; generated markdown row count: `0`.
- Live `ETL_Staging.wrk.Auto_Fact_Working_Staging` row count: `0`; generated markdown row count: `0`, so this remains a true low-evidence/empty candidate unless other writer evidence appears.
- Live `ETL_Staging.stage.FactRemedyTicketData` row count: `10`; generated markdown row count: `0`.
- Live `ETL_Staging.stage.FactVehiclePurchaseStaging` row count: `38`; generated markdown row count: `0`.
- Live `ETL_Staging.stage.dwFullOpportunity` row count: `91839277`; generated markdown row count: `0`.
- Live `ETL_Staging.dbo.opportunity` row count: `2931107`; generated markdown row count: `0`.
- Live `ETL_Staging.dbo.opportunity_EP` row count: `102201`; generated markdown row count: `0`.
- Live `VendorData.dbo.cargurusidvinmapping_dealer_temp` row count: `8558`; generated markdown row count: `0`.
- Live `VendorData.dbo.CarGurusIDVinMapping` row count: `20753169`; generated markdown row count: `0`.
- Live `VendorData.dbo.CarGurusVehicleDetails` row count: `46184085`; generated markdown row count: `0`.
- Live `VendorData.dbo.CarGurusRelatedInventoryListing` row count: `76373786`; generated markdown row count: `0`.

Evidence files:
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/tables/wrk__DimCustomer.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/tables/wrk__Fact_HFM_Staging_wrk.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/tables/wrk__DimVehicle_MissingVins.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/tables/wrk__Auto_Fact_Working_Staging.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/tables/stage__FactRemedyTicketData.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/tables/stage__FactVehiclePurchaseStaging.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/tables/stage__dwFullOpportunity.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/tables/dbo__opportunity.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/tables/dbo__opportunity_EP.md`
- `data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/dbo__cargurusidvinmapping_dealer_temp.md`
- `data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/dbo__CarGurusIDVinMapping.md`
- `data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/dbo__CarGurusVehicleDetails.md`
- `data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/dbo__CarGurusRelatedInventoryListing.md`

Required change:
- Compare live metadata row count/object existence against generated catalog row count/object metadata when both are available.
- Add a `catalog_freshness_conflict` or equivalent diagnostic when live and generated metadata disagree materially.
- Do not treat generated `row_count: 0` as evidence that an object is empty when live metadata reports rows.
- Surface the conflict in object summaries, run logs, and training/export records so low-evidence classifiers do not learn stale-empty labels.

Acceptance criteria:
- `ETL_Staging.wrk.DimCustomer`, `ETL_Staging.wrk.Fact_HFM_Staging_wrk`, and `ETL_Staging.wrk.DimVehicle_MissingVins` are marked as live-populated despite stale markdown row counts.
- `ETL_Staging.stage.FactRemedyTicketData`, `ETL_Staging.stage.FactVehiclePurchaseStaging`, and `ETL_Staging.stage.dwFullOpportunity` are marked as live-populated despite stale markdown row counts.
- `ETL_Staging.dbo.opportunity` and `ETL_Staging.dbo.opportunity_EP` are marked as live-populated despite stale markdown row counts.
- `VendorData.dbo.cargurusidvinmapping_dealer_temp`, `VendorData.dbo.CarGurusIDVinMapping`, `VendorData.dbo.CarGurusVehicleDetails`, and `VendorData.dbo.CarGurusRelatedInventoryListing` are marked as live-populated despite stale markdown row counts.
- `ETL_Staging.wrk.Auto_Fact_Working_Staging` remains low-evidence/empty unless a live row count or writer edge appears.
- Tests cover live-populated/catalog-zero, live-zero/catalog-zero, and missing-live-metadata cases.
```

### LET-016: Preserve Schema-Exact Object Identity

```text
We need to modify the lineage ingestion engine to preserve schema-exact object identity when scoring and stitching lineage, without rewriting the engine.

Context:
The `ETL_Staging.stage` suspicious table group showed that same-name objects can exist in different schemas and represent different physical datasets. `ETL_Staging.dbo.dwFullOpportunity` and `ETL_Staging.stage.dwFullOpportunity` are both live, both heavily referenced, and have different row counts. The engine must not collapse them into one logical object just because the object name matches.

Validated seed observations:
- Live `ETL_Staging.dbo.dwFullOpportunity` row count: `56189994`.
- Live `ETL_Staging.stage.dwFullOpportunity` row count: `91839277`.
- `ETL_Staging.wrk.vw_Fact_Opportunity_working_Staging` depends on `eLeadDW.dbo.dwFullOpportunity`.
- ETL stored procedures such as `dbo.usp_Fact_Opportunity_Extract_2014*` reference `ETL_Staging.dbo.dwFullOpportunity`.
- Sonic_DW procedures such as `dbo.usp_Load_FactOpportunity*` and related scoring/load procedures reference `ETL_Staging.stage.dwFullOpportunity` and/or `ETL_Staging.dbo.dwFullOpportunity`.

Evidence files:
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/tables/dbo__dwFullOpportunity.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/tables/stage__dwFullOpportunity.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/views/wrk__vw_Fact_Opportunity_working_Staging.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/stored_procedures/dbo__usp_Fact_Opportunity_Extract_2014.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/Sonic_DW/stored_procedures/dbo__usp_Load_FactOpportunity.md`

Required change:
- Use fully qualified identity (`server.database.schema.object`) as the canonical key for table/view/procedure lineage matching.
- Keep same-name objects in different schemas as separate nodes unless a synonym, view, or explicit executable SQL bridge proves an alias relationship.
- When an unqualified SQL reference is encountered, resolve it using the module's default schema and SQL Server name-resolution rules instead of matching every same-name object.
- Add a `same_name_cross_schema_conflict` or equivalent diagnostic when multiple live objects share a name within the same database.
- In summaries/UI, show the schema conflict clearly so reviewers can see that `dbo.dwFullOpportunity` and `stage.dwFullOpportunity` are not interchangeable.

Acceptance criteria:
- Edges for `ETL_Staging.dbo.dwFullOpportunity` are not silently attached to `ETL_Staging.stage.dwFullOpportunity`, or vice versa.
- Lineage summaries preserve both `dbo` and `stage` nodes when both exist live.
- Tests cover same-name cross-schema tables, unqualified references inside a module, and a positive alias/synonym case where collapsing is explicitly supported.
```

### LET-017: Guard Generic Operational Names From Substring False Positives

```text
We need to modify the lineage ingestion engine so generic operational object names do not produce lineage candidates from substring matches alone, without rewriting the engine.

Context:
The `ETL_Staging.dbo` suspicious table group included wide operational tables with generic names: `contact`, `opportunity`, `opportunity_EP`, and `DMScustomer`. Live tracing showed that broad substring searches find many unrelated objects and modules, especially for `contact` and `opportunity`. These matches are useful for discovery, but should not become lineage edges without exact qualified evidence.

Validated seed observations:
- `ETL_Staging.dbo.contact` exists live with row count `0`, while VendorData also has unrelated `uccx.ContactCallDetail`, `uccx.ContactQueueDetail`, `uccx.ContactRoutingDetail`, and `uccx.ContactServiceQueue` tables with large row counts.
- `ETL_Staging.dbo.opportunity` exists live with row count `2931107`, while the same token appears in many opportunity-family tables, views, procedures, and SSIS packages.
- `ETL_Staging.dbo.opportunity_EP` exists live with row count `102201`, but no direct VendorData, StagingDB, Sonic_DW, or SSIS package-name match was found.
- `ETL_Staging.dbo.DMScustomer` exists live with row count `0`, while related but distinct DMS customer staging and dimension objects exist, including `ETL_Staging.wrk.Dim_DMSCustomer_Staging` and `Sonic_DW.dbo.Dim_DMSCustomer`.
- A broad Sonic_DW module-text scan for `contact` timed out; exact object/dependency checks completed quickly and found no direct Sonic_DW match for the four selected names.

Evidence files:
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/tables/dbo__contact.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/tables/dbo__opportunity.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/tables/dbo__opportunity_EP.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/tables/dbo__DMScustomer.md`
- `data/analysis/raw/ssis/xml/0113_StagingSonicSSIS_dwDiffOpportunity.dtsx.xml`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/stored_procedures/dbo__usp_DimDmsCustomer_Merge.md`

Required change:
- Maintain a generic-name guard list or scoring heuristic for tokens such as `contact`, `customer`, `opportunity`, `vehicle`, `deal`, and `activity`.
- Treat substring-only matches on these names as discovery hints, not lineage edges.
- Require exact qualified object matches, SQL dependency metadata, executable writer SQL, SSIS destination/source evidence, or a scored alias/synonym bridge before creating lineage edges.
- Prefer exact-name and dependency-index lookups before broad module text scans; only run broad scans when scoped by database/schema/object family and timeout-safe limits.
- Surface ambiguous generic-name matches as `lexical_ambiguous_review` or equivalent, with the conflicting object names.

Acceptance criteria:
- `ETL_Staging.dbo.contact` is not linked to `VendorData.uccx.ContactCallDetail` from the word `contact` alone.
- `ETL_Staging.dbo.opportunity` can still connect to exact evidence such as `dwDiffOpportunity`/FactOpportunity chains when supported, but generic opportunity-family mentions are review-only until qualified.
- Broad module scans for generic names do not block live tracing or ingestion runs; timeout-safe exact/dependency checks run first.
- Tests cover a false-positive generic substring, a positive exact qualified dependency, and a positive SSIS package/table chain with a generic object token.
```

### LET-018: Materialize Same-Database Vendor Feed Procedure Writers

```text
We need to modify the lineage ingestion engine to materialize same-database vendor-feed stored procedure writer evidence onto target table summaries, without rewriting the engine.

Context:
The `VendorData.dbo` suspicious table group showed a CarGurus feed family where the target table pages are marked `creator_unresolved` and `row_count: 0`, but live metadata shows large populated tables and raw stored procedure pages already contain strong writer evidence. There is no SSIS package-name match and no ETL_Staging/Sonic_DW match for these exact target names; the important lineage is local to VendorData stored procedures.

Validated seed observations:
- Live `VendorData.dbo.cargurusidvinmapping_dealer_temp` row count: `8558`; generated markdown row count: `0`; `dbo.uspStgCarGurusDealerLoad` references it.
- Live `VendorData.dbo.CarGurusIDVinMapping` row count: `20753169`; generated markdown row count: `0`; `dbo.uspCargurusScrapingDataLoad` contains executable `MERGE VendorData.dbo.CarGurusIDVinMapping`.
- Live `VendorData.dbo.CarGurusVehicleDetails` row count: `46184085`; generated markdown row count: `0`; `dbo.uspCargurusDataLoad` contains `update_target` and `merge_key` usage against this table.
- Live `VendorData.dbo.CarGurusRelatedInventoryListing` row count: `76373786`; generated markdown row count: `0`; `dbo.uspCargurusInventoryDataLoad` contains `update_target` and `merge_key` usage against this table.
- StagingDB, ETL_Staging, Sonic_DW, and SSIS package-name checks found no direct matches for the four selected target names.

Evidence files:
- `data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/dbo__cargurusidvinmapping_dealer_temp.md`
- `data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/dbo__CarGurusIDVinMapping.md`
- `data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/dbo__CarGurusVehicleDetails.md`
- `data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/tables/dbo__CarGurusRelatedInventoryListing.md`
- `data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/stored_procedures/dbo__uspStgCarGurusDealerLoad.md`
- `data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/stored_procedures/dbo__uspCargurusDataLoad.md`
- `data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/stored_procedures/dbo__uspCargurusInventoryDataLoad.md`
- `data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/VendorData/stored_procedures/dbo__uspCargurusScrapingDataLoad.md`

Required change:
- When a stored procedure page has `update_target`, `merge_key`, `merge_update_set`, `insert`, `merge`, or equivalent executable writer evidence against a same-database vendor table, add the reverse writer relationship onto the target table summary as `created_by` or equivalent.
- Preserve the writer as a process edge, not as a source-table edge.
- Do not require SSIS/package evidence when the procedure itself contains sufficient executable writer evidence.
- Keep package-name or cross-system absence as a diagnostic, not as negative evidence against the local procedure writer.
- Combine with `LET-015` so live-populated/catalog-zero vendor feed tables are not treated as empty or low-priority.

Acceptance criteria:
- `VendorData.dbo.CarGurusIDVinMapping` shows `dbo.uspCargurusScrapingDataLoad` as a writer.
- `VendorData.dbo.CarGurusVehicleDetails` shows `dbo.uspCargurusDataLoad` as a writer.
- `VendorData.dbo.CarGurusRelatedInventoryListing` shows `dbo.uspCargurusInventoryDataLoad` and/or `dbo.uspCarGurusRelatedInventoryVehicleDataLoad` as writers when executable evidence is present.
- Tests cover a same-database vendor feed procedure writer, a populated target with stale `row_count: 0`, and a negative case where a procedure only mentions the table without writer usage.
```

### LET-019: Guard Work-Table Direction From Column Similarity

```text
We need to modify the lineage ingestion engine so work/stage/temp table direction is not inferred from column-shape similarity alone, without rewriting the engine.

Context:
The `Sonic_DW.wrk` suspicious table group showed several exact live work tables where generated markdown has unresolved creator status and many `column_match` or contextual edges. Those matches are useful hints, but they do not prove that final dimension/reporting tables feed the work table. For work tables, direction must come from executable SQL/SSIS writer or reader evidence.

Validated seed observations:
- Live `Sonic_DW.wrk.ServicedataSales` exists, but exact VendorData, StagingDB, ETL_Staging, Sonic_DW module, and SSIS package-name checks found no strong writer evidence.
- Live `Sonic_DW.wrk.Dim_DMSCustomer_newdata` exists and appears in generated customer-family column matches, but direction remains review-only without executable evidence.
- Live `Sonic_DW.wrk.update_Aso_data` exists and is generated as a column match from final/reporting objects such as `dbo.Dim_VendorAssociates`, `dbo.Fact_EmployeesActiveByMonth`, and `dbo.ProrationReport`; this should not become hard lineage direction without executable evidence.
- Live `Sonic_DW.wrk.wk_Dim_DMSCustomer` exists and has real SSIS destination evidence: package `0616_Daily_-_CoraAccount_Dim_DMSCustomer_Inc.dtsx.xml` includes destination `DODB - wrk_wk_Dim_DMSCustomer`, `OpenRowset [wrk].[wk_Dim_DMSCustomer]`, and audit row-count logging for that destination.
- Generated table pages still show unresolved or similarity-style relationships for these work tables, so the engine needs to separate "looks similar" from "is written by".

Evidence files:
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/Sonic_DW/tables/wrk__ServicedataSales.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/Sonic_DW/tables/wrk__Dim_DMSCustomer_newdata.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/Sonic_DW/tables/wrk__update_Aso_data.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/Sonic_DW/tables/wrk__wk_Dim_DMSCustomer.md`
- `data/analysis/raw/ssis/xml/0616_Daily_-_CoraAccount_Dim_DMSCustomer_Inc.dtsx.xml`

Required change:
- When either side of a generated edge is in a work/stage/temp schema or has a work-table name pattern such as `wrk`, `stage`, `tmp`, `newdata`, or `update_*`, keep column-shape matches as `similarity_review` or equivalent unless executable SQL/SSIS evidence proves direction.
- Do not promote final dimension/reporting object -> work table edges from column overlap alone.
- Promote SSIS OLE DB destinations and executable SQL writes to work tables as writer evidence, then use those process edges to establish direction.
- Keep contextual and column-match edges visible as diagnostic hints, but exclude them from positive training labels until writer/reader evidence confirms direction.
- Combine with `LET-014` so verified SSIS destination writers are materialized back onto target table summaries.

Acceptance criteria:
- `Sonic_DW.wrk.wk_Dim_DMSCustomer` gets writer/process evidence from the SSIS package destination instead of remaining creator-unresolved.
- Generated column matches from final customer tables to `Sonic_DW.wrk.wk_Dim_DMSCustomer` remain review-only unless executable evidence supports that direction.
- Generated column matches from final/reporting tables to `Sonic_DW.wrk.update_Aso_data` remain review-only without executable writer evidence.
- Tests cover a positive SSIS OLE DB destination to a work table, a negative column-similarity-only final-to-work edge, and a mixed case where similarity is retained as a hint but not trained as hard lineage.
```

### LET-020: Extract SSIS Component-Level Table Evidence Before Package-Name Matching

```text
We need to modify the lineage ingestion engine so SSIS table evidence is extracted from internal data-flow components and SQL tasks, not just package/folder/project names, without rewriting the engine.

Context:
The `StagingDB.dbo` sample showed that exact live staging tables can have no SSISDB package-name matches even though raw SSIS XML contains explicit table evidence inside OLE DB source/destination components and SQL task text. Package-name search is useful as a quick diagnostic, but it is not sufficient lineage evidence.

Validated seed observations:
- Live `StagingDB.dbo.KBBSalesStaging` row count: `1374`; generated markdown row count: `0`; SSISDB package-name lookup returned no match. Raw package `0669_KBB_KBBSales.dtsx.xml` contains `DODB - KBB Sales Staging` and `TRUNCATE TABLE [dbo].[KBBSalesStaging]`.
- Live `StagingDB.dbo.RouteOne_Staging` row count: `21901`; generated markdown row count: `0`; SSISDB package-name lookup returned no match. Raw package `0507_RouteOne_RouteOne_Daily.dtsx.xml` contains `DODB - RouteOne_Staging`, `OpenRowset [dbo].[RouteOne_Staging]`, `TRUNCATE TABLE dbo.RouteOne_Staging`, and later reads from `SODB - RouteOne_Staging`.
- Live `StagingDB.dbo.StgCensusEmplWages` row count: `14635260`; generated markdown row count: `0`; SSISDB package-name lookup returned no match. Raw package `0748_CensusDataLoad_CensusDataLoad.dtsx.xml` contains `DODB - StgCensusEmplWages`, `SODB - StgCensusEmplWages`, `TRUNCATE TABLE [dbo].[StgCensusEmplWages]`, and `Exec [dbo].[usp_Census_Cleanup]`; procedure `dbo.usp_Census_Cleanup` updates the same table.
- Live `StagingDB.dbo.JDPower_New_Staging` exists but currently has row count `0`; no exact component evidence was found in this focused sample, so it remains unresolved rather than a positive edge.

Evidence files:
- `data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/StagingDB/tables/dbo__KBBSalesStaging.md`
- `data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/StagingDB/tables/dbo__RouteOne_Staging.md`
- `data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/StagingDB/tables/dbo__StgCensusEmplWages.md`
- `data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/StagingDB/tables/dbo__JDPower_New_Staging.md`
- `data/analysis/raw/ssis/xml/0669_KBB_KBBSales.dtsx.xml`
- `data/analysis/raw/ssis/xml/0507_RouteOne_RouteOne_Daily.dtsx.xml`
- `data/analysis/raw/ssis/xml/0748_CensusDataLoad_CensusDataLoad.dtsx.xml`
- `data/analysis/raw/sqlserver/servers/L1-DWASQL-02,12010/databases/StagingDB/stored_procedures/dbo__usp_Census_Cleanup.md`

Required change:
- Parse SSIS data-flow components for OLE DB source/destination `OpenRowset`, component names, input/output lineage IDs, and source/destination paths.
- Parse SSIS SQL task text for `TRUNCATE`, `INSERT`, `UPDATE`, `MERGE`, `DELETE`, `EXEC`, and table references with schema-qualified names.
- Treat OLE DB destination components and executable SQL writes as writer/process evidence for the target table.
- Treat OLE DB source components as reader evidence, not writer evidence.
- Keep package/folder/project name matching as a low-cost discovery hint only; do not treat absence of package-name match as negative evidence when component-level XML exists.
- Combine with `LET-015` so live-populated/catalog-zero staging tables are not deprioritized.

Acceptance criteria:
- `StagingDB.dbo.RouteOne_Staging` gets writer evidence from `0507_RouteOne_RouteOne_Daily.dtsx.xml` even though SSISDB package-name search does not match the table name.
- `StagingDB.dbo.StgCensusEmplWages` gets writer/process evidence from `0748_CensusDataLoad_CensusDataLoad.dtsx.xml` and cleanup procedure evidence from `dbo.usp_Census_Cleanup`.
- `StagingDB.dbo.KBBSalesStaging` gets writer evidence from `0669_KBB_KBBSales.dtsx.xml`.
- `StagingDB.dbo.JDPower_New_Staging` remains unresolved unless exact executable writer evidence is found.
- Tests cover an OLE DB destination `OpenRowset`, an OLE DB source read-only component, a SQL task `TRUNCATE/UPDATE` writer, and a negative case where package-name search misses but component XML proves the edge.
```

### LET-014: Materialize Reverse Writer Evidence Onto Target Tables

```text
We need to modify the lineage ingestion engine to propagate verified writer evidence back onto target table summaries without rewriting the engine.

Context:
`Sonic_DW.dbo.DimVehicleSought` and `Sonic_DW.dbo.Dim_VehicleSought` were traced from the `Sonic_DW dbo` suspicious table group. Raw SSIS and SQL artifacts prove that the active load path writes `dbo.DimVehicleSought`, while both generated target table pages still show unresolved lineage. The similarly named `dbo.Dim_VehicleSought` exists, but no live writer was found; comments mention `Dim_VehicleSought` while executable SQL targets `DimVehicleSought`.

Validated seed chain:
- `Sonic_Transform_DimVehicleSought.dtsx` uses `OLEDB_ETL_Staging` and writes `[clean].[DimVehicleSought]`.
- `Sonic_Load_DimVehicleSought.dtsx` uses `OLEDB_Sonic_DW` and executes `EXEC dbo.usp_Load_DimVehicleSought ?`.
- `Sonic_DW.dbo.usp_Load_DimVehicleSought` contains `MERGE dbo.DimVehicleSought AS vhc USING ETL_Staging.clean.DimVehicleSought AS src`.
- `Sonic_DW.dbo.usp_Load_Dim_VehicleSought` comments mention `Dim_VehicleSought`, but executable SQL also targets `dbo.DimVehicleSought`.
- `Sonic_DW.dbo.DimVehicleSought` and `Sonic_DW.dbo.Dim_VehicleSought` table markdown currently show unresolved table lineage.

Evidence files:
- `data/analysis/raw/ssis/xml/0256_FOCUS_Incremental_Sonic_Transform_DimVehicleSought.dtsx.xml`
- `data/analysis/raw/ssis/xml/0260_FOCUS_Incremental_Sonic_Load_DimVehicleSought.dtsx.xml`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/Sonic_DW/stored_procedures/dbo__usp_Load_DimVehicleSought.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/Sonic_DW/stored_procedures/dbo__usp_Load_Dim_VehicleSought.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/Sonic_DW/tables/dbo__DimVehicleSought.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/Sonic_DW/tables/dbo__Dim_VehicleSought.md`

Required change:
- When a stored procedure, package, or module has verified `writes_to` evidence for a table, materialize the reverse relationship onto the target table summary as `created_by` or equivalent writer evidence.
- Preserve the writer as a process edge, not as a fake source-table edge.
- Prefer executable SQL targets from `MERGE`, `INSERT`, `UPDATE`, `DELETE`, and SSIS `OpenRowset`/Execute SQL statements over comments, display names, or near-name aliases.
- Add a near-name alias guard so `Dim_VehicleSought` is not treated as written when the executable SQL writes `DimVehicleSought`.
- Keep `Dim_VehicleSought` as `unresolved_or_stale_alias` or equivalent unless direct writer evidence appears.

Acceptance criteria:
- `Sonic_DW.dbo.DimVehicleSought` no longer appears edge-less when `usp_Load_DimVehicleSought` and `usp_Load_Dim_VehicleSought` both expose writes to it.
- `Sonic_DW.dbo.Dim_VehicleSought` is not falsely connected solely from comments or procedure names.
- Tests cover positive reverse-writer propagation and a negative near-name alias case.
```

### LET-013: Stitch SSIS Work-Load Packages To SQL MERGE Final Writers

```text
We need to modify the lineage ingestion engine to recognize a validated multi-hop SSIS-to-SQL load pattern without rewriting the engine.

Context:
`Sonic_DW.dbo.DimEmployee` was selected from the `Sonic_DW dbo` edge-less/suspicious table group. Live connector checks and raw artifacts show it has real lineage, but the current engine can miss the end-to-end chain because evidence is split across SSIS package orchestration, SSIS OLE DB destinations, and a stored procedure MERGE.

Validated seed chain:
- `SSIS_UAT` catalog contains folder `DimEmployee`, project `Daily - DimEmployee`, packages:
  - `DimEmployee_Master.dtsx`
  - `DimEmployee_WRK_DMS.dtsx`
  - `DimEmployee_WRK_Dealerware.dtsx`
  - `DimEmployee_WRK_Elead.dtsx`
  - `DimEmployee_DIM_Employee.dtsx`
- `DimEmployee_Master.dtsx` invokes work packages and `DimEmployee_DIM_Employee.dtsx`.
- `DimEmployee_WRK_DMS.dtsx` has an OLE DB destination named `DODB - wrkDimEmployee` with `OpenRowset` `[wrk].[DimEmployee]`, using the ETL staging connection.
- `DimEmployee_DIM_Employee.dtsx` executes `uspInsDimEmployee`.
- `ETL_Staging.dbo.uspInsDimEmployee` contains `MERGE [Sonic_DW].[dbo].[DimEmployee] AS [tgt] USING [wrk].[DimEmployee] AS [src]`.
- Live metadata confirms `ETL_Staging.wrk.DimEmployee`, `ETL_Staging.dbo.uspInsDimEmployee`, and `Sonic_DW.dbo.DimEmployee`.

Evidence files:
- `data/analysis/raw/ssis/xml/0062_Daily_–_DimEmployee_DimEmployee_Master.dtsx.xml`
- `data/analysis/raw/ssis/xml/0064_Daily_–_DimEmployee_DimEmployee_WRK_DMS.dtsx.xml`
- `data/analysis/raw/ssis/xml/0068_Daily_–_DimEmployee_DimEmployee_DIM_Employee.dtsx.xml`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/stored_procedures/dbo__uspInsDimEmployee.md`
- `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/Sonic_DW/tables/dbo__DimEmployee.md`

Required change:
- Add lineage stitching logic that promotes this pattern into a validated multi-hop load chain:
  `SSIS master package calls work-load package`
  -> `SSIS OLE DB destination writes ETL work/stage table`
  -> `SSIS package executes stored procedure`
  -> `stored procedure MERGE/INSERT/UPDATE writes final warehouse table`.
- Reuse existing SSIS XML extraction, SQL module parsing, and semantic lineage grouping code. Do not replace the engine.
- Preserve direct evidence types separately: `calls`, `writes_to`, `reads_from`, `depends_on`, and derived `multi_hop_load_chain`.
- Mark the derived end-to-end chain as `validated_partial` or equivalent, not as a raw direct edge, unless the engine already has a first-class derived-edge type.
- Ensure the chain is discoverable in object summaries for the final target table so `Sonic_DW.dbo.DimEmployee` no longer appears edge-less.
- Add tests using the DimEmployee seed artifacts or compact fixtures that assert:
  - the SSIS work package writes `ETL_Staging.wrk.DimEmployee`;
  - `DimEmployee_DIM_Employee.dtsx` calls `ETL_Staging.dbo.uspInsDimEmployee`;
  - `uspInsDimEmployee` writes `Sonic_DW.dbo.DimEmployee`;
  - the semantic/runtime catalog exposes the stitched path to `Sonic_DW.dbo.DimEmployee`;
  - unrelated references in `VendorData` and `StagingDB` are not invented when live/raw evidence is absent.
- Run the narrowest relevant tests first, then the lineage runtime/catalog checks, and report exact commands/results.

Acceptance criteria:
- `Sonic_DW.dbo.DimEmployee` shows a lineage path through `DimEmployee_Master.dtsx`, the `DimEmployee_WRK_*` package family, `ETL_Staging.wrk.DimEmployee`, and `ETL_Staging.dbo.uspInsDimEmployee`.
- The engine does not collapse this into a single unsupported direct edge from SSIS to `Sonic_DW.dbo.DimEmployee`; it preserves the intermediate work table and stored procedure evidence.
- The implementation generalizes to the pattern class rather than hard-coding DimEmployee object names.
- Tests cover positive stitching and a negative/no-evidence case.
```

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

### LET-021: Preserve Four-Part External SQL Dependencies

```text
We need to modify the lineage ingestion engine so SQL parsers preserve four-part SQL Server references as canonical dependency identities without rewriting the engine.

Context:
The START/JumpStart sample showed a view that clearly reads a local ETL work table and joins an external SQL Server reference table before the warehouse fact path, but the external reference can disappear if the parser only keeps local database/schema/object identities. This should be captured as a structural/reference dependency, not as a writer edge.

Validated seed observations:
- Live `StagingDB.jump.JumpstartActivity_staging` exists with row count `0`.
- Live `ETL_Staging.wrk.Jumpstart_Activity_Staging` exists with row count `0`.
- Live `ETL_Staging.wrk.vw_Fact_JumpStart_source` exists as a view.
- Live `Sonic_DW.dbo.Fact_Jumpstart` exists with row count `4836`.
- SSISDB package-name lookup returned no exact matches for the sampled JumpStart objects.
- Exact stored-procedure searches did not reveal the final writer for `Sonic_DW.dbo.Fact_Jumpstart`.
- Raw view evidence in `ETL_Staging.wrk.vw_Fact_JumpStart_source` reads `ETL_Staging.wrk.Jumpstart_Activity_Staging`, joins `[COR-SQL-02].[Speed].Jump.Entity`, and joins `Sonic_DW.dbo.Dim_Entity` plus `Sonic_DW.dbo.Dim_Date`.

Required engine changes:
- Detect bracketed and unbracketed four-part SQL Server references in views, stored procedures, functions, and SQL command text.
- Normalize them to `server.database.schema.object`.
- Preserve external server/database references as first-class dependency identities even when the external server is not in the local catalog.
- Do not collapse external references into the current database.
- Do not discard four-part references as generic contextual text.
- Classify four-part references as `depends_on` or reference-input edges for the SQL object that reads them.
- Keep writer/materialization edges separate and only emit them when explicit `INSERT`, `UPDATE`, `MERGE`, `SELECT INTO`, or SSIS destination evidence proves the target.

Seed fixture:
- `ETL_Staging.wrk.vw_Fact_JumpStart_source`

Acceptance criteria:
- The JumpStart view retains dependency on `ETL_Staging.wrk.Jumpstart_Activity_Staging`.
- The JumpStart view surfaces `COR-SQL-02.Speed.Jump.Entity` as an external SQL dependency/reference input.
- The JumpStart view preserves local dimension joins to `Sonic_DW.dbo.Dim_Entity` and `Sonic_DW.dbo.Dim_Date`.
- The engine does not invent a final writer for `Sonic_DW.dbo.Fact_Jumpstart` without explicit writer evidence.
- Regression tests cover bracketed four-part names, unbracketed four-part names, case variants, and spacing/alias variants.
```

### LET-022: Materialize Cross-Database Vendor Load Writers

```text
We need to modify the lineage ingestion engine so cross-database staging-to-vendor stored procedure writer evidence is materialized back onto target table summaries without rewriting the engine.

Context:
The Inventory feeds sample showed populated VendorData and StagingDB tables where generated table markdown still reports `row_count: 0`, `created_by: []`, and `lineage_status: external_or_unresolved`. The stored procedure page already has the useful edge evidence: it reads the StagingDB staging table and writes the VendorData presentation/feed table, but the reverse relationship is not showing up on the target table summary.

Validated seed observations:
- Live `VendorData.dbo.DriversSelectCurrentInventory` row count: `97817`; generated markdown row count: `0`; generated table summary has `created_by: []`.
- Live `StagingDB.dbo.StgDriversSelectCurrentInventory` row count: `1413`; generated markdown row count: `0`; generated table summary has `created_by: []`.
- Live `VendorData.dagrp.ep_inventory` row count: `10833`; generated markdown row count: `0`; generated table summary has `created_by: []`.
- Live `VendorData.dagrp.vw_EP_Inventory` exists as a view, but `OBJECT_DEFINITION` returned `null`, so view dependency extraction must mark definition unavailable instead of assuming no dependencies.
- `VendorData.dbo.usp_VINSolutionDataLoad` has `depends_on` and `reads_from` evidence for `StagingDB.dbo.StgDriversSelectCurrentInventory`.
- `VendorData.dbo.usp_VINSolutionDataLoad` has `writes_to` evidence for `DriversSelectCurrentInventory` and column-level insert/update target evidence against `VendorData.dbo.DriversSelectCurrentInventory`.
- `StagingDB.dbo.usp_VINSolution_Cleanup` deletes and updates `StagingDB.dbo.StgDriversSelectCurrentInventory` before the vendor load path.
- Exact SSIS XML search found no `DriversSelectCurrentInventory`, `StgDriversSelectCurrentInventory`, `ep_inventory`, or `vw_EP_Inventory` package evidence, so the SQL stored procedure evidence should carry this case.

Required engine changes:
- When a stored procedure in one database reads a staging table in another database and writes a VendorData target table, materialize the process writer edge onto the target table summary as `created_by` or equivalent.
- Preserve the path as process-mediated lineage: `StagingDB.dbo.StgDriversSelectCurrentInventory` -> `VendorData.dbo.usp_VINSolutionDataLoad` -> `VendorData.dbo.DriversSelectCurrentInventory`.
- Also preserve staging cleanup/update procedures as process evidence for the staging table, but do not treat cleanup updates as final presentation writers.
- Resolve unqualified target names inside a VendorData stored procedure to the procedure database/schema context when the target table exists there.
- Combine with catalog freshness conflict handling so live-populated/catalog-zero targets are not classified as empty.
- If a view exists but `OBJECT_DEFINITION` is `null`, emit a `definition_unavailable` diagnostic and keep the view in review rather than assigning `depends_on: []` as a confident no-dependency result.

Seed fixtures:
- `VendorData.dbo.DriversSelectCurrentInventory`
- `StagingDB.dbo.StgDriversSelectCurrentInventory`
- `VendorData.dbo.usp_VINSolutionDataLoad`
- `StagingDB.dbo.usp_VINSolution_Cleanup`
- `VendorData.dagrp.ep_inventory`
- `VendorData.dagrp.vw_EP_Inventory`

Acceptance criteria:
- `VendorData.dbo.DriversSelectCurrentInventory` shows `VendorData.dbo.usp_VINSolutionDataLoad` as a writer/process creator.
- The engine shows `StagingDB.dbo.StgDriversSelectCurrentInventory` as a source/read input to `VendorData.dbo.usp_VINSolutionDataLoad`.
- `StagingDB.dbo.usp_VINSolution_Cleanup` is attached to the staging table as cleanup/update process evidence, not as the final VendorData writer.
- `VendorData.dagrp.vw_EP_Inventory` with unavailable definition is marked `definition_unavailable` or equivalent, not confidently edge-less.
- Tests cover a cross-database staging source to VendorData target, unqualified target resolution inside the target database, cleanup/update-only procedure evidence, and a view whose definition cannot be retrieved.
```

### LET-023: Classify Clone, Dev, Backup, And Date-Suffixed Tables Before Lineage Promotion

```text
Problem:
The `Sonic_DW dbo` suspicious table group contains many HFM fact variants whose names indicate cloned, backup, dated, or development copies. A sample of `Fact_HFM_Budget_T5_2025`, `Fact_HFM_bk_20230712`, `Fact_HFM_Dev`, and `Fact_HFM_Dev3` showed table metadata but no direct SQL/SSIS writer evidence for those exact clone names.

Validated seed observations:
- `VendorData`, `StagingDB`, and `ETL_Staging` live connector checks returned no exact table matches for the four sampled `Sonic_DW.dbo` HFM clone names.
- `SSIS_UAT` connected successfully and package-name search returned no exact matches for the four sampled clone names.
- `GPA/Sonic_DW` live check timed out, so raw Sonic_DW markdown was used for object existence and metadata.
- Raw table pages for all four sampled objects show `depends_on: []`, `created_by: []`, `used_by: []`, `contextual_reads: []`, `lineage_status: external_or_unresolved`, and `row_count: 0`.
- Nearby canonical HFM objects exist, including `Sonic_DW.dbo.Fact_HFM`, `Sonic_DW.dbo.Fact_HFMBudget`, `Sonic_DW.dbo.Fact_HFMManual`, `ETL_Staging.wrk.Fact_HFM_Staging_wrk`, and `ETL_Staging.wrk.Fact_HFmBudget_Staging`.
- Exact executable writer searches did not find `INSERT`, `MERGE`, `UPDATE`, `TRUNCATE`, or `SELECT INTO` evidence for the sampled clone names.
- A second-pass `Sonic_DW.dbo` dimension-variant sample showed the same no-writer pattern for `DimAdSource_orig`, `DimAssociate110724`, `DimAssociate_0418`, `DimAssociate_07282023`, `DimAssociate_bk_0413`, `DimAssociate_FULL`, `DimCustomer_20250109`, `dimcustomer_bk05052022`, and `DimEntityRelationshipBkp20211104`.
- `ETL_Staging` live checks and `SSIS_UAT` package-name searches returned no exact same-name matches for those sampled dimension variants.
- `DimGSCDevice` is a negative classifier case: it contains the letters `dev` inside the legitimate word `Device`, but raw evidence shows `Sonic_DW.dbo.uspLoadDimGSCDevice` inserts into `dbo.DimGSCDevice`. It must not be classified as a dev/clone table from substring matching alone.

Required engine changes:
- Add a clone-name classifier for suffixes and tokens such as `_bk`, `_backup`, `BackupYYYYMMDD`, `_Dev`, `_DevN`, `_Snapshot`, and date suffixes.
- Require variant tokens to appear at safe boundaries such as underscores, separators, end-of-name, or date-pattern boundaries; do not match `dev` inside normal words such as `Device`.
- When a clone/dev/backup table has no explicit writer, classify it as `clone_or_backup_unresolved` or equivalent instead of ordinary `external_or_unresolved` production lineage.
- Link clone candidates to a canonical base table as a review-only relationship when the name and column shape strongly match, but do not promote that relationship to positive lineage without executable copy/writer evidence.
- Deprioritize clone/dev/backup candidates in the suspicious-object queue unless live row counts, freshness, or explicit writer evidence show they are active production targets.

Seed objects:
- `Sonic_DW.dbo.Fact_HFM_Budget_T5_2025`
- `Sonic_DW.dbo.Fact_HFM_bk_20230712`
- `Sonic_DW.dbo.Fact_HFM_Dev`
- `Sonic_DW.dbo.Fact_HFM_Dev3`
- `Sonic_DW.dbo.DimAssociate_bk_0413`
- `Sonic_DW.dbo.DimCustomer_20250109`
- `Sonic_DW.dbo.dimcustomer_bk05052022`
- Negative classifier case: `Sonic_DW.dbo.DimGSCDevice`

Acceptance criteria:
- The four sampled HFM clone tables are marked as clone/dev/backup unresolved rather than high-priority production edge gaps.
- The sampled dimension variants are marked as clone/dev/backup/date/manual/history-style unresolved unless explicit writer evidence exists.
- `Sonic_DW.dbo.DimGSCDevice` is not classified as a dev table and retains its writer evidence from `Sonic_DW.dbo.uspLoadDimGSCDevice`.
- The engine may show review-only similarity to canonical HFM facts, but does not create hard lineage from column similarity alone.
- Tests cover date-suffixed, `_bk`, `Backup`, and `DevN` table names plus a negative case where a normal production table contains one of those tokens as part of a legitimate business name.
```

### LET-024: Quarantine Malformed Qualified Names Before They Become Lineage Nodes

```text
Problem:
The `ETL_Staging wrk` RecallMaster sample showed valid `wrk` and `stage` tables mixed with generated catalog artifacts whose names include embedded schema tokens and malformed brackets. These artifacts should not be treated as ordinary tables or used as positive training labels unless live metadata confirms the exact identity.

Validated seed observations:
- Live `ETL_Staging.wrk.RecallMasterServiceNew` exists with row count `1972776`, while generated markdown reports `row_count: 0`.
- Live `ETL_Staging.wrk.RecallMasterService2` exists with row count `464457`, while generated markdown reports `row_count: 0`.
- Live `ETL_Staging.wrk.RecallMasterServiceBak` exists with row count `0`.
- Live `ETL_Staging.wrk.RecallMasterSalesI` exists with row count `0`.
- `VendorData` and `StagingDB` live connector checks returned no exact table matches for the sampled `wrk` RecallMaster names.
- `SSIS_UAT` connected successfully and package-name search returned no exact matches for the sampled RecallMaster names.
- `GPA/Sonic_DW` live check timed out, so raw catalog evidence was used for cross-checking.
- Raw catalog files include malformed identities such as `ETL_Staging.dbo.wrk.RecallMasterService`, `ETL_Staging.dbo.wrk.RecallMasterServiceStaging3`, and `ETL_Staging.dbo.wrrk.RecallMasterSales3`.
- Real sibling tables also exist under proper schemas, including `ETL_Staging.stage.RecallMasterService`, `ETL_Staging.stage.RecallMasterSales`, `ETL_Staging.stage.RecallMasterSales2`, `ETL_Staging.stage.RecallMasterSalesI`, and multiple `ETL_Staging.wrk.RecallMaster*` tables.
- Generated column-match/contextual edges point broadly among RecallMaster, GL, DMS, FIRE, load, stage, and wrk tables, so malformed nodes can amplify false lineage if not quarantined.

Required engine changes:
- Add an identity hygiene pass after extraction and before edge scoring.
- Flag object names that contain embedded schema-like prefixes such as `wrk.TableName` while the schema field is `dbo`.
- Flag typo schemas or typo-qualified names such as `wrrk.[RecallMasterSales3` and unmatched bracket tokens.
- When a malformed identity is detected, attempt a live/catalog lookup for the likely corrected schema/object candidate.
- If the corrected object exists, attach malformed evidence as an extraction diagnostic or review alias, not as a separate hard lineage node.
- If no corrected live/catalog object exists, quarantine the malformed node from positive edge training and high-priority suspicious-object queues.
- Combine with `LET-015` so live-populated valid objects are not hidden by stale markdown row counts.
- Combine with `LET-019` so broad column-shape matches from malformed nodes remain review-only until executable writer evidence exists.

Seed objects:
- `ETL_Staging.wrk.RecallMasterServiceBak`
- `ETL_Staging.wrk.RecallMasterServiceNew`
- `ETL_Staging.wrk.RecallMasterService2`
- `ETL_Staging.wrk.RecallMasterSalesI`
- `ETL_Staging.dbo.wrk.RecallMasterService`
- `ETL_Staging.dbo.wrk.RecallMasterServiceStaging3`
- `ETL_Staging.dbo.wrrk.RecallMasterSales3`
- `ETL_Staging.stage.RecallMasterSalesI`

Acceptance criteria:
- `ETL_Staging.dbo.wrk.RecallMasterService` and `ETL_Staging.dbo.wrrk.RecallMasterSales3` are not emitted as normal production table nodes without explicit live confirmation.
- Valid `ETL_Staging.wrk.*` and `ETL_Staging.stage.*` RecallMaster tables remain separate schema-exact nodes.
- Malformed-node evidence can be shown as a diagnostic/review alias but does not create positive lineage edges or training labels.
- Tests cover embedded schema tokens in object names, unmatched brackets, typo schema tokens, a corrected live-object alias, and a legitimate table name containing a dot-like token that should not be auto-corrected without evidence.
```

### LET-025: Classify Manual Or Reference Seed Tables Separately

```text
We need to modify the lineage ingestion engine so likely manual/reference seed tables are classified separately from broken ETL lineage, without rewriting the engine.

Context:
The `ETL_Staging dbo` sample found `ManualJournalData`, a live table with only `3` rows and an explicit manual-data name. Generated markdown reports `row_count: 0`, `created_by: []`, `used_by: []`, `contextual_reads: []`, and `lineage_status: external_or_unresolved`. Targeted searches across raw ETL SQL modules and SSIS XML did not find executable writer evidence.

Validated seed observations:
- Live `ETL_Staging.dbo.ManualJournalData` row count: `3`; generated markdown row count: `0`.
- Raw table page: `data/analysis/raw/sqlserver/servers/L1-5FSQL-01/databases/ETL_Staging/tables/dbo__ManualJournalData.md`.
- Targeted raw search found no exact SQL/SSIS writer evidence for `ManualJournalData`.
- The same sample found `ETL_Staging.dbo.EchoParkGECReportMTD` as a different pattern: live row count `177728`, with SSIS component evidence in `0390_KPI_DataLoad_KPI_EleadGEC.dtsx.xml` and `0392_KPI_DataLoad_KPI_EleadGEC.dtsx.xml`; that remains covered by `LET-020`, not this rule.

Required behavior:
- Add a lightweight classification pass for likely manual/reference seed tables when name and evidence agree.
- Candidate signals include explicit tokens such as `Manual`, `Mapping`, `Lookup`, `xref`, `Reference`, low live row count, and absence of executable SQL/SSIS writer evidence.
- Emit a distinct status such as `manual_or_reference_seed_unresolved` or equivalent.
- Do not suppress the object; surface it as stewardship/manual-maintenance lineage rather than failed ETL lineage.
- Do not apply this status when executable SSIS/procedure writer evidence exists, even if the table name contains a manual/reference token.
- Combine with `LET-015` so stale generated row counts do not hide small live seed tables.

Acceptance criteria:
- `ETL_Staging.dbo.ManualJournalData` is not shown as a generic edge-less ETL failure when live metadata confirms it exists and targeted writer evidence is absent.
- `ETL_Staging.dbo.EchoParkGECReportMTD` is not misclassified as manual/reference because raw SSIS evidence proves an automated load.
- Tests cover a small manual table, a small lookup table with a real writer, and a large normal ETL table with no manual/reference naming.
```

### LET-026: Classify Test And Error-Output Staging Artifacts Separately

```text
We need to modify the lineage ingestion engine so test, scratch, and error-output staging artifacts are classified separately from production lineage gaps, without rewriting the engine.

Context:
The `StagingDB dbo` sample was dominated by tiny live tables whose names indicate tests or error outputs. Generated table pages show `created_by: []`, `used_by: []`, broad `contextual_reads`, `lineage_status: creator_unresolved`, and `row_count: 0`. Live metadata confirms they exist with only `0-4` rows. Targeted connector checks found no exact matches outside `StagingDB`, and SSIS package-name search found no exact package matches.

Validated seed observations:
- Live `StagingDB.dbo.test_load_bad1` row count: `1`; generated markdown row count: `0`.
- Live `StagingDB.dbo.Pgc_Vehicle_Staging_error_Output` row count: `0`; generated markdown row count: `0`.
- Live `StagingDB.dbo.test_load_bad` row count: `2`; generated markdown row count: `0`.
- Live `StagingDB.dbo.commongrouperroroutput` row count: `4`; generated markdown row count: `0`.
- `VendorData` and `ETL_Staging` live connector checks returned no exact table matches for these objects.
- `SSIS_UAT` connected successfully and package-name search returned no exact matches for these objects.
- `GPA/Sonic_DW` live check timed out, so no Sonic_DW exact-match conclusion was drawn.
- Raw references were mostly column-shape/contextual spillover from broad staging families such as `dabe.weowe_staging`, `dabe.vehiclesales_staging`, and related PGC/test/error tables.

Required behavior:
- Add a classifier for table names containing clear test/error artifact tokens such as `test`, `bad`, `error`, `error_output`, `errorout`, `badrecords`, `tmp`, and `scratch`.
- Combine name signals with live row counts and evidence type: prefer this classification when row counts are tiny or zero and evidence is only contextual/column-shape.
- Emit a distinct status such as `test_or_error_artifact_unresolved` or equivalent.
- Deprioritize these objects in production suspicious-object queues unless executable writer evidence or sustained live row volume proves they are active production targets.
- Do not train positive lineage edges from column-shape matches involving these artifacts without executable SQL/SSIS writer evidence.
- Do not apply this classification to normal production error tables when they have explicit writer evidence and meaningful row volume.

Seed objects:
- `StagingDB.dbo.test_load_bad1`
- `StagingDB.dbo.Pgc_Vehicle_Staging_error_Output`
- `StagingDB.dbo.test_load_bad`
- `StagingDB.dbo.commongrouperroroutput`

Acceptance criteria:
- The four sampled StagingDB objects are not promoted as high-priority production edge gaps from column-shape/contextual matches alone.
- They remain visible as test/error artifact nodes for stewardship cleanup or troubleshooting.
- Tests cover tiny test tables, zero-row error-output tables, a production error table with executable writer evidence, and a normal table whose name contains `test` as part of a legitimate business word.
```

### LET-027: Materialize Reporting Mart Procedure Writers Before Calling Them Unresolved

```text
We need to modify the lineage ingestion engine so reporting and data-mart tables are traced through exact SQL stored-procedure writer evidence before they are treated as unresolved presentation tables, without rewriting the engine.

Context:
The `Sonic_DW dbo reporting and mart tables` sample included `DM_*`, `Doc_*`, dashboard, report, metric, projection, and mart-style objects. Exact live checks against `ETL_Staging` found no same-name `dbo` tables for the sampled objects, and SSIS package-name matching was mostly empty. However, raw Sonic_DW stored-procedure metadata already proves several same-database writers. The generated target table pages still show `created_by: []`, `used_by: []`, and `lineage_status: external_or_unresolved` or `creator_unresolved`, with `row_count: 0`.

Validated seed observations:
- `Sonic_DW.dbo.usp_Load_DM_AdvertistingExpense` has `writes_to` evidence for `Sonic_DW.dbo.DM_AdvertisingExpense` and executable `MERGE INTO DM_AdvertisingExpense`.
- `Sonic_DW.dbo.usp_FORCE_MSAgg1`, `usp_FORCE_MSAgg1_INCR`, and `usp_FORCE_MSAgg1_INCR_Range` reference/write `Sonic_DW.dbo.DM_FORCE_SUMMARY`, including `into DM_FORCE_SUMMARY`.
- `Sonic_DW.dbo.usp_Fuel_Incremental_DM` writes `Sonic_DW.dbo.DM_FUEL_Dashboard`, including `DELETE FROM [Sonic_DW].[dbo].[DM_FUEL_Dashboard]`.
- `Sonic_DW.dbo.usp_DOC_Actuals_INCR` writes `Sonic_DW.dbo.Doc_Actual`, including `DELETE FROM [dbo].[Doc_Actual]` and `INSERT INTO [dbo].[Doc_Actual]`.
- `SSIS_UAT` package-name search found a package-name match for `Doc_Actual`: `FUEL / FUEL DOC Actuals / Sonic_DW_FUEL_DOC_Actuals_Master.dtsx`.
- `ETL_Staging` live exact-name checks found no same-name `dbo` matches for the sampled reporting/mart objects.

Required behavior:
- Add a reporting/mart object family classifier for names such as `DM_*`, `Doc_*`, `Metric*`, `*Dashboard*`, `*Report*`, `*Projection*`, and `*Mart*`.
- For this family, run exact same-database SQL module writer discovery before declaring the table unresolved or relying on package-name heuristics.
- Materialize executable `writes_to` evidence from stored procedures back onto the target table summary, including procedure name, operation type, and confidence.
- Keep package-name matches as orchestration hints only unless package internals or executed SQL prove a read/write edge.
- Do not infer hard lineage from broad reporting-name similarity or column-shape overlap alone.
- If no executable writer is found, classify as `reporting_mart_unresolved` rather than a generic production fact/dimension gap.
- Combine with `LET-014` so verified writer evidence updates target table summaries, and with `LET-020` so SSIS component internals can still prove orchestration-to-SQL chains.

Seed objects:
- `Sonic_DW.dbo.DM_AdvertisingExpense`
- `Sonic_DW.dbo.DM_FORCE_SUMMARY`
- `Sonic_DW.dbo.DM_FUEL_Dashboard`
- `Sonic_DW.dbo.Doc_Actual`
- Negative/unresolved-review sample: `Sonic_DW.dbo.DM_CVLA`, `DM_CVLAInv`, `DM_FIREBudgets`, `DM_FIREBudgetsQuarter`, `DM_FIREBudgetsYear`, `DM_FixedOpsAvgRR` until executable writer evidence is found.

Acceptance criteria:
- Reporting/mart target table pages no longer remain generic `external_or_unresolved` when exact stored-procedure `writes_to` evidence exists.
- `DM_AdvertisingExpense`, `DM_FORCE_SUMMARY`, `DM_FUEL_Dashboard`, and `Doc_Actual` show their verified Sonic_DW procedure writers.
- Package-name-only matches do not create hard lineage without internal package or SQL evidence.
- Reporting/mart objects with no executable writer are labeled as reporting-mart unresolved/review rather than source-system base tables or canonical warehouse facts/dimensions.
- Tests cover exact procedure writers, package-name-only matches, broad name-similarity false positives, and unresolved reporting mart classification.
```

### LET-028: Classify Transient Sonic_DW Staging And Work Artifacts Separately

```text
We need to modify the lineage ingestion engine so zero-evidence same-database staging/work/update artifacts are classified separately from production lineage gaps, without rewriting the engine.

Context:
The `Sonic_DW dbo staging work and temp tables` sample found objects named like transient staging, work, update, processed, or scratch artifacts. Generated raw table pages show `created_by: []`, `used_by: []`, `row_count: 0`, and `lineage_status: external_or_unresolved` or `creator_unresolved`. Exact live checks against `ETL_Staging.dbo` found no same-name counterparts. `SSIS_UAT` package-name search found no package-name matches. Targeted raw Sonic_DW/ETL_Staging stored-procedure and SSIS XML search found no executable writer evidence. A live `GPA/Sonic_DW` check timed out, so the generated Sonic_DW catalog remains the available authority for row-count status in this sample.

Validated seed observations:
- `Sonic_DW.dbo.Processed_synd` has generated `row_count: 0`, no `created_by`, no `used_by`, and no targeted SQL/SSIS writer evidence.
- `Sonic_DW.dbo.stg_OneStream`, `stg_OneStream2`, and `stg_OneStream3` have generated `row_count: 0`, no `created_by`, no `used_by`, and no targeted SQL/SSIS writer evidence.
- `Sonic_DW.dbo.stg_OneStream_20250819` has generated `row_count: 0` and no writer evidence; it also overlaps the date-suffixed clone/backup handling in `LET-023`.
- `Sonic_DW.dbo.stg_powersports_agg` and `stg_powersports_azure` have generated `row_count: 0`, no `created_by`, no `used_by`, and no targeted SQL/SSIS writer evidence.
- `Sonic_DW.dbo.update_date_1` and `update_date_2` have generated `row_count: 0`, no `created_by`, no `used_by`, and no targeted SQL/SSIS writer evidence.
- `Sonic_DW.dbo.wrk_Dim_HFMBrand` has generated `row_count: 0`, `lineage_status: creator_unresolved`, no `created_by`, no `used_by`, and no targeted SQL/SSIS writer evidence.
- `ETL_Staging` exact table-existence checks returned no same-name `dbo` matches for all 10 sampled objects.
- `SSIS_UAT` package-name search returned no matches for all 10 sampled objects.

Required behavior:
- Add a classifier for same-database transient artifact names such as `stg_*`, `wrk_*`, `tmp_*`, `temp_*`, `update_*`, `processed_*`, and `audit_*` when they are in a warehouse `dbo` schema and have no executable writer evidence.
- Prefer this classification when generated or live metadata shows zero rows and raw SQL/SSIS evidence is absent.
- Emit a distinct status such as `transient_staging_artifact_unresolved` or equivalent instead of generic `external_or_unresolved`.
- Keep these objects visible for stewardship cleanup and historical review, but deprioritize them in production suspicious-object queues.
- Do not train positive lineage edges from name similarity or column-shape overlap for these artifacts without executable SQL/SSIS writer evidence.
- If executable writer evidence exists, use the writer evidence and do not apply the low-evidence transient classification.
- If the object is date-suffixed, backup, clone, or dev-like, combine with `LET-023` and choose the more specific clone/backup/date classification.
- If live metadata later shows meaningful row volume, combine with `LET-015` and raise it for normal lineage review instead of suppressing it.

Seed objects:
- `Sonic_DW.dbo.Processed_synd`
- `Sonic_DW.dbo.stg_OneStream`
- `Sonic_DW.dbo.stg_OneStream2`
- `Sonic_DW.dbo.stg_OneStream3`
- `Sonic_DW.dbo.stg_OneStream_20250819`
- `Sonic_DW.dbo.stg_powersports_agg`
- `Sonic_DW.dbo.stg_powersports_azure`
- `Sonic_DW.dbo.update_date_1`
- `Sonic_DW.dbo.update_date_2`
- `Sonic_DW.dbo.wrk_Dim_HFMBrand`

Acceptance criteria:
- The sampled zero-row Sonic_DW staging/work/update objects are not shown as high-priority production lineage failures when no executable writer evidence exists.
- They remain visible as transient/stewardship review objects.
- `stg_OneStream_20250819` is handled by the date-suffix/clone classifier when that classifier is more specific.
- A staging/work object with explicit stored-procedure or SSIS writer evidence is not misclassified as unresolved transient.
- A staging/work object with meaningful live row volume is flagged for normal lineage review and catalog freshness handling.
- Tests cover zero-row transient artifacts, date-suffixed transient artifacts, transient names with real writers, and transient names with meaningful live row counts.
```

### LET-029: Classify XREF, Bridge, Mapping, And Lookup Tables By Role

```text
We need to modify the lineage ingestion engine so XREF, bridge, mapping, lookup, and relationship tables are classified by observed role, without rewriting the engine.

Context:
The `Sonic_DW dbo xref bridge and mapping tables` sample showed that this naming family is not one lineage pattern. Some XREF objects are loaded relationship dimensions with SSIS package orchestration and SQL procedure writers. Some are read-only lookup sources inside SSIS data flows. Some are small manual/reference maps with no executable writer evidence. The engine should not treat every `xref`, `bridge`, `mapping`, or `key lookup` object as either a broken target or a loaded dimension by name alone.

Validated seed observations:
- `SSIS_UAT` package-name search found `FOCUS_PROD_INC / FOCUS Incremental / Sonic_Load_DimDMSLegacyDealXREF.dtsx`.
- `Sonic_DW.dbo.usp_LoadDimDMSLegacyDealXREF` has `writes_to: DimDMSLegacyDealXREF` and executable `MERGE dbo.DimDMSLegacyDealXREF`.
- `SSIS_UAT` package-name search found `FOCUS_PROD_INC / FOCUS Incremental / Sonic_Load_DimOpportunityPositionXREF.dtsx`.
- `Sonic_DW.dbo.uspLoadDimOpportunityPositionXREF` has `writes_to: DimOpportunityPositionXREF` and executable `MERGE dbo.DimOpportunityPositionXREF`.
- `SSIS_UAT` package-name search found `FOCUS_PROD_INC / FOCUS Incremental / Sonic_Load_DimVehicleSoughtXref.dtsx`.
- `Sonic_DW.dbo.uspScoresDimVehicleSoughtXrefLoad` reads `ETL_Staging.dbo.StgDimVehicleSoughtXref` and writes `DimVehicleSoughtXref` using executable `MERGE dbo.DimVehicleSoughtXref`.
- `CustomerXREF_KeyLU` appears as an SSIS OLE DB source in `0319_FUEL_II_-_Dependency_Check_and_Load_SONIC_DW_Master_GLSchedule.dtsx.xml`; that package maps it into destination `[wrk].[GLSchedule_CustLook]`, so the evidence is a read/lookup role, not a writer into `CustomerXREF_KeyLU`.
- Exact `ETL_Staging.dbo` table checks found no same-name counterparts for the 10 sampled objects.
- Several sampled small map/bridge objects have generated `row_count: 0`, no `created_by`, no `used_by`, and no targeted executable SQL/SSIS writer evidence in this sample: `AccountScheduleBridge`, `CallSourceThirdPartyMapping`, `Dim_CouponXref`, `eleadsThirdPartyMapping`, and `MappingKey_Focus`.

Required behavior:
- Add a role classifier for names containing `xref`, `xrf`, `bridge`, `mapping`, `map`, `relationship`, `lookup`, `KeyLU`, and similar lookup/relationship tokens.
- If executable SQL or SSIS evidence proves the object is written, classify it as a loaded relationship/xref dimension and materialize the writer evidence onto the target table summary.
- If SSIS component evidence shows the object only as an OLE DB source feeding another object, classify that edge as `reads_from` or lookup/source usage; do not infer a writer into the XREF table.
- If no executable writer exists and the table is small/zero-row/reference-shaped, classify it as `manual_or_reference_mapping_unresolved` or equivalent rather than generic production lineage failure.
- Do not train positive writer lineage from name similarity alone for XREF/map/bridge objects.
- Preserve column-level mappings when SSIS or SQL provides explicit source-to-destination column lineage, especially for lookup-source cases.
- Combine with `LET-014` for reverse writer materialization, `LET-020` for SSIS component-level evidence, `LET-025` for manual/reference seed handling, and `LET-015` when live row counts disagree with generated catalog row counts.

Seed objects:
- Loaded relationship/xref dimensions: `Sonic_DW.dbo.DimDMSLegacyDealXREF`, `Sonic_DW.dbo.DimOpportunityPositionXREF`, `Sonic_DW.dbo.DimVehicleSoughtXref`
- SSIS lookup/read source: `Sonic_DW.dbo.CustomerXREF_KeyLU`
- Manual/reference mapping review: `Sonic_DW.dbo.AccountScheduleBridge`, `CallSourceThirdPartyMapping`, `Dim_CouponXref`, `eleadsThirdPartyMapping`, `MappingKey_Focus`

Acceptance criteria:
- `DimDMSLegacyDealXREF`, `DimOpportunityPositionXREF`, and `DimVehicleSoughtXref` show verified procedure writer evidence instead of remaining generic unresolved XREF tables.
- `CustomerXREF_KeyLU` is represented as a lookup/read source into the SSIS destination, not as a package-written target.
- Small mapping/bridge tables without executable writer evidence are visible as reference/mapping review objects, not high-priority broken production lineage.
- Tests cover a loaded XREF table with procedure writer evidence, an SSIS lookup-source XREF table, a small manual mapping table, and a misleading same-token name that must not create lineage from name similarity alone.
```

### LET-030: Classify Operational App-Domain Tables By Procedure Ownership

```text
We need to modify the lineage ingestion engine so Sonic_DW operational and app-domain tables are classified by observed ownership instead of being treated as ordinary unresolved ETL targets, without rewriting the engine.

Context:
The `Sonic_DW dbo operational and app-domain tables` sample included permission, email tracking, document transaction, error log, ops review, and playbook objects. Exact live checks against `ETL_Staging.dbo` found no same-name tables, and `SSIS_UAT` package-name search found no matching packages for the sampled objects. Raw Sonic_DW SQL evidence shows that several of these are owned by same-database stored procedures, while others look like app/manual/reference operational objects with no ETL writer evidence.

Validated seed observations:
- `Sonic_DW.dbo.usp_AddDOCPermissionBulk` has executable `INSERT INTO [dbo].[Doc_TXN_BulkPermissionAdd]`.
- `Sonic_DW.dbo.usp_CreateOpsReview` writes `OpsReview`, `OpsReviewItem`, and `OpsReviewItemDetail` with executable `INSERT INTO` statements.
- `Sonic_DW.dbo.JMA_Load_Dim_Tables` and `JMA_Load_Dim_Tables_DebitCredit` write `Error_Log` from CATCH blocks using executable `INSERT INTO dbo.Error_Log`.
- `Sonic_DW.dbo.update_CSI_email_change_tracking` updates `CSI_Email_Change_Tracking`, but generated frontmatter currently has `writes_to: []`.
- `Sonic_DW.dbo.usp_Update_PB_Answer` updates `PlaybookAnswer`, but generated procedure frontmatter currently has `writes_to: []`.
- `Sonic_DW.dbo.usp_Update_Survey` reads `PlaybookAnswer` and `PlaybookQuestions` while updating another playbook/survey object, so not every operational dependency is a writer edge.
- Exact `ETL_Staging.dbo` table checks found no same-name matches for the sampled objects.
- `SSIS_UAT` package-name search found no package-name matches for the sampled objects.

Required behavior:
- Add an operational/app-domain classifier for names and evidence families such as `Permission`, `Login`, `Email`, `Error_Log`, `OpsReview`, `Playbook`, `Survey`, `SOX`, `Security`, `User`, `Role`, `Task`, `Queue`, and similar application-state or audit tables.
- Before declaring these objects unresolved, search same-database stored procedures/functions/views for exact executable `INSERT`, `UPDATE`, `MERGE`, and `DELETE` targets.
- Materialize same-database procedure writers onto target table summaries, including update-only writers and CATCH/error-log side writes.
- Distinguish read/reference usage from writer usage. If a procedure only reads `PlaybookQuestions`, do not promote it to a writer edge.
- Normalize database/schema casing in extracted dependencies, such as `Sonic_dw` versus `Sonic_DW`, while preserving the canonical object identity.
- If no executable writer is found and no live population proves active ETL behavior, classify the object as `operational_app_or_reference_unresolved` or equivalent rather than a generic production lineage failure.
- Do not infer hard lineage from package-name absence, name similarity, or column-shape overlap alone.
- Combine with `LET-014` for reverse writer materialization and with `LET-020` when SSIS component internals later prove orchestration evidence.

Seed objects:
- Procedure-written operational tables: `Sonic_DW.dbo.Doc_TXN_BulkPermissionAdd`, `OpsReview`, `OpsReviewItem`, `Error_Log`, `CSI_Email_Change_Tracking`, `PlaybookAnswer`
- Read/reference or app/manual review objects: `Sonic_DW.dbo.Corp_Report_Permissions`, `CSI_Email_Change_Tracking_Data`, `Doc_TXN_Login`, `PlaybookQuestions`

Acceptance criteria:
- `Doc_TXN_BulkPermissionAdd`, `OpsReview`, `OpsReviewItem`, `Error_Log`, `CSI_Email_Change_Tracking`, and `PlaybookAnswer` show verified same-database procedure writer evidence when executable SQL exists.
- `PlaybookQuestions` is shown as a read/reference dependency when only read evidence exists, not as a writer target.
- Operational tables with no executable writer evidence are visible as app/reference review objects, not high-priority broken ETL targets.
- Update-only procedure writers are captured even when generated frontmatter currently reports `writes_to: []`.
- Error-log inserts inside CATCH blocks are captured as side-effect writer evidence without making the error log the primary output of the procedure.
- Tests cover insert writers, update-only writers, CATCH/error-log writes, read-only operational references, casing normalization, and a misleading operational-looking name that must not create lineage from name similarity alone.
```

### LET-031: Classify Views And Helper Read Models As Read Surfaces

```text
We need to modify the lineage ingestion engine so SQL views and helper read models are treated as read/dependency surfaces instead of unresolved writer targets, without rewriting the engine.

Context:
The `Sonic_DW dbo views and helper objects` sample included objects named like `vw_*` plus canonical view objects. Exact live checks against `ETL_Staging.dbo` and `StagingDB.dbo` found no same-name objects for the 10 sampled objects. `SSIS_UAT` package-name search found no package-name matches, but raw SSIS XML shows some packages use Sonic_DW views as OLE DB source SQL. VendorData has same-name live base tables for some `vw_` names, proving that `vw_` is a naming hint, not object-type proof.

Validated seed observations:
- `Sonic_DW.dbo.vwTitleGLSchedule` is a real view with `CREATE VIEW [dbo].[vwTitleGLSchedule]`, dependencies on `Fact_GLSchedule`, `Dim_Entity`, `Dim_Account`, `Dim_GLSchedule_degen`, `Dim_Date`, and `Dim_Journal`, and SSIS source SQL in `0357_FUEL_II_-_Dependency_Check_and_Load_TitleTracking_Wrk_GLSchdule.dtsx.xml`.
- `Sonic_DW.dbo.vwDimVehicle` is a real view with `CREATE VIEW [dbo].[vwDimVehicle] AS`, dependencies on `DimVin`, `DimVehicle`, and many `DimVehicle*` helper dimensions, and SSIS source SQL references in `0507_Sales_Data_FTP_SONIC_FTP_Sales.dtsx.xml` and related FTP packages.
- `Sonic_DW.dbo.vwFactFIRESummaryReport` is a real view with `CREATE VIEW [dbo].[vwFactFIRESummaryReport]`, dependencies on `FactFireSummary`, `Dim_Date`, `Dim_Entity`, `Dim_DMSEmployee`, and `Dim_DMSCustomer`, and SSIS OLE DB source component evidence in `0196_FIRE_SIMS_DealData_Summary_SIMS_FIREDealDataSummary.dtsx.xml`.
- `Sonic_DW.dbo.vw_CallSource`, `vw_GMB`, `vw_GoogleAds`, `vw_autotrader_inventory`, `vw_eleads_goals`, `vw_GA_Combined`, and `vw_Sales_NewUsed` are cataloged under raw `tables` with `row_count: 0` and empty dependencies in this generated snapshot.
- Live `VendorData.dbo.vw_GoogleAds` and `VendorData.dbo.vw_GA_Combined` exist as `BASE TABLE` objects, showing that `vw_` prefixes cannot be used alone to classify object type.
- Exact `ETL_Staging.dbo` and `StagingDB.dbo` checks found no same-name objects for the sampled objects.
- `SSIS_UAT` package-name search returned no package-name matches for the sampled objects, but component-level XML still contains source SQL references for several views.

Required behavior:
- Use catalog object type and raw `CREATE VIEW`/definition evidence as the primary signal for view classification, not the `vw_` prefix alone.
- For confirmed views, emit `depends_on` and `reads_from` edges from the view to its base objects; do not require a writer edge for the view itself.
- When SSIS components or SQL commands read from a view, materialize the package/process as a downstream consumer of the view and classify the edge as `reads_from`, not `writes_to`.
- Preserve view-to-base-table dependencies even when downstream package-name search is empty.
- For `vw_`-named objects that are actually base tables, keep their physical type as table and route them through normal table lineage rules, live/catalog freshness handling, and writer discovery.
- Normalize casing in dependency identities such as `sonic_dw`, `sonic_Dw`, and `Sonic_DW`.
- Do not train positive writer edges from view names, package-name similarity, or column-shape overlap alone.
- Combine with `LET-020` for SSIS component-level source discovery and with `LET-015` when live object type or row counts disagree with generated markdown.

Seed objects:
- Confirmed views/read models: `Sonic_DW.dbo.vwTitleGLSchedule`, `vwDimVehicle`, `vwFactFIRESummaryReport`
- `vw_`-named table/review objects: `Sonic_DW.dbo.vw_CallSource`, `vw_GMB`, `vw_GoogleAds`, `vw_autotrader_inventory`, `vw_eleads_goals`, `vw_GA_Combined`, `vw_Sales_NewUsed`
- Cross-database same-name base table examples: `VendorData.dbo.vw_GoogleAds`, `VendorData.dbo.vw_GA_Combined`

Acceptance criteria:
- Confirmed SQL views show view-to-base-object dependencies and do not appear as unresolved production writer targets.
- SSIS packages that read from `vwTitleGLSchedule`, `vwDimVehicle`, or `vwFactFIRESummaryReport` are represented as downstream read consumers, not as writers to those views.
- `vw_`-named base tables remain table nodes and are not retyped as views from name alone.
- Empty package-name search does not suppress component-level SSIS source evidence.
- Tests cover a real view with base dependencies, an SSIS source reading a view, a `vw_`-named base table, a casing-normalized dependency, and a column-shape-only false positive that must not become a writer edge.
```

### LET-032: Stitch Canonical Dimension Load Chains Across SSIS, Stage, And SQL

```text
We need to modify the lineage ingestion engine so canonical Sonic_DW `Dim*` warehouse dimensions are stitched across SSIS orchestration, staging destinations, child load packages, and SQL load procedures/commands before they are treated as unresolved targets, without rewriting the engine.

Context:
The `Sonic_DW dbo canonical dimensions` sample included `DimActivityStatus`, `DimActivityType`, `DimAdSource`, `DimApplicationSource`, `DimAssociate`, `DimAuctionSource`, `DimCallRevuDepartment`, `DimCategory`, `DimCategoryType`, and `DimCustomer`. Generated target table pages still commonly show `created_by: []`, empty dependencies, `creator_unresolved` / `external_or_unresolved`, and stale `row_count: 0`. Raw SSIS evidence shows at least some canonical dimensions are loaded through multi-step SSIS chains where a master package calls a staging child package and a dimension child package, while component-level evidence writes stage/work objects first.
The focused `DimVehicle` validation adds a simpler but important variant: a scoped live SSIS package executes a warehouse load procedure, the procedure reads a Sonic_DW synonym over an ETL_Staging work table, and the procedure writes the final Sonic_DW dimension. The generated target table page still shows no creator and `row_count: 0`, so the engine must stitch package call, procedure writer, synonym base object, and live freshness evidence before declaring the dimension unresolved.

Validated seed observations:
- `Sonic_DW.dbo.DimAdSource` generated table markdown shows `created_by: []`, `depends_on: []`, `lineage_status: creator_unresolved`, and `row_count: 0`.
- `0004_CallRevu_CallRevu_Master.dtsx.xml` calls both `CallRevu_DimAdSourceStaging.dtsx` and `CallRevu_DimAdSource.dtsx`.
- `0008_CallRevu_CallRevu_DimAdSourceStaging.dtsx.xml` truncates `stage.DimAdSource` and writes `[stage].[DimAdSource]` through an OLE DB destination.
- The staging package maps source columns such as `Ad Source1`, `Ad Source2`, `Ad Source3`, `Ad Source4`, `Ad Source5`, `Department`, and `Meta_NaturalKey` into the stage destination.
- `DimCustomer`, `DimAssociate`, and `DimCategory` generated target pages also show empty or unresolved creator metadata even though canonical dimension naming and related ETL evidence indicate they should go through warehouse load-chain discovery before being classified as broken.
- Live `SSIS_UAT` scoped extraction for `DimVehicle.DimVehicle.DimVehicle_DIM_DimVehicle.dtsx` returns a validated `CALLS` edge to `Sonic_DW.dbo.usp_DimVehicle` through task `TSQL - usp_DimVehicle`.
- `Sonic_DW.dbo.usp_DimVehicle` reads `Sonic_DW.dbo.SynWrkDimVehicleVehicle`, and that synonym points to `[ETL_Staging].[wrk].[DimVehicle_Vehicle]`.
- Live profiling found `Sonic_DW.dbo.DimVehicle` has `16,955` rows and `ETL_Staging.wrk.DimVehicle_Vehicle` has `6,171` rows, while generated markdown for both reports `row_count: 0`.

Required behavior:
- Add a canonical dimension classifier for production `Sonic_DW.dbo.Dim*` tables, excluding clone/backup/date/dev/test/UAT/history variants already handled by dimension-variant rules.
- For canonical dimensions, search SSIS package orchestration and component-level evidence before declaring the target unresolved.
- Stitch master-package calls to child staging packages and child load packages when package names and component evidence agree on the same dimension token.
- Materialize stage/work destinations such as `ETL_Staging.stage.DimAdSource` as intermediate targets, not as the final warehouse dimension.
- Continue from the stage/work object into SQL procedure, SQL task, or child load package evidence that writes or merges the final `Sonic_DW.dbo.Dim*` target.
- Expand synonym base objects when a load procedure reads a synonym and the synonym points to the real stage/work source table.
- Normalize Sonic_DW endpoint aliases observed in SSIS connection managers before creating separate graph nodes for the same database family.
- Preserve column-level mappings from SSIS source to stage when available, but do not infer the final target writer from column shape alone.
- Treat package-name-only evidence as orchestration/review until component XML or executable SQL proves read/write direction.
- Combine with `LET-013` for SSIS-to-SQL chain stitching, `LET-014` for reverse writer materialization, `LET-020` for SSIS component-level table discovery, and `LET-015` for stale generated row counts.

Seed objects:
- `Sonic_DW.dbo.DimAdSource`
- `Sonic_DW.dbo.DimCustomer`
- `Sonic_DW.dbo.DimAssociate`
- `Sonic_DW.dbo.DimCategory`
- `ETL_Staging.stage.DimAdSource`
- `Sonic_DW.dbo.DimVehicle`
- `Sonic_DW.dbo.usp_DimVehicle`
- `Sonic_DW.dbo.SynWrkDimVehicleVehicle`
- `ETL_Staging.wrk.DimVehicle_Vehicle`
- `CallRevu_Master.dtsx`, `CallRevu_DimAdSourceStaging.dtsx`, `CallRevu_DimAdSource.dtsx`
- `DimVehicle_DIM_DimVehicle.dtsx`

Acceptance criteria:
- Canonical production dimensions are not left as generic `creator_unresolved` when SSIS/stage/procedure evidence proves a load chain.
- `DimAdSource` shows the master package, staging package, stage destination, and downstream dimension-load step as one connected chain when executable evidence is present.
- Stage/work tables remain intermediate nodes and are not mistaken for the final warehouse dimension.
- Synonym base objects are surfaced as upstream source tables instead of hiding the real ETL_Staging work table behind the Sonic_DW synonym name.
- Live row-count conflicts mark the generated page stale and do not allow `row_count: 0` to suppress otherwise proven lineage.
- Package-name-only matches do not create hard writer edges without component or executable SQL evidence.
- Clone/backup/date/dev/test/UAT dimension variants remain routed to variant classification, not canonical dimension load-chain stitching.
- Tests cover a complete master -> stage package -> stage table -> dimension load chain, a package-name-only false positive, a clone dimension variant, a stale target row-count case, and an SSIS column mapping retained as stage-level evidence.
```

### LET-033: Materialize Sequential ETL Work-Step Chains

```text
We need to modify the lineage ingestion engine so live-populated `ETL_Staging.wrk` step tables are stitched as sequential ETL work chains when SSIS component evidence proves source, destination, and downstream consumption, without rewriting the engine.

Context:
The `ETL_Staging wrk` sample included `appointmentsdetail`, `appointmentsdetail_bkup`, `AR_Dim_GLScheduleSummary_degen`, `AR_schedule_step_1`, `AR_schedule_step_2`, `AR_schedule_step_3`, `AR_schedule_step_4`, `Auto_Dim_AutoTrader_Staging`, `Auto_Fact_Working_Staging`, and `BlackBook_Staging`. Generated table markdown generally shows `created_by: []`, `used_by: []`, `depends_on: []`, and `row_count: 0`, even when live connector checks show several of these work tables are populated and SSIS package XML proves executable read/write direction.

Validated seed observations:
- Live `ETL_Staging.wrk.appointmentsdetail` row count: `3379108`; generated markdown row count: `0`.
- Live `ETL_Staging.wrk.appointmentsdetail_bkup` row count: `161090`; generated markdown row count: `0`.
- Live `ETL_Staging.wrk.AR_Dim_GLScheduleSummary_degen` row count: `337368`; generated markdown row count: `0`.
- Live `ETL_Staging.wrk.AR_schedule_step_1` row count: `1185464`; generated markdown row count: `0`.
- Live `ETL_Staging.wrk.AR_schedule_step_2` row count: `1185467`; generated markdown row count: `0`.
- Live `ETL_Staging.wrk.AR_schedule_step_3` row count: `1185467`; generated markdown row count: `0`.
- Live `ETL_Staging.wrk.AR_schedule_step_4` row count: `1185467`; generated markdown row count: `0`.
- Live `ETL_Staging.wrk.Auto_Dim_AutoTrader_Staging`, `Auto_Fact_Working_Staging`, and `BlackBook_Staging` row counts are `0`, so they should remain visible as empty staging shells unless raw writer evidence appears.
- `0333_FUEL_II_-_Dependency_Check_and_Load_SONIC_Dim_GLScheduleSummary_degen.dtsx.xml` truncates `wrk.AR_Dim_GLScheduleSummary_degen`, reads `ETL_Staging.wrk.vw_AR_Dim_GLScheduleSummary_degen`, and writes `[wrk].[AR_Dim_GLScheduleSummary_degen]` through an OLE DB destination.
- `0337_FUEL_II_-_Dependency_Check_and_Load_SONIC_Fact_GLScheduleSummary.dtsx.xml` truncates and loads `wrk.AR_schedule_step_3`, truncates and loads `wrk.AR_schedule_step_4`, then reads `wrk.AR_schedule_step_4` into `Fact_GLScheduleSummary`.
- `0490_Daily_-_PostGres_-_Load_Service_Sales_Detail_Closed_pals_appointmentsdetail.dtsx.xml` contains an external Postgres appointments-detail source flow and a later `TSQL - usp_DMS_appointmentsdetail_Merge` step, while `ETL_Staging.dbo.usp_DimServiceAppointmentDetail` reads `wrk.appointmentsdetail`.

Required behavior:
- Identify work-step chains from SSIS task/component names, OLE DB source/destination names, `OpenRowset` values, `DataObjectName` audit fields, and executable SQL task statements.
- Treat live-populated `wrk` tables as active intermediate lineage nodes, not as generic unresolved failures, when live metadata proves rows exist or raw SSIS/SQL evidence proves activity.
- Use executable SSIS evidence such as `TRUNCATE`, OLE DB destination `OpenRowset`, source SQL commands, and downstream source components to classify edge direction.
- Stitch sequential numbered steps and degen/work variants when the same package proves a source view -> work table -> next work table -> fact/dimension target path.
- Keep empty live `wrk` staging shells visible but lower priority unless exact raw writer evidence appears.
- Do not infer writer edges from column-shape similarity, package-name similarity, or shared tokens alone.
- Combine with `LET-015` for live-vs-catalog freshness conflicts, `LET-019` for work-table direction guards, and `LET-020` for SSIS component-level table discovery.

Seed objects:
- `ETL_Staging.wrk.AR_Dim_GLScheduleSummary_degen`
- `ETL_Staging.wrk.AR_schedule_step_1`
- `ETL_Staging.wrk.AR_schedule_step_2`
- `ETL_Staging.wrk.AR_schedule_step_3`
- `ETL_Staging.wrk.AR_schedule_step_4`
- `ETL_Staging.wrk.appointmentsdetail`
- `ETL_Staging.wrk.Auto_Dim_AutoTrader_Staging`
- `ETL_Staging.wrk.Auto_Fact_Working_Staging`
- `ETL_Staging.wrk.BlackBook_Staging`
- `0333_FUEL_II_-_Dependency_Check_and_Load_SONIC_Dim_GLScheduleSummary_degen.dtsx.xml`
- `0337_FUEL_II_-_Dependency_Check_and_Load_SONIC_Fact_GLScheduleSummary.dtsx.xml`
- `0490_Daily_-_PostGres_-_Load_Service_Sales_Detail_Closed_pals_appointmentsdetail.dtsx.xml`

Acceptance criteria:
- `AR_schedule_step_3` and `AR_schedule_step_4` are shown as a directional chain where source views feed work-step tables and the downstream step feeds `Fact_GLScheduleSummary`.
- `AR_Dim_GLScheduleSummary_degen` has SSIS writer evidence from the truncate/load package and is not left as a generic unresolved table.
- `appointmentsdetail` captures the external Postgres source/load family and procedure consumer as review or positive edges with correct direction, depending on exact target evidence.
- `Auto_Dim_AutoTrader_Staging`, `Auto_Fact_Working_Staging`, and `BlackBook_Staging` are not promoted as high-priority broken lineage when live row count is `0` and no exact raw writer is found.
- Tests cover sequential numbered work steps, live-populated/catalog-zero conflicts, empty staging shells, SSIS source/destination direction, and a column-shape-only false positive that must not become a writer edge.
```

### LET-034: Stitch Package-Local Stage Workspaces To Downstream Loads

```text
We need to modify the lineage ingestion engine so `ETL_Staging.stage` tables that are truncated/loaded inside SSIS packages and then consumed by package SQL or stored procedures are represented as package-local stage workspaces, without rewriting the engine.

Context:
The `ETL_Staging stage` sample included `BoA_FP`, `CBAMarketKeyMapping`, `customer_Existing`, `customer_Identity`, `customer_New`, `customer_tmpUpdate`, `customer_Update`, `CustomerFzyLkupResults`, `CustomerIMAMMergeStaging`, and `customerImportAll_FzyRef`. Generated table markdown often shows `created_by: []`, `used_by: []`, empty dependencies, and `row_count: 0`, even when raw SSIS XML proves the table is truncated or loaded as part of a package-local staging workflow. Some customer-family table pages also contain very large contextual-read clusters that mix real adjacent stage tables with unrelated broad matches.

Validated seed observations:
- `ETL_Staging.stage.CBAMarketKeyMapping` generated markdown shows no creator, no consumers, and `row_count: 0`.
- `0025_CBADW_CBA_FactVehiclePurchase.dtsx.xml` has `TSQL - Truncate Staging` with `TRUNCATE TABLE stage.FactVehiclePurchaseStaging` and `TRUNCATE TABLE stage.[CBAMarketKeyMapping]`.
- The same package has `DFLT - Load MarketKey Map Staging` and `DODB - CBAMarketKeyMapping` with `OpenRowset [stage].[CBAMarketKeyMapping]`, proving SSIS writes the stage table.
- `ETL_Staging.stage.CustomerIMAMMergeStaging` generated markdown shows no creator/consumer edges even though it has contextual reads to related customer-match stage tables.
- `0201_ELeadDuplicate_eLeadDupe_CustomerMatchResult.dtsx.xml` truncates `stage.CustomerMatchStaging`, `stage.CustomerIMAMMergeStaging`, `stage.CustomerMatchStaging_MatchPoints`, `stage.CustomerMatchStaging_InitialMatch`, `stage.CustomerMatchStaging_AdditionalMatch`, `stage.CustomerMatchStaging_AllUnMatchedFields`, and `stage.eLeadDupeMergeStaging`.
- The same eLead package has an OLE DB destination `DODB CustomerIMAMMergeStaging` with `OpenRowset [stage].[CustomerIMAMMergeStaging]`, and later SQL reads from `ETL_Staging.stage.CustomerIMAMMergeStaging` joined to `ETL_Staging.stage.CustomerMatchStaging_AllUnMatchedFields`.
- `ETL_Staging.dbo.spLoadeLead_CustomerMatchResult` reads `ETL_Staging.Stage.CustomerMatchStaging` and writes `Sonic_DW.dbo.CustomerMatchResult`, proving a downstream stage-to-warehouse consumer path.
- The sampled `customer_*` and customer-match tables show that broad contextual clusters should not be promoted to hard lineage unless exact truncate/load/source/destination/procedure evidence exists.

Required behavior:
- Identify `ETL_Staging.stage` package-local workspaces using SSIS `TRUNCATE`, OLE DB destination `OpenRowset`, source SQL command text, component names, and package sequence/container evidence.
- Materialize package -> stage table `writes_to` edges when an SSIS destination or executable SQL statement proves the exact stage object.
- Materialize stage table -> downstream procedure/package `reads_from` edges when source SQL or stored procedure definitions consume the exact stage object.
- Stitch stage workspace chains to downstream Sonic_DW targets when a procedure or package reads the stage table and writes a warehouse table.
- Keep related stage tables in the same package as adjacent workspace nodes, but do not infer hard edges between every related table from shared customer/fuzzy-match naming alone.
- Downgrade large same-family contextual read clusters to review-only unless exact executable evidence proves direction.
- Preserve schema-exact identity for `stage`, `dbo`, `wrk`, and external objects; never attach `dbo` evidence to a same-name `stage` table.
- Combine with `LET-015` for stale row counts, `LET-016` for schema-exact identity, `LET-020` for SSIS component-level discovery, and `LET-033` where stage workflows bridge into sequential work-step chains.

Seed objects:
- `ETL_Staging.stage.CBAMarketKeyMapping`
- `ETL_Staging.stage.FactVehiclePurchaseStaging`
- `ETL_Staging.stage.CustomerIMAMMergeStaging`
- `ETL_Staging.stage.CustomerMatchStaging`
- `ETL_Staging.stage.CustomerMatchStaging_AllUnMatchedFields`
- `ETL_Staging.stage.customer_Existing`
- `ETL_Staging.stage.customer_Identity`
- `ETL_Staging.stage.customer_New`
- `ETL_Staging.stage.customer_tmpUpdate`
- `ETL_Staging.stage.customer_Update`
- `0025_CBADW_CBA_FactVehiclePurchase.dtsx.xml`
- `0201_ELeadDuplicate_eLeadDupe_CustomerMatchResult.dtsx.xml`
- `ETL_Staging.dbo.spLoadeLead_CustomerMatchResult`

Acceptance criteria:
- `CBAMarketKeyMapping` shows SSIS truncate/load writer evidence from the CBA package instead of remaining generic `external_or_unresolved`.
- `CustomerIMAMMergeStaging` and related customer-match stage tables are represented as an eLead package-local stage workspace with exact truncate/load/read evidence.
- `CustomerMatchStaging` connects to `spLoadeLead_CustomerMatchResult`, and that procedure connects to `Sonic_DW.dbo.CustomerMatchResult`.
- Broad customer-family contextual-read lists do not become hard positive lineage edges without exact source/destination/procedure evidence.
- Same-name or related `dbo`, `stage`, and `wrk` objects remain schema-exact and are not collapsed.
- Tests cover a CBA stage destination, an eLead multi-table stage workspace, a downstream procedure read/write chain, a contextual-cluster false positive, and a schema collision between `stage` and `dbo` objects.
```

### LET-035: Classify Mixed ETL_Staging dbo Table Roles Before Marking Unresolved

```text
We need to modify the lineage ingestion engine so `ETL_Staging.dbo` tables are classified by observed role before they are treated as unresolved production targets, without rewriting the engine.

Context:
The `ETL_Staging dbo` sample included `EchoParkGECReportMTD`, `ManualJournalData`, `Fact_CreditApp_stage`, `RouteOne_Daily_Mart_Staging`, `BoAFileList`, and dated `AdSource*` / `CallRevu*` repair-style tables. The raw catalog contains hundreds of `dbo` table pages, and generated markdown often reports `created_by: []`, `used_by: []`, sparse contextual reads, and `row_count: 0`. Raw evidence shows this schema is mixed: some tables are real SSIS/procedure staging bridges, some are package control tables, some are manual/reference inputs, and some are dated data-fix or repair artifacts.

Validated seed observations:
- `ETL_Staging.dbo.EchoParkGECReportMTD` generated markdown shows no creator, no consumers, and `row_count: 0`, but `0390_KPI_DataLoad_KPI_EleadGEC.dtsx.xml` truncates `[ETL_Staging].[dbo].[EchoParkGECReportMTD]` and writes `[dbo].[EchoParkGECReportMTD]` through `DODB - Stage EP GEC MTD`.
- `ETL_Staging.dbo.RouteOne_Daily_Mart_Staging` generated markdown shows `creator_unresolved`, but `0508_RouteOne_RouteOne_Daily_Mart.dtsx.xml` truncates `ETL_Staging.dbo.[RouteOne_Daily_Mart_Staging]` and links an OLE DB source to `DODB - load_RouteOne_Daily_Mart_Staging`.
- `ETL_Staging.dbo.Fact_CreditApp_stage` generated markdown has partial consumer evidence but no creator; raw procedures such as `insert_applicant`, `insert_appsource`, `insert_status`, and `insert_to_fact_CreditApp` read `Fact_CreditApp_stage` and write Sonic_DW dimensions/facts.
- `ETL_Staging.dbo.BoAFileList` generated markdown looks unresolved with one file-name column, but `0015_CashManagement_CashProBoADataLoad.dtsx.xml` truncates `dbo.BoAFileList` and inserts file names into it, making it a package control/file-list table rather than a business target.
- `ETL_Staging.dbo.ManualJournalData` is a manual/reference-style table already aligned with the manual seed pattern, not a normal ETL target gap.
- Dated and fix-style objects such as `AdSource3Inserts20221227`, `AdSource3Updates20221222`, `CallRevuDimResultFix`, and related `CallRevu*Update*` tables look like one-off repair/audit artifacts and should not be trained like canonical tables without executable writer evidence.

Required behavior:
- Add role classification for `ETL_Staging.dbo` tables before defaulting to `external_or_unresolved` or `creator_unresolved`.
- Classify SSIS-loaded reporting/staging outputs when package XML proves truncate/load destination evidence, even if the table is in `dbo` instead of `stage` or `wrk`.
- Classify procedure-consumed stage bridges when ETL procedures read the `dbo` staging table and write Sonic_DW targets.
- Classify package control/file-list tables when SSIS truncates/inserts small operational values such as filenames, execution IDs, or audit/control rows.
- Classify manual/reference seed tables separately when names and columns indicate manual input and no executable writer evidence exists.
- Classify dated repair/fix/update tables separately from canonical lineage gaps unless exact recurring writer/consumer evidence exists.
- Keep schema identity exact; do not merge `dbo` staging tables with same-name `stage` or `wrk` tables.
- Combine with `LET-015` for stale generated row counts, `LET-020` for SSIS component-level discovery, `LET-025` for manual/reference seeds, and `LET-034` for stage workspace stitching.

Seed objects:
- `ETL_Staging.dbo.EchoParkGECReportMTD`
- `ETL_Staging.dbo.RouteOne_Daily_Mart_Staging`
- `ETL_Staging.dbo.Fact_CreditApp_stage`
- `ETL_Staging.dbo.BoAFileList`
- `ETL_Staging.dbo.ManualJournalData`
- `ETL_Staging.dbo.AdSource3Inserts20221227`
- `ETL_Staging.dbo.AdSource3Updates20221222`
- `ETL_Staging.dbo.CallRevuDimResultFix`
- `0390_KPI_DataLoad_KPI_EleadGEC.dtsx.xml`
- `0508_RouteOne_RouteOne_Daily_Mart.dtsx.xml`
- `0015_CashManagement_CashProBoADataLoad.dtsx.xml`
- `ETL_Staging.dbo.insert_applicant`
- `ETL_Staging.dbo.insert_appsource`
- `ETL_Staging.dbo.insert_to_fact_CreditApp`

Acceptance criteria:
- `EchoParkGECReportMTD` and `RouteOne_Daily_Mart_Staging` are materialized as SSIS-loaded `dbo` staging/reporting objects when component evidence proves destination writes.
- `Fact_CreditApp_stage` is represented as a staging bridge consumed by `insert_*` procedures that write Sonic_DW targets.
- `BoAFileList` is classified as a package control/file-list table, not a broken production lineage target.
- `ManualJournalData` is routed to manual/reference seed handling.
- Dated `AdSource*` and `CallRevu*Fix/Update*` artifacts are not promoted as canonical unresolved targets without exact executable lineage evidence.
- Tests cover one SSIS-loaded `dbo` staging table, one procedure-consumed `dbo` stage bridge, one package control table, one manual seed, one dated repair artifact, and one schema-collision guard.
```

### LET-036: Classify VendorData dbo SaaS And Feed Families By Load Pattern

```text
We need to modify the lineage ingestion engine so `VendorData.dbo` tables are classified by vendor-domain load pattern before sibling tables or column-shape similarity are treated as hard lineage, without rewriting the engine.

Context:
The `VendorData dbo` sample included `caroffer_30_day_performance`, `TSDSubsidyMetrics`, `CarGurusRelatedInventoryListing`, `DealerwareCars`, `CensusEmplWages`, `CallSourceData`, and `DriversSelectCurrentInventory`. Generated table markdown frequently shows `created_by: []`, `used_by: []`, `row_count: 0`, and either no lineage or broad contextual reads to same-vendor sibling tables. Raw evidence proves that some vendor tables are materialized by same-database procedures, some are loaded by SSIS flat-file/public-data packages, and some remain flat external outputs with unresolved final writers.

Validated seed observations:
- `VendorData.dbo.CarGurusRelatedInventoryListing` generated markdown has a broad contextual cluster of CarGurus sibling tables, but `VendorData.dbo.uspCargurusInventoryDataLoad` proves real update/insert target evidence for `CarGurusRelatedInventoryListing` and `CarGurusVinScrapingControlTable`.
- `VendorData.dbo.DealerwareCars` generated markdown has contextual reads to Dealerware sibling tables and other vendor schemas, but `VendorData.dbo.usp_DealerwareCars` proves a writer via merge-key evidence.
- `VendorData.dbo.usp_DealerwareCompanies` writes `DealerwareCompanies` using a staging source such as `StagingDB.stage.DealerwareCompanies`.
- `0748_CensusDataLoad_CensusDataLoad.dtsx.xml` shows a `SEQC - VendorData Census Load` data flow from `SODB - StgCensusEmplWages` to `DODB - CensusDataLoad`, proving SSIS-public-data load behavior for Census-family tables.
- `VendorData.dbo.caroffer_30_day_performance` and `VendorData.dbo.TSDSubsidyMetrics` have rich table shape but no exact writer was found in this sample, so they should remain flat external output/review targets rather than be linked from sibling names.
- `VendorData.dbo.CallSourceData` shows contextual links to backup/EP variants, which should be clone/sibling context unless executable writer evidence proves a data movement edge.

Required behavior:
- Add role classification for `VendorData.dbo` tables by vendor domain and load pattern before assigning generic unresolved lineage.
- Materialize same-database procedure writers for vendor families such as CarGurus and Dealerware when `MERGE`, `INSERT`, `UPDATE`, or update-target column evidence proves the target.
- Materialize cross-database staging sources when a vendor load procedure reads `StagingDB.stage` or other exact staging objects and writes `VendorData.dbo`.
- Materialize SSIS flat-file/public-data loads, such as Census, when component-level source/destination evidence proves direction.
- Treat same-vendor sibling clusters as contextual/review-only unless a procedure/package proves exact direction.
- Classify flat vendor outputs with no exact writer as `external_vendor_output_unresolved` or equivalent, not as broken warehouse lineage.
- Keep backup, EP, temp, and clone variants separate from canonical vendor tables unless exact copy/writer evidence exists.
- Combine with `LET-018` for same-database vendor procedure materialization, `LET-022` for cross-database staging-to-vendor loads, `LET-020` for SSIS component evidence, `LET-015` for stale row counts, and `LET-023` for backup/clone classification.

Seed objects:
- `VendorData.dbo.CarGurusRelatedInventoryListing`
- `VendorData.dbo.CarGurusVehicleDetails`
- `VendorData.dbo.CarGurusIDVinMapping`
- `VendorData.dbo.DealerwareCars`
- `VendorData.dbo.DealerwareCompanies`
- `VendorData.dbo.CensusEmplWages`
- `VendorData.dbo.caroffer_30_day_performance`
- `VendorData.dbo.TSDSubsidyMetrics`
- `VendorData.dbo.CallSourceData`
- `VendorData.dbo.DriversSelectCurrentInventory`
- `VendorData.dbo.uspCargurusInventoryDataLoad`
- `VendorData.dbo.usp_DealerwareCars`
- `VendorData.dbo.usp_DealerwareCompanies`
- `0748_CensusDataLoad_CensusDataLoad.dtsx.xml`

Acceptance criteria:
- CarGurus and Dealerware tables with exact procedure writer evidence are not left as generic unresolved objects.
- Census-family VendorData tables can be traced through SSIS flat-file/staging/source-to-destination evidence.
- Same-vendor sibling tables are not promoted to positive lineage edges from contextual reads or column overlap alone.
- `caroffer_30_day_performance` and `TSDSubsidyMetrics` remain explicit flat external output/review targets when no exact writer is found.
- Backup/EP/temp vendor variants remain separate nodes unless exact copy lineage is proven.
- Tests cover a same-database vendor procedure writer, a cross-database staging-to-vendor writer, an SSIS flat-file/public-data load, a sibling-cluster false positive, and a flat unresolved vendor output.
```
