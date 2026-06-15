# EP_ReconCost

Generated: 2026-06-15  
SSRS path: `/BI - FORCE/EP_ReconCost`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports inventory review by showing vehicle inventory, pricing, or stock-level information used to monitor availability, pricing issues, and operational follow-up.

## Executive Summary

| Field               | Value                                            |
| ------------------- | ------------------------------------------------ |
| Report name         | `EP_ReconCost`                                   |
| SSRS path           | `/BI - FORCE/EP_ReconCost`                       |
| Status signal       | Review candidate: no executions in last 6 months |
| Created             | 2018-02-13 15:39:20                              |
| Modified            | 2018-02-13 15:39:20                              |
| Modified by         | SONIC\Mark.Starnes                               |
| Last 6 months usage | 0 executions by 0 users                          |
| Last execution      | NULL                                             |
| Subscriptions       | 0                                                |

## Shared Data Sources

| Report datasource | Shared datasource                     | Connection                   | Credential mode | Enabled |
| ----------------- | ------------------------------------- | ---------------------------- | --------------- | ------- |
| `CORBISQL02`      | `/BI - FORCE/DataSource/COR-BISQL-02` | `Not available from catalog` |                 |         |

## User Parameters

| Parameter   | Prompt    | Type     | Notes                                                |
| ----------- | --------- | -------- | ---------------------------------------------------- |
| `enddate`   | enddate   | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |
| `startdate` | startdate | DateTime | Nullable: NULL; Allow blank: NULL; Multi-value: NULL |

## Data Logic

1. Dataset `ReconCost2` (Text): SELECT x.cora_acct_id, e.entdealerlvl1 AS EntityName, row_number() OVER (partition BY x.cora_acct_id ORDER BY e.entActive, x.CompanyID DESC) AS PrefSeq INTO #EntityName FROM [cor-sql-02].dms.dbo.dm_cora_account da INNER JOIN [cor-sql-02].Sonic_Xref.[dbo].[xrefCoraCompanyPrefix] x ON x.cora_acct_id = da.cora_acct_id LEF...

## Backend Dependencies

