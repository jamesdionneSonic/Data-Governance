# T2B-031 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-031`     |
| Platform/Product      | `SQL Server`  |
| Database              | `ETL_Staging` |
| Schema                | `dbo`         |
| Object type scope     | `table`       |
| Object pages          | 75            |
| Link refresh pages    | 2             |
| Total planned entries | 79            |
| Validation status     | `passed`      |

## Object Pages

| Object                                             | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                        |
| -------------------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| `ibexAnswer`                                       | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / ibexAnswer`                                       |
| `ibexQuestion`                                     | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / ibexQuestion`                                     |
| `Invalid_Invt`                                     | table | profiled, review-needed | 0          | 44      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Invalid_Invt`                                     |
| `Invalid_Sales`                                    | table | profiled, review-needed | 0          | 43      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Invalid_Sales`                                    |
| `Invalid_serv`                                     | table | profiled, review-needed | 0          | 49      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Invalid_serv`                                     |
| `JMA_SalesHistory2024`                             | table | profiled, review-needed | 0          | 45      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / JMA_SalesHistory2024`                             |
| `JustinModelSplit202410`                           | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / JustinModelSplit202410`                           |
| `ManualJournalData`                                | table | profiled, review-needed | 0          | 22      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / ManualJournalData`                                |
| `mdsSonicEntitiesDimEntitiesAttributes_tmp_TEST`   | table | profiled, review-needed | 0          | 65      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / mdsSonicEntitiesDimEntitiesAttributes_tmp_TEST`   |
| `MissgModelCodesImport`                            | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / MissgModelCodesImport`                            |
| `MissingCustomerKey20191120`                       | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / MissingCustomerKey20191120`                       |
| `MissingModelCategories`                           | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / MissingModelCategories`                           |
| `missingmodelcategories_20241218`                  | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / missingmodelcategories_20241218`                  |
| `MissingModelCategories_Bk`                        | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / MissingModelCategories_Bk`                        |
| `MissingModelCategories_BK_09192018`               | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / MissingModelCategories_BK_09192018`               |
| `MissingModelCategories_BKP_20241212`              | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / MissingModelCategories_BKP_20241212`              |
| `MissingModelCategories_bkp_20241214`              | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / MissingModelCategories_bkp_20241214`              |
| `MissingModelCategories_bkp_20241216`              | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / MissingModelCategories_bkp_20241216`              |
| `MissingModelCategories_BKP_20250204`              | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / MissingModelCategories_BKP_20250204`              |
| `MissingModelCategories_BKP_20250206`              | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / MissingModelCategories_BKP_20250206`              |
| `MissingModelCategories_Manual_Mapping_20250204`   | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / MissingModelCategories_Manual_Mapping_20250204`   |
| `MissingModelCategories_Manual_Mapping_20250204_2` | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / MissingModelCategories_Manual_Mapping_20250204_2` |
| `MissingModelCategories_prod`                      | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / MissingModelCategories_prod`                      |
| `MissingModelCategories_rj`                        | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / MissingModelCategories_rj`                        |
| `MissingModelCategories_rj2`                       | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / MissingModelCategories_rj2`                       |
| `MissingModelCategories_rj2_fuel`                  | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / MissingModelCategories_rj2_fuel`                  |
| `MissingModelCategoriesImport`                     | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / MissingModelCategoriesImport`                     |
| `MissingModelCategoriesProd`                       | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / MissingModelCategoriesProd`                       |
| `MissingOpportunities_FactOpportunity`             | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / MissingOpportunities_FactOpportunity`             |
| `Neg1CustKeyFixList`                               | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Neg1CustKeyFixList`                               |
| `New_DealDataFinal_Staging_OPP_spilt`              | table | profiled, review-needed | 0          | 123     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / New_DealDataFinal_Staging_OPP_spilt`              |
| `OLE DB Destination_no match_phone`                | table | profiled, review-needed | 0          | 34      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / OLE DB Destination_no match_phone`                |
| `opportunity_EP`                                   | table | profiled, review-needed | 0          | 318     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / opportunity_EP`                                   |
| `orgJobCode`                                       | table | profiled, review-needed | 0          | 1       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / orgJobCode`                                       |
| `pals_ValidationsDimensionsDriver`                 | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / pals_ValidationsDimensionsDriver`                 |
| `PCNRecords20230907`                               | table | profiled, review-needed | 0          | 29      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / PCNRecords20230907`                               |
| `PCNValidEmailAddressNoMatchOutput`                | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / PCNValidEmailAddressNoMatchOutput`                |
| `PendingSoldNotifications`                         | table | profiled, review-needed | 0          | 45      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / PendingSoldNotifications`                         |
| `pgc_SourceValidationGrpCounts`                    | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / pgc_SourceValidationGrpCounts`                    |
| `PlaybookName2016`                                 | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / PlaybookName2016`                                 |
| `PlaybookQuestions_03242015`                       | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / PlaybookQuestions_03242015`                       |
| `PlaybookQuestions_HR2016`                         | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / PlaybookQuestions_HR2016`                         |
| `PlaybookValidValues2016`                          | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / PlaybookValidValues2016`                          |
| `PowersportsLeadSourceMapping`                     | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / PowersportsLeadSourceMapping`                     |
| `Refined_Vehicle_Mapping`                          | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Refined_Vehicle_Mapping`                          |
| `RemainingAdSourceRekey20221227`                   | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / RemainingAdSourceRekey20221227`                   |
| `sa_deal`                                          | table | profiled, review-needed | 0          | 135     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / sa_deal`                                          |
| `Sales model year splits 24-11-25 (original)`      | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Sales model year splits 24-11-25 (original)`      |
| `Sales model year splits 24-11-25(updated)`        | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / Sales model year splits 24-11-25(updated)`        |
| `SCORES_ADPServiceAppointments_staging`            | table | profiled, review-needed | 0          | 46      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_ADPServiceAppointments_staging`            |
| `SCORES_ADPServiceAppointments_staging_new`        | table | profiled, review-needed | 0          | 46      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_ADPServiceAppointments_staging_new`        |
| `SCORES_DealData_Stage_DMSSold`                    | table | profiled, review-needed | 0          | 34      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_DealData_Stage_DMSSold`                    |
| `SCORES_DealData_Staging`                          | table | profiled, review-needed | 0          | 48      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_DealData_Staging`                          |
| `SCORES_DealData_Staging_BOOKED`                   | table | profiled, review-needed | 0          | 48      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_DealData_Staging_BOOKED`                   |
| `SCORES_DealData_Staging_new`                      | table | profiled, review-needed | 0          | 48      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_DealData_Staging_new`                      |
| `SCORES_DealData_Staging_Raj`                      | table | profiled, review-needed | 0          | 48      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_DealData_Staging_Raj`                      |
| `SCORES_DealData_Staging_Raj_split`                | table | profiled, review-needed | 0          | 48      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_DealData_Staging_Raj_split`                |
| `SCORES_DealDataFinal_Staging`                     | table | profiled, review-needed | 0          | 117     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_DealDataFinal_Staging`                     |
| `SCORES_DealDataFinal_Staging_bk`                  | table | profiled, review-needed | 0          | 115     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_DealDataFinal_Staging_bk`                  |
| `SCORES_DealDataFinal_Staging_look`                | table | profiled, review-needed | 0          | 116     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_DealDataFinal_Staging_look`                |
| `SCORES_DealDataFinal_Staging_new`                 | table | profiled, review-needed | 0          | 116     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_DealDataFinal_Staging_new`                 |
| `SCORES_DealDataFinal_Staging_new_update`          | table | profiled, review-needed | 0          | 116     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_DealDataFinal_Staging_new_update`          |
| `SCORES_DealDataFinal_Staging_Raj`                 | table | profiled, review-needed | 0          | 117     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_DealDataFinal_Staging_Raj`                 |
| `SCORES_DealDataFinal_Staging_Raj_F`               | table | profiled, review-needed | 0          | 119     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_DealDataFinal_Staging_Raj_F`               |
| `SCORES_DealDataFinal_Staging_Raj_new`             | table | profiled, review-needed | 0          | 119     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_DealDataFinal_Staging_Raj_new`             |
| `SCORES_DealDataFinal_Staging_Raj_new_update`      | table | profiled, review-needed | 0          | 119     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_DealDataFinal_Staging_Raj_new_update`      |
| `SCORES_DealerContactNotes_staging`                | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_DealerContactNotes_staging`                |
| `SCORES_Deals_Elead`                               | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Deals_Elead`                               |
| `SCORES_Deals_No_Match`                            | table | profiled, review-needed | 0          | 129     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Deals_No_Match`                            |
| `SCORES_Deals_OPP_OW_ID_No_Match`                  | table | profiled, review-needed | 0          | 133     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_Deals_OPP_OW_ID_No_Match`                  |
| `SCORES_DeliveryAppointment_Staging`               | table | profiled, review-needed | 0          | 24      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_DeliveryAppointment_Staging`               |
| `SCORES_EmailActivity_Staging`                     | table | profiled, review-needed | 0          | 39      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_EmailActivity_Staging`                     |
| `SCORES_EmailActivity_Staging_507`                 | table | profiled, review-needed | 0          | 39      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_EmailActivity_Staging_507`                 |
| `SCORES_EmailActivity_Staging_599_983`             | table | profiled, review-needed | 0          | 55      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_EmailActivity_Staging_599_983`             |
| `SCORES_EmailActivity_Staging_Full`                | table | profiled, review-needed | 0          | 40      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo / SCORES_EmailActivity_Staging_Full`                |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-031:publish
```
