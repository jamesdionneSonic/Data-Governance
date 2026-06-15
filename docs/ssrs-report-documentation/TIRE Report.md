# TIRE Report

Generated: 2026-06-15  
SSRS path: `/BI - FORCE/TIRE Report`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports the BI - FORCE reporting area. It retrieves data through embedded report dataset queries and presents the result as the TIRE Report report. Use the dataset commands and parameters below to confirm the exact business question before changing it.

## Executive Summary

| Field               | Value                     |
| ------------------- | ------------------------- |
| Report name         | `TIRE Report`             |
| SSRS path           | `/BI - FORCE/TIRE Report` |
| Status signal       | Active                    |
| Created             | 2014-09-26 14:58:36       |
| Modified            | 2018-02-13 15:39:23       |
| Modified by         | SONIC\Mark.Starnes        |
| Last 6 months usage | 1 executions by 1 users   |
| Last execution      | 2026-06-10 14:16:22       |
| Subscriptions       | 0                         |

## Shared Data Sources

| Report datasource | Shared datasource                | Connection                   | Credential mode | Enabled |
| ----------------- | -------------------------------- | ---------------------------- | --------------- | ------- |
| `DMS`             | `/BI - FORCE/DataSource/DMS_DWA` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter   | Prompt     | Type     | Notes                                                |
| ----------- | ---------- | -------- | ---------------------------------------------------- |
| `EndDate`   | End Date   | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `StartDate` | Start Date | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `DataSet1` (Text): --from Adam Vogel --DECLARE @DaysOfHistory INT; --DECLARE @StartDate DATE; --DECLARE @EndDate DATE; ------------------------------------------------------------------------------------ -- Set the value to determine how far back you want to pull data. ---------------------------------------------------------------------...

## Backend Dependencies

