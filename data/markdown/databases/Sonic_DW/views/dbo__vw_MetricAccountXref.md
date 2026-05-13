---
name: vw_MetricAccountXref
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_AccountMgmt
  - Metric
  - MetricAccountXref
  - MetricReport
  - MetricReportGroup
  - MetricReportSubGrouping
dependency_count: 6
column_count: 17
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_AccountMgmt** (U )
- **dbo.Metric** (U )
- **dbo.MetricAccountXref** (U )
- **dbo.MetricReport** (U )
- **dbo.MetricReportGroup** (U )
- **dbo.MetricReportSubGrouping** (U )

## Columns

| Name                          | Type    | Nullable | Description |
| ----------------------------- | ------- | -------- | ----------- |
| `ReportID`                    | int     | ✓        |             |
| `MetricRptGroupID`            | int     | ✓        |             |
| `MetricID`                    | int     |          |             |
| `MetricXrefID`                | int     | ✓        |             |
| `AccountMgmtKey`              | int     | ✓        |             |
| `MetricReportSubGroupingID`   | int     | ✓        |             |
| `MetricAccountXrefNaturalKey` | varchar | ✓        |             |
| `SortOrder`                   | int     | ✓        |             |
| `MetricCode`                  | varchar | ✓        |             |
| `MetricName`                  | varchar | ✓        |             |
| `MetricDescription`           | varchar | ✓        |             |
| `MetricType`                  | varchar | ✓        |             |
| `ReportName`                  | varchar | ✓        |             |
| `ReportDescription`           | varchar | ✓        |             |
| `MetricReportSubGroupingDesc` | varchar | ✓        |             |
| `MetricReportSubGroupingSort` | int     | ✓        |             |
| `Level8`                      | varchar | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_MetricAccountXref
AS
SELECT dbo.MetricReport.ReportID, dbo.MetricReportGroup.MetricRptGroupID, dbo.Metric.MetricID, COALESCE (dbo.MetricAccountXref.MetricXrefID, - 1) AS MetricXrefID, COALESCE (dbo.MetricAccountXref.AccountMgmtKey, - 1) AS AccountMgmtKey,
             dbo.MetricReportGroup.MetricReportSubGroupingID, CAST(dbo.MetricReportGroup.ReportID AS varchar(50)) + '.' + CAST(dbo.MetricReportGroup.MetricRptGroupID AS varchar(50)) + '.' + CAST(dbo.MetricAccountXref.MetricXrefID AS varchar(50)) AS MetricAccountXrefNaturalKey,
             dbo.MetricReportGroup.SortOrder, dbo.Metric.MetricCode, dbo.Metric.MetricName, dbo.Metric.MetricDescription, dbo.Metric.MetricType, dbo.MetricReport.ReportName, dbo.MetricReport.ReportDescription, dbo.MetricReportSubGrouping.MetricReportSubGroupingDesc,
             dbo.MetricReportSubGrouping.MetricReportSubGroupingSort, dbo.Dim_AccountMgmt.Level8
FROM   dbo.Dim_AccountMgmt INNER JOIN
             dbo.MetricAccountXref ON dbo.Dim_AccountMgmt.AccountMgmtKey = dbo.MetricAccountXref.AccountMgmtKey RIGHT OUTER JOIN
             dbo.Metric ON dbo.MetricAccountXref.MetricID = dbo.Metric.MetricID LEFT OUTER JOIN
             dbo.MetricReportGroup INNER JOIN
             dbo.MetricReport ON dbo.MetricReportGroup.ReportID = dbo.MetricReport.ReportID INNER JOIN
             dbo.MetricReportSubGrouping ON dbo.MetricReportGroup.MetricReportSubGroupingID = dbo.MetricReportSubGrouping.MetricReportSubGroupingID ON dbo.Metric.MetricID = dbo.MetricReportGroup.MetricID
WHERE (COALESCE (dbo.MetricAccountXref.AccountMgmtKey, - 1) <> - 1)

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
