-- Snowflake-native flat base-data extract for CDK/Roadster/eLead curated views.
-- This query targets the Snowflake objects visible in your worksheet:
--   CDK_ROADSTER_ELEAD_SONIC.SONIC.COMPANY
--   CDK_ROADSTER_ELEAD_SONIC.SONIC.DEALS
--   CDK_ROADSTER_ELEAD_SONIC.SONIC.TASKS
--   CDK_ROADSTER_ELEAD_SONIC.SONIC.PURCHASES
--   CDK_ROADSTER_ELEAD_SONIC.SONIC.INVENTORY
--   CDK_ROADSTER_ELEAD_SONIC.SONIC.CUSTOMERS
--   CDK_ROADSTER_ELEAD_SONIC.SONIC.AGENTS
--
-- This is not a direct dwFull* table translation. It uses the curated Snowflake
-- view names and columns that exist in CDK_ROADSTER_ELEAD_SONIC.SONIC.

WITH params AS (
    SELECT
        TO_TIMESTAMP_NTZ('2026-06-01 00:00:00') AS dt_start,
        TO_TIMESTAMP_NTZ('2026-06-02 23:59:59') AS dt_end,
        CAST(NULL AS NUMBER) AS company_id_filter,
        CAST(NULL AS NUMBER) AS parent_company_id_filter
),

company_scope AS (
    SELECT
        c.COMPANY_ID,
        c.COMPANY_NAME,
        c.TIMEZONE,
        c.PARENT_COMPANY_IDS,
        c.PARENT_NAMES,
        c.SCD_SHARED_COMPANYID,
        c.SCD_SHARED_COMPANY_NAME,
        c.IS_ACTIVE,
        c.IS_DEALERSHIP,
        p.dt_start,
        p.dt_end
    FROM CDK_ROADSTER_ELEAD_SONIC.SONIC.COMPANY c
    CROSS JOIN params p
    WHERE c.IS_ACTIVE = TRUE
      AND c.IS_DEALERSHIP = TRUE
      AND (p.company_id_filter IS NULL OR c.COMPANY_ID = p.company_id_filter)
      AND (
            p.parent_company_id_filter IS NULL
            OR ARRAY_CONTAINS(p.parent_company_id_filter::VARIANT, c.PARENT_COMPANY_IDS)
      )
),

deal_vins AS (
    SELECT
        d.COMPANY_ID,
        d.DEAL_ID,
        MAX(
            CASE
                WHEN LENGTH(f.value::STRING) = 17 THEN f.value::STRING
                ELSE NULL
            END
        ) AS first_full_sought_vin
    FROM CDK_ROADSTER_ELEAD_SONIC.SONIC.DEALS d,
         LATERAL FLATTEN(INPUT => d.ALL_VINS_SOUGHT, OUTER => TRUE) f
    GROUP BY
        d.COMPANY_ID,
        d.DEAL_ID
),

deal_base AS (
    SELECT
        d.COMPANY_ID,
        d.COMPANY_NAME,
        d.DEAL_ID,
        d.DEAL_ID_UNIQUE,
        d.PERSON_ID,
        d.PERSON_ID_UNIQUE,
        d.UP_TYPE,
        d.INTERNET_UP_TIER,
        d.SOURCE,
        d.COMPANY_SOURCE_NAME,
        d.SUBSOURCE,
        d.SOURCE_DETAILS,
        d.DEAL_STATUS,
        d.DEAL_SUBSTATUS,
        d.INACTIVE_REASON,
        d.TIMESTAMP_ENTRY_DEALERTIME,
        d.TIMESTAMP_PROSPECTIN_DEALERTIME,
        d.TIMESTAMP_CLOSED_DEALERTIME,
        d.TIMESTAMP_LASTEDIT_DEALERTIME,
        d.TIMESTAMP_SUBSTATUSCHANGE_DEALERTIME,
        d.IS_BE_BACK,
        d.NUM_SHOWROOM_VISITS,
        d.NUM_VEHICLES,
        d.PRIMARY_VEHICLE_SOUGHT_ID,
        d.ALL_VEHICLE_SOUGHT_IDS,
        d.STOCK_NUMBER,
        d.VIN,
        d.ALL_VINS_SOUGHT,
        d.GRADE,
        d.MODEL_YEAR,
        d.MAKE,
        d.MODEL,
        d.TRIM,
        d.NUM_TRADES,
        d.TRADE_IN_ID,
        d.ALL_TRADE_IN_IDS,
        d.PRIMARY_SALESPERSON,
        d.PRIMARY_BDC_AGENT,
        d.PRIMARY_DESK_MANAGER,
        d.PRIMARY_FI_MANAGER,
        d.PRIMARY_SALES_MANAGER,
        d.ALL_SALESPEOPLE,
        d.ALL_BDC_AGENTS,
        d.ALL_DESK_MANAGERS,
        d.ALL_FI_MANAGERS,
        d.ALL_SALES_MANAGERS,
        d.ALL_OTHER_AGENTS,
        d.NUM_SALESPEOPLE,
        d.NUM_BDCAGENTS,
        d.ORDERED_AT,
        d.DELIVERED_AT,
        d.BOOKED_AT,
        d.FINALIZED_AT,
        d.ACCOUNTING_AT,
        d.POD_ID,
        d.MAX_QLIK_UPDATED_DATETIME_UTC,
        d.UPDATED_AT_UTC
    FROM CDK_ROADSTER_ELEAD_SONIC.SONIC.DEALS d
    JOIN company_scope cs
        ON cs.COMPANY_ID = d.COMPANY_ID
    WHERE d.TIMESTAMP_PROSPECTIN_DEALERTIME BETWEEN cs.dt_start AND cs.dt_end
       OR d.TIMESTAMP_CLOSED_DEALERTIME BETWEEN cs.dt_start AND cs.dt_end
       OR d.TIMESTAMP_ENTRY_DEALERTIME BETWEEN cs.dt_start AND cs.dt_end
),

