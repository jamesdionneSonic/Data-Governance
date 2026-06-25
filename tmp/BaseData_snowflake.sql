-- Snowflake version of the flat base-data extract for the eLeadDW traffic metrics.
-- Run this from the Snowflake database/schema that contains the mirrored eLeadDW dbo tables,
-- or prefix table names with your database/schema, for example ELEADDW.DBO.DWFULLDEAL.
-- This version avoids Snowflake session variables so it can run as one worksheet statement.

WITH params AS (
    SELECT
        TO_TIMESTAMP_NTZ('2026-06-01 00:00:00') AS dtStart,
        TO_TIMESTAMP_NTZ('2026-06-02 23:59:59') AS dtEnd,
        CAST(NULL AS NUMBER) AS ParentCompanyID,
        CAST(NULL AS NUMBER) AS ChildCompanyID,
        0 AS bIgnoreShowDMSSoldOnly
),

company_scope AS (
    SELECT
        c.lCompanyID,
        c.szCompany,
        c.lCompanyID AS lChildCompanyID,
        c.szCompany AS szChildCompany,
        p.dtStart AS dtStartLocal,
        p.dtEnd AS dtEndLocal,
        p.bIgnoreShowDMSSoldOnly,
        0 AS nLocalTimeConversion,
        COALESCE(crm.CRMSold, 0) AS CRMSold,
        COALESCE(c.bShowDMSSold, 0) AS bShowDMSSold,
        CASE WHEN c.bNewUsed = 1 THEN 'U' ELSE 'N' END AS szDefaultNewUsed,
        COALESCE(c.bHasDaylightSavingTime, 1) AS bHasDaylightSavingTime,
        CASE WHEN split.lCompanyID IS NOT NULL THEN 1 ELSE 0 END AS bSplitDeals
    FROM dwFullCompany c
    CROSS JOIN params p
    LEFT JOIN ProcCRMSoldLU crm
        ON crm.lCompanyID = c.lCompanyID
    LEFT JOIN dwFullReportCreditConfiguration split
        ON split.lCompanyID = c.lCompanyID
       AND split.nliConfigurationID = 2587
    WHERE c.bActive = 1
      AND c.bDealership = 1
      AND (p.ChildCompanyID IS NULL OR c.lCompanyID = p.ChildCompanyID)
      AND (
            p.ParentCompanyID IS NULL
            OR EXISTS (
                SELECT 1
                FROM dwFullCompanyHierarchy ch
                WHERE ch.lParentID = p.ParentCompanyID
                  AND ch.lChildID = c.lCompanyID
                  AND ch.bChildActive = 1
                  AND ch.bChildDealership = 1
            )
      )
),

tasks_of_interest AS (
    SELECT DISTINCT
        t.lCompanyID,
        t.lTaskID
    FROM company_scope cs
    JOIN dwFullActivity t
        ON t.lCompanyID = cs.lCompanyID
       AND t.dtCompleted BETWEEN cs.dtStartLocal AND cs.dtEndLocal
       AND t.lDealID IS NOT NULL
       AND t.lCustomerID <> -1

    UNION

    SELECT DISTINCT
        t.lCompanyID,
        t.lTaskID
    FROM company_scope cs
    JOIN dwFullActivity t
        ON t.lCompanyID = cs.lCompanyID
       AND t.dtDue BETWEEN cs.dtStartLocal AND cs.dtEndLocal
       AND t.lTaskTypeID IN (7, 65)
       AND t.lDealID IS NOT NULL
       AND t.lCustomerID <> -1

    UNION

    SELECT DISTINCT
        t.lCompanyID,
        t.lTaskID
    FROM company_scope cs
    JOIN dwFullActivity t
        ON t.lCompanyID = cs.lCompanyID
       AND t.dtEntry BETWEEN cs.dtStartLocal AND cs.dtEndLocal
       AND t.lTaskTypeID IN (7, 65)
       AND t.lDealID IS NOT NULL
       AND t.lCustomerID <> -1
),

