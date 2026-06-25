-- Snowflake raw COSMOS_SONIC base-data extract for replacing/refactoring
-- dbo.STAGINGEvo2_CoreReport_V3_TBI_Sonic_V2_WithDailyProcOutput.
--
-- Source layer:
--   HYPERNOVA_SONIC_CUSTACCESS.COSMOS_SONIC
--
-- Important Snowflake mirror difference:
--   COSMOS_SONIC does not expose DWFULLDEAL or DWFULLPURCHASEDETAILS.
--   DWFULLOPPORTUNITY carries the deal/opportunity/purchase result columns,
--   including LPURCHASEDETAILSID, LVEHICLEID, DTSOLD, gross, finance, source,
--   status, substatus, and child company.

WITH params AS (
    SELECT
        TO_TIMESTAMP_NTZ('2026-06-01 00:00:00') AS dt_start,
        TO_TIMESTAMP_NTZ('2026-06-02 23:59:59') AS dt_end,
        CAST(NULL AS NUMBER) AS parent_company_id_filter,
        CAST(NULL AS NUMBER) AS child_company_id_filter,
        0 AS ignore_show_dms_sold_only
),

company_scope AS (
    SELECT
        c.LCOMPANYID,
        c.SZCOMPANY,
        c.BSHOWDMSSOLD,
        CASE WHEN c.BNEWUSED = 1 THEN 'U' ELSE 'N' END AS default_new_used,
        c.BHASDAYLIGHTSAVINGTIME,
        p.dt_start,
        p.dt_end,
        p.ignore_show_dms_sold_only,
        0 AS local_time_conversion_hours
    FROM HYPERNOVA_SONIC_CUSTACCESS.COSMOS_SONIC.DWFULLCOMPANY c
    CROSS JOIN params p
    WHERE c.BACTIVE = 1
      AND c.BDEALERSHIP = 1
      AND (p.child_company_id_filter IS NULL OR c.LCOMPANYID = p.child_company_id_filter)
      AND (
            p.parent_company_id_filter IS NULL
            OR EXISTS (
                SELECT 1
                FROM HYPERNOVA_SONIC_CUSTACCESS.COSMOS_SONIC.DWFULLCOMPANYHIERARCHY ch
                WHERE ch.LPARENTID = p.parent_company_id_filter
                  AND ch.LCHILDID = c.LCOMPANYID
                  AND ch.BCHILDACTIVE = 1
                  AND ch.BCHILDDEALERSHIP = 1
            )
      )
),

opportunity_candidates AS (
    SELECT
        'opportunity' AS row_origin,
        'deal' AS metric_grain,
        CASE
            WHEN o.DTSOLD IS NOT NULL
              OR o.LPURCHASEDETAILSID IS NOT NULL
              OR o.SZSTATUS ILIKE '%sold%'
              OR o.SZDEALSUBSTATUS ILIKE '%sold%'
                THEN 'sold'
            WHEN o.NLICOLORID = 17
              OR o.SZSTATUS ILIKE '%inactive%'
              OR o.SZDEALSUBSTATUS ILIKE '%lost%'
              OR o.SZINACTIVEREASON IS NOT NULL
                THEN 'inactive_or_lost'
            ELSE 'prospect'
        END AS record_type,
        o.LCOMPANYID,
        o.LCHILDCOMPANYID,
        o.LPERSONID,
        o.LDEALID,
        CAST(NULL AS NUMBER) AS LTASKID,
        CAST(NULL AS NUMBER) AS LTASKTYPEID,
        CAST(NULL AS VARCHAR) AS SZTASKTYPE,
        CAST(NULL AS NUMBER) AS LCREATORID,
        CAST(NULL AS NUMBER) AS LCURRENTOWNERID,
        CAST(NULL AS NUMBER) AS LCOMPLETEDBYID,
        o.DTENTRY,
        CAST(NULL AS TIMESTAMP_NTZ) AS DTDUE,
        CAST(NULL AS TIMESTAMP_NTZ) AS DTCOMPLETED,
        CAST(NULL AS TIMESTAMP_NTZ) AS DTTASKCLOSED,
        CAST(NULL AS NUMBER) AS SERVICE_VEHICLE_ID,
        CAST(NULL AS NUMBER) AS LREFERENCEID,
        CAST(NULL AS NUMBER) AS NLIREFERENCESOURCEID
    FROM HYPERNOVA_SONIC_CUSTACCESS.COSMOS_SONIC.DWFULLOPPORTUNITY o
    JOIN company_scope cs
        ON cs.LCOMPANYID = COALESCE(o.LCHILDCOMPANYID, o.LCOMPANYID)
    WHERE o.LSOURCEID IS NOT NULL
      AND o.NLICOLORID BETWEEN 15 AND 18
      AND (
            o.DTPROSPECTIN BETWEEN cs.dt_start AND cs.dt_end
            OR o.DTCLOSED BETWEEN cs.dt_start AND cs.dt_end
            OR o.DTSOLD BETWEEN cs.dt_start AND cs.dt_end
            OR o.DTENTRY BETWEEN cs.dt_start AND cs.dt_end
            OR o.SZDEALSUBSTATUS IN ('Vehicle Acquired', 'Bad Lead')
      )
),

tasks_of_interest AS (
    SELECT DISTINCT
        t.LCOMPANYID,
        t.LTASKID
    FROM company_scope cs
    JOIN HYPERNOVA_SONIC_CUSTACCESS.COSMOS_SONIC.DWFULLACTIVITY t
        ON t.LCOMPANYID = cs.LCOMPANYID
       AND t.LDEALID IS NOT NULL
       AND t.LCUSTOMERID <> -1
       AND (
            t.DTCOMPLETED BETWEEN cs.dt_start AND cs.dt_end
            OR t.DTDUE BETWEEN cs.dt_start AND cs.dt_end
            OR t.DTENTRY BETWEEN cs.dt_start AND cs.dt_end
       )
    WHERE t.LTASKTYPEID IN (7, 8, 9, 13, 21, 31, 65)
),

