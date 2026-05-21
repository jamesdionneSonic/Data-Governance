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





create view dbo.vw_ProrationReport as
select * from
[dbo].[ProrationReport]
where AsoJobCode in ('BSASMG','ADGSM','PRTMGR','SLSMGR','SVDIR','SVMGR','UCMGR','OSOEEM','SVLNMGR','OSOEGSM','FODIR','BSMGT','psdir','PSDIR','FIMGR','UCAST','PRTCNTNV','PRTCNT','NCMGR','PRTAMG','BDCCO','ESALESM','INTADV','LPCTR','INVMG','SVSFMV','SVSHFM','SVASMG','ADGM','ADCONT')
```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
