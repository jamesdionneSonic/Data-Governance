---
name: vw_Dim_DMSEmployee
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

1- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_Dim_DMSEmployee
AS
SELECT        dmse.AssociateKey, dmse.cora_acct_id, dmse.hostitemid, dmse.accountingaccount, dmse.custno, dmse.AsoNameFirst, dmse.AsoNameLast, dmse.EMPMiddleName, dmse.EMPName1, dmse.EMPAddress, dmse.EMPAddress2, 
                         dmse.EMPCity, dmse.EMPState, dmse.EMPZipPostal, dmse.EMPNameCode, dmse.AsoTechClass, dmse.AsoTechDepartment, dmse.AsoTechLicenseNumber, dmse.AsoTechTeamLeader, dmse.AsoTechTeamNumber, 
                         dmse.AsoT
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
