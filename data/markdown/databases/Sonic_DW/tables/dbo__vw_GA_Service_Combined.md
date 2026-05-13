---
name: vw_GA_Service_Combined
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
column_count: 33
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
| `vwGAServiceCombinedID`    | bigint   |          |          |         |             |
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
| `GaBounce`                 | int      | ✓        |          |         |             |
| `GaSessionDuration`        | decimal  | ✓        |          |         |             |
| `GaAvgSessionDuration`     | decimal  | ✓        |          |         |             |
| `GaPageViews`              | int      | ✓        |          |         |             |
| `AllFormSubmit`            | int      | ✓        |          |         |             |
| `VDPViews`                 | int      | ✓        |          |         |             |
| `VLPViews`                 | int      | ✓        |          |         |             |
| `DREngage`                 | int      | ✓        |          |         |             |
| `DRComplete`               | int      | ✓        |          |         |             |
| `ValueTradeComplete`       | int      | ✓        |          |         |             |
| `XtimeScheduledEngage`     | int      | ✓        |          |         |             |
| `XtimeScheduledComplete`   | int      | ✓        |          |         |             |
| `MobileClickToCall`        | int      | ✓        |          |         |             |
| `CarNowChatService`        | int      | ✓        |          |         |             |
| `TimeonPage`               | decimal  | ✓        |          |         |             |
| `PageLoadSample`           | decimal  | ✓        |          |         |             |
| `PageLoadTime`             | decimal  | ✓        |          |         |             |

## Constraints

- **Primary Key**: vw_GA_Service_CombinedPK
  - Columns: vwGAServiceCombinedID

## Indexes

- **vw_GA_Service_CombinedPK** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: vwGAServiceCombinedID ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
