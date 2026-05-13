---
name: SalesTranAssociate_Inbound_update
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - SalesTranAssociate_Inbound
  - SalesTranAssociate_Inbound_1122
  - SalesTranAssociate_Inbound_New
  - SalesTranAssociate_Inbound_Oct2024
  - SalesTranAssociate_Inbound_Oct20241
  - SalesTranAssociate_Inbound_Oct2024b
  - SalesTranAssociate_Inbound_testing
  - Dim_Entity
  - Dim_GLScheduleSummary_degen
  - SalesTranAso_FI_Individual
  - SalesTranAssociate_Inbound
  - SalesTranAssociate_Inbound_1122
  - SalesTranAssociate_Inbound_New
  - SalesTranAssociate_Inbound_Oct2024
  - SalesTranAssociate_Inbound_Oct20241
  - SalesTranAssociate_Inbound_Oct2024b
  - SalesTranAssociate_Inbound_testing
  - SalesTranAso_FI_Individual
  - SalesTranAssociate_Inbound
  - SalesTranAssociate_Inbound_1122
  - SalesTranAssociate_Inbound_New
  - SalesTranAssociate_Inbound_Oct2024
  - SalesTranAssociate_Inbound_Oct20241
  - SalesTranAssociate_Inbound_Oct2024b
  - SalesTranAssociate_Inbound_testing
row_count: 0
size_kb: 0
column_count: 56
index_count: 0
check_constraint_count: 0
extraction_warnings:
  - MISSING_VIEW_DATABASE_STATE
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: table
- **Schema**: dbo
- **Row Count**: 0
- **Size**: 0 KB

## Columns

| Name                        | Type     | Nullable | Identity | Default | Description |
| --------------------------- | -------- | -------- | -------- | ------- | ----------- |
| `CalendarYearMonth`         | char     |          |          |         |             |
| `CDK_companyid`             | varchar  | ✓        |          |         |             |
| `Prefix`                    | char     | ✓        |          |         |             |
| `EntBrand`                  | varchar  | ✓        |          |         |             |
| `Dealership`                | varchar  | ✓        |          |         |             |
| `DealStatus`                | varchar  | ✓        |          |         |             |
| `DealType`                  | varchar  | ✓        |          |         |             |
| `StockNo`                   | varchar  | ✓        |          |         |             |
| `AssignedFlag`              | int      |          |          |         |             |
| `Dealno`                    | varchar  | ✓        |          |         |             |
| `VehicleKey`                | int      | ✓        |          |         |             |
| `VehModelYear`              | int      | ✓        |          |         |             |
| `VehMakeDesc`               | varchar  | ✓        |          |         |             |
| `VehModelDesc`              | varchar  | ✓        |          |         |             |
| `Salesperson1`              | varchar  |          |          |         |             |
| `Salesperson2`              | varchar  |          |          |         |             |
| `SalesPercent`              | float    | ✓        |          |         |             |
| `AccountingDate`            | varchar  | ✓        |          |         |             |
| `ContractDate`              | date     | ✓        |          |         |             |
| `UnitCount`                 | numeric  | ✓        |          |         |             |
| `FrontSaleAmount`           | float    | ✓        |          |         |             |
| `FrontCostAmount`           | float    | ✓        |          |         |             |
| `FrontGross`                | float    | ✓        |          |         |             |
| `Pack`                      | float    | ✓        |          |         |             |
| `DocFee`                    | float    | ✓        |          |         |             |
| `FactoryBonus`              | float    | ✓        |          |         |             |
| `COS_Adj`                   | float    | ✓        |          |         |             |
| `OtherAdj`                  | float    | ✓        |          |         |             |
| `FrontGross_PackDocFactory` | float    | ✓        |          |         |             |
| `BackSale`                  | float    | ✓        |          |         |             |
| `BackCost`                  | float    | ✓        |          |         |             |
| `BackGross`                 | float    | ✓        |          |         |             |
| `Chargebacks_All`           | float    | ✓        |          |         |             |
| `Chargebacks_Under90`       | float    | ✓        |          |         |             |
| `Chargebacks_Over90`        | float    | ✓        |          |         |             |
| `FI_Net`                    | float    | ✓        |          |         |             |
| `ProductCount`              | numeric  | ✓        |          |         |             |
| `PenetrationCount`          | numeric  | ✓        |          |         |             |
| `Memo_FrontWeOwes`          | numeric  | ✓        |          |         |             |
| `Memo_TradeAllowance`       | numeric  | ✓        |          |         |             |
| `Memo_Incentives`           | float    | ✓        |          |         |             |
| `CertifiedFlag`             | varchar  | ✓        |          |         |             |
| `age`                       | int      | ✓        |          |         |             |
| `custno`                    | varchar  | ✓        |          |         |             |
| `CustomerName`              | varchar  | ✓        |          |         |             |
| `MatchType`                 | varchar  |          |          |         |             |
| `Orig_ContractDate`         | datetime | ✓        |          |         |             |
| `ID`                        | bigint   | ✓        |          |         |             |
| `EntCora_Account_ID`        | int      | ✓        |          |         |             |
| `loadfile`                  | varchar  | ✓        |          |         |             |
| `Meta_loaddate`             | datetime | ✓        |          |         |             |
| `DealType_FI`               | varchar  | ✓        |          |         |             |
| `CashDeal_Count`            | int      | ✓        |          |         |             |
| `VSACount`                  | int      | ✓        |          |         |             |
| `MaintenanceCount`          | int      | ✓        |          |         |             |
| `VehicleMileage`            | varchar  | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.SalesTranAssociate_Inbound → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.SalesTranAssociate_Inbound_1122 → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.SalesTranAssociate_Inbound_New → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.SalesTranAssociate_Inbound_Oct2024 → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.SalesTranAssociate_Inbound_Oct20241 → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.SalesTranAssociate_Inbound_Oct2024b → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.SalesTranAssociate_Inbound_testing → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "id" in both tables
  - Column: `ID` → `ID`
