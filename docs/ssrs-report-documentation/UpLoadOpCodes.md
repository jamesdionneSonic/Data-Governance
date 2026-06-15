# UpLoadOpCodes

Generated: 2026-06-15  
SSRS path: `/BI - FORCE/UpLoadOpCodes`  
SSRS catalog source: `ReportServer` on `D1-SQL-01B\INST1`

## Purpose

This report supports the BI - FORCE reporting area. It retrieves data through embedded report dataset queries and presents the result as the UpLoadOpCodes report. Use the dataset commands and parameters below to confirm the exact business question before changing it.

## Executive Summary

| Field               | Value                       |
| ------------------- | --------------------------- |
| Report name         | `UpLoadOpCodes`             |
| SSRS path           | `/BI - FORCE/UpLoadOpCodes` |
| Status signal       | Active                      |
| Created             | 2015-10-15 09:23:19         |
| Modified            | 2018-02-13 15:39:25         |
| Modified by         | SONIC\Mark.Starnes          |
| Last 6 months usage | 82 executions by 1 users    |
| Last execution      | 2026-06-15 12:00:03         |
| Subscriptions       | 1                           |

## Shared Data Sources

| Report datasource | Shared datasource                     | Connection                   | Credential mode | Enabled |
| ----------------- | ------------------------------------- | ---------------------------- | --------------- | ------- |
| `CorBISQL02`      | `/BI - FORCE/DataSource/COR-BISQL-02` | `Not available from catalog` |                 |         |

## User Parameters

No user-facing report parameters were found in the RDL definition.

## Data Logic

1. Dataset `TBD_Opcodes` (Text): SELECT o.EntBrand, o.EntDealerLvl1, o.cora_acct_id_service, o.OpcOpCode, o.OpcOpCodeDescription, o.OpcOpCodeCategory, o.OpcMenu, o.OpcOther, o.OpcWeight FROM (SELECT EntBrand, EntDealerLvl1, OpcCoraAcctID AS cora_acct_id_service, OpcOpCode, OpcOpCodeDescription, OpcOpCodeCategory, OpcMenu, OpcOther, opcWeight AS OpcWei...

## Backend Dependencies

| Object or command hint                 | Notes                                     |
| -------------------------------------- | ----------------------------------------- |
| `ETL_Staging.wrk.stgOpCodeTBD`         | Referenced by one or more report datasets |
| `ETL_Staging.wrk.xrfCoraCompanyPrefix` | Referenced by one or more report datasets |
| `sonic_dw.dbo.Dim_Entity`              | Referenced by one or more report datasets |

## Support Troubleshooting Guide

1. Confirm the user is running the correct SSRS path: `/BI - FORCE/UpLoadOpCodes`.
2. Confirm the selected report parameters match the intended business scenario.
3. Confirm the shared datasource is enabled and points to the expected backend connection.
4. If the report returns no data, review the dataset commands and backend objects listed above.
5. If this report has no recent usage, confirm whether the business still needs it before investing in changes.

## Reports or Objects Needing Review

- No immediate review flag based on recent execution history.

## Technical Appendix

### Dataset Commands

#### TBD_Opcodes

Type: `Text`

```sql
SELECT        o.EntBrand, o.EntDealerLvl1, o.cora_acct_id_service, o.OpcOpCode, o.OpcOpCodeDescription, o.OpcOpCodeCategory, o.OpcMenu, o.OpcOther, o.OpcWeight FROM            (SELECT        EntBrand, EntDealerLvl1, OpcCoraAcctID AS cora_acct_id_service, OpcOpCode, OpcOpCodeDescription, OpcOpCodeCategory, OpcMenu, OpcOther, opcWeight AS OpcWeight                         FROM            ETL_Staging.wrk.stgOpCodeTBD) AS o                                                                  INNER JOIN                 (SELECT        cora_acct_id, Companyid, Prefix, related_acctg_cora_acct_id                         FROM            ETL_Staging.wrk.xrfCoraCompanyPrefix) AS x                                                                                  ON o.cora_acct_id_service = x.cora_acct_id                                                                  INNER JOIN                 sonic_dw.dbo.Dim_Entity                                                                                  ON x.Prefix = dbo.Dim_Entity.EntAccountingPrefix AND x.related_acctg_cora_acct_id = sonic_dw.dbo.Dim_Entity.EntCora_Account_ID AND x.Companyid = sonic_dw.dbo.Dim_Entity.EntADPCompanyID WHERE        (sonic_dw.dbo.Dim_Entity.EntFORCEReportFlag = 'Active')
```
