-- WP-DVL-002 read-only profiling query for SQL Server DMS vehicle sales.
--
-- Purpose:
--   Profile DMS vehicle sales candidate objects before selecting final keys and
--   comparison grain. DMS remains the source of record.
--
-- Parameters to replace in runner:
--   {{DAYS_BACK}} defaults to 30.
--
-- Dealer scope:
--   Keep the dealership filter disabled until WP-DVL-004 confirms which DMS
--   values map to Jaguar Land Rover Santa Monica and Mercedes-Benz of Calabasas.
--   Candidate dealer fields are cora_acct_id, branch, Meta_ADPGroup, and
--   Meta_StageGroupNumber.

with base as (
  select
    'dbo.vehiclesales' as source_object,
    cast(cora_acct_id as varchar(100)) as cora_acct_id,
    cast(branch as varchar(100)) as branch,
    cast(Meta_ADPGroup as varchar(100)) as meta_adp_group,
    cast(Meta_StageGroupNumber as varchar(100)) as meta_stage_group_number,
    cast(dealno as varchar(100)) as deal_number,
    cast(vin as varchar(100)) as vin,
    cast(stockno as varchar(100)) as stock_number,
    try_convert(date, salesdate) as sales_date,
    try_convert(date, contractdate) as contract_date,
    try_convert(date, accountingdate) as accounting_date,
    try_convert(datetime2, rowlastupdated) as row_last_updated,
    try_convert(datetime2, Meta_LoadDate) as meta_load_date,
    try_convert(decimal(19, 4), grossprofit) as gross_profit,
    try_convert(decimal(19, 4), totalgross) as total_gross,
    try_convert(decimal(19, 4), cashprice) as cash_price,
    try_convert(decimal(19, 4), financeamt) as finance_amount
  from dbo.vehiclesales
  where coalesce(try_convert(date, salesdate), try_convert(date, contractdate), try_convert(date, accountingdate), try_convert(date, rowlastupdated), try_convert(date, Meta_LoadDate))
        >= dateadd(day, -{{DAYS_BACK}}, cast(getdate() as date))

  union all

  select
    'dbo.vehiclesalescurrent' as source_object,
    cast(cora_acct_id as varchar(100)),
    cast(branch as varchar(100)),
    cast(Meta_ADPGroup as varchar(100)),
    cast(Meta_StageGroupNumber as varchar(100)),
    cast(dealno as varchar(100)),
    cast(vin as varchar(100)),
    cast(stockno as varchar(100)),
    try_convert(date, salesdate),
    try_convert(date, contractdate),
    try_convert(date, accountingdate),
    try_convert(datetime2, rowlastupdated),
    try_convert(datetime2, Meta_LoadDate),
    try_convert(decimal(19, 4), grossprofit),
    try_convert(decimal(19, 4), totalgross),
    try_convert(decimal(19, 4), cashprice),
    try_convert(decimal(19, 4), financeamt)
  from dbo.vehiclesalescurrent
  where coalesce(try_convert(date, salesdate), try_convert(date, contractdate), try_convert(date, accountingdate), try_convert(date, rowlastupdated), try_convert(date, Meta_LoadDate))
        >= dateadd(day, -{{DAYS_BACK}}, cast(getdate() as date))
),
normalized as (
  select
    source_object,
    cora_acct_id,
    branch,
    meta_adp_group,
    meta_stage_group_number,
    deal_number,
    vin,
    stock_number,
    sales_date,
    contract_date,
    accounting_date,
    row_last_updated,
    meta_load_date,
    gross_profit,
    total_gross,
    cash_price,
    finance_amount,
    coalesce(nullif(branch, ''), nullif(cora_acct_id, ''), nullif(meta_adp_group, ''), nullif(meta_stage_group_number, ''), 'unknown') as dealer_candidate,
    coalesce(sales_date, contract_date, accounting_date, cast(row_last_updated as date), cast(meta_load_date as date)) as business_date
  from base
),
daily as (
  select
    source_object,
    business_date,
    dealer_candidate,
    count_big(*) as row_count,
    count(distinct deal_number) as distinct_deals,
    count(distinct vin) as distinct_vins,
    sum(gross_profit) as gross_profit_total,
    sum(total_gross) as total_gross_total,
    sum(cash_price) as cash_price_total,
    sum(finance_amount) as finance_amount_total,
    max(coalesce(row_last_updated, meta_load_date)) as latest_source_timestamp
  from normalized
  group by source_object, business_date, dealer_candidate
),
key_profile as (
  select
    source_object,
    dealer_candidate,
    count_big(*) as row_count,
    sum(case when deal_number is null or ltrim(rtrim(deal_number)) = '' then 1 else 0 end) as null_deal_number_count,
    sum(case when vin is null or ltrim(rtrim(vin)) = '' then 1 else 0 end) as null_vin_count,
    sum(case when stock_number is null or ltrim(rtrim(stock_number)) = '' then 1 else 0 end) as null_stock_number_count,
    count(distinct dealer_candidate + '|' + coalesce(deal_number, '')) as distinct_dealer_deal_keys,
    count(distinct dealer_candidate + '|' + coalesce(vin, '') + '|' + coalesce(stock_number, '') + '|' + coalesce(convert(varchar(10), sales_date, 23), '')) as distinct_dealer_vin_stock_date_keys
  from normalized
  group by source_object, dealer_candidate
),
date_profile as (
  select source_object, 'sales_date' as date_field, count(sales_date) as populated_count, min(sales_date) as min_date, max(sales_date) as max_date from normalized group by source_object
  union all
  select source_object, 'contract_date', count(contract_date), min(contract_date), max(contract_date) from normalized group by source_object
  union all
  select source_object, 'accounting_date', count(accounting_date), min(accounting_date), max(accounting_date) from normalized group by source_object
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
  distinct_deals,
  distinct_vins,
  gross_profit_total,
  total_gross_total,
  cash_price_total,
  finance_amount_total,
  cast(null as bigint) as null_deal_number_count,
  cast(null as bigint) as null_vin_count,
  cast(null as bigint) as null_stock_number_count,
  cast(null as bigint) as duplicate_dealer_deal_key_count,
  cast(null as bigint) as duplicate_dealer_vin_stock_date_key_count,
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
  null_deal_number_count,
  null_vin_count,
  null_stock_number_count,
  row_count - distinct_dealer_deal_keys,
  row_count - distinct_dealer_vin_stock_date_keys,
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
  convert(varchar(30), min_date, 23),
  convert(varchar(30), max_date, 23)
from date_profile
order by profile_section, source_object, profile_key, dealer_candidate;
