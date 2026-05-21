---
name: vw_Dim_Account
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

2- **Type**: View

- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_Dim_Account
AS
SELECT   a.AccountKey, a.AccCoraAcctId, a.AccCompanyId, a.AccDeptId, a.AccAccountNumber, a.AccAccountDesc, a.AccAccountType, a.AccAccountTypeDesc, a.AccAccountSubType,
                         a.AccAccountSubTypeDesc, a.AccAccountUpdateDate, a.AccControlType, a.AccControlTypeDesc, a.AccControl2Type, a.AccControl2TypeDesc, a.AccIncomeBalanceGroup,
                         a.AccIncomeBalanceGroupDesc, a.AccIncomeBalanceSubGroup, a.AccIncomeBalanceSubGroupDesc, a.AccProductionType, a.AccProductionTypeDesc, a.AccReportGroup,
                         a.AccReportGroupDesc, a.AccUNAGroup, a.AccUNAGroupDesc, a.AccEntityType, a.AccCOAType, a.AccActiveFlag, a.AccPrefix,
                         CASE WHEN AccAccount = 'Unknown' THEN '-1' ELSE AccAccount END AS AccAccount, a.AccDepartmentLookup, a.AccDepartment, a.AccDepartmentName, a.AccAccountCategory,
                         a.AccExcludeFlag, CASE WHEN AccHFMAccount = 'Unknown' THEN '-1' ELSE AccHFMAccount END AS AccHFMAccount, a.AccHFMDepartment, ISNULL(e.EntityKey, - 1) AS EntityKey,
                         a.DepartmentRollKey AS DepartmentKey, (CASE WHEN e.EntDealerLvl1 IN ('Sonic Real Estate', 'EchoPark Real Estate') THEN 146 WHEN e.EntDealerLvl1 = 'Divisional' AND
                         a.DepartmentRollKey = 18 THEN 21 WHEN e.entdealerlvl1 = 'EchoPark Corporate' THEN 21 WHEN e.entdealerlvl1 = 'Sonic University' THEN 147 WHEN DepartmentRollKey IN (358, 359)
                         THEN 130 ELSE a.DepartmentRollKey END) AS CorpDepartmentKey, dbo.Dim_AccountMgmt.AccountMgmtKey, CAST(dbo.Dim_DepartmentRoll.MarketingGroup AS nchar(2))
                         AS NewUsedID
FROM         dbo.Dim_Account AS a LEFT OUTER JOIN
                         dbo.Dim_AccountMgmt ON a.AccHFMAccount = dbo.Dim_AccountMgmt.Level8 LEFT OUTER JOIN
                         dbo.Dim_DepartmentRoll ON a.DepartmentRollKey = dbo.Dim_DepartmentRoll.DepartmentKey LEFT OUTER JOIN
                         dbo.Dim_Entity AS e ON a.AccCoraAcctId = e.EntCora_Account_ID AND CAST(a.AccCompanyId AS varchar(3)) = e.EntADPCompanyID AND a.AccPrefix = e.EntAccountingPrefix

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
