---
name: vw_Fact_CVLALoaner
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_Entity
  - DM_CVLA
  - vw_Fact_TSD
dependency_count: 3
column_count: 25
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_Entity** (U )
- **dbo.DM_CVLA** (U )
- **dbo.vw_Fact_TSD** (V )

## Columns

| Name            | Type    | Nullable | Description |
| --------------- | ------- | -------- | ----------- |
| `CVLALoanerKey` | varchar | ✓        |             |
| `rostatus`      | varchar | ✓        |             |
| `agmtno`        | varchar | ✓        |             |
| `customername`  | varchar | ✓        |             |
| `custnum`       | varchar | ✓        |             |
| `fuelin`        | varchar | ✓        |             |
| `fuelout`       | varchar | ✓        |             |
| `loaneddate2`   | date    | ✓        |             |
| `loanedtime`    | varchar | ✓        |             |
| `hostitemid`    | varchar | ✓        |             |
| `cora_acct_id`  | int     | ✓        |             |
| `odomin`        | varchar | ✓        |             |
| `odomout`       | varchar | ✓        |             |
| `RONumber`      | varchar | ✓        |             |
| `returneddate2` | date    | ✓        |             |
| `returnedtime`  | varchar | ✓        |             |
| `vehVIN`        | varchar | ✓        |             |
| `EntityKey`     | int     | ✓        |             |
| `EntDealerLvl1` | varchar | ✓        |             |
| `LoanedDays`    | int     | ✓        |             |
| `ReturnedFlag`  | int     |          |             |
| `VehicleStatus` | varchar | ✓        |             |
| `SubsidyStatus` | varchar | ✓        |             |
| `status`        | varchar | ✓        |             |
| `CVLAInvKey`    | varchar | ✓        |             |

## Definition

```sql
CREATE VIEW dbo.vw_Fact_CVLALoaner
AS
SELECT        ISNULL(C.hostitemid, '') + '.' + CAST(C.cora_acct_id AS varchar(10)) AS CVLALoanerKey, C.rostatus, C.agmtno, C.customername, C.custnum, C.fuelin, C.fuelout, C.loaneddate2, C.loanedtime, C.hostitemid, C.cora_acct_id,
                         C.odomin, C.odomout, C.ro AS RONumber, C.returneddate2, C.returnedtime, C.VIN AS vehVIN, CASE WHEN c.EntityKey = 170 THEN 401 ELSE c.EntityKey END AS EntityKey, e.EntDealerLvl1, DATEDIFF(dd, C.loaneddate2,
                         COALESCE (C.returneddate2, GETDATE())) + 1 AS LoanedDays, CASE WHEN returneddate2 IS NULL THEN 0 ELSE 1 END AS ReturnedFlag, COALESCE (TSD.VehicleStatus, 'No Status') AS VehicleStatus,
                         COALESCE (TSD.SubsidyStatus, 'No Status') AS SubsidyStatus, C.status, (CASE WHEN c.VIN IS NULL THEN '-1' WHEN RIGHT(c.VIN, 1) = '.' THEN '-1' ELSE RIGHT(c.VIN, 8) + '.' + CAST(c.cora_acct_id AS varchar(10)) END)
                         AS CVLAInvKey
FROM            dbo.DM_CVLA AS C INNER JOIN
                         dbo.Dim_Entity AS e ON C.EntityKey = e.EntityKey LEFT OUTER JOIN
                             (SELECT        FactTSDKey, Unit, Year, Make, Model, VIN, VehicleStatus, SubsidyStatus, EntityKey, VehicleKey, Datekey, [RowCount]
                               FROM            dbo.vw_Fact_TSD
                               WHERE        (Datekey = CONVERT(char(8), GETDATE(), 112))) AS TSD ON C.EntityKey = TSD.EntityKey AND C.VIN = TSD.VIN

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
