---
name: vwCallidusWealthAssociate_full_min
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql


create view [dbo].[vwCallidusWealthAssociate_full_min] as 

With Dcon as  --Dealership Controller EmployeeNumber from relationship
(select r.entitykey, r.IntegerField 
	from DimEntityRelationshipType t
	join DimEntityRelationship r
	on t.RelationshipTypeGuid = r.RelationshipTypeGuid
	Where t.RelationshipType = 'CallidusControllerID'
--	and r.integerfield = 1149792
	)
,
RCON as  --Regional Controller substitution.  This should be used for controller supervisorID (somehow....)
(sel
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
