-- WP-DVL-006 read-only detail extract for SQL Server DMS repair-order exceptions.
--
-- DMS remains the source of record.
--
-- Parameters to replace in runner:
--   {{DAYS_BACK}} defaults to 30.

with base as (
  select
    'closed' as selected_source_table,
    1 as source_priority,
    ca.cora_acct_code,
    try_convert(date, s.closedate) as business_date,
    ca.cora_acct_code + '|' + cast(s.ronumber as varchar(100)) as business_key,
    coalesce(try_convert(decimal(19, 4), s.laborsalecustomerpay), 0)
      + coalesce(try_convert(decimal(19, 4), s.partssalecustomerpay), 0)
      + coalesce(try_convert(decimal(19, 4), s.miscsalecustomerpay), 0) as customer_pay_total,
    coalesce(try_convert(datetime2, s.rowlastupdated), try_convert(datetime2, s.Meta_LoadDate)) as latest_update_timestamp
  from dbo.servicesalesclosed s
  inner join dbo.dm_cora_account ca
    on ca.cora_acct_id = s.cora_acct_id
  where coalesce(try_convert(date, s.closedate), try_convert(date, s.opendate), try_convert(date, s.rowlastupdated), try_convert(date, s.Meta_LoadDate))
        >= dateadd(day, -{{DAYS_BACK}}, cast(getdate() as date))
    and ca.cora_acct_code in ('SA466-S', 'SA476-S')

  union all

  select
    'open',
    2,
    ca.cora_acct_code,
    try_convert(date, s.opendate),
    ca.cora_acct_code + '|' + cast(s.ronumber as varchar(100)),
    coalesce(try_convert(decimal(19, 4), s.laborsalecustomerpay), 0)
      + coalesce(try_convert(decimal(19, 4), s.partssalecustomerpay), 0)
      + coalesce(try_convert(decimal(19, 4), s.miscsalecustomerpay), 0),
    coalesce(try_convert(datetime2, s.rowlastupdated), try_convert(datetime2, s.Meta_LoadDate))
  from dbo.servicesalesopen s
  inner join dbo.dm_cora_account ca
    on ca.cora_acct_id = s.cora_acct_id
  where coalesce(try_convert(date, s.closedate), try_convert(date, s.opendate), try_convert(date, s.rowlastupdated), try_convert(date, s.Meta_LoadDate))
        >= dateadd(day, -{{DAYS_BACK}}, cast(getdate() as date))
    and ca.cora_acct_code in ('SA466-S', 'SA476-S')
),
ranked as (
  select
    selected_source_table,
    source_priority,
    cora_acct_code,
    business_date,
    business_key,
    customer_pay_total,
    latest_update_timestamp,
    row_number() over (
      partition by business_key
      order by source_priority, latest_update_timestamp desc
    ) as selected_row_number,
    count(*) over (partition by business_key) as duplicate_source_rows
  from base
  where business_date is not null
    and business_key is not null
)
select
  cora_acct_code,
  convert(varchar(30), business_date, 23) as business_date,
  business_key,
  1 as record_count,
  customer_pay_total as amount_total,
  convert(varchar(33), latest_update_timestamp, 126) as latest_update_timestamp,
  selected_source_table,
  duplicate_source_rows
from ranked
where selected_row_number = 1
order by business_date, cora_acct_code, business_key;