task_base AS (
    SELECT
        t.COMPANY_ID,
        t.COMPANY_NAME,
        t.TASK_ID,
        t.TASK_ID_UNIQUE,
        t.DEAL_ID,
        t.DEAL_ID_UNIQUE,
        t.PERSON_ID,
        t.PERSON_ID_UNIQUE,
        t.COMPLETED_STATUS,
        t.TIMESTAMP_DUE_DEALERTIME,
        t.TIMESTAMP_COMPLETED_DEALERTIME,
        t.DATE_COMPLETED_DEALERTIME,
        t.TASK_TYPE,
        t.TASK_NAME,
        t.TASK_COMMENTS,
        t.TASK_OUTCOME,
        t.APPOINTMENT_OUTCOME,
        t.USER_ID_COMPLETED_TASK,
        t.USER_ID_CREATED_TASK,
        t.USER_ID_CURRENT_OWNER,
        t.TASK_ITEMS,
        t.WORKFLOW_NAME,
        t.TRIGGERING_EVENT,
        t.ACTOR,
        t.EXECUTION_TYPE,
        t.TIMESTAMP_ENTRY_DEALERTIME,
        t.TIMESTAMP_ACTIVE_DEALERTIME,
        t.WORKFLOW_ID,
        t.TASK_TYPE_ID,
        t.LE_TEMPLATE_ID,
        t.CURRENT_VEHICLE_ID,
        t.VEHICLE_ID,
        t.DEALER_PROMOTION_PUSH_ID,
        t.POD_ID,
        t.MAX_QLIK_UPDATED_DATETIME_UTC,
        t.UPDATED_AT_UTC
    FROM CDK_ROADSTER_ELEAD_SONIC.SONIC.TASKS t
    JOIN company_scope cs
        ON cs.COMPANY_ID = t.COMPANY_ID
    WHERE t.TIMESTAMP_COMPLETED_DEALERTIME BETWEEN cs.dt_start AND cs.dt_end
       OR t.TIMESTAMP_DUE_DEALERTIME BETWEEN cs.dt_start AND cs.dt_end
       OR t.TIMESTAMP_ENTRY_DEALERTIME BETWEEN cs.dt_start AND cs.dt_end
),

purchase_ranked AS (
    SELECT
        p.PURCHASE_ID,
        p.PURCHASE_ID_UNIQUE,
        p.DEAL_ID,
        p.DEAL_ID_UNIQUE,
        p.DMS_DEAL_ID,
        p.COMPANY_ID,
        p.COMPANY_NAME,
        p.SOLD_TIMESTAMP,
        p.SOLD_DATE,
        p.PERSON_ID,
        p.PERSON_ID_UNIQUE,
        p.COBUYERS,
        p.COBUYERS_UNIQUE,
        p.VEHICLE_ID,
        p.VEHICLE_ID_UNIQUE,
        p.MAKE,
        p.MODEL,
        p.YEAR,
        p.GRADE,
        p.MILEAGE,
        p.VIN,
        p.LEASE_PURCHASE_FLAG,
        p.DEAL_TYPE,
        p.PURCHASE_PRICE,
        p.DEALER_PROFIT,
        p.FRONT_GROSS,
        p.BACK_GROSS,
        p.REBATES,
        p.DOWN_PAYMENT,
        p.FINANCE_AMOUNT,
        p.INTEREST_RATE,
        p.MONTHLY_PAYMENT,
        p.TERM,
        p.LENDER,
        p.IS_DELIVERED,
        p.DATA_SOURCE,
        p.POST_TIMESTAMP,
        p.POD_ID,
        p.MAX_QLIK_UPDATED_DATETIME_UTC,
        p.UPDATED_AT_UTC,
        ROW_NUMBER() OVER (
            PARTITION BY p.COMPANY_ID, p.DEAL_ID
            ORDER BY p.SOLD_TIMESTAMP DESC, p.PURCHASE_ID DESC
        ) AS purchase_rank
    FROM CDK_ROADSTER_ELEAD_SONIC.SONIC.PURCHASES p
    JOIN company_scope cs
        ON cs.COMPANY_ID = p.COMPANY_ID
    WHERE p.SOLD_TIMESTAMP BETWEEN cs.dt_start AND cs.dt_end
       OR p.POST_TIMESTAMP BETWEEN cs.dt_start AND cs.dt_end
),

purchase_base AS (
    SELECT *
    FROM purchase_ranked
    WHERE purchase_rank = 1
),

