---
name: vwDimSurveyAuditPending
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

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Definition

```sql

CREATE view dbo.vwDimSurveyAuditPending as (
select	ISNULL(CustomerFirstName,'') as FirstName
		, ISNULL(CustomerLastName,'') as LastName
		, ISNULL(CustomerEmailAddress,'') as Email
		, ISNULL(CustomerPhoneNumber,'') as Phone
		, 'YES' as SMSOptIn
		, 'English' as Language
		, convert(varchar,SurveyAuditKey) as SurveyID
		, case when BuyerType = 'Buyer' then 1 when BuyerType = 'Future Buyer' then 2 else 0 end as EventType
		, ISNULL(IsOnlineSales,'') as IsOnlineSale
		, case when PurchaseType = 'Finance' then 1 when PurchaseType = 'Cash' then 2 else '' end as PurchaseType
		, case when HasVehicleServiceContract = 'YES' then 1 else '' end as ExtendedService
		, convert(date,convert(varchar(8),VisitDateKey)) as VisitDate
		, case when BuyerType = 'Buyer' then convert(date,convert(varchar(8),VisitDateKey)) else '' end as DeliveryDate
		, convert(varchar,EntityKey) as LocationCode
		, StoreName as LocationName
		, ISNULL(ExperienceGuideName,'') as ExperienceGuideName
		, ISNULL(ExperienceGuideEmailAddress,'') as ExperienceGuideID
		, ISNULL(LoyaltySpecialistName,'') as LoyaltySpecialistName
		, ISNULL(LoyaltySpecialistEmailAddress,'') as LoyaltySpecialistID
		, ISNULL(DeliverySpecialistName,'') as DeliverySpecialistName
		, ISNULL(DeliverySpecialistEmail,'') as DeliverySpecialistID
		, ISNULL(GeneralManagerName,'') as GeneralManagerName
		, ISNULL(GeneralManagerEmailAddress,'') as GeneralMangerID
		, ISNULL(VehicleMake,'') as Brand
		, ISNULL(VehicleModel,'') as VehicleModel
		, ISNULL(convert(varchar(8),VehicleYear),'') as ModelYear
		, ISNULL(StockNumber,'') as StockNumber
		, ISNULL(CustomerStreetAddress,'') as CustomerAddress
		, ISNULL(CustomerCity,'') as CustomerCity
		, ISNULL(CustomerState,'') as CustomerState
		, ISNULL(CustomerZipCode,'') as CustomerZIP
from	sonic_dw.dbo.dimsurveyaudit
where	comments is null
		and issent = 0
);
```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