activity_rows AS (
    SELECT
        'activity' AS row_origin,
        'task' AS metric_grain,
        CASE
            WHEN t.szTaskType ILIKE '%Service%' THEN 'service'
            ELSE 'opportunity_activity'
        END AS record_type,
        t.lCompanyID,
        t.lCustomerID AS lPersonID,
        t.lDealID,
        t.lTaskID,
        t.lTaskTypeID,
        t.szTaskType,
        t.lCreatorID AS lCreatedByID,
        t.lCurrentOwnerID,
        t.lCompletedByID,
        t.dtEntry,
        t.dtDue,
        t.dtCompleted,
        t.dtClosed AS dtTaskClosed,
        t.lVehicleID AS service_vehicle_id,
        t.lReferenceID,
        t.nliReferenceSourceID,
        t.lSourceID AS activity_lSourceID,
        t.szSource AS activity_szSource,
        t.szSubSource AS activity_szSubSource
    FROM tasks_of_interest toi
    JOIN dwFullActivity t
        ON t.lCompanyID = toi.lCompanyID
       AND t.lTaskID = toi.lTaskID
    WHERE t.lTaskTypeID IN (7, 8, 9, 13, 21, 31, 65)
),

service_rows AS (
    SELECT
        'service_activity' AS row_origin,
        'service_activity' AS metric_grain,
        'service' AS record_type,
        t.lCompanyID,
        t.lCustomerID AS lPersonID,
        t.lDealID,
        t.lTaskID,
        t.lTaskTypeID,
        t.szTaskType,
        t.lCreatorID AS lCreatedByID,
        t.lCurrentOwnerID,
        t.lCompletedByID,
        t.dtEntry,
        t.dtDue,
        t.dtCompleted,
        t.dtClosed AS dtTaskClosed,
        t.lVehicleID AS service_vehicle_id,
        t.lReferenceID,
        t.nliReferenceSourceID,
        t.lSourceID AS activity_lSourceID,
        t.szSource AS activity_szSource,
        t.szSubSource AS activity_szSubSource
    FROM company_scope cs
    JOIN dwFullActivity t
        ON t.lCompanyID = cs.lCompanyID
       AND t.lVehicleID IS NOT NULL
       AND t.szTaskType ILIKE '%Service%'
    WHERE t.dtEntry BETWEEN cs.dtStartLocal AND cs.dtEndLocal
      AND NOT EXISTS (
            SELECT 1
            FROM tasks_of_interest toi
            WHERE toi.lCompanyID = t.lCompanyID
              AND toi.lTaskID = t.lTaskID
      )
),

deal_rows AS (
    SELECT
        'deal' AS row_origin,
        'deal' AS metric_grain,
        CASE
            WHEN d.nliColorID = 16 OR d.szDealSubStatus ILIKE '%Sold%' THEN 'sold'
            WHEN d.nliColorID = 17 THEN 'inactive_or_lost'
            ELSE 'prospect'
        END AS record_type,
        d.lCompanyID,
        d.lPersonID,
        d.lDealID,
        CAST(NULL AS NUMBER) AS lTaskID,
        CAST(NULL AS NUMBER) AS lTaskTypeID,
        CAST(NULL AS VARCHAR) AS szTaskType,
        CAST(NULL AS NUMBER) AS lCreatedByID,
        CAST(NULL AS NUMBER) AS lCurrentOwnerID,
        CAST(NULL AS NUMBER) AS lCompletedByID,
        d.dtEntry,
        CAST(NULL AS TIMESTAMP_NTZ) AS dtDue,
        CAST(NULL AS TIMESTAMP_NTZ) AS dtCompleted,
        CAST(NULL AS TIMESTAMP_NTZ) AS dtTaskClosed,
        CAST(NULL AS NUMBER) AS service_vehicle_id,
        CAST(NULL AS NUMBER) AS lReferenceID,
        CAST(NULL AS NUMBER) AS nliReferenceSourceID,
        d.lSourceID AS activity_lSourceID,
        CAST(NULL AS VARCHAR) AS activity_szSource,
        d.szSubSource AS activity_szSubSource
    FROM company_scope cs
    JOIN dwFullDeal d
        ON d.lCompanyID = cs.lCompanyID
    WHERE d.lSourceID IS NOT NULL
      AND d.nliColorID BETWEEN 15 AND 18
      AND (
            d.dtProspectIn BETWEEN cs.dtStartLocal AND cs.dtEndLocal
            OR d.dtClosed BETWEEN cs.dtStartLocal AND cs.dtEndLocal
            OR d.szDealSubStatus IN ('Vehicle Acquired', 'Bad Lead')
      )
      AND NOT EXISTS (
            SELECT 1
            FROM activity_rows ar
            WHERE ar.lDealID = d.lDealID
              AND ar.lCompanyID = d.lCompanyID
      )
),

