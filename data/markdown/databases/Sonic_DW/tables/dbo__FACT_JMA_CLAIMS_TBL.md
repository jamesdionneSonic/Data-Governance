---
name: FACT_JMA_CLAIMS_TBL
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - fact-table
  - core-schema
depends_on:
  - DIM_JMA_CANCELLATION_REASON_CODE_TBL
  - DIM_JMA_CONDITION_TBL
  - DIM_JMA_COVERAGE_LENGTH_TBL
  - DIM_JMA_COVERAGE_PLAN_TYPE_TBL
  - DIM_JMA_DEALER_TBL
  - DIM_JMA_DEBIT_CREDIT_TBL
  - DIM_JMA_FINANCE_TYPE_TBL
  - DIM_JMA_PRODUCT_TYPE_TBL
  - DIM_JMA_REFUND_METHOD_TBL
  - DIM_JMA_TRANSACTION_TYPE_TBL
  - DIM_JMA_PRODUCT_TYPE_TBL
row_count: 0
size_kb: 0
column_count: 26
index_count: 1
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

| Name                              | Type      | Nullable | Identity | Default         | Description |
| --------------------------------- | --------- | -------- | -------- | --------------- | ----------- |
| `JMA_CLAIMS_ID`                   | bigint    |          | ✓        |                 |             |
| `JMA_CLAIMS_REF`                  | varchar   | ✓        |          |                 |             |
| `TRANSACTION_DATEKEY`             | int       |          |          |                 |             |
| `JMA_PRODUCT_TYPE_ID`             | bigint    |          |          |                 |             |
| `AUTHORIZATION_DATEKEY`           | int       |          |          |                 |             |
| `CLAIM_JMA_DEBIT_CREDIT_ID`       | bigint    |          |          |                 |             |
| `PAID_DATEKEY`                    | int       |          |          |                 |             |
| `SELLING_DEALER_JMA_DEALER_ID`    | bigint    |          |          |                 |             |
| `SERVICING_BILLING_JMA_DEALER_ID` | bigint    |          |          |                 |             |
| `EntityKey`                       | int       |          |          |                 |             |
| `VIN`                             | varchar   | ✓        |          |                 |             |
| `CONTRACT_HOLDER_FIRST_NAME`      | varchar   | ✓        |          |                 |             |
| `CONTRACT_HOLDER_LAST_NAME`       | varchar   | ✓        |          |                 |             |
| `CONTRACT_NUMBER`                 | varchar   | ✓        |          |                 |             |
| `AUTHORIZATION_NUMBER`            | varchar   | ✓        |          |                 |             |
| `MAINTENANCE_COUPON_NUMBER`       | varchar   | ✓        |          |                 |             |
| `FIRST_NAME`                      | varchar   | ✓        |          |                 |             |
| `LAST_NAME`                       | varchar   | ✓        |          |                 |             |
| `PAID_AMOUNT_LIST_NAME`           | varchar   | ✓        |          |                 |             |
| `PAID_AMOUNT_LIST_AMOUNT`         | decimal   | ✓        |          |                 |             |
| `SERVICING_FACILITY_ZIP_CODE`     | varchar   |          |          |                 |             |
| `SELLING_DEALER_ACCOUNT_NAME`     | varchar   |          |          |                 |             |
| `META_LOADDATE`                   | datetime2 | ✓        |          | (sysdatetime()) |             |
| `META_ROWLASTCHANGEDDATE`         | datetime2 | ✓        |          | (sysdatetime()) |             |
| `META_COMPUTERNAME`               | varchar   | ✓        |          |                 |             |
| `ETLEXECUTION_ID`                 | varchar   | ✓        |          |                 |             |

## Constraints

- **Primary Key**: PK_FACT_JMA_CLAIMS_TBL
  - Columns: JMA_CLAIMS_ID

## Indexes

- **PK_FACT_JMA_CLAIMS_TBL** (NONCLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: JMA_CLAIMS_ID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.FACT_JMA_CLAIMS_TBL → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `AUTHORIZATION_DATEKEY` → `DateKey`
- **explicit_fk**: dbo.FACT_JMA_CLAIMS_TBL → dbo.DIM_JMA_DEBIT_CREDIT_TBL
  - Confidence: 100%
  - Evidence: undefined
  - Column: `CLAIM_JMA_DEBIT_CREDIT_ID` → `JMA_DEBIT_CREDIT_ID`
- **explicit_fk**: dbo.FACT_JMA_CLAIMS_TBL → dbo.DIM_JMA_PRODUCT_TYPE_TBL
  - Confidence: 100%
  - Evidence: undefined
  - Column: `JMA_PRODUCT_TYPE_ID` → `JMA_PRODUCT_TYPE_ID`
- **explicit_fk**: dbo.FACT_JMA_CLAIMS_TBL → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `PAID_DATEKEY` → `DateKey`
- **explicit_fk**: dbo.FACT_JMA_CLAIMS_TBL → dbo.DIM_JMA_DEALER_TBL
  - Confidence: 100%
  - Evidence: undefined
  - Column: `SELLING_DEALER_JMA_DEALER_ID` → `JMA_DEALER_ID`
- **explicit_fk**: dbo.FACT_JMA_CLAIMS_TBL → dbo.DIM_JMA_DEALER_TBL
  - Confidence: 100%
  - Evidence: undefined
  - Column: `SERVICING_BILLING_JMA_DEALER_ID` → `JMA_DEALER_ID`
- **explicit_fk**: dbo.FACT_JMA_CLAIMS_TBL → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `TRANSACTION_DATEKEY` → `DateKey`
- **column_match**: dbo.DIM_JMA_CANCELLATION_REASON_CODE_TBL → dbo.FACT_JMA_CLAIMS_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_CONDITION_TBL → dbo.FACT_JMA_CLAIMS_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_COVERAGE_LENGTH_TBL → dbo.FACT_JMA_CLAIMS_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_COVERAGE_PLAN_TYPE_TBL → dbo.FACT_JMA_CLAIMS_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_DEALER_TBL → dbo.FACT_JMA_CLAIMS_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_DEBIT_CREDIT_TBL → dbo.FACT_JMA_CLAIMS_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_FINANCE_TYPE_TBL → dbo.FACT_JMA_CLAIMS_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_PRODUCT_TYPE_TBL → dbo.FACT_JMA_CLAIMS_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_REFUND_METHOD_TBL → dbo.FACT_JMA_CLAIMS_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_TRANSACTION_TYPE_TBL → dbo.FACT_JMA_CLAIMS_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.FACT_JMA_CLAIMS_TBL → dbo.FACT_JMA_CONTRACT_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.FACT_JMA_CLAIMS_TBL → dbo.PROCESS_AUDIT_DETAILS
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_PRODUCT_TYPE_TBL → dbo.FACT_JMA_CLAIMS_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "jma_product_type_id" in both tables
  - Column: `JMA_PRODUCT_TYPE_ID` → `JMA_PRODUCT_TYPE_ID`
- **column_match**: dbo.FACT_JMA_CLAIMS_TBL → dbo.FACT_JMA_CONTRACT_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "jma_product_type_id" in both tables
  - Column: `JMA_PRODUCT_TYPE_ID` → `JMA_PRODUCT_TYPE_ID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
