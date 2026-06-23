# T2B-032 Tier 2 Batch Publish Packet

## Purpose

This packet prepares a dry-run publish package for the next queued Tier 2 batch
from `docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md`.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for review. Live publish requires explicit approval.

## Scope

| Signal                | Value         |
| --------------------- | ------------- |
| Batch                 | `T2B-032`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `dbo`         |
| Object type scope     | `table`       |
| Object pages          | 75            |
| Link refresh pages    | 2             |
| Total planned entries | 79            |
| Validation status     | `passed`      |

## Object Pages

| Object                                               | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                          |
| ---------------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `SCORES_Employee`                                    | table | profiled, review-needed | 0          | 36      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Employee`                                    |
| `SCORES_InterestedInVehicles_NO_OPP`                 | table | profiled, review-needed | 0          | 62      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_InterestedInVehicles_NO_OPP`                 |
| `SCORES_InterestedInVehicles_Staging`                | table | profiled, review-needed | 0          | 76      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_InterestedInVehicles_Staging`                |
| `SCORES_InterestedInVehicles_Staging_534`            | table | profiled, review-needed | 0          | 76      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_InterestedInVehicles_Staging_534`            |
| `SCORES_InterestedInVehicles_Staging_split`          | table | profiled, review-needed | 0          | 76      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_InterestedInVehicles_Staging_split`          |
| `SCORES_Notes_staging`                               | table | profiled, review-needed | 0          | 26      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Notes_staging`                               |
| `SCORES_Notes_staging_full`                          | table | profiled, review-needed | 0          | 27      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Notes_staging_full`                          |
| `SCORES_Opportunity_Mini_BMW`                        | table | profiled, review-needed | 0          | 61      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Opportunity_Mini_BMW`                        |
| `SCORES_Opportunity_Staging`                         | table | profiled, review-needed | 0          | 68      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Opportunity_Staging`                         |
| `SCORES_Opportunity_Staging_old`                     | table | profiled, review-needed | 0          | 68      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Opportunity_Staging_old`                     |
| `SCORES_Opportunity_Staging_View`                    | table | profiled, review-needed | 0          | 68      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Opportunity_Staging_View`                    |
| `SCORES_Owned_Opportunity_No_Match`                  | table | profiled, review-needed | 0          | 48      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Owned_Opportunity_No_Match`                  |
| `SCORES_Owned_Vehicles_Xref_Staging`                 | table | profiled, review-needed | 0          | 42      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Owned_Vehicles_Xref_Staging`                 |
| `SCORES_Owned_Vehicles_Xref_Staging_07062016`        | table | profiled, review-needed | 0          | 40      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Owned_Vehicles_Xref_Staging_07062016`        |
| `SCORES_Owned_Vehicles_Xref_Staging_07062016_dist`   | table | profiled, review-needed | 0          | 40      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Owned_Vehicles_Xref_Staging_07062016_dist`   |
| `SCORES_Owned_Vehicles_Xref_Staging_EntityKEY`       | table | profiled, review-needed | 0          | 39      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Owned_Vehicles_Xref_Staging_EntityKEY`       |
| `SCORES_Owned_Vehicles_Xref_Staging_EntityKEY_group` | table | profiled, review-needed | 0          | 39      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Owned_Vehicles_Xref_Staging_EntityKEY_group` |
| `SCORES_Owned_Vehicles_Xref_Staging_KEY`             | table | profiled, review-needed | 0          | 40      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Owned_Vehicles_Xref_Staging_KEY`             |
| `SCORES_Owned_Vehicles_Xref_Staging_key1`            | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Owned_Vehicles_Xref_Staging_key1`            |
| `SCORES_Owned_Vehicles_Xref_Staging_MDM`             | table | profiled, review-needed | 0          | 42      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Owned_Vehicles_Xref_Staging_MDM`             |
| `SCORES_Owned_Vehicles_Xref_Staging_split`           | table | profiled, review-needed | 0          | 42      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Owned_Vehicles_Xref_Staging_split`           |
| `SCORES_Owner_Staging`                               | table | profiled, review-needed | 0          | 51      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Owner_Staging`                               |
| `SCORES_PhoneActivity_Staging`                       | table | profiled, review-needed | 0          | 41      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_PhoneActivity_Staging`                       |
| `SCORES_PhoneActivity_Staging_507`                   | table | profiled, review-needed | 0          | 41      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_PhoneActivity_Staging_507`                   |
| `SCORES_PhoneActivity_Staging_full`                  | table | profiled, review-needed | 0          | 39      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_PhoneActivity_Staging_full`                  |
| `SCORES_SalesTeam_Staging`                           | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_SalesTeam_Staging`                           |
| `SCORES_Service_history_No_Match_DM_GM_code`         | table | profiled, review-needed | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Service_history_No_Match_DM_GM_code`         |
| `SCORES_ServiceAppointment_Staging`                  | table | profiled, review-needed | 0          | 38      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_ServiceAppointment_Staging`                  |
| `SCORES_ServiceHistory_Staging`                      | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_ServiceHistory_Staging`                      |
| `SCORES_ServiceHistory_Staging_split`                | table | profiled, review-needed | 0          | 31      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_ServiceHistory_Staging_split`                |
| `SCORES_ServiceHistoryAndAppmt_Staging`              | table | profiled, review-needed | 0          | 78      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_ServiceHistoryAndAppmt_Staging`              |
| `SCORES_ShowroomAppointment_Staging`                 | table | profiled, review-needed | 0          | 38      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_ShowroomAppointment_Staging`                 |
| `SCORES_ShowroomAppointment_Staging_534`             | table | profiled, review-needed | 0          | 38      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_ShowroomAppointment_Staging_534`             |
| `SCORES_ShowroomAppointment_Staging_full`            | table | profiled, review-needed | 0          | 37      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_ShowroomAppointment_Staging_full`            |
| `SCORES_ShowroomVisit_Staging`                       | table | profiled, review-needed | 0          | 34      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_ShowroomVisit_Staging`                       |
| `SCORES_ShowroomVisit_Staging_534`                   | table | profiled, review-needed | 0          | 34      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_ShowroomVisit_Staging_534`                   |
| `SCORES_ShowroomVisit_Staging_Full`                  | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_ShowroomVisit_Staging_Full`                  |
| `SCORES_Survey_Staging`                              | table | profiled, review-needed | 0          | 34      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Survey_Staging`                              |
| `SCORES_Survey_Staging_full`                         | table | profiled, review-needed | 0          | 32      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Survey_Staging_full`                         |
| `SCORES_SvcVehicleStage_Staging`                     | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_SvcVehicleStage_Staging`                     |
| `SCORES_VSC_No_Match`                                | table | profiled, review-needed | 0          | 96      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_VSC_No_Match`                                |
| `SCORES_VSC_Opp_No_Match`                            | table | profiled, review-needed | 0          | 100     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_VSC_Opp_No_Match`                            |
| `SCORES_VSC_Stage_Staging`                           | table | profiled, review-needed | 0          | 108     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_VSC_Stage_Staging`                           |
| `SCORES_VSC_Stage_Staging_BOOKED`                    | table | profiled, review-needed | 0          | 111     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_VSC_Stage_Staging_BOOKED`                    |
| `SCORES_VSC_Stage_Staging_BOOKED_1`                  | table | profiled, review-needed | 0          | 111     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_VSC_Stage_Staging_BOOKED_1`                  |
| `SCORES_VSC_Stage_staging_DMS_Sold`                  | table | profiled, review-needed | 0          | 103     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_VSC_Stage_staging_DMS_Sold`                  |
| `SCORES_VSC_Stage_Staging_new`                       | table | profiled, review-needed | 0          | 110     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_VSC_Stage_Staging_new`                       |
| `SCORES_VSC_Stage_Staging_Raj`                       | table | profiled, review-needed | 0          | 110     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_VSC_Stage_Staging_Raj`                       |
| `SCORES_VSC_Stage_Staging_Raj_1`                     | table | profiled, review-needed | 0          | 111     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_VSC_Stage_Staging_Raj_1`                     |
| `SCORES_VSC_Stage_Staging_Raj_1_new`                 | table | profiled, review-needed | 0          | 111     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_VSC_Stage_Staging_Raj_1_new`                 |
| `SCORES_VSC_Stage_Staging_Raj_1_split`               | table | profiled, review-needed | 0          | 111     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_VSC_Stage_Staging_Raj_1_split`               |
| `SCORES_VSC_Stage_Staging_Raj_1_split_new`           | table | profiled, review-needed | 0          | 111     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_VSC_Stage_Staging_Raj_1_split_new`           |
| `ScoresLiveStores`                                   | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / ScoresLiveStores`                                   |
| `SeptStockNo`                                        | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SeptStockNo`                                        |
| `ServerDiskStatus`                                   | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / ServerDiskStatus`                                   |
| `servicedata`                                        | table | profiled, review-needed | 0          | 21      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / servicedata`                                        |
| `servicedata_1`                                      | table | profiled, review-needed | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / servicedata_1`                                      |
| `SGMissingLinks`                                     | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SGMissingLinks`                                     |
| `Sheet1$`                                            | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Sheet1$`                                            |
| `shr_dealership_info`                                | table | profiled, review-needed | 0          | 40      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / shr_dealership_info`                                |
| `SIMSBookResponseUndeleteKeys`                       | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSBookResponseUndeleteKeys`                       |
| `SIMSBookUndeleteKeys`                               | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSBookUndeleteKeys`                               |
| `SIMSDWFactSIMSPriceHistory_Temp`                    | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSDWFactSIMSPriceHistory_Temp`                    |
| `SIMSFactBookUndeletes`                              | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSFactBookUndeletes`                              |
| `SIMSFactVehicleBookResponse_Temp`                   | table | profiled, review-needed | 0          | 42      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSFactVehicleBookResponse_Temp`                   |
| `SIMSFactVehicleUndeletes`                           | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSFactVehicleUndeletes`                           |
| `SIMSInventoryUndeleteKey`                           | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSInventoryUndeleteKey`                           |
| `SIMSUndeleteKey`                                    | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSUndeleteKey`                                    |
| `SIMSUndeleteKeys`                                   | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSUndeleteKeys`                                   |
| `SIMSUndeletes`                                      | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSUndeletes`                                      |
| `SIMSVehicleLogUndeleteKeys`                         | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSVehicleLogUndeleteKeys`                         |
| `SIMSVehiclelogUndeletes`                            | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SIMSVehiclelogUndeletes`                            |
| `sonic_service_vins_with_VIN_explosion`              | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / sonic_service_vins_with_VIN_explosion`              |
| `SonicCapacityDataset`                               | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SonicCapacityDataset`                               |
| `sql_TargetValidationGrpCounts`                      | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / sql_TargetValidationGrpCounts`                      |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-032:publish
```
