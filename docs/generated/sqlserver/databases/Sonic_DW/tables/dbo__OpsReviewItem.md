---
name: OpsReviewItem
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - core-schema
depends_on:
  - dbo.OpsServiceDealership
  - dbo.OpsReviewItemDetail
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

- **explicit_fk**: dbo.OpsReviewItem → dbo.OpsAssociate
  - Confidence: 100%
  - Evidence: undefined
  - Column: `OwnerID` → `Username`
- **explicit_fk**: dbo.OpsReviewItem → dbo.OpsReview
  - Confidence: 100%
  - Evidence: undefined
  - Column: `OpsReviewID` → `OpsReviewID`
- **explicit_fk**: dbo.OpsServiceDealership → dbo.OpsReviewItem
  - Confidence: 100%
  - Evidence: undefined
  - Column: `OpsReviewItemID` → `OpsReviewItemID`
- **explicit_fk**: dbo.OpsReviewItemDetail → dbo.OpsReviewItem
  - Confidence: 100%
  - Evidence: undefined
  - Column: `OpsReviewItemID` → `OpsReviewItemID`
- **explicit_fk**: dbo.OpsReviewItem → dbo.OpsService
  - Confidence: 100%
  - Evidence: undefined
  - Column: `ServiceID` → `ServiceID`
- **explicit_fk**: dbo.OpsReviewItem → dbo.OpsStatus
  - Confidence: 100%
  - Evidence: undefined
  - Column: `StatusID` → `StatusID`

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