base_union AS (
    SELECT * FROM activity_rows
    UNION ALL
    SELECT * FROM service_rows
    UNION ALL
    SELECT * FROM deal_rows
),

deal_context AS (
    SELECT
        d.lCompanyID,
        d.lDealID,
        d.lPersonID,
        d.lSourceID,
        d.szUpType,
        d.szUpSource,
        d.nliColorID,
        d.szStatus,
        d.dtClosed,
        d.lDealSubStatusID,
        d.szDealSubStatus,
        d.bBeBack,
        d.dtBeBack,
        d.dtProspectIn,
        d.dtEntry AS dtDealEntry,
        d.lSubSourceID,
        d.szSubSource,
        d.lChildCompanyID
    FROM dwFullDeal d
),

active_customer AS (
    SELECT
        c.lCompanyID,
        c.lPersonID
    FROM dwFullCustomer c
    WHERE c.bActive = 1
),

vehicle_sought_ranked AS (
    SELECT
        vs.lVehicleSoughtID,
        vs.lDealID,
        vs.lMakeID,
        vs.szMake,
        vs.lModelID,
        vs.szModel,
        vs.szTrim,
        vs.bNewUsed,
        vs.szStockNumber,
        vs.szSoughtVIN,
        vs.dtEntry,
        vs.dtLastEdit,
        ROW_NUMBER() OVER (
            PARTITION BY vs.lDealID
            ORDER BY
                CASE WHEN vs.bActive = 1 THEN 0 ELSE 1 END,
                vs.dtLastEdit DESC,
                vs.dtEntry DESC,
                vs.lVehicleSoughtID DESC
        ) AS rn
    FROM dwFullVehicleSought vs
),

vehicle_sought AS (
    SELECT
        lVehicleSoughtID,
        lDealID,
        lMakeID,
        szMake,
        lModelID,
        szModel,
        szTrim,
        bNewUsed,
        szStockNumber,
        CASE
            WHEN LENGTH(szSoughtVIN) = 17 THEN szSoughtVIN
            ELSE NULL
        END AS prospect_vin
    FROM vehicle_sought_ranked
    WHERE rn = 1
),

purchase_ranked AS (
    SELECT
        pd.lPurchaseDetailsID,
        pd.lDealID,
        pd.lVehicleID,
        pd.lVehicleOwnerID,
        pd.szLegacyDealID,
        pd.dtSold,
        pd.curFrontGross,
        pd.curBackGross,
        pd.curTotalGross,
        pd.dFinanceRate,
        pd.curFinanceAmount,
        pd.szNewUsed,
        pd.nliDataSourceID,
        pd.szDataSource,
        pd.dtAcquired,
        pd.curActualCashValue,
        pd.curReconditioning,
        pd.curCostpd,
        v.szVIN AS sold_vin,
        v.lMakeID AS sold_lMakeID,
        v.szMake AS sold_szMake,
        ROW_NUMBER() OVER (
            PARTITION BY pd.lDealID
            ORDER BY pd.dtSold DESC, pd.lPurchaseDetailsID DESC
        ) AS rn
    FROM dwFullPurchaseDetails pd
    LEFT JOIN dwFullVehicle v
        ON v.lVehicleID = pd.lVehicleID
),

purchase_context AS (
    SELECT
        lPurchaseDetailsID,
        lDealID,
        lVehicleID,
        lVehicleOwnerID,
        szLegacyDealID,
        dtSold,
        curFrontGross,
        curBackGross,
        curTotalGross,
        dFinanceRate,
        curFinanceAmount,
        szNewUsed,
        nliDataSourceID,
        szDataSource,
        dtAcquired,
        curActualCashValue,
        curReconditioning,
        curCostpd,
        sold_vin,
        sold_lMakeID,
        sold_szMake
    FROM purchase_ranked
    WHERE rn = 1
),

service_vehicle AS (
    SELECT
        v.lVehicleID,
        CASE
            WHEN LENGTH(v.szVIN) = 17 THEN v.szVIN
            ELSE NULL
        END AS service_vin,
        v.lMakeID AS service_lMakeID,
        v.szMake AS service_szMake,
        v.szModel AS service_szModel
    FROM dwFullVehicle v
),

