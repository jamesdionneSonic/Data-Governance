---
name: usp_Load_DimAssociate
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



CREATE PROCEDURE [dbo].[usp_Load_DimAssociate] (
       @ETLExecutionID INT
       ,@insertedRowCnts INT OUTPUT
       ,@updatedRowCnts INT OUTPUT
       ,@srcRwCnt INT OUTPUT
       )
AS
SET NOCOUNT ON;


DECLARE @insertedCount INT;
DECLARE @updatedCount INT;
DECLARE @today datetime = getdate();
DECLARE @yesterday datetime = getdate() -1;

CREATE TABLE #MergeAction (
	MergeAction varchar(20),
	--[AssociateKey] [int] IDENTITY(1,1) NOT NULL,
	[AsoLocation] [int] NOT NULL,
	[AsoLocationFull] [int] NOT NULL,
	[AsoDMS4Digit] [int] NOT NULL,
	[AsoEmployeeNumber] [int] NOT NULL,
	[AsoTimeClockID] [varchar](6) NOT NULL,
	[AsoDepartmentCode] [varchar](4) NOT NULL,
    [AsoDepartment] [varchar](100) NOT NULL,
	[AsoDMSGLCode] [varchar](4) NOT NULL,
	[AsoFirstName] [varchar](50) NOT NULL,
	[AsoMiddleName] [varchar](50) NOT NULL,
	[AsoLastName] [varchar](50) NOT NULL,
	[AsoOriginalHireDateKey] [int] NOT NULL,
	[AsoSeniorityDateKey] [int] NOT NULL,
	[AsoTerminationDateKey] [int] NOT NULL,
	[AsoLastHireDateKey] [int] NOT NULL,
	[AsoEmployeeStatus] [varchar](30) NULL,
	[AsoEmplStatusStartDateKey] [int] NOT NULL,
	[AsoFullOrPartTime] [varchar](40) NULL,
	[AsoDateInJobKey] [int] NOT NULL,
	[AsoJobCode] [varchar](30) NOT NULL,
	[AsoJobGroupCode] [varchar](50) NOT NULL,
	[AsoJobFamily] [varchar](50) NOT NULL,
	[AsoecJobtitle] [varchar](100) NOT NULL,
	[AsoSalaryOrHourly] [char](1) NOT NULL,
	[AsoSupervisorID] [int] NOT NULL,
	[AsoSupervisorName] [varchar](100) NOT NULL,
	[AsoActionReason] [varchar](100) NOT NULL,
	[AsoActionReasonDescription] [varchar](250) NOT NULL,
	[AsoTermReason] [varchar](100) NOT NULL,
	[AsoTermReasonDescription] [varchar](250) NOT NULL,
	[AsoChangeReason] [varchar](100) NOT NULL,
	[AsoChangeReasonDescription] [varchar](250) NOT NULL,
	[AsoWorkEmailAddress] [varchar](250) NOT NULL,
	[AsoSystemUpdatedDateTime] [datetime2](7) NOT NULL,
	[AsoIsManager] [char](1) NOT NULL,
	[AsoWCState] [char](2) NOT NULL,
	[AsoTechClass] [char](1) NOT NULL,
	[AsoTechDepartment] [varchar](18) NOT NULL,
	[AsoTechLicenseNumber] [varchar](10) NOT NULL,
	[AsoTechTeamLeader] [char](1) NOT NULL,
	[AsoTechTeamNumber] [char](1) NOT NULL,
	[AsoTechHourlyRate] [numeric](12,2) NOT NULL,
	[Meta_LoadDate] [datetime] NOT NULL,
	[Meta_SrcSysID] [int] NOT NULL,
	[Meta_SourceSystemName] [varchar](40) NULL,
	[Meta_RowEffectiveDate] [datetime] NOT NULL,
	[Meta_RowExpiredDate] [datetime] NULL,
	[Meta_RowIsCurrent] [char](1) NOT NULL,
	[Meta_RowLastChangedDate] [datetime] NOT NULL,
	[Meta_AuditKey] [int] NULL,
	[Meta_AuditScore] [int] NULL,
	--[Meta_Checksum_Type1] [int] NULL,
	--[Meta_Checksum_Type2] [int] NULL,
	[User_ID] [varchar](50) NOT NULL,
	[Meta_ComputerName] [varchar](50) NOT NULL,
	[Meta_SourceFileName] [varchar](250) NOT NULL,
	[Meta_NaturalKey] [varchar](20) NOT NULL,
	[ETLExecution_ID] [int] NOT NULL,
	[AsoWorkCellAreaCode] [char](3) NULL,
	[AsoWorkCellPhone] [varchar](15) NULL,
	[AsoOrgName] [varchar](50) NULL,
	[AsoDeptName] [varchar](50) NULL,
	[AsoRegionCode] [varchar](25) NULL,
	[AsoRegionName] [varchar](50) NULL,
	[AsoAssignNo] [varchar](50) NULL,
	[AsoLMSID] [bigint] NULL,
	[AsoLineOfBusiness] [varchar](25) NULL,
	[AsoBonusType] [varchar](25) NULL,
	Residence_State varchar(50) null,
	AsoBirthdate varchar(5) null,
	[Generation] VARCHAR(50) NULL----Susan Olapo 09/17/24
	);



