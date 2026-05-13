---
name: DIM_JMA_COVERAGE_LENGTH_TBL
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - dimension
  - core-schema
depends_on:
  - FACT_JMA_CONTRACT_TBL
  - DIM_JMA_CANCELLATION_REASON_CODE_TBL
  - DIM_JMA_CONDITION_TBL
row_count: 0
size_kb: 0
column_count: 7
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

| Name                       | Type      | Nullable | Identity | Default         | Description |
| -------------------------- | --------- | -------- | -------- | --------------- | ----------- |
| `JMA_COVERAGE_LENGTH_ID`   | bigint    |          | ✓        |                 |             |
| `JMA_COVERAGE_LENGTH_CODE` | varchar   | ✓        |          |                 |             |
| `JMA_COVERAGE_LENGTH_DESC` | varchar   | ✓        |          |                 |             |
| `ACTIVE_IND`               | int       |          |          | ((1))           |             |
| `META_LOADDATE`            | datetime2 | ✓        |          | (sysdatetime()) |             |
| `META_ROWLASTCHANGEDDATE`  | datetime2 | ✓        |          | (sysdatetime()) |             |
| `ETLEXECUTION_ID`          | varchar   | ✓        |          |                 |             |

## Constraints

- **Primary Key**: PK_DIM_JMA_COVERAGE_TBL
  - Columns: JMA_COVERAGE_LENGTH_ID

## Indexes

- **PK_DIM_JMA_COVERAGE_TBL** (NONCLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: JMA_COVERAGE_LENGTH_ID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.DIM_JMA_COVERAGE_LENGTH_TBL
  - Confidence: 100%
  - Evidence: undefined
  - Column: `CONTRACT_JMA_COVERAGE_ID` → `JMA_COVERAGE_LENGTH_ID`
- **column_match**: dbo.DIM_JMA_CANCELLATION_REASON_CODE_TBL → dbo.DIM_JMA_COVERAGE_LENGTH_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_CONDITION_TBL → dbo.DIM_JMA_COVERAGE_LENGTH_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_COVERAGE_LENGTH_TBL → dbo.DIM_JMA_COVERAGE_PLAN_TYPE_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_COVERAGE_LENGTH_TBL → dbo.DIM_JMA_DEALER_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_COVERAGE_LENGTH_TBL → dbo.DIM_JMA_DEBIT_CREDIT_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_COVERAGE_LENGTH_TBL → dbo.DIM_JMA_FINANCE_TYPE_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_COVERAGE_LENGTH_TBL → dbo.DIM_JMA_PRODUCT_TYPE_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_COVERAGE_LENGTH_TBL → dbo.DIM_JMA_REFUND_METHOD_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_COVERAGE_LENGTH_TBL → dbo.DIM_JMA_TRANSACTION_TYPE_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_COVERAGE_LENGTH_TBL → dbo.FACT_JMA_CLAIMS_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_COVERAGE_LENGTH_TBL → dbo.FACT_JMA_CONTRACT_TBL
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`
- **column_match**: dbo.DIM_JMA_COVERAGE_LENGTH_TBL → dbo.PROCESS_AUDIT_DETAILS
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLEXECUTION_ID` → `ETLEXECUTION_ID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
