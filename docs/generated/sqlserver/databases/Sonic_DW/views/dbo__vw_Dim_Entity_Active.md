---
name: vw_Dim_Entity_Active
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
/*AND (NOT (EntADPCompanyID IN ('581', '582', '583', '584', '585', '586', '587', '588', '589', '590', '591', '592', '593', '594', '595', 
                         '596', '597', '598', '599', '581', '582', '583', '584', '585', '586', '587', '588', '589', '590', '591', '592', '593', '594', '595', '596', '597', '598', '599')))*/
CREATE VIEW dbo.vw_Dim_Entity_Active
AS
SELECT        EntityKey, EntDealerLvl0, EntDealerLvl1, EntDealerLvl2, EntDefaultDlrshpLvl0, EntDefaultDlrshpLvl1, EntDefaultDlrs
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
