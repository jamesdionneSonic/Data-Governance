-- WP-DVL-006 read-only detail extract for Snowflake vehicle sales exceptions.
--
-- Parameters to replace in runner:
--   {{DAYS_BACK}} defaults to 30.

with normalized as (
  select
    case
      when cast(BRANCH as varchar) like '466%' then 'SA466-S'
      when cast(BRANCH as varchar) like '476%' then 'SA476-S'
      else 'out_of_scope'
    end as cora_acct_code,
    cast(BRANCH as varchar) as snowflake_branch,
    coalesce(cast(SALESDATE as date), cast(CONTRACTDATE as date)) as business_date,
    case
      when cast(BRANCH as varchar) like '466%' then 'SA466-S'
      when cast(BRANCH as varchar) like '476%' then 'SA476-S'
      else 'out_of_scope'
    end || '|' || cast(DEALNUMBER as varchar) as business_key,
    try_to_number(VEHICLESALEPRICE) as amount_total,
    cast(LANDING_TIME as timestamp_tz) as latest_update_timestamp
  from CDK_DN_TITAN_FTR_UNMASK_E100030_SHARE.CONSUMPTION_SHARED_E100030.VEHICLE_SALES_RAW
  where coalesce(SALESDATE, CONTRACTDATE, DEALSTATUSDATE, DELIVERYDATE, cast(LANDING_TIME as date))
        >= dateadd(day, -{{DAYS_BACK}}, current_date())
)
select
  cora_acct_code,
  snowflake_branch,
  to_varchar(business_date) as business_date,
  business_key,
  1 as record_count,
  amount_total,
  to_varchar(latest_update_timestamp) as latest_update_timestamp
from normalized
where cora_acct_code <> 'out_of_scope'
  and business_date is not null
  and business_key is not null
order by business_date, cora_acct_code, business_key;
