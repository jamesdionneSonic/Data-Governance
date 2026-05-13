---
name: temp1
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - GLDetail_ MissingAcctInfo
  - SalesTranAso_FI_Chargeback
  - SalesTranAso_FI_ChargebackFinal
  - temp
  - temp
row_count: 0
size_kb: 0
column_count: 9
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

| Name                  | Type    | Nullable | Identity | Default | Description |
| --------------------- | ------- | -------- | -------- | ------- | ----------- |
| `CalendarYearMonth`   | varchar | ✓        |          |         |             |
| `EntCompanyid`        | int     | ✓        |          |         |             |
| `EntPrefix`           | int     | ✓        |          |         |             |
| `Dealership`          | varchar | ✓        |          |         |             |
| `FranchiseBrand`      | varchar | ✓        |          |         |             |
| `TimeClockID`         | varchar | ✓        |          |         |             |
| `Chargebacks_Under90` | numeric | ✓        |          |         |             |
| `Chargebacks_Over90`  | numeric | ✓        |          |         |             |
| `Chargebacks_Total`   | numeric | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.GLDetail\_ MissingAcctInfo → dbo.temp1
  - Confidence: 80%
  - Evidence: Exact column name match: "timeclockid" in both tables
  - Column: `TimeClockID` → `TimeClockID`
- **column_match**: dbo.SalesTranAso_FI_Chargeback → dbo.temp1
  - Confidence: 80%
  - Evidence: Exact column name match: "timeclockid" in both tables
  - Column: `TimeClockID` → `TimeClockID`
- **column_match**: dbo.SalesTranAso_FI_ChargebackFinal → dbo.temp1
  - Confidence: 80%
  - Evidence: Exact column name match: "timeclockid" in both tables
  - Column: `TimeClockID` → `TimeClockID`
- **column_match**: dbo.temp → dbo.temp1
  - Confidence: 80%
  - Evidence: Exact column name match: "timeclockid" in both tables
  - Column: `TimeClockID` → `TimeClockID`
- **column_match**: dbo.temp → dbo.temp1
  - Confidence: 80%
  - Evidence: Exact column name match: "entcompanyid" in both tables
  - Column: `EntCompanyid` → `EntCompanyid`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
