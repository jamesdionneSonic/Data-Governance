-- WP-DVL-002 read-only profiling query for Snowflake VEHICLE_SALES_RAW.
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
--   Candidate dealer fields in this table are BRANCH and EIS_STORE_ID.

with base as (
  select
    cast(BRANCH as varchar) as branch,
    cast(EIS_STORE_ID as varchar) as eis_store_id,
    cast(ACCOUNTINGACCOUNT as varchar) as accounting_account,
    cast(DEALNUMBER as varchar) as deal_number,
    cast(INVVIN as varchar) as vin,
    cast(INVSTOCKNUM as varchar) as stock_number,
    cast(SALESDATE as date) as sales_date,
    cast(CONTRACTDATE as date) as contract_date,
    cast(DEALSTATUSDATE as date) as deal_status_date,
    cast(DELIVERYDATE as date) as delivery_date,
    cast(LANDING_TIME as timestamp_tz) as landing_time,
    try_to_number(VEHICLESALEPRICE) as vehicle_sale_price,
    try_to_number(GROSSPROFIT) as gross_profit,
    try_to_number(TOTALGROSSPROFIT) as total_gross_profit,
    try_to_number(TOTALTAX) as total_tax,
    try_to_number(TOTALTRADESACV) as total_trades_acv
  from CDK_DN_TITAN_FTR_UNMASK_E100030_SHARE.CONSUMPTION_SHARED_E100030.VEHICLE_SALES_RAW
  where coalesce(SALESDATE, CONTRACTDATE, DEALSTATUSDATE, DELIVERYDATE, cast(LANDING_TIME as date))
        >= dateadd(day, -{{DAYS_BACK}}, current_date())
),
normalized as (
  select
    branch,
    eis_store_id,
    accounting_account,
    deal_number,
    vin,
    stock_number,
    sales_date,
    contract_date,
    deal_status_date,
    delivery_date,
    landing_time,
    vehicle_sale_price,
    gross_profit,
    total_gross_profit,
    total_tax,
    total_trades_acv,
    coalesce(nullif(branch, ''), nullif(eis_store_id, ''), 'unknown') as dealer_candidate,
    coalesce(sales_date, contract_date, deal_status_date, delivery_date, cast(landing_time as date)) as business_date
  from base
),
daily as (
  select
    business_date,
    dealer_candidate,
    count(*) as row_count,
    count(distinct deal_number) as distinct_deals,
    count(distinct vin) as distinct_vins,
    sum(vehicle_sale_price) as vehicle_sale_price_total,
    sum(gross_profit) as gross_profit_total,
    sum(total_gross_profit) as total_gross_profit_total,
    max(landing_time) as latest_landing_time
  from normalized
  group by 1, 2
),
key_profile as (
  select
    dealer_candidate,
    count(*) as row_count,
    count_if(deal_number is null or trim(deal_number) = '') as null_deal_number_count,
    count_if(vin is null or trim(vin) = '') as null_vin_count,
    count_if(stock_number is null or trim(stock_number) = '') as null_stock_number_count,
    count(distinct dealer_candidate || '|' || coalesce(deal_number, '')) as distinct_dealer_deal_keys,
    count(distinct dealer_candidate || '|' || coalesce(vin, '') || '|' || coalesce(stock_number, '') || '|' || coalesce(to_varchar(sales_date), '')) as distinct_dealer_vin_stock_date_keys
  from normalized
  group by 1
),
date_profile as (
  select 'sales_date' as date_field, count_if(sales_date is not null) as populated_count, min(sales_date) as min_date, max(sales_date) as max_date from normalized
  union all
  select 'contract_date', count_if(contract_date is not null), min(contract_date), max(contract_date) from normalized
  union all
  select 'deal_status_date', count_if(deal_status_date is not null), min(deal_status_date), max(deal_status_date) from normalized
  union all
  select 'delivery_date', count_if(delivery_date is not null), min(delivery_date), max(delivery_date) from normalized
)
select
  'daily_summary' as profile_section,
  to_varchar(business_date) as profile_key,
  dealer_candidate,
  row_count,
  distinct_deals,
  distinct_vins,
  vehicle_sale_price_total,
  gross_profit_total,
  total_gross_profit_total,
  null as null_deal_number_count,
  null as null_vin_count,
  null as null_stock_number_count,
  null as duplicate_dealer_deal_key_count,
  null as duplicate_dealer_vin_stock_date_key_count,
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
  to_varchar(min_date),
  to_varchar(max_date)
from date_profile
order by profile_section, profile_key, dealer_candidate;