activity_candidates AS (
    SELECT
        'activity' AS row_origin,
        'task' AS metric_grain,
        CASE
            WHEN t.SZTASKTYPE ILIKE '%service%' THEN 'service'
            ELSE 'opportunity_activity'
        END AS record_type,
        t.LCOMPANYID,
        CAST(NULL AS NUMBER) AS LCHILDCOMPANYID,
        t.LCUSTOMERID AS LPERSONID,
        t.LDEALID,
        t.LTASKID,
        t.LTASKTYPEID,
        t.SZTASKTYPE,
        t.LCREATORID,
        t.LCURRENTOWNERID,
        t.LCOMPLETEDBYID,
        t.DTENTRY,
        t.DTDUE,
        t.DTCOMPLETED,
        t.DTCLOSED AS DTTASKCLOSED,
        t.LVEHICLEID AS SERVICE_VEHICLE_ID,
        t.LREFERENCEID,
        t.NLIREFERENCESOURCEID
    FROM tasks_of_interest toi
    JOIN HYPERNOVA_SONIC_CUSTACCESS.COSMOS_SONIC.DWFULLACTIVITY t
        ON t.LCOMPANYID = toi.LCOMPANYID
       AND t.LTASKID = toi.LTASKID
),

service_candidates AS (
    SELECT
        'service_activity' AS row_origin,
        'service_activity' AS metric_grain,
        'service' AS record_type,
        t.LCOMPANYID,
        CAST(NULL AS NUMBER) AS LCHILDCOMPANYID,
        t.LCUSTOMERID AS LPERSONID,
        t.LDEALID,
        t.LTASKID,
        t.LTASKTYPEID,
        t.SZTASKTYPE,
        t.LCREATORID,
        t.LCURRENTOWNERID,
        t.LCOMPLETEDBYID,
        t.DTENTRY,
        t.DTDUE,
        t.DTCOMPLETED,
        t.DTCLOSED AS DTTASKCLOSED,
        t.LVEHICLEID AS SERVICE_VEHICLE_ID,
        t.LREFERENCEID,
        t.NLIREFERENCESOURCEID
    FROM company_scope cs
    JOIN HYPERNOVA_SONIC_CUSTACCESS.COSMOS_SONIC.DWFULLACTIVITY t
        ON t.LCOMPANYID = cs.LCOMPANYID
       AND t.LVEHICLEID IS NOT NULL
       AND t.SZTASKTYPE ILIKE '%service%'
       AND (
            t.DTENTRY BETWEEN cs.dt_start AND cs.dt_end
            OR t.DTCOMPLETED BETWEEN cs.dt_start AND cs.dt_end
            OR t.DTSERVICE BETWEEN cs.dt_start AND cs.dt_end
       )
    WHERE NOT EXISTS (
        SELECT 1
        FROM tasks_of_interest toi
        WHERE toi.LCOMPANYID = t.LCOMPANYID
          AND toi.LTASKID = t.LTASKID
    )
),

base_union AS (
    SELECT * FROM opportunity_candidates
    UNION ALL
    SELECT * FROM activity_candidates
    UNION ALL
    SELECT * FROM service_candidates
),

base_deals AS (
    SELECT DISTINCT LDEALID
    FROM base_union
    WHERE LDEALID IS NOT NULL
),

base_tasks AS (
    SELECT DISTINCT LTASKID, LCOMPANYID
    FROM base_union
    WHERE LTASKID IS NOT NULL
),

opportunity_context AS (
    SELECT
        o.LCOMPANYID,
        o.LCHILDCOMPANYID,
        o.LDEALID,
        o.LPERSONID,
        o.LSOURCEID,
        o.SZUPTYPE,
        o.SZUPSOURCE,
        o.SZSOURCEDETAILS,
        o.NLICOLORID,
        o.SZSTATUS,
        o.NLIINACTIVEREASON,
        o.SZINACTIVEREASON,
        o.DTCLOSED,
        o.LDEALSUBSTATUSID,
        o.SZDEALSUBSTATUS,
        o.CNUMBEROFVEHICLESSOUGHT,
        o.CNUMBEROFVEHICLETRADEINS,
        o.BNEWPROSPECT,
        o.DTPROSPECTIN,
        o.LCURTASKID,
        o.BBEBACK,
        o.DTBEBACK,
        o.DTENTRY AS DEAL_DTENTRY,
        o.DTLASTEDIT AS DEAL_DTLASTEDIT,
        o.LPURCHASEDETAILSID,
        o.LVEHICLEID AS OPPORTUNITY_VEHICLE_ID,
        o.LVEHICLEOWNERID,
        o.SZLEGACYDEALID,
        o.DTSOLD,
        o.BDELIVERED,
        o.CURPURCHASEPRICE,
        o.CURDEALERPROFIT,
        o.CURFRONTGROSS,
        o.CURBACKGROSS,
        o.CURTOTALGROSS,
        o.BLEASEPURCHASE,
        o.CURDOWNPAYMENT,
        o.DFINANCERATE,
        o.CURFINANCEAMOUNT,
        o.CTERMMONTHS,
        o.CURMONTHLYPAYMENT,
        o.LPURCHASEMILEAGE,
        o.SZBANKNAME,
        o.SZNEWUSED,
        o.NLIDATASOURCEID,
        o.SZDATASOURCE,
        o.DTPOST,
        o.DTACQUIRED,
        o.LSUBSOURCEID,
        o.SZSUBSOURCE,
        o.FORTELLISDEALGUID,
        o.DTSUBSTATUSCHANGE
    FROM HYPERNOVA_SONIC_CUSTACCESS.COSMOS_SONIC.DWFULLOPPORTUNITY o
    JOIN base_deals bd
        ON bd.LDEALID = o.LDEALID
),