appointment_confirmation AS (
    SELECT
        tr.lTaskID,
        tr.lCompanyID,
        COALESCE(tr.dtCompleted, tr.dtEntry) AS dtApptConfirmedRaw,
        tr.lCompletedByID AS lApptConfirmedByID,
        ROW_NUMBER() OVER (
            PARTITION BY tr.lCompanyID, tr.lTaskID
            ORDER BY COALESCE(tr.dtCompleted, tr.dtEntry) DESC, tr.lTaskReminderID DESC
        ) AS rn
    FROM dwFullTaskReminder tr
    WHERE tr.nliOutcomeID = 1
),

task_item_flags AS (
    SELECT
        ti.lCompanyID,
        ti.lTaskID,
        MAX(CASE WHEN ti.nliListItemID = 162 THEN 1 ELSE 0 END) AS lTurnOver,
        MAX(CASE WHEN ti.nliListItemID = 163 THEN 1 ELSE 0 END) AS lWriteUp,
        MAX(CASE WHEN ti.nliListItemID = 164 THEN 1 ELSE 0 END) AS lDemo,
        MAX(CASE WHEN ti.nliListItemID = 280 THEN 1 ELSE 0 END) AS lAppraisal
    FROM dwFullTaskItem ti
    GROUP BY
        ti.lCompanyID,
        ti.lTaskID
),

attempted_confirmation AS (
    SELECT
        x.lCompanyID,
        x.lTaskID,
        x.dtAttemptedConfirmed,
        1 AS lApptAttemptedConfirmed
    FROM (
        SELECT
            ti.lCompanyID,
            ti.lTaskID,
            ti.dtDate AS dtAttemptedConfirmed,
            ROW_NUMBER() OVER (
                PARTITION BY ti.lCompanyID, ti.lTaskID
                ORDER BY ti.dtDate DESC, ti.lTaskItemID DESC
            ) AS rn
        FROM dwFullTaskItem ti
        WHERE ti.nliListID = 175
          AND ti.nliListItemID NOT IN (2621, 7813)
    ) x
    WHERE x.rn = 1
),

salesperson_ranked AS (
    SELECT
        dsm.lDealID,
        dsm.lSalespersonID,
        dsm.bPrimary,
        dsm.nliPositionType,
        dsm.szPositionType,
        ROW_NUMBER() OVER (
            PARTITION BY dsm.lDealID
            ORDER BY
                CASE WHEN dsm.bPrimary = 1 THEN 0 ELSE 1 END,
                CASE WHEN dsm.nliPositionType = 355 THEN 0 ELSE 1 END,
                dsm.dtLastEdit DESC
        ) AS primary_rank,
        ROW_NUMBER() OVER (
            PARTITION BY dsm.lDealID
            ORDER BY
                CASE WHEN dsm.bPrimary = 0 THEN 0 ELSE 1 END,
                dsm.dtLastEdit DESC
        ) AS secondary_rank
    FROM dwFullDealSalespersonMap dsm
    WHERE dsm.dwActive = 1
),

salesperson_context AS (
    SELECT
        lDealID,
        MAX(CASE WHEN primary_rank = 1 THEN lSalespersonID END) AS lPrimarySalespersonID,
        MAX(CASE WHEN secondary_rank = 1 AND bPrimary = 0 THEN lSalespersonID END) AS lSalespersonID
    FROM salesperson_ranked
    GROUP BY lDealID
),

source_context AS (
    SELECT
        s.lSourceID,
        s.szSource,
        s.nliCategoryID,
        s.nliInternetUpTierID
    FROM dwFullSource s
),

company_source_context AS (
    SELECT
        cs.lCompanyID,
        cs.lSourceID,
        cs.szCompanySource,
        cs.nliInternetUpTierID
    FROM dwFullCompanySource cs
),

desklog_visit AS (
    SELECT
        dv.lCompanyID,
        dv.lDealID,
        dv.lTaskID,
        MIN(dv.dtIn) AS dtIn
    FROM dwFullDesklogVisit dv
    GROUP BY
        dv.lCompanyID,
        dv.lDealID,
        dv.lTaskID
),

