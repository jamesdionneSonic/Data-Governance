---
name: Upsert_Dim_DateEvent
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Dim_DateEvent
dependency_count: 1
parameter_count: 8
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Dim_DateEvent** (U )

## Parameters

| Name                | Type    | Output | Default |
| ------------------- | ------- | ------ | ------- |
| `@DateEventID`      | int     | No     | No      |
| `@EventDescription` | varchar | No     | No      |
| `@IsSonic`          | int     | No     | No      |
| `@IsEchoPark`       | int     | No     | No      |
| `@IsPowersports`    | int     | No     | No      |
| `@IsActive`         | int     | No     | No      |
| `@GUID`             | varchar | No     | No      |
| `@Meta_User`        | varchar | No     | No      |

## Definition

```sql
CREATE PROCEDURE [dbo].[Upsert_Dim_DateEvent]
(
    @DateEventID        INT = NULL,
    @EventDescription   VARCHAR(50) = NULL,
    @IsSonic            INT = NULL,
    @IsEchoPark         INT = NULL,
    @IsPowersports      INT = NULL,
    @IsActive           INT = NULL,
    @GUID               VARCHAR(50) = NULL,
    @Meta_User          VARCHAR(50) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @DateEventID IS NOT NULL AND @DateEventID <> -1
       AND EXISTS (SELECT 1 FROM dbo.Dim_DateEvent WHERE DateEventID = @DateEventID)
    BEGIN

        UPDATE dbo.Dim_DateEvent
        SET
            EventDescription = COALESCE(NULLIF(@EventDescription, ''), EventDescription),
            IsSonic          = COALESCE(@IsSonic, IsSonic),
            IsEchoPark       = COALESCE(@IsEchoPark, IsEchoPark),
            IsPowersports    = COALESCE(@IsPowersports, IsPowersports),
            IsActive         = COALESCE(@IsActive, IsActive),
            DateGUID         = COALESCE(NULLIF(@GUID, ''), DateGUID),
            Meta_User        = COALESCE(NULLIF(@Meta_User, ''), Meta_User),
            Meta_LastModifiedDate = GETDATE()
        WHERE DateEventID = @DateEventID;
    END

    ELSE
    BEGIN
        INSERT INTO dbo.Dim_DateEvent
        (
            EventDescription,
            IsSonic,
            IsEchoPark,
            IsPowersports,
            IsActive,
            Meta_LoadDate,
            Meta_LastModifiedDate,
            Meta_User,
            DateGUID
        )
        VALUES
        (
            @EventDescription,
            @IsSonic,
            @IsEchoPark,
            @IsPowersports,
            1,              -- IsActive default
            GETDATE(),
            GETDATE(),
            @Meta_User,
            @GUID
        );
    END
END;

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
