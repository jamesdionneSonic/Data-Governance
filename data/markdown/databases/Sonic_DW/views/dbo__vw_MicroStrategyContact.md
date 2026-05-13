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
depends_on:
  - MicroStrategyContact
dependency_count: 1
column_count: 6
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.MicroStrategyContact** (U )

## Columns

| Name                     | Type    | Nullable | Description |
| ------------------------ | ------- | -------- | ----------- |
| `ContactID`              | int     | ✓        |             |
| `EmailAddress`           | varchar | ✓        |             |
| `MSTRMetadataDeviceGUID` | varchar | ✓        |             |
| `MSTRMetadataUserID`     | char    |          |             |
| `Name`                   | varchar | ✓        |             |
| `Personalization`        | varchar | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_MicroStrategyContact
AS
SELECT        dbo.MicroStrategyContact.ContactID, dbo.MicroStrategyContact.EmailAddress, dbo.MicroStrategyContact.MSTRMetadataDeviceGUID, DSSCONTACT.MSTRUSER_ID AS MSTRMetadataUserID, dbo.MicroStrategyContact.Name,
                         dbo.MicroStrategyContact.Personalization
FROM            dbo.MicroStrategyContact INNER JOIN
                         USTRAT.MSMetaData.dbo.DSSCSCONTACT AS DSSCONTACT ON dbo.MicroStrategyContact.Name = DSSCONTACT.LOGIN

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
