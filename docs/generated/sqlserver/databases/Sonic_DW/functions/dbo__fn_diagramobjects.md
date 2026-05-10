---
name: fn_diagramobjects
database: Sonic_DW
type: function
schema: dbo
owner: Data Team
tags:
  - function
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

1- **Type**: user_function
- **Schema**: dbo

## Definition

```sql

	CREATE FUNCTION dbo.fn_diagramobjects() 
	RETURNS int
	WITH EXECUTE AS N'dbo'
	AS
	BEGIN
		declare @id_upgraddiagrams		int
		declare @id_sysdiagrams			int
		declare @id_helpdiagrams		int
		declare @id_helpdiagramdefinition	int
		declare @id_creatediagram	int
		declare @id_renamediagram	int
		declare @id_alterdiagram 	int 
		declare @id_dropdiagram		int
		declare @InstalledObjects	int

		select @InstalledObjects = 0

		select 	@id_upgraddiagrams = object_id(N'dbo.sp_upgraddiag
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
