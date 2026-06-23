# T2B-090 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-090`    |
| Platform/Product      | `SQL Server` |
| Database              | `StagingDB`  |
| Schema                | `pgw`        |
| Object type scope     | `table`      |
| Object pages          | 75           |
| Link refresh pages    | 2            |
| Total planned entries | 79           |
| Validation status     | `passed`     |

## Object Pages

| Object                                       | Type  | Tags                                     | Downstream | Columns | Confidence | Path                                                                                                                |
| -------------------------------------------- | ----- | ---------------------------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------------- |
| `EP_veh_inventory_staging`                   | table | profiled, review-needed                  | 1          | 168     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / EP_veh_inventory_staging`                   |
| `Locations_Staging`                          | table | profiled, review-needed                  | 1          | 49      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / Locations_Staging`                          |
| `mps_decode_vehtype_staging`                 | table | profiled, review-needed                  | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / mps_decode_vehtype_staging`                 |
| `mps_decode_vinattribute_staging`            | table | profiled, review-needed                  | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / mps_decode_vinattribute_staging`            |
| `mps_decode_vinbody_stage_staging`           | table | profiled, review-needed                  | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / mps_decode_vinbody_stage_staging`           |
| `mps_decode_vinbody_staging`                 | table | profiled, review-needed                  | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / mps_decode_vinbody_staging`                 |
| `mps_decode_vinmake_staging`                 | table | profiled, review-needed                  | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / mps_decode_vinmake_staging`                 |
| `mps_decode_vinmfr_staging`                  | table | profiled, review-needed                  | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / mps_decode_vinmfr_staging`                  |
| `mps_decode_vinmodel_staging`                | table | profiled, review-needed                  | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / mps_decode_vinmodel_staging`                |
| `mps_decode_vintrim_staging`                 | table | profiled, review-needed                  | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / mps_decode_vintrim_staging`                 |
| `personnels_staging`                         | table | profiled, review-needed                  | 0          | 66      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / personnels_staging`                         |
| `veh_acquired_by_staging`                    | table | profiled, review-needed                  | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_acquired_by_staging`                    |
| `veh_change_log_staging`                     | table | profiled, review-needed                  | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_change_log_staging`                     |
| `veh_exterior_color_staging`                 | table | profiled, review-needed                  | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_exterior_color_staging`                 |
| `veh_interior_color_staging`                 | table | profiled, review-needed                  | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_interior_color_staging`                 |
| `veh_inventory_option_staging`               | table | profiled, review-needed                  | 1          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_inventory_option_staging`               |
| `veh_inventory_release_staging`              | table | profiled, review-needed                  | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_inventory_release_staging`              |
| `veh_inventory_staging`                      | table | profiled, review-needed                  | 2          | 168     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_inventory_staging`                      |
| `veh_inventory_status_staging`               | table | profiled, review-needed                  | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_inventory_status_staging`               |
| `veh_Loc_Account_Staging`                    | table | profiled, review-needed                  | 1          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_Loc_Account_Staging`                    |
| `veh_Loc_Make_Staging`                       | table | profiled, review-needed                  | 1          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_Loc_Make_Staging`                       |
| `veh_Loc_Model_Number_Staging`               | table | profiled, review-needed                  | 1          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_Loc_Model_Number_Staging`               |
| `veh_Loc_Model_Staging`                      | table | profiled, review-needed                  | 1          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_Loc_Model_Staging`                      |
| `veh_Loc_Series_Staging`                     | table | profiled, review-needed                  | 1          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_Loc_Series_Staging`                     |
| `veh_option_staging`                         | table | profiled, review-needed                  | 1          | 40      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_option_staging`                         |
| `veh_order_addtl_invoice_item`               | table | profiled, review-needed                  | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_order_addtl_invoice_item`               |
| `veh_order_addtl_invoice_item_Staging`       | table | profiled, review-needed                  | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_order_addtl_invoice_item_Staging`       |
| `veh_order_dealer_add_Staging`               | table | profiled, review-needed                  | 1          | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_order_dealer_add_Staging`               |
| `veh_order_invoice_pricing_staging`          | table | profiled, review-needed                  | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_order_invoice_pricing_staging`          |
| `veh_order_option_Staging`                   | table | profiled, review-needed                  | 1          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_order_option_Staging`                   |
| `veh_order_Staging`                          | table | profiled, review-needed                  | 1          | 117     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_order_Staging`                          |
| `veh_process_code_staging`                   | table | profiled, review-needed                  | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_process_code_staging`                   |
| `veh_regions_staging`                        | table | profiled, review-needed                  | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_regions_staging`                        |
| `veh_source_staging`                         | table | profiled, review-needed                  | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_source_staging`                         |
| `veh_stock_nbr_category_staging`             | table | profiled, review-needed                  | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_stock_nbr_category_staging`             |
| `veh_stock_nbr_definition_staging`           | table | profiled, review-needed                  | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_stock_nbr_definition_staging`           |
| `veh_stock_nbr_pattern_staging`              | table | profiled, review-needed                  | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_stock_nbr_pattern_staging`              |
| `veh_texture_staging`                        | table | profiled, review-needed                  | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_texture_staging`                        |
| `veh_trim_staging`                           | table | profiled, review-needed                  | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_trim_staging`                           |
| `veh_vehicle_staging`                        | table | profiled, review-needed                  | 2          | 43      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / veh_vehicle_staging`                        |
| `webV_mps_decode_vehtype`                    | table | profiled, review-needed                  | 1          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_mps_decode_vehtype`                    |
| `WebV_mps_decode_vehtype_MatchStaging`       | table | profiled, review-needed                  | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / WebV_mps_decode_vehtype_MatchStaging`       |
| `webV_mps_decode_vinattribute`               | table | profiled, review-needed                  | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_mps_decode_vinattribute`               |
| `WebV_mps_decode_vinattribute_MatchStaging`  | table | profiled, review-needed                  | 0          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / WebV_mps_decode_vinattribute_MatchStaging`  |
| `webV_mps_decode_vinbody`                    | table | profiled, review-needed                  | 1          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_mps_decode_vinbody`                    |
| `WebV_mps_decode_vinbody_MatchStaging`       | table | profiled, review-needed                  | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / WebV_mps_decode_vinbody_MatchStaging`       |
| `webV_mps_decode_vinbody_stage`              | table | profiled, review-needed                  | 1          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_mps_decode_vinbody_stage`              |
| `WebV_mps_decode_vinbody_stage_MatchStaging` | table | profiled, review-needed                  | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / WebV_mps_decode_vinbody_stage_MatchStaging` |
| `webV_mps_decode_vinmake`                    | table | profiled, review-needed                  | 1          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_mps_decode_vinmake`                    |
| `WebV_mps_decode_vinmake_MatchStaging`       | table | profiled, review-needed                  | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / WebV_mps_decode_vinmake_MatchStaging`       |
| `WebV_mps_decode_vinmfr`                     | table | profiled, review-needed                  | 1          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / WebV_mps_decode_vinmfr`                     |
| `WebV_mps_decode_vinmfr_MatchStaging`        | table | profiled, review-needed                  | 0          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / WebV_mps_decode_vinmfr_MatchStaging`        |
| `webV_mps_decode_vinmodel`                   | table | profiled, review-needed                  | 1          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_mps_decode_vinmodel`                   |
| `WebV_mps_decode_vinmodel_MatchStaging`      | table | profiled, review-needed                  | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / WebV_mps_decode_vinmodel_MatchStaging`      |
| `WebV_mps_decode_vintrim`                    | table | profiled, review-needed                  | 1          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / WebV_mps_decode_vintrim`                    |
| `WebV_mps_decode_vintrim_MatchStaging`       | table | profiled, review-needed                  | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / WebV_mps_decode_vintrim_MatchStaging`       |
| `webV_veh_acquired_by`                       | table | profiled, review-needed                  | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_veh_acquired_by`                       |
| `webV_veh_acquired_by_MatchStaging`          | table | profiled, review-needed                  | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_veh_acquired_by_MatchStaging`          |
| `webV_veh_exterior_color`                    | table | profiled, review-needed                  | 1          | 23      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_veh_exterior_color`                    |
| `WebV_veh_exterior_color_MatchStaging`       | table | profiled, review-needed                  | 0          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / WebV_veh_exterior_color_MatchStaging`       |
| `webV_veh_fuel_type`                         | table | profiled, review-needed                  | 1          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_veh_fuel_type`                         |
| `webV_veh_fuel_type_MatchStaging`            | table | profiled, review-needed                  | 0          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_veh_fuel_type_MatchStaging`            |
| `webV_veh_interior_color`                    | table | profiled, review-needed                  | 1          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_veh_interior_color`                    |
| `webV_veh_interior_color_MatchStaging`       | table | profiled, review-needed                  | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_veh_interior_color_MatchStaging`       |
| `webV_veh_inventory_release`                 | table | profiled, review-needed                  | 1          | 39      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_veh_inventory_release`                 |
| `webV_veh_inventory_release_MatchStaging`    | table | profiled, review-needed                  | 0          | 39      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_veh_inventory_release_MatchStaging`    |
| `webV_veh_inventory_status`                  | table | profiled, review-needed                  | 1          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_veh_inventory_status`                  |
| `webv_veh_inventory_status_MatchStaging`     | table | profiled, review-needed                  | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webv_veh_inventory_status_MatchStaging`     |
| `webV_veh_process_code`                      | table | profiled, review-needed                  | 1          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_veh_process_code`                      |
| `webV_veh_process_code_MatchStaging`         | table | profiled, review-needed                  | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_veh_process_code_MatchStaging`         |
| `webV_veh_source`                            | table | profiled, review-needed                  | 1          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_veh_source`                            |
| `webV_veh_source_MatchStaging`               | table | profiled, review-needed                  | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_veh_source_MatchStaging`               |
| `webV_veh_trim`                              | table | profiled, review-needed                  | 1          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webV_veh_trim`                              |
| `webv_veh_trim_MatchStaging`                 | table | profiled, review-needed                  | 0          | 21      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / webv_veh_trim_MatchStaging`                 |
| `WebVLoadDateSync`                           | table | profiled, lineage-hotspot, review-needed | 0          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw / WebVLoadDateSync`                           |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-090:publish
```
