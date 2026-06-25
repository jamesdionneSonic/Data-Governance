-- WP-DVL-005 read-only daily summary for SQL Server DMS repair-order headers.
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
    try_convert(decimal(19, 4), s.laborsalecustomerpay) as labor_amount,
    try_convert(decimal(19, 4), s.partssalecustomerpay) as parts_amount,
    try_convert(decimal(19, 4), s.miscsalecustomerpay) as misc_amount,
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
    try_convert(decimal(19, 4), s.laborsalecustomerpay),
    try_convert(decimal(19, 4), s.partssalecustomerpay),
    try_convert(decimal(19, 4), s.miscsalecustomerpay),
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
    labor_amount,
    parts_amount,
    misc_amount,
    customer_pay_total,
    latest_update_timestamp,
    row_number() over (
      partition by business_key
      order by source_priority, latest_update_timestamp desc
    ) as selected_row_number
  from base
  where business_date is not null
    and business_key is not null
)
select
  convert(varchar(30), business_date, 23) as business_date,
  cora_acct_code,
  count(distinct business_key) as record_count,
  sum(labor_amount) as labor_amount,
  sum(parts_amount) as parts_amount,
  sum(customer_pay_total) as total_amount,
  convert(varchar(33), max(latest_update_timestamp), 126) as latest_update_timestamp
from ranked
where selected_row_number = 1
group by business_date, cora_acct_code
order by business_date, cora_acct_code;
