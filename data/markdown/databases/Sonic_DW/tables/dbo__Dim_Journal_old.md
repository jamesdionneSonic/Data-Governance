---
name: Dim_Journal_old
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - dimension
  - core-schema
depends_on:
  - Dim_Journal
  - Dim_Journal
row_count: 0
size_kb: 0
column_count: 13
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

| Name                   | Type     | Nullable | Identity | Default | Description |
| ---------------------- | -------- | -------- | -------- | ------- | ----------- |
| `JournalKey`           | int      |          | ✓        |         |             |
| `JrnJournalid`         | varchar  | ✓        |          |         |             |
| `JrnJournalName`       | varchar  | ✓        |          |         |             |
| `JrnStandardJournalID` | varchar  | ✓        |          |         |             |
| `JrnStandardName`      | varchar  | ✓        |          |         |             |
| `JrnJournalType`       | varchar  | ✓        |          |         |             |
| `JrnJournalTypeDesc`   | varchar  | ✓        |          |         |             |
| `JrnInterCompanyFlg`   | varchar  | ✓        |          |         |             |
| `JrnBeginDate`         | datetime | ✓        |          |         |             |
| `JrnEndDate`           | datetime | ✓        |          |         |             |
| `JrnIsCurrent`         | bit      | ✓        |          |         |             |
| `JrnEffectiveDate`     | datetime | ✓        |          |         |             |
| `JrnExpiredDate`       | datetime | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK13
  - Columns: JournalKey

## Indexes

- **PK13** (NONCLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: JournalKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.Dim_Journal → dbo.Dim_Journal_old
  - Confidence: 80%
  - Evidence: Exact column name match: "jrnjournalid" in both tables
  - Column: `JrnJournalid` → `JrnJournalid`
- **column_match**: dbo.Dim_Journal → dbo.Dim_Journal_old
  - Confidence: 80%
  - Evidence: Exact column name match: "jrnstandardjournalid" in both tables
  - Column: `JrnStandardJournalID` → `JrnStandardJournalID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
