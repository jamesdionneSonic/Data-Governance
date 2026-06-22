# Retail Sales Report_CleanGross_Hal_B1YDay

Generated: 2026-06-19T08:45:51.070Z
SSRS path: `/BI - FPnA/Retail Sales Report_CleanGross_Hal_B1YDay`
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Plain-English Summary

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up. If this report is wrong, stale, or unavailable, users may make decisions from incomplete reporting output or lose a support lookup path. Start troubleshooting by confirming the SSRS path, selected parameters, shared datasource, and backend dataset commands.

## At a Glance

| Field                 | Value                                                                                                                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | SSRS                                                                                                                                                                                                     |
| Asset type            | Report                                                                                                                                                                                                   |
| Native path           | `/BI - FPnA/Retail Sales Report_CleanGross_Hal_B1YDay`                                                                                                                                                   |
| Support role          | User-facing report                                                                                                                                                                                       |
| Business process      | Use this when the business needs a vehicle inventory or pricing view for operational follow-up, exception review, or availability monitoring. The report is filtered by Beg Date, Deal Status, End Date. |
| Primary source        | /BI - FPnA/DataSource/COR-BISQL-01                                                                                                                                                                       |
| Primary target/output | SSRS report output                                                                                                                                                                                       |
| Schedule or trigger   | 1 subscription(s)                                                                                                                                                                                        |
| Runtime/usage signal  | 112 executions by 1 users; last used 2026-06-18 10:15:06                                                                                                                                                 |
| Status signal         | Active                                                                                                                                                                                                   |
| Evidence              | `tmp/ssrs-all-report-discovery.out`, `tmp/ssrs-all-datasets.out`                                                                                                                                         |
| Report name           | `Retail Sales Report_CleanGross_Hal_B1YDay`                                                                                                                                                              |
| Created               | 2015-01-16 13:54:03                                                                                                                                                                                      |
| Modified              | 2017-12-13 17:59:11                                                                                                                                                                                      |
| Modified by           | SONIC\Mark.Starnes                                                                                                                                                                                       |

## Business Use

Use this when the business needs a vehicle inventory or pricing view for operational follow-up, exception review, or availability monitoring. The report is filtered by Beg Date, Deal Status, End Date.

## Support Checks

1. Confirm the user is running the correct SSRS path: `/BI - FPnA/Retail Sales Report_CleanGross_Hal_B1YDay`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed below.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Shared Data Sources

| Report datasource | Shared datasource                    | Connection                   | Credential mode | Enabled |
| ----------------- | ------------------------------------ | ---------------------------- | --------------- | ------- |
| `COR_BISQL_01`    | `/BI - FPnA/DataSource/COR-BISQL-01` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter    | Prompt      | Type     | Notes                                                |
| ------------ | ----------- | -------- | ---------------------------------------------------- |
| `BegDate`    | Beg Date    | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `DealStatus` | Deal Status | String   | Nullable: NULL; Allow blank: NULL; Multi-value: true |
| `EndDate`    | End Date    | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DealTypes` (Text): select 'F' as DealType union select 'B'
2. Dataset `Retail_Sales_MTD_lastyear` (Text): WITH VSC AS (SELECT DISTINCT c.related_acctg_cora_acct_id AS acctg_cora, v.stockno, v.dealno, v.vin AS VIN, v.year AS ModelYear, v.makename AS Make, v.modelname AS Model,

## Backend Dependencies

No backend object hints were extracted from the report datasets.

## Reports or Objects Needing Review

- No immediate review flag based on recent execution history.

## Technical Appendix

### Dataset Commands

#### DealTypes

Type: `Text`

```sql
select 'F' as DealType union  select 'B'
```

#### Retail_Sales_MTD_lastyear

Type: `Text`

```sql
WITH VSC AS (SELECT DISTINCT                                                           c.related_acctg_cora_acct_id AS acctg_cora, v.stockno, v.dealno, v.vin AS VIN, v.year AS ModelYear, v.makename AS Make, v.modelname AS Model,
```
