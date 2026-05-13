---
name: FACT_JMA_CONTRACT_TBL
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
  - FACT_JMA_CLAIMS_TBL
  - DIM_JMA_COVERAGE_PLAN_TYPE_TBL
  - DIM_JMA_FINANCE_TYPE_TBL
  - DIM_JMA_PRODUCT_TYPE_TBL
  - FACT_JMA_CLAIMS_TBL
  - DIM_JMA_TRANSACTION_TYPE_TBL
row_count: 0
size_kb: 0
column_count: 60
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

| Name                                | Type      | Nullable | Identity | Default         | Description |
| ----------------------------------- | --------- | -------- | -------- | --------------- | ----------- |
| `JMA_CONTRACT_ID`                   | bigint    |          | ✓        |                 |             |
| `JMA_CONTRACT_REF`                  | varchar   | ✓        |          |                 |             |
| `JMA_TRANSACTION_TYPE_ID`           | bigint    |          |          |                 |             |
| `SELLING_JMA_DEALER_ID`             | bigint    |          |          |                 |             |
| `TRANSACTION_DATEKEY`               | int       |          |          |                 |             |
| `TRANSACTION_TIMEKEY`               | int       |          |          |                 |             |
| `VEHICLE_JMA_CONDITION_ID`          | bigint    |          |          |                 |             |
| `JMA_PRODUCT_TYPE_ID`               | bigint    |          |          |                 |             |
| `CONTRACT_JMA_COVERAGE_ID`          | bigint    |          |          |                 |             |
| `CONTRACT_PURCHASE_DATEKEY`         | int       |          |          |                 |             |
| `CONTRACT_PURCHASE_TIMEKEY`         | int       |          |          |                 |             |
| `INVOICE_BILLING_DATEKEY`           | int       |          |          |                 |             |
| `INVOICE_BILLING_TIMEKEY`           | int       |          |          |                 |             |
| `JMA_FINANCE_TYPE_ID`               | bigint    |          |          |                 |             |
| `CONTRACT_JMA_DEBIT_CREDIT_ID`      | bigint    |          |          |                 |             |
| `CANCELLATION_EFFECTIVE_DATEKEY`    | int       |          |          |                 |             |
| `CANCELLATION_EFFECTIVE_TIMEKEY`    | int       |          |          |                 |             |
| `CANCELLATION_JMA_REFUND_METHOD_ID` | bigint    |          |          |                 |             |
| `CHECK_DATEKEY`                     | int       |          |          |                 |             |
| `CHECK_TIMEKEY`                     | int       |          |          |                 |             |
| `EntityKey`                         | int       |          |          |                 |             |
| `JMA_COVERAGE_PLAN_TYPE_ID`         | bigint    |          |          |                 |             |
| `VIN`                               | varchar   | ✓        |          |                 |             |
| `VEHICLE_MILEAGE_AT_SALE`           | int       | ✓        |          |                 |             |
| `CONTRACT_NUMBER_12`                | varchar   | ✓        |          |                 |             |
| `FORM_NUMBER`                       | varchar   | ✓        |          |                 |             |
| `FORM_EDITION_MONTH`                | varchar   | ✓        |          |                 |             |
| `FORM_EDITION_YEAR`                 | varchar   | ✓        |          |                 |             |
| `CONTRACT_COVERAGE_LENGTH`          | int       | ✓        |          |                 |             |
| `CONTRACT_MILEAGE_TERM`             | int       | ✓        |          |                 |             |
| `CONTRACT_HOLDER_FIRST_NAME`        | varchar   | ✓        |          |                 |             |
| `CONTRACT_HOLDER_LAST_NAME`         | varchar   | ✓        |          |                 |             |
| `LIEN_HOLDER_NAME`                  | varchar   | ✓        |          |                 |             |
| `TOTAL_DEALER_REMIT_AMOUNT`         | decimal   | ✓        |          |                 |             |
| `RETAIL_PAID_AMOUNT`                | decimal   | ✓        |          |                 |             |
| `GOODWIL_AMOUNT`                    | decimal   | ✓        |          |                 |             |
| `CANCELLATION_FEE_AMOUNT`           | decimal   | ✓        |          |                 |             |
| `CANCELLATION_REFUND_PERCENT`       | decimal   | ✓        |          |                 |             |
| `CANCELLATION_REFUND_AMOUNT`        | decimal   | ✓        |          |                 |             |
| `CHECK_NUMBER`                      | varchar   | ✓        |          |                 |             |
| `PAYEE_FIRST_NAME`                  | varchar   | ✓        |          |                 |             |
| `PAYEE_LAST_NAME`                   | varchar   | ✓        |          |                 |             |
| `CLIP_FEE_AMOUNT`                   | decimal   | ✓        |          |                 |             |
| `MANAGEMENT_COMMISSION_AMOUNT`      | decimal   | ✓        |          |                 |             |
| `REFERRAL_FEE_AMOUNT`               | decimal   | ✓        |          |                 |             |
| `ONE_PLUS_ACCRUAL_AMOUNT`           | decimal   | ✓        |          |                 |             |
| `ADMIN_FEE_AMOUNT`                  | decimal   | ✓        |          |                 |             |
| `BASE_RESERVE_AMOUNT`               | decimal   | ✓        |          |                 |             |
| `GOODWILL_AMOUNT`                   | decimal   | ✓        |          |                 |             |
| `INCENTIVE_HOLDBACK_AMOUNT`         | decimal   | ✓        |          |                 |             |
| `DEAL_NUMBER`                       | varchar   | ✓        |          |                 |             |
| `STOCK_NUMBER`                      | varchar   | ✓        |          |                 |             |
| `CUSTOMER_ID`                       | varchar   | ✓        |          |                 |             |
| `EMPLOYEE_ID`                       | varchar   | ✓        |          |                 |             |
| `PARTICIPATION_STATUS`              | varchar   |          |          |                 |             |
| `INSURANCE_CARRIER_CODE`            | varchar   | ✓        |          |                 |             |
| `FI_COMMISSION_AMOUNT`              | decimal   | ✓        |          |                 |             |
| `META_LOADDATE`                     | datetime2 | ✓        |          | (sysdatetime()) |             |
| `META_ROWLASTCHANGEDDATE`           | datetime2 | ✓        |          | (sysdatetime()) |             |
| `ETLEXECUTION_ID`                   | varchar   | ✓        |          |                 |             |