vehicle_sought_ranked AS (
    SELECT
        vs.LVEHICLESOUGHTID,
        vs.LDEALID,
        vs.LMAKEID,
        vs.SZMAKE,
        vs.LMODELID,
        vs.SZMODEL,
        vs.SZTRIM,
        vs.BNEWUSED,
        vs.SZSTOCKNUMBER,
        vs.SZSOUGHTVIN AS RAW_PROSPECT_VIN,
        CASE WHEN LENGTH(vs.SZSOUGHTVIN) = 17 THEN vs.SZSOUGHTVIN ELSE NULL END AS PROSPECT_VIN,
        vs.LMAXMILEAGE,
        vs.DTENTRY,
        vs.DTLASTEDIT,
        ROW_NUMBER() OVER (
            PARTITION BY vs.LDEALID
            ORDER BY
                CASE WHEN vs.BACTIVE = TRUE THEN 0 ELSE 1 END,
                vs.DTLASTEDIT DESC,
                vs.DTENTRY DESC,
                vs.LVEHICLESOUGHTID DESC
        ) AS rn
    FROM HYPERNOVA_SONIC_CUSTACCESS.COSMOS_SONIC.DWFULLVEHICLESOUGHT vs
    JOIN base_deals bd
        ON bd.LDEALID = vs.LDEALID
),

vehicle_sought AS (
    SELECT *
    FROM vehicle_sought_ranked
    WHERE rn = 1
),

vehicle_by_id AS (
    SELECT
        v.LVEHICLEID,
        v.SZVIN AS RAW_VIN,
        CASE WHEN LENGTH(v.SZVIN) = 17 THEN v.SZVIN ELSE NULL END AS FULL_VIN,
        v.LMAKEID,
        v.SZMAKE,
        v.LMODELID,
        v.SZMODEL,
        v.SZTRIM,
        v.DTMODELYEAR,
        v.LMILEAGE,
        v.LPERSONID,
        v.LCOMPANYID,
        v.LDEALID,
        v.SZSTOCKNUMBER,
        v.BPRIMARY,
        v.BPRIMARYTRADE,
        v.SZTITLESTATUS
    FROM HYPERNOVA_SONIC_CUSTACCESS.COSMOS_SONIC.DWFULLVEHICLE v
),

appointment_confirmation AS (
    SELECT
        tr.LTASKID,
        tr.LCOMPANYID,
        COALESCE(tr.DTCOMPLETED, tr.DTENTRY) AS DTAPPTCONFIRMED,
        tr.LCOMPLETEDBYID AS LAPPTCONFIRMEDBYID,
        ROW_NUMBER() OVER (
            PARTITION BY tr.LCOMPANYID, tr.LTASKID
            ORDER BY COALESCE(tr.DTCOMPLETED, tr.DTENTRY) DESC, tr.LTASKREMINDERID DESC
        ) AS rn
    FROM HYPERNOVA_SONIC_CUSTACCESS.COSMOS_SONIC.DWFULLTASKREMINDER tr
    JOIN base_tasks bt
        ON bt.LCOMPANYID = tr.LCOMPANYID
       AND bt.LTASKID = tr.LTASKID
    WHERE tr.NLIOUTCOMEID = 1
),

task_item_flags AS (
    SELECT
        ti.LCOMPANYID,
        ti.LTASKID,
        MAX(CASE WHEN ti.NLILISTITEMID = 162 THEN 1 ELSE 0 END) AS LTURNOVER,
        MAX(CASE WHEN ti.NLILISTITEMID = 163 THEN 1 ELSE 0 END) AS LWRITEUP,
        MAX(CASE WHEN ti.NLILISTITEMID = 164 THEN 1 ELSE 0 END) AS LDEMO,
        MAX(CASE WHEN ti.NLILISTITEMID = 280 THEN 1 ELSE 0 END) AS LAPPRAISAL,
        MAX(CASE WHEN ti.NLILISTID = 175 AND ti.NLILISTITEMID NOT IN (2621, 7813) THEN 1 ELSE 0 END) AS LAPPTATTEMPTEDCONFIRMED,
        MIN(CASE WHEN ti.NLILISTID = 175 AND ti.NLILISTITEMID NOT IN (2621, 7813) THEN ti.DTDATE ELSE NULL END) AS DTATTEMPTEDCONFIRMED
    FROM HYPERNOVA_SONIC_CUSTACCESS.COSMOS_SONIC.DWFULLTASKITEM ti
    JOIN base_tasks bt
        ON bt.LCOMPANYID = ti.LCOMPANYID
       AND bt.LTASKID = ti.LTASKID
    GROUP BY
        ti.LCOMPANYID,
        ti.LTASKID
),

desklog_visit AS (
    SELECT
        dv.LCOMPANYID,
        dv.LDEALID,
        dv.LTASKID,
        MIN(dv.DTIN) AS DTIN
    FROM HYPERNOVA_SONIC_CUSTACCESS.COSMOS_SONIC.DWFULLDESKLOGVISIT dv
    JOIN base_deals bd
        ON bd.LDEALID = dv.LDEALID
    GROUP BY
        dv.LCOMPANYID,
        dv.LDEALID,
        dv.LTASKID
),

salesperson_ranked AS (
    SELECT
        dsm.LDEALID,
        dsm.LSALESPERSONID,
        dsm.BPRIMARY,
        dsm.NLIPOSITIONTYPE,
        dsm.SZPOSITIONTYPE,
        ROW_NUMBER() OVER (
            PARTITION BY dsm.LDEALID
            ORDER BY
                CASE WHEN dsm.BPRIMARY = TRUE THEN 0 ELSE 1 END,
                CASE WHEN dsm.NLIPOSITIONTYPE = 355 THEN 0 ELSE 1 END,
                dsm.DTLASTEDIT DESC
        ) AS primary_rank,
        ROW_NUMBER() OVER (
            PARTITION BY dsm.LDEALID
            ORDER BY
                CASE WHEN dsm.BPRIMARY = FALSE THEN 0 ELSE 1 END,
                dsm.DTLASTEDIT DESC
        ) AS secondary_rank
    FROM HYPERNOVA_SONIC_CUSTACCESS.COSMOS_SONIC.DWFULLDEALSALESPERSONMAP dsm
    JOIN base_deals bd
        ON bd.LDEALID = dsm.LDEALID
),

