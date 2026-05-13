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
depends_on:
  - vw_GA_Combined
  - vw_GA_Service_Combined
  - vw_GA_Social_Combined
dependency_count: 3
column_count: 45
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.vw_GA_Combined** (U )
- **dbo.vw_GA_Service_Combined** (U )
- **dbo.vw_GA_Social_Combined** (U )

## Columns

| Name                       | Type     | Nullable | Description |
| -------------------------- | -------- | -------- | ----------- |
| `vwGACombinedID`           | bigint   |          |             |
| `EntRegion`                | varchar  | ✓        |             |
| `EntityKey`                | int      | ✓        |             |
| `EntDealerLvl1`            | varchar  | ✓        |             |
| `EntBrand`                 | varchar  | ✓        |             |
| `fulldate`                 | date     | ✓        |             |
| `DateKey`                  | int      | ✓        |             |
| `GaSource`                 | nvarchar | ✓        |             |
| `ThirdPartySourceStandard` | varchar  | ✓        |             |
| `GaMedium`                 | nvarchar | ✓        |             |
| `GaSourceMedium`           | nvarchar | ✓        |             |
| `GaChannelGrouping`        | nvarchar | ✓        |             |
| `GaCampaign`               | nvarchar | ✓        |             |
| `GaUser`                   | int      | ✓        |             |
| `GaNewUser`                | int      | ✓        |             |
| `GaSession`                | int      | ✓        |             |
| `GaBounce`                 | decimal  | ✓        |             |
| `GaSessionDuration`        | decimal  | ✓        |             |
| `GaAvgSessionDuration`     | decimal  | ✓        |             |
| `GaPageViews`              | int      | ✓        |             |
| `GaPageViewsPerSession`    | int      | ✓        |             |
| `AllFormSubmit`            | int      | ✓        |             |
| `FinanceApplication`       | int      | ✓        |             |
| `PhoneOutcomeSalesCall`    | int      | ✓        |             |
| `PhoneOutcomeServiceCall`  | int      | ✓        |             |
| `PhoneOutcomeSalesAppt`    | int      | ✓        |             |
| `BookTestDrive`            | int      | ✓        |             |
| `VDPViews`                 | int      | ✓        |             |
| `VLPViews`                 | int      | ✓        |             |
| `NewVDP`                   | int      | ✓        |             |
| `UsedVDP`                  | int      | ✓        |             |
| `ViewedGetDirectionsPage`  | int      | ✓        |             |
| `DREngage`                 | int      | ✓        |             |
| `DRComplete`               | int      | ✓        |             |
| `ValueTradeComplete`       | int      | ✓        |             |
| `FormSubmissionNew`        | int      | ✓        |             |
| `FormSubmissionUsed`       | int      | ✓        |             |
| `XtimeSchedulerEngage`     | int      | ✓        |             |
| `XtimeSchedulerComplete`   | int      | ✓        |             |
| `MobileClickToCall`        | int      | ✓        |             |
| `CarNowChatService`        | int      | ✓        |             |
| `TimeonPage`               | decimal  | ✓        |             |
| `PageLoadSample`           | decimal  | ✓        |             |
| `PageLoadTime`             | decimal  | ✓        |             |
| `SegmentName`              | varchar  |          |             |

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
BookTestDrive,
VDPViews,
VLPViews,
NewVDP,
UsedVDP,
ViewedGetDirectionsPage,
DREngage,
DRComplete,
ValueTradeComplete,
FormSubmissionNew,
FormSubmissionUsed,
XtimeSchedulerEngage,
XtimeSchedulerComplete,
MobileClickToCall,
CarNowChatService,
TimeonPage,
PageLoadSample,
PageLoadTime,
'Combined GA' AS SegmentName from [dbo].[vw_GA_Combined]
UNION ALL
select vwGAServiceCombinedID,
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
NULL AS GaPageViewsPerSession,
AllFormSubmit,
NULL AS FinanceApplication,
NULL AS PhoneOutcomeSalesCall,
NULL AS PhoneOutcomeServiceCall,
NULL AS PhoneOutcomeSalesAppt,
NULL AS BookTestDrive,
VDPViews,
VLPViews,
NULL AS NewVDP,
NULL AS UsedVDP,
NULL AS ViewedGetDirectionsPage,
DREngage,
DRComplete,
ValueTradeComplete,
NULL AS FormSubmissionNew,
NULL AS FormSubmissionUsed,
XtimeScheduledEngage,
XtimeScheduledComplete,
MobileClickToCall,
CarNowChatService,
TimeonPage,
PageLoadSample,
PageLoadTime,
'Service' as SegmentName
from [dbo].[vw_GA_Service_Combined]
UNION ALL
select vwGASocialCombinedID,
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
NULL AS GaPageViewsPerSession,
AllFormSubmit,
NULL AS FinanceApplication,
NULL AS PhoneOutcomeSalesCall,
NULL AS PhoneOutcomeServiceCall,
NULL AS PhoneOutcomeSalesAppt,
NULL AS BookTestDrive,
VDPViews,
VLPViews,
NULL AS NewVDP,
NULL AS UsedVDP,
NULL AS ViewedGetDirectionsPage,
DREngage,
DRComplete,
ValueTradeComplete,
NULL AS FormSubmissionNew,
NULL AS FormSubmissionUsed,
XtimeSchedulerEngage,
XtimeSchedulerComplete,
MobileClickToCall,
CarNowChatService,
TimeonPage,
PageLoadSample,
PageLoadTime,
'Social' as SegmentName
from [dbo].[vw_GA_Social_Combined]


```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