## Constraints

- **Primary Key**: PK_FACT_JMA_CONTRACT_TBL
  - Columns: JMA_CONTRACT_ID

## Indexes

- **PK_FACT_JMA_CONTRACT_TBL** (NONCLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: JMA_CONTRACT_ID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `CANCELLATION_EFFECTIVE_DATEKEY` → `DateKey`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.dim_Time
  - Confidence: 100%
  - Evidence: undefined
  - Column: `CANCELLATION_EFFECTIVE_TIMEKEY` → `TimeKey`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.DIM_JMA_REFUND_METHOD_TBL
  - Confidence: 100%
  - Evidence: undefined
  - Column: `CANCELLATION_JMA_REFUND_METHOD_ID` → `JMA_REFUND_METHOD_ID`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.DIM_JMA_COVERAGE_LENGTH_TBL
  - Confidence: 100%
  - Evidence: undefined
  - Column: `CONTRACT_JMA_COVERAGE_ID` → `JMA_COVERAGE_LENGTH_ID`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.DIM_JMA_DEBIT_CREDIT_TBL
  - Confidence: 100%
  - Evidence: undefined
  - Column: `CONTRACT_JMA_DEBIT_CREDIT_ID` → `JMA_DEBIT_CREDIT_ID`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `CONTRACT_PURCHASE_DATEKEY` → `DateKey`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.dim_Time
  - Confidence: 100%
  - Evidence: undefined
  - Column: `CONTRACT_PURCHASE_TIMEKEY` → `TimeKey`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.DIM_JMA_COVERAGE_PLAN_TYPE_TBL
  - Confidence: 100%
  - Evidence: undefined
  - Column: `JMA_COVERAGE_PLAN_TYPE_ID` → `JMA_COVERAGE_PLAN_TYPE_ID`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `INVOICE_BILLING_DATEKEY` → `DateKey`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.dim_Time
  - Confidence: 100%
  - Evidence: undefined
  - Column: `INVOICE_BILLING_TIMEKEY` → `TimeKey`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.DIM_JMA_FINANCE_TYPE_TBL
  - Confidence: 100%
  - Evidence: undefined
  - Column: `JMA_FINANCE_TYPE_ID` → `JMA_FINANCE_TYPE_ID`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.DIM_JMA_PRODUCT_TYPE_TBL
  - Confidence: 100%
  - Evidence: undefined
  - Column: `JMA_PRODUCT_TYPE_ID` → `JMA_PRODUCT_TYPE_ID`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.DIM_JMA_TRANSACTION_TYPE_TBL
  - Confidence: 100%
  - Evidence: undefined
  - Column: `JMA_TRANSACTION_TYPE_ID` → `JMA_TRANSACTION_TYPE_ID`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.DIM_JMA_DEALER_TBL
  - Confidence: 100%
  - Evidence: undefined
  - Column: `SELLING_JMA_DEALER_ID` → `JMA_DEALER_ID`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.Dim_Date
  - Confidence: 100%
  - Evidence: undefined
  - Column: `TRANSACTION_DATEKEY` → `DateKey`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.dim_Time
  - Confidence: 100%
  - Evidence: undefined
  - Column: `TRANSACTION_TIMEKEY` → `TimeKey`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.DIM_JMA_CONDITION_TBL
  - Confidence: 100%
  - Evidence: undefined
  - Column: `VEHICLE_JMA_CONDITION_ID` → `JMA_CONDITION_ID`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.Dim_Date
  - Confidence: 95%
  - Evidence: undefined
  - Column: `CHECK_DATEKEY` → `DateKey`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.dim_Time
  - Confidence: 95%
  - Evidence: undefined
  - Column: `CHECK_TIMEKEY` → `TimeKey`
- **column_match**: dbo.DIM_JMA_CANCELLATION_REASON_CODE_TBL → dbo.FACT_JMA_CONTRACT_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_CONDITION_TBL → dbo.FACT_JMA_CONTRACT_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_COVERAGE_LENGTH_TBL → dbo.FACT_JMA_CONTRACT_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_COVERAGE_PLAN_TYPE_TBL → dbo.FACT_JMA_CONTRACT_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_DEALER_TBL → dbo.FACT_JMA_CONTRACT_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_DEBIT_CREDIT_TBL → dbo.FACT_JMA_CONTRACT_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_FINANCE_TYPE_TBL → dbo.FACT_JMA_CONTRACT_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_PRODUCT_TYPE_TBL → dbo.FACT_JMA_CONTRACT_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_REFUND_METHOD_TBL → dbo.FACT_JMA_CONTRACT_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_TRANSACTION_TYPE_TBL → dbo.FACT_JMA_CONTRACT_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.FACT_JMA_CLAIMS_TBL → dbo.FACT_JMA_CONTRACT_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.FACT_JMA_CONTRACT_TBL → dbo.PROCESS_AUDIT_DETAILS
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_COVERAGE_PLAN_TYPE_TBL → dbo.FACT_JMA_CONTRACT_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "jma_coverage_plan_type_id" in both tables
  - Column: `JMA_COVERAGE_PLAN_TYPE_ID` → `JMA_COVERAGE_PLAN_TYPE_ID`
- **column_match**: dbo.DIM_JMA_FINANCE_TYPE_TBL → dbo.FACT_JMA_CONTRACT_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "jma_finance_type_id" in both tables
  - Column: `JMA_FINANCE_TYPE_ID` → `JMA_FINANCE_TYPE_ID`
- **column_match**: dbo.DIM_JMA_PRODUCT_TYPE_TBL → dbo.FACT_JMA_CONTRACT_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "jma_product_type_id" in both tables
  - Column: `JMA_PRODUCT_TYPE_ID` → `JMA_PRODUCT_TYPE_ID`
- **column_match**: dbo.FACT_JMA_CLAIMS_TBL → dbo.FACT_JMA_CONTRACT_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "jma_product_type_id" in both tables
  - Column: `JMA_PRODUCT_TYPE_ID` → `JMA_PRODUCT_TYPE_ID`
- **column_match**: dbo.DIM_JMA_TRANSACTION_TYPE_TBL → dbo.FACT_JMA_CONTRACT_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "jma_transaction_type_id" in both tables
  - Column: `JMA_TRANSACTION_TYPE_ID` → `JMA_TRANSACTION_TYPE_ID`
- **column_match**: dbo.FACT_JMA_CONTRACT_TBL → dbo.SalesTranAssociate_Outbound
  - Confidence: 80%
  - Evidence: Exact column name match: "employee_id" in both tables
  - Column: `EMPLOYEE_ID` → `EMPLOYEE_ID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
