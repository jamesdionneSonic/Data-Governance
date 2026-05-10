---
name: Upsert_Dim_DateEvent
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

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
       AND EXISTS (SELECT 1 FROM dbo.D
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
