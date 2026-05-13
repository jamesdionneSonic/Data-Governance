---
name: usp_LogError
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Error_Log
dependency_count: 1
parameter_count: 1
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Error_Log** (U )

## Parameters

| Name          | Type | Output | Default |
| ------------- | ---- | ------ | ------- |
| `@ErrorLogID` | int  | Yes    | No      |

## Definition

```sql

-- =============================================
-- Author:      Greg Bishop
-- Create date: 2011/06/11
-- Description: Procedure to log error information
--              into the Error_Log table. This
--              procedure should be placed
--              within the CATCH block of a TRY/
--              CATCH statement.
-- =============================================
CREATE PROCEDURE [dbo].[usp_LogError]
    -- Add the parameters for the stored procedure here
    @ErrorLogID [int] = 0 OUTPUT  -- Contains the ErrorLogID of the row inserted
                                  -- by usp_LogError in the ErrorLog table.
AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON;

    DECLARE @ErrorMessage NVARCHAR(4000),
            @ErrorSeverity INT,
            @ErrorState INT;

    -- Output parameter value of 0 indicates that error
    -- information was not logged.
    SET @ErrorLogID = 0;

    BEGIN TRY
        -- Return if there is no error information to log.
        IF ERROR_NUMBER() IS NULL
            RETURN;

        -- Return if inside an uncommittable transaction.
        -- Data insertion/modification is not allowed when
        -- a transaction is in an uncommittable state.
        IF XACT_STATE() = -1
        BEGIN
            PRINT 'Cannot log error since the current transaction is in an uncommittable state. '
                + 'Rollback the transaction before executing usp_LogError in order to successfully log error information.';
            RETURN;
        END;

        -- Insert errors into the log table
        INSERT [dbo].[Error_Log]
            (
            [Error_User_Name],
            [Error_Number],
            [Error_Severity],
            [Error_State],
            [Error_Procedure],
            [Error_Line],
            [Error_Message]
            )
        VALUES
            (
            CONVERT(sysname, CURRENT_USER),
            ERROR_NUMBER(),
            ERROR_SEVERITY(),
            ERROR_STATE(),
            ERROR_PROCEDURE(),
            ERROR_LINE(),
            ERROR_MESSAGE()
            );

        -- Pass back the ErrorLogID of the row inserted
        SET @ErrorLogID = SCOPE_IDENTITY();
    END TRY
    BEGIN CATCH
        -- Use usp_RaiseError inside the CATCH block to return error
        -- information about the original error that caused
        -- execution to jump to the CATCH block.
        EXECUTE [dbo].[usp_RaiseError];

        RETURN -1;
    END CATCH
END;

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
