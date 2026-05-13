---
name: usp_Load_DimAssociate_03272109
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


--****************************************************************** manage employee numbers with multiple current records htat have unique natural keys ***************
/*
-- find employees with multiple records. This means that an employee works at more than one location
select cast(asoEmployeeNumber as int) as asoEmployeeNumber, count(*) as cnt
into #dup		-- select * from #dup		drop table #dup
from dbo.dimAssociate
where Meta_RowIsCurrent = 'Y'
group by cast(asoEmployeeNumber as int)
having count(*) > 1

-- are there multiple records as well in the source data, for those employees in #dup?
select employeeNumber, location
into #sourceDup	-- select * from #sourceDup			-- drop table #sourceDup
from etl_staging.[extract].EmployeeData_HR
where employeeNumber in (select asoEmployeeNumber from #dup)


-- identify those records in DimAssociate that are not in today's source data. These to be treated as type 2 records, NOT additional locations for existing employees
select distinct asoEmployeeNumber, asoLocation
into #type2	-- select * from #type2			-- drop table #type2
from dbo.dimAssociate dup left outer join #SourceDup sdup
	on dup.asoEmployeeNumber = sdup.EmployeeNumber
		and dup.asoLocation = sdup.Location
where sdup.EmployeeNumber is null
	and dup.asoEmployeeNumber in (select asoEmployeeNumber from #dup)

-- mark as not current any record with AsoEmployeeNumber/AsoLocation pair which is not in today's source fie
update ass
	set Meta_RowIsCurrent = 'N',
		Meta_RowExpiredDate = @today
from dbo.dimAssociate ass inner join #type2 dup
	on ass.asoEmployeeNumber = dup.asoEmployeeNumber
		and ass.asoLocation = dup.asoLocation
and ass.Meta_RowIsCurrent = 'Y'
*/
--*******************************************************************

-- return a few counts of interest
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
