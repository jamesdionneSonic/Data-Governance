---
name: usp_Update_Dim_PricingGrid_Reset
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

CREATE PROCEDURE [dbo].[usp_Update_Dim_PricingGrid_Reset]
@EntityKey int,
@UserName varchar(255)
AS
--
-- ============================================================================
-- Module:  usp_Update_Dim_PricingGrid_Reset
-- Author:  Roger Williams
--   Date:  12/15/2011
--
-- Description:
--   Update Dim_PricingGrid
--
-- Dependencies:
--   dbo.Dim_PricingGrid
--
-- Revisions:
-- Date        Name             Description
-- ---------------------------------------------------------------------------
-- 12/15/2011  Roger Williams   Initial creation
--
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
-- Update Dim_PricingGrid
--
BEGIN TRY
	--SELECT * FROM Sonic_DW.dbo.vw_Dim_PricingGrid --9859
	UPDATE dbo.vw_Dim_PricingGrid
	SET PgrGridDollarsTest = PgrGridDollarsActual,
		MetaRowLastChangedDate = GETDATE(),
		MetaUserName = @UserName
	WHERE EntityKey = @EntityKey
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
