---
name: vw_GA_WebPerformance_Segments_view
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

CREATE view [dbo].[vw_GA_WebPerformance_Segments_view] as 
select vwGACombinedID,
EntRegion,
EntityKey,
EntDealerLvl1,
EntBrand,
fulldate,
DateKey,
GaSource,
ThirdPartySourceStandard,
GaMedium,
GaSourceMedium,
GaChannelGrouping,
GaCampaign,
GaUser,
GaNewUser,
GaSession,
GaBounce,
GaSessionDuration,
GaAvgSessionDuration,
GaPageViews,
GaPageViewsPerSession,
AllFormSubmit,
FinanceApplication,
PhoneOutcomeSalesCall,
PhoneOutcomeServiceCall,
PhoneOutcomeSalesAppt,
BookTes
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
