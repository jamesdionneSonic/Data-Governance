---
name: SalesTranAso_FI_Individual
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - Dim_Entity
  - Dim_GLScheduleSummary_degen
row_count: 0
size_kb: 0
column_count: 51
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
| `CalendarYearMonth`         | varchar  | ✓        |          |         |             |
| `CDK_companyid`             | varchar  | ✓        |          |         |             |
| `Prefix`                    | varchar  | ✓        |          |         |             |
| `EntBrand`                  | varchar  | ✓        |          |         |             |
| `Dealership`                | varchar  | ✓        |          |         |             |
| `DealStatus`                | varchar  | ✓        |          |         |             |
| `DealType`                  | varchar  | ✓        |          |         |             |
| `StockNo`                   | varchar  | ✓        |          |         |             |
| `AssignedFlag`              | int      | ✓        |          |         |             |
| `Dealno`                    | varchar  | ✓        |          |         |             |
| `VehModelYear`              | int      | ✓        |          |         |             |
| `VehMakeDesc`               | varchar  | ✓        |          |         |             |
| `VehModelDesc`              | varchar  | ✓        |          |         |             |
| `FI_Mgr`                    | varchar  | ✓        |          |         |             |
| `SalesPercent`              | numeric  | ✓        |          |         |             |
| `AccountingDate`            | date     | ✓        |          |         |             |
| `ContractDate`              | date     | ✓        |          |         |             |
| `UnitCount`                 | int      | ✓        |          |         |             |
| `FrontSaleAmount`           | numeric  | ✓        |          |         |             |
| `FrontCostAmount`           | numeric  | ✓        |          |         |             |
| `FrontGross`                | numeric  | ✓        |          |         |             |
| `Pack`                      | numeric  | ✓        |          |         |             |
| `DocFee`                    | numeric  | ✓        |          |         |             |
| `FactoryBonus`              | numeric  | ✓        |          |         |             |
| `COS_Adj`                   | numeric  | ✓        |          |         |             |
| `OtherAdj`                  | numeric  | ✓        |          |         |             |
| `FrontGross_PackDocFactory` | numeric  | ✓        |          |         |             |
| `BackSale`                  | numeric  | ✓        |          |         |             |
| `BackCost`                  | numeric  | ✓        |          |         |             |
| `BackGross`                 | numeric  | ✓        |          |         |             |
| `Chargebacks_All`           | numeric  | ✓        |          |         |             |
| `Chargebacks_Under90`       | numeric  | ✓        |          |         |             |
| `Chargebacks_Over90`        | numeric  | ✓        |          |         |             |
| `FI_Net`                    | numeric  | ✓        |          |         |             |
| `ProductCount`              | int      | ✓        |          |         |             |
| `PenetrationCount`          | int      | ✓        |          |         |             |
| `VSACount`                  | int      | ✓        |          |         |             |
| `MaintenanceCount`          | int      | ✓        |          |         |             |
| `Memo_FrontWeOwes`          | numeric  | ✓        |          |         |             |
| `Memo_TradeAllowance`       | numeric  | ✓        |          |         |             |
| `Memo_Incentives`           | numeric  | ✓        |          |         |             |
| `CertifiedFlag`             | varchar  | ✓        |          |         |             |
| `Age`                       | int      | ✓        |          |         |             |
| `custno`                    | varchar  | ✓        |          |         |             |
| `CustomerName`              | varchar  | ✓        |          |         |             |
| `MatchType`                 | varchar  | ✓        |          |         |             |
| `Orig_ContractDate`         | datetime | ✓        |          |         |             |
| `EntCora_Account_ID`        | int      | ✓        |          |         |             |
| `loadfile`                  | int      | ✓        |          |         |             |
| `Meta_LoadDate`             | datetime | ✓        |          |         |             |
| `DealType_FI`               | varchar  | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_Entity → dbo.SalesTranAso_FI_Individual
  - Confidence: 80%
  - Evidence: Exact column name match: "entcora_account_id" in both tables
  - Column: `EntCora_Account_ID` → `EntCora_Account_ID`
- **column_match**: dbo.Dim_GLScheduleSummary_degen → dbo.SalesTranAso_FI_Individual
  - Confidence: 80%
  - Evidence: Exact column name match: "entcora_account_id" in both tables
  - Column: `EntCora_Account_ID` → `EntCora_Account_ID`
