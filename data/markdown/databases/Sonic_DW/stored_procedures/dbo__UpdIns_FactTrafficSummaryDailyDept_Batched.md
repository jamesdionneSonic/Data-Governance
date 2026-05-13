---
name: UpdIns_FactTrafficSummaryDailyDept_Batched
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on: []
dependency_count: 0
parameter_count: 1
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Parameters

| Name                 | Type      | Output | Default |
| -------------------- | --------- | ------ | ------- |
| `@PriorMonthLastDay` | datetime2 | No     | No      |

## Definition

```sql

CREATE   PROCEDURE dbo.UpdIns_FactTrafficSummaryDailyDept_Batched
    @PriorMonthLastDay DATETIME2(3)  -- '2026-03-31 23:59:59.000'
AS
BEGIN
/*
04/23/2026 - DATA-16316 - Jasmin Gajera: Created the proc

Execution Command:
EXEC UpdIns_FactTrafficSummaryDailyDept_Batched '2026-03-31 23:59:59.000'

Test SQL:
SELECT COUNT(*) FROM FactTrafficSummaryDailyDept WHERE Meta_RowLastChangeDate > '2026-04-22 18:15:00.000'

*/
--SET NOCOUNT ON;

DECLARE @BatchSize INT = 10000;

------------------------------------------------------------------
-- 1. Load source into temp table
------------------------------------------------------------------
IF OBJECT_ID('tempdb..#StageTSDDept_SourceData') IS NOT NULL DROP TABLE #StageTSDDept_SourceData;

SELECT DISTINCT
	stg.SalesAssociateName
    ,ISNULL(u.DimUserCDKID, -1) AS DimUserCDKID
    --ISNULL(dudm.DimUserDepartmentMapCDKID, -1) AS DimUserDepartmentMapCDKID,
    --stg.Department,
    --ISNULL(dd.DimDepartmentCDKID, -1) AS DimDepartmentCDKID,
	,stg.EntityKey
	,stg.FiscalMonthDateKey
	,stg.szNewUsed
	,stg.szUpType
	,du.UpTypeKey
	,stg.LeadCount
	,stg.ShowroomVisits
	,stg.Bebacks
	,stg.Sold
	,stg.ApptCreated
	,stg.ApptDue
	,stg.ApptShown
	,stg.ApptSold
	,stg.ApptConfirmed
	,stg.Demos
	,stg.WriteUps
	,stg.TOs
	,stg.Appraisals
	,stg.Lost
	,stg.BadLead
	,stg.BoughtElsewhere
	,stg.Reassigned
	,stg.ETLExecution_ID
	,stg.ApptAttemptedConfirmed
	,stg.ApprApptCreated
	,stg.ApprApptDue
	,stg.ApprApptShown
	,stg.ApprApptAcquired
	,stg.ApprApptConfirmed
	,stg.Acquired
	,stg.IsAppraisalAppt
INTO #StageTSDDept_SourceData
FROM ETL_Staging.dbo.StageTrafficSummaryDailyDepartment stg WITH (NOLOCK)
LEFT JOIN Sonic_DW.dbo.DimUpType du WITH (NOLOCK)
	ON ISNULL(LTRIM(RTRIM(stg.szUpType)),'UNKNOWN') = LTRIM(RTRIM(ISNULL(du.szUpType,du.UpType)))
--LEFT JOIN Sonic_DW.dbo.DimDepartmentCDK dd WITH (NOLOCK)
--    ON stg.Department = dd.Department
--LEFT JOIN Sonic_DW.dbo.DimUserDepartmentMapCDK dudm WITH (NOLOCK)
--    ON stg.lPrimarySalespersonID = dudm.CDKUserID
--    AND stg.EntityKey = dudm.EntityKey
--    AND stg.Department = dudm.Department
LEFT JOIN Sonic_DW.dbo.DimUserCDK u
	ON stg.lPrimarySalespersonID = u.CDKUserID
	--AND stg.lChildCompanyID = u.CDKCompanyID
WHERE stg.EventDate <= @PriorMonthLastDay
    AND stg.EntityKey IS NOT NULL
	AND (LeadCount + ShowroomVisits + Bebacks + Sold + ApptCreated + ApptDue + ApptShown + ApptSold + ApptConfirmed + Demos + WriteUps + TOs + Appraisals + Lost + BadLead + BoughtElsewhere + Reassigned
		 + ApptAttemptedConfirmed + ApprApptCreated + ApprApptDue + ApprApptShown + ApprApptAcquired + ApprApptConfirmed + Acquired + IsAppraisalAppt) <> 0


------------------------------------------------------------------
-- 2. Index temp table
------------------------------------------------------------------
CREATE CLUSTERED INDEX IX_SourceData_Key ON #StageTSDDept_SourceData
(
    EntityKey,
    FiscalMonthDateKey,
    szNewUsed,
    UpTypeKey,
    --DimUserDepartmentMapCDKID,
    --DimDepartmentCDKID
    DimUserCDKID
);

------------------------------------------------------------------
-- 3. Loop through batches
------------------------------------------------------------------
WHILE 1 = 1
BEGIN
    -- Drop batch table if exists
    IF OBJECT_ID('tempdb..#Batch') IS NOT NULL DROP TABLE #Batch;

    SELECT TOP (@BatchSize) *
    INTO #Batch
    FROM #StageTSDDept_SourceData
    ORDER BY
        EntityKey,
        FiscalMonthDateKey,
        szNewUsed,
        UpTypeKey,
        --DimUserDepartmentMapCDKID,
        --DimDepartmentCDKID
        DimUserCDKID;

    ------------------------------------------------------------------
    -- 3A. UPDATE existing rows
    ------------------------------------------------------------------
    UPDATE T WITH (ROWLOCK)
    SET
        T.LeadCount = S.LeadCount,
        T.ShowroomVisits = S.ShowroomVisits,
        T.Bebacks = S.Bebacks,
        T.Sold = S.Sold,
        T.ApptCreated = S.ApptCreated,
        T.ApptDue = S.ApptDue,
        T.ApptShown = S.ApptShown,
        T.ApptSold = S.ApptSold,
        T.ApptConfirmed = S.ApptConfirmed,
        T.Demos = S.Demos,
        T.WriteUps = S.WriteUps,
        T.TOs = S.TOs,
        T.Appraisals = S.Appraisals,
        T.Lost = S.Lost,
        T.BadLead = S.BadLead,
        T.BoughtElsewhere = S.BoughtElsewhere,
        T.Reassigned = S.Reassigned,
        T.ETLExecution_ID = S.ETLExecution_ID,
        T.Meta_ComputerName = HOST_NAME(),
        T.Meta_UserID = SYSTEM_USER,
        T.Meta_RowLastChangeDate = GETDATE(),
        T.ApptAttemptedConfirmed = S.ApptAttemptedConfirmed,
        T.ApprApptCreated = S.ApprApptCreated,
        T.ApprApptDue = S.ApprApptDue,
        T.ApprApptShown = S.ApprApptShown,
        T.ApprApptAcquired = S.ApprApptAcquired,
        T.ApprApptConfirmed = S.ApprApptConfirmed,
        T.Acquired = S.Acquired,
        T.IsAppraisalAppt = S.IsAppraisalAppt
    FROM Sonic_DW.dbo.FactTrafficSummaryDailyDept T
    INNER JOIN #Batch S
        ON T.EntityKey = S.EntityKey
        AND T.FiscalMonthDateKey = S.FiscalMonthDateKey
        AND T.szNewUsed = S.szNewUsed
        AND T.UpTypeKey = S.UpTypeKey
        ----AND T.DimUserDepartmentMapCDKID = S.DimUserDepartmentMapCDKID
        ----AND T.DimDepartmentCDKID = S.DimDepartmentCDKID
        AND T.DimUserCDKID = S.DimUserCDKID
    WHERE
    HASHBYTES('SHA2_256',
        CONCAT(
            ISNULL(CAST(S.LeadCount AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.ShowroomVisits AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.Bebacks AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.Sold AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.ApptCreated AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.ApptDue AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.ApptShown AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.ApptSold AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.ApptConfirmed AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.Demos AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.WriteUps AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.TOs AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.Appraisals AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.Lost AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.BadLead AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.BoughtElsewhere AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.Reassigned AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.ApptAttemptedConfirmed AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.ApprApptCreated AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.ApprApptDue AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.ApprApptShown AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.ApprApptAcquired AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.ApprApptConfirmed AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.Acquired AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(S.IsAppraisalAppt AS VARCHAR(20)),'~')
        )
    )
    <>
    HASHBYTES('SHA2_256',
        CONCAT(
            ISNULL(CAST(T.LeadCount AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.ShowroomVisits AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.Bebacks AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.Sold AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.ApptCreated AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.ApptDue AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.ApptShown AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.ApptSold AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.ApptConfirmed AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.Demos AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.WriteUps AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.TOs AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.Appraisals AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.Lost AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.BadLead AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.BoughtElsewhere AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.Reassigned AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.ApptAttemptedConfirmed AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.ApprApptCreated AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.ApprApptDue AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.ApprApptShown AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.ApprApptAcquired AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.ApprApptConfirmed AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.Acquired AS VARCHAR(20)),'~'),'|',
            ISNULL(CAST(T.IsAppraisalAppt AS VARCHAR(20)),'~')
        )
    );

    ------------------------------------------------------------------
    -- 3B. INSERT new rows
    ------------------------------------------------------------------
    INSERT INTO Sonic_DW.dbo.FactTrafficSummaryDailyDept
    (
        ----DimUserDepartmentMapCDKID,
        ----DimDepartmentCDKID,
        DimUserCDKID,
        EntityKey,
        FiscalMonthDateKey,
        szNewUsed,
        UpTypeKey,
        LeadCount,
        ShowroomVisits,
        Bebacks,
        Sold,
        ApptCreated,
        ApptDue,
        ApptShown,
        ApptSold,
        ApptConfirmed,
        Demos,
        WriteUps,
        TOs,
        Appraisals,
        Lost,
        BadLead,
        BoughtElsewhere,
        Reassigned,
        ETLExecution_ID,
        ApptAttemptedConfirmed,
        ApprApptCreated,
        ApprApptDue,
        ApprApptShown,
        ApprApptAcquired,
        ApprApptConfirmed,
        Acquired,
        IsAppraisalAppt,
        Meta_ComputerName,
        Meta_UserID,
        Meta_RowLastChangeDate,
        Meta_LoadDate
    )
    SELECT
        ----S.DimUserDepartmentMapCDKID,
        ----S.DimDepartmentCDKID,
        S.DimUserCDKID,
        S.EntityKey,
        S.FiscalMonthDateKey,
        S.szNewUsed,
        S.UpTypeKey,
        S.LeadCount,
        S.ShowroomVisits,
        S.Bebacks,
        S.Sold,
        S.ApptCreated,
        S.ApptDue,
        S.ApptShown,
        S.ApptSold,
        S.ApptConfirmed,
        S.Demos,
        S.WriteUps,
        S.TOs,
        S.Appraisals,
        S.Lost,
        S.BadLead,
        S.BoughtElsewhere,
        S.Reassigned,
        S.ETLExecution_ID,
        S.ApptAttemptedConfirmed,
        S.ApprApptCreated,
        S.ApprApptDue,
        S.ApprApptShown,
        S.ApprApptAcquired,
        S.ApprApptConfirmed,
        S.Acquired,
        S.IsAppraisalAppt,
        HOST_NAME(),
        SYSTEM_USER,
        GETDATE(),
        GETDATE()
    FROM #Batch S
    WHERE NOT EXISTS
    (
        SELECT 1
        FROM Sonic_DW.dbo.FactTrafficSummaryDailyDept T
        WHERE
            T.EntityKey = S.EntityKey
            AND T.FiscalMonthDateKey = S.FiscalMonthDateKey
            AND T.szNewUsed = S.szNewUsed
            AND T.UpTypeKey = S.UpTypeKey
            ----AND T.DimUserDepartmentMapCDKID = S.DimUserDepartmentMapCDKID
            ----AND T.DimDepartmentCDKID = S.DimDepartmentCDKID
            AND T.DimUserCDKID = S.DimUserCDKID
    );

    ------------------------------------------------------------------
    -- 3C. Remove processed rows
    ------------------------------------------------------------------
    DELETE S
    FROM #StageTSDDept_SourceData S
    INNER JOIN #Batch B
        ON S.EntityKey = B.EntityKey
        AND S.FiscalMonthDateKey = B.FiscalMonthDateKey
        AND S.szNewUsed = B.szNewUsed
        AND S.UpTypeKey = B.UpTypeKey
        ----AND S.DimUserDepartmentMapCDKID = B.DimUserDepartmentMapCDKID
        ----AND S.DimDepartmentCDKID = B.DimDepartmentCDKID;
        AND S.DimUserCDKID = B.DimUserCDKID

    IF @@ROWCOUNT = 0 BREAK;
END
END;
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