MERGE dbo.DimAssociate AS tgt
USING ETL_Staging.clean.DimAssociate AS src
	ON tgt.AsoEmployeeNumber = src.AsoEmployeeNumber
	AND tgt.Meta_RowIsCurrent = 'Y'

	/* end records if values have haved changed */
	WHEN MATCHED AND (
					tgt.[AsoLocation]						!= [src].[AsoLocation]
					or tgt.[AsoLocationFull]				!= [src].[AsoLocationFull]
					OR tgt.[AsoDMS4Digit]					!= [src].[AsoDMS4Digit]
					OR tgt.[AsoEmployeeNumber]				!= [src].[AsoEmployeeNumber]
					OR tgt.[AsoTimeClockID]					!= [src].[AsoTimeClockID]
					OR tgt.[AsoDepartmentCode]				!= [src].[AsoDepartmentCode]
					OR tgt.[AsoDepartment]					!= [src].[AsoDepartment]
					OR tgt.[AsoDMSGLCode]					!= [src].[AsoDMSGLCode]
					OR tgt.[AsoFirstName]					!= [src].[AsoFirstName]
					OR tgt.[AsoMiddleName]					!= [src].[AsoMiddleName]
					OR tgt.[AsoLastName]					!= [src].[AsoLastName]
					OR tgt.[AsoOriginalHireDateKey]			!= [src].[AsoOriginalHireDateKey]
					OR tgt.[AsoSeniorityDateKey]			!= [src].[AsoSeniorityDateKey]
					OR tgt.[AsoTerminationDateKey]			!= [src].[AsoTerminationDateKey]
					OR tgt.[AsoLastHireDateKey]				!= [src].[AsoLastHireDateKey]
					OR ISNULL(tgt.[AsoEmployeeStatus],'')	!= ISNULL([src].[AsoEmployeeStatus],'')
					OR tgt.[AsoEmplStatusStartDateKey]		!= [src].[AsoEmplStatusStartDateKey]
					OR ISNULL(tgt.[AsoFullOrPartTime],'')	!= ISNULL([src].[AsoFullOrPartTime],'')
					OR tgt.[AsoDateInJobKey]				!= [src].[AsoDateInJobKey]
					OR tgt.[AsoJobCode]						!= [src].[AsoJobCode]
					OR tgt.[AsoJobGroupCode]				!= [src].[AsoJobGroupCode]
					OR tgt.[AsoJobFamily]					!= [src].[AsoJobFamily]
					OR tgt.[AsoecJobtitle]					!= [src].[AsoecJobtitle]
					OR tgt.[AsoSalaryOrHourly]				!= [src].[AsoSalaryOrHourly]
					OR tgt.[AsoSupervisorID]				!= [src].[AsoSupervisorID]
					OR tgt.[AsoSupervisorName]				!= [src].[AsoSupervisorName]
					OR tgt.[AsoActionReason]				!= [src].[AsoActionReason]
					OR tgt.[AsoActionReasonDescription]		!= [src].[AsoActionReasonDescription]
					OR tgt.[AsoTermReason]					!= [src].[AsoTermReason]
					OR tgt.[AsoTermReasonDescription]		!= [src].[AsoTermReasonDescription]
					OR tgt.[AsoChangeReason]				!= [src].[AsoChangeReason]
					OR tgt.[AsoChangeReasonDescription]		!= [src].[AsoChangeReasonDescription]
					OR tgt.[AsoWorkEmailAddress]			!= [src].[AsoWorkEmailAddress]
					OR tgt.[AsoSystemUpdatedDateTime]		!= [src].[AsoSystemUpdatedDateTime]
					OR tgt.[AsoIsManager]					!= [src].[AsoIsManager]
					OR tgt.[AsoWCState]						!= [src].[AsoWCState]
					OR tgt.[AsoTechClass]					!= [src].[AsoTechClass]
					OR tgt.[AsoTechDepartment]				!= [src].[AsoTechDepartment]
					OR tgt.[AsoTechLicenseNumber]			!= [src].[AsoTechLicenseNumber]
					OR tgt.[AsoTechTeamLeader]				!= [src].[AsoTechTeamLeader]
					OR tgt.[AsoTechTeamNumber]				!= [src].[AsoTechTeamNumber]
					OR tgt.[AsoTechHourlyRate]				!= [src].[AsoTechHourlyRate]
					--[Meta_LoadDate],
					--[Meta_SrcSysID],
					--[Meta_SourceSystemName],
					--[Meta_RowEffectiveDate],
					--[Meta_RowExpiredDate],
					--[Meta_RowIsCurrent],
					--[Meta_RowLastChangedDate],
					--[Meta_AuditKey],
					--[Meta_AuditScore],
					--[Meta_Checksum_Type1],
					--[Meta_Checksum_Type2],
					--[User_ID],
					--[Meta_ComputerName],
					--[Meta_SourceFileName],
					--[Meta_NaturalKey],
					--[ETLExecution_ID],
					OR ISNULL(tgt.[AsoWorkCellAreaCode],'')		!= ISNULL([src].[AsoWorkCellAreaCode],'')
					OR ISNULL(tgt.[AsoWorkCellPhone],'')		!= ISNULL([src].[AsoWorkCellPhone],'')
					OR ISNULL(tgt.[AsoOrgName],'')				!= ISNULL([src].[AsoOrgName],'')
					OR ISNULL(tgt.[AsoDeptName],'')				!= ISNULL([src].[AsoDeptName],'')
					OR ISNULL(tgt.[AsoRegionCode],'')			!= ISNULL([src].[AsoRegionCode],'')
					OR ISNULL(tgt.[AsoRegionName],'')			!= ISNULL([src].[AsoRegionName],'')
					OR ISNULL(tgt.[AsoAssignNo],'')				!= ISNULL([src].[AsoAssignNo],'')
					--[AsoLMSID],
					OR ISNULL(tgt.[AsoLineOfBusiness],'')		!= ISNULL([src].[AsoLineOfBusiness],'')
					OR ISNULL(tgt.[AsoBonusType],'')			!= ISNULL([src].[AsoBonusType],'')
					or ISNULL(tgt.[AsoResidenceState],'')		!= ISNULL([src].[Residence_State],'')
					OR ISNULL(tgt.[AsoBirthdate],'')			!= ISNULL([src].[AsoBirthdate],'')
					OR ISNULL(tgt.[Generation],'')			    != ISNULL([src].[Generation],'')--Added by Susan Olapo 09/17/24
				)
		THEN UPDATE SET
			tgt.Meta_RowIsCurrent = 'N'
            ,tgt.Meta_RowLastChangedDate = @today
            ,tgt.Meta_RowExpiredDate = @today

	/* write new records */
	WHEN NOT MATCHED THEN  INSERT (
		[AsoLocation],
		[AsoLocationFull],
		[AsoDMS4Digit],
		[AsoEmployeeNumber],
		[AsoTimeClockID],
		[AsoDepartmentCode],
		[AsoDepartment],
		[AsoDMSGLCode],
		[AsoFirstName],
		[AsoMiddleName],
		[AsoLastName],
		[AsoOriginalHireDateKey],
		[AsoSeniorityDateKey],
		[AsoTerminationDateKey],
		[AsoLastHireDateKey],
		[AsoEmployeeStatus],
		[AsoEmplStatusStartDateKey],
		[AsoFullOrPartTime],
		[AsoDateInJobKey],
		[AsoJobCode],
		[AsoJobGroupCode],
		[AsoJobFamily],
		[AsoecJobtitle],
		[AsoSalaryOrHourly],
		[AsoSupervisorID],
		[AsoSupervisorName],
		[AsoActionReason],
		[AsoActionReasonDescription],
		[AsoTermReason],
		[AsoTermReasonDescription],
		[AsoChangeReason],
		[AsoChangeReasonDescription],
		[AsoWorkEmailAddress],
		[AsoSystemUpdatedDateTime],
		[AsoIsManager],
		[AsoWCState],
		[AsoTechClass],
		[AsoTechDepartment],
		[AsoTechLicenseNumber],
		[AsoTechTeamLeader],
		[AsoTechTeamNumber],
		[AsoTechHourlyRate],
		[Meta_LoadDate],
		[Meta_SrcSysID],
		[Meta_SourceSystemName],
		[Meta_RowEffectiveDate],
		[Meta_RowExpiredDate],
		[Meta_RowIsCurrent],
		[Meta_RowLastChangedDate],
		[Meta_AuditKey],
		[Meta_AuditScore],
		--[Meta_Checksum_Type1],
		--[Meta_Checksum_Type2],
		[User_ID],
		[Meta_ComputerName],
		[Meta_SourceFileName],
		[Meta_NaturalKey],
		[ETLExecution_ID],
		[AsoWorkCellAreaCode],
		[AsoWorkCellPhone],
		[AsoOrgName],
		[AsoDeptName],
		[AsoRegionCode],
		[AsoRegionName],
		[AsoAssignNo],
		[AsoLMSID],
		[AsoLineOfBusiness],
		[AsoBonusType],
		[AsoResidenceState],
		[AsoBirthdate],
		[Generation]------------------Added by Susan Olapo 09/17/24
	)
	VALUES (
  			[src].[AsoLocation],
			[src].[AsoLocationFull],
			[src].[AsoDMS4Digit],
			[src].[AsoEmployeeNumber],
			[src].[AsoTimeClockID],
			[src].[AsoDepartmentCode],
			[src].[AsoDepartment],
			[src].[AsoDMSGLCode],
			[src].[AsoFirstName],
			[src].[AsoMiddleName],
			[src].[AsoLastName],
			[src].[AsoOriginalHireDateKey],
			[src].[AsoSeniorityDateKey],
			[src].[AsoTerminationDateKey],
			[src].[AsoLastHireDateKey],
			[src].[AsoEmployeeStatus],
			[src].[AsoEmplStatusStartDateKey],
			[src].[AsoFullOrPartTime],
			[src].[AsoDateInJobKey],
			[src].[AsoJobCode],
			[src].[AsoJobGroupCode],
			[src].[AsoJobFamily],
			[src].[AsoecJobtitle],
			[src].[AsoSalaryOrHourly],
			[src].[AsoSupervisorID],
			[src].[AsoSupervisorName],
			[src].[AsoActionReason],
			[src].[AsoActionReasonDescription],
			[src].[AsoTermReason],
			[src].[AsoTermReasonDescription],
			[src].[AsoChangeReason],
			[src].[AsoChangeReasonDescription],
			[src].[AsoWorkEmailAddress],
			[src].[AsoSystemUpdatedDateTime],
			[src].[AsoIsManager],
			[src].[AsoWCState],
			[src].[AsoTechClass],
			[src].[AsoTechDepartment],
			[src].[AsoTechLicenseNumber],
			[src].[AsoTechTeamLeader],
			[src].[AsoTechTeamNumber],
			[src].[AsoTechHourlyRate],
			[src].[Meta_LoadDate],
			[src].[Meta_SrcSysID],
			[src].[Meta_SourceSystemName],
			[src].[Meta_RowEffectiveDate],
			[src].[Meta_RowExpiredDate],
			'Y', -- [Meta_RowIsCurrent],
			[src].[Meta_RowLastChangedDate],
			[src].[Meta_AuditKey],
			[src].[Meta_AuditScore],
			--[src].[Meta_Checksum_Type1],
			--[src].[Meta_Checksum_Type2],
			[src].[User_ID],
			[src].[Meta_ComputerName],
			[src].[Meta_SourceFileName],
			[src].[Meta_NaturalKey],
			@ETLExecutionID, ---[src].[ETLExecution_ID],
			[src].[AsoWorkCellAreaCode],
			[src].[AsoWorkCellPhone],
			[src].[AsoOrgName],
			[src].[AsoDeptName],
			[src].[AsoRegionCode],
			[src].[AsoRegionName],
			[src].[AsoAssignNo],
			0,	--[AsoLMSID],
			[src].[AsoLineOfBusiness],
			[src].[AsoBonusType],
			[src].[Residence_State],
			[src].[AsoBirthdate],
			[src].[Generation]------------------Added by Susan Olapo 09/17/24
		)
		/* record output */
