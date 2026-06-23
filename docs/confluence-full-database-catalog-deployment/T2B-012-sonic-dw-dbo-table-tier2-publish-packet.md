# T2B-012 Tier 2 Batch Publish Packet

## Purpose

This packet prepares a dry-run publish package for the next queued Tier 2 batch
from `docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md`.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for review. Live publish requires explicit approval.

## Scope

| Signal                | Value        |
| --------------------- | ------------ |
| Batch                 | `T2B-012`    |
| Platform/Product      | `SQL Server` |
| Database              | `Sonic_DW`   |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 75           |
| Link refresh pages    | 2            |
| Total planned entries | 79           |
| Validation status     | `passed`     |

## Object Pages

| Object                                          | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                  |
| ----------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | --------------------------------------------------------------------------------------------------------------------- |
| `Processed_synd`                                | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Processed_synd`                                |
| `ROs_June`                                      | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / ROs_June`                                      |
| `SalesTranAssociate_Inbound_1122`               | table | profiled, review-needed | 0          | 56      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SalesTranAssociate_Inbound_1122`               |
| `SalesTranAssociate_Inbound_New`                | table | profiled, review-needed | 0          | 53      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SalesTranAssociate_Inbound_New`                |
| `SalesTranAssociate_Inbound_Oct2024`            | table | profiled, review-needed | 0          | 56      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SalesTranAssociate_Inbound_Oct2024`            |
| `SalesTranAssociate_Inbound_Oct20241`           | table | profiled, review-needed | 0          | 56      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SalesTranAssociate_Inbound_Oct20241`           |
| `SalesTranAssociate_Inbound_Oct2024b`           | table | profiled, review-needed | 0          | 56      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SalesTranAssociate_Inbound_Oct2024b`           |
| `SalesTranAssociate_Inbound_testing`            | table | profiled, review-needed | 0          | 53      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SalesTranAssociate_Inbound_testing`            |
| `SalesTranAssociate_Inbound_update`             | table | profiled, review-needed | 0          | 56      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SalesTranAssociate_Inbound_update`             |
| `ServiceCustomerDetail`                         | table | profiled, review-needed | 0          | 57      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / ServiceCustomerDetail`                         |
| `Sonic_Fact_CarsVINLeads`                       | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Sonic_Fact_CarsVINLeads`                       |
| `SoxDimResult`                                  | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SoxDimResult`                                  |
| `StandardLeadSource_bkp`                        | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / StandardLeadSource_bkp`                        |
| `Start_CSIMapping`                              | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Start_CSIMapping`                              |
| `START_Metrics`                                 | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / START_Metrics`                                 |
| `START_Permissions`                             | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / START_Permissions`                             |
| `stg_OneStream_20250819`                        | table | profiled, review-needed | 0          | 27      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / stg_OneStream_20250819`                        |
| `stg_OneStream2`                                | table | profiled, review-needed | 0          | 27      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / stg_OneStream2`                                |
| `stg_OneStream3`                                | table | profiled, review-needed | 0          | 27      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / stg_OneStream3`                                |
| `stg_powersports_agg`                           | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / stg_powersports_agg`                           |
| `stg_powersports_azure`                         | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / stg_powersports_azure`                         |
| `SurveyGizmoGM`                                 | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / SurveyGizmoGM`                                 |
| `Syndicate_BoA_Data`                            | table | profiled, review-needed | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_BoA_Data`                            |
| `Syndicate_BoA_DataFeed`                        | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_BoA_DataFeed`                        |
| `Syndicate_BoA_File`                            | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_BoA_File`                            |
| `Syndicate_BoA_File_Old`                        | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_BoA_File_Old`                        |
| `Syndicate_BoA_File_Old2`                       | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_BoA_File_Old2`                       |
| `Syndicate_BoA_File_tmp`                        | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_BoA_File_tmp`                        |
| `Syndicate_Floorplan_BoA_Dont_Fund_Old`         | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_Floorplan_BoA_Dont_Fund_Old`         |
| `Syndicate_Floorplan_BoA_Response_Old`          | table | profiled, review-needed | 0          | 31      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_Floorplan_BoA_Response_Old`          |
| `Syndicate_Floorplan_BoA_Response_Old2`         | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_Floorplan_BoA_Response_Old2`         |
| `Syndicate_Floorplan_BoA_Response_Success_Old`  | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_Floorplan_BoA_Response_Success_Old`  |
| `Syndicate_Floorplan_BoA_Response_Success_Old2` | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_Floorplan_BoA_Response_Success_Old2` |
| `Syndicate_Floorplan_BoA_Response_Success_tmp`  | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_Floorplan_BoA_Response_Success_tmp`  |
| `Syndicate_Floorplan_BoA_Response_tmp`          | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_Floorplan_BoA_Response_tmp`          |
| `Syndicate_Floorplan_Funding_Old`               | table | profiled, review-needed | 0          | 47      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_Floorplan_Funding_Old`               |
| `Syndicate_Floorplan_Payoff_Old`                | table | profiled, review-needed | 0          | 45      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_Floorplan_Payoff_Old`                |
| `Syndicate_Floorplan_Payoffs_Skip_Old`          | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_Floorplan_Payoffs_Skip_Old`          |
| `Syndicate_Floorplan_Transaction`               | table | profiled, review-needed | 0          | 65      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_Floorplan_Transaction`               |
| `Syndicate_MaxPayoff_History`                   | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_MaxPayoff_History`                   |
| `Syndicate_MaxPayoff_Old`                       | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Syndicate_MaxPayoff_Old`                       |
| `TargetSourceRel`                               | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / TargetSourceRel`                               |
| `tbl_FIRE_MSTR_Targets`                         | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / tbl_FIRE_MSTR_Targets`                         |
| `tbl_FIRE_MSTR_Targets2`                        | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / tbl_FIRE_MSTR_Targets2`                        |
| `temp`                                          | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / temp`                                          |
| `temp1`                                         | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / temp1`                                         |
| `testassociate`                                 | table | profiled, review-needed | 0          | 72      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / testassociate`                                 |
| `Transport_BadStates`                           | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Transport_BadStates`                           |
| `TRN_AccAccountAccum`                           | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / TRN_AccAccountAccum`                           |
| `TRN_DaysAligned`                               | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / TRN_DaysAligned`                               |
| `TRN_DocYesterday`                              | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / TRN_DocYesterday`                              |
| `TRN_LM_Accounting`                             | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / TRN_LM_Accounting`                             |
| `TRN_LY_Old`                                    | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / TRN_LY_Old`                                    |
| `TRN_Month`                                     | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / TRN_Month`                                     |
| `TRN_Playbook_Year`                             | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / TRN_Playbook_Year`                             |
| `TRN_QTD_Month`                                 | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / TRN_QTD_Month`                                 |
| `TRN_YTD_Month`                                 | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / TRN_YTD_Month`                                 |
| `Turbo_WTD_Statistics_Goals_EP`                 | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Turbo_WTD_Statistics_Goals_EP`                 |
| `UnclaimedProperty_2026`                        | table | profiled, review-needed | 0          | 42      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / UnclaimedProperty_2026`                        |
| `update_date_1`                                 | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / update_date_1`                                 |
| `update_date_2`                                 | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / update_date_2`                                 |
| `vData_HFM_Validation`                          | table | profiled, review-needed | 0          | 122     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vData_HFM_Validation`                          |
| `VendorMRXREF_Keys`                             | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / VendorMRXREF_Keys`                             |
| `VendorXREFID_Key_LU`                           | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / VendorXREFID_Key_LU`                           |
| `vinmissing`                                    | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vinmissing`                                    |
| `VS_CUST`                                       | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / VS_CUST`                                       |
| `VS_Cust2`                                      | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / VS_Cust2`                                      |
| `vw_autotrader_inventory`                       | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_autotrader_inventory`                       |
| `vw_CallSource`                                 | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_CallSource`                                 |
| `vw_eleads_prospects_dmssales`                  | table | profiled, review-needed | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_eleads_prospects_dmssales`                  |
| `vw_eleads_prospects_dmssales_social`           | table | profiled, review-needed | 0          | 20      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_eleads_prospects_dmssales_social`           |
| `vw_GMB`                                        | table | profiled, review-needed | 0          | 24      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_GMB`                                        |
| `vw_GMB_Service`                                | table | profiled, review-needed | 0          | 24      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_GMB_Service`                                |
| `vw_GoogleAds_Advertising_new`                  | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_GoogleAds_Advertising_new`                  |
| `vw_GoogleAds_StoreVisits`                      | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_GoogleAds_StoreVisits`                      |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-012:publish
```
