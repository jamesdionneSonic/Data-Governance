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
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

2- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_MetricAccountXref
AS
SELECT dbo.MetricReport.ReportID, dbo.MetricReportGroup.MetricRptGroupID, dbo.Metric.MetricID, COALESCE (dbo.MetricAccountXref.MetricXrefID, - 1) AS MetricXrefID, COALESCE (dbo.MetricAccountXref.AccountMgmtKey, - 1) AS AccountMgmtKey, 
             dbo.MetricReportGroup.MetricReportSubGroupingID, CAST(dbo.MetricReportGroup.ReportID AS varchar(50)) + '.' + CAST(dbo.MetricReportGroup.MetricRptGroupID AS varchar(50)) + '.' + CAST(dbo.MetricAccountXref.Metr
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
