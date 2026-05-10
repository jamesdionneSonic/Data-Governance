---
name: uspLoadDimRMStoreNames
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql
CREATE   PROCEDURE dbo.uspLoadDimRMStoreNames (@RelationshipTypeGuid varchar(255))
AS
BEGIN TRY
 BEGIN TRANSACTION
 TRUNCATE TABLE sonic_dw.dbo.DimRMStoreNames;
	insert into sonic_dw.dbo.DimRMStoreNames
	(
	EntityKey,
	RMDepartmentKey,
	InternalID,
	InternalName,
	OptedOut,
	IndustryID,
	ParentID,
	GSRBrand,
	ReviewPhone,
	Status,
	ExternalName,
	UTM,
	Description,
	ShortDescription,
	PrimaryCategoryID,
	PrimaryCategoryLabel,
	CategoryID,
	CategoryLabel,
	PlacesOfficeNam
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