salesperson_context AS (
    SELECT
        LDEALID,
        MAX(CASE WHEN primary_rank = 1 THEN LSALESPERSONID END) AS LPRIMARYSALESPERSONID,
        MAX(CASE WHEN secondary_rank = 1 AND BPRIMARY = FALSE THEN LSALESPERSONID END) AS LSALESPERSONID
    FROM salesperson_ranked
    GROUP BY LDEALID
),

source_context AS (
    SELECT
        s.LSOURCEID,
        s.SZSOURCE,
        s.NLICATEGORYID,
        s.NLIINTERNETUPTIERID
    FROM HYPERNOVA_SONIC_CUSTACCESS.COSMOS_SONIC.DWFULLSOURCE s
),

company_source_context AS (
    SELECT
        cs.LCOMPANYID,
        cs.LSOURCEID,
        cs.SZCOMPANYSOURCE,
        cs.NLIINTERNETUPTIERID
    FROM HYPERNOVA_SONIC_CUSTACCESS.COSMOS_SONIC.DWFULLCOMPANYSOURCE cs
),

enriched_base AS (
    SELECT
        bu.row_origin,
        bu.metric_grain,
        bu.record_type,
        bu.row_origin || ':' || COALESCE(TO_VARCHAR(bu.LTASKID), TO_VARCHAR(bu.LDEALID), TO_VARCHAR(bu.SERVICE_VEHICLE_ID)) AS base_row_key,
        bu.LCOMPANYID,
        COALESCE(oc.LCHILDCOMPANYID, bu.LCHILDCOMPANYID, bu.LCOMPANYID) AS LCHILDCOMPANYID,
        COALESCE(oc.LPERSONID, bu.LPERSONID) AS LPERSONID,
        bu.LDEALID,
        bu.LTASKID,
        bu.LTASKTYPEID,
        bu.SZTASKTYPE,
        bu.LCREATORID,
        bu.LCURRENTOWNERID,
        bu.LCOMPLETEDBYID,
        bu.DTENTRY,
        bu.DTDUE,
        bu.DTCOMPLETED,
        bu.DTTASKCLOSED,
        bu.SERVICE_VEHICLE_ID,
        bu.LREFERENCEID,
        bu.NLIREFERENCESOURCEID,
        oc.LSOURCEID,
        oc.SZUPTYPE,
        oc.SZUPSOURCE,
        oc.SZSOURCEDETAILS,
        oc.NLICOLORID,
        oc.SZSTATUS,
        oc.NLIINACTIVEREASON,
        oc.SZINACTIVEREASON,
        oc.DTCLOSED,
        oc.LDEALSUBSTATUSID,
        oc.SZDEALSUBSTATUS,
        oc.DTPROSPECTIN,
        oc.LCURTASKID,
        oc.BBEBACK,
        oc.DTBEBACK,
        oc.DEAL_DTENTRY,
        oc.DEAL_DTLASTEDIT,
        oc.LPURCHASEDETAILSID,
        oc.OPPORTUNITY_VEHICLE_ID,
        oc.LVEHICLEOWNERID,
        oc.SZLEGACYDEALID,
        oc.DTSOLD,
        oc.BDELIVERED,
        oc.CURPURCHASEPRICE,
        oc.CURDEALERPROFIT,
        oc.CURFRONTGROSS,
        oc.CURBACKGROSS,
        oc.CURTOTALGROSS,
        oc.BLEASEPURCHASE,
        oc.CURDOWNPAYMENT,
        oc.DFINANCERATE,
        oc.CURFINANCEAMOUNT,
        oc.CTERMMONTHS,
        oc.CURMONTHLYPAYMENT,
        oc.LPURCHASEMILEAGE,
        oc.SZBANKNAME,
        oc.SZNEWUSED AS OPPORTUNITY_NEW_USED,
        oc.NLIDATASOURCEID,
        oc.SZDATASOURCE,
        oc.DTPOST,
        oc.DTACQUIRED,
        oc.LSUBSOURCEID,
        oc.SZSUBSOURCE,
        oc.FORTELLISDEALGUID,
        oc.DTSUBSTATUSCHANGE,
        cs.dt_start,
        cs.dt_end,
        cs.ignore_show_dms_sold_only,
        cs.default_new_used
    FROM base_union bu
    JOIN company_scope cs
        ON cs.LCOMPANYID = COALESCE(bu.LCHILDCOMPANYID, bu.LCOMPANYID)
    LEFT JOIN opportunity_context oc
        ON oc.LDEALID = bu.LDEALID
),

