-- WP-DVL-006 read-only detail extract for SQL Server DMS vehicle sales exceptions.
--
-- DMS remains the source of record.
--
-- Parameters to replace in runner:
--   {{DAYS_BACK}} defaults to 30.

with normalized as (
  select
    case
      when cast(branch as varchar(100)) like '466%' then 'SA466-S'
      when cast(branch as varchar(100)) like '476%' then 'SA476-S'
      else 'out_of_scope'
    end as cora_acct_code,
    cast(branch as varchar(100)) as dms_branch,
    coalesce(try_convert(date, salesdate), try_convert(date, contractdate)) as business_date,
    case
      when cast(branch as varchar(100)) like '466%' then 'SA466-S'
      when cast(branch as varchar(100)) like '476%' then 'SA476-S'
      else 'out_of_scope'
    end + '|' + cast(dealno as varchar(100)) as business_key,
    try_convert(decimal(19, 4), cashprice) as amount_total,
    coalesce(try_convert(datetime2, rowlastupdated), try_convert(datetime2, Meta_LoadDate)) as latest_update_timestamp
  from dbo.vehiclesalescurrent
  where coalesce(try_convert(date, salesdate), try_convert(date, contractdate), try_convert(date, accountingdate), try_convert(date, rowlastupdated), try_convert(date, Meta_LoadDate))
        >= dateadd(day, -{{DAYS_BACK}}, cast(getdate() as date))
)
select
  cora_acct_code,
  dms_branch,
  convert(varchar(30), business_date, 23) as business_date,
  business_key,
  1 as record_count,
  amount_total,
  convert(varchar(33), latest_update_timestamp, 126) as latest_update_timestamp
from normalized
where cora_acct_code <> 'out_of_scope'
  and business_date is not null
  and business_key is not null
order by business_date, cora_acct_code, business_key;
