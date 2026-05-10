---
name: usp_TitleTracking_Permissions
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






/* =========================================================================================
    Author:			Lexie McGilis
    Create date:	2/17/2020
    Description:	Insert/Update/Delete records for dim_UserEntity for TitleTracking
========================================================================================= */


CREATE PROCEDURE [dbo].[usp_TitleTracking_Permissions]
	@UserEntityKey INT,
	@EmployeeID INT,
	@EntityKey INT,
	@UE_isActive BIT,
	@UE_IsDefault BIT,
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
