---
name: vw_ProrationReport
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - ProrationReport
dependency_count: 1
column_count: 13
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.ProrationReport** (U )

## Columns

| Name                | Type     | Nullable | Description |
| ------------------- | -------- | -------- | ----------- |
| `FileMonth`         | varchar  | ✓        |             |
| `AsoTimeClockID`    | varchar  | ✓        |             |
| `AsoLocation`       | varchar  | ✓        |             |
| `AsoDMS4Digit`      | varchar  | ✓        |             |
| `AsoJobCode`        | varchar  | ✓        |             |
| `AsoecJobtitle`     | varchar  | ✓        |             |
| `AsoEmployeeNumber` | varchar  | ✓        |             |
| `BeginDate`         | varchar  | ✓        |             |
| `EndDate`           | varchar  | ✓        |             |
| `TotDays`           | varchar  | ✓        |             |
| `Available`         | varchar  | ✓        |             |
| `pct`               | varchar  | ✓        |             |
| `Meta_LoadDate`     | datetime | ✓        |             |

## Definition

```sql





create view dbo.vw_ProrationReport as
select * from
[dbo].[ProrationReport]
where AsoJobCode in ('BSASMG','ADGSM','PRTMGR','SLSMGR','SVDIR','SVMGR','UCMGR','OSOEEM','SVLNMGR','OSOEGSM','FODIR','BSMGT','psdir','PSDIR','FIMGR','UCAST','PRTCNTNV','PRTCNT','NCMGR','PRTAMG','BDCCO','ESALESM','INTADV','LPCTR','INVMG','SVSFMV','SVSHFM','SVASMG','ADGM','ADCONT')
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
