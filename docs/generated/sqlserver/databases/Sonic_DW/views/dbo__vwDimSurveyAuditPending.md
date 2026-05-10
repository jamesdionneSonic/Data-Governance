---
name: vwDimSurveyAuditPending
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

CREATE view dbo.vwDimSurveyAuditPending as (
select	ISNULL(CustomerFirstName,'') as FirstName
		, ISNULL(CustomerLastName,'') as LastName
		, ISNULL(CustomerEmailAddress,'') as Email
		, ISNULL(CustomerPhoneNumber,'') as Phone
		, 'YES' as SMSOptIn
		, 'English' as Language
		, convert(varchar,SurveyAuditKey) as SurveyID
		, case when BuyerType = 'Buyer' then 1 when BuyerType = 'Future Buyer' then 2 else 0 end as EventType
		, ISNULL(IsOnlineSales,'') as IsOnlineSale
		, case when Pu
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
