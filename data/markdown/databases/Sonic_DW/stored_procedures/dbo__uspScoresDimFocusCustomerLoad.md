---
name: uspScoresDimFocusCustomerLoad
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - DimFocusCustomer
dependency_count: 1
parameter_count: 14
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.DimFocusCustomer** (U )

## Parameters

| Name                     | Type      | Output | Default |
| ------------------------ | --------- | ------ | ------- |
| `@Meta_ComputerName`     | varchar   | No     | No      |
| `@MetaSrcSysID`          | int       | No     | No      |
| `@MetaUserID`            | varchar   | No     | No      |
| `@MetaLoadDate`          | datetime2 | No     | No      |
| `@MetaSourceSystemName`  | varchar   | No     | No      |
| `@ETLExecution_ID`       | int       | No     | No      |
| `@Meta_Checksum`         | varchar   | No     | No      |
| `@Meta_RowIsCurrent`     | char      | No     | No      |
| `@MetaRowExpiredDate`    | datetime2 | No     | No      |
| `@MetaRowLastChangeDate` | datetime2 | No     | No      |
| `@MetaRowEffectiveDate`  | datetime2 | No     | No      |
| `@insertedRowCnts`       | int       | Yes    | No      |
| `@updatedRowCnts`        | int       | Yes    | No      |
| `@SrcRwCnt`              | int       | Yes    | No      |

## Definition

