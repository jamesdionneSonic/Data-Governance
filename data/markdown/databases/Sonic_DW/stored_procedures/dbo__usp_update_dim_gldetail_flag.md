---
name: usp_update_dim_gldetail_flag
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Dim_GLDetail
  - wrkDim_GLDetail
dependency_count: 2
parameter_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Dim_GLDetail** (U )
- **wrk.wrkDim_GLDetail** (U )

## Definition

```sql
-- =============================================
-- Author:		<Larry Owens>
-- Create date: <09/15/2011>
-- Description:	<This will update the DetScheduleActiveFlag depending on whether it finds the given dim record for a given conrol in the current month schedule.
--              If it does, the flag is set to true.  If it doesn't, the flag is set to false >
-- =============================================
CREATE PROCEDURE [dbo].[usp_update_dim_gldetail_flag]
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;






-- Not In Schedule, Set Active Flag to False
UPDATE T
SET T.DetScheduleActiveFlag = 0,
T.DetScheduleEndDate = ISNULL(D.EndDate,'9999-12-31')
FROM dbo.Dim_GLDetail T (nolock)
INNER JOIN  wrk.wrkDim_GLDetail D WITH (INDEX (IX_coidcoraidcontrolaccountnumber))
	ON T.DetCompanyID = D.CompanyID and T.DetCora_Acct_ID = D.Cora_Acct_ID
WHERE D.InSched IS NULL



-- In Schedule, Set Active Flag to TRUE
UPDATE T
SET T.DetScheduleActiveFlag = 1,
T.DetScheduleStartDate = ISNULL(D.StartDate,'9999-12-31'), T.DetScheduleEndDate = '9999-12-31'
FROM dbo.Dim_GLDetail T (nolock)
INNER JOIN  wrk.wrkDim_GLDetail D WITH (INDEX (IX_coidcoraidcontrolaccountnumber))
ON T.DetCompanyID = D.CompanyID and
T.DetCora_Acct_ID = D.Cora_Acct_ID and
T.DetControl = D.[Control] and
T.DetAccountNumber = D.AccountNumber
WHERE D.InSched IS NOT NULL



END

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