final_base AS (
    SELECT
        eb.base_row_key,
        eb.record_type,
        eb.row_origin,
        eb.metric_grain,
        CASE
            WHEN eb.record_type = 'service' THEN COALESCE(eb.DTCOMPLETED, eb.DTENTRY)
            WHEN eb.DTSOLD IS NOT NULL THEN eb.DTSOLD
            WHEN eb.DTCOMPLETED IS NOT NULL THEN eb.DTCOMPLETED
            WHEN eb.DTPROSPECTIN IS NOT NULL THEN eb.DTPROSPECTIN
            WHEN eb.DTCLOSED IS NOT NULL THEN eb.DTCLOSED
            ELSE COALESCE(eb.DTENTRY, eb.DEAL_DTENTRY)
        END AS metric_date,

        vs.PROSPECT_VIN,
        CASE WHEN LENGTH(sold_vehicle.FULL_VIN) = 17 THEN sold_vehicle.FULL_VIN ELSE NULL END AS SOLD_VIN,
        CASE WHEN LENGTH(service_vehicle.FULL_VIN) = 17 THEN service_vehicle.FULL_VIN ELSE NULL END AS SERVICE_VIN,
        CASE
            WHEN LENGTH(sold_vehicle.FULL_VIN) = 17 THEN sold_vehicle.FULL_VIN
            WHEN LENGTH(vs.PROSPECT_VIN) = 17 THEN vs.PROSPECT_VIN
            WHEN LENGTH(service_vehicle.FULL_VIN) = 17 THEN service_vehicle.FULL_VIN
            WHEN LENGTH(opportunity_vehicle.FULL_VIN) = 17 THEN opportunity_vehicle.FULL_VIN
            ELSE NULL
        END AS RESOLVED_VIN,
        CASE
            WHEN LENGTH(sold_vehicle.FULL_VIN) = 17 THEN 'DWFULLOPPORTUNITY.LVEHICLEID -> DWFULLVEHICLE.SZVIN'
            WHEN LENGTH(vs.PROSPECT_VIN) = 17 THEN 'DWFULLVEHICLESOUGHT.SZSOUGHTVIN'
            WHEN LENGTH(service_vehicle.FULL_VIN) = 17 THEN 'DWFULLACTIVITY.LVEHICLEID -> DWFULLVEHICLE.SZVIN'
            WHEN LENGTH(opportunity_vehicle.FULL_VIN) = 17 THEN 'DWFULLOPPORTUNITY.LVEHICLEID -> DWFULLVEHICLE.SZVIN'
            ELSE 'unresolved'
        END AS VIN_RESOLUTION_SOURCE,
        CASE
            WHEN eb.record_type = 'sold' AND eb.DTSOLD IS NOT NULL THEN 'sold_by_dtsold'
            WHEN eb.record_type = 'sold' AND eb.LPURCHASEDETAILSID IS NOT NULL THEN 'sold_by_lpurchasedetailsid'
            WHEN eb.record_type = 'sold' AND eb.SZSTATUS ILIKE '%sold%' THEN 'sold_by_status'
            WHEN eb.record_type = 'sold' AND eb.SZDEALSUBSTATUS ILIKE '%sold%' THEN 'sold_by_substatus'
            WHEN eb.record_type = 'inactive_or_lost' AND eb.NLICOLORID = 17 THEN 'inactive_or_lost_by_color'
            WHEN eb.record_type = 'inactive_or_lost' AND eb.SZSTATUS ILIKE '%inactive%' THEN 'inactive_or_lost_by_status'
            WHEN eb.record_type = 'inactive_or_lost' AND eb.SZDEALSUBSTATUS ILIKE '%lost%' THEN 'inactive_or_lost_by_substatus'
            WHEN eb.record_type = 'inactive_or_lost' AND eb.SZINACTIVEREASON IS NOT NULL THEN 'inactive_or_lost_by_inactive_reason'
            WHEN eb.record_type = 'service' THEN 'service_by_activity_tasktype'
            WHEN eb.record_type = 'opportunity_activity' THEN 'activity_with_deal'
            ELSE 'prospect_default'
        END AS RECORD_TYPE_REASON,
        vs.RAW_PROSPECT_VIN,
        sold_vehicle.RAW_VIN AS RAW_SOLD_VIN,
        service_vehicle.RAW_VIN AS RAW_SERVICE_VIN,
        CASE
            WHEN eb.record_type <> 'sold' THEN NULL
            WHEN eb.OPPORTUNITY_VEHICLE_ID IS NULL THEN 'sold_no_lvehicleid_on_opportunity'
            WHEN sold_vehicle.LVEHICLEID IS NULL THEN 'sold_lvehicleid_not_found_in_dwfullvehicle'
            WHEN sold_vehicle.RAW_VIN IS NULL THEN 'sold_vehicle_row_has_null_vin'
            WHEN LENGTH(sold_vehicle.RAW_VIN) <> 17 THEN 'sold_vehicle_vin_not_17_chars'
            ELSE 'sold_vin_resolved'
        END AS SOLD_VIN_RESOLUTION_STATUS,
        CASE
            WHEN vs.LVEHICLESOUGHTID IS NULL THEN 'no_vehicle_sought_row'
            WHEN vs.RAW_PROSPECT_VIN IS NULL THEN 'vehicle_sought_row_has_null_vin'
            WHEN LENGTH(vs.RAW_PROSPECT_VIN) <> 17 THEN 'vehicle_sought_vin_not_17_chars'
            ELSE 'prospect_vin_resolved'
        END AS PROSPECT_VIN_RESOLUTION_STATUS,
        CASE
            WHEN eb.record_type <> 'service' THEN NULL
            WHEN eb.SERVICE_VEHICLE_ID IS NULL THEN 'service_no_lvehicleid_on_activity'
            WHEN service_vehicle.LVEHICLEID IS NULL THEN 'service_lvehicleid_not_found_in_dwfullvehicle'
            WHEN service_vehicle.RAW_VIN IS NULL THEN 'service_vehicle_row_has_null_vin'
            WHEN LENGTH(service_vehicle.RAW_VIN) <> 17 THEN 'service_vehicle_vin_not_17_chars'
            ELSE 'service_vin_resolved'
        END AS SERVICE_VIN_RESOLUTION_STATUS,
        CASE
            WHEN LENGTH(sold_vehicle.FULL_VIN) = 17 THEN 'resolved_from_sold_vin'
            WHEN LENGTH(vs.PROSPECT_VIN) = 17 THEN 'resolved_from_prospect_vin'
            WHEN LENGTH(service_vehicle.FULL_VIN) = 17 THEN 'resolved_from_service_vin'
            WHEN LENGTH(opportunity_vehicle.FULL_VIN) = 17 THEN 'resolved_from_opportunity_vehicle_vin'
            ELSE 'no_full_vin_resolved'
        END AS RESOLVED_VIN_STATUS,

        vs.LVEHICLESOUGHTID AS PROSPECT_VEHICLE_SOUGHT_ID,
        eb.OPPORTUNITY_VEHICLE_ID AS SOLD_VEHICLE_ID,
        eb.SERVICE_VEHICLE_ID,
        eb.LPURCHASEDETAILSID,

        COALESCE(eb.OPPORTUNITY_NEW_USED, CASE WHEN vs.BNEWUSED = 1 THEN 'U' WHEN vs.BNEWUSED = 0 THEN 'N' ELSE eb.default_new_used END) AS SZNEWUSED,
        COALESCE(sold_vehicle.LMAKEID, vs.LMAKEID, service_vehicle.LMAKEID, opportunity_vehicle.LMAKEID) AS LMAKEID,
        COALESCE(sold_vehicle.SZMAKE, vs.SZMAKE, service_vehicle.SZMAKE, opportunity_vehicle.SZMAKE) AS SZMAKE,
        COALESCE(sold_vehicle.SZMODEL, vs.SZMODEL, service_vehicle.SZMODEL, opportunity_vehicle.SZMODEL) AS SZMODEL,
        COALESCE(sold_vehicle.SZTRIM, vs.SZTRIM, service_vehicle.SZTRIM, opportunity_vehicle.SZTRIM) AS SZTRIM,
        COALESCE(sold_vehicle.LMILEAGE, service_vehicle.LMILEAGE, vs.LMAXMILEAGE) AS LMILEAGE,

        CASE
            WHEN eb.record_type <> 'service'
             AND eb.DTPROSPECTIN BETWEEN eb.dt_start AND eb.dt_end
             AND eb.LSOURCEID IS NOT NULL
             AND eb.NLICOLORID BETWEEN 15 AND 18 THEN 1
            ELSE 0
        END AS LUP,
        CASE
            WHEN eb.record_type <> 'service'
             AND eb.LTASKTYPEID IN (7, 8, 31)
             AND eb.DTCOMPLETED BETWEEN eb.dt_start AND eb.dt_end THEN 1
            WHEN dv.DTIN BETWEEN eb.dt_start AND eb.dt_end THEN 1
            ELSE 0
        END AS LVISIT,
        CASE
            WHEN eb.record_type <> 'service'
             AND (eb.BBEBACK = TRUE OR eb.DTBEBACK IS NOT NULL) THEN 1
            ELSE 0
        END AS LBEBACK,
        CASE
            WHEN eb.record_type <> 'service'
             AND eb.LPURCHASEDETAILSID IS NOT NULL
             AND eb.DTSOLD BETWEEN eb.dt_start AND eb.dt_end
             AND eb.NLICOLORID = 16
             AND (
                    eb.ignore_show_dms_sold_only = 1
                    OR eb.NLIDATASOURCEID = 172
                    OR eb.NLIDATASOURCEID = 171
                 )
             AND NOT (eb.LDEALSUBSTATUSID <> 8 AND eb.NLIDATASOURCEID <> 172) THEN 1
            ELSE 0
        END AS LSOLD,
        CASE
            WHEN eb.LTASKTYPEID IN (7, 65)
             AND eb.DTENTRY BETWEEN eb.dt_start AND eb.dt_end THEN 1
            ELSE 0
        END AS LAPPTCREATED,
        CASE
            WHEN eb.LTASKTYPEID IN (7, 65)
             AND eb.DTDUE BETWEEN eb.dt_start AND eb.dt_end THEN 1
            ELSE 0
        END AS LAPPTDUE,
        CASE
            WHEN eb.LTASKTYPEID IN (7, 65)
             AND eb.DTCOMPLETED BETWEEN eb.dt_start AND eb.dt_end THEN 1
            ELSE 0
        END AS LAPPTSHOWN,
        CASE
            WHEN eb.LTASKTYPEID = 7
             AND eb.LPURCHASEDETAILSID IS NOT NULL
             AND eb.DTCOMPLETED IS NOT NULL
             AND eb.DTSOLD IS NOT NULL
             AND DATEDIFF('day', eb.DTCOMPLETED, eb.DTSOLD) = 0 THEN 1
            ELSE 0
        END AS LAPPTSOLD,
        CASE
            WHEN eb.LTASKTYPEID IN (7, 65)
             AND ac.DTAPPTCONFIRMED IS NOT NULL
             AND (
                    (
                        DATE_PART('hour', eb.DTDUE) = 0
                        AND DATE_PART('minute', eb.DTDUE) = 0
                        AND ac.DTAPPTCONFIRMED BETWEEN
                            CASE
                                WHEN DATE_PART('dayofweek', eb.DTDUE) = 1 THEN DATEADD('day', -2, CAST(eb.DTDUE AS DATE))
                                ELSE DATEADD('day', -1, CAST(eb.DTDUE AS DATE))
                            END
                            AND DATEADD('second', -1, DATEADD('day', 1, eb.DTDUE))
                    )
                    OR
                    (
                        ac.DTAPPTCONFIRMED BETWEEN
                            CASE
                                WHEN DATE_PART('dayofweek', eb.DTDUE) = 1 THEN DATEADD('day', -2, CAST(eb.DTDUE AS DATE))
                                ELSE DATEADD('day', -1, CAST(eb.DTDUE AS DATE))
                            END
                            AND eb.DTDUE
                    )
                 ) THEN 1
            ELSE 0
        END AS LAPPTCONFIRMED_RAW,
        CASE
            WHEN COALESCE(tif.LAPPTATTEMPTEDCONFIRMED, 0) = 1
             AND ac.DTAPPTCONFIRMED IS NULL THEN 1
            ELSE 0
        END AS LAPPTATTEMPTEDCONFIRMED,
        CASE WHEN eb.LTASKTYPEID = 65 THEN 1 ELSE 0 END AS ISAPPRAISALAPPT,
        CASE
            WHEN eb.LTASKTYPEID = 65
             AND eb.DTCOMPLETED IS NOT NULL
             AND eb.SZDEALSUBSTATUS = 'Vehicle Acquired' THEN 1
            ELSE 0
        END AS LAPPRAPPTACQUIRED,
        CASE
            WHEN eb.record_type <> 'service'
             AND eb.NLICOLORID = 17
             AND eb.SZDEALSUBSTATUS = 'Vehicle Acquired'
             AND eb.DTCLOSED BETWEEN eb.dt_start AND eb.dt_end THEN 1
            ELSE 0
        END AS LACQUIRED,
        COALESCE(tif.LDEMO, 0) AS LDEMO,
        COALESCE(tif.LWRITEUP, 0) AS LWRITEUP,
        COALESCE(tif.LTURNOVER, 0) AS LTURNOVER,
        COALESCE(tif.LAPPRAISAL, 0) AS LAPPRAISAL,
        CASE
            WHEN eb.record_type <> 'service'
             AND eb.NLICOLORID = 17
             AND eb.DTCLOSED BETWEEN eb.dt_start AND eb.dt_end THEN 1
            ELSE 0
        END AS LLOST,
        CASE
            WHEN eb.record_type <> 'service'
             AND eb.SZDEALSUBSTATUS = 'Bad Lead' THEN 1
            ELSE 0
        END AS LBADLEAD,
        CASE
            WHEN eb.record_type <> 'service'
             AND eb.SZDEALSUBSTATUS = 'Bought Elsewhere' THEN 1
            ELSE 0
        END AS LBOUGHTELSEWHERE,
        CASE
            WHEN sp.LPRIMARYSALESPERSONID IS NOT NULL
             AND eb.LCOMPLETEDBYID IS NOT NULL
             AND eb.LCOMPLETEDBYID <> sp.LPRIMARYSALESPERSONID
             AND eb.DTPROSPECTIN BETWEEN eb.dt_start AND eb.dt_end THEN 1
            ELSE 0
        END AS LREASSIGNED,
        CASE WHEN eb.LPURCHASEDETAILSID IS NOT NULL THEN CAST(1.0 AS NUMBER(6,1)) ELSE CAST(0.0 AS NUMBER(6,1)) END AS LPRIMARYDEAL,
        CAST(0.0 AS NUMBER(6,1)) AS LSECONDARYDEAL,
        CAST(NULL AS NUMBER) AS LRESPONSETIME,
        CAST(NULL AS NUMBER(19,4)) AS CURLEADCOST,

        eb.LCOMPANYID,
        eb.LCHILDCOMPANYID,
        eb.LPERSONID,
        eb.LDEALID,
        eb.LREFERENCEID,
        eb.NLIREFERENCESOURCEID,
        eb.LDEALSUBSTATUSID,
        eb.NLICOLORID,
        eb.LSOURCEID,
        eb.LSUBSOURCEID,
        eb.SZLEGACYDEALID,
        eb.LTASKID,
        eb.LTASKTYPEID,
        eb.SZTASKTYPE,
        CASE
            WHEN s.SZSOURCE ILIKE '%Custom%Source%'
             AND COALESCE(csrc.SZCOMPANYSOURCE, 'Custom Source') NOT ILIKE '%Custom%Source%' THEN COALESCE(csrc.SZCOMPANYSOURCE, eb.SZUPSOURCE)
            WHEN s.SZSOURCE ILIKE '%Custom%Source%'
             AND COALESCE(csrc.SZCOMPANYSOURCE, 'Custom Source') ILIKE '%Custom%Source%' THEN eb.SZUPSOURCE
            ELSE COALESCE(csrc.SZCOMPANYSOURCE, s.SZSOURCE)
        END AS SZSOURCE,
        eb.SZSUBSOURCE,
        eb.SZUPSOURCE,
        eb.SZSOURCEDETAILS,
        eb.SZUPTYPE,
        s.NLICATEGORYID,
        COALESCE(csrc.NLIINTERNETUPTIERID, s.NLIINTERNETUPTIERID) AS NLIINTERNETUPTIER,
        eb.SZSTATUS,
        eb.SZINACTIVEREASON,
        eb.SZDEALSUBSTATUS,
        eb.DTPROSPECTIN,
        COALESCE(dv.DTIN, eb.DTCOMPLETED) AS DTIN,
        eb.DTCLOSED,
        eb.DTSOLD,
        eb.DEAL_DTENTRY AS DTDEALENTRY,
        eb.DTENTRY AS DTCREATED,
        eb.DTDUE,
        eb.DTCOMPLETED,
        eb.DTTASKCLOSED,
        ac.DTAPPTCONFIRMED,
        ac.LAPPTCONFIRMEDBYID,
        tif.DTATTEMPTEDCONFIRMED,
        eb.LCREATORID AS LCREATEDBYID,
        eb.LCURRENTOWNERID,
        eb.LCOMPLETEDBYID,
        sp.LPRIMARYSALESPERSONID,
        sp.LSALESPERSONID,
        eb.CURPURCHASEPRICE,
        eb.CURDEALERPROFIT,
        eb.CURFRONTGROSS,
        eb.CURBACKGROSS,
        eb.CURTOTALGROSS,
        eb.CURDOWNPAYMENT,
        eb.DFINANCERATE,
        eb.CURFINANCEAMOUNT,
        eb.CTERMMONTHS,
        eb.CURMONTHLYPAYMENT,
        eb.SZBANKNAME,
        eb.SZDATASOURCE,
        eb.NLIDATASOURCEID,
        eb.BDELIVERED,
        eb.DTPOST,
        eb.DTACQUIRED,
        eb.FORTELLISDEALGUID
    FROM enriched_base eb
    LEFT JOIN vehicle_sought vs
        ON vs.LDEALID = eb.LDEALID
    LEFT JOIN vehicle_by_id sold_vehicle
        ON sold_vehicle.LVEHICLEID = eb.OPPORTUNITY_VEHICLE_ID
    LEFT JOIN vehicle_by_id opportunity_vehicle
        ON opportunity_vehicle.LVEHICLEID = eb.OPPORTUNITY_VEHICLE_ID
    LEFT JOIN vehicle_by_id service_vehicle
        ON service_vehicle.LVEHICLEID = eb.SERVICE_VEHICLE_ID
    LEFT JOIN appointment_confirmation ac
        ON ac.LCOMPANYID = eb.LCOMPANYID
       AND ac.LTASKID = eb.LTASKID
       AND ac.rn = 1
    LEFT JOIN task_item_flags tif
        ON tif.LCOMPANYID = eb.LCOMPANYID
       AND tif.LTASKID = eb.LTASKID
    LEFT JOIN desklog_visit dv
        ON dv.LCOMPANYID = eb.LCOMPANYID
       AND dv.LDEALID = eb.LDEALID
       AND (dv.LTASKID = eb.LTASKID OR eb.LTASKID IS NULL)
    LEFT JOIN salesperson_context sp
        ON sp.LDEALID = eb.LDEALID
    LEFT JOIN source_context s
        ON s.LSOURCEID = eb.LSOURCEID
    LEFT JOIN company_source_context csrc
        ON csrc.LCOMPANYID = eb.LCOMPANYID
       AND csrc.LSOURCEID = eb.LSOURCEID
)

