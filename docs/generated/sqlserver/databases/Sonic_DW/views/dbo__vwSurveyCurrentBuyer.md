---
name: vwSurveyCurrentBuyer
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




CREATE view [dbo].[vwSurveyCurrentBuyer] as   
SELECT	distinct 
        srvy.ReportingSourceKey
        , srvy.BuyerType
        , srvy.CampaignID  
		, null as comments  
        , -1 as CustomerKey
        , ff.DMSCustomerKey AS CustomerKeyDMS
        , cus.DMSCstNameFirst AS CustomerFirstName
        , cus.DMSCstNameLast AS CustomerLastName 
        , COALESCE(cus.DMSCstHomePhone, cus.DMSCstCellPhone, cus.DMSCstBusinessPhone) AS CustomerPhoneNumber 
        , CASE WHEN cus.
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
