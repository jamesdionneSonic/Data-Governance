---
name: dim_Time
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
  - FACT_JMA_CONTRACT_TBL
  - FACT_JMA_CONTRACT_TBL
  - FACT_JMA_CONTRACT_TBL
  - FACT_JMA_CONTRACT_TBL
  - FactRemedy
  - FactRemedy
  - FactRemedy
  - FactRemedy
  - FactRemedy
row_count: 0
size_kb: 0
column_count: 8
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

| Name               | Type | Nullable | Identity | Default | Description |
| ------------------ | ---- | -------- | -------- | ------- | ----------- |
| `TimeKey`          | int  |          |          |         |             |
| `TimeTime`         | char |          |          |         |             |
| `TimeHour`         | char |          |          |         |             |
| `TimeMilitaryHour` | char |          |          |         |             |
| `TimeMinute`       | char |          |          |         |             |
| `TimeSecond`       | char |          |          |         |             |
| `TimeAmPm`         | char |          |          |         |             |
| `TimeStandardTime` | char | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_dim_Time1
  - Columns: TimeKey

## Indexes

- **PK_dim_Time1** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: TimeKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.dim_Time
  - Confidence: 100%
  - Evidence: undefined
  - Column: `CANCELLATION_EFFECTIVE_TIMEKEY` → `TimeKey`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.dim_Time
  - Confidence: 100%
  - Evidence: undefined
  - Column: `CONTRACT_PURCHASE_TIMEKEY` → `TimeKey`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.dim_Time
  - Confidence: 100%
  - Evidence: undefined
  - Column: `INVOICE_BILLING_TIMEKEY` → `TimeKey`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.dim_Time
  - Confidence: 100%
  - Evidence: undefined
  - Column: `TRANSACTION_TIMEKEY` → `TimeKey`
- **explicit_fk**: dbo.FACT_JMA_CONTRACT_TBL → dbo.dim_Time
  - Confidence: 95%
  - Evidence: undefined
  - Column: `CHECK_TIMEKEY` → `TimeKey`
- **explicit_fk**: dbo.FactRemedy → dbo.dim_Time
  - Confidence: 95%
  - Evidence: undefined
  - Column: `ClosedDateTimeKey` → `TimeKey`
- **explicit_fk**: dbo.FactRemedy → dbo.dim_Time
  - Confidence: 95%
  - Evidence: undefined
  - Column: `LastModifiedTimeKey` → `TimeKey`
- **explicit_fk**: dbo.FactRemedy → dbo.dim_Time
  - Confidence: 95%
  - Evidence: undefined
  - Column: `LastResolvedTimeKey` → `TimeKey`
- **explicit_fk**: dbo.FactRemedy → dbo.dim_Time
  - Confidence: 95%
  - Evidence: undefined
  - Column: `ReportedTimeKey` → `TimeKey`
- **explicit_fk**: dbo.FactRemedy → dbo.dim_Time
  - Confidence: 95%
  - Evidence: undefined
  - Column: `SubmitTimeKey` → `TimeKey`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