| Object or command hint | Notes                                     |
| ---------------------- | ----------------------------------------- |
| `Adam`                 | Referenced by one or more report datasets |
| `PartsSalesAll`        | Referenced by one or more report datasets |
| `dm_cora_account`      | Referenced by one or more report datasets |
| `PartsSalesDetail`     | Referenced by one or more report datasets |
| `ServiceSalesClosed`   | Referenced by one or more report datasets |
| `employee`             | Referenced by one or more report datasets |
| `l1-5fsql-01`          | Referenced by one or more report datasets |
| `Parts`                | Referenced by one or more report datasets |
| `ServiceROs`           | Referenced by one or more report datasets |
| `the`                  | Referenced by one or more report datasets |
| `should`               | Referenced by one or more report datasets |
| `DealerName`           | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - FORCE/TIRE Report`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- No immediate review flag based on recent execution history.

## Technical Appendix

### Dataset Commands

#### DataSet1

Type: `Text`

```sql
--from Adam Vogel --DECLARE @DaysOfHistory INT; --DECLARE @StartDate DATE; --DECLARE @EndDate DATE;  ------------------------------------------------------------------------------------ -- Set the value to determine how far back you want to pull data. ------------------------------------------------------------------------------------ --SET @DaysOfHistory = 30 ; --SET @StartDate = '7-1-2014'; --SET @EndDate = '9-8-2014';   --compile parts data into one dataset with Parts as (      SELECT h.AccountingAccount       , hda.Related_Acctg_Cora_Acct_ID as Acctg_CoraAcctID       , h.ClosedDate       , h.InvoiceNumber       , h.ReferNo       , h.VehID       , d.PartNumber       , d.Description       , d.Source       , d.QuantitySold       , d.ExtendedSale       , reverse( substring (                    reverse(                      substring( hda.Cora_Acct_Code                         , patindex('%[0-9]%', hda.Cora_Acct_Code)                         , 10                        )                     )                   , patindex('%[0-9]%', reverse (                            substring (                                hda.Cora_Acct_Code                                , patindex('%[0-9]%',hda.Cora_Acct_Code)                                 ,10                               )                           )                      )                    , 10                  )               ) as DerivedCompanyID      FROM PartsSalesAll as H       inner join dm_cora_account hda        on h.Cora_Acct_ID = hda.Cora_Acct_ID       left join PartsSalesDetail as d        on H.Cora_acct_id = d.Cora_Acct_ID         and h.ReferNo = d.ReferNo      WHERE h.invoicetype = 'ROI'   -- repair order invoicetypes       and convert(date,h.ClosedDate) between @StartDate and @EndDate       and d.source = '900'       and d.quantitysold <> 0 -- may need to check quantity sold and quantity ordered to make sure that we actually moved a part.    )  --comple ro data into one dataset using the same close date as parts. , ServiceROs as (      select          da.Related_Acctg_Cora_Acct_ID as Acctg_CoraAcctID       , reverse( substring (               reverse(                 substring( Service                    , patindex('%[0-9]%', Service)                    , 10                   )                )              , patindex('%[0-9]%', reverse (                       substring (                           Service                           , patindex('%[0-9]%',Service)                            ,10                          )                      )                 )               , 10             )          ) as DerivedCompanyID       , ssc.RONumber       , ssc.VehID       , ssc.ServiceAdvisor       , e.Name1 as ServiceAdvisorName        --derive the ro type based upon how dollars are being charged to the RO. Not an exact assumption.       , case when PartsSaleInternal = 0 and PartsSaleCustomerPay <> 0 then 'Customer RO'         when PartsSaleInternal <> 0 and PartsSaleCustomerPay = 0 then 'Internal RO'         when PartsSaleInternal = 0 and PartsSaleCustomerPay = 0 and PartsSaleWarranty <> 0 then 'Warranty RO'         when PartsSaleInternal <> 0 and PartsSaleCustomerPay <> 0 then 'Customer RO'         else 'Unknown RO'          end as Estimated_RO_Type      from ServiceSalesClosed ssc       inner join dm_cora_account da        on ssc.Cora_Acct_ID = da.Cora_Acct_ID       inner join (select name1, cora_acct_id, custno from employee where namecode = 8) e --filter to only allow service employees.        on da.Related_Acctg_Cora_Acct_ID = e.Cora_Acct_ID         and ssc.ServiceAdvisor = e.CustNo      where convert(date,CloseDate) between @StartDate and @EndDate    ) , DealerName as (      select distinct         entcora_account_id as Acctg_CoraAcctID       , entADPCompanyID as CompanyID       , coalesce(entdealerlvl2,entdealerlvl1,entName,'Unknown') as DealerName       , row_number () over (partition by entcora_account_id, entADPCompanyID order by entActive, case when entcoatype = 'Dealership' then 1 else 0 end, entcoatype) as PreferenceSeq      from [l1-5fsql-01,12013].sonic_dw.dbo.dim_entity     )  SELECT prt.AccountingAccount  , prt.Acctg_CoraAcctID  , prt.ClosedDate  , prt.InvoiceNumber  , prt.ReferNo  , prt.VehID  , prt.PartNumber  , prt.Description  , prt.Source  , prt.QuantitySold  , prt.ExtendedSale  , Estimated_RO_Type  , ro.ServiceAdvisor  , ro.ServiceAdvisorName    , sum(prt.QuantitySold) over (Partition by dn.DealerName, isnull(ro.ServiceAdvisor,'')) as Advisor_Total_Units  , sum(case when Estimated_RO_Type = 'Customer RO' then prt.QuantitySold else 0 end) over (Partition by dn.DealerName, isnull(ro.ServiceAdvisor,'')) as Advisor_Assumed_CustomerRO_Units  , sum(case when Estimated_RO_Type = 'Internal RO' then prt.QuantitySold else 0 end) over (Partition by dn.DealerName, isnull(ro.ServiceAdvisor,'')) as Advisor_Assumed_InternalRO_Units  , sum(case when Estimated_RO_Type = 'Warranty RO' then prt.QuantitySold else 0 end) over (Partition by dn.DealerName, isnull(ro.ServiceAdvisor,'')) as Advisor_Assumed_WarrantyRO_Units  , sum(case when Estimated_RO_Type = 'Unknown RO' then prt.QuantitySold else 0 end) over (Partition by dn.DealerName, isnull(ro.ServiceAdvisor,'')) as Advisor_Assumed_UnknownRO_Units   , dn.DealerName  , sum(prt.QuantitySold)  over (Partition by dn.DealerName) as Dealer_Total_Parts_Sold  , sum(case when Estimated_RO_Type = 'Customer RO' then prt.QuantitySold else 0 end) over (Partition by dn.DealerName) as Dealer_Assumed_CustomerRO_Units  , sum(case when Estimated_RO_Type = 'Internal RO' then prt.QuantitySold else 0 end) over (Partition by dn.DealerName) as Dealer_Assumed_InternalRO_Units  , sum(case when Estimated_RO_Type = 'Warranty RO' then prt.QuantitySold else 0 end) over (Partition by dn.DealerName) as Dealer_Assumed_WarrantyRO_Units  , sum(case when Estimated_RO_Type = 'Unknown RO' then prt.QuantitySold else 0 end) over (Partition by dn.DealerName) as Dealer_Assumed_UnknownRO_Units  FROM Parts as prt  left join ServiceROs ro   on prt.Acctg_CoraAcctID = ro.Acctg_CoraAcctID    and prt.DerivedCompanyID = ro.DerivedCompanyID    and prt.InvoiceNumber = ro.RONumber    --and isnull(prt.VehID,'Unknown') = ro.VehID removed due to instances where parts tables doesn't have vehid. Removing this from the join should be ok for short term data pulls.  left join DealerName dn   on prt.Acctg_CoraAcctID = dn.Acctg_CoraAcctID    and prt.DerivedCompanyID = dn.CompanyID   and PreferenceSeq = 1
```
