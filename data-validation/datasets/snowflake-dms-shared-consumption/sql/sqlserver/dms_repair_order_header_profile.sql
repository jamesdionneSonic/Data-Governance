-- WP-DVL-004 read-only profiling query for SQL Server DMS repair-order headers.
--
-- Purpose:
--   Profile DMS RO-level header candidates separately from line/detail tables.
--   DMS remains the source of record.
--
-- Parameters to replace in runner:
--   {{DAYS_BACK}} defaults to 30.

with base as (
  select
    'dbo.servicesalesclosed' as source_object,
    cast(cora_acct_id as varchar(100)) as cora_acct_id,
    cast(Meta_ADPGroup as varchar(100)) as meta_adp_group,
    cast(Meta_StageGroupNumber as varchar(100)) as meta_stage_group_number,
    cast(ronumber as varchar(100)) as repair_order_number,
    cast(vehid as varchar(100)) as vehicle_id,
    cast(hostitemid as varchar(100)) as host_item_id,
    try_convert(date, closedate) as ro_close_date,
    try_convert(date, opendate) as ro_open_date,
    try_convert(date, posteddate) as posted_date,
    try_convert(date, apptdate) as appointment_date,
    try_convert(datetime2, rowlastupdated) as row_last_updated,
    try_convert(datetime2, Meta_LoadDate) as meta_load_date,
    try_convert(decimal(19, 4), laborsale) as labor_sale,
    try_convert(decimal(19, 4), partssale) as parts_sale,
    try_convert(decimal(19, 4), miscsale) as misc_sale,
    try_convert(decimal(19, 4), actualhours) as actual_hours,
    try_convert(decimal(19, 4), soldhours) as sold_hours
  from dbo.servicesalesclosed
  where coalesce(try_convert(date, closedate), try_convert(date, opendate), try_convert(date, rowlastupdated), try_convert(date, Meta_LoadDate))
        >= dateadd(day, -{{DAYS_BACK}}, cast(getdate() as date))

  union all

  select
    'dbo.servicesalesopen' as source_object,
    cast(cora_acct_id as varchar(100)),
    cast(Meta_ADPGroup as varchar(100)),
    cast(Meta_StageGroupNumber as varchar(100)),
    cast(ronumber as varchar(100)),
    cast(vehid as varchar(100)),
    cast(hostitemid as varchar(100)),
    try_convert(date, closedate),
    try_convert(date, opendate),
    cast(null as date),
    try_convert(date, apptdate),
    try_convert(datetime2, rowlastupdated),
    try_convert(datetime2, Meta_LoadDate),
    try_convert(decimal(19, 4), laborsale),
    try_convert(decimal(19, 4), partssale),
    try_convert(decimal(19, 4), miscsale),
    try_convert(decimal(19, 4), actualhours),
    try_convert(decimal(19, 4), soldhours)
  from dbo.servicesalesopen
  where coalesce(try_convert(date, closedate), try_convert(date, opendate), try_convert(date, rowlastupdated), try_convert(date, Meta_LoadDate))
        >= dateadd(day, -{{DAYS_BACK}}, cast(getdate() as date))
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
    ro_close_date,
    ro_open_date,
    posted_date,
    appointment_date,
    row_last_updated,
    meta_load_date,
    labor_sale,
    parts_sale,
    misc_sale,
    actual_hours,
    sold_hours,
    coalesce(nullif(cora_acct_id, ''), nullif(meta_adp_group, ''), nullif(meta_stage_group_number, ''), 'unknown') as dealer_candidate,
    coalesce(ro_close_date, ro_open_date, posted_date, appointment_date, cast(row_last_updated as date), cast(meta_load_date as date)) as business_date
  from base
),
daily as (
  select
    source_object,
    business_date,
    dealer_candidate,
    count_big(*) as row_count,
    count(distinct repair_order_number) as distinct_repair_orders,
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
    sum(case when vehicle_id is null or ltrim(rtrim(vehicle_id)) = '' then 1 else 0 end) as null_vehicle_id_count,
    sum(case when ro_close_date is null then 1 else 0 end) as null_ro_close_date_count,
    count(distinct dealer_candidate + '|' + coalesce(repair_order_number, '')) as distinct_dealer_ro_keys,
    count(distinct dealer_candidate + '|' + coalesce(repair_order_number, '') + '|' + coalesce(vehicle_id, '')) as distinct_dealer_ro_vehicle_keys
  from normalized
  group by source_object, dealer_candidate
),
date_profile as (
  select source_object, 'ro_close_date' as date_field, count(ro_close_date) as populated_count, min(ro_close_date) as min_date, max(ro_close_date) as max_date from normalized group by source_object
  union all
  select source_object, 'ro_open_date', count(ro_open_date), min(ro_open_date), max(ro_open_date) from normalized group by source_object
  union all
  select source_object, 'posted_date', count(posted_date), min(posted_date), max(posted_date) from normalized group by source_object
  union all
  select source_object, 'appointment_date', count(appointment_date), min(appointment_date), max(appointment_date) from normalized group by source_object
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
  distinct_vehicle_ids,
  labor_sale_total,
  parts_sale_total,
  misc_sale_total,
  actual_hours_total,
  sold_hours_total,
  cast(null as bigint) as null_ro_number_count,
  cast(null as bigint) as null_vehicle_id_count,
  cast(null as bigint) as null_ro_close_date_count,
  cast(null as bigint) as duplicate_dealer_ro_key_count,
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
  convert(varchar(30), min_date, 23),
  convert(varchar(30), max_date, 23)
from date_profile
order by profile_section, source_object, profile_key, dealer_candidate;
