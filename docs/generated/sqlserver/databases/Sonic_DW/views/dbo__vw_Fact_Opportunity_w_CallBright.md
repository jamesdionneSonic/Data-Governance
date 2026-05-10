---
name: vw_Fact_Opportunity_w_CallBright
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

1- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW [dbo].[vw_Fact_Opportunity_w_CallBright]
AS
SELECT     EntityKey, FiscalMonthD, FiscalYear, MonthNameAbbreviation, MonthNameAbbreviation + ' ' + CAST(FiscalYear AS varchar) AS MonthProspect, FiscalYearMonth, 
                      SUM(PhoneCallCount) AS PhoneCallCount, SUM(SoldCount) AS SoldCount, SUM(ApptSetCount) AS ApptSetCount, SUM(ApptShowCount) AS ApptShowCount, 
                      SUM(ApptSoldCount) AS ApptSoldCount, SUM(UniqueCallCount) AS UniqueCallCount
FROM        
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
