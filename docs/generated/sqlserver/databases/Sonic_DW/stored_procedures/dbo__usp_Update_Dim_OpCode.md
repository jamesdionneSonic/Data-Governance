---
name: usp_Update_Dim_OpCode
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



CREATE PROCEDURE [dbo].[usp_Update_Dim_OpCode]
@OpCodeKey int,
@UserName varchar(20),
@OpCodeCategory varchar(50),
@Menu varchar(50),
@Other varchar(50),
@Weight int

AS
--
-- ============================================================================
-- Module:  usp_Update_Dim_OpCode
-- Author:  Roger Williams
--   Date:  09/29/2011
--
-- Description:
--   Update Dim_OpCode
--
-- Dependencies:
--   dbo.Dim_OpCode
--
-- Revisions:
-- Date        Name             Description
-- ---------------------------------------------------------------------------
-- 09/29/2011  Roger Williams   Initial creation
-- 09/11/2012	Owen McPeak	Pulled the transactional columns out to a new table Dim_OpCode_Transact
-- ============================================================================
--
-- Sets
--
SET NOCOUNT ON

--
-- Declarations
--
declare @Cora int
declare @OpCode varchar(50)
--
-- Initializations
--


---------------------------------------------------------
--  Added 20120911 odmcpeak
-- Get Natural Key from Surrogate
select
	@Cora=OpcCoraAcctID,
	@OpCode=OpcOpCode
from
	Dim_OpCode
where
	OpCodeKey = @OpCodeKey

--
-- **************************************
-- Processing
-- **************************************
--
-- Update Dim_OpCode
--
BEGIN TRY
	--SELECT * FROM dbo.Dim_OpCode
	UPDATE dbo.Dim_OpCode_Transact
	SET OpcOpCodeCategory = CASE WHEN @OpCodeCategory = 'UKN' THEN NULL ELSE @OpCodeCategory END,
		OpcMenu = CASE WHEN @Menu = 'UKN' THEN 'NA' ELSE @Menu END,
		OpcOther = CASE WHEN @Other = 'UKN' THEN 'NA' ELSE @Other END,
		OpcWeight = CASE WHEN @Weight < 1 THEN 1 ELSE @Weight END,
		Meta_RowLastChangedDate = GETDATE(),
		User_ID = @UserName
	WHERE OpcOpCode = @OpCode and OpcCoraAcctID = @Cora
END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH

--
-- Un-Sets
--
SET NOCOUNT OFF

RETURN 0



```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
