---
name: usp_DOC_Update_Record
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






CREATE PROCEDURE [dbo].[usp_DOC_Update_Record]
@DocID INT,
@DocStatusID INT,
@UserLogin varchar(50)


As


SET NOCOUNT ON

BEGIN TRY

	--Status code of 2 is only to allow MicroStrategy to know which iPhones need to be alerted, hence why the status is updated to 3 after
IF @DocID IS NOT NULL BEGIN
	IF @DocStatusID = 2
	BEGIN

		UPDATE [Sonic_DW].[dbo].[Doc_Record]
		SET [DocStatusID] = @DocStatusID
			,[DocReviewSubmitDate] = GetDate()
		WHERE DocID = @DocID

	--
	--Send notification to iPhone that DailyDoc is ready
	--EXECUTE xp_cmdshell 'C:\psexec \\cor-ustrat-02 CMDMGR -n COR-USTRAT-02 -u EventUser -p k1ck0ff -f "\\cor-ustrat-02\Command Manager\DDiPhone.scp" -showoutput'
	--EXECUTE xp_cmdshell 'C:\psexec \\cor-ustrat-02 MASysMgr -w "\\cor-ustrat-02\System Manager\MobileAlert.smw" -l "\\cor-ustrat-02\Command Manager\DDLog.txt" -showoutput'
	--EXECUTE xp_cmdshell 'C:\psexec \\cor-ustrat-02 MASysMgr -w "\\cor-ustrat-02\System Manager\TestWork.smw" -l "\\cor-ustrat-02\Command Manager\DDLog.txt" -showoutput'

	--Update Total Sonic DailyDoc cache in MicroStrategy
	--EXECUTE xp_cmdshell 'C:\psexec \\d1-ustrat-02a CMDMGR -n ProdLDAP -u svcEventUser -p k1ck0ff123! -f "\\d1-ustrat-02a\Command Manager\DDTotalSonic.scp" -showoutput'

	--WAITFOR DELAY '00:00:04';

	EXECUTE dbo.usp_DOC_Update_Record @DocID, 3, @UserLogin

	END

	ELSE IF @DocStatusID = 3
	BEGIN

		UPDATE [Sonic_DW].[dbo].[Doc_Record]
		SET [DocStatusID] = @DocStatusID
		WHERE DocID = @DocID


	END

	ELSE IF @DocStatusID = 4
	BEGIN

		UPDATE [Sonic_DW].[dbo].[Doc_Record]
		SET [DocReviewDate] = GetDate()
			,[DocReviewBy] = @UserLogin
			,[DocStatusID] = @DocStatusID
		WHERE DocID = @DocID

	--Update iPhone badge number without sending a notification
	--EXECUTE xp_cmdshell 'C:\psexec \\d1-ustrat-02a CMDMGR -n ProdLDAP -u svcEventUser -p k1ck0ff123! -f "\\d1-ustrat-02a\Command Manager\DDiPhoneUpdate.scp" -showoutput'

	END
END

END TRY

BEGIN CATCH
    SELECT ERROR_NUMBER() AS ErrorNumber, ERROR_MESSAGE() AS ErrorMessage
    RETURN -1
END CATCH


SET NOCOUNT OFF



```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
