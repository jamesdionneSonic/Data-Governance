---
name: usp_Load_DimAssociate_BK
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


-- =============================================
-- Author:        Umberto Sartori
-- Create date:  04/27/2016
-- Description:   Inserts/Update Associate Dimension records (type 1 and 2)

-- 4/25/2017 - ubs - add code to handle employees with multiple source records.
-- =============================================
CREATE PROCEDURE [dbo].[usp_Load_DimAssociate] (
	@ETLExecutionID INT
	,@insertedRowCnts INT OUTPUT
	,@updatedRowCnts INT OUTPUT
	,@srcRwCnt INT OUTPUT
	)
AS
SET NOCOUNT ON;

DECLARE @insertedCount INT
		,@updatedCount INT;

DECLARE @today datetime, @yesterday datetime;

SET @today = getdate();
SET @yesterday = getdate() - 1;

-- type 2 updates
INSERT INTO dbo.DimAssociate (
		AsoLocation
		,AsoDMS4Digit
		,AsoEmployeeNumber
		,AsoTimeClockID
		,AsoDepartmentCode
		,AsoDepartment
		,AsoDMSGLCode
		,AsoFirstName
		,AsoMiddleName
		,AsoLastName
		,AsoOriginalHireDateKey
		,AsoSeniorityDateKey
		,AsoTerminationDateKey
		,AsoLastHireDateKey
		,AsoEmployeeStatus
		,AsoEmplStatusStartDateKey
		,AsoFullOrPartTime
		,AsoDateInJobKey
		,AsoJobCode
		,AsoJobGroupCode
		,AsoJobFamily
		,AsoecJobtitle
		,AsoSalaryOrHourly
		,AsoSupervisorID
		,AsoSupervisorName
		,AsoActionReason
		,AsoActionReasonDescription
		,AsoTermReason
		,AsoTermReasonDescription
		,AsoChangeReason
		,AsoChangeReasonDescription
		,AsoWorkEmailAddress
		,AsoSystemUpdatedDateTime
		,AsoIsManager
		,AsoWCState
		,AsoTechClass
		,AsoTechDepartment
		,AsoTechLicenseNumber
		,AsoTechTeamLeader
		,AsoTechTeamNumber
		,AsoTechHourlyRate
		,Meta_LoadDate
		,Meta_SrcSysID
		,Meta_SourceSystemName
		,Meta_RowEffectiveDate
		,Meta_RowExpiredDate
		,Meta_RowIsCurrent
		,Meta_RowLastChangedDate
		,Meta_AuditKey
		,Meta_AuditScore
		,Meta_Checksum_Type1
		,Meta_Checksum_Type2
		,[User_ID]
		,Meta_ComputerName
		,Meta_SourceFileName
		,Meta_NaturalKey
		,ETLExecution_ID
        ,AsoWorkCellAreaCode
        ,AsoWorkCellPhone
        ,AsoOrgName
        ,AsoDeptName
        ,AsoRegionCode
        ,AsoRegionName
        ,AsoAssignNo
	    ,AsoLineOfBusiness
	    ,AsoBonusType
	)
SELECT AsoLocation
	,AsoDMS4Digit
	,AsoEmployeeNumber
	,AsoTimeClockID
	,AsoDepartmentCode
	,AsoDepartment
	,AsoDMSGLCode
	,AsoFirstName
	,AsoMiddleName
	,AsoLastName
	,AsoOriginalHireDateKey
	,AsoSeniorityDateKey
	,AsoTerminationDateKey
	,AsoLastHireDateKey
	,AsoEmployeeStatus
	,AsoEmplStatusStartDateKey
	,AsoFullOrPartTime
	,AsoDateInJobKey
	,AsoJobCode
	,AsoJobGroupCode
	,AsoJobFamily
	,AsoecJobtitle
	,AsoSalaryOrHourly
	,AsoSupervisorID
	,AsoSupervisorName
	,AsoActionReason
	,AsoActionReasonDescription
	,AsoTermReason
	,AsoTermReasonDescription
	,AsoChangeReason
	,AsoChangeReasonDescription
	,AsoWorkEmailAddress
	,AsoSystemUpdatedDateTime
	,AsoIsManager
	,AsoWCState
	,AsoTechClass
	,AsoTechDepartment
	,AsoTechLicenseNumber
	,AsoTechTeamLeader
	,AsoTechTeamNumber
	,AsoTechHourlyRate
	,Meta_LoadDate
	,Meta_SrcSysID
	,Meta_SourceSystemName
	,Meta_RowEffectiveDate
	,Meta_RowExpiredDate
	,Meta_RowIsCurrent
	,Meta_RowLastChangedDate
	,Meta_AuditKey
	,Meta_AuditScore
	,Meta_Checksum_Type1
	,Meta_Checksum_Type2
	,[User_ID]
	,Meta_ComputerName
	,Meta_SourceFileName
	,Meta_NaturalKey
	,ETLExecution_ID
    ,AsoWorkCellAreaCode
    ,AsoWorkCellPhone
    ,AsoOrgName
    ,AsoDeptName
    ,AsoRegionCode
    ,AsoRegionName
    ,AsoAssignNo
	,AsoLineOfBusiness
	,AsoBonusType
