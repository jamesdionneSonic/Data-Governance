# T2B-087 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-087`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `stage`      |
| Object type scope     | `table`      |
| Object pages          | 75           |
| Link refresh pages    | 2            |
| Total planned entries | 79           |
| Validation status     | `passed`     |

## Object Pages

| Object                                        | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                   |
| --------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| `CallSourceData`                              | table | profiled, review-needed | 0          | 38      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / CallSourceData`                              |
| `CallSourceData_EP`                           | table | profiled, review-needed | 0          | 38      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / CallSourceData_EP`                           |
| `CarGurusSourceDateAdded`                     | table | profiled, review-needed | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / CarGurusSourceDateAdded`                     |
| `CarNowDailyAgentReport`                      | table | profiled, review-needed | 1          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / CarNowDailyAgentReport`                      |
| `CarNowDailyDealershipReport`                 | table | profiled, review-needed | 1          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / CarNowDailyDealershipReport`                 |
| `EleadAppointmentActivity`                    | table | profiled, review-needed | 1          | 27      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / EleadAppointmentActivity`                    |
| `EleadTaskDueDateChanged`                     | table | profiled, review-needed | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / EleadTaskDueDateChanged`                     |
| `GPA_BMWEntity`                               | table | profiled, review-needed | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / GPA_BMWEntity`                               |
| `KBBMappingStg`                               | table | profiled, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / KBBMappingStg`                               |
| `KBBVehicleInfo`                              | table | profiled, review-needed | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / KBBVehicleInfo`                              |
| `NADAChromeStg`                               | table | profiled, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / NADAChromeStg`                               |
| `RemedyTicketData`                            | table | profiled, review-needed | 0          | 70      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / RemedyTicketData`                            |
| `RemedyXMLResponsePreStage`                   | table | profiled, review-needed | 2          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / RemedyXMLResponsePreStage`                   |
| `SimsEPVehicleListDaily`                      | table | profiled, review-needed | 0          | 27      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / SimsEPVehicleListDaily`                      |
| `SimsRetailVehicleListDaily`                  | table | profiled, review-needed | 0          | 27      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / SimsRetailVehicleListDaily`                  |
| `StgCarGurusRelatedInventorySource`           | table | profiled, review-needed | 0          | 28      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / StgCarGurusRelatedInventorySource`           |
| `UCGChromeStg`                                | table | profiled, review-needed | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / UCGChromeStg`                                |
| `WebVEP_Locations`                            | table | profiled, review-needed | 1          | 45      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_Locations`                            |
| `WebVEP_Locations_Matched`                    | table | profiled, review-needed | 0          | 45      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_Locations_Matched`                    |
| `WebVEP_mps_decode_vehtype`                   | table | profiled, review-needed | 1          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_mps_decode_vehtype`                   |
| `WebVEP_mps_decode_vehtype_matched`           | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_mps_decode_vehtype_matched`           |
| `WebVEP_mps_decode_vinattribute`              | table | profiled, review-needed | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_mps_decode_vinattribute`              |
| `WebVEP_mps_decode_vinattribute_matched`      | table | profiled, review-needed | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_mps_decode_vinattribute_matched`      |
| `WebVEP_mps_decode_vinbody`                   | table | profiled, review-needed | 1          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_mps_decode_vinbody`                   |
| `WebVEP_mps_decode_vinbody_matched`           | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_mps_decode_vinbody_matched`           |
| `WebVEP_mps_decode_vinbody_stage`             | table | profiled, review-needed | 1          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_mps_decode_vinbody_stage`             |
| `WebVEP_mps_decode_vinbody_stage_matched`     | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_mps_decode_vinbody_stage_matched`     |
| `WebVEP_mps_decode_vinmake`                   | table | profiled, review-needed | 1          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_mps_decode_vinmake`                   |
| `WebVEP_mps_decode_vinmake_matched`           | table | profiled, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_mps_decode_vinmake_matched`           |
| `WebVEP_mps_decode_vinmfr`                    | table | profiled, review-needed | 1          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_mps_decode_vinmfr`                    |
| `WebVEP_mps_decode_vinmfr_matched`            | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_mps_decode_vinmfr_matched`            |
| `WebVEP_mps_decode_vinmodel`                  | table | profiled, review-needed | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_mps_decode_vinmodel`                  |
| `WebVEP_mps_decode_vinmodel_matched`          | table | profiled, review-needed | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_mps_decode_vinmodel_matched`          |
| `WebVEP_mps_decode_vintrim`                   | table | profiled, review-needed | 1          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_mps_decode_vintrim`                   |
| `WebVEP_mps_decode_vintrim_matched`           | table | profiled, review-needed | 0          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_mps_decode_vintrim_matched`           |
| `WebVEP_veh_acquired_by`                      | table | profiled, review-needed | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_acquired_by`                      |
| `WebVEP_veh_acquired_by_matched`              | table | profiled, review-needed | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_acquired_by_matched`              |
| `WebVEP_veh_exterior_color`                   | table | profiled, review-needed | 1          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_exterior_color`                   |
| `WebVEP_veh_exterior_color_matched`           | table | profiled, review-needed | 0          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_exterior_color_matched`           |
| `WebVEP_veh_fuel_type`                        | table | profiled, review-needed | 1          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_fuel_type`                        |
| `WebVEP_veh_fuel_type_matched`                | table | profiled, review-needed | 0          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_fuel_type_matched`                |
| `WebVEP_veh_interior_color`                   | table | profiled, review-needed | 1          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_interior_color`                   |
| `WebVEP_veh_interior_color_matched`           | table | profiled, review-needed | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_interior_color_matched`           |
| `webVEP_veh_inventory`                        | table | profiled, review-needed | 1          | 165     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / webVEP_veh_inventory`                        |
| `webVEP_veh_inventory_matched`                | table | profiled, review-needed | 0          | 165     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / webVEP_veh_inventory_matched`                |
| `WebVEP_veh_inventory_option`                 | table | profiled, review-needed | 1          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_inventory_option`                 |
| `WebVEP_veh_inventory_option_matched`         | table | profiled, review-needed | 0          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_inventory_option_matched`         |
| `WebVEP_veh_loc_account`                      | table | profiled, review-needed | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_loc_account`                      |
| `WebVEP_veh_loc_account_matched`              | table | profiled, review-needed | 0          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_loc_account_matched`              |
| `WebVEP_veh_loc_make`                         | table | profiled, review-needed | 1          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_loc_make`                         |
| `WebVEP_veh_loc_make_matched`                 | table | profiled, review-needed | 0          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_loc_make_matched`                 |
| `WebVEP_veh_loc_model`                        | table | profiled, review-needed | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_loc_model`                        |
| `WebVEP_veh_loc_model_matched`                | table | profiled, review-needed | 0          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_loc_model_matched`                |
| `WebVEP_veh_loc_model_number`                 | table | profiled, review-needed | 1          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_loc_model_number`                 |
| `WebVEP_veh_loc_model_number_matched`         | table | profiled, review-needed | 0          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_loc_model_number_matched`         |
| `WebVEP_veh_loc_series`                       | table | profiled, review-needed | 1          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_loc_series`                       |
| `WebVEP_veh_loc_series_matched`               | table | profiled, review-needed | 0          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_loc_series_matched`               |
| `WebVEP_veh_option`                           | table | profiled, review-needed | 1          | 37      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_option`                           |
| `WebVEP_veh_option_matched`                   | table | profiled, review-needed | 0          | 37      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_option_matched`                   |
| `WebVEP_veh_order`                            | table | profiled, review-needed | 1          | 114     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_order`                            |
| `WebVEP_veh_order_addtl_invoice_item`         | table | profiled, review-needed | 1          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_order_addtl_invoice_item`         |
| `WebVEP_veh_order_addtl_invoice_item_matched` | table | profiled, review-needed | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_order_addtl_invoice_item_matched` |
| `WebVEP_veh_order_dealer_add`                 | table | profiled, review-needed | 1          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_order_dealer_add`                 |
| `WebVEP_veh_order_dealer_add_matched`         | table | profiled, review-needed | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_order_dealer_add_matched`         |
| `WebVEP_veh_order_matched`                    | table | profiled, review-needed | 0          | 114     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_order_matched`                    |
| `WebVEP_veh_order_option`                     | table | profiled, review-needed | 1          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_order_option`                     |
| `WebVEP_veh_order_option_matched`             | table | profiled, review-needed | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_order_option_matched`             |
| `WebVEP_veh_process_code`                     | table | profiled, review-needed | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_process_code`                     |
| `WebVEP_veh_process_code_matched`             | table | profiled, review-needed | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_process_code_matched`             |
| `WebVEP_veh_source`                           | table | profiled, review-needed | 1          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_source`                           |
| `WebVEP_veh_source_matched`                   | table | profiled, review-needed | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_source_matched`                   |
| `WebVEP_veh_trim`                             | table | profiled, review-needed | 1          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_trim`                             |
| `WebVEP_veh_trim_matched`                     | table | profiled, review-needed | 0          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_trim_matched`                     |
| `WebVEP_veh_vehicle`                          | table | profiled, review-needed | 1          | 41      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_vehicle`                          |
| `WebVEP_veh_vehicle_matched`                  | table | profiled, review-needed | 0          | 41      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage / WebVEP_veh_vehicle_matched`                  |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-087:publish
```
