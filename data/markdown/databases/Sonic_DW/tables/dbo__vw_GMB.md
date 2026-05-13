---
name: vw_GMB
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on: []
row_count: 0
size_kb: 0
column_count: 24
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

| Name                         | Type     | Nullable | Identity | Default | Description |
| ---------------------------- | -------- | -------- | -------- | ------- | ----------- |
| `vwGMBID`                    | bigint   |          |          |         |             |
| `EntRegion`                  | varchar  | ✓        |          |         |             |
| `entitykey`                  | int      | ✓        |          |         |             |
| `entdealerlvl1`              | varchar  | ✓        |          |         |             |
| `entbrand`                   | varchar  | ✓        |          |         |             |
| `relationshiptype`           | nvarchar | ✓        |          |         |             |
| `FullDate`                   | date     | ✓        |          |         |             |
| `DateKey`                    | int      | ✓        |          |         |             |
| `OverallRating`              | float    | ✓        |          |         |             |
| `AccountID`                  | nvarchar | ✓        |          |         |             |
| `LocationID`                 | nvarchar | ✓        |          |         |             |
| `ACTIONS_DRIVING_DIRECTIONS` | int      | ✓        |          |         |             |
| `ACTIONS_PHONE`              | int      | ✓        |          |         |             |
| `ACTIONS_WEBSITE`            | int      | ✓        |          |         |             |
| `LOCAL_POST_VIEWS_SEARCH`    | int      | ✓        |          |         |             |
| `PHOTOS_COUNT_CUSTOMERS`     | int      | ✓        |          |         |             |
| `PHOTOS_COUNT_MERCHANT`      | int      | ✓        |          |         |             |
| `PHOTOS_VIEWS_CUSTOMERS`     | int      | ✓        |          |         |             |
| `PHOTOS_VIEWS_MERCHANT`      | int      | ✓        |          |         |             |
| `QUERIES_CHAIN`              | int      | ✓        |          |         |             |
| `QUERIES_DIRECT`             | int      | ✓        |          |         |             |
| `QUERIES_INDIRECT`           | int      | ✓        |          |         |             |
| `VIEWS_MAPS`                 | int      | ✓        |          |         |             |
| `VIEWS_SEARCH`               | int      | ✓        |          |         |             |

## Constraints

- **Primary Key**: vw_GMBPK
  - Columns: vwGMBID

## Indexes

- **vw_GMBPK** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: vwGMBID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.vw_GMB → dbo.vw_GMB_Service
  - Confidence: 80%
  - Evidence: Exact column name match: "locationid" in both tables
  - Column: `LocationID` → `LocationID`
- **column_match**: dbo.vw_GMB → dbo.vw_GMB_Service
  - Confidence: 80%
  - Evidence: Exact column name match: "accountid" in both tables
  - Column: `AccountID` → `AccountID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