FROM (
	MERGE dbo.DimAssociate AS tgt
	USING ETL_Staging.clean.DimAssociate AS src
		ON src.AssociateKey = tgt.AssociateKey
			AND src.ETLExecution_ID = @ETLExecutionID
	WHEN MATCHED AND tgt.Meta_Checksum_Type2 <> src.Meta_Checksum_Type2
				 AND tgt.Meta_RowIsCurrent = 'Y'
		THEN
			UPDATE
			-- retire current row
			SET tgt.Meta_RowIsCurrent = 'N'
				,tgt.Meta_RowLastChangedDate = @today
				,tgt.Meta_RowExpiredDate = @today
				,tgt.ETLExecution_ID = @ETLExecutionID
	WHEN NOT MATCHED BY TARGET
		THEN
			INSERT (
				 AsoLocation
				,AsoDMS4Digit
				,AsoEmployeeNumber
				,AsoTimeClockID
				,AsoDepartmentCode
				,AsoDepartment
				,AsoDMSGLCode
				,AsoFirstName
				,AsoMiddleName
				,AsoLastName
				,AsoOriginalHireDateKey
				,AsoSeniorityDateKey
				,AsoTerminationDateKey
				,AsoLastHireDateKey
				,AsoEmployeeStatus
				,AsoEmplStatusStartDateKey
				,AsoFullOrPartTime
				,AsoDateInJobKey
				,AsoJobCode
				,AsoJobGroupCode
				,AsoJobFamily
				,AsoecJobtitle
				,AsoSalaryOrHourly
				,AsoSupervisorID
				,AsoSupervisorName
				,AsoActionReason
				,AsoActionReasonDescription
				,AsoTermReason
				,AsoTermReasonDescription
				,AsoChangeReason
				,AsoChangeReasonDescription
				,AsoWorkEmailAddress
				,AsoSystemUpdatedDateTime
				,AsoIsManager
				,AsoWCState
				,AsoTechClass
				,AsoTechDepartment
				,AsoTechLicenseNumber
				,AsoTechTeamLeader
				,AsoTechTeamNumber
				,AsoTechHourlyRate
				,Meta_LoadDate
				,Meta_SrcSysID
				,Meta_SourceSystemName
				,Meta_RowEffectiveDate
				,Meta_RowExpiredDate
				,Meta_RowIsCurrent
				,Meta_RowLastChangedDate
				,Meta_AuditKey
				,Meta_AuditScore
				,Meta_Checksum_Type1
				,Meta_Checksum_Type2
				,[User_ID]
				,Meta_ComputerName
				,Meta_SourceFileName
				,Meta_NaturalKey
				,ETLExecution_ID
				,AsoWorkCellAreaCode
				,AsoWorkCellPhone
				,AsoOrgName
				,AsoDeptName
				,AsoRegionCode
				,AsoRegionName
				,AsoAssignNo
				,AsoLineOfBusiness
				,AsoBonusType
				)
			VALUES (
				 src.AsoLocation
				,src.AsoDMS4Digit
				,src.AsoEmployeeNumber
				,src.AsoTimeClockID
				,src.AsoDepartmentCode
				,src.AsoDepartment
				,src.AsoDMSGLCode
				,src.AsoFirstName
				,src.AsoMiddleName
				,src.AsoLastName
				,src.AsoOriginalHireDateKey
				,src.AsoSeniorityDateKey
				,src.AsoTerminationDateKey
				,src.AsoLastHireDateKey
				,src.AsoEmployeeStatus
				,src.AsoEmplStatusStartDateKey
				,src.AsoFullOrPartTime
				,src.AsoDateInJobKey
				,src.AsoJobCode
				,src.AsoJobGroupCode
				,src.AsoJobFamily
				,src.AsoecJobtitle
				,src.AsoSalaryOrHourly
				,src.AsoSupervisorID
				,src.AsoSupervisorName
				,src.AsoActionReason
				,src.AsoActionReasonDescription
				,src.AsoTermReason
				,src.AsoTermReasonDescription
				,src.AsoChangeReason
				,src.AsoChangeReasonDescription
				,src.AsoWorkEmailAddress
				,src.AsoSystemUpdatedDateTime
				,src.AsoIsManager
				,src.AsoWCState
				,src.AsoTechClass
				,src.AsoTechDepartment
				,src.AsoTechLicenseNumber
				,src.AsoTechTeamLeader
				,src.AsoTechTeamNumber
				,src.AsoTechHourlyRate
				,src.Meta_LoadDate
				,src.Meta_SrcSysID
				,src.Meta_SourceSystemName
				,src.Meta_RowEffectiveDate
				,src.Meta_RowExpiredDate
				,src.Meta_RowIsCurrent
				,src.Meta_RowLastChangedDate
				,src.Meta_AuditKey
				,src.Meta_AuditScore
				,src.Meta_Checksum_Type1
				,src.Meta_Checksum_Type2
				,src.[User_ID]
				,src.Meta_ComputerName
				,src.Meta_SourceFileName
				,Meta_NaturalKey
				,@ETLExecutionID
				,src.AsoWorkCellAreaCode
				,src.AsoWorkCellPhone
				,src.AsoOrgName
				,src.AsoDeptName
				,src.AsoRegionCode
				,src.AsoRegionName
				,src.AsoAssignNo
				,src.AsoLineOfBusiness
				,src.AsoBonusType
				)
	OUTPUT $ACTION Action_Out
		,src.AsoLocation
		,src.AsoDMS4Digit
		,src.AsoEmployeeNumber
		,src.AsoTimeClockID
		,src.AsoDepartmentCode
		,src.AsoDepartment
		,src.AsoDMSGLCode
		,src.AsoFirstName
		,src.AsoMiddleName
		,src.AsoLastName
		,src.AsoOriginalHireDateKey
		,src.AsoSeniorityDateKey
		,src.AsoTerminationDateKey
		,src.AsoLastHireDateKey
		,src.AsoEmployeeStatus
		,src.AsoEmplStatusStartDateKey
		,src.AsoFullOrPartTime
		,src.AsoDateInJobKey
		,src.AsoJobCode
		,src.AsoJobGroupCode
		,src.AsoJobFamily
		,src.AsoecJobtitle
		,src.AsoSalaryOrHourly
		,src.AsoSupervisorID
		,src.AsoSupervisorName
		,src.AsoActionReason
		,src.AsoActionReasonDescription
		,src.AsoTermReason
		,src.AsoTermReasonDescription
		,src.AsoChangeReason
		,src.AsoChangeReasonDescription
		,src.AsoWorkEmailAddress
		,src.AsoSystemUpdatedDateTime
		,src.AsoIsManager
		,src.AsoWCState
		,src.AsoTechClass
		,src.AsoTechDepartment
		,src.AsoTechLicenseNumber
		,src.AsoTechTeamLeader
		,src.AsoTechTeamNumber
		,src.AsoTechHourlyRate
		,src.Meta_LoadDate
		,src.Meta_SrcSysID
		,src.Meta_SourceSystemName
		,src.Meta_RowEffectiveDate
		,src.Meta_RowExpiredDate
		,src.Meta_RowIsCurrent
		,src.Meta_RowLastChangedDate
		,src.Meta_AuditKey
		,src.Meta_AuditScore
		,src.Meta_Checksum_Type1
		,src.Meta_Checksum_Type2
		,src.[User_ID]
		,src.Meta_ComputerName
		,src.Meta_SourceFileName
		,src.Meta_NaturalKey
		,@ETLExecutionID as ETLExecution_ID
		,src.AsoWorkCellAreaCode
		,src.AsoWorkCellPhone
		,src.AsoOrgName
		,src.AsoDeptName
		,src.AsoRegionCode
		,src.AsoRegionName
		,src.AsoAssignNo
		,src.AsoLineOfBusiness
		,src.AsoBonusType
	) AS MERGE_OUT
