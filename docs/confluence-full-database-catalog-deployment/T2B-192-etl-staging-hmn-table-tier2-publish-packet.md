# T2B-192 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-192`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `HMN`         |
| Object type scope     | `table`       |
| Object pages          | 27            |
| Link refresh pages    | 2             |
| Total planned entries | 31            |
| Validation status     | `passed`      |

## Object Pages

| Object                                         | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                    |
| ---------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| `AdvertisedDealScenarios`                      | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / AdvertisedDealScenarios`                      |
| `AdvertisedDealScenarios_Staging`              | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / AdvertisedDealScenarios_Staging`              |
| `BulletPoints`                                 | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / BulletPoints`                                 |
| `BulletPoints_Staging`                         | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / BulletPoints_Staging`                         |
| `CCRAddPrograms_Staging`                       | table | profiled, review-needed | 0          | 20      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / CCRAddPrograms_Staging`                       |
| `ConsumerCash_Staging`                         | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / ConsumerCash_Staging`                         |
| `ConsumerCashProgram_Staging`                  | table | profiled, review-needed | 0          | 24      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / ConsumerCashProgram_Staging`                  |
| `ConsumerSpecialProgram_Staging`               | table | profiled, review-needed | 0          | 26      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / ConsumerSpecialProgram_Staging`               |
| `DealerCash_Staging`                           | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / DealerCash_Staging`                           |
| `DealerCashProgram_Staging`                    | table | profiled, review-needed | 0          | 24      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / DealerCashProgram_Staging`                    |
| `DealerSpecialProgram_Staging`                 | table | profiled, review-needed | 0          | 26      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / DealerSpecialProgram_Staging`                 |
| `HomeNetAISRebates_Staging`                    | table | profiled, review-needed | 0          | 27      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / HomeNetAISRebates_Staging`                    |
| `IncentiveDealers`                             | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / IncentiveDealers`                             |
| `IncentivesRunConfig`                          | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / IncentivesRunConfig`                          |
| `Inventory_Staging`                            | table | profiled, review-needed | 0          | 20      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / Inventory_Staging`                            |
| `InventoryDetails_Staging`                     | table | profiled, review-needed | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / InventoryDetails_Staging`                     |
| `InventoryDetails_Staging_Error_Out`           | table | profiled, review-needed | 0          | 24      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / InventoryDetails_Staging_Error_Out`           |
| `Make_Staging`                                 | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / Make_Staging`                                 |
| `MakeReference`                                | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / MakeReference`                                |
| `MakeReference_Staging`                        | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / MakeReference_Staging`                        |
| `OriginalAdvertisedContent`                    | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / OriginalAdvertisedContent`                    |
| `OriginalAdvertisedContent_Staging`            | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / OriginalAdvertisedContent_Staging`            |
| `ProgramDealScenarioProgram_Staging`           | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / ProgramDealScenarioProgram_Staging`           |
| `ProgramDealScenarioProgramDeducts_Staging`    | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / ProgramDealScenarioProgramDeducts_Staging`    |
| `ProgramDealScenarioProgramTiersAPR_Staging`   | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / ProgramDealScenarioProgramTiersAPR_Staging`   |
| `ProgramDealScenarioProgramTiersLease_Staging` | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / ProgramDealScenarioProgramTiersLease_Staging` |
| `ProgramVehicleCodes_Staging`                  | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN / ProgramVehicleCodes_Staging`                  |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-192:publish
```