OUTPUT $action as MergeAction,
		[src].[AsoLocation],
		[src].[AsoLocationFull],
		[src].[AsoDMS4Digit],
		[src].[AsoEmployeeNumber],
		[src].[AsoTimeClockID],
		[src].[AsoDepartmentCode],
		[src].[AsoDepartment],
		[src].[AsoDMSGLCode],
		[src].[AsoFirstName],
		[src].[AsoMiddleName],
		[src].[AsoLastName],
		[src].[AsoOriginalHireDateKey],
		[src].[AsoSeniorityDateKey],
		[src].[AsoTerminationDateKey],
		[src].[AsoLastHireDateKey],
		[src].[AsoEmployeeStatus],
		[src].[AsoEmplStatusStartDateKey],
		[src].[AsoFullOrPartTime],
		[src].[AsoDateInJobKey],
		[src].[AsoJobCode],
		[src].[AsoJobGroupCode],
		[src].[AsoJobFamily],
		[src].[AsoecJobtitle],
		[src].[AsoSalaryOrHourly],
		[src].[AsoSupervisorID],
		[src].[AsoSupervisorName],
		[src].[AsoActionReason],
		[src].[AsoActionReasonDescription],
		[src].[AsoTermReason],
		[src].[AsoTermReasonDescription],
		[src].[AsoChangeReason],
		[src].[AsoChangeReasonDescription],
		[src].[AsoWorkEmailAddress],
		[src].[AsoSystemUpdatedDateTime],
		[src].[AsoIsManager],
		[src].[AsoWCState],
		[src].[AsoTechClass],
		[src].[AsoTechDepartment],
		[src].[AsoTechLicenseNumber],
		[src].[AsoTechTeamLeader],
		[src].[AsoTechTeamNumber],
		[src].[AsoTechHourlyRate],
		[src].[Meta_LoadDate],
		[src].[Meta_SrcSysID],
		[src].[Meta_SourceSystemName],
		[src].[Meta_RowEffectiveDate],
		[src].[Meta_RowExpiredDate],
		'Y' as [Meta_RowIsCurrent],
		[src].[Meta_RowLastChangedDate],
		[src].[Meta_AuditKey],
		[src].[Meta_AuditScore],
		--[src].[Meta_Checksum_Type1],
		--[src].[Meta_Checksum_Type2],
		[src].[User_ID],
		[src].[Meta_ComputerName],
		[src].[Meta_SourceFileName],
		[src].[Meta_NaturalKey],
		@ETLExecutionID AS [ETLExecution_ID],
		[src].[AsoWorkCellAreaCode],
		[src].[AsoWorkCellPhone],
		[src].[AsoOrgName],
		[src].[AsoDeptName],
		[src].[AsoRegionCode],
		[src].[AsoRegionName],
		[src].[AsoAssignNo],
		0 AS [AsoLMSID],
		[src].[AsoLineOfBusiness],
		[src].[AsoBonusType],
		[src].[Residence_State],
		[src].[AsoBirthdate],
		[src].[Generation]------------------Added by Susan Olapo 09/17/24
	INTO #MergeAction;





