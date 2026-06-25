-- WP-DVL-002 read-only profiling query for Snowflake REPAIR_ORDER_RAW.
--
-- Purpose:
--   Profile dealer/date/key/timestamp candidates before final comparison rules.
--
-- Parameters to replace in runner:
--   {{DAYS_BACK}} defaults to 30.
--
-- Dealer scope:
--   Keep the dealership filter disabled until WP-DVL-004 confirms which source
--   columns map to Jaguar Land Rover Santa Monica and Mercedes-Benz of Calabasas.
--   Candidate dealer fields in this table are DEALERCODE, STORENUMBER, and
--   EIS_STORE_ID.

with base as (
  select
    cast(DEALERCODE as varchar) as dealer_code,
    cast(STORENUMBER as varchar) as store_number,
    cast(EIS_STORE_ID as varchar) as eis_store_id,
    cast(ACCOUNTINGACCOUNT as varchar) as accounting_account,
    cast(RONUM as varchar) as repair_order_number,
    cast(HISTORYRONUMBER as varchar) as history_ro_number,
    cast(MFRHISTORYRONUMBER as varchar) as mfr_history_ro_number,
    cast(VEHID as varchar) as vehicle_id,
    cast(STOCKNUM as varchar) as stock_number,
    cast(ROOPENDATE as date) as ro_open_date,
    cast(ROCLOSEDATE as date) as ro_close_date,
    cast(APPOINTMENTDATE as date) as appointment_date,
    cast(INVOICEPOSTDATE as date) as invoice_post_date,
    cast(PROMISEDATE as date) as promise_date,
    cast(LANDING_TIME as timestamp_tz) as landing_time,
    try_to_number(PAYCPTOTAL) as customer_pay_total,
    try_to_number(PAYBALANCEDUE) as balance_due,
    try_to_number(TOTALACTUALLABORHOURS) as actual_labor_hours,
    try_to_number(TOTALBILLEDLABORHOURS) as billed_labor_hours,
    try_to_number(TOTALTAXPRICE) as total_tax_price
  from CDK_DN_TITAN_FTR_UNMASK_E100030_SHARE.CONSUMPTION_SHARED_E100030.REPAIR_ORDER_RAW
  where coalesce(ROCLOSEDATE, ROOPENDATE, APPOINTMENTDATE, INVOICEPOSTDATE, cast(LANDING_TIME as date))
        >= dateadd(day, -{{DAYS_BACK}}, current_date())
),
normalized as (
  select
    dealer_code,
    store_number,
    eis_store_id,
    accounting_account,
    repair_order_number,
    history_ro_number,
    mfr_history_ro_number,
    vehicle_id,
    stock_number,
    ro_open_date,
    ro_close_date,
    appointment_date,
    invoice_post_date,
    promise_date,
    landing_time,
    customer_pay_total,
    balance_due,
    actual_labor_hours,
    billed_labor_hours,
    total_tax_price,
    coalesce(nullif(dealer_code, ''), nullif(store_number, ''), nullif(eis_store_id, ''), 'unknown') as dealer_candidate,
    coalesce(ro_close_date, ro_open_date, appointment_date, invoice_post_date, cast(landing_time as date)) as business_date
  from base
),
daily as (
  select
    business_date,
    dealer_candidate,
    count(*) as row_count,
    count(distinct repair_order_number) as distinct_repair_orders,
    count(distinct vehicle_id) as distinct_vehicle_ids,
    sum(customer_pay_total) as customer_pay_total,
    sum(balance_due) as balance_due_total,
    sum(actual_labor_hours) as actual_labor_hours_total,
    sum(billed_labor_hours) as billed_labor_hours_total,
    max(landing_time) as latest_landing_time
  from normalized
  group by 1, 2
),
key_profile as (
  select
    dealer_candidate,
    count(*) as row_count,
    count_if(repair_order_number is null or trim(repair_order_number) = '') as null_ro_number_count,
    count_if(vehicle_id is null or trim(vehicle_id) = '') as null_vehicle_id_count,
    count_if(ro_close_date is null) as null_ro_close_date_count,
    count(distinct dealer_candidate || '|' || coalesce(repair_order_number, '')) as distinct_dealer_ro_keys,
    count(distinct dealer_candidate || '|' || coalesce(repair_order_number, '') || '|' || coalesce(vehicle_id, '')) as distinct_dealer_ro_vehicle_keys
  from normalized
  group by 1
),
date_profile as (
  select 'ro_close_date' as date_field, count_if(ro_close_date is not null) as populated_count, min(ro_close_date) as min_date, max(ro_close_date) as max_date from normalized
  union all
  select 'ro_open_date', count_if(ro_open_date is not null), min(ro_open_date), max(ro_open_date) from normalized
  union all
  select 'appointment_date', count_if(appointment_date is not null), min(appointment_date), max(appointment_date) from normalized
  union all
  select 'invoice_post_date', count_if(invoice_post_date is not null), min(invoice_post_date), max(invoice_post_date) from normalized
)
select
  'daily_summary' as profile_section,
  to_varchar(business_date) as profile_key,
  dealer_candidate,
  row_count,
  distinct_repair_orders,
  distinct_vehicle_ids,
  customer_pay_total,
  balance_due_total,
  actual_labor_hours_total,
  billed_labor_hours_total,
  null as null_ro_number_count,
  null as null_vehicle_id_count,
  null as null_ro_close_date_count,
  null as duplicate_dealer_ro_key_count,
  null as duplicate_dealer_ro_vehicle_key_count,
  to_varchar(latest_landing_time) as latest_source_timestamp,
  null as min_date,
  null as max_date
from daily
union all
select
  'key_profile',
  'candidate_key_quality',
  dealer_candidate,
  row_count,
  null,
  null,
  null,
  null,
  null,
  null,
  null_ro_number_count,
  null_vehicle_id_count,
  null_ro_close_date_count,
  row_count - distinct_dealer_ro_keys,
  row_count - distinct_dealer_ro_vehicle_keys,
  null,
  null,
  null
from key_profile
union all
select
  'date_profile',
  date_field,
  'all_dealers',
  populated_count,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  to_varchar(min_date),
  to_varchar(max_date)
from date_profile
order by profile_section, profile_key, dealer_candidate;
