# T2B-003 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-003`    |
| Platform/Product      | `SQL Server` |
| Database              | `Sonic_DW`   |
| Schema                | `dbo`        |
| Object type scope     | `table`      |
| Object pages          | 75           |
| Link refresh pages    | 2            |
| Total planned entries | 79           |
| Validation status     | `passed`     |

## Object Pages

| Object                        | Type  | Tags                                               | Downstream | Columns | Confidence | Path                                                                                                |
| ----------------------------- | ----- | -------------------------------------------------- | ---------- | ------- | ---------- | --------------------------------------------------------------------------------------------------- |
| `CustomerMatchResult`         | table | profiled, lineage-hotspot, review-needed           | 3          | 37      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / CustomerMatchResult`         |
| `CustomerXREF_KeyLU`          | table | profiled, review-needed                            | 9          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / CustomerXREF_KeyLU`          |
| `Dim_Account`                 | table | high-use, profiled, lineage-hotspot, review-needed | 32         | 55      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Account`                 |
| `Dim_AccountMgmt`             | table | high-use, profiled, lineage-hotspot, review-needed | 20         | 27      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_AccountMgmt`             |
| `Dim_Date`                    | table | high-use, profiled, lineage-hotspot, review-needed | 223        | 73      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Date`                    |
| `dim_DealType`                | table | high-use, profiled, lineage-hotspot, review-needed | 31         | 4       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_DealType`                |
| `Dim_DepartmentRoll`          | table | high-use, profiled, review-needed                  | 12         | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_DepartmentRoll`          |
| `Dim_DMSCustomer`             | table | high-use, profiled, lineage-hotspot, review-needed | 43         | 70      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_DMSCustomer`             |
| `Dim_DMSEmployee`             | table | high-use, profiled, lineage-hotspot, review-needed | 43         | 38      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_DMSEmployee`             |
| `Dim_DMSVendor`               | table | profiled, review-needed                            | 12         | 46      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_DMSVendor`               |
| `Dim_DOCMetrics`              | table | high-use, profiled, lineage-hotspot, review-needed | 15         | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_DOCMetrics`              |
| `Dim_Entity`                  | table | high-use, profiled, lineage-hotspot, review-needed | 315        | 121     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Entity`                  |
| `dim_FIGLAccounts`            | table | high-use, profiled, lineage-hotspot, review-needed | 51         | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_FIGLAccounts`            |
| `dim_FIGLProductCategory`     | table | high-use, profiled, lineage-hotspot, review-needed | 14         | 6       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_FIGLProductCategory`     |
| `Dim_GLDetail`                | table | profiled, review-needed                            | 6          | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_GLDetail`                |
| `dim_GLSchedule_degen`        | table | high-use, profiled, lineage-hotspot, review-needed | 14         | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_GLSchedule_degen`        |
| `Dim_GLScheduleSummary_degen` | table | profiled, review-needed                            | 8          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_GLScheduleSummary_degen` |
| `Dim_LaborType`               | table | profiled, review-needed                            | 8          | 45      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_LaborType`               |
| `Dim_LeadStatus`              | table | profiled, review-needed                            | 9          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_LeadStatus`              |
| `Dim_Lender`                  | table | high-use, profiled, review-needed                  | 10         | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Lender`                  |
| `Dim_Month`                   | table | high-use, profiled, review-needed                  | 10         | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Month`                   |
| `Dim_OpCode`                  | table | high-use, profiled, lineage-hotspot, review-needed | 12         | 32      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_OpCode`                  |
| `Dim_OpportunitySource`       | table | profiled, review-needed                            | 6          | 20      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_OpportunitySource`       |
| `Dim_PricingGrid`             | table | high-use, profiled, review-needed                  | 11         | 26      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_PricingGrid`             |
| `Dim_SchedExceptionAccounts`  | table | profiled, review-needed                            | 6          | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_SchedExceptionAccounts`  |
| `Dim_SECRollup`               | table | profiled, review-needed                            | 7          | 29      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_SECRollup`               |
| `dim_Time`                    | table | high-use, profiled, lineage-hotspot, review-needed | 26         | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dim_Time`                    |
| `Dim_UserEntity`              | table | profiled, review-needed                            | 6          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_UserEntity`              |
| `Dim_Vehicle`                 | table | high-use, profiled, lineage-hotspot, review-needed | 81         | 49      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Vehicle`                 |
| `DimActivityStatus`           | table | high-use, profiled, review-needed                  | 12         | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimActivityStatus`           |
| `DimActivityType`             | table | high-use, profiled, lineage-hotspot, review-needed | 15         | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimActivityType`             |
| `DimAssociate`                | table | high-use, profiled, lineage-hotspot, review-needed | 35         | 72      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimAssociate`                |
| `DimCustomer`                 | table | high-use, profiled, lineage-hotspot, review-needed | 15         | 33      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimCustomer`                 |
| `DimDealType`                 | table | profiled, review-needed                            | 9          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimDealType`                 |
| `DimEmployee`                 | table | high-use, profiled, review-needed                  | 8          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimEmployee`                 |
| `DimEntityRelationship`       | table | high-use, profiled, lineage-hotspot, review-needed | 76         | 16      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimEntityRelationship`       |
| `DimEntityRelationshipType`   | table | high-use, profiled, lineage-hotspot, review-needed | 58         | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimEntityRelationshipType`   |
| `DimGSCSite`                  | table | profiled, review-needed                            | 7          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimGSCSite`                  |
| `DimLeadSource`               | table | high-use, profiled, review-needed                  | 12         | 14      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimLeadSource`               |
| `DimLeadStatus`               | table | high-use, profiled, lineage-hotspot, review-needed | 21         | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimLeadStatus`               |
| `DimLeadSubSource`            | table | high-use, profiled, review-needed                  | 12         | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimLeadSubSource`            |
| `DimOpportunitySource`        | table | high-use, profiled, lineage-hotspot, review-needed | 20         | 25      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimOpportunitySource`        |
| `DimSurveyAudit`              | table | high-use, profiled, review-needed                  | 8          | 46      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimSurveyAudit`              |
| `DimSurveyAuditDetail`        | table | profiled, review-needed                            | 6          | 17      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimSurveyAuditDetail`        |
| `DimUpType`                   | table | high-use, profiled, lineage-hotspot, review-needed | 22         | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimUpType`                   |
| `DimVehicle`                  | table | high-use, profiled, review-needed                  | 12         | 41      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicle`                  |
| `DimVehicleMake`              | table | high-use, profiled, review-needed                  | 11         | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleMake`              |
| `DimVehicleModel`             | table | high-use, profiled, review-needed                  | 11         | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleModel`             |
| `DimVehicleTrim`              | table | profiled, review-needed                            | 6          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVehicleTrim`              |
| `DimVin`                      | table | high-use, profiled, lineage-hotspot, review-needed | 16         | 18      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / DimVin`                      |
| `Doc_Budget`                  | table | profiled, review-needed                            | 6          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_Budget`                  |
| `Doc_MetricsPS`               | table | profiled, review-needed                            | 7          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_MetricsPS`               |
| `Doc_Record`                  | table | high-use, profiled, review-needed                  | 11         | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Doc_Record`                  |
| `dwDiffActivity_I`            | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 51      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dwDiffActivity_I`            |
| `dwDiffEmail_D`               | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 1       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dwDiffEmail_D`               |
| `dwFullCompany`               | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 44      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dwFullCompany`               |
| `dwFullGoldDiggerROI`         | table | high-use, profiled, lineage-hotspot, review-needed | 4          | 464     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / dwFullGoldDiggerROI`         |
| `Fact_AccountingDetail`       | table | high-use, profiled, review-needed                  | 11         | 37      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_AccountingDetail`       |
| `Fact_GLSchedule`             | table | high-use, profiled, review-needed                  | 12         | 28      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_GLSchedule`             |
| `Fact_Service`                | table | high-use, profiled, lineage-hotspot, review-needed | 19         | 72      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_Service`                |
| `Fact_ServiceDetail`          | table | high-use, profiled, review-needed                  | 9          | 67      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Fact_ServiceDetail`          |
| `FactActivity`                | table | high-use, profiled, lineage-hotspot, review-needed | 20         | 69      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactActivity`                |
| `factFIRE`                    | table | high-use, profiled, lineage-hotspot, review-needed | 46         | 93      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / factFIRE`                    |
| `factFIRE_A`                  | table | high-use, profiled, lineage-hotspot, review-needed | 19         | 47      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / factFIRE_A`                  |
| `FactFireBookings_preDW`      | table | profiled, review-needed                            | 2          | 54      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactFireBookings_preDW`      |
| `FactFireSummary`             | table | high-use, profiled, lineage-hotspot, review-needed | 10         | 158     | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactFireSummary`             |
| `FactOpportunity`             | table | high-use, profiled, lineage-hotspot, review-needed | 28         | 68      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactOpportunity`             |
| `FactTrafficSummarySubSource` | table | profiled, lineage-hotspot, review-needed           | 6          | 56      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactTrafficSummarySubSource` |
| `FBCustomAudience`            | table | high-use, profiled, lineage-hotspot, review-needed | 30         | 24      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FBCustomAudience`            |
| `Metric`                      | table | profiled, review-needed                            | 1          | 19      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Metric`                      |
| `PlaybookAnswer`              | table | profiled, review-needed                            | 7          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / PlaybookAnswer`              |
| `PlaybookQuestions`           | table | profiled, review-needed                            | 7          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / PlaybookQuestions`           |
| `staging`                     | table | profiled, review-needed                            | 3          | 61      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / staging`                     |
| `sysdiagrams`                 | table | profiled, review-needed                            | 6          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / sysdiagrams`                 |
| `vw_GPA_RateCap_SRC`          | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 28      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / vw_GPA_RateCap_SRC`          |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-003:publish
```
