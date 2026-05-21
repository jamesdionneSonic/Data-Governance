---
name: uspRMUpdateDimEntity
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

CREATE   PROCEDURE dbo.uspRMUpdateDimEntity(@RelationshipTypeGuid varchar(255))
AS
BEGIN TRY
	BEGIN TRANSACTION
		BEGIN
		    update de
			set
			de.SocialMediaInstagram = reqData.SocialMediaInstagram,
			de.SocialMediaYouTube = reqData.SocialMediaYouTube,
			de.SocialMediaFacebook = reqData.SocialMediaFacebook,
			de.SocialMediaTwitter = reqData.SocialMediaTwitter,
			de.TimePeriodsMonday = reqData.TimePeriodsMonday,
			de.TimePeriodsTuesday = reqData.TimePeriodsTuesday,
			de.TimePeriodsWednesday = reqData.TimePeriodsWednesday,
			de.TimePeriodsThursday = reqData.TimePeriodsThursday,
			de.TimePeriodsFriday = reqData.TimePeriodsFriday,
			de.TimePeriodsSaturday = reqData.TimePeriodsSaturday
			from sonic_dw.dbo.Dim_Entity(NOLOCK) as de
			join
			(select distinct
			der.EntityKey,
			dsn.SocialMediaInstagram,
			dsn.SocialMediaYouTube,
			dsn.SocialMediaFacebook,
			dsn.SocialMediaTwitter,
			dsn.TimePeriodsMonday,
			dsn.TimePeriodsTuesday,
			dsn.TimePeriodsWednesday,
			dsn.TimePeriodsThursday,
			dsn.TimePeriodsFriday,
			dsn.TimePeriodsSaturday
			from ETL_Staging.stage.StgDimRMStoreNames(NOLOCK) as dsn
			join Sonic_DW.dbo.DimRMDepartment(NOLOCK) as dct
			on IIF(dsn.Company='EchoPark','Sales',right(dsn.Company,len(dsn.Company)-patindex('%-%',dsn.Company)-1)) = dct.Department and dsn.IsActive = 1 and dct.Department NOT IN ('Service')
			join Sonic_DW.dbo.DimEntityRelationship(NOLOCK) as der
			on dsn.LocationID = der.BigIntegerField and dct.RMDepartmentKey = der.IntegerField
			and der.RelationshipTypeGuid = @RelationshipTypeGuid) as reqData
			on de.EntityKey = reqData.EntityKey
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

- **Last Extracted**: 2026-05-12T12:28:27.721Z