inventory_base AS (
    SELECT
        i.COMPANY_ID,
        i.COMPANY_NAME,
        i.INVENTORY_ID,
        i.INVENTORY_ID_UNIQUE,
        i.VEHICLE_ID,
        i.VEHICLE_ID_UNIQUE,
        i.TIMESTAMP_ENTRY_DEALERTIME,
        i.TIMESTAMP_ACQUIRED_DEALERTIME,
        i.TIMESTAMP_LASTEDIT_DEALERTIME,
        i.TIMESTAMP_DMSSOLD,
        i.SOURCE,
        i.DESK_STATUS,
        i.DMS_STATUS,
        i.DMS_DELETE_STATUS,
        i.STOCK_TYPE,
        i.INVENTORY_TYPE,
        i.VEHICLE_CLASS,
        i.NEW_USED_FLAG,
        i.MAKE,
        i.MODEL,
        i.YEAR,
        i.STOCK_NUMBER,
        i.VIN,
        i.MILEAGE,
        i.MSRP,
        i.PRICE,
        i.INTERNET_PRICE,
        i.COST,
        i.ACTUAL_CASH_VALUE,
        i.TIMESTAMP_GROUP_ACQUIRED,
        i.LOCATION,
        i.MAX_QLIK_UPDATED_DATETIME_UTC,
        i.UPDATED_AT_UTC
    FROM CDK_ROADSTER_ELEAD_SONIC.SONIC.INVENTORY i
),

