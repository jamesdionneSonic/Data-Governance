---
name: dim_Time
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - dimension
  - view
  - core-schema
depends_on:
  - dbo.FACT_JMA_CONTRACT_TBL
  - dbo.FACT_JMA_CONTRACT_TBL
  - dbo.FACT_JMA_CONTRACT_TBL
  - dbo.FACT_JMA_CONTRACT_TBL
  - dbo.FACT_JMA_CONTRACT_TBL
  - dbo.FactRemedy
  - dbo.FactRemedy
  - dbo.FactRemedy
  - dbo.FactRemedy
  - dbo.FactRemedy
row_count: 0
size_kb: 0
extraction_warnings:
  - MISSING_VIEW_DATABASE_STATE
  - LITE_MODE_ENABLED
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: view
- **Schema**: dbo
- **Row Count**: 0
- **Size**: 0 KB

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.
- **LITE_MODE_ENABLED**: Column-level lineage analysis disabled for large extraction (751 tables). Only explicit foreign keys detected.

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

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
