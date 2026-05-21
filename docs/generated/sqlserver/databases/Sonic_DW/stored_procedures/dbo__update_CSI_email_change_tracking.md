---
name: update_CSI_email_change_tracking
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

CREATE PROC [dbo].[update_CSI_email_change_tracking] (@entdealerlvl1 VARCHAR(50),@Date DATE, @Action_Plan NVARCHAR(MAX),@Meta_UserID VARCHAR(50)) AS

	UPDATE dbo.CSI_email_change_tracking
	SET  Action_Plan = @Action_Plan, Meta_UserID = @Meta_UserID, Meta_LoadDate = GETDATE()
	WHERE entdealerlvl1 = @entdealerlvl1 AND Date = @Date

--IF EXISTS (SELECT * FROM dbo.CSI_email_change_tracking WHERE entdealerlvl1 = @entdealerlvl1 AND Date = @Date) AND @Action_Plan <> 'Submitted'
--	UPDATE dbo.CSI_email_change_tracking
--	SET  Action_Plan = @Action_Plan, Meta_UserID = @Meta_UserID, Meta_LoadDate = GETDATE()
--	WHERE entdealerlvl1 = @entdealerlvl1 AND Date = @Date

--else

--INSERT INTO dbo.CSI_email_change_tracking (entdealerlvl1,[Date],Action_Plan,Meta_UserID,Meta_LoadDate)
--VALUES (@entdealerlvl1,@Date,@Action_Plan,@Meta_UserID,GETDATE())

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
