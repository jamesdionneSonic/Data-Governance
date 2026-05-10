---
name: vw_MicroStrategyContact
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

1- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_MicroStrategyContact
AS
SELECT        dbo.MicroStrategyContact.ContactID, dbo.MicroStrategyContact.EmailAddress, dbo.MicroStrategyContact.MSTRMetadataDeviceGUID, DSSCONTACT.MSTRUSER_ID AS MSTRMetadataUserID, dbo.MicroStrategyContact.Name, 
                         dbo.MicroStrategyContact.Personalization
FROM            dbo.MicroStrategyContact INNER JOIN
                         USTRAT.MSMetaData.dbo.DSSCSCONTACT AS DSSCONTACT ON dbo.MicroStrategyContact.Name = DSSCONTAC
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
