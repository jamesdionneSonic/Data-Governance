---
name: uspLoadDimRMStoreNames
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
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
	PlacesOfficeName,
	BusinessHourType,
	PrimaryWebsite,
	Website,
	[Primary],
	SpecialHoursStartDate,
	OfficeStatus,
	LinkedLuid,
	Type,
	GroupCode,
	ProfileDefinition,
	CreatedDate,
	UpdatedDate,
	Distance,
	Slug,
	IsActive,
	MetaRowLastChangedDate,
	MetaNaturalKey,
	MetaLoadDate,
	MetaComputerName,
	MetaUserId,
	MetaSourceSystemName,
	MetaSrcSysID,
	ETLExecutionID
	)

	select
	b.EntityKey,
	c.RMDepartmentKey,
	a.InternalID,
	a.InternalName,
	a.OptedOut,
	a.IndustryID,
	a.ParentID,
	a.GSRBrand,
	a.ReviewPhone,
	a.Status,
	a.ExternalName,
	a.UTM,
	a.Description,
	a.ShortDescription,
	a.PrimaryCategoryID,
	a.PrimaryCategoryLabel,
	a.CategoryID,
	a.CategoryLabel,
	a.PlacesOfficeName,
	a.BusinessHourType,
	a.PrimaryWebsite,
	a.Website,
	a.[Primary],
	a.SpecialHoursStartDate,
	a.OfficeStatus,
	a.LinkedLuid,
	a.Type,
	a.GroupCode,
	a.ProfileDefinition,
	a.CreatedDate,
	a.UpdatedDate,
	a.Distance,
	a.Slug,
	a.IsActive,
	a.MetaRowLastChangedDate,
	MetaNaturalKey=concat(
				cast(a.locationid as varchar(255))
				,'*',cast(a.company as varchar(255))
				),
	a.MetaLoadDate,
	a.MetaComputerName,
	a.MetaUserId,
	a.MetaSourceSystemName,
	a.MetaSrcSysID,
	a.ETLExecutionID
	from ETL_Staging.stage.StgDimRMStoreNames(nolock) as a
	join Sonic_DW.dbo.DimEntityRelationship(nolock) as b
	on a.LocationID = b.BigintegerField
	and b.RelationshipTypeGuid = @RelationshipTypeGuid
	join Sonic_DW.dbo.DimRMDepartment as c
	on IIF(a.Company='EchoPark','Sales',right(a.Company,len(a.Company)-patindex('%-%',a.Company)-1))  = c.Department;
   COMMIT TRANSACTION
END TRY
BEGIN CATCH
   DECLARE @Message varchar(MAX) = ERROR_MESSAGE(),
        @Severity int = ERROR_SEVERITY(),
        @State smallint = ERROR_STATE();

   RAISERROR (@Message, @Severity, @State)
 ROLLBACK TRANSACTION
END CATCH

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
