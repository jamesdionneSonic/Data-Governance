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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
