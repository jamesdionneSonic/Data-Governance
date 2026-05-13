---
name: vw_GA_WebPerformance_Segments
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
column_count: 45
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

| Name                       | Type     | Nullable | Identity | Default | Description |
| -------------------------- | -------- | -------- | -------- | ------- | ----------- |
| `vwGAWebPerfSegID`         | bigint   |          |          |         |             |
| `EntRegion`                | varchar  | ✓        |          |         |             |
| `EntityKey`                | int      | ✓        |          |         |             |
| `EntDealerLvl1`            | varchar  | ✓        |          |         |             |
| `EntBrand`                 | varchar  | ✓        |          |         |             |
| `fulldate`                 | date     | ✓        |          |         |             |
| `DateKey`                  | int      | ✓        |          |         |             |
| `GaSource`                 | nvarchar | ✓        |          |         |             |
| `ThirdPartySourceStandard` | varchar  | ✓        |          |         |             |
| `GaMedium`                 | nvarchar | ✓        |          |         |             |
| `GaSourceMedium`           | nvarchar | ✓        |          |         |             |
| `GaChannelGrouping`        | nvarchar | ✓        |          |         |             |
| `GaCampaign`               | nvarchar | ✓        |          |         |             |
| `GaUser`                   | int      | ✓        |          |         |             |
| `GaNewUser`                | int      | ✓        |          |         |             |
| `GaSession`                | int      | ✓        |          |         |             |
| `GaBounce`                 | decimal  | ✓        |          |         |             |
| `GaSessionDuration`        | decimal  | ✓        |          |         |             |
| `GaAvgSessionDuration`     | decimal  | ✓        |          |         |             |
| `GaPageViews`              | int      | ✓        |          |         |             |
| `GaPageViewsPerSession`    | int      | ✓        |          |         |             |
| `AllFormSubmit`            | int      | ✓        |          |         |             |
| `FinanceApplication`       | int      | ✓        |          |         |             |
| `PhoneOutcomeSalesCall`    | int      | ✓        |          |         |             |
| `PhoneOutcomeServiceCall`  | int      | ✓        |          |         |             |
| `PhoneOutcomeSalesAppt`    | int      | ✓        |          |         |             |
| `BookTestDrive`            | int      | ✓        |          |         |             |
| `VDPViews`                 | int      | ✓        |          |         |             |
| `VLPViews`                 | int      | ✓        |          |         |             |
| `NewVDP`                   | int      | ✓        |          |         |             |
| `UsedVDP`                  | int      | ✓        |          |         |             |
| `ViewedGetDirectionsPage`  | int      | ✓        |          |         |             |
| `DREngage`                 | int      | ✓        |          |         |             |
| `DRComplete`               | int      | ✓        |          |         |             |
| `ValueTradeComplete`       | int      | ✓        |          |         |             |
| `FormSubmissionNew`        | int      | ✓        |          |         |             |
| `FormSubmissionUsed`       | int      | ✓        |          |         |             |
| `XtimeSchedulerEngage`     | int      | ✓        |          |         |             |
| `XtimeSchedulerComplete`   | int      | ✓        |          |         |             |
| `MobileClickToCall`        | int      | ✓        |          |         |             |
| `CarNowChatService`        | int      | ✓        |          |         |             |
| `TimeonPage`               | decimal  | ✓        |          |         |             |
| `PageLoadSample`           | decimal  | ✓        |          |         |             |
| `PageLoadTime`             | decimal  | ✓        |          |         |             |
| `SegmentName`              | varchar  | ✓        |          |         |             |

## Constraints

- **Primary Key**: vw_GA_WebPerformance_SegmentsPK
  - Columns: vwGAWebPerfSegID

## Indexes

- **vw_GA_WebPerformance_SegmentsPK** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: vwGAWebPerfSegID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