enriched_base AS (
    SELECT
        bu.row_origin,
        bu.metric_grain,
        bu.record_type,
        CONCAT(
            bu.row_origin,
            ':',
            COALESCE(
                TO_VARCHAR(bu.lTaskID),
                TO_VARCHAR(bu.lDealID),
                TO_VARCHAR(bu.service_vehicle_id)
            )
        ) AS base_row_key,
        bu.lCompanyID,
        COALESCE(dc.lChildCompanyID, bu.lCompanyID) AS lChildCompanyID,
        bu.lPersonID,
        bu.lDealID,
        bu.lTaskID,
        bu.lTaskTypeID,
        bu.szTaskType,
        COALESCE(dc.lSourceID, bu.activity_lSourceID) AS lSourceID,
        COALESCE(dc.szSubSource, bu.activity_szSubSource) AS szSubSource,
        dc.szUpType,
        dc.szUpSource,
        dc.nliColorID,
        dc.szStatus,
        dc.lDealSubStatusID,
        dc.szDealSubStatus,
        dc.dtProspectIn,
        dc.dtClosed,
        dc.dtDealEntry,
        bu.dtEntry,
        bu.dtDue,
        bu.dtCompleted,
        bu.dtTaskClosed,
        bu.lCreatedByID,
        bu.lCurrentOwnerID,
        bu.lCompletedByID,
        bu.lReferenceID,
        bu.nliReferenceSourceID,
        bu.service_vehicle_id,
        dc.bBeBack,
        dc.dtBeBack,
        cs.dtStartLocal,
        cs.dtEndLocal,
        cs.nLocalTimeConversion,
        cs.bIgnoreShowDMSSoldOnly,
        cs.CRMSold,
        cs.bShowDMSSold,
        cs.szDefaultNewUsed,
        cs.bHasDaylightSavingTime,
        cs.bSplitDeals
    FROM base_union bu
    JOIN company_scope cs
        ON cs.lCompanyID = bu.lCompanyID
    LEFT JOIN deal_context dc
        ON dc.lDealID = bu.lDealID
       AND dc.lCompanyID = bu.lCompanyID
    WHERE bu.record_type = 'service'
       OR EXISTS (
            SELECT 1
            FROM active_customer ac
            WHERE ac.lCompanyID = bu.lCompanyID
              AND ac.lPersonID = bu.lPersonID
       )
),