/****************************************************************************************** */
/*		find LMS ID	& Save it for Insert													*/
/****************************************************************************************** */
UPDATE	temp
SET		temp.AsoLMSID = CASE WHEN dim.AsoLineOfBusiness = temp.AsoLineOfBusiness THEN dim.AsoLMSID ELSE 0 END
--SELECT	*
FROM	dbo.DimAssociate dim
		INNER JOIN #MergeAction AS temp
			ON dim.AsoEmployeeNumber = temp.AsoEmployeeNumber
WHERE	dim.Meta_RowIsCurrent = 'N'
		AND dim.Meta_RowLastChangedDate = @today
		AND temp.MergeAction = 'UPDATE';





/****************************************************************************************** */
/*		Insert Records flagged as Update													*/
/****************************************************************************************** */
INSERT INTO dbo.DimAssociate
(
  --[AssociateKey] [int] IDENTITY(1,1) NOT NULL,
	[AsoLocation],
	[AsoLocationFull],
	[AsoDMS4Digit],
	[AsoEmployeeNumber],
	[AsoTimeClockID],
	[AsoDepartmentCode],
	[AsoDepartment],
	[AsoDMSGLCode],
	[AsoFirstName],
	[AsoMiddleName],
	[AsoLastName],
	[AsoOriginalHireDateKey],
	[AsoSeniorityDateKey],
	[AsoTerminationDateKey],
	[AsoLastHireDateKey],
	[AsoEmployeeStatus],
	[AsoEmplStatusStartDateKey],
	[AsoFullOrPartTime],
	[AsoDateInJobKey],
	[AsoJobCode],
	[AsoJobGroupCode],
	[AsoJobFamily],
	[AsoecJobtitle],
	[AsoSalaryOrHourly],
	[AsoSupervisorID],
	[AsoSupervisorName],
	[AsoActionReason],
	[AsoActionReasonDescription],
	[AsoTermReason],
	[AsoTermReasonDescription],
	[AsoChangeReason],
	[AsoChangeReasonDescription],
	[AsoWorkEmailAddress],
	[AsoSystemUpdatedDateTime],
	[AsoIsManager],
	[AsoWCState],
	[AsoTechClass],
	[AsoTechDepartment],
	[AsoTechLicenseNumber],
	[AsoTechTeamLeader],
	[AsoTechTeamNumber],
	[AsoTechHourlyRate],
	[Meta_LoadDate],
	[Meta_SrcSysID],
	[Meta_SourceSystemName],
	[Meta_RowEffectiveDate],
	[Meta_RowExpiredDate],
	[Meta_RowIsCurrent],
	[Meta_RowLastChangedDate],
	[Meta_AuditKey],
	[Meta_AuditScore],
	--[Meta_Checksum_Type1],
	--[Meta_Checksum_Type2],
	[User_ID],
	[Meta_ComputerName],
	[Meta_SourceFileName],
	[Meta_NaturalKey],
	[ETLExecution_ID],
	[AsoWorkCellAreaCode],
	[AsoWorkCellPhone],
	[AsoOrgName],
	[AsoDeptName],
	[AsoRegionCode],
	[AsoRegionName],
	[AsoAssignNo],
	[AsoLMSID],
	[AsoLineOfBusiness],
	[AsoBonusType],
	[AsoResidenceState],
	[AsoBirthdate],
	[Generation]------------------Added by Susan Olapo 09/17/24
)
/* Insert records that were End Dated Above */
SELECT	[AsoLocation],
		[AsoLocationFull],
		[AsoDMS4Digit],
		[AsoEmployeeNumber],
		[AsoTimeClockID],
		[AsoDepartmentCode],
		[AsoDepartment],
		[AsoDMSGLCode],
		[AsoFirstName],
		[AsoMiddleName],
		[AsoLastName],
		[AsoOriginalHireDateKey],
		[AsoSeniorityDateKey],
		[AsoTerminationDateKey],
		[AsoLastHireDateKey],
		[AsoEmployeeStatus],
		[AsoEmplStatusStartDateKey],
		[AsoFullOrPartTime],
		[AsoDateInJobKey],
		[AsoJobCode],
		[AsoJobGroupCode],
		[AsoJobFamily],
		[AsoecJobtitle],
		[AsoSalaryOrHourly],
		[AsoSupervisorID],
		[AsoSupervisorName],
		[AsoActionReason],
		[AsoActionReasonDescription],
		[AsoTermReason],
		[AsoTermReasonDescription],
		[AsoChangeReason],
		[AsoChangeReasonDescription],
		[AsoWorkEmailAddress],
		[AsoSystemUpdatedDateTime],
		[AsoIsManager],
		[AsoWCState],
		[AsoTechClass],
		[AsoTechDepartment],
		[AsoTechLicenseNumber],
		[AsoTechTeamLeader],
		[AsoTechTeamNumber],
		[AsoTechHourlyRate],
		[Meta_LoadDate],
		[Meta_SrcSysID],
		[Meta_SourceSystemName],
		[Meta_RowEffectiveDate],
		[Meta_RowExpiredDate],
		[Meta_RowIsCurrent],
		[Meta_RowLastChangedDate],
		[Meta_AuditKey],
		[Meta_AuditScore],
		--[Meta_Checksum_Type1],
		--[Meta_Checksum_Type2],
		[User_ID],
		[Meta_ComputerName],
		[Meta_SourceFileName],
		[Meta_NaturalKey],
		[ETLExecution_ID],
		[AsoWorkCellAreaCode],
		[AsoWorkCellPhone],
		[AsoOrgName],
		[AsoDeptName],
		[AsoRegionCode],
		[AsoRegionName],
		[AsoAssignNo],
		[AsoLMSID],
		[AsoLineOfBusiness],
		[AsoBonusType],
		[Residence_State],
		[AsoBirthdate],
		[Generation]------------------Added by Susan Olapo 09/17/24
FROM	#MergeAction
where	MergeAction='UPDATE';



/* record counts */
SELECT	@insertedRowCnts = COUNT(*)
FROM	#mergeAction
WHERE	MergeAction = 'INSERT';

SELECT	@updatedRowCnts = COUNT(*)
FROM	#mergeAction
WHERE	MergeAction = 'UPDATE';

SELECT	@SrcRwCnt = COUNT(*)
FROM	ETl_Staging.clean.DimAssociate;

/* cleanup */
DROP TABLE #mergeAction;


/* API ignores -1 LMS ID's - reset to 0 if Employee Status goes Active */
Update	DimAssociate
Set		AsoLMSID = 0
Where	Meta_RowIsCurrent = 'Y'
		AND AsoLMSID = -1
		AND AsoEmployeeStatus = 'Active'
;



```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