| Object or command hint                            | Notes                                     |
| ------------------------------------------------- | ----------------------------------------- |
| `cor-sql-02.dms.dbo.dm_cora_account`              | Referenced by one or more report datasets |
| `cor-sql-02.Sonic_Xref.dbo.xrefCoraCompanyPrefix` | Referenced by one or more report datasets |
| `sonic_Dw.dbo.dim_entity`                         | Referenced by one or more report datasets |
| `cor-sql-02.dms.dbo.ServiceSalesClosed`           | Referenced by one or more report datasets |
| `cor-sql-02.dms.dbo.Dm_Cora_Account`              | Referenced by one or more report datasets |
| `cor-sql-02.dms.dbo.Customer`                     | Referenced by one or more report datasets |
| `cor-sql-02.dms.dbo.Employee`                     | Referenced by one or more report datasets |
| `cor-sql-02.dms.dbo.vehicle`                      | Referenced by one or more report datasets |
| `dbo.vw_Fact_ServiceDetail`                       | Referenced by one or more report datasets |
| `dbo.vw_Fact_Service`                             | Referenced by one or more report datasets |
| `dbo.vw_Dim_date`                                 | Referenced by one or more report datasets |
| `dbo.Dim_DMSEmployee`                             | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - FORCE/EP_ReconCost`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- This report had no executions in the last 6 months and should be reviewed with the owning business area.

## Technical Appendix

### Dataset Commands

#### ReconCost2

Type: `Text`

```sql
SELECT        x.cora_acct_id, e.entdealerlvl1 AS EntityName, row_number() OVER (partition BY x.cora_acct_id ORDER BY e.entActive, x.CompanyID DESC) AS PrefSeq INTO              #EntityName FROM            [cor-sql-02].dms.dbo.dm_cora_account da INNER JOIN                          [cor-sql-02].Sonic_Xref.[dbo].[xrefCoraCompanyPrefix] x ON x.cora_acct_id = da.cora_acct_id LEFT OUTER JOIN                          sonic_Dw.dbo.dim_entity e ON da.related_acctg_cora_acct_id = e.Entcora_account_id AND x.CompanyID = e.EntADPCompanyID AND x.Prefix = e.EntAccountingPrefix                              SELECT DISTINCT ssc.[ronumber], v.Vin, v.Year, v.MakeName, v.ModelName, v.stockno                               INTO               #ROVehicles                               FROM            [cor-sql-02].dms.dbo.ServiceSalesClosed ssc LEFT OUTER JOIN                                                        [cor-sql-02].dms.dbo.Dm_Cora_Account d ON ssc.Cora_acct_ID = d .Cora_Acct_ID LEFT OUTER JOIN                                                        [cor-sql-02].dms.dbo.Customer c ON d .Related_Acctg_Cora_Acct_ID = c.Cora_Acct_ID AND ssc.CustNo = c.CustNo LEFT OUTER JOIN                                                        [cor-sql-02].dms.dbo.Employee e ON d .Related_Acctg_Cora_Acct_ID = e.Cora_Acct_ID AND ssc.[serviceadvisor] = e.CustNo LEFT OUTER JOIN                                                            (SELECT        VehID, Cora_Acct_ID, Year, Make, MakeName, Model, ModelName, Vin, stockno, row_number() OVER (partition BY Cora_Acct_ID, VehID                                                              ORDER BY CASE WHEN StockNo IS NOT NULL THEN 0 ELSE 1 END, RowLastUpdated DESC) AS PrefNum                               FROM            [cor-sql-02].dms.dbo.vehicle) v ON d .Related_Acctg_Cora_Acct_ID = v.Cora_Acct_ID AND ssc.VehID = v.VehID AND v.PrefNum = 1 /* prefer the first selected row */ LEFT OUTER JOIN #EntityName en ON ssc.Cora_Acct_ID = en.Cora_Acct_ID WHERE        CloseDate BETWEEN @StartDate AND @EndDate AND d .Related_Acctg_Cora_Acct_ID = 18762                              /*echo park coras. All stores combines.*/ SELECT DISTINCT a12.[EntDealerLvl1] EntDealerLvl1, a12.[RONumber] RONumber, a12.entitykey                               INTO               #TVZFTTC2FMQ000                               FROM            dbo.vw_Fact_ServiceDetail a12 JOIN                                                        dbo.vw_Fact_Service a13 ON (a12.[ServiceKey] = a13.[ServiceKey])                               WHERE        (a12.[EntDealerLvl1] IN ('Thornton Hub') AND a13.[closedate] BETWEEN @startdate AND @enddate AND a12.[opcode] IN ('UCCD', 'UCAB'))                                                            SELECT        a11.entitykey, a13.[VehicleKey] VehicleKey, /* a11.[TechnicianKey]  AssociateKey,*/ a13.[ServiceAdvisorKey] ServiceAdvisorKey, a13.[OpenDateKey] DateKey,                                                                                       a13.[CloseDateKey] CloseDateKey, a11.[EntDealerLvl1] EntDealerLvl1, a11.[RONumber] RONumber, /* max(a11.[Complaint])  WJXBFS1,*/ sum(a11.[LaborCost]) LaborCost,                                                                                       sum(a11.[LaborSale]) LaborSales, sum(a11.[PartsCost]) PartsCost, sum(a11.[MiscCost]) MiscCost, sum(a11.[SoldHours]) SoldHours, sum(a11.[ShopSuppliesCost]) SSPCost                                                             INTO               #TCOHETBHJMD001                                                             FROM            dbo.vw_Fact_ServiceDetail a11 JOIN                                                                                      #TVZFTTC2FMQ000 pa12 ON (a11.[EntDealerLvl1] = pa12.[EntDealerLvl1] AND a11.[RONumber] = pa12.[RONumber]) JOIN                                                                                      dbo.vw_Fact_Service a13 ON (a11.[ServiceKey] = a13.[ServiceKey])                                                             GROUP BY a13.[VehicleKey], /* a11.[TechnicianKey],*/ a13.[ServiceAdvisorKey], a13.[OpenDateKey], a13.[CloseDateKey], a11.[EntDealerLvl1], a11.entitykey,                                                                                       a11.[RONumber]                                                                                          /* a11.[LaborTypeKey] */ SELECT DISTINCT                                                                                                                     pa12.[EntDealerLvl1] EntDealerLvl1, pa12.[RONumber] RONumber, /* (a19.[AsoNameLast] + ', ' + a19.[AsoNameFirst])  TechnicianName,*/ pa12.[VehicleKey] VehicleKey,                                                                                                                     a16.[VehVIN] VedVIN, a16.[EntDealerLvl1] EntDealerLvl10, pa12.[ServiceAdvisorKey] ServiceAdvisorKey, (a18.[AsoNameLast] + ', ' + a18.[AsoNameFirst])                                                                                                                     ServiceAdvisorName, a16.[serviceadvisor] custno0, /* a13.[LbrLaborTypeDescription]  LbrLaborTypeDescription,*/ pa12.[DateKey] DateKey, a17.[FullDate] FullDate,                                                                                                                     pa12.[CloseDateKey] CloseDateKey, a16.[closedate] closedate0, /* pa12.[WJXBFS1]  WJXBFS1,*/ pa12.[LaborCost] LaborCost, pa12.[LaborSales] LaborSales,                                                                                                                     pa12.[PartsCost] PartsCost, pa12.[MiscCost] MiscCost, pa12.[SoldHours] SoldHours, pa12.[SSPCost] SSPCost, r.Year, r.MakeName, r.ModelName, r.stockno                                                                                           FROM            #TCOHETBHJMD001 pa12 /*  on  (pa12.[LaborTypeKey] = a13.[LaborTypeKey])*/ JOIN                                                                                                                    dbo.vw_Fact_Service a16 ON (pa12.[EntityKey] = a16.[EntityKey] AND pa12.[CloseDateKey] = a16.[CloseDateKey] AND pa12.[DateKey] = a16.[OpenDateKey] AND                                                                                                                     pa12.[EntDealerLvl1] = a16.[EntDealerLvl1] AND pa12.[RONumber] = a16.[RONumber] AND pa12.[ServiceAdvisorKey] = a16.[ServiceAdvisorKey] AND                                                                                                                     pa12.[VehicleKey] = a16.[VehicleKey]) /*  on  (pa12.[OpCodeKey] = a15.[OpCodeKey])*/ JOIN                                                                                                                    dbo.vw_Dim_date a17 ON (pa12.[DateKey] = a17.[DateKey]) JOIN                                                                                                                    dbo.Dim_DMSEmployee a18 ON (pa12.[ServiceAdvisorKey] = a18.[AssociateKey]) /*  on  (pa12.[AssociateKey] = a19.[AssociateKey])*/ JOIN                                                                                                                    #rovehicles r ON r.ronumber = pa12.ronumber                                                                                           WHERE        pa12.[LaborCost] + pa12.[PartsCost] + pa12.[MiscCost] > 300 DROP TABLE #TVZFTTC2FMQ000 DROP TABLE #TCOHETBHJMD001 DROP TABLE #EntityName DROP TABLE                                                                                                                     #rovehicles
```