final_base AS (
    SELECT
        eb.base_row_key,
        eb.record_type,
        eb.row_origin,
        eb.metric_grain,
        CASE
            WHEN eb.record_type = 'service' THEN COALESCE(eb.dtCompleted, eb.dtEntry)
            WHEN pc.dtSold IS NOT NULL THEN pc.dtSold
            WHEN eb.dtCompleted IS NOT NULL THEN eb.dtCompleted
            WHEN eb.dtProspectIn IS NOT NULL THEN eb.dtProspectIn
            WHEN eb.dtClosed IS NOT NULL THEN eb.dtClosed
            ELSE eb.dtEntry
        END AS metric_date,
        CASE WHEN LENGTH(vs.prospect_vin) = 17 THEN vs.prospect_vin ELSE NULL END AS prospect_vin,
        CASE WHEN LENGTH(pc.sold_vin) = 17 THEN pc.sold_vin ELSE NULL END AS sold_vin,
        CASE WHEN LENGTH(sv.service_vin) = 17 THEN sv.service_vin ELSE NULL END AS service_vin,
        CASE
            WHEN LENGTH(pc.sold_vin) = 17 THEN pc.sold_vin
            WHEN LENGTH(vs.prospect_vin) = 17 THEN vs.prospect_vin
            WHEN LENGTH(sv.service_vin) = 17 THEN sv.service_vin
            ELSE NULL
        END AS resolved_vin,
        CASE
            WHEN LENGTH(pc.sold_vin) = 17 THEN 'dwFullPurchaseDetails.lVehicleID -> dwFullVehicle.szVIN'
            WHEN LENGTH(vs.prospect_vin) = 17 THEN 'dwFullVehicleSought.szSoughtVIN'
            WHEN LENGTH(sv.service_vin) = 17 THEN 'dwFullActivity.lVehicleID -> dwFullVehicle.szVIN'
            ELSE 'unresolved'
        END AS vin_resolution_source,
        vs.lVehicleSoughtID AS prospect_vehicle_sought_id,
        pc.lVehicleID AS sold_vehicle_id,
        eb.service_vehicle_id,
        COALESCE(
            pc.szNewUsed,
            CASE WHEN vs.bNewUsed = 1 THEN 'U' WHEN vs.bNewUsed = 0 THEN 'N' ELSE eb.szDefaultNewUsed END
        ) AS szNewUsed,
        COALESCE(pc.sold_lMakeID, vs.lMakeID, sv.service_lMakeID) AS lMakeID,
        CASE
            WHEN eb.record_type <> 'service'
             AND eb.dtProspectIn BETWEEN eb.dtStartLocal AND eb.dtEndLocal
             AND eb.lSourceID IS NOT NULL
             AND eb.nliColorID BETWEEN 15 AND 18 THEN 1
            ELSE 0
        END AS lUp,
        CASE
            WHEN eb.record_type <> 'service'
             AND eb.lTaskTypeID IN (7, 8, 31)
             AND eb.dtCompleted BETWEEN eb.dtStartLocal AND eb.dtEndLocal THEN 1
            WHEN dv.dtIn BETWEEN eb.dtStartLocal AND eb.dtEndLocal THEN 1
            ELSE 0
        END AS lVisit,
        CASE
            WHEN eb.record_type <> 'service'
             AND (eb.bBeBack = 1 OR eb.dtBeBack IS NOT NULL) THEN 1
            ELSE 0
        END AS lBeBack,
        CASE
            WHEN eb.record_type <> 'service'
             AND pc.lPurchaseDetailsID IS NOT NULL
             AND pc.dtSold BETWEEN eb.dtStartLocal AND eb.dtEndLocal
             AND eb.nliColorID = 16
             AND (
                    eb.bIgnoreShowDMSSoldOnly = 1
                    OR pc.nliDataSourceID = 172
                    OR (pc.nliDataSourceID = 171 AND eb.CRMSold = 1)
                 )
             AND NOT (eb.CRMSold = 0 AND eb.lDealSubStatusID <> 8) THEN 1
            ELSE 0
        END AS lSold,
        CASE
            WHEN eb.lTaskTypeID IN (7, 65)
             AND eb.dtEntry BETWEEN eb.dtStartLocal AND eb.dtEndLocal THEN 1
            ELSE 0
        END AS lApptCreated,
        CASE
            WHEN eb.lTaskTypeID IN (7, 65)
             AND eb.dtDue BETWEEN eb.dtStartLocal AND eb.dtEndLocal THEN 1
            ELSE 0
        END AS lApptDue,
        CASE
            WHEN eb.lTaskTypeID IN (7, 65)
             AND eb.dtCompleted BETWEEN eb.dtStartLocal AND eb.dtEndLocal THEN 1
            ELSE 0
        END AS lApptShown,
        CASE
            WHEN eb.lTaskTypeID = 7
             AND pc.dtSold IS NOT NULL
             AND eb.dtCompleted IS NOT NULL
             AND (
                    DATEDIFF('day', eb.dtCompleted, pc.dtSold) = 0
                    OR (eb.lChildCompanyID = 18467 AND DATEDIFF('day', eb.dtCompleted, pc.dtSold) BETWEEN 0 AND 7)
                 ) THEN 1
            ELSE 0
        END AS lApptSold,
        CASE
            WHEN eb.lTaskTypeID IN (7, 65)
             AND appt_confirm.dtApptConfirmedRaw IS NOT NULL
             AND (
                    (
                        DATE_PART('hour', eb.dtDue) = 0
                        AND DATE_PART('minute', eb.dtDue) = 0
                        AND appt_confirm.dtApptConfirmedRaw BETWEEN
                            CASE
                                WHEN DATE_PART('dayofweek', eb.dtDue) = 1 THEN DATEADD('day', -2, CAST(eb.dtDue AS DATE))
                                ELSE DATEADD('day', -1, CAST(eb.dtDue AS DATE))
                            END
                            AND DATEADD('second', -1, DATEADD('day', 1, eb.dtDue))
                    )
                    OR
                    (
                        appt_confirm.dtApptConfirmedRaw BETWEEN
                            CASE
                                WHEN DATE_PART('dayofweek', eb.dtDue) = 1 THEN DATEADD('day', -2, CAST(eb.dtDue AS DATE))
                                ELSE DATEADD('day', -1, CAST(eb.dtDue AS DATE))
                            END
                            AND eb.dtDue
                    )
                 ) THEN 1
            ELSE 0
        END AS lApptConfirmed,
        CASE
            WHEN att.lApptAttemptedConfirmed = 1
             AND appt_confirm.dtApptConfirmedRaw IS NULL THEN 1
            ELSE 0
        END AS lApptAttemptedConfirmed,
        CASE WHEN eb.lTaskTypeID = 65 THEN 1 ELSE 0 END AS IsAppraisalAppt,
        CASE
            WHEN eb.lTaskTypeID = 65
             AND eb.dtCompleted IS NOT NULL
             AND eb.szDealSubStatus = 'Vehicle Acquired' THEN 1
            ELSE 0
        END AS lApprApptAcquired,
        CASE
            WHEN eb.record_type <> 'service'
             AND eb.nliColorID = 17
             AND eb.szDealSubStatus = 'Vehicle Acquired'
             AND eb.dtClosed BETWEEN eb.dtStartLocal AND eb.dtEndLocal THEN 1
            ELSE 0
        END AS lAcquired,
        COALESCE(tif.lDemo, 0) AS lDemo,
        COALESCE(tif.lWriteUp, 0) AS lWriteUp,
        COALESCE(tif.lTurnOver, 0) AS lTurnOver,
        COALESCE(tif.lAppraisal, 0) AS lAppraisal,
        CASE
            WHEN eb.record_type <> 'service'
             AND eb.nliColorID = 17
             AND eb.dtClosed BETWEEN eb.dtStartLocal AND eb.dtEndLocal THEN 1
            ELSE 0
        END AS lLost,
        CASE
            WHEN eb.record_type <> 'service'
             AND eb.szDealSubStatus = 'Bad Lead' THEN 1
            ELSE 0
        END AS lBadLead,
        CASE
            WHEN eb.record_type <> 'service'
             AND eb.szDealSubStatus = 'Bought Elsewhere' THEN 1
            ELSE 0
        END AS lBoughtElseWhere,
        CASE
            WHEN sp.lPrimarySalespersonID IS NOT NULL
             AND eb.lCompletedByID IS NOT NULL
             AND eb.lCompletedByID <> sp.lPrimarySalespersonID
             AND eb.dtProspectIn BETWEEN eb.dtStartLocal AND eb.dtEndLocal THEN 1
            ELSE 0
        END AS lReassigned,
        CASE
            WHEN pc.lPurchaseDetailsID IS NOT NULL AND eb.bSplitDeals = 1 THEN CAST(0.5 AS NUMBER(6,1))
            WHEN pc.lPurchaseDetailsID IS NOT NULL THEN CAST(1.0 AS NUMBER(6,1))
            ELSE CAST(0.0 AS NUMBER(6,1))
        END AS lPrimaryDeal,
        CASE
            WHEN pc.lPurchaseDetailsID IS NOT NULL AND eb.bSplitDeals = 1 THEN CAST(0.5 AS NUMBER(6,1))
            ELSE CAST(0.0 AS NUMBER(6,1))
        END AS lSecondaryDeal,
        pc.curFrontGross AS curFront,
        pc.curBackGross AS curBack,
        pc.curTotalGross AS curTotal,
        CAST(NULL AS NUMBER) AS lResponseTime,
        CAST(NULL AS NUMBER(19,4)) AS curLeadCost,
        eb.lCompanyID,
        eb.lChildCompanyID,
        eb.lPersonID,
        eb.lDealID,
        eb.lReferenceID,
        eb.nliReferenceSourceID,
        pc.lPurchaseDetailsID,
        sc.nliCategoryID,
        eb.nliColorID,
        eb.lSourceID,
        eb.lDealSubStatusID,
        pc.szLegacyDealID,
        eb.lTaskID,
        eb.lTaskTypeID,
        CASE
            WHEN sc.szSource ILIKE '%Custom%Source%' AND COALESCE(csc.szCompanySource, 'Custom Source') NOT ILIKE '%Custom%Source%' THEN COALESCE(csc.szCompanySource, eb.szUpSource)
            WHEN sc.szSource ILIKE '%Custom%Source%' AND COALESCE(csc.szCompanySource, 'Custom Source') ILIKE '%Custom%Source%' THEN eb.szUpSource
            ELSE COALESCE(csc.szCompanySource, sc.szSource)
        END AS szSource,
        eb.szSubSource,
        eb.szDealSubStatus,
        eb.szUpType,
        sp.lPrimarySalespersonID,
        sp.lSalespersonID,
        CAST(NULL AS NUMBER) AS lBDCPrimary,
        CAST(NULL AS NUMBER) AS lBDCSecondary,
        eb.lCreatedByID,
        eb.lCurrentOwnerID,
        eb.lCompletedByID,
        appt_confirm.lApptConfirmedByID,
        eb.dtProspectIn,
        COALESCE(dv.dtIn, eb.dtCompleted) AS dtIn,
        eb.dtClosed,
        pc.dtSold,
        eb.dtEntry AS dtCreated,
        eb.dtDue,
        eb.dtCompleted,
        eb.dtTaskClosed,
        appt_confirm.dtApptConfirmedRaw AS dtApptConfirmed,
        att.dtAttemptedConfirmed,
        eb.dtEntry,
        CAST(NULL AS TIMESTAMP_NTZ) AS dtResponseTask,
        COALESCE(csc.nliInternetUpTierID, sc.nliInternetUpTierID) AS nliInternetUpTier
    FROM enriched_base eb
    LEFT JOIN vehicle_sought vs
        ON vs.lDealID = eb.lDealID
    LEFT JOIN purchase_context pc
        ON pc.lDealID = eb.lDealID
    LEFT JOIN service_vehicle sv
        ON sv.lVehicleID = eb.service_vehicle_id
    LEFT JOIN appointment_confirmation appt_confirm
        ON appt_confirm.lCompanyID = eb.lCompanyID
       AND appt_confirm.lTaskID = eb.lTaskID
       AND appt_confirm.rn = 1
    LEFT JOIN attempted_confirmation att
        ON att.lCompanyID = eb.lCompanyID
       AND att.lTaskID = eb.lTaskID
    LEFT JOIN task_item_flags tif
        ON tif.lCompanyID = eb.lCompanyID
       AND tif.lTaskID = eb.lTaskID
    LEFT JOIN salesperson_context sp
        ON sp.lDealID = eb.lDealID
    LEFT JOIN source_context sc
        ON sc.lSourceID = eb.lSourceID
    LEFT JOIN company_source_context csc
        ON csc.lCompanyID = eb.lCompanyID
       AND csc.lSourceID = eb.lSourceID
    LEFT JOIN desklog_visit dv
        ON dv.lCompanyID = eb.lCompanyID
       AND dv.lDealID = eb.lDealID
       AND (dv.lTaskID = eb.lTaskID OR eb.lTaskID IS NULL)
)

