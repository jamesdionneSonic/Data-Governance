---
name: usp_dim_entity_reseed
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql
create proc dbo.usp_dim_entity_reseed
as

--DBCC checkident('Dim_Entity', RESEED, -2);
--GO


INSERT INTO [dbo].[Dim_Entity](

 EntCora_Account_ID
,EntADPCompanyID
,EntAccountingPrefix
,EntHFMEntityID
,EntFranchiseID
,EntEntityType
,EntBACCode
,EntRVP_RCRegionCode
,EntHFMDealershipName
,EntRegion
,EntAcquiredDate
,EntAddressLine1
,EntAddressMailingLine1
,EntAddressCity
,EntAddressState
,EntAddressZipCode
,EntMainPhoneNumber
,EntDealerCode
,EntRegionSubLevel
,EntConsol
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
