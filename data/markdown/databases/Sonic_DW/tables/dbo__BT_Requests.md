---
name: BT_Requests
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
column_count: 10
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
| `BTIssuesKey`          | int      |          | ✓        |         |             |
| `BTKey`                | int      |          |          |         |             |
| `OwnerName`            | nvarchar | ✓        |          |         |             |
| `IssueComment`         | varchar  | ✓        |          |         |             |
| `IssueCompleteDateKey` | int      | ✓        |          |         |             |
| `IssueTicketOpened`    | varchar  | ✓        |          |         |             |
| `IssueTicket`          | nvarchar | ✓        |          |         |             |
| `IssueCategoryID`      | int      | ✓        |          |         |             |
| `IssueResolution`      | varchar  | ✓        |          |         |             |
| `RequesterName`        | varchar  | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_BT_Issues
  - Columns: BTIssuesKey

## Indexes

- **PK_BT_Issues** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: BTIssuesKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **explicit_fk**: dbo.BT_Requests → dbo.BT_RequestsRecord
  - Confidence: 100%
  - Evidence: undefined
  - Column: `BTKey` → `BTKey`
- **column_match**: dbo.BT_Requests → dbo.BT_RequestsCategory
  - Confidence: 80%
  - Evidence: Exact column name match: "issuecategoryid" in both tables
  - Column: `IssueCategoryID` → `IssueCategoryID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
