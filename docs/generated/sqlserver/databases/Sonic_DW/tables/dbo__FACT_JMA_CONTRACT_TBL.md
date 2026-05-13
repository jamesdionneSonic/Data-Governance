---
name: FACT_JMA_CONTRACT_TBL
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - fact-table
  - view
  - core-schema
depends_on: []
row_count: 0
size_kb: 0
column_count: 0
index_count: 0
check_constraint_count: 0
extraction_warnings:
  - MISSING_VIEW_DATABASE_STATE
  - LARGE_EXTRACTION_LITE_MODE
  - VIEW_COLUMN_EXTRACTION_SKIPPED
  - LITE_MODE_ENABLED
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: view
- **Schema**: dbo
- **Row Count**: 0
- **Size**: 0 KB

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.
- **LARGE_EXTRACTION_LITE_MODE**: Column extraction skipped: 751 tables exceeds threshold. Use scoped extraction for column-level lineage.
- **VIEW_COLUMN_EXTRACTION_SKIPPED**: View column extraction skipped: 523 views exceeds threshold. Use scoped extraction for full view metadata.
- **LITE_MODE_ENABLED**: Column-level relationship detection skipped for 751 tables. Column metadata extracted but not cross-table matched.

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

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
