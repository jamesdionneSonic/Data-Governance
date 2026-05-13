---
name: corporate_variances_reviewer
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - corporate_variances
  - Dim_SECRollup
dependency_count: 2
parameter_count: 11
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.corporate_variances** (U )
- **dbo.Dim_SECRollup** (U )

## Parameters

| Name                       | Type    | Output | Default |
| -------------------------- | ------- | ------ | ------- |
| `@month`                   | int     | No     | No      |
| `@SECRollupKey`            | int     | No     | No      |
| `@departmentkey`           | int     | No     | No      |
| `@approved`                | int     | No     | No      |
| `@denied`                  | int     | No     | No      |
| `@reviewer_comment`        | varchar | No     | No      |
| `@comment`                 | varchar | No     | No      |
| `@CFO_Comment`             | varchar | No     | No      |
| `@user`                    | varchar | No     | No      |
| `@SECLevel0_Desc`          | varchar | No     | No      |
| `@CorporateVarianceRollup` | varchar | No     | No      |

## Definition

```sql

-----Alter Sonic_DW.dbo.[corporate_variances_reviewer] to include update proc for the above added column (only addition is the highlighted piece at end of proc):

CREATE PROC [dbo].[corporate_variances_reviewer] (@month INT, @SECRollupKey INT, @departmentkey INT, @approved INT = 0, @denied INT = 0, @reviewer_comment VARCHAR(MAX) = '', @comment VARCHAR(MAX) = '', @CFO_Comment VARCHAR(MAX) = '', @user VARCHAR(100) = '', @SECLevel0_Desc VARCHAR(260) = '', @CorporateVarianceRollup VARCHAR(100) = '')

AS

	IF NOT EXISTS (SELECT

				*

			FROM dbo.corporate_variances cv

			WHERE cv.[SECRollupKey] = @SECRollupKey

			AND cv.FiscalMonthKey = @month

			AND cv.DepartmentKey = @departmentkey)

	BEGIN

		INSERT INTO dbo.corporate_variances (FiscalMonthKey, [SECRollupKey], DepartmentKey, Comments, Meta_LoadDate, Approved, Denied, Reviewer_Comment, [mstr_user_review])

			VALUES (@month, @SECRollupKey, @departmentkey, @comment, GETDATE(), @approved, @denied, @reviewer_comment, @user)



	END



	ELSE



	BEGIN

		UPDATE dbo.corporate_variances

		SET	Meta_LastUpdateDate = GETDATE()

			,Approved = @approved

			,Denied = @denied

			,Reviewer_Comment = @reviewer_comment

			,Comments = @comment

			,[CFO_Comment] = @CFO_Comment

			,[mstr_user_review] = @user

		WHERE FiscalMonthKey = @month

		AND SECRollupKey = @SECRollupKey

		AND DepartmentKey = @departmentkey

	END







	UPDATE dbo.corporate_variances

	SET Approved = 0

	WHERE Approved IS NULL



	UPDATE dbo.corporate_variances

	SET Denied = 0

	WHERE Denied IS NULL







	IF LEN(@CorporateVarianceRollup) > 3

		AND @CorporateVarianceRollup <> (SELECT TOP 1

				ISNULL(ds.CorporateVarianceRollup, 0)

			FROM dbo.Dim_SECRollup ds

			WHERE ds.SECLevel0_Desc = @SECLevel0_Desc)

	BEGIN

		UPDATE dbo.Dim_SECRollup

		SET CorporateVarianceRollup = @CorporateVarianceRollup

		WHERE SECLevel0_Desc = @SECLevel0_Desc

	END




```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