SELECT
    base_row_key,
    record_type,
    row_origin,
    metric_grain,
    metric_date,
    prospect_vin,
    sold_vin,
    service_vin,
    resolved_vin,
    vin_resolution_source,
    prospect_vehicle_sought_id,
    sold_vehicle_id,
    service_vehicle_id,
    szNewUsed,
    lMakeID,
    lUp,
    lVisit,
    lBeBack,
    lSold,
    lApptCreated,
    lApptDue,
    lApptShown,
    lApptSold,
    CASE WHEN lApptConfirmed = 1 AND IsAppraisalAppt = 0 THEN 1 ELSE 0 END AS lApptConfirmed,
    lApptAttemptedConfirmed,
    IsAppraisalAppt,
    lApprApptAcquired,
    lAcquired,
    lDemo,
    lWriteUp,
    lTurnOver,
    lAppraisal,
    lLost,
    lBadLead,
    lBoughtElseWhere,
    lReassigned,
    lPrimaryDeal,
    lSecondaryDeal,
    curFront,
    curBack,
    curTotal,
    lResponseTime,
    curLeadCost,
    lCompanyID,
    lChildCompanyID,
    lPersonID,
    lDealID,
    lReferenceID,
    nliReferenceSourceID,
    lPurchaseDetailsID,
    nliCategoryID,
    nliColorID,
    lSourceID,
    lDealSubStatusID,
    szLegacyDealID,
    lTaskID,
    lTaskTypeID,
    szSource,
    szSubSource,
    szDealSubStatus,
    szUpType,
    lPrimarySalespersonID,
    lSalespersonID,
    lBDCPrimary,
    lBDCSecondary,
    lCreatedByID,
    lCurrentOwnerID,
    lCompletedByID,
    lApptConfirmedByID,
    dtProspectIn,
    dtIn,
    dtClosed,
    dtSold,
    dtCreated,
    dtDue,
    dtCompleted,
    dtTaskClosed,
    dtApptConfirmed,
    dtAttemptedConfirmed,
    dtEntry,
    dtResponseTask,
    nliInternetUpTier
FROM final_base;
