-- WP-DVL-005 read-only daily summary for Snowflake repair orders.
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
    case
      when ROCLOSEDATE is not null then cast(ROCLOSEDATE as date)
      else cast(ROOPENDATE as date)
    end as business_date,
    cast(RONUM as varchar) as repair_order_number,
    try_to_number(PAYCPTOTAL) as total_amount,
    cast(LANDING_TIME as timestamp_tz) as latest_update_timestamp
  from CDK_DN_TITAN_FTR_UNMASK_E100030_SHARE.CONSUMPTION_SHARED_E100030.REPAIR_ORDER_RAW
  where coalesce(ROCLOSEDATE, ROOPENDATE, APPOINTMENTDATE, INVOICEPOSTDATE, cast(LANDING_TIME as date))
        >= dateadd(day, -{{DAYS_BACK}}, current_date())
)
select
  to_varchar(business_date) as business_date,
  cora_acct_code,
  count(distinct repair_order_number) as record_count,
  sum(total_amount) as total_amount,
  to_varchar(max(latest_update_timestamp)) as latest_update_timestamp
from normalized
where cora_acct_code <> 'out_of_scope'
  and business_date is not null
group by business_date, cora_acct_code
order by business_date, cora_acct_code;
