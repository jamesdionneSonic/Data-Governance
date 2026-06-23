# T2B-002 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-002`    |
| Platform/Product      | `SQL Server` |
| Database              | `eLeadDW_SF` |
| Schema                | `dbo`        |
| Object type scope     | `all`        |
| Object pages          | 61           |
| Link refresh pages    | 2            |
| Total planned entries | 65           |
| Validation status     | `passed`     |

## Object Pages

| Object                                | Type  | Tags                                     | Downstream | Columns | Confidence | Path                                                                                                          |
| ------------------------------------- | ----- | ---------------------------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------- |
| `dwDealMerge`                         | table | profiled, lineage-hotspot, review-needed | 0          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDealMerge`                         |
| `dwDiffActivity_I`                    | table | profiled, lineage-hotspot, review-needed | 0          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffActivity_I`                    |
| `dwDiffCompany_D`                     | table | profiled, review-needed                  | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCompany_D`                     |
| `dwDiffCompany_I`                     | table | profiled, review-needed                  | 0          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCompany_I`                     |
| `dwDiffDealMerge_I`                   | table | profiled, review-needed                  | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffDealMerge_I`                   |
| `dwDiffDepartment_D`                  | table | profiled, review-needed                  | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffDepartment_D`                  |
| `dwDiffDepartment_I`                  | table | profiled, review-needed                  | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffDepartment_I`                  |
| `dwDiffDepartment_U`                  | table | profiled, review-needed                  | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffDepartment_U`                  |
| `dwDiffEmail_D`                       | table | profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffEmail_D`                       |
| `dwDiffQuartile_I`                    | table | profiled, review-needed                  | 0          | 40      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffQuartile_I`                    |
| `dwDiffQuartile_U`                    | table | profiled, review-needed                  | 0          | 39      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffQuartile_U`                    |
| `dwDiffRunStatus_SF`                  | table | profiled, lineage-hotspot, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffRunStatus_SF`                  |
| `dwDiffTextConversation_D`            | table | profiled, review-needed                  | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffTextConversation_D`            |
| `dwDiffTextConversation_I`            | table | profiled, review-needed                  | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffTextConversation_I`            |
| `dwDiffTextConversationElement_D`     | table | profiled, review-needed                  | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffTextConversationElement_D`     |
| `dwDiffTextConversationElement_I`     | table | profiled, review-needed                  | 0          | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffTextConversationElement_I`     |
| `dwDiffTextConversationMessage_D`     | table | profiled, review-needed                  | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffTextConversationMessage_D`     |
| `dwDiffTextConversationMessage_I`     | table | profiled, review-needed                  | 0          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffTextConversationMessage_I`     |
| `dwDiffTextCustomerNumber_D`          | table | profiled, review-needed                  | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffTextCustomerNumber_D`          |
| `dwDiffTextCustomerNumber_I`          | table | profiled, review-needed                  | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffTextCustomerNumber_I`          |
| `dwDiffTextOptInStatus_D`             | table | profiled, review-needed                  | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffTextOptInStatus_D`             |
| `dwDiffTextOptInStatus_I`             | table | profiled, review-needed                  | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffTextOptInStatus_I`             |
| `dwFullActivity`                      | table | profiled, review-needed                  | 0          | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullActivity`                      |
| `dwFullAudit`                         | table | profiled, review-needed                  | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullAudit`                         |
| `dwFullCompany`                       | table | profiled, review-needed                  | 0          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullCompany`                       |
| `dwFullCompany_P`                     | table | profiled, lineage-hotspot, review-needed | 0          | 35      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullCompany_P`                     |
| `dwFullCompanyHierarchy`              | table | profiled, review-needed                  | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullCompanyHierarchy`              |
| `dwFullCompanyOption`                 | table | profiled, review-needed                  | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullCompanyOption`                 |
| `dwFullCompanySource`                 | table | profiled, review-needed                  | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullCompanySource`                 |
| `dwFullCustomer`                      | table | profiled, review-needed                  | 0          | 74      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullCustomer`                      |
| `dwFullDaylightSavingTime`            | table | profiled, review-needed                  | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullDaylightSavingTime`            |
| `dwFullDealerProgram`                 | table | profiled, review-needed                  | 0          | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullDealerProgram`                 |
| `dwFullDealSalespersonMap`            | table | profiled, review-needed                  | 0          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullDealSalespersonMap`            |
| `dwFullDepartment_P`                  | table | profiled, review-needed                  | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullDepartment_P`                  |
| `dwFullEmailOptOut_P`                 | table | profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullEmailOptOut_P`                 |
| `dwFullHoliday`                       | table | profiled, review-needed                  | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullHoliday`                       |
| `dwFullLeadProviderInactiveReasonMap` | table | profiled, review-needed                  | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullLeadProviderInactiveReasonMap` |
| `dwFullOpportunity`                   | table | profiled, review-needed                  | 0          | 58      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullOpportunity`                   |
| `dwFullPosition_P`                    | table | profiled, lineage-hotspot, review-needed | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullPosition_P`                    |
| `dwFullProductOrService`              | table | profiled, review-needed                  | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullProductOrService`              |
| `dwFullRelationship_P`                | table | profiled, lineage-hotspot, review-needed | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullRelationship_P`                |
| `dwFullReportCreditConfiguration`     | table | profiled, review-needed                  | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullReportCreditConfiguration`     |
| `dwFullSchedule`                      | table | profiled, review-needed                  | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullSchedule`                      |
| `dwFullSource`                        | table | profiled, review-needed                  | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullSource`                        |
| `dwFullTaskComments`                  | table | profiled, review-needed                  | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullTaskComments`                  |
| `dwFullTaskReminder`                  | table | profiled, review-needed                  | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullTaskReminder`                  |
| `dwFullTextConversation`              | table | profiled, review-needed                  | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullTextConversation`              |
| `dwFullTextConversationElement`       | table | profiled, review-needed                  | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullTextConversationElement`       |
| `dwFullTextConversationMessage`       | table | profiled, review-needed                  | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullTextConversationMessage`       |
| `dwFullTextCustomerNumber`            | table | profiled, review-needed                  | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullTextCustomerNumber`            |
| `dwFullTextOptInStatus`               | table | profiled, review-needed                  | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullTextOptInStatus`               |
| `dwFullUser_P`                        | table | profiled, lineage-hotspot, review-needed | 0          | 44      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullUser_P`                        |
| `dwFullUserChildCompanyMap`           | table | profiled, review-needed                  | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullUserChildCompanyMap`           |
| `dwFullUserChildCompanyMap_P`         | table | profiled, review-needed                  | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullUserChildCompanyMap_P`         |
| `dwFullUserDepartmentMap`             | table | profiled, review-needed                  | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullUserDepartmentMap`             |
| `dwFullUserDepartmentMap_P`           | table | profiled, review-needed                  | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullUserDepartmentMap_P`           |
| `dwFullUserPositionMap`               | table | profiled, review-needed                  | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullUserPositionMap`               |
| `dwFullUserPositionMap_P`             | table | profiled, lineage-hotspot, review-needed | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullUserPositionMap_P`             |
| `dwFullVehicleSought`                 | table | profiled, review-needed                  | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullVehicleSought`                 |
| `dwFullWarranty`                      | table | profiled, review-needed                  | 0          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullWarranty`                      |
| `tblGoldDiggerROI`                    | table | profiled, lineage-hotspot, review-needed | 0          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / tblGoldDiggerROI`                    |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-002:publish
```