deal_rows AS (
    SELECT
        'deal' AS row_origin,
        'deal' AS metric_grain,
        CASE
            WHEN pb.PURCHASE_ID IS NOT NULL
              OR db.DEAL_STATUS ILIKE '%sold%'
              OR db.DEAL_SUBSTATUS ILIKE '%sold%'
              OR db.DELIVERED_AT IS NOT NULL
              OR db.BOOKED_AT IS NOT NULL
              OR db.FINALIZED_AT IS NOT NULL
                THEN 'sold'
            WHEN db.DEAL_STATUS ILIKE '%inactive%'
              OR db.DEAL_STATUS ILIKE '%lost%'
              OR db.DEAL_SUBSTATUS ILIKE '%lost%'
              OR db.INACTIVE_REASON IS NOT NULL
                THEN 'inactive_or_lost'
            ELSE 'prospect'
        END AS record_type,
        'deal:' || TO_VARCHAR(db.DEAL_ID) AS base_row_key,
        COALESCE(pb.SOLD_TIMESTAMP, db.TIMESTAMP_PROSPECTIN_DEALERTIME, db.TIMESTAMP_CLOSED_DEALERTIME, db.TIMESTAMP_ENTRY_DEALERTIME) AS metric_date,
        db.COMPANY_ID,
        db.COMPANY_NAME,
        db.COMPANY_ID AS CHILD_COMPANY_ID,
        db.COMPANY_NAME AS CHILD_COMPANY_NAME,
        db.PERSON_ID,
        db.PERSON_ID_UNIQUE,
        db.DEAL_ID,
        db.DEAL_ID_UNIQUE,
        CAST(NULL AS NUMBER) AS TASK_ID,
        CAST(NULL AS VARCHAR) AS TASK_ID_UNIQUE,
        CAST(NULL AS NUMBER) AS TASK_TYPE_ID,
        CAST(NULL AS VARCHAR) AS TASK_TYPE,
        CAST(NULL AS VARCHAR) AS TASK_NAME,
        CAST(NULL AS VARCHAR) AS TASK_OUTCOME,
        CAST(NULL AS VARCHAR) AS APPOINTMENT_OUTCOME,
        CAST(NULL AS NUMBER) AS USER_ID_CREATED_TASK,
        CAST(NULL AS NUMBER) AS USER_ID_CURRENT_OWNER,
        CAST(NULL AS NUMBER) AS USER_ID_COMPLETED_TASK,
        CAST(NULL AS VARIANT) AS TASK_ITEMS,
        db.UP_TYPE,
        db.INTERNET_UP_TIER,
        db.SOURCE,
        db.COMPANY_SOURCE_NAME,
        db.SUBSOURCE,
        db.SOURCE_DETAILS,
        db.DEAL_STATUS,
        db.DEAL_SUBSTATUS,
        db.INACTIVE_REASON,
        db.TIMESTAMP_PROSPECTIN_DEALERTIME,
        db.TIMESTAMP_ENTRY_DEALERTIME AS DEAL_ENTRY_DEALERTIME,
        db.TIMESTAMP_CLOSED_DEALERTIME,
        db.TIMESTAMP_LASTEDIT_DEALERTIME AS DEAL_LASTEDIT_DEALERTIME,
        db.TIMESTAMP_SUBSTATUSCHANGE_DEALERTIME,
        CAST(NULL AS TIMESTAMP_NTZ) AS TASK_ENTRY_DEALERTIME,
        CAST(NULL AS TIMESTAMP_NTZ) AS TASK_DUE_DEALERTIME,
        CAST(NULL AS TIMESTAMP_NTZ) AS TASK_COMPLETED_DEALERTIME,
        db.IS_BE_BACK,
        db.NUM_SHOWROOM_VISITS,
        db.PRIMARY_VEHICLE_SOUGHT_ID,
        db.ALL_VEHICLE_SOUGHT_IDS,
        db.ALL_VINS_SOUGHT,
        db.STOCK_NUMBER AS PROSPECT_STOCK_NUMBER,
        CASE
            WHEN LENGTH(db.VIN) = 17 THEN db.VIN
            WHEN LENGTH(dv.first_full_sought_vin) = 17 THEN dv.first_full_sought_vin
            ELSE NULL
        END AS prospect_vin,
        CASE WHEN LENGTH(pb.VIN) = 17 THEN pb.VIN ELSE NULL END AS sold_vin,
        CAST(NULL AS VARCHAR) AS service_vin,
        CASE
            WHEN LENGTH(pb.VIN) = 17 THEN pb.VIN
            WHEN LENGTH(db.VIN) = 17 THEN db.VIN
            WHEN LENGTH(dv.first_full_sought_vin) = 17 THEN dv.first_full_sought_vin
            ELSE NULL
        END AS resolved_vin,
        CASE
            WHEN LENGTH(pb.VIN) = 17 THEN 'PURCHASES.VIN'
            WHEN LENGTH(db.VIN) = 17 THEN 'DEALS.VIN'
            WHEN LENGTH(dv.first_full_sought_vin) = 17 THEN 'DEALS.ALL_VINS_SOUGHT'
            ELSE 'unresolved'
        END AS vin_resolution_source,
        pb.PURCHASE_ID,
        pb.PURCHASE_ID_UNIQUE,
        pb.DMS_DEAL_ID,
        pb.VEHICLE_ID AS SOLD_VEHICLE_ID,
        db.PRIMARY_VEHICLE_SOUGHT_ID AS PROSPECT_VEHICLE_ID,
        CAST(NULL AS NUMBER) AS SERVICE_VEHICLE_ID,
        COALESCE(pb.DEAL_TYPE, db.UP_TYPE) AS vehicle_sale_type,
        COALESCE(pb.MAKE, db.MAKE) AS MAKE,
        COALESCE(pb.MODEL, db.MODEL) AS MODEL,
        COALESCE(pb.YEAR, db.MODEL_YEAR) AS MODEL_YEAR,
        COALESCE(pb.GRADE, db.GRADE) AS GRADE,
        db.TRIM,
        pb.MILEAGE,
        CASE
            WHEN UPPER(COALESCE(pb.DEAL_TYPE, '')) LIKE '%USED%' THEN 'U'
            WHEN UPPER(COALESCE(pb.DEAL_TYPE, '')) LIKE '%NEW%' THEN 'N'
            ELSE NULL
        END AS szNewUsed,
        pb.SOLD_TIMESTAMP,
        pb.SOLD_DATE,
        pb.POST_TIMESTAMP,
        pb.IS_DELIVERED,
        pb.DATA_SOURCE AS PURCHASE_DATA_SOURCE,
        pb.PURCHASE_PRICE,
        pb.DEALER_PROFIT,
        pb.FRONT_GROSS,
        pb.BACK_GROSS,
        COALESCE(pb.FRONT_GROSS, 0) + COALESCE(pb.BACK_GROSS, 0) AS TOTAL_GROSS,
        pb.DOWN_PAYMENT,
        pb.FINANCE_AMOUNT,
        pb.INTEREST_RATE,
        pb.MONTHLY_PAYMENT,
        pb.TERM,
        pb.LENDER,
        db.PRIMARY_SALESPERSON,
        db.PRIMARY_BDC_AGENT,
        db.PRIMARY_DESK_MANAGER,
        db.PRIMARY_FI_MANAGER,
        db.PRIMARY_SALES_MANAGER,
        db.ALL_SALESPEOPLE,
        db.ALL_BDC_AGENTS,
        db.ALL_DESK_MANAGERS,
        db.ALL_FI_MANAGERS,
        db.ALL_SALES_MANAGERS,
        db.ALL_OTHER_AGENTS,
        db.NUM_SALESPEOPLE,
        db.NUM_BDCAGENTS,
        CASE WHEN db.TIMESTAMP_PROSPECTIN_DEALERTIME BETWEEN cs.dt_start AND cs.dt_end THEN 1 ELSE 0 END AS lUp,
        CASE WHEN COALESCE(db.NUM_SHOWROOM_VISITS, 0) > 0 THEN 1 ELSE 0 END AS lVisit,
        CASE WHEN db.IS_BE_BACK = TRUE THEN 1 ELSE 0 END AS lBeBack,
        CASE WHEN pb.PURCHASE_ID IS NOT NULL THEN 1 ELSE 0 END AS lSold,
        0 AS lApptCreated,
        0 AS lApptDue,
        0 AS lApptShown,
        0 AS lApptSold,
        0 AS lApptConfirmed,
        0 AS lApptAttemptedConfirmed,
        0 AS IsAppraisalAppt,
        0 AS lApprApptAcquired,
        CASE WHEN db.DEAL_SUBSTATUS = 'Vehicle Acquired' THEN 1 ELSE 0 END AS lAcquired,
        0 AS lDemo,
        0 AS lWriteUp,
        0 AS lTurnOver,
        0 AS lAppraisal,
        CASE
            WHEN db.DEAL_STATUS ILIKE '%inactive%'
              OR db.DEAL_STATUS ILIKE '%lost%'
              OR db.DEAL_SUBSTATUS ILIKE '%lost%'
                THEN 1
            ELSE 0
        END AS lLost,
        CASE
            WHEN db.DEAL_SUBSTATUS ILIKE '%Bad Lead%'
              OR db.INACTIVE_REASON ILIKE '%Bad Lead%'
                THEN 1
            ELSE 0
        END AS lBadLead,
        CASE
            WHEN db.DEAL_SUBSTATUS ILIKE '%Bought Elsewhere%'
              OR db.INACTIVE_REASON ILIKE '%Bought Elsewhere%'
                THEN 1
            ELSE 0
        END AS lBoughtElseWhere,
        0 AS lReassigned,
        CASE WHEN pb.PURCHASE_ID IS NOT NULL THEN CAST(1.0 AS NUMBER(6,1)) ELSE CAST(0.0 AS NUMBER(6,1)) END AS lPrimaryDeal,
        CAST(0.0 AS NUMBER(6,1)) AS lSecondaryDeal,
        CAST(NULL AS NUMBER) AS lResponseTime,
        CAST(NULL AS NUMBER(19,4)) AS curLeadCost
    FROM deal_base db
    JOIN company_scope cs
        ON cs.COMPANY_ID = db.COMPANY_ID
    LEFT JOIN deal_vins dv
        ON dv.COMPANY_ID = db.COMPANY_ID
       AND dv.DEAL_ID = db.DEAL_ID
    LEFT JOIN purchase_base pb
        ON pb.COMPANY_ID = db.COMPANY_ID
       AND pb.DEAL_ID = db.DEAL_ID
),