```sql




-- select * from etl_staging.dbo.stgDimFocusCustomer
-- select * from sonic_dw.dbo.DimFocusCustomer


--CREATE CLUSTERED INDEX ClusteredIndex_Code on dbo.StgDimFocusCustomer(Code)



-- =============================================
-- Author:        Amrendra Kumar
-- Create date:  01/07/2016
-- Description:   Inserts/Update Customer Dimension records using SCD2
-- =============================================
CREATE PrOCEDURE [dbo].[uspScoresDimFocusCustomerLoad] (
	@Meta_ComputerName VARCHAR(50)
	,@MetaSrcSysID INT
	,@MetaUserID VARCHAR(50)
	,@MetaLoadDate DATETIME2(7)
	,@MetaSourceSystemName VARCHAR(20)
	,@ETLExecution_ID INT
	,@Meta_Checksum VARCHAR(50)
	,@Meta_RowIsCurrent CHAR(1)
	,@MetaRowExpiredDate DATETIME2(7)
	,@MetaRowLastChangeDate DATETIME2(7)
	,@MetaRowEffectiveDate DATETIME2(7)
	,@insertedRowCnts INT OUTPUT
	,@updatedRowCnts INT OUTPUT
	,@SrcRwCnt INT OUTPUT
	)
AS
SET NOCOUNT ON;

DECLARE @rowcounts TABLE (MergeAction VARCHAR(20));
DECLARE @insertedCount INT
	,@updatedCount INT
	,@SecMetaLoadDate DATETIME2(7);

INSERT INTO dbo.DimFocusCustomer(
	FullName
	,CompanyName
	,FirstName
	,MiddleName
	,LastName
	,AddressLine1
	,AddressLine2
	,City
	,[State]
	,PostalCode
	,HomePhone
	,MobilePhone
	,WorkPhone
	,Email1
	,Email2
	,Email3
	,GlobalMasterCode
	,DealerContactID
	,IsSales
	,IsService
	,MaxRecordDate
	,EnterDateTime
	,LastChgDateTime
	,SourceSystemName
	,Meta_LoadDate
	,Meta_RowEffectiveDate
	,Meta_RowExpiredDate
	,Meta_RowLastChangeDate
	,Meta_RowIsCurrent
	,Meta_ComputerName
	,Meta_SourceSystemName
	,Meta_SrcSysId
	,Meta_UserId
	,Meta_Checksum
	,Meta_NaturalKey
	,ETLExecution_Id
)
SELECT FullName
	,CompanyName
	,FirstName
	,MiddleName
	,LastName
	,AddressLine1
	,AddressLine2
	,City
	,[State]
	,PostalCode
	,HomePhone
	,MobilePhone
	,WorkPhone
	,Email1
	,Email2
	,Email3
	,GlobalMasterCode
	,DealerContactID
	,IsSales
	,IsService
	,MaxRecordDate
	,EnterDateTime
	,LastChgDateTime
	,SourceSystemName
	,MetaLoadDate
	,MetaRowEffectiveDate
	,MetaRowExpiredDate
	,MetaRowLastChangeDate
	,MetaRowIsCurrent
	,MetaComputerName
	,MetaSourceSystemName
	,MetaSrcSysID
	,MetaUserId
	,MetaChecksum
	,MetaNaturalKey
	,ETLExecutionId
FROM (
	MERGE dbo.DimFocusCustomer AS tgt
	USING ETL_Staging.dbo.stgDimFocusCustomer AS src
		ON src.Code = tgt.Meta_NaturalKey
			AND tgt.Meta_RowIsCurrent = 'Y'
	WHEN MATCHED
		AND (	-- Type 2 updates
			isnull(SRC.AddressLine1, '') <> isnull(tgt.AddressLine1, '')
			OR isnull(SRC.AddressLine2, '') <> isnull(tgt.AddressLine2, '')
			OR isnull(SRC.City, '') <> isnull(tgt.City, '')
			OR isnull(SRC.[State], '') <> isnull(tgt.[State], '')
			OR isnull(SRC.PostalCode, '') <> isnull(tgt.PostalCode, '')
			OR isnull(SRC.HomePhone, '') <> isnull(tgt.HomePhone, '')
			OR isnull(SRC.MobilePhone, '') <> isnull(tgt.MobilePhone, '')
			OR isnull(SRC.WorkPhone, '') <> isnull(tgt.WorkPhone, '')
			OR isnull(SRC.Email1, '') <> isnull(tgt.Email1, '')
			OR isnull(SRC.Email2, '') <> isnull(tgt.Email2, '')
			OR isnull(SRC.Email3, '') <> isnull(tgt.Email3, '')
			OR isnull(SRC.GlobalMasterCode, '') <> isnull(tgt.GlobalMasterCode, '')
			OR isnull(SRC.DealerContactID, '') <> isnull(tgt.DealerContactID, '')
			OR isnull(SRC.IsSales, '') <> isnull(tgt.IsSales, '')
			OR isnull(SRC.IsService, '') <> isnull(tgt.IsService, '')
			)
		THEN
			UPDATE
			SET tgt.Meta_RowIsCurrent = 'N'
				,tgt.Meta_RowLastChangeDate = @MetaLoadDate
				,tgt.Meta_RowExpiredDate = @MetaRowExpiredDate
				,tgt.ETLExecution_ID = @ETLExecution_ID
	WHEN NOT MATCHED
		THEN
			INSERT (
				FullName
				,CompanyName
				,FirstName
				,MiddleName
				,LastName
				,AddressLine1
				,AddressLine2
				,City
				,[State]
				,PostalCode
				,HomePhone
				,MobilePhone
				,WorkPhone
				,Email1
				,Email2
				,Email3
				,GlobalMasterCode
				,DealerContactID
				,IsSales
				,IsService
				,MaxRecordDate
				,EnterDateTime
				,LastChgDateTime
				,SourceSystemName
				,Meta_LoadDate
				,Meta_RowEffectiveDate
				,Meta_RowExpiredDate
				,Meta_RowLastChangeDate
				,Meta_RowIsCurrent
				,Meta_ComputerName
				,Meta_SourceSystemName
				,Meta_SrcSysId
				,Meta_UserId
				,Meta_Checksum
				,Meta_NaturalKey
				,ETLExecution_Id
				)
			VALUES (
				SRC.FullName
				,SRC.CompanyName
				,SRC.FirstName
				,SRC.MiddleName
				,SRC.LastName
				,SRC.AddressLine1
				,SRC.AddressLine2
				,SRC.City
				,SRC.[State]
				,SRC.PostalCode
				,SRC.HomePhone
				,SRC.MobilePhone
				,SRC.WorkPhone
				,SRC.Email1
				,SRC.Email2
				,SRC.Email3
				,SRC.GlobalMasterCode
				,SRC.DealerContactID
				,SRC.IsSales
				,SRC.IsService
				,SRC.MaxRecordDate
				,SRC.EnterDateTime
				,SRC.LastChgDateTime
				,SRC.SourceSystemName
				,@MetaLoadDate
				,@MetaLoadDate
				,NULL
				,@MetaLoadDate
				,@Meta_RowIsCurrent
				,@Meta_ComputerName
				,@MetaSourceSystemName
				,@MetaSrcSysID
				,@MetaUserID
				,@Meta_Checksum
				,SRC.Code
				,@ETLExecution_ID
				)
	OUTPUT $ACTION Action_Out
		,SRC.FullName
		,SRC.CompanyName
		,SRC.FirstName
		,SRC.MiddleName
		,SRC.LastName
		,SRC.AddressLine1
		,SRC.AddressLine2
		,SRC.City
		,SRC.[State]
		,SRC.PostalCode
		,SRC.HomePhone
		,SRC.MobilePhone
		,SRC.WorkPhone
		,SRC.Email1
		,SRC.Email2
		,SRC.Email3
		,SRC.GlobalMasterCode
		,SRC.DealerContactID
		,SRC.IsSales
		,SRC.IsService
		,SRC.MaxRecordDate
		,SRC.EnterDateTime
		,SRC.LastChgDateTime
		,SRC.SourceSystemName
		,@MetaLoadDate AS MetaLoadDate
		,NULL AS MetaRowExpiredDate
		,@MetaLoadDate AS MetaRowEffectiveDate
		,@MetaLoadDate AS MetaRowLastChangeDate
		,@Meta_RowIsCurrent AS MetaRowIsCurrent
		,@Meta_ComputerName AS MetaComputerName
		,@MetaSourceSystemName AS MetaSourceSystemName
		,@MetaSrcSysID AS MetaSrcSysID
		,@MetaUserID AS MetaUserId
		,@Meta_Checksum AS MetaChecksum
		,SRC.Code AS MetaNaturalKey
		,@ETLExecution_ID AS ETLExecutionId
	) AS MERGE_OUT
WHERE MERGE_OUT.Action_Out = 'UPDATE';

-- type I update
MERGE dbo.DimFocusCustomer AS tgt
USING ETL_Staging.dbo.stgDimFocusCustomer AS src
	ON src.Code = tgt.Meta_NaturalKey
	WHEN MATCHED
		AND (
			 isnull(SRC.FullName, '') <> isnull(tgt.FullName, '')
			 OR isnull(SRC.CompanyName, '') <> isnull(tgt.CompanyName, '')
			 OR isnull(SRC.FirstName, '') <> isnull(tgt.FirstName, '')
			 OR isnull(SRC.MiddleName, '') <> isnull(tgt.MiddleName, '')
			 OR isnull(SRC.LastName, '') <> isnull(tgt.LastName, '')
			)
	THEN UPDATE
		SET tgt.FullName = src.FullName
				,tgt.CompanyName = src.CompanyName
				,tgt.FirstName = src.FirstName
				,tgt.MiddleName = src.MiddleName
				,tgt.LastName = src.LastName
				,tgt.Meta_RowLastChangeDate = @MetaLoadDate
				,tgt.Meta_RowEffectiveDate = @MetaLoadDate
				,tgt.ETLExecution_ID = @ETLExecution_ID;

SELECT @insertedRowCnts = COUNT(*)
FROM dbo.DimFocusCustomer
WHERE Meta_LoadDate = @MetaLoadDate

SELECT @updatedRowCnts = COUNT(*)
FROM dbo.DimFocusCustomer
WHERE Meta_RowLastChangeDate = @MetaLoadDate

SELECT @SrcRwCnt = COUNT(*)
FROM ETl_Staging.dbo.stgDimFocusCustomer









```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
