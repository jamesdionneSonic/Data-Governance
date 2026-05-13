---
name: usp_Update_DimAssociate
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


CREATE PROCEDURE [dbo].[usp_Update_DimAssociate] (
       @ETLExecutionID INT
       ,@insertCount INT OUTPUT
       ,@updateCount INT OUTPUT
       ,@rowCount INT OUTPUT
       )
AS


DECLARE @missingKeys as table(associateKey int not null);
DECLARE @today datetime = getdate();
DECLARE @sourceFile varchar(250) = (select top 1 Meta_SourceFileName
								from ETL_Staging.extract.EmployeeData_HR);

/* Identify records in DimAssociate but not in source file */
insert into @missingKeys
select	tgt.associatekey
from	Sonic_DW.dbo.DimAssociate tgt
        left join ETL_Staging.extract.EmployeeData_HR stg
			on tgt.AsoEmployeeNumber = stg.EmployeeNumber
where  tgt.Meta_RowIsCurrent = 'Y'
       and tgt.AsoEmployeeStatus not in ('Inactive - Terminated','Terminated')
       and stg.EmployeeNumber is null
;
Select @rowCount = @@ROWCOUNT;


/* End Date Identified rows */
update	DimAssociate
set		Meta_RowIsCurrent = 'N'
		, Meta_RowLastChangedDate = @today
        , Meta_RowExpiredDate = @today
where	associateKey in (select associateKey from @missingKeys)
;
Select @updateCount = @@ROWCOUNT;


/* Rewrite Identified Rows flagged as "Not On File" */
insert	into DimAssociate
(	--[AssociateKey] [int] IDENTITY(1,1) NOT NULL,
	  [AsoChangeReason]
	, [AsoChangeReasonDescription]
	, [AsoEmployeeStatus]
	, [AsoTerminationDateKey]
	, [ETLExecution_ID]
	, [Meta_ComputerName]
	, [Meta_RowExpiredDate]
	, [Meta_LoadDate]
	, [Meta_RowIsCurrent]
	, [Meta_SourceFileName]
	, [User_ID]
	, [AsoLocation],			[AsoDMS4Digit],				[AsoEmployeeNumber],	[AsoTimeClockID],				[AsoDepartmentCode]
	, [AsoDepartment],			[AsoDMSGLCode],				[AsoFirstName],			[AsoMiddleName],				[AsoLastName]
	, [AsoOriginalHireDateKey], [AsoSeniorityDateKey],		[AsoLastHireDateKey], 	[AsoEmplStatusStartDateKey],	[AsoFullOrPartTime]
	, [AsoDateInJobKey],		[AsoJobCode],				[AsoJobGroupCode],		[AsoJobFamily],					[AsoecJobtitle]
	, [AsoSalaryOrHourly],		[AsoSupervisorID],			[AsoSupervisorName],	[AsoActionReason],				[AsoActionReasonDescription]
	, [AsoTermReason],			[AsoTermReasonDescription],	[AsoWorkEmailAddress],	[AsoSystemUpdatedDateTime],		[AsoIsManager]
	, [AsoWCState],				[AsoTechClass],				[AsoTechDepartment],	[AsoTechLicenseNumber],			[AsoTechTeamLeader]
	, [AsoTechTeamNumber],		[AsoTechHourlyRate],		[Meta_SrcSysID],		[Meta_SourceSystemName],		[Meta_RowEffectiveDate]
	, [Meta_RowLastChangedDate],[Meta_NaturalKey],			[AsoWorkCellAreaCode],	[AsoWorkCellPhone],				[AsoOrgName]
	, [AsoDeptName],			[AsoRegionCode],			[AsoRegionName],		[AsoAssignNo],					[AsoLMSID]
	, [AsoLineOfBusiness],		[AsoBonusType],				[AsoResidenceState],	[AsoBirthdate]
	, [AsoLocationFull],
	[Generation]------------------Added by Susan Olapo 09/17/24
)
select
	  'NOT ON FILE' AS [AsoChangeReason]
	, 'NOT FOUND IN CURRENT HR FILE' AS [AsoChangeReasonDescription]
	, 'Inactive - Terminated' AS [AsoEmployeeStatus]
	, 99991231 AS [AsoTerminationDateKey]
	, @ETLExecutionID AS [ETLExecution_ID]
	, Host_Name() AS [Meta_ComputerName]
	, null AS [Meta_RowExpiredDate]
	, @today AS [Meta_LoadDate]
	, 'Y' AS [Meta_RowIsCurrent]
	, @sourceFile AS [Meta_SourceFileName]
	, system_user [User_ID]
	, [AsoLocation],			[AsoDMS4Digit],				[AsoEmployeeNumber],	[AsoTimeClockID],				[AsoDepartmentCode]
	, [AsoDepartment],			[AsoDMSGLCode],				[AsoFirstName],			[AsoMiddleName],				[AsoLastName]
	, [AsoOriginalHireDateKey], [AsoSeniorityDateKey],		[AsoLastHireDateKey], 	[AsoEmplStatusStartDateKey],	[AsoFullOrPartTime]
	, [AsoDateInJobKey],		[AsoJobCode],				[AsoJobGroupCode],		[AsoJobFamily],					[AsoecJobtitle]
	, [AsoSalaryOrHourly],		[AsoSupervisorID],			[AsoSupervisorName],	[AsoActionReason],				[AsoActionReasonDescription]
	, [AsoTermReason],			[AsoTermReasonDescription],	[AsoWorkEmailAddress],	[AsoSystemUpdatedDateTime],		[AsoIsManager]
	, [AsoWCState],				[AsoTechClass],				[AsoTechDepartment],	[AsoTechLicenseNumber],			[AsoTechTeamLeader]
	, [AsoTechTeamNumber],		[AsoTechHourlyRate],		[Meta_SrcSysID],		[Meta_SourceSystemName],		[Meta_RowEffectiveDate]
	, [Meta_RowLastChangedDate],[Meta_NaturalKey],			[AsoWorkCellAreaCode],	[AsoWorkCellPhone],				[AsoOrgName]
	, [AsoDeptName],			[AsoRegionCode],			[AsoRegionName],		[AsoAssignNo],					[AsoLMSID]
	, [AsoLineOfBusiness],		[AsoBonusType],				[AsoResidenceState],	[AsoBirthdate]
	, [AsoLocationFull],
	[Generation]------------------Added by Susan Olapo 09/17/24
from	DimAssociate tgt
		inner join @missingKeys src
			on tgt.associatekey = src.associatekey
;

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