task_rows AS (
    SELECT
        CASE WHEN tb.TASK_TYPE ILIKE '%service%' OR tb.TASK_NAME ILIKE '%service%' THEN 'service_activity' ELSE 'task' END AS row_origin,
        CASE WHEN tb.TASK_TYPE ILIKE '%service%' OR tb.TASK_NAME ILIKE '%service%' THEN 'service_activity' ELSE 'task' END AS metric_grain,
        CASE WHEN tb.TASK_TYPE ILIKE '%service%' OR tb.TASK_NAME ILIKE '%service%' THEN 'service' ELSE 'opportunity_activity' END AS record_type,
        'task:' || TO_VARCHAR(tb.TASK_ID) AS base_row_key,
        COALESCE(tb.TIMESTAMP_COMPLETED_DEALERTIME, tb.TIMESTAMP_DUE_DEALERTIME, tb.TIMESTAMP_ENTRY_DEALERTIME) AS metric_date,
        tb.COMPANY_ID,
        tb.COMPANY_NAME,
        tb.COMPANY_ID AS CHILD_COMPANY_ID,
        tb.COMPANY_NAME AS CHILD_COMPANY_NAME,
        tb.PERSON_ID,
        tb.PERSON_ID_UNIQUE,
        tb.DEAL_ID,
        tb.DEAL_ID_UNIQUE,
        tb.TASK_ID,
        tb.TASK_ID_UNIQUE,
        tb.TASK_TYPE_ID,
        tb.TASK_TYPE,
        tb.TASK_NAME,
        tb.TASK_OUTCOME,
        tb.APPOINTMENT_OUTCOME,
        tb.USER_ID_CREATED_TASK,
        tb.USER_ID_CURRENT_OWNER,
        tb.USER_ID_COMPLETED_TASK,
        tb.TASK_ITEMS,
        db.UP_TYPE,
        db.INTERNET_UP_TIER,
        db.SOURCE,
        db.COMPANY_SOURCE_NAME,
        db.SUBSOURCE,
        db.SOURCE_DETAILS,
        db.DEAL_STATUS,
        db.DEAL_SUBSTATUS,
        db.INACTIVE_REASON,
        db.TIMESTAMP_PROSPECTIN_DEALERTIME,
        db.TIMESTAMP_ENTRY_DEALERTIME AS DEAL_ENTRY_DEALERTIME,
        db.TIMESTAMP_CLOSED_DEALERTIME,
        db.TIMESTAMP_LASTEDIT_DEALERTIME AS DEAL_LASTEDIT_DEALERTIME,
        db.TIMESTAMP_SUBSTATUSCHANGE_DEALERTIME,
        tb.TIMESTAMP_ENTRY_DEALERTIME AS TASK_ENTRY_DEALERTIME,
        tb.TIMESTAMP_DUE_DEALERTIME AS TASK_DUE_DEALERTIME,
        tb.TIMESTAMP_COMPLETED_DEALERTIME AS TASK_COMPLETED_DEALERTIME,
        db.IS_BE_BACK,
        db.NUM_SHOWROOM_VISITS,
        db.PRIMARY_VEHICLE_SOUGHT_ID,
        db.ALL_VEHICLE_SOUGHT_IDS,
        db.ALL_VINS_SOUGHT,
        db.STOCK_NUMBER AS PROSPECT_STOCK_NUMBER,
        CASE
            WHEN LENGTH(db.VIN) = 17 THEN db.VIN
            WHEN LENGTH(dv.first_full_sought_vin) = 17 THEN dv.first_full_sought_vin
            ELSE NULL
        END AS prospect_vin,
        CASE WHEN LENGTH(pb.VIN) = 17 THEN pb.VIN ELSE NULL END AS sold_vin,
        CASE WHEN LENGTH(inv.VIN) = 17 THEN inv.VIN ELSE NULL END AS service_vin,
        CASE
            WHEN LENGTH(pb.VIN) = 17 THEN pb.VIN
            WHEN LENGTH(db.VIN) = 17 THEN db.VIN
            WHEN LENGTH(dv.first_full_sought_vin) = 17 THEN dv.first_full_sought_vin
            WHEN LENGTH(inv.VIN) = 17 THEN inv.VIN
            ELSE NULL
        END AS resolved_vin,
        CASE
            WHEN LENGTH(pb.VIN) = 17 THEN 'PURCHASES.VIN'
            WHEN LENGTH(db.VIN) = 17 THEN 'DEALS.VIN'
            WHEN LENGTH(dv.first_full_sought_vin) = 17 THEN 'DEALS.ALL_VINS_SOUGHT'
            WHEN LENGTH(inv.VIN) = 17 THEN 'TASKS.VEHICLE_ID -> INVENTORY.VIN'
            ELSE 'unresolved'
        END AS vin_resolution_source,
        pb.PURCHASE_ID,
        pb.PURCHASE_ID_UNIQUE,
        pb.DMS_DEAL_ID,
        pb.VEHICLE_ID AS SOLD_VEHICLE_ID,
        db.PRIMARY_VEHICLE_SOUGHT_ID AS PROSPECT_VEHICLE_ID,
        COALESCE(tb.VEHICLE_ID, tb.CURRENT_VEHICLE_ID) AS SERVICE_VEHICLE_ID,
        COALESCE(pb.DEAL_TYPE, db.UP_TYPE, inv.STOCK_TYPE) AS vehicle_sale_type,
        COALESCE(pb.MAKE, db.MAKE, inv.MAKE) AS MAKE,
        COALESCE(pb.MODEL, db.MODEL, inv.MODEL) AS MODEL,
        COALESCE(pb.YEAR, db.MODEL_YEAR, inv.YEAR) AS MODEL_YEAR,
        COALESCE(pb.GRADE, db.GRADE) AS GRADE,
        db.TRIM,
        COALESCE(pb.MILEAGE, inv.MILEAGE) AS MILEAGE,
        CASE
            WHEN UPPER(COALESCE(pb.DEAL_TYPE, inv.NEW_USED_FLAG, '')) LIKE '%USED%' THEN 'U'
            WHEN UPPER(COALESCE(pb.DEAL_TYPE, inv.NEW_USED_FLAG, '')) LIKE '%NEW%' THEN 'N'
            WHEN UPPER(COALESCE(inv.NEW_USED_FLAG, '')) = 'U' THEN 'U'
            WHEN UPPER(COALESCE(inv.NEW_USED_FLAG, '')) = 'N' THEN 'N'
            ELSE NULL
        END AS szNewUsed,
        pb.SOLD_TIMESTAMP,
        pb.SOLD_DATE,
        pb.POST_TIMESTAMP,
        pb.IS_DELIVERED,
        pb.DATA_SOURCE AS PURCHASE_DATA_SOURCE,
        pb.PURCHASE_PRICE,
        pb.DEALER_PROFIT,
        pb.FRONT_GROSS,
        pb.BACK_GROSS,
        COALESCE(pb.FRONT_GROSS, 0) + COALESCE(pb.BACK_GROSS, 0) AS TOTAL_GROSS,
        pb.DOWN_PAYMENT,
        pb.FINANCE_AMOUNT,
        pb.INTEREST_RATE,
        pb.MONTHLY_PAYMENT,
        pb.TERM,
        pb.LENDER,
        db.PRIMARY_SALESPERSON,
        db.PRIMARY_BDC_AGENT,
        db.PRIMARY_DESK_MANAGER,
        db.PRIMARY_FI_MANAGER,
        db.PRIMARY_SALES_MANAGER,
        db.ALL_SALESPEOPLE,
        db.ALL_BDC_AGENTS,
        db.ALL_DESK_MANAGERS,
        db.ALL_FI_MANAGERS,
        db.ALL_SALES_MANAGERS,
        db.ALL_OTHER_AGENTS,
        db.NUM_SALESPEOPLE,
        db.NUM_BDCAGENTS,
        CASE WHEN db.TIMESTAMP_PROSPECTIN_DEALERTIME BETWEEN cs.dt_start AND cs.dt_end THEN 1 ELSE 0 END AS lUp,
        CASE
            WHEN tb.TASK_TYPE_ID IN (7, 8, 31)
              OR tb.TASK_TYPE ILIKE '%visit%'
              OR tb.TASK_NAME ILIKE '%visit%'
              OR tb.TASK_TYPE ILIKE '%showroom%'
              OR tb.TASK_NAME ILIKE '%showroom%'
                THEN 1
            ELSE 0
        END AS lVisit,
        CASE WHEN db.IS_BE_BACK = TRUE THEN 1 ELSE 0 END AS lBeBack,
        CASE WHEN pb.PURCHASE_ID IS NOT NULL THEN 1 ELSE 0 END AS lSold,
        CASE
            WHEN (tb.TASK_TYPE_ID IN (7, 65) OR tb.TASK_TYPE ILIKE '%appt%' OR tb.TASK_NAME ILIKE '%appt%' OR tb.TASK_TYPE ILIKE '%appointment%' OR tb.TASK_NAME ILIKE '%appointment%')
             AND tb.TIMESTAMP_ENTRY_DEALERTIME BETWEEN cs.dt_start AND cs.dt_end
                THEN 1
            ELSE 0
        END AS lApptCreated,
        CASE
            WHEN (tb.TASK_TYPE_ID IN (7, 65) OR tb.TASK_TYPE ILIKE '%appt%' OR tb.TASK_NAME ILIKE '%appt%' OR tb.TASK_TYPE ILIKE '%appointment%' OR tb.TASK_NAME ILIKE '%appointment%')
             AND tb.TIMESTAMP_DUE_DEALERTIME BETWEEN cs.dt_start AND cs.dt_end
                THEN 1
            ELSE 0
        END AS lApptDue,
        CASE
            WHEN (tb.TASK_TYPE_ID IN (7, 65) OR tb.TASK_TYPE ILIKE '%appt%' OR tb.TASK_NAME ILIKE '%appt%' OR tb.TASK_TYPE ILIKE '%appointment%' OR tb.TASK_NAME ILIKE '%appointment%')
             AND tb.TIMESTAMP_COMPLETED_DEALERTIME BETWEEN cs.dt_start AND cs.dt_end
                THEN 1
            ELSE 0
        END AS lApptShown,
        CASE
            WHEN (tb.TASK_TYPE_ID = 7 OR tb.TASK_TYPE ILIKE '%appt%' OR tb.TASK_NAME ILIKE '%appt%' OR tb.TASK_TYPE ILIKE '%appointment%' OR tb.TASK_NAME ILIKE '%appointment%')
             AND pb.PURCHASE_ID IS NOT NULL
             AND tb.TIMESTAMP_COMPLETED_DEALERTIME IS NOT NULL
             AND DATEDIFF('day', tb.TIMESTAMP_COMPLETED_DEALERTIME, pb.SOLD_TIMESTAMP) = 0
                THEN 1
            ELSE 0
        END AS lApptSold,
        CASE
            WHEN tb.APPOINTMENT_OUTCOME ILIKE '%confirm%'
              OR tb.TASK_OUTCOME ILIKE '%confirm%'
                THEN 1
            ELSE 0
        END AS lApptConfirmed,
        CASE
            WHEN (tb.TASK_OUTCOME ILIKE '%attempt%' OR TO_VARCHAR(tb.TASK_ITEMS) ILIKE '%attempt%')
             AND NOT (tb.APPOINTMENT_OUTCOME ILIKE '%confirm%' OR tb.TASK_OUTCOME ILIKE '%confirm%')
                THEN 1
            ELSE 0
        END AS lApptAttemptedConfirmed,
        CASE
            WHEN tb.TASK_TYPE_ID = 65
              OR tb.TASK_TYPE ILIKE '%appraisal%'
              OR tb.TASK_NAME ILIKE '%appraisal%'
              OR TO_VARCHAR(tb.TASK_ITEMS) ILIKE '%appraisal%'
                THEN 1
            ELSE 0
        END AS IsAppraisalAppt,
        CASE
            WHEN (tb.TASK_TYPE_ID = 65 OR tb.TASK_TYPE ILIKE '%appraisal%' OR tb.TASK_NAME ILIKE '%appraisal%' OR TO_VARCHAR(tb.TASK_ITEMS) ILIKE '%appraisal%')
             AND db.DEAL_SUBSTATUS = 'Vehicle Acquired'
                THEN 1
            ELSE 0
        END AS lApprApptAcquired,
        CASE WHEN db.DEAL_SUBSTATUS = 'Vehicle Acquired' THEN 1 ELSE 0 END AS lAcquired,
        CASE WHEN TO_VARCHAR(tb.TASK_ITEMS) ILIKE '%demo%' THEN 1 ELSE 0 END AS lDemo,
        CASE WHEN TO_VARCHAR(tb.TASK_ITEMS) ILIKE '%write%' THEN 1 ELSE 0 END AS lWriteUp,
        CASE WHEN TO_VARCHAR(tb.TASK_ITEMS) ILIKE '%turn%' OR TO_VARCHAR(tb.TASK_ITEMS) ILIKE '%TO%' THEN 1 ELSE 0 END AS lTurnOver,
        CASE WHEN TO_VARCHAR(tb.TASK_ITEMS) ILIKE '%appraisal%' THEN 1 ELSE 0 END AS lAppraisal,
        CASE
            WHEN db.DEAL_STATUS ILIKE '%inactive%'
              OR db.DEAL_STATUS ILIKE '%lost%'
              OR db.DEAL_SUBSTATUS ILIKE '%lost%'
                THEN 1
            ELSE 0
        END AS lLost,
        CASE
            WHEN db.DEAL_SUBSTATUS ILIKE '%Bad Lead%'
              OR db.INACTIVE_REASON ILIKE '%Bad Lead%'
                THEN 1
            ELSE 0
        END AS lBadLead,
        CASE
            WHEN db.DEAL_SUBSTATUS ILIKE '%Bought Elsewhere%'
              OR db.INACTIVE_REASON ILIKE '%Bought Elsewhere%'
                THEN 1
            ELSE 0
        END AS lBoughtElseWhere,
        CASE
            WHEN tb.USER_ID_COMPLETED_TASK IS NOT NULL
             AND tb.USER_ID_CURRENT_OWNER IS NOT NULL
             AND tb.USER_ID_COMPLETED_TASK <> tb.USER_ID_CURRENT_OWNER
                THEN 1
            ELSE 0
        END AS lReassigned,
        CASE WHEN pb.PURCHASE_ID IS NOT NULL THEN CAST(1.0 AS NUMBER(6,1)) ELSE CAST(0.0 AS NUMBER(6,1)) END AS lPrimaryDeal,
        CAST(0.0 AS NUMBER(6,1)) AS lSecondaryDeal,
        CAST(NULL AS NUMBER) AS lResponseTime,
        CAST(NULL AS NUMBER(19,4)) AS curLeadCost
    FROM task_base tb
    JOIN company_scope cs
        ON cs.COMPANY_ID = tb.COMPANY_ID
    LEFT JOIN deal_base db
        ON db.COMPANY_ID = tb.COMPANY_ID
       AND db.DEAL_ID = tb.DEAL_ID
    LEFT JOIN deal_vins dv
        ON dv.COMPANY_ID = tb.COMPANY_ID
       AND dv.DEAL_ID = tb.DEAL_ID
    LEFT JOIN purchase_base pb
        ON pb.COMPANY_ID = tb.COMPANY_ID
       AND pb.DEAL_ID = tb.DEAL_ID
    LEFT JOIN inventory_base inv
        ON inv.COMPANY_ID = tb.COMPANY_ID
       AND inv.VEHICLE_ID = COALESCE(tb.VEHICLE_ID, tb.CURRENT_VEHICLE_ID)
),

