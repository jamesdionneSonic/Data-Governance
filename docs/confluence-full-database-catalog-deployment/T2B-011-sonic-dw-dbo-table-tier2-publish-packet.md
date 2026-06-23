# T2B-011 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-011`    |
| Platform/Product      | `SQL Server` |
| Database              | `Sonic_DW`   |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 75           |
| Link refresh pages    | 2            |
| Total planned entries | 79           |
| Validation status     | `passed`     |

## Object Pages

| Object                                     | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                             |
| ------------------------------------------ | ----- | ----------------------- | ---------- | ------- | ---------- | ---------------------------------------------------------------------------------------------------------------- |
| `Fact_HFM_bk_20230712`                     | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_HFM_bk_20230712`                     |
| `Fact_HFM_Budget_T5_2025`                  | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_HFM_Budget_T5_2025`                  |
| `Fact_HFM_Dev`                             | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_HFM_Dev`                             |
| `Fact_HFM_Dev2`                            | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_HFM_Dev2`                            |
| `Fact_HFM_Dev3`                            | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_HFM_Dev3`                            |
| `Fact_HFM_Dev4`                            | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_HFM_Dev4`                            |
| `Fact_HFM_Snapshot`                        | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_HFM_Snapshot`                        |
| `Fact_HFMBudget`                           | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_HFMBudget`                           |
| `Fact_HFMManual`                           | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_HFMManual`                           |
| `Fact_HR_ReqRejection`                     | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_HR_ReqRejection`                     |
| `Fact_Jumpstart`                           | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_Jumpstart`                           |
| `Fact_LeadBySource`                        | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_LeadBySource`                        |
| `Fact_RetailUnits`                         | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_RetailUnits`                         |
| `Fact_SecurityAwareness`                   | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_SecurityAwareness`                   |
| `Fact_SecurityOffenses`                    | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_SecurityOffenses`                    |
| `Fact_SEO`                                 | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_SEO`                                 |
| `Fact_Service_arch`                        | table | profiled, review-needed | 0          | 71      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_Service_arch`                        |
| `Fact_Service_DISCOUNT_NOT_MATCHED`        | table | profiled, review-needed | 0          | 65      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_Service_DISCOUNT_NOT_MATCHED`        |
| `Fact_ServiceDetail_arch`                  | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_ServiceDetail_arch`                  |
| `Fact_ServiceDetail_DISCOUNT_NOT_MATCHED`  | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_ServiceDetail_DISCOUNT_NOT_MATCHED`  |
| `Fact_SymantecEvents`                      | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_SymantecEvents`                      |
| `Fact_test_service`                        | table | profiled, review-needed | 0          | 66      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_test_service`                        |
| `Fact_TSDTempImport`                       | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_TSDTempImport`                       |
| `Fact_Vulnerabilities`                     | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_Vulnerabilities`                     |
| `Fact_WebPageViews`                        | table | profiled, review-needed | 0          | 22      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_WebPageViews`                        |
| `Fact_WebStats`                            | table | profiled, review-needed | 0          | 23      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_WebStats`                            |
| `Fact_WhiteHatSecurity_Event`              | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_WhiteHatSecurity_Event`              |
| `FactActivity_0805`                        | table | profiled, review-needed | 0          | 66      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactActivity_0805`                        |
| `FactCallSourceNew`                        | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactCallSourceNew`                        |
| `factCIT`                                  | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / factCIT`                                  |
| `FactCSIQuarterly`                         | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactCSIQuarterly`                         |
| `factFIRE_BMWMini`                         | table | profiled, review-needed | 0          | 92      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / factFIRE_BMWMini`                         |
| `factFIREBookings`                         | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / factFIREBookings`                         |
| `FactOpportunity_0805`                     | table | profiled, review-needed | 0          | 64      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactOpportunity_0805`                     |
| `FactOpportunity_10032023`                 | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactOpportunity_10032023`                 |
| `FactOpportunity_10042023`                 | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactOpportunity_10042023`                 |
| `FactOpportunity_20250109`                 | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactOpportunity_20250109`                 |
| `FactRemedy`                               | table | profiled, review-needed | 0          | 48      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactRemedy`                               |
| `factRENT`                                 | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / factRENT`                                 |
| `FactSurveyAuditDetail__BK_20211018`       | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactSurveyAuditDetail__BK_20211018`       |
| `FactTrafficSummary_06102022`              | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactTrafficSummary_06102022`              |
| `FactTrafficSummary_06132022`              | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactTrafficSummary_06132022`              |
| `FactTrafficSummary_07292023`              | table | profiled, review-needed | 0          | 36      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactTrafficSummary_07292023`              |
| `FactTrafficSummary_20230706`              | table | profiled, review-needed | 0          | 36      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactTrafficSummary_20230706`              |
| `FactTrafficSummary_20230727`              | table | profiled, review-needed | 0          | 36      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactTrafficSummary_20230727`              |
| `FactTrafficSummary_bk02172022`            | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactTrafficSummary_bk02172022`            |
| `Facttrafficsummary_TMR_Export_06142022`   | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Facttrafficsummary_TMR_Export_06142022`   |
| `FactTrafficSummary_TMR_Export_1006`       | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactTrafficSummary_TMR_Export_1006`       |
| `Facttrafficsummary_TMR_Export_bk02172022` | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Facttrafficsummary_TMR_Export_bk02172022` |
| `Facttrafficsummary_TMR_Export_old 0610`   | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Facttrafficsummary_TMR_Export_old 0610`   |
| `FactTrafficSummary_TMR_Export_zz`         | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactTrafficSummary_TMR_Export_zz`         |
| `FactTrafficSummaryDaily_07292023`         | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactTrafficSummaryDaily_07292023`         |
| `FactTrafficSummaryDaily_20230706`         | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactTrafficSummaryDaily_20230706`         |
| `FactTrafficSummaryDaily_20230727`         | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactTrafficSummaryDaily_20230727`         |
| `FactTrafficSummarySubSource_05032024`     | table | profiled, review-needed | 0          | 36      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactTrafficSummarySubSource_05032024`     |
| `FactTrafficSummarySubSource_20240404`     | table | profiled, review-needed | 0          | 36      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactTrafficSummarySubSource_20240404`     |
| `FactTrafficSummarySubSourcebkp`           | table | profiled, review-needed | 0          | 36      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactTrafficSummarySubSourcebkp`           |
| `FandI_DMS`                                | table | profiled, review-needed | 0          | 61      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FandI_DMS`                                |
| `FIRE_DateRangeControl`                    | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FIRE_DateRangeControl`                    |
| `FOCUS_Elead_ActivityTypeChange_UAT`       | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FOCUS_Elead_ActivityTypeChange_UAT`       |
| `GLDetail_ MissingAcctInfo`                | table | profiled, review-needed | 0          | 52      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / GLDetail_ MissingAcctInfo`                |
| `Keys_to_delete`                           | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Keys_to_delete`                           |
| `LU_MONTH_OF_YEAR`                         | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / LU_MONTH_OF_YEAR`                         |
| `MappingKey_Focus`                         | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / MappingKey_Focus`                         |
| `MTD_DATE`                                 | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / MTD_DATE`                                 |
| `OneStream_Accounts2`                      | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / OneStream_Accounts2`                      |
| `pgTableRowCount`                          | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / pgTableRowCount`                          |
| `PhotoWidget`                              | table | profiled, review-needed | 0          | 5       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / PhotoWidget`                              |
| `PlaybookAnswer_SonicPriceReplacement`     | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / PlaybookAnswer_SonicPriceReplacement`     |
| `PlaybookAnswerReset`                      | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / PlaybookAnswerReset`                      |
| `PlaybookGrading`                          | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / PlaybookGrading`                          |
| `PlaybookPhoto`                            | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / PlaybookPhoto`                            |
| `PlaybookPhotoReset`                       | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / PlaybookPhotoReset`                       |
| `PlaybookQuestions_Stage`                  | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / PlaybookQuestions_Stage`                  |
| `PlaybookSurveyReset`                      | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / PlaybookSurveyReset`                      |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-011:publish
```
