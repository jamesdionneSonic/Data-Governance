---
name: trDimEntityEntActiveUpd
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
parent_object: Dim_Entity
tags:
  - trigger
  - auto-extracted
depends_on: []
dependency_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Trigger
- **Schema**: dbo
- **Parent Object**: Dim_Entity

## Definition

```sql

CREATE TRIGGER trDimEntityEntActiveUpd on Dim_Entity
AFTER UPDATE AS
BEGIN
UPDATE	rel
set		rel.IsActive = 0
		, rel.EndDate = SYSDATETIME()
		, rel.UpdatedBy = SYSTEM_USER
		, rel.UpdatedDate = SYSDATETIME()
FROM	Sonic_DW.dbo.DimEntityRelationship AS rel
Where	IsActive = 1
		AND EXISTS (SELECT	1
					FROM	Sonic_DW.dbo.Dim_Entity AS ent
					WHERE	EntActive = 'NotActive'
							AND rel.entityKey = ent.EntityKey
					);
END

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
