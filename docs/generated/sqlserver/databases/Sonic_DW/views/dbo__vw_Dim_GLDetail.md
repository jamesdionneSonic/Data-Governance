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
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
