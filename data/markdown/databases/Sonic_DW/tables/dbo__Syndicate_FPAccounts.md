---
name: Syndicate_FPAccounts
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - CSI_Email_Change_Tracking
  - Dim_Entity
  - FactFireSummary
  - FactFireSummary_update
row_count: 0
size_kb: 0
column_count: 18
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

| Name               | Type    | Nullable | Identity | Default | Description |
| ------------------ | ------- | -------- | -------- | ------- | ----------- |
| `entitykey`        | varchar | ✓        |          |         |             |
| `EntADPCompanyID`  | varchar | ✓        |          |         |             |
| `EntDealerLvl1`    | varchar | ✓        |          |         |             |
| `EntDealerLvl0`    | varchar | ✓        |          |         |             |
| `entesscode`       | varchar | ✓        |          |         |             |
| `EntBrand`         | varchar | ✓        |          |         |             |
| `Syndicate Group`  | varchar | ✓        |          |         |             |
| `StockType`        | varchar | ✓        |          |         |             |
| `FP Lender`        | varchar | ✓        |          |         |             |
| `Group`            | varchar | ✓        |          |         |             |
| `BofADealerName`   | varchar | ✓        |          |         |             |
| `BOAlevel_default` | varchar | ✓        |          |         |             |
| `State`            | varchar | ✓        |          |         |             |
| `CIN`              | varchar | ✓        |          |         |             |
| `DLOC`             | varchar | ✓        |          |         |             |
| `Account`          | varchar | ✓        |          |         |             |
| `PROD Type`        | varchar | ✓        |          |         |             |
| `FinType`          | varchar | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.CSI_Email_Change_Tracking → dbo.Syndicate_FPAccounts
  - Confidence: 80%
  - Evidence: Exact column name match: "entadpcompanyid" in both tables
  - Column: `entadpcompanyid` → `EntADPCompanyID`
- **column_match**: dbo.Dim_Entity → dbo.Syndicate_FPAccounts
  - Confidence: 80%
  - Evidence: Exact column name match: "entadpcompanyid" in both tables
  - Column: `EntADPCompanyID` → `EntADPCompanyID`
- **column_match**: dbo.FactFireSummary → dbo.Syndicate_FPAccounts
  - Confidence: 80%
  - Evidence: Exact column name match: "entadpcompanyid" in both tables
  - Column: `EntADPCompanyID` → `EntADPCompanyID`
- **column_match**: dbo.FactFireSummary_update → dbo.Syndicate_FPAccounts
  - Confidence: 80%
  - Evidence: Exact column name match: "entadpcompanyid" in both tables
  - Column: `EntADPCompanyID` → `EntADPCompanyID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
