---
name: uspLoadRMDimEntityRelationship
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Dim_Entity
  - DimEntityRelationship
  - DimRMDepartment
dependency_count: 3
parameter_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Dim_Entity** (U )
- **dbo.DimEntityRelationship** (U )
- **dbo.DimRMDepartment** (U )

## Parameters

| Name                    | Type     | Output | Default |
| ----------------------- | -------- | ------ | ------- |
| `@RelationshipTypeGuid` | varchar  | No     | No      |
| `@Date`                 | datetime | No     | No      |

## Definition

```sql

CREATE   PROCEDURE [dbo].[uspLoadRMDimEntityRelationship] ( @RelationshipTypeGuid varchar(255), @Date datetime)
AS
BEGIN TRY
 BEGIN TRANSACTION
	BEGIN
		-- For EchoPark dealership
			;with exception as(
			Select distinct locationid from ETL_Staging.stage.StgDimRMStoreNames with (nolock)
			where company like '%EchoPark%' and isactive=1
			except
			select distinct BigIntegerField
			from dbo.DimEntityRelationship with (nolock)
			where RelationshipTypeGuid = @RelationshipTypeGuid
			),
			reqData as(
				select distinct locationid,primarywebsite,company
				from  ETL_Staging.stage.StgDimRMStoreNames with (nolock)
				where isactive = 1
				and locationid in (select locationid from exception)
					)
				insert into dbo.DimEntityRelationship(
					RelationshipTypeGuid,EntityKey,IntegerField,BigIntegerField,AttributeField,[RelationshipGuid],[StartDate],[EndDate],[IsActive],[CreatedDate],[UpdatedDate],[CreatedBy],[UpdatedBy]
				)
				select distinct @RelationshipTypeGuid, ISNULL(e.EntityKey,-1),c.RMDepartmentKey ,rd.locationid,rd.primarywebsite
					,NEWID(), @Date, '2099-12-31', '1', @Date, @Date, SUSER_NAME() , SUSER_NAME()
				from reqData rd
					LEFT join dbo.Dim_Entity e with (nolock)
						on rd.locationid=entsimsstoreid
                    join dbo.DimRMDepartment c with (nolock)
						on IIF(rd.Company='EchoPark','Sales',right(rd.Company,len(rd.Company)-patindex('%-%',rd.Company)-1))  = c.Department
				where e.EntEntityType !='Corporate'
					and e.EntLineOfBusiness in('EchoPark')
					and e.EntActive='Active'
					and e.CurrentPrefixFlag='Active'
					and e.EntDefaultDlrshpLvl1=1


			-- For Sonic dealership
			;with exception as(
			Select distinct primarywebsite from ETL_Staging.stage.StgDimRMStoreNames with (nolock)
			where company not like '%EchoPark%' and isactive=1
			except
			select distinct AttributeField
			from dbo.DimEntityRelationship with (nolock)
			where RelationshipTypeGuid = @RelationshipTypeGuid
			),
			reqData as(
			select distinct b.Org_ID as reqName, a.locationid,
                            a.primarywebsite,a.Company
			from  ETL_Staging.stage.StgDimRMStoreNames(nolock) a
            JOIN [L2-RTSIMSSQL-04 ,12011].[SIMS6200Retail].dbo.Organization b
			ON a.primarywebsite = Replace(replace(b.Web_URL,'//www.','//'),'://','s://www.')
			where a.primarywebsite in (select primarywebsite from exception)

			)
			insert into dbo.DimEntityRelationship(
			RelationshipTypeGuid,EntityKey,IntegerField,BigIntegerField,AttributeField,[RelationshipGuid],[StartDate],[EndDate],[IsActive],[CreatedDate],[UpdatedDate],[CreatedBy],[UpdatedBy]
		)
		select distinct @RelationshipTypeGuid, ISNULL(e.EntityKey,-1),c.RMDepartmentKey ,rd.locationid,rd.primarywebsite
			,NEWID(), @Date, '2099-12-31', '1', @Date, @Date, SUSER_NAME() , SUSER_NAME()
		from reqData rd
			LEFT join dbo.Dim_Entity e with (nolock)
				on rd.reqName=e.EntSIMSStoreID
            join dbo.DimRMDepartment c with (nolock)
				on IIF(rd.Company='EchoPark','Sales',right(rd.Company,len(rd.Company)-patindex('%-%',rd.Company)-1))  = c.Department

		where e.EntEntityType !='Corporate'
			and e.EntLineOfBusiness in('Sonic')
			and e.EntActive='Active'
			and e.CurrentPrefixFlag='Active'
			and e.EntDefaultDlrshpLvl1=1

	UPDATE DER SET
	DER.INTEGERFIELD=b.RMDepartmentKey
	FROM Sonic_DW.dbo.DimEntityRelationship  der
	join etl_staging.stage.StgDimRMStoreNames a
	on der.BigIntegerField=a.LocationID
	and der.RelationshipTypeGuid = @RelationshipTypeGuid
	and a.IsActive=1
	JOIN
	dbo.DimRMDepartment b
	ON IIF(a.Company='EchoPark','Sales',right(a.Company,len(a.Company)-patindex('%-%',a.Company)-1)) =b.Department
END

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
