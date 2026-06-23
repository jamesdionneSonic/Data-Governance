# T2B-029 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-029`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `dbo`         |
| Object type scope     | `table`       |
| Object pages          | 75            |
| Link refresh pages    | 2             |
| Total planned entries | 79            |
| Validation status     | `passed`      |

## Object Pages

| Object                                                | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                           |
| ----------------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `CallRevuAdSource4Update20221216`                     | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallRevuAdSource4Update20221216`                     |
| `CallRevuDeptUpdate`                                  | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallRevuDeptUpdate`                                  |
| `CallRevuDimResultFix`                                | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallRevuDimResultFix`                                |
| `CallRevuFactCallSource_RekeyForDupeAdSource20221218` | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallRevuFactCallSource_RekeyForDupeAdSource20221218` |
| `CallRevuInvalidRows`                                 | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallRevuInvalidRows`                                 |
| `CallRevuIVRDeptUpdate20221220`                       | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallRevuIVRDeptUpdate20221220`                       |
| `CallRevuReviewStatusFix`                             | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallRevuReviewStatusFix`                             |
| `CallSource202112558dupes`                            | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallSource202112558dupes`                            |
| `CallSourceCallRevu_Cleanup`                          | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallSourceCallRevu_Cleanup`                          |
| `CallSourceCallRevu_EntityKeyFix`                     | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallSourceCallRevu_EntityKeyFix`                     |
| `CallSourceDedupe_102_20211201_fwd`                   | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallSourceDedupe_102_20211201_fwd`                   |
| `CallSourceDedupe_176_20211201_fwd`                   | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallSourceDedupe_176_20211201_fwd`                   |
| `CallSourceDedupe_527_20211201_fwd`                   | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallSourceDedupe_527_20211201_fwd`                   |
| `CallSourceDedupe_550_20211201_fwd`                   | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallSourceDedupe_550_20211201_fwd`                   |
| `CallSourceDedupe_568_20211201_fwd`                   | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallSourceDedupe_568_20211201_fwd`                   |
| `CallSourceDedupe_ent378Last_20211201_fwd`            | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallSourceDedupe_ent378Last_20211201_fwd`            |
| `CallSourceDedupe_ent59_378_20211201_fwd`             | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallSourceDedupe_ent59_378_20211201_fwd`             |
| `CallSourceDedupe_LoadDates_20221221_fwd`             | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallSourceDedupe_LoadDates_20221221_fwd`             |
| `CallSourceDedupe20211221`                            | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallSourceDedupe20211221`                            |
| `CallSourceDedupe20211221_2`                          | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallSourceDedupe20211221_2`                          |
| `CallSourceDedupe20211221_4`                          | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallSourceDedupe20211221_4`                          |
| `CallSourceDedupe20211221_FactRows`                   | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallSourceDedupe20211221_FactRows`                   |
| `CallSourceDedupe558_20211201_fwd`                    | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallSourceDedupe558_20211201_fwd`                    |
| `CallSourceRekeyLkp`                                  | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallSourceRekeyLkp`                                  |
| `CallSourceRekeyLkp_CallRevu`                         | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallSourceRekeyLkp_CallRevu`                         |
| `CallSourceRekeyLkp_CallRevu_stg`                     | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CallSourceRekeyLkp_CallRevu_stg`                     |
| `contact`                                             | table | profiled, review-needed | 0          | 353     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / contact`                                             |
| `ControllerScorecard_8390`                            | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / ControllerScorecard_8390`                            |
| `ControllerScoreCard_MGMTNET`                         | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / ControllerScoreCard_MGMTNET`                         |
| `ControllerScorecardPointsRAW`                        | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / ControllerScorecardPointsRAW`                        |
| `CovidCallList`                                       | table | profiled, review-needed | 0          | 20      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CovidCallList`                                       |
| `CustomerCleanedAll`                                  | table | profiled, review-needed | 0          | 46      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / CustomerCleanedAll`                                  |
| `DatabaseStatus`                                      | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DatabaseStatus`                                      |
| `dataddc`                                             | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dataddc`                                             |
| `DaylightSavingsTime`                                 | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DaylightSavingsTime`                                 |
| `DealDataFinal_spilt`                                 | table | profiled, review-needed | 0          | 123     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DealDataFinal_spilt`                                 |
| `DealDataFinal_Staging_OPP`                           | table | profiled, review-needed | 0          | 120     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DealDataFinal_Staging_OPP`                           |
| `DealDataFinal_Staging_OPP_Booked`                    | table | profiled, review-needed | 0          | 123     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DealDataFinal_Staging_OPP_Booked`                    |
| `DealDataFinal_Staging_OPP_spilt`                     | table | profiled, review-needed | 0          | 123     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DealDataFinal_Staging_OPP_spilt`                     |
| `DealsWithNoCustomer`                                 | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DealsWithNoCustomer`                                 |
| `DeleteGLrecords_keys`                                | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DeleteGLrecords_keys`                                |
| `DetailKeyDeletes`                                    | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DetailKeyDeletes`                                    |
| `dim_entity_test`                                     | table | profiled, review-needed | 0          | 64      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dim_entity_test`                                     |
| `dim_entity_test2`                                    | table | profiled, review-needed | 0          | 64      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dim_entity_test2`                                    |
| `Dim_GLDetail_BAK`                                    | table | profiled, review-needed | 0          | 33      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Dim_GLDetail_BAK`                                    |
| `dim_SEO_staging`                                     | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dim_SEO_staging`                                     |
| `Dim_Vehicle_MakeUpdates_20240419`                    | table | profiled, review-needed | 0          | 49      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Dim_Vehicle_MakeUpdates_20240419`                    |
| `Dim_Vehicle_ModelCategory_xref_20240419`             | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Dim_Vehicle_ModelCategory_xref_20240419`             |
| `Dim_Vehicle_ModelCategoryFix_20240419`               | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Dim_Vehicle_ModelCategoryFix_20240419`               |
| `Dim_Vehicle_ModelUpdates_20240419`                   | table | profiled, review-needed | 0          | 49      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Dim_Vehicle_ModelUpdates_20240419`                   |
| `Dim_Vehicle_Series_Mapping`                          | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Dim_Vehicle_Series_Mapping`                          |
| `Dim_Vehicle_Update_20250702`                         | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Dim_Vehicle_Update_20250702`                         |
| `DimAdSource_20221216_bak`                            | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DimAdSource_20221216_bak`                            |
| `DimEntitiesStaging`                                  | table | profiled, review-needed | 0          | 64      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DimEntitiesStaging`                                  |
| `DimEntityPreStaging`                                 | table | profiled, review-needed | 0          | 64      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DimEntityPreStaging`                                 |
| `DimLeadSourceStaging`                                | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DimLeadSourceStaging`                                |
| `DimLeadSubSourceStaging`                             | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DimLeadSubSourceStaging`                             |
| `DimOpportunitySource_BK`                             | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DimOpportunitySource_BK`                             |
| `DimStandardLeadSourceTier`                           | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DimStandardLeadSourceTier`                           |
| `DimSurveyAudit_12082020`                             | table | profiled, review-needed | 0          | 40      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DimSurveyAudit_12082020`                             |
| `DimSurveyAudit_BK_07282020`                          | table | profiled, review-needed | 0          | 40      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DimSurveyAudit_BK_07282020`                          |
| `DimSurveyAudit_BK_07302020`                          | table | profiled, review-needed | 0          | 40      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DimSurveyAudit_BK_07302020`                          |
| `DMScustomer`                                         | table | profiled, review-needed | 0          | 157     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DMScustomer`                                         |
| `DMSStocknoSeptTEMP`                                  | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DMSStocknoSeptTEMP`                                  |
| `DODB - Dim_DMSCustomer_Staging`                      | table | profiled, review-needed | 0          | 91      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / DODB - Dim_DMSCustomer_Staging`                      |
| `dtprospectinUpdate`                                  | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dtprospectinUpdate`                                  |
| `dwDiffActivity_Z`                                    | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffActivity_Z`                                    |
| `dwDiffCustomer`                                      | table | profiled, review-needed | 0          | 80      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffCustomer`                                      |
| `dwDiffDealSalespersonMap_Z`                          | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffDealSalespersonMap_Z`                          |
| `dwDiffOpportunity_Z`                                 | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwDiffOpportunity_Z`                                 |
| `dwEmailBody`                                         | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwEmailBody`                                         |
| `dwFullCompanyChildCompanyMap`                        | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullCompanyChildCompanyMap`                        |
| `dwFullCompanyHierarchy`                              | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullCompanyHierarchy`                              |
| `dwFullEmail_P`                                       | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullEmail_P`                                       |
| `dwFullSource`                                        | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / dwFullSource`                                        |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-029:publish
```