- **column_match**: dbo.SalesTranAso_FI_Individual → dbo.SalesTranAssociate_Inbound
  - Confidence: 80%
  - Evidence: Exact column name match: "entcora_account_id" in both tables
  - Column: `EntCora_Account_ID` → `EntCora_Account_ID`
- **column_match**: dbo.SalesTranAso_FI_Individual → dbo.SalesTranAssociate_Inbound_1122
  - Confidence: 80%
  - Evidence: Exact column name match: "entcora_account_id" in both tables
  - Column: `EntCora_Account_ID` → `EntCora_Account_ID`
- **column_match**: dbo.SalesTranAso_FI_Individual → dbo.SalesTranAssociate_Inbound_New
  - Confidence: 80%
  - Evidence: Exact column name match: "entcora_account_id" in both tables
  - Column: `EntCora_Account_ID` → `EntCora_Account_ID`
- **column_match**: dbo.SalesTranAso_FI_Individual → dbo.SalesTranAssociate_Inbound_Oct2024
  - Confidence: 80%
  - Evidence: Exact column name match: "entcora_account_id" in both tables
  - Column: `EntCora_Account_ID` → `EntCora_Account_ID`
- **column_match**: dbo.SalesTranAso_FI_Individual → dbo.SalesTranAssociate_Inbound_Oct20241
  - Confidence: 80%
  - Evidence: Exact column name match: "entcora_account_id" in both tables
  - Column: `EntCora_Account_ID` → `EntCora_Account_ID`
- **column_match**: dbo.SalesTranAso_FI_Individual → dbo.SalesTranAssociate_Inbound_Oct2024b
  - Confidence: 80%
  - Evidence: Exact column name match: "entcora_account_id" in both tables
  - Column: `EntCora_Account_ID` → `EntCora_Account_ID`
- **column_match**: dbo.SalesTranAso_FI_Individual → dbo.SalesTranAssociate_Inbound_testing
  - Confidence: 80%
  - Evidence: Exact column name match: "entcora_account_id" in both tables
  - Column: `EntCora_Account_ID` → `EntCora_Account_ID`
- **column_match**: dbo.SalesTranAso_FI_Individual → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "entcora_account_id" in both tables
  - Column: `EntCora_Account_ID` → `EntCora_Account_ID`
- **column_match**: dbo.SalesTranAso_FI_Individual → dbo.SalesTranAssociate_Inbound
  - Confidence: 80%
  - Evidence: Exact column name match: "cdk_companyid" in both tables
  - Column: `CDK_companyid` → `CDK_companyid`
- **column_match**: dbo.SalesTranAso_FI_Individual → dbo.SalesTranAssociate_Inbound_1122
  - Confidence: 80%
  - Evidence: Exact column name match: "cdk_companyid" in both tables
  - Column: `CDK_companyid` → `CDK_companyid`
- **column_match**: dbo.SalesTranAso_FI_Individual → dbo.SalesTranAssociate_Inbound_New
  - Confidence: 80%
  - Evidence: Exact column name match: "cdk_companyid" in both tables
  - Column: `CDK_companyid` → `CDK_companyid`
- **column_match**: dbo.SalesTranAso_FI_Individual → dbo.SalesTranAssociate_Inbound_Oct2024
  - Confidence: 80%
  - Evidence: Exact column name match: "cdk_companyid" in both tables
  - Column: `CDK_companyid` → `CDK_companyid`
- **column_match**: dbo.SalesTranAso_FI_Individual → dbo.SalesTranAssociate_Inbound_Oct20241
  - Confidence: 80%
  - Evidence: Exact column name match: "cdk_companyid" in both tables
  - Column: `CDK_companyid` → `CDK_companyid`
- **column_match**: dbo.SalesTranAso_FI_Individual → dbo.SalesTranAssociate_Inbound_Oct2024b
  - Confidence: 80%
  - Evidence: Exact column name match: "cdk_companyid" in both tables
  - Column: `CDK_companyid` → `CDK_companyid`
- **column_match**: dbo.SalesTranAso_FI_Individual → dbo.SalesTranAssociate_Inbound_testing
  - Confidence: 80%
  - Evidence: Exact column name match: "cdk_companyid" in both tables
  - Column: `CDK_companyid` → `CDK_companyid`
- **column_match**: dbo.SalesTranAso_FI_Individual → dbo.SalesTranAssociate_Inbound_update
  - Confidence: 80%
  - Evidence: Exact column name match: "cdk_companyid" in both tables
  - Column: `CDK_companyid` → `CDK_companyid`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