WHERE MERGE_OUT.Action_Out = 'UPDATE';

---- type 1 updates
MERGE dbo.DimAssociate as tgt
USING ETL_Staging.clean.DimAssociate as src
	ON tgt.AsoEmployeeNumber = src.AsoEmployeeNumber
		AND tgt.AsoLocation = src.AsoLocation
		AND src.ETLExecution_ID = @ETLExecutionID
WHEN MATCHED AND tgt.Meta_Checksum_Type1 <> src.Meta_Checksum_Type1
	THEN
		UPDATE
		SET tgt.AsoFirstName = src.AsoFirstName
			,tgt.AsoMiddleName = src.AsoMiddleName
			,tgt.AsoLastName = src.AsoLastName
			,tgt.AsoTerminationDateKey = src.AsoTerminationDateKey
			,tgt.AsoTermReason = src.AsoTermReason
			,tgt.AsoTermReasonDescription = src.AsoTermReasonDescription
			,tgt.Meta_RowLastChangedDate = @today
			,tgt.ETLExecution_ID = @ETLExecutionID
			,tgt.Meta_Checksum_Type1 = src.Meta_Checksum_Type1;


---- return a few counts of interest
SELECT @insertedRowCnts = COUNT(*)
FROM dbo.DimAssociate
WHERE Meta_LoadDate = @today

SELECT @updatedRowCnts = COUNT(*)
FROM dbo.DimAssociate
WHERE Meta_RowLastChangedDate = @today

SELECT @SrcRwCnt = COUNT(*)
FROM ETl_Staging.clean.DimAssociate















```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
