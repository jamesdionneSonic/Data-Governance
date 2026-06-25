-- WP-DVL-002 read-only profiling query for SQL Server DMS repair/service.
--
-- Purpose:
--   Profile DMS repair/service candidate objects before selecting final keys and
--   comparison grain. DMS remains the source of record.
--
-- Important grain caveat:
--   dbo.servicesalesdetailsclosed contains repair-order line/detail measures and
--   ronumber, but no clean RO open/close business date. dbo.appointments
--   contains appointment dates and appointment keys. This query keeps those
--   candidate grains separate instead of forcing a false one-table match.
--
-- Parameters to replace in runner:
--   {{DAYS_BACK}} defaults to 30.

with service_detail as (
  select
    'dbo.servicesalesdetailsclosed' as source_object,
    cast(cora_acct_id as varchar(100)) as cora_acct_id,
    cast(Meta_ADPGroup as varchar(100)) as meta_adp_group,
    cast(Meta_StageGroupNumber as varchar(100)) as meta_stage_group_number,
    cast(ronumber as varchar(100)) as repair_order_number,
    cast(vehid as varchar(100)) as vehicle_id,
    cast(hostitemid as varchar(100)) as host_item_id,
    cast(null as varchar(100)) as appointment_id,
    cast(null as varchar(100)) as vin,
    cast(null as varchar(100)) as stock_number,
    cast(null as date) as appointment_date,
    cast(null as date) as appointment_open_date,
    cast(null as date) as promise_date,
    try_convert(datetime2, rowlastupdated) as row_last_updated,
    try_convert(datetime2, Meta_LoadDate) as meta_load_date,
    try_convert(decimal(19, 4), laborsale) as labor_sale,
    try_convert(decimal(19, 4), partssale) as parts_sale,
    try_convert(decimal(19, 4), miscsale) as misc_sale,
    try_convert(decimal(19, 4), actualhours) as actual_hours,
    try_convert(decimal(19, 4), soldhours) as sold_hours
  from dbo.servicesalesdetailsclosed
  where coalesce(try_convert(date, rowlastupdated), try_convert(date, Meta_LoadDate))
        >= dateadd(day, -{{DAYS_BACK}}, cast(getdate() as date))
),
appointment_detail as (
  select
    'dbo.appointments' as source_object,
    cast(cora_acct_id as varchar(100)) as cora_acct_id,
    cast(Meta_ADPGroup as varchar(100)) as meta_adp_group,
    cast(Meta_StageGroupNumber as varchar(100)) as meta_stage_group_number,
    cast(null as varchar(100)) as repair_order_number,
    cast(vehid as varchar(100)) as vehicle_id,
    cast(hostitemid as varchar(100)) as host_item_id,
    cast(apptid as varchar(100)) as appointment_id,
    cast(vin as varchar(100)) as vin,
    cast(stockno as varchar(100)) as stock_number,
    try_convert(date, appointmentdate) as appointment_date,
    try_convert(date, apptopendate) as appointment_open_date,
    try_convert(date, promisedate) as promise_date,
    try_convert(datetime2, rowlastupdated) as row_last_updated,
    try_convert(datetime2, Meta_LoadDate) as meta_load_date,
    cast(null as decimal(19, 4)) as labor_sale,
    cast(null as decimal(19, 4)) as parts_sale,
    cast(null as decimal(19, 4)) as misc_sale,
    cast(null as decimal(19, 4)) as actual_hours,
    cast(null as decimal(19, 4)) as sold_hours
  from dbo.appointments
  where coalesce(try_convert(date, appointmentdate), try_convert(date, apptopendate), try_convert(date, promisedate), try_convert(date, rowlastupdated), try_convert(date, Meta_LoadDate))
        >= dateadd(day, -{{DAYS_BACK}}, cast(getdate() as date))
),
base as (
  select
    source_object,
    cora_acct_id,
    meta_adp_group,
    meta_stage_group_number,
    repair_order_number,
    vehicle_id,
    host_item_id,
    appointment_id,
    vin,
    stock_number,
    appointment_date,
    appointment_open_date,
    promise_date,
    row_last_updated,
    meta_load_date,
    labor_sale,
    parts_sale,
    misc_sale,
    actual_hours,
    sold_hours
  from service_detail
  union all
  select
    source_object,
    cora_acct_id,
    meta_adp_group,
    meta_stage_group_number,
    repair_order_number,
    vehicle_id,
    host_item_id,
    appointment_id,
    vin,
    stock_number,
    appointment_date,
    appointment_open_date,
    promise_date,
    row_last_updated,
    meta_load_date,
    labor_sale,
    parts_sale,
    misc_sale,
    actual_hours,
    sold_hours
  from appointment_detail
),
normalized as (
  select
    source_object,
    cora_acct_id,
    meta_adp_group,
    meta_stage_group_number,
    repair_order_number,
    vehicle_id,
    host_item_id,
    appointment_id,
    vin,
    stock_number,
    appointment_date,
    appointment_open_date,
    promise_date,
    row_last_updated,
    meta_load_date,
    labor_sale,
    parts_sale,
    misc_sale,
    actual_hours,
    sold_hours,
    coalesce(nullif(cora_acct_id, ''), nullif(meta_adp_group, ''), nullif(meta_stage_group_number, ''), 'unknown') as dealer_candidate,
    coalesce(appointment_date, appointment_open_date, promise_date, cast(row_last_updated as date), cast(meta_load_date as date)) as business_date
  from base
),
daily as (
  select
    source_object,
    business_date,
    dealer_candidate,
    count_big(*) as row_count,
    count(distinct repair_order_number) as distinct_repair_orders,
    count(distinct appointment_id) as distinct_appointments,
    count(distinct vehicle_id) as distinct_vehicle_ids,
    sum(labor_sale) as labor_sale_total,
    sum(parts_sale) as parts_sale_total,
    sum(misc_sale) as misc_sale_total,
    sum(actual_hours) as actual_hours_total,
    sum(sold_hours) as sold_hours_total,
    max(coalesce(row_last_updated, meta_load_date)) as latest_source_timestamp
  from normalized
  group by source_object, business_date, dealer_candidate
),
key_profile as (
  select
    source_object,
    dealer_candidate,
    count_big(*) as row_count,
    sum(case when repair_order_number is null or ltrim(rtrim(repair_order_number)) = '' then 1 else 0 end) as null_ro_number_count,
    sum(case when appointment_id is null or ltrim(rtrim(appointment_id)) = '' then 1 else 0 end) as null_appointment_id_count,
    sum(case when vehicle_id is null or ltrim(rtrim(vehicle_id)) = '' then 1 else 0 end) as null_vehicle_id_count,
    count(distinct dealer_candidate + '|' + coalesce(repair_order_number, '')) as distinct_dealer_ro_keys,
    count(distinct dealer_candidate + '|' + coalesce(appointment_id, '')) as distinct_dealer_appointment_keys,
    count(distinct dealer_candidate + '|' + coalesce(repair_order_number, '') + '|' + coalesce(vehicle_id, '')) as distinct_dealer_ro_vehicle_keys
  from normalized
  group by source_object, dealer_candidate
),
date_profile as (
  select source_object, 'appointment_date' as date_field, count(appointment_date) as populated_count, min(appointment_date) as min_date, max(appointment_date) as max_date from normalized group by source_object
  union all
  select source_object, 'appointment_open_date', count(appointment_open_date), min(appointment_open_date), max(appointment_open_date) from normalized group by source_object
  union all
  select source_object, 'promise_date', count(promise_date), min(promise_date), max(promise_date) from normalized group by source_object
  union all
  select source_object, 'row_last_updated', count(row_last_updated), min(cast(row_last_updated as date)), max(cast(row_last_updated as date)) from normalized group by source_object
  union all
  select source_object, 'meta_load_date', count(meta_load_date), min(cast(meta_load_date as date)), max(cast(meta_load_date as date)) from normalized group by source_object
)
select
  'daily_summary' as profile_section,
  source_object,
  convert(varchar(30), business_date, 23) as profile_key,
  dealer_candidate,
  row_count,
  distinct_repair_orders,
  distinct_appointments,
  distinct_vehicle_ids,
  labor_sale_total,
  parts_sale_total,
  misc_sale_total,
  actual_hours_total,
  sold_hours_total,
  cast(null as bigint) as null_ro_number_count,
  cast(null as bigint) as null_appointment_id_count,
  cast(null as bigint) as null_vehicle_id_count,
  cast(null as bigint) as duplicate_dealer_ro_key_count,
  cast(null as bigint) as duplicate_dealer_appointment_key_count,
  cast(null as bigint) as duplicate_dealer_ro_vehicle_key_count,
  convert(varchar(33), latest_source_timestamp, 126) as latest_source_timestamp,
  cast(null as varchar(30)) as min_date,
  cast(null as varchar(30)) as max_date
from daily
union all
select
  'key_profile',
  source_object,
  'candidate_key_quality',
  dealer_candidate,
  row_count,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null_ro_number_count,
  null_appointment_id_count,
  null_vehicle_id_count,
  row_count - distinct_dealer_ro_keys,
  row_count - distinct_dealer_appointment_keys,
  row_count - distinct_dealer_ro_vehicle_keys,
  null,
  null,
  null
from key_profile
union all
select
  'date_profile',
  source_object,
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
  null,
  null,
  null,
  convert(varchar(30), min_date, 23),
  convert(varchar(30), max_date, 23)
from date_profile
order by profile_section, source_object, profile_key, dealer_candidate;