SELECT
    base_row_key,
    record_type,
    row_origin,
    metric_grain,
    metric_date,
    PROSPECT_VIN AS prospect_vin,
    SOLD_VIN AS sold_vin,
    SERVICE_VIN AS service_vin,
    RESOLVED_VIN AS resolved_vin,
    VIN_RESOLUTION_SOURCE AS vin_resolution_source,
    RECORD_TYPE_REASON AS record_type_reason,
    RAW_PROSPECT_VIN AS raw_prospect_vin,
    RAW_SOLD_VIN AS raw_sold_vin,
    RAW_SERVICE_VIN AS raw_service_vin,
    SOLD_VIN_RESOLUTION_STATUS AS sold_vin_resolution_status,
    PROSPECT_VIN_RESOLUTION_STATUS AS prospect_vin_resolution_status,
    SERVICE_VIN_RESOLUTION_STATUS AS service_vin_resolution_status,
    RESOLVED_VIN_STATUS AS resolved_vin_status,
    PROSPECT_VEHICLE_SOUGHT_ID AS prospect_vehicle_sought_id,
    SOLD_VEHICLE_ID AS sold_vehicle_id,
    SERVICE_VEHICLE_ID AS service_vehicle_id,
    LPURCHASEDETAILSID AS lPurchaseDetailsID,
    SZNEWUSED AS szNewUsed,
    LMAKEID AS lMakeID,
    SZMAKE AS szMake,
    SZMODEL AS szModel,
    SZTRIM AS szTrim,
    LMILEAGE AS lMileage,
    LUP AS lUp,
    LVISIT AS lVisit,
    LBEBACK AS lBeBack,
    LSOLD AS lSold,
    LAPPTCREATED AS lApptCreated,
    LAPPTDUE AS lApptDue,
    LAPPTSHOWN AS lApptShown,
    LAPPTSOLD AS lApptSold,
    CASE WHEN LAPPTCONFIRMED_RAW = 1 AND ISAPPRAISALAPPT = 0 THEN 1 ELSE 0 END AS lApptConfirmed,
    LAPPTATTEMPTEDCONFIRMED AS lApptAttemptedConfirmed,
    ISAPPRAISALAPPT AS IsAppraisalAppt,
    LAPPRAPPTACQUIRED AS lApprApptAcquired,
    LACQUIRED AS lAcquired,
    LDEMO AS lDemo,
    LWRITEUP AS lWriteUp,
    LTURNOVER AS lTurnOver,
    LAPPRAISAL AS lAppraisal,
    LLOST AS lLost,
    LBADLEAD AS lBadLead,
    LBOUGHTELSEWHERE AS lBoughtElseWhere,
    LREASSIGNED AS lReassigned,
    LPRIMARYDEAL AS lPrimaryDeal,
    LSECONDARYDEAL AS lSecondaryDeal,
    CURFRONTGROSS AS curFront,
    CURBACKGROSS AS curBack,
    CURTOTALGROSS AS curTotal,
    LRESPONSETIME AS lResponseTime,
    CURLEADCOST AS curLeadCost,
    LCOMPANYID AS lCompanyID,
    LCHILDCOMPANYID AS lChildCompanyID,
    LPERSONID AS lPersonID,
    LDEALID AS lDealID,
    LREFERENCEID AS lReferenceID,
    NLIREFERENCESOURCEID AS nliReferenceSourceID,
    NLICATEGORYID AS nliCategoryID,
    NLICOLORID AS nliColorID,
    LSOURCEID AS lSourceID,
    LDEALSUBSTATUSID AS lDealSubStatusID,
    SZLEGACYDEALID AS szLegacyDealID,
    LTASKID AS lTaskID,
    LTASKTYPEID AS lTaskTypeID,
    SZTASKTYPE AS szTaskType,
    SZSOURCE AS szSource,
    SZSUBSOURCE AS szSubSource,
    SZUPSOURCE AS szUpSource,
    SZSOURCEDETAILS AS szSourceDetails,
    SZDEALSUBSTATUS AS szDealSubStatus,
    SZUPTYPE AS szUpType,
    LPRIMARYSALESPERSONID AS lPrimarySalespersonID,
    LSALESPERSONID AS lSalespersonID,
    LCREATEDBYID AS lCreatedByID,
    LCURRENTOWNERID AS lCurrentOwnerID,
    LCOMPLETEDBYID AS lCompletedByID,
    LAPPTCONFIRMEDBYID AS lApptConfirmedByID,
    DTPROSPECTIN AS dtProspectIn,
    DTIN AS dtIn,
    DTCLOSED AS dtClosed,
    DTSOLD AS dtSold,
    DTDEALENTRY AS dtDealEntry,
    DTCREATED AS dtCreated,
    DTDUE AS dtDue,
    DTCOMPLETED AS dtCompleted,
    DTTASKCLOSED AS dtTaskClosed,
    DTAPPTCONFIRMED AS dtApptConfirmed,
    DTATTEMPTEDCONFIRMED AS dtAttemptedConfirmed,
    NLIINTERNETUPTIER AS nliInternetUpTier,
    CURPURCHASEPRICE AS curPurchasePrice,
    CURDEALERPROFIT AS curDealerProfit,
    CURDOWNPAYMENT AS curDownPayment,
    DFINANCERATE AS dFinanceRate,
    CURFINANCEAMOUNT AS curFinanceAmount,
    CTERMMONTHS AS cTermMonths,
    CURMONTHLYPAYMENT AS curMonthlyPayment,
    SZBANKNAME AS szBankName,
    SZDATASOURCE AS szDataSource,
    NLIDATASOURCEID AS nliDataSourceID,
    BDELIVERED AS bDelivered,
    DTPOST AS dtPost,
    DTACQUIRED AS dtAcquired,
    FORTELLISDEALGUID AS FortellisDealGUID
FROM final_base
ORDER BY
    metric_date,
    lCompanyID,
    lDealID,
    lTaskID;

-- Add this while testing if you want a small result set:
-- LIMIT 100;
