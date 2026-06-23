# T2B-009 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-009`    |
| Platform/Product      | `SQL Server` |
| Database              | `Sonic_DW`   |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 75           |
| Link refresh pages    | 2            |
| Total planned entries | 79           |
| Validation status     | `passed`     |

## Object Pages

| Object                                 | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                         |
| -------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| `AccountScheduleBridge`                | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / AccountScheduleBridge`                |
| `Associate_Proration`                  | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Associate_Proration`                  |
| `Associate_Proration_Exception`        | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Associate_Proration_Exception`        |
| `BI_LockHeaders_Subscriptions`         | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / BI_LockHeaders_Subscriptions`         |
| `CallSourceDedupe20211221_FactRows_2`  | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / CallSourceDedupe20211221_FactRows_2`  |
| `CSI_Email_Change_Tracking`            | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / CSI_Email_Change_Tracking`            |
| `CSI_Email_Change_Tracking_Data`       | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / CSI_Email_Change_Tracking_Data`       |
| `CustomerMatchResult_bak`              | table | profiled, review-needed | 0          | 37      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / CustomerMatchResult_bak`              |
| `date_update`                          | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / date_update`                          |
| `Dim_Account_20250618`                 | table | profiled, review-needed | 0          | 55      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Account_20250618`                 |
| `Dim_Account_20250918_Clone`           | table | profiled, review-needed | 0          | 55      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Account_20250918_Clone`           |
| `Dim_Account_Bk`                       | table | profiled, review-needed | 0          | 55      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Account_Bk`                       |
| `Dim_Account_BKP_20250709`             | table | profiled, review-needed | 0          | 55      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Account_BKP_20250709`             |
| `Dim_Account_old`                      | table | profiled, review-needed | 0          | 48      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Account_old`                      |
| `Dim_Account_testing`                  | table | profiled, review-needed | 0          | 54      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Account_testing`                  |
| `Dim_AccountPort`                      | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_AccountPort`                      |
| `Dim_ActivityStatus`                   | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_ActivityStatus`                   |
| `Dim_Audit`                            | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Audit`                            |
| `Dim_AutoTrader`                       | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_AutoTrader`                       |
| `Dim_Brand_Image`                      | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Brand_Image`                      |
| `Dim_ControlType`                      | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_ControlType`                      |
| `Dim_Customer`                         | table | profiled, review-needed | 0          | 68      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Customer`                         |
| `Dim_Date_Filtered`                    | table | profiled, review-needed | 0          | 45      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Date_Filtered`                    |
| `Dim_DateClone`                        | table | profiled, review-needed | 0          | 73      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_DateClone`                        |
| `Dim_DateEvent_Old`                    | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_DateEvent_Old`                    |
| `Dim_DayOfWeek`                        | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_DayOfWeek`                        |
| `Dim_Department`                       | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Department`                       |
| `Dim_DFOD`                             | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_DFOD`                             |
| `dim_dmsCustomer_bk05052022`           | table | profiled, review-needed | 0          | 70      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_dmsCustomer_bk05052022`           |
| `Dim_DMSCustomer_history`              | table | profiled, review-needed | 0          | 62      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_DMSCustomer_history`              |
| `Dim_DoorRate`                         | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_DoorRate`                         |
| `Dim_EPTContactStatus`                 | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_EPTContactStatus`                 |
| `Dim_EPTEmailURL`                      | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_EPTEmailURL`                      |
| `Dim_Flags`                            | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Flags`                            |
| `Dim_Geography`                        | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Geography`                        |
| `Dim_GLDetail_arch`                    | table | profiled, review-needed | 0          | 33      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_GLDetail_arch`                    |
| `Dim_GLDetail_ToBeDeleted`             | table | profiled, review-needed | 0          | 33      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_GLDetail_ToBeDeleted`             |
| `dim_GLSchedule_degen_arc`             | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_GLSchedule_degen_arc`             |
| `Dim_HFM`                              | table | profiled, review-needed | 0          | 31      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_HFM`                              |
| `DIM_JMA_CANCELLATION_REASON_CODE_TBL` | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DIM_JMA_CANCELLATION_REASON_CODE_TBL` |
| `Dim_Journal_old`                      | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Journal_old`                      |
| `Dim_NavSec_MAR`                       | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_NavSec_MAR`                       |
| `Dim_NewUsed`                          | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_NewUsed`                          |
| `dim_Op_Code_Group`                    | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_Op_Code_Group`                    |
| `Dim_PartSaleType`                     | table | profiled, review-needed | 1          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_PartSaleType`                     |
| `Dim_Quarter`                          | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Quarter`                          |
| `Dim_Scenario`                         | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Scenario`                         |
| `Dim_Schedule`                         | table | profiled, review-needed | 0          | 41      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Schedule`                         |
| `Dim_SearchPhrase`                     | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_SearchPhrase`                     |
| `Dim_SourceEntity`                     | table | profiled, review-needed | 1          | 48      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_SourceEntity`                     |
| `Dim_SourceJournal`                    | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_SourceJournal`                    |
| `dim_Time_Lgcy`                        | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_Time_Lgcy`                        |
| `Dim_TurnoverGroupOld`                 | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_TurnoverGroupOld`                 |
| `dim_vehicle_20241119`                 | table | profiled, review-needed | 0          | 48      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_vehicle_20241119`                 |
| `dim_vehicle_20241119_test`            | table | profiled, review-needed | 0          | 48      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_vehicle_20241119_test`            |
| `dim_vehicle_20241216`                 | table | profiled, review-needed | 0          | 48      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_vehicle_20241216`                 |
| `Dim_Vehicle_20250130`                 | table | profiled, review-needed | 0          | 49      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Vehicle_20250130`                 |
| `dim_vehicle_bkp_20241204`             | table | profiled, review-needed | 0          | 48      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_vehicle_bkp_20241204`             |
| `dim_vehicle_BKP_20241209`             | table | profiled, review-needed | 0          | 48      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_vehicle_BKP_20241209`             |
| `dim_vehicle_bkp_20241212`             | table | profiled, review-needed | 0          | 48      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_vehicle_bkp_20241212`             |
| `Dim_Vehicle_bkp_20241213`             | table | profiled, review-needed | 0          | 49      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Vehicle_bkp_20241213`             |
| `Dim_Vehicle_bkp_20250130`             | table | profiled, review-needed | 0          | 49      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Vehicle_bkp_20250130`             |
| `dim_vehicle_BKP_20250131`             | table | profiled, review-needed | 0          | 49      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_vehicle_BKP_20250131`             |
| `dim_vehicle_BKP_20250203`             | table | profiled, review-needed | 0          | 49      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_vehicle_BKP_20250203`             |
| `Dim_Vehicle_BKP_20250204`             | table | profiled, review-needed | 0          | 49      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Vehicle_BKP_20250204`             |
| `Dim_Vehicle_BKP_20250206`             | table | profiled, review-needed | 0          | 49      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Vehicle_BKP_20250206`             |
| `dim_Vehicle_bkp_20250403`             | table | profiled, review-needed | 0          | 49      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_Vehicle_bkp_20250403`             |
| `dim_Vehicle_bkp_20250410`             | table | profiled, review-needed | 0          | 49      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_Vehicle_bkp_20250410`             |
| `dim_vehicle_BKP_20250702`             | table | profiled, review-needed | 0          | 49      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_vehicle_BKP_20250702`             |
| `Dim_Vehicle_new`                      | table | profiled, review-needed | 0          | 48      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Vehicle_new`                      |
| `dim_vehicle_PreUpdate_20250702`       | table | profiled, review-needed | 0          | 49      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_vehicle_PreUpdate_20250702`       |
| `Dim_VehicleDetail`                    | table | profiled, review-needed | 0          | 64      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_VehicleDetail`                    |
| `Dim_VehicleGeneral`                   | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_VehicleGeneral`                   |
| `Dim_VehicleSought`                    | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_VehicleSought`                    |
| `Dim_Vendor`                           | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Vendor`                           |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-009:publish
```
