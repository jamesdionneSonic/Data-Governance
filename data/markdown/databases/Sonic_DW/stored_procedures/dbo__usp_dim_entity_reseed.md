---
name: usp_dim_entity_reseed
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Dim_Entity
dependency_count: 1
parameter_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Dim_Entity** (U )

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
,EntConsolidated
,EntDealershipSize
,EntLegalStructure
,EntLegalParent
,EntOwnershipPct
,EntFranchiseCount
,EntLegalName
,EntSameStoreFlg
,EntDisposedFlg
,EntContinuingOpsFlg
,EntStateTaxID
,EntIncorporationNumber
,EntFedTaxID
,EntDMVNumber
,EntFilingNumbers
,EntServiceBayQty
,EntLiftQty
,EntSquareFootage
,EntNumberOfProperties
,EntLeasePropertyQty
,EntLuxuryFlag
,EntBrandOrigin
,EntBrandGroup
,EntBrand
,EntBodyShopFlag
,EntDFIDRegion
,EntDFODRegion
,EntUVDRegion
,EntDealerLvl1
,EntDealerLvl2
,EntMetroArea
,EntSubRegion
,EntBrand3rdTier
,MetaSrc_Sys_ID
,MetaSourceSystemName
,MetaRowEffectiveDate
,MetaRowExpiredDate
,MetaRowIsCurrent
,MetaRowlastChangeDate
,MetaAuditKey
,MetaAuditScore
,MetaNaturalKey
,MetaChecksum
,ETLExecution_ID
	)
VALUES
(
---1          --CustomerKey

-1 --EntCora_Account_ID
,'UKN'      --EntADPCompanyID
,'UKN'      --EntAccountingPrefix
,'UKN'      --EntHFMEntityID
,'UKN'      --EntFranchiseID
,'UKN'      --EntEntityType
,'UKN'      --EntBACCode
,'UKN'      --EntRVP_RCRegionCode
,'UKN'      --EntHFMDealershipName
,'UKN'      --EntRegion
,'9999.12.31'      --EntAcquiredDate
,'UKN'      --EntAddressLine1
,'UKN'      --EntAddressMailingLine1
,'UKN'      --EntAddressCity
,'UKN'      --EntAddressState
,'UKN'      --EntAddressZipCode
,'UKN'      --EntMainPhoneNumber
,'UKN'      --EntDealerCode
,'UKN'      --EntRegionSubLevel
,'UKN'      --EntConsolidated
,'UKN'      --EntDealershipSize
,'UKN'      --EntLegalStructure
,'UKN'      --EntLegalParent
,-1      --EntOwnershipPct
,-1      --EntFranchiseCount
,'UKN'      --EntLegalName
,'UKN'      --EntSameStoreFlg
,'UKN'      --EntDisposedFlg
,'UKN'      --EntContinuingOpsFlg
,'UKN'      --EntStateTaxID
,'UKN'      --EntIncorporationNumber
,'UKN'      --EntFedTaxID
,'UKN'      --EntDMVNumber
,'UKN'      --EntFilingNumbers
,-1      --EntServiceBayQty
,-1      --EntLiftQty
,-1      --EntSquareFootage
,-1      --EntNumberOfProperties
,-1      --EntLeasePropertyQty
,'UKN'      --EntLuxuryFlag
,'UKN'      --EntBrandOrigin
,'UKN'      --EntBrandGroup
,'UKN'      --EntBrand
,'UKN'      --EntBodyShopFlag
,'UKN'      --EntDFIDRegion
,'UKN'      --EntDFODRegion
,'UKN'      --EntUVDRegion
,'UKN'      --EntDealerLvl1
,'UKN'      --EntDealerLvl2
,'UKN'      --EntMetroArea
,'UKN'      --EntSubRegion
,'UKN'      --EntBrand3rdTier
,-1      --MetaSrc_Sys_ID
,'UKN'      --MetaSourceSystemName
,'9999.12.31'      --MetaRowEffectiveDate
,'9999.12.31'      --MetaRowExpiredDate
,'UKN'      --MetaRowIsCurrent
,'9999.12.31'      --MetaRowlastChangeDate
,-1     --MetaAuditKey
,-1      --MetaAuditScore
,'UKN'      --MetaNaturalKey
,-1     --MetaChecksum
,-1     --ETLExecution_ID

)
--GO

--DBCC checkident('Dim_Entity', RESEED, 0);
--GO


--SELECT *
--FROM dbo.Dim_Entity AS dc

----DELETE dbo.Dim_Entity
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