- **column_match**: dbo.Dim_Entity → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "entcora_account_id" in both tables
  - Column: `EntCora_Account_ID` → `EntCora_Account_ID`
- **column_match**: dbo.Dim_GLScheduleSummary_degen → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "entcora_account_id" in both tables
  - Column: `EntCora_Account_ID` → `EntCora_Account_ID`
- **column_match**: dbo.SalesTranAso_FI_Individual → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "entcora_account_id" in both tables
  - Column: `EntCora_Account_ID` → `EntCora_Account_ID`
- **column_match**: dbo.SalesTranAssociate_Inbound → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "entcora_account_id" in both tables
  - Column: `EntCora_Account_ID` → `EntCora_Account_ID`
- **column_match**: dbo.SalesTranAssociate_Inbound_1122 → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "entcora_account_id" in both tables
  - Column: `EntCora_Account_ID` → `EntCora_Account_ID`
- **column_match**: dbo.SalesTranAssociate_Inbound_New → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "entcora_account_id" in both tables
  - Column: `EntCora_Account_ID` → `EntCora_Account_ID`
- **column_match**: dbo.SalesTranAssociate_Inbound_Oct2024 → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "entcora_account_id" in both tables
  - Column: `EntCora_Account_ID` → `EntCora_Account_ID`
- **column_match**: dbo.SalesTranAssociate_Inbound_Oct20241 → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "entcora_account_id" in both tables
  - Column: `EntCora_Account_ID` → `EntCora_Account_ID`
- **column_match**: dbo.SalesTranAssociate_Inbound_Oct2024b → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "entcora_account_id" in both tables
  - Column: `EntCora_Account_ID` → `EntCora_Account_ID`
- **column_match**: dbo.SalesTranAssociate_Inbound_testing → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "entcora_account_id" in both tables
  - Column: `EntCora_Account_ID` → `EntCora_Account_ID`
- **column_match**: dbo.SalesTranAso_FI_Individual → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "cdk_companyid" in both tables
  - Column: `CDK_companyid` → `CDK_companyid`
- **column_match**: dbo.SalesTranAssociate_Inbound → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "cdk_companyid" in both tables
  - Column: `CDK_companyid` → `CDK_companyid`
- **column_match**: dbo.SalesTranAssociate_Inbound_1122 → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "cdk_companyid" in both tables
  - Column: `CDK_companyid` → `CDK_companyid`
- **column_match**: dbo.SalesTranAssociate_Inbound_New → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "cdk_companyid" in both tables
  - Column: `CDK_companyid` → `CDK_companyid`
- **column_match**: dbo.SalesTranAssociate_Inbound_Oct2024 → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "cdk_companyid" in both tables
  - Column: `CDK_companyid` → `CDK_companyid`
- **column_match**: dbo.SalesTranAssociate_Inbound_Oct20241 → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "cdk_companyid" in both tables
  - Column: `CDK_companyid` → `CDK_companyid`
- **column_match**: dbo.SalesTranAssociate_Inbound_Oct2024b → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "cdk_companyid" in both tables
  - Column: `CDK_companyid` → `CDK_companyid`
- **column_match**: dbo.SalesTranAssociate_Inbound_testing → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "cdk_companyid" in both tables
  - Column: `CDK_companyid` → `CDK_companyid`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
