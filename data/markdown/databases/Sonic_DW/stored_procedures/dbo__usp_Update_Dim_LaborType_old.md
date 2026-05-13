---
name: usp_Update_Dim_LaborType_old
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Dim_LaborType
dependency_count: 1
parameter_count: 4
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Dim_LaborType** (U )

## Parameters

| Name                 | Type    | Output | Default |
| -------------------- | ------- | ------ | ------- |
| `@LaborTypeKey`      | int     | No     | No      |
| `@UserName`          | varchar | No     | No      |
| `@LaborTypeCategory` | varchar | No     | No      |
| `@GridName`          | varchar | No     | No      |

## Definition

```sql

CREATE PROCEDURE [dbo].[usp_Update_Dim_LaborType]
@LaborTypeKey int,
@UserName varchar(20),
@LaborTypeCategory varchar(20),
@GridName varchar(50)
--@OffGridFlag bit
AS
--
-- ============================================================================
-- Module:  usp_Update_Dim_LaborType
-- Author:  Roger Williams
--   Date:  09/29/2011
--
-- Description:
--   Update Dim_LaborType
--
-- Dependencies:
--   dbo.Dim_LaborType
--
-- Revisions:
-- Date        Name             Description
-- ---------------------------------------------------------------------------
-- 09/29/2011  Roger Williams   Initial creation
-- Upadated 05/08/2012 CDE, JH
-- ============================================================================
--
-- Sets
--
SET NOCOUNT ON

--
-- Declarations
--

--
-- Initializations
--

--
-- **************************************
-- Processing
-- **************************************
--
-- Update Dim_LaborType
--
BEGIN TRY
	--SELECT * FROM dbo.Dim_LaborType
	UPDATE dbo.Dim_LaborType
	SET LbrLaborTypeCategory = @LaborTypeCategory,
		LbrGridName = @GridName,
		Meta_RowLastChangedDate = GETDATE(),
		User_ID = @UserName
	WHERE LaborTypeKey = @LaborTypeKey
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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