base_rows AS (
    SELECT * FROM deal_rows
    UNION ALL
    SELECT * FROM task_rows
)

SELECT
    base_row_key,
    record_type,
    row_origin,
    metric_grain,
    metric_date,
    COMPANY_ID AS lCompanyID,
    COMPANY_NAME AS company_name,
    CHILD_COMPANY_ID AS lChildCompanyID,
    CHILD_COMPANY_NAME AS child_company_name,
    PERSON_ID AS lPersonID,
    PERSON_ID_UNIQUE AS person_id_unique,
    DEAL_ID AS lDealID,
    DEAL_ID_UNIQUE AS deal_id_unique,
    TASK_ID AS lTaskID,
    TASK_ID_UNIQUE AS task_id_unique,
    TASK_TYPE_ID AS lTaskTypeID,
    TASK_TYPE AS task_type,
    TASK_NAME AS task_name,
    TASK_OUTCOME AS task_outcome,
    APPOINTMENT_OUTCOME AS appointment_outcome,
    prospect_vin,
    sold_vin,
    service_vin,
    resolved_vin,
    vin_resolution_source,
    PROSPECT_VEHICLE_ID AS prospect_vehicle_id,
    SOLD_VEHICLE_ID AS sold_vehicle_id,
    SERVICE_VEHICLE_ID AS service_vehicle_id,
    PURCHASE_ID AS lPurchaseDetailsID,
    PURCHASE_ID_UNIQUE AS purchase_id_unique,
    DMS_DEAL_ID AS szLegacyDealID,
    szNewUsed,
    MAKE AS make,
    MODEL AS model,
    MODEL_YEAR AS model_year,
    GRADE AS grade,
    TRIM AS trim,
    MILEAGE AS mileage,
    vehicle_sale_type,
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
    FRONT_GROSS AS curFront,
    BACK_GROSS AS curBack,
    TOTAL_GROSS AS curTotal,
    lResponseTime,
    curLeadCost,
    SOURCE AS szSource,
    COMPANY_SOURCE_NAME AS company_source_name,
    SUBSOURCE AS szSubSource,
    SOURCE_DETAILS AS source_details,
    INTERNET_UP_TIER AS nliInternetUpTier,
    UP_TYPE AS szUpType,
    DEAL_STATUS AS szStatus,
    DEAL_SUBSTATUS AS szDealSubStatus,
    INACTIVE_REASON AS inactive_reason,
    TIMESTAMP_PROSPECTIN_DEALERTIME AS dtProspectIn,
    DEAL_ENTRY_DEALERTIME AS dtDealEntry,
    TIMESTAMP_CLOSED_DEALERTIME AS dtClosed,
    SOLD_TIMESTAMP AS dtSold,
    TASK_ENTRY_DEALERTIME AS dtCreated,
    TASK_DUE_DEALERTIME AS dtDue,
    TASK_COMPLETED_DEALERTIME AS dtCompleted,
    PRIMARY_SALESPERSON AS primary_salesperson,
    PRIMARY_BDC_AGENT AS primary_bdc_agent,
    PRIMARY_DESK_MANAGER AS primary_desk_manager,
    PRIMARY_FI_MANAGER AS primary_fi_manager,
    PRIMARY_SALES_MANAGER AS primary_sales_manager,
    ALL_SALESPEOPLE AS all_salespeople,
    ALL_BDC_AGENTS AS all_bdc_agents,
    ALL_DESK_MANAGERS AS all_desk_managers,
    ALL_FI_MANAGERS AS all_fi_managers,
    ALL_SALES_MANAGERS AS all_sales_managers,
    USER_ID_CREATED_TASK AS lCreatedByID,
    USER_ID_CURRENT_OWNER AS lCurrentOwnerID,
    USER_ID_COMPLETED_TASK AS lCompletedByID,
    TASK_ITEMS AS task_items,
    PURCHASE_PRICE AS purchase_price,
    DEALER_PROFIT AS dealer_profit,
    DOWN_PAYMENT AS down_payment,
    FINANCE_AMOUNT AS finance_amount,
    INTEREST_RATE AS finance_rate,
    MONTHLY_PAYMENT AS monthly_payment,
    TERM AS finance_term,
    LENDER AS lender,
    PURCHASE_DATA_SOURCE AS purchase_data_source,
    IS_DELIVERED AS is_delivered,
    POST_TIMESTAMP AS purchase_post_timestamp
FROM base_rows
ORDER BY
    metric_date,
    lCompanyID,
    lDealID,
    lTaskID;

-- Add this while testing in the worksheet if you want a small result set:
-- LIMIT 100;
