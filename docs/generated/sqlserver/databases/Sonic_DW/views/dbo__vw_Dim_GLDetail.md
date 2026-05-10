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
extracted_at: 2026-05-09T12:34:14.349Z
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
                      DetScheduleEndDate, DetScheduleActiveFlag, DetEntryDateKey, DetPostingDateKey, DetAccountingDateKey, LE
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
