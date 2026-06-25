-- WP-DVL-006 read-only detail extract for Snowflake repair-order exceptions.
--
-- Dealer-code mapping targets the DMS source-native cora_acct_code used for
-- validation against DMS.
--
-- Parameters to replace in runner:
--   {{DAYS_BACK}} defaults to 30.

with normalized as (
  select
    case
      when cast(DEALERCODE as varchar) in ('05179') then 'SA466-S'
      when cast(DEALERCODE as varchar) in ('R0429', 'S000500622') then 'SA476-S'
      else 'out_of_scope'
    end as cora_acct_code,
    cast(DEALERCODE as varchar) as snowflake_dealercode,
    case
      when ROCLOSEDATE is not null then cast(ROCLOSEDATE as date)
      else cast(ROOPENDATE as date)
    end as business_date,
    case
      when cast(DEALERCODE as varchar) in ('05179') then 'SA466-S'
      when cast(DEALERCODE as varchar) in ('R0429', 'S000500622') then 'SA476-S'
      else 'out_of_scope'
    end || '|' || cast(RONUM as varchar) as business_key,
    try_to_number(PAYCPTOTAL) as amount_total,
    cast(LANDING_TIME as timestamp_tz) as latest_update_timestamp
  from CDK_DN_TITAN_FTR_UNMASK_E100030_SHARE.CONSUMPTION_SHARED_E100030.REPAIR_ORDER_RAW
  where coalesce(ROCLOSEDATE, ROOPENDATE, APPOINTMENTDATE, INVOICEPOSTDATE, cast(LANDING_TIME as date))
        >= dateadd(day, -{{DAYS_BACK}}, current_date())
)
select
  cora_acct_code,
  snowflake_dealercode,
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
