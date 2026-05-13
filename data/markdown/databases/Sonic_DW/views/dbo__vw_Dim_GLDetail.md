---
name: vw_Dim_GLDetail
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_GLDetail
dependency_count: 1
column_count: 23
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_GLDetail** (U )

## Columns

| Name                       | Type     | Nullable | Description |
| -------------------------- | -------- | -------- | ----------- |
| `DetailKey`                | int      |          |             |
| `DetCora_Acct_ID`          | int      | ✓        |             |
| `DetHostitemID`            | varchar  | ✓        |             |
| `DetCompanyID`             | varchar  | ✓        |             |
| `DetShortHostItemID`       | varchar  | ✓        |             |
| `DetJournalID`             | varchar  | ✓        |             |
| `DetAccountNumber`         | varchar  | ✓        |             |
| `DetHeaderDescription`     | varchar  | ✓        |             |
| `DetPostingTime`           | int      | ✓        |             |
| `DetPostingSequence`       | int      | ✓        |             |
| `DetDetailDescription`     | varchar  | ✓        |             |
| `DetControlType`           | varchar  | ✓        |             |
| `DetControl`               | varchar  | ✓        |             |
| `DetControl2`              | varchar  | ✓        |             |
| `DetReferenceNumber`       | varchar  | ✓        |             |
| `DetVoidDocumentFlag`      | bit      | ✓        |             |
| `DetScheduleStartDate`     | datetime | ✓        |             |
| `DetScheduleEndDate`       | datetime | ✓        |             |
| `DetScheduleActiveFlag`    | bit      | ✓        |             |
| `DetEntryDateKey`          | int      | ✓        |             |
| `DetPostingDateKey`        | int      | ✓        |             |
| `DetAccountingDateKey`     | int      | ✓        |             |
| `DetReferenceNumberPrefix` | varchar  | ✓        |             |

## Definition

```sql


CREATE VIEW [dbo].[vw_Dim_GLDetail]
AS
SELECT     DetailKey, DetCora_Acct_ID, DetHostitemID, DetCompanyID, DetShortHostItemID, DetJournalID, DetAccountNumber, DetHeaderDescription, DetPostingTime,
                      DetPostingSequence, DetDetailDescription, DetControlType, DetControl, DetControl2, DetReferenceNumber, DetVoidDocumentFlag, DetScheduleStartDate,
                      DetScheduleEndDate, DetScheduleActiveFlag, DetEntryDateKey, DetPostingDateKey, DetAccountingDateKey, LEFT(DetReferenceNumber, 1)
                      AS DetReferenceNumberPrefix
FROM         dbo.Dim_GLDetail



```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
