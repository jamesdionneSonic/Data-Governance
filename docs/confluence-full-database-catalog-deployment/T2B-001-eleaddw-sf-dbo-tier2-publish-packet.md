# T2B-001 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-001`    |
| Platform/Product      | `SQL Server` |
| Database              | `eLeadDW_SF` |
| Schema                | `dbo`        |
| Object type scope     | `all`        |
| Object pages          | 75           |
| Link refresh pages    | 2            |
| Total planned entries | 79           |
| Validation status     | `passed`     |

## Object Pages

| Object                                  | Type  | Tags                                               | Downstream | Columns | Confidence | Path                                                                                                            |
| --------------------------------------- | ----- | -------------------------------------------------- | ---------- | ------- | ---------- | --------------------------------------------------------------------------------------------------------------- |
| `dwCompanyLeadRate`                     | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwCompanyLeadRate`                     |
| `dwDiffActivity_D`                      | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffActivity_D`                      |
| `dwDiffAudit_I`                         | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffAudit_I`                         |
| `dwDiffCompanyChildCompanyMap_D`        | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCompanyChildCompanyMap_D`        |
| `dwDiffCompanyChildCompanyMap_I`        | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCompanyChildCompanyMap_I`        |
| `dwDiffCompanyHierarchy_D`              | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCompanyHierarchy_D`              |
| `dwDiffCompanyHierarchy_I`              | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCompanyHierarchy_I`              |
| `dwDiffCompanyOption_D`                 | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCompanyOption_D`                 |
| `dwDiffCompanyOption_I`                 | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCompanyOption_I`                 |
| `dwDiffCompanySource_D`                 | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCompanySource_D`                 |
| `dwDiffCompanySource_I`                 | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCompanySource_I`                 |
| `dwDiffCustomer_D`                      | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCustomer_D`                      |
| `dwDiffCustomer_I`                      | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 77      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCustomer_I`                      |
| `dwDiffCustomer_U`                      | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffCustomer_U`                      |
| `dwDiffDaylightSavingTime_D`            | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffDaylightSavingTime_D`            |
| `dwDiffDaylightSavingTime_I`            | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffDaylightSavingTime_I`            |
| `dwDiffDealerProgram_D`                 | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffDealerProgram_D`                 |
| `dwDiffDealerProgram_I`                 | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffDealerProgram_I`                 |
| `dwDiffDealSalespersonMap_D`            | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffDealSalespersonMap_D`            |
| `dwDiffDealSalespersonMap_I`            | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffDealSalespersonMap_I`            |
| `dwDiffDesklogVisit_D`                  | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffDesklogVisit_D`                  |
| `dwDiffDesklogVisit_I`                  | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffDesklogVisit_I`                  |
| `dwDiffEmail_I`                         | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffEmail_I`                         |
| `dwDiffEmail_U`                         | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffEmail_U`                         |
| `dwDiffEmailOptOut_D`                   | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffEmailOptOut_D`                   |
| `dwDiffEmailOptOut_I`                   | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffEmailOptOut_I`                   |
| `dwDiffHoliday_D`                       | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffHoliday_D`                       |
| `dwDiffHoliday_I`                       | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffHoliday_I`                       |
| `dwDiffLeadProviderInactiveReasonMap_D` | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffLeadProviderInactiveReasonMap_D` |
| `dwDiffLeadProviderInactiveReasonMap_I` | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffLeadProviderInactiveReasonMap_I` |
| `dwDiffLegacyCustomerID_D`              | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffLegacyCustomerID_D`              |
| `dwDiffLegacyCustomerID_I`              | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffLegacyCustomerID_I`              |
| `dwDiffLegacyEmployeeID_D`              | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffLegacyEmployeeID_D`              |
| `dwDiffLegacyEmployeeID_I`              | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffLegacyEmployeeID_I`              |
| `dwDiffMessages_I`                      | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffMessages_I`                      |
| `dwDiffOpportunity_D`                   | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffOpportunity_D`                   |
| `dwDiffOpportunity_I`                   | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 71      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffOpportunity_I`                   |
| `dwDiffPhone_D`                         | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffPhone_D`                         |
| `dwDiffPhone_I`                         | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffPhone_I`                         |
| `dwDiffProductOrService_D`              | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffProductOrService_D`              |
| `dwDiffProductOrService_I`              | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffProductOrService_I`              |
| `dwDiffReportCreditConfiguration_D`     | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffReportCreditConfiguration_D`     |
| `dwDiffReportCreditConfiguration_I`     | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffReportCreditConfiguration_I`     |
| `dwDiffSchedule_D`                      | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffSchedule_D`                      |
| `dwDiffSchedule_I`                      | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffSchedule_I`                      |
| `dwDiffSource_D`                        | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffSource_D`                        |
| `dwDiffSource_I`                        | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffSource_I`                        |
| `dwDiffTaskComments_D`                  | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffTaskComments_D`                  |
| `dwDiffTaskComments_I`                  | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffTaskComments_I`                  |
| `dwDiffTaskItem_I`                      | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffTaskItem_I`                      |
| `dwDiffTaskReminder_D`                  | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffTaskReminder_D`                  |
| `dwDiffTaskReminder_I`                  | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffTaskReminder_I`                  |
| `dwDiffVehicle_D`                       | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffVehicle_D`                       |
| `dwDiffVehicle_I`                       | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 88      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffVehicle_I`                       |
| `dwDiffVehicleSought_D`                 | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffVehicleSought_D`                 |
| `dwDiffVehicleSought_I`                 | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffVehicleSought_I`                 |
| `dwDiffWarranty_D`                      | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffWarranty_D`                      |
| `dwDiffWarranty_I`                      | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 7       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwDiffWarranty_I`                      |
| `dwFullCompanyChildCompanyMap`          | table | profiled, review-needed                            | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullCompanyChildCompanyMap`          |
| `dwFullCreateTask`                      | table | profiled, lineage-hotspot, review-needed           | 0          | 28      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullCreateTask`                      |
| `dwFullDepartment`                      | table | profiled, review-needed                            | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullDepartment`                      |
| `dwFullDesklogVisit`                    | table | profiled, review-needed                            | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullDesklogVisit`                    |
| `dwFullEmail`                           | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullEmail`                           |
| `dwFullEmailOptOut`                     | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 2       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullEmailOptOut`                     |
| `dwFullLegacyCustomerID`                | table | profiled, review-needed                            | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullLegacyCustomerID`                |
| `dwFullLegacyEmployeeID`                | table | profiled, review-needed                            | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullLegacyEmployeeID`                |
| `dwFullMessages`                        | table | profiled, review-needed                            | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullMessages`                        |
| `dwFullPhone`                           | table | profiled, review-needed                            | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullPhone`                           |
| `dwFullPosition`                        | table | profiled, review-needed                            | 0          | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullPosition`                        |
| `dwFullRelationship`                    | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullRelationship`                    |
| `dwFullTaskDueDateChange`               | table | profiled, lineage-hotspot, review-needed           | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullTaskDueDateChange`               |
| `dwFullTaskItem`                        | table | high-use, profiled, review-needed                  | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullTaskItem`                        |
| `dwFullUser`                            | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullUser`                            |
| `dwFullVehicle`                         | table | high-use, profiled, review-needed                  | 0          | 82      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullVehicle`                         |
| `dwFullWorkflow`                        | table | profiled, lineage-hotspot, review-needed           | 0          | 3       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo / dwFullWorkflow`                        |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-001:publish
```
