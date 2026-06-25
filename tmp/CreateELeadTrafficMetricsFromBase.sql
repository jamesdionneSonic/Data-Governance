/*
    SQL Server metric builder for the COSMOS_SONIC base extract.

    Assumption:
      The Snowflake base-data query lands in Sonic_DW as:

          Sonic_DW.dbo.ELeadTrafficBaseData

    If your landed table has a different name, either rename it or create a synonym:

          CREATE SYNONYM dbo.ELeadTrafficBaseData FOR dbo.<your_actual_table_name>;

    Design:
      1. dbo.ELeadTrafficMetricFact stores one deduped row per metric event.
      2. dbo.ELeadTrafficDailySummary stores a wide daily rollup similar to
         StageTrafficSummary, with additional VIN/data-quality audit columns.

    This script intentionally uses the row-level metric flags already produced
    by the base-data query. The purpose here is not to rediscover the rules in
    Power BI or another stored procedure.
*/

USE Sonic_DW;
GO

IF OBJECT_ID('dbo.ELeadTrafficMetricFact', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.ELeadTrafficMetricFact
    (
        MetricRunID UNIQUEIDENTIFIER NOT NULL,
        MetricDate DATE NOT NULL,
        MetricName VARCHAR(80) NOT NULL,
        MetricValue DECIMAL(19, 4) NOT NULL,

        lCompanyID INT NULL,
        lChildCompanyID INT NULL,
        szNewUsed VARCHAR(10) NULL,
        szUpType VARCHAR(100) NULL,
        szSource VARCHAR(255) NULL,
        szSubSource VARCHAR(255) NULL,

        MetricEventKey VARCHAR(200) NOT NULL,
        BaseRowKey VARCHAR(200) NULL,
        RecordType VARCHAR(50) NULL,
        RowOrigin VARCHAR(50) NULL,
        MetricGrain VARCHAR(50) NULL,
        RecordTypeReason VARCHAR(120) NULL,

        lDealID BIGINT NULL,
        lTaskID BIGINT NULL,
        lPurchaseDetailsID BIGINT NULL,
        lPersonID BIGINT NULL,

        ProspectVin VARCHAR(17) NULL,
        SoldVin VARCHAR(17) NULL,
        ServiceVin VARCHAR(17) NULL,
        ResolvedVin VARCHAR(17) NULL,
        VinResolutionSource VARCHAR(200) NULL,
        SoldVinResolutionStatus VARCHAR(120) NULL,
        ProspectVinResolutionStatus VARCHAR(120) NULL,
        ServiceVinResolutionStatus VARCHAR(120) NULL,
        ResolvedVinStatus VARCHAR(120) NULL,

        LoadedAt DATETIME2(3) NOT NULL CONSTRAINT DF_ELeadTrafficMetricFact_LoadedAt DEFAULT SYSUTCDATETIME()
    );

    CREATE INDEX IX_ELeadTrafficMetricFact_DateMetric
        ON dbo.ELeadTrafficMetricFact (MetricDate, MetricName, lCompanyID, lChildCompanyID);

    CREATE INDEX IX_ELeadTrafficMetricFact_DealTask
        ON dbo.ELeadTrafficMetricFact (lDealID, lTaskID, MetricName);
END;
GO

IF OBJECT_ID('dbo.ELeadTrafficDailySummary', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.ELeadTrafficDailySummary
    (
        MetricRunID UNIQUEIDENTIFIER NOT NULL,
        MetricDate DATE NOT NULL,

        lCompanyID INT NULL,
        lChildCompanyID INT NULL,
        szNewUsed VARCHAR(10) NULL,
        szUpType VARCHAR(100) NULL,
        szSource VARCHAR(255) NULL,
        szSubSource VARCHAR(255) NULL,

        LeadCount INT NOT NULL DEFAULT 0,
        ShowroomVisits INT NOT NULL DEFAULT 0,
        Bebacks INT NOT NULL DEFAULT 0,
        Sold INT NOT NULL DEFAULT 0,
        ApptCreated INT NOT NULL DEFAULT 0,
        ApptDue INT NOT NULL DEFAULT 0,
        ApptShown INT NOT NULL DEFAULT 0,
        ApptSold INT NOT NULL DEFAULT 0,
        ApptConfirmed INT NOT NULL DEFAULT 0,
        ApptAttemptedConfirmed INT NOT NULL DEFAULT 0,
        ApprApptCreated INT NOT NULL DEFAULT 0,
        ApprApptDue INT NOT NULL DEFAULT 0,
        ApprApptShown INT NOT NULL DEFAULT 0,
        ApprApptAcquired INT NOT NULL DEFAULT 0,
        ApprApptConfirmed INT NOT NULL DEFAULT 0,
        Acquired INT NOT NULL DEFAULT 0,
        IsAppraisalAppt INT NOT NULL DEFAULT 0,
        Demos INT NOT NULL DEFAULT 0,
        WriteUps INT NOT NULL DEFAULT 0,
        TOs INT NOT NULL DEFAULT 0,
        Appraisals INT NOT NULL DEFAULT 0,
        Lost INT NOT NULL DEFAULT 0,
        BadLead INT NOT NULL DEFAULT 0,
        BoughtElsewhere INT NOT NULL DEFAULT 0,
        Reassigned INT NOT NULL DEFAULT 0,
        ResponseTime DECIMAL(19, 4) NULL,

        BaseRows INT NOT NULL DEFAULT 0,
        DistinctDeals INT NOT NULL DEFAULT 0,
        DistinctTasks INT NOT NULL DEFAULT 0,
        SoldLifecycleRows INT NOT NULL DEFAULT 0,
        SoldRowsWithSoldVin INT NOT NULL DEFAULT 0,
        SoldRowsMissingSoldVin INT NOT NULL DEFAULT 0,
        RowsWithResolvedVin INT NOT NULL DEFAULT 0,
        RowsWithoutResolvedVin INT NOT NULL DEFAULT 0,

        LoadedAt DATETIME2(3) NOT NULL CONSTRAINT DF_ELeadTrafficDailySummary_LoadedAt DEFAULT SYSUTCDATETIME()
    );

    CREATE INDEX IX_ELeadTrafficDailySummary_Date
        ON dbo.ELeadTrafficDailySummary (MetricDate, lCompanyID, lChildCompanyID, szNewUsed, szUpType);
END;
GO

CREATE OR ALTER PROCEDURE dbo.usp_LoadELeadTrafficMetricsFromBase
(
      @StartDate DATE
    , @EndDate DATE
    , @ReloadWindow BIT = 1
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @MetricRunID UNIQUEIDENTIFIER = NEWID();
    DECLARE @StartDateTime DATETIME2(0) = CONVERT(DATETIME2(0), @StartDate);
    DECLARE @EndDateExclusive DATETIME2(0) = DATEADD(DAY, 1, CONVERT(DATETIME2(0), @EndDate));

    IF OBJECT_ID('dbo.ELeadTrafficBaseData', 'U') IS NULL
       AND OBJECT_ID('dbo.ELeadTrafficBaseData', 'SN') IS NULL
    BEGIN
        THROW 50001, 'Expected source table or synonym dbo.ELeadTrafficBaseData was not found.', 1;
    END;

    IF @ReloadWindow = 1
    BEGIN
        DELETE dbo.ELeadTrafficMetricFact
        WHERE MetricDate >= @StartDate
          AND MetricDate <= @EndDate;

        DELETE dbo.ELeadTrafficDailySummary
        WHERE MetricDate >= @StartDate
          AND MetricDate <= @EndDate;
    END;

    WITH src AS
    (
        SELECT
            b.*
        FROM dbo.ELeadTrafficBaseData b
        WHERE
            (b.metric_date >= @StartDateTime AND b.metric_date < @EndDateExclusive)
            OR (b.dtProspectIn >= @StartDateTime AND b.dtProspectIn < @EndDateExclusive)
            OR (b.dtIn >= @StartDateTime AND b.dtIn < @EndDateExclusive)
            OR (b.dtClosed >= @StartDateTime AND b.dtClosed < @EndDateExclusive)
            OR (b.dtSold >= @StartDateTime AND b.dtSold < @EndDateExclusive)
            OR (b.dtCreated >= @StartDateTime AND b.dtCreated < @EndDateExclusive)
            OR (b.dtDue >= @StartDateTime AND b.dtDue < @EndDateExclusive)
            OR (b.dtCompleted >= @StartDateTime AND b.dtCompleted < @EndDateExclusive)
            OR (b.dtApptConfirmed >= @StartDateTime AND b.dtApptConfirmed < @EndDateExclusive)
            OR (b.dtAttemptedConfirmed >= @StartDateTime AND b.dtAttemptedConfirmed < @EndDateExclusive)
    ),
    metric_events AS
    (
        SELECT
            CONVERT(DATE, dtProspectIn) AS EventMetricDate,
            'LeadCount' AS EventMetricName,
            CAST(1 AS DECIMAL(19, 4)) AS EventMetricValue,
            CONCAT('LeadCount:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lDealID), base_row_key)) AS MetricEventKey,
            *
        FROM src
        WHERE ISNULL(lUp, 0) = 1
          AND dtProspectIn >= @StartDateTime
          AND dtProspectIn < @EndDateExclusive

        UNION ALL

        SELECT
            CONVERT(DATE, COALESCE(dtIn, dtCompleted, metric_date)) AS EventMetricDate,
            'ShowroomVisits' AS EventMetricName,
            CAST(1 AS DECIMAL(19, 4)) AS EventMetricValue,
            CONCAT('ShowroomVisits:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lTaskID), CONVERT(VARCHAR(50), lDealID), base_row_key)) AS MetricEventKey,
            *
        FROM src
        WHERE ISNULL(lVisit, 0) = 1
          AND ISNULL(lBeBack, 0) = 0
          AND COALESCE(dtIn, dtCompleted, metric_date) >= @StartDateTime
          AND COALESCE(dtIn, dtCompleted, metric_date) < @EndDateExclusive

        UNION ALL

        SELECT
            CONVERT(DATE, COALESCE(dtIn, dtCompleted, metric_date)) AS EventMetricDate,
            'Bebacks' AS EventMetricName,
            CAST(1 AS DECIMAL(19, 4)) AS EventMetricValue,
            CONCAT('Bebacks:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lTaskID), CONVERT(VARCHAR(50), lDealID), base_row_key)) AS MetricEventKey,
            *
        FROM src
        WHERE ISNULL(lBeBack, 0) = 1
          AND COALESCE(dtIn, dtCompleted, metric_date) >= @StartDateTime
          AND COALESCE(dtIn, dtCompleted, metric_date) < @EndDateExclusive

        UNION ALL

        SELECT
            CONVERT(DATE, dtSold) AS EventMetricDate,
            'Sold' AS EventMetricName,
            CAST(1 AS DECIMAL(19, 4)) AS EventMetricValue,
            CONCAT('Sold:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lPurchaseDetailsID), CONVERT(VARCHAR(50), lDealID), base_row_key)) AS MetricEventKey,
            *
        FROM src
        WHERE ISNULL(lSold, 0) = 1
          AND dtSold >= @StartDateTime
          AND dtSold < @EndDateExclusive

        UNION ALL

        SELECT
            CONVERT(DATE, dtCreated) AS EventMetricDate,
            'ApptCreated' AS EventMetricName,
            CAST(1 AS DECIMAL(19, 4)) AS EventMetricValue,
            CONCAT('ApptCreated:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lTaskID), base_row_key)) AS MetricEventKey,
            *
        FROM src
        WHERE ISNULL(lApptCreated, 0) = 1
          AND ISNULL(IsAppraisalAppt, 0) = 0
          AND dtCreated >= @StartDateTime
          AND dtCreated < @EndDateExclusive

        UNION ALL

        SELECT
            CONVERT(DATE, dtDue) AS EventMetricDate,
            'ApptDue' AS EventMetricName,
            CAST(1 AS DECIMAL(19, 4)) AS EventMetricValue,
            CONCAT('ApptDue:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lTaskID), base_row_key)) AS MetricEventKey,
            *
        FROM src
        WHERE ISNULL(lApptDue, 0) = 1
          AND ISNULL(IsAppraisalAppt, 0) = 0
          AND dtDue >= @StartDateTime
          AND dtDue < @EndDateExclusive

        UNION ALL

        SELECT
            CONVERT(DATE, dtCompleted) AS EventMetricDate,
            'ApptShown' AS EventMetricName,
            CAST(1 AS DECIMAL(19, 4)) AS EventMetricValue,
            CONCAT('ApptShown:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lTaskID), base_row_key)) AS MetricEventKey,
            *
        FROM src
        WHERE ISNULL(lApptShown, 0) = 1
          AND ISNULL(IsAppraisalAppt, 0) = 0
          AND dtCompleted >= @StartDateTime
          AND dtCompleted < @EndDateExclusive

        UNION ALL

        SELECT
            CONVERT(DATE, COALESCE(dtSold, dtCompleted)) AS EventMetricDate,
            'ApptSold' AS EventMetricName,
            CAST(1 AS DECIMAL(19, 4)) AS EventMetricValue,
            CONCAT('ApptSold:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lTaskID), CONVERT(VARCHAR(50), lPurchaseDetailsID), base_row_key)) AS MetricEventKey,
            *
        FROM src
        WHERE ISNULL(lApptSold, 0) = 1
          AND COALESCE(dtSold, dtCompleted) >= @StartDateTime
          AND COALESCE(dtSold, dtCompleted) < @EndDateExclusive

        UNION ALL

        SELECT
            CONVERT(DATE, dtApptConfirmed) AS EventMetricDate,
            'ApptConfirmed' AS EventMetricName,
            CAST(1 AS DECIMAL(19, 4)) AS EventMetricValue,
            CONCAT('ApptConfirmed:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lTaskID), base_row_key)) AS MetricEventKey,
            *
        FROM src
        WHERE ISNULL(lApptConfirmed, 0) = 1
          AND ISNULL(IsAppraisalAppt, 0) = 0
          AND dtApptConfirmed >= @StartDateTime
          AND dtApptConfirmed < @EndDateExclusive

        UNION ALL

        SELECT
            CONVERT(DATE, dtAttemptedConfirmed) AS EventMetricDate,
            'ApptAttemptedConfirmed' AS EventMetricName,
            CAST(1 AS DECIMAL(19, 4)) AS EventMetricValue,
            CONCAT('ApptAttemptedConfirmed:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lTaskID), base_row_key)) AS MetricEventKey,
            *
        FROM src
        WHERE ISNULL(lApptAttemptedConfirmed, 0) = 1
          AND ISNULL(lApptConfirmed, 0) = 0
          AND dtAttemptedConfirmed >= @StartDateTime
          AND dtAttemptedConfirmed < @EndDateExclusive

        UNION ALL

        SELECT CONVERT(DATE, dtCreated), 'ApprApptCreated', CAST(1 AS DECIMAL(19, 4)),
               CONCAT('ApprApptCreated:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lTaskID), base_row_key)), *
        FROM src
        WHERE ISNULL(lApptCreated, 0) = 1 AND ISNULL(IsAppraisalAppt, 0) = 1
          AND dtCreated >= @StartDateTime AND dtCreated < @EndDateExclusive

        UNION ALL

        SELECT CONVERT(DATE, dtDue), 'ApprApptDue', CAST(1 AS DECIMAL(19, 4)),
               CONCAT('ApprApptDue:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lTaskID), base_row_key)), *
        FROM src
        WHERE ISNULL(lApptDue, 0) = 1 AND ISNULL(IsAppraisalAppt, 0) = 1
          AND dtDue >= @StartDateTime AND dtDue < @EndDateExclusive

        UNION ALL

        SELECT CONVERT(DATE, dtCompleted), 'ApprApptShown', CAST(1 AS DECIMAL(19, 4)),
               CONCAT('ApprApptShown:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lTaskID), base_row_key)), *
        FROM src
        WHERE ISNULL(lApptShown, 0) = 1 AND ISNULL(IsAppraisalAppt, 0) = 1
          AND dtCompleted >= @StartDateTime AND dtCompleted < @EndDateExclusive

        UNION ALL

        SELECT CONVERT(DATE, COALESCE(dtClosed, dtCompleted, metric_date)), 'ApprApptAcquired', CAST(1 AS DECIMAL(19, 4)),
               CONCAT('ApprApptAcquired:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lTaskID), CONVERT(VARCHAR(50), lDealID), base_row_key)), *
        FROM src
        WHERE ISNULL(lApprApptAcquired, 0) = 1
          AND COALESCE(dtClosed, dtCompleted, metric_date) >= @StartDateTime
          AND COALESCE(dtClosed, dtCompleted, metric_date) < @EndDateExclusive

        UNION ALL

        SELECT CONVERT(DATE, dtApptConfirmed), 'ApprApptConfirmed', CAST(1 AS DECIMAL(19, 4)),
               CONCAT('ApprApptConfirmed:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lTaskID), base_row_key)), *
        FROM src
        WHERE ISNULL(lApptConfirmed, 0) = 1 AND ISNULL(IsAppraisalAppt, 0) = 1
          AND dtApptConfirmed >= @StartDateTime AND dtApptConfirmed < @EndDateExclusive

        UNION ALL

        SELECT CONVERT(DATE, COALESCE(dtClosed, dtAcquired, metric_date)), 'Acquired', CAST(1 AS DECIMAL(19, 4)),
               CONCAT('Acquired:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lDealID), base_row_key)), *
        FROM src
        WHERE ISNULL(lAcquired, 0) = 1
          AND COALESCE(dtClosed, dtAcquired, metric_date) >= @StartDateTime
          AND COALESCE(dtClosed, dtAcquired, metric_date) < @EndDateExclusive

        UNION ALL

        SELECT CONVERT(DATE, COALESCE(dtCompleted, dtIn, metric_date)), 'Demos', CAST(1 AS DECIMAL(19, 4)),
               CONCAT('Demos:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lTaskID), CONVERT(VARCHAR(50), lDealID), base_row_key)), *
        FROM src
        WHERE ISNULL(lDemo, 0) = 1
          AND COALESCE(dtCompleted, dtIn, metric_date) >= @StartDateTime
          AND COALESCE(dtCompleted, dtIn, metric_date) < @EndDateExclusive

        UNION ALL

        SELECT CONVERT(DATE, COALESCE(dtCompleted, dtIn, metric_date)), 'WriteUps', CAST(1 AS DECIMAL(19, 4)),
               CONCAT('WriteUps:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lTaskID), CONVERT(VARCHAR(50), lDealID), base_row_key)), *
        FROM src
        WHERE ISNULL(lWriteUp, 0) = 1
          AND COALESCE(dtCompleted, dtIn, metric_date) >= @StartDateTime
          AND COALESCE(dtCompleted, dtIn, metric_date) < @EndDateExclusive

        UNION ALL

        SELECT CONVERT(DATE, COALESCE(dtCompleted, dtIn, metric_date)), 'TOs', CAST(1 AS DECIMAL(19, 4)),
               CONCAT('TOs:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lTaskID), CONVERT(VARCHAR(50), lDealID), base_row_key)), *
        FROM src
        WHERE ISNULL(lTurnOver, 0) = 1
          AND COALESCE(dtCompleted, dtIn, metric_date) >= @StartDateTime
          AND COALESCE(dtCompleted, dtIn, metric_date) < @EndDateExclusive

        UNION ALL

        SELECT CONVERT(DATE, COALESCE(dtCompleted, dtIn, metric_date)), 'Appraisals', CAST(1 AS DECIMAL(19, 4)),
               CONCAT('Appraisals:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lTaskID), CONVERT(VARCHAR(50), lDealID), base_row_key)), *
        FROM src
        WHERE ISNULL(lAppraisal, 0) = 1
          AND COALESCE(dtCompleted, dtIn, metric_date) >= @StartDateTime
          AND COALESCE(dtCompleted, dtIn, metric_date) < @EndDateExclusive

        UNION ALL

        SELECT CONVERT(DATE, dtClosed), 'Lost', CAST(1 AS DECIMAL(19, 4)),
               CONCAT('Lost:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lDealID), base_row_key)), *
        FROM src
        WHERE ISNULL(lLost, 0) = 1
          AND dtClosed >= @StartDateTime AND dtClosed < @EndDateExclusive

        UNION ALL

        SELECT CONVERT(DATE, COALESCE(dtClosed, metric_date)), 'BadLead', CAST(1 AS DECIMAL(19, 4)),
               CONCAT('BadLead:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lDealID), base_row_key)), *
        FROM src
        WHERE ISNULL(lBadLead, 0) = 1
          AND COALESCE(dtClosed, metric_date) >= @StartDateTime
          AND COALESCE(dtClosed, metric_date) < @EndDateExclusive

        UNION ALL

        SELECT CONVERT(DATE, COALESCE(dtClosed, metric_date)), 'BoughtElsewhere', CAST(1 AS DECIMAL(19, 4)),
               CONCAT('BoughtElsewhere:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lDealID), base_row_key)), *
        FROM src
        WHERE ISNULL(lBoughtElseWhere, 0) = 1
          AND COALESCE(dtClosed, metric_date) >= @StartDateTime
          AND COALESCE(dtClosed, metric_date) < @EndDateExclusive

        UNION ALL

        SELECT CONVERT(DATE, COALESCE(dtCompleted, dtProspectIn, metric_date)), 'Reassigned', CAST(1 AS DECIMAL(19, 4)),
               CONCAT('Reassigned:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lTaskID), CONVERT(VARCHAR(50), lDealID), base_row_key)), *
        FROM src
        WHERE ISNULL(lReassigned, 0) = 1
          AND COALESCE(dtCompleted, dtProspectIn, metric_date) >= @StartDateTime
          AND COALESCE(dtCompleted, dtProspectIn, metric_date) < @EndDateExclusive

        UNION ALL

        SELECT CONVERT(DATE, COALESCE(dtCompleted, dtProspectIn, metric_date)), 'ResponseTime', CAST(lResponseTime AS DECIMAL(19, 4)),
               CONCAT('ResponseTime:', lCompanyID, ':', COALESCE(CONVERT(VARCHAR(50), lTaskID), CONVERT(VARCHAR(50), lDealID), base_row_key)), *
        FROM src
        WHERE lResponseTime IS NOT NULL
          AND COALESCE(dtCompleted, dtProspectIn, metric_date) >= @StartDateTime
          AND COALESCE(dtCompleted, dtProspectIn, metric_date) < @EndDateExclusive
    ),
    deduped_events AS
    (
        SELECT
            me.*,
            ROW_NUMBER() OVER
            (
                PARTITION BY
                    me.EventMetricDate,
                    me.EventMetricName,
                    me.lCompanyID,
                    ISNULL(me.lChildCompanyID, -1),
                    me.MetricEventKey
                ORDER BY
                    me.base_row_key
            ) AS metric_event_rank
        FROM metric_events me
        WHERE me.EventMetricDate IS NOT NULL
    )
    INSERT dbo.ELeadTrafficMetricFact
    (
        MetricRunID,
        MetricDate,
        MetricName,
        MetricValue,
        lCompanyID,
        lChildCompanyID,
        szNewUsed,
        szUpType,
        szSource,
        szSubSource,
        MetricEventKey,
        BaseRowKey,
        RecordType,
        RowOrigin,
        MetricGrain,
        RecordTypeReason,
        lDealID,
        lTaskID,
        lPurchaseDetailsID,
        lPersonID,
        ProspectVin,
        SoldVin,
        ServiceVin,
        ResolvedVin,
        VinResolutionSource,
        SoldVinResolutionStatus,
        ProspectVinResolutionStatus,
        ServiceVinResolutionStatus,
        ResolvedVinStatus
    )
    SELECT
        @MetricRunID,
        EventMetricDate,
        EventMetricName,
        EventMetricValue,
        lCompanyID,
        lChildCompanyID,
        szNewUsed,
        szUpType,
        szSource,
        szSubSource,
        MetricEventKey,
        base_row_key,
        record_type,
        row_origin,
        metric_grain,
        record_type_reason,
        lDealID,
        lTaskID,
        lPurchaseDetailsID,
        lPersonID,
        prospect_vin,
        sold_vin,
        service_vin,
        resolved_vin,
        vin_resolution_source,
        sold_vin_resolution_status,
        prospect_vin_resolution_status,
        service_vin_resolution_status,
        resolved_vin_status
    FROM deduped_events
    WHERE metric_event_rank = 1;

    WITH fact_rollup AS
    (
        SELECT
            MetricDate,
            lCompanyID,
            lChildCompanyID,
            szNewUsed,
            szUpType,
            szSource,
            szSubSource,
            SUM(CASE WHEN MetricName = 'LeadCount' THEN MetricValue ELSE 0 END) AS LeadCount,
            SUM(CASE WHEN MetricName = 'ShowroomVisits' THEN MetricValue ELSE 0 END) AS ShowroomVisits,
            SUM(CASE WHEN MetricName = 'Bebacks' THEN MetricValue ELSE 0 END) AS Bebacks,
            SUM(CASE WHEN MetricName = 'Sold' THEN MetricValue ELSE 0 END) AS Sold,
            SUM(CASE WHEN MetricName = 'ApptCreated' THEN MetricValue ELSE 0 END) AS ApptCreated,
            SUM(CASE WHEN MetricName = 'ApptDue' THEN MetricValue ELSE 0 END) AS ApptDue,
            SUM(CASE WHEN MetricName = 'ApptShown' THEN MetricValue ELSE 0 END) AS ApptShown,
            SUM(CASE WHEN MetricName = 'ApptSold' THEN MetricValue ELSE 0 END) AS ApptSold,
            SUM(CASE WHEN MetricName = 'ApptConfirmed' THEN MetricValue ELSE 0 END) AS ApptConfirmed,
            SUM(CASE WHEN MetricName = 'ApptAttemptedConfirmed' THEN MetricValue ELSE 0 END) AS ApptAttemptedConfirmed,
            SUM(CASE WHEN MetricName = 'ApprApptCreated' THEN MetricValue ELSE 0 END) AS ApprApptCreated,
            SUM(CASE WHEN MetricName = 'ApprApptDue' THEN MetricValue ELSE 0 END) AS ApprApptDue,
            SUM(CASE WHEN MetricName = 'ApprApptShown' THEN MetricValue ELSE 0 END) AS ApprApptShown,
            SUM(CASE WHEN MetricName = 'ApprApptAcquired' THEN MetricValue ELSE 0 END) AS ApprApptAcquired,
            SUM(CASE WHEN MetricName = 'ApprApptConfirmed' THEN MetricValue ELSE 0 END) AS ApprApptConfirmed,
            SUM(CASE WHEN MetricName = 'Acquired' THEN MetricValue ELSE 0 END) AS Acquired,
            SUM(CASE WHEN MetricName IN ('ApprApptCreated', 'ApprApptDue', 'ApprApptShown', 'ApprApptAcquired', 'ApprApptConfirmed') THEN MetricValue ELSE 0 END) AS IsAppraisalAppt,
            SUM(CASE WHEN MetricName = 'Demos' THEN MetricValue ELSE 0 END) AS Demos,
            SUM(CASE WHEN MetricName = 'WriteUps' THEN MetricValue ELSE 0 END) AS WriteUps,
            SUM(CASE WHEN MetricName = 'TOs' THEN MetricValue ELSE 0 END) AS TOs,
            SUM(CASE WHEN MetricName = 'Appraisals' THEN MetricValue ELSE 0 END) AS Appraisals,
            SUM(CASE WHEN MetricName = 'Lost' THEN MetricValue ELSE 0 END) AS Lost,
            SUM(CASE WHEN MetricName = 'BadLead' THEN MetricValue ELSE 0 END) AS BadLead,
            SUM(CASE WHEN MetricName = 'BoughtElsewhere' THEN MetricValue ELSE 0 END) AS BoughtElsewhere,
            SUM(CASE WHEN MetricName = 'Reassigned' THEN MetricValue ELSE 0 END) AS Reassigned,
            AVG(CASE WHEN MetricName = 'ResponseTime' THEN MetricValue ELSE NULL END) AS ResponseTime
        FROM dbo.ELeadTrafficMetricFact
        WHERE MetricRunID = @MetricRunID
        GROUP BY
            MetricDate,
            lCompanyID,
            lChildCompanyID,
            szNewUsed,
            szUpType,
            szSource,
            szSubSource
    ),
    audit_rollup AS
    (
        SELECT
            CONVERT(DATE, metric_date) AS MetricDate,
            lCompanyID,
            lChildCompanyID,
            szNewUsed,
            szUpType,
            szSource,
            szSubSource,
            COUNT_BIG(*) AS BaseRows,
            COUNT(DISTINCT lDealID) AS DistinctDeals,
            COUNT(DISTINCT lTaskID) AS DistinctTasks,
            SUM(CASE WHEN record_type = 'sold' THEN 1 ELSE 0 END) AS SoldLifecycleRows,
            SUM(CASE WHEN record_type = 'sold' AND sold_vin IS NOT NULL THEN 1 ELSE 0 END) AS SoldRowsWithSoldVin,
            SUM(CASE WHEN record_type = 'sold' AND sold_vin IS NULL THEN 1 ELSE 0 END) AS SoldRowsMissingSoldVin,
            SUM(CASE WHEN resolved_vin IS NOT NULL THEN 1 ELSE 0 END) AS RowsWithResolvedVin,
            SUM(CASE WHEN resolved_vin IS NULL THEN 1 ELSE 0 END) AS RowsWithoutResolvedVin
        FROM src
        WHERE metric_date >= @StartDateTime
          AND metric_date < @EndDateExclusive
        GROUP BY
            CONVERT(DATE, metric_date),
            lCompanyID,
            lChildCompanyID,
            szNewUsed,
            szUpType,
            szSource,
            szSubSource
    )
    INSERT dbo.ELeadTrafficDailySummary
    (
        MetricRunID,
        MetricDate,
        lCompanyID,
        lChildCompanyID,
        szNewUsed,
        szUpType,
        szSource,
        szSubSource,
        LeadCount,
        ShowroomVisits,
        Bebacks,
        Sold,
        ApptCreated,
        ApptDue,
        ApptShown,
        ApptSold,
        ApptConfirmed,
        ApptAttemptedConfirmed,
        ApprApptCreated,
        ApprApptDue,
        ApprApptShown,
        ApprApptAcquired,
        ApprApptConfirmed,
        Acquired,
        IsAppraisalAppt,
        Demos,
        WriteUps,
        TOs,
        Appraisals,
        Lost,
        BadLead,
        BoughtElsewhere,
        Reassigned,
        ResponseTime,
        BaseRows,
        DistinctDeals,
        DistinctTasks,
        SoldLifecycleRows,
        SoldRowsWithSoldVin,
        SoldRowsMissingSoldVin,
        RowsWithResolvedVin,
        RowsWithoutResolvedVin
    )
    SELECT
        @MetricRunID,
        COALESCE(fr.MetricDate, ar.MetricDate) AS MetricDate,
        COALESCE(fr.lCompanyID, ar.lCompanyID) AS lCompanyID,
        COALESCE(fr.lChildCompanyID, ar.lChildCompanyID) AS lChildCompanyID,
        COALESCE(fr.szNewUsed, ar.szNewUsed) AS szNewUsed,
        COALESCE(fr.szUpType, ar.szUpType) AS szUpType,
        COALESCE(fr.szSource, ar.szSource) AS szSource,
        COALESCE(fr.szSubSource, ar.szSubSource) AS szSubSource,
        CONVERT(INT, COALESCE(fr.LeadCount, 0)),
        CONVERT(INT, COALESCE(fr.ShowroomVisits, 0)),
        CONVERT(INT, COALESCE(fr.Bebacks, 0)),
        CONVERT(INT, COALESCE(fr.Sold, 0)),
        CONVERT(INT, COALESCE(fr.ApptCreated, 0)),
        CONVERT(INT, COALESCE(fr.ApptDue, 0)),
        CONVERT(INT, COALESCE(fr.ApptShown, 0)),
        CONVERT(INT, COALESCE(fr.ApptSold, 0)),
        CONVERT(INT, COALESCE(fr.ApptConfirmed, 0)),
        CONVERT(INT, COALESCE(fr.ApptAttemptedConfirmed, 0)),
        CONVERT(INT, COALESCE(fr.ApprApptCreated, 0)),
        CONVERT(INT, COALESCE(fr.ApprApptDue, 0)),
        CONVERT(INT, COALESCE(fr.ApprApptShown, 0)),
        CONVERT(INT, COALESCE(fr.ApprApptAcquired, 0)),
        CONVERT(INT, COALESCE(fr.ApprApptConfirmed, 0)),
        CONVERT(INT, COALESCE(fr.Acquired, 0)),
        CONVERT(INT, COALESCE(fr.IsAppraisalAppt, 0)),
        CONVERT(INT, COALESCE(fr.Demos, 0)),
        CONVERT(INT, COALESCE(fr.WriteUps, 0)),
        CONVERT(INT, COALESCE(fr.TOs, 0)),
        CONVERT(INT, COALESCE(fr.Appraisals, 0)),
        CONVERT(INT, COALESCE(fr.Lost, 0)),
        CONVERT(INT, COALESCE(fr.BadLead, 0)),
        CONVERT(INT, COALESCE(fr.BoughtElsewhere, 0)),
        CONVERT(INT, COALESCE(fr.Reassigned, 0)),
        fr.ResponseTime,
        CONVERT(INT, COALESCE(ar.BaseRows, 0)),
        CONVERT(INT, COALESCE(ar.DistinctDeals, 0)),
        CONVERT(INT, COALESCE(ar.DistinctTasks, 0)),
        CONVERT(INT, COALESCE(ar.SoldLifecycleRows, 0)),
        CONVERT(INT, COALESCE(ar.SoldRowsWithSoldVin, 0)),
        CONVERT(INT, COALESCE(ar.SoldRowsMissingSoldVin, 0)),
        CONVERT(INT, COALESCE(ar.RowsWithResolvedVin, 0)),
        CONVERT(INT, COALESCE(ar.RowsWithoutResolvedVin, 0))
    FROM fact_rollup fr
    FULL OUTER JOIN audit_rollup ar
        ON ar.MetricDate = fr.MetricDate
       AND ISNULL(ar.lCompanyID, -1) = ISNULL(fr.lCompanyID, -1)
       AND ISNULL(ar.lChildCompanyID, -1) = ISNULL(fr.lChildCompanyID, -1)
       AND ISNULL(ar.szNewUsed, '') = ISNULL(fr.szNewUsed, '')
       AND ISNULL(ar.szUpType, '') = ISNULL(fr.szUpType, '')
       AND ISNULL(ar.szSource, '') = ISNULL(fr.szSource, '')
       AND ISNULL(ar.szSubSource, '') = ISNULL(fr.szSubSource, '');

    SELECT
        @MetricRunID AS MetricRunID,
        @StartDate AS StartDate,
        @EndDate AS EndDate,
        @@ROWCOUNT AS DailySummaryRowsInserted;
END;
GO

/*
Example:

EXEC dbo.usp_LoadELeadTrafficMetricsFromBase
      @StartDate = '2026-06-01'
    , @EndDate = '2026-06-02'
    , @ReloadWindow = 1;

SELECT *
FROM dbo.ELeadTrafficDailySummary
WHERE MetricDate BETWEEN '2026-06-01' AND '2026-06-02'
ORDER BY MetricDate, lCompanyID, lChildCompanyID, szNewUsed, szUpType;
*/
