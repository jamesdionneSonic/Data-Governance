---
name: ServiceCustomerDetail
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - CustomerXREF_KeyLU
  - Dim_Customer
  - Dim_Customer
  - Dim_DMSCustomer
  - dim_dmsCustomer_bk05052022
  - Dim_DMSCustomer_history
  - Dim_Geography
  - Dim_GeoLocation
  - Dim_Customer
  - Dim_DMSCustomer
  - dim_dmsCustomer_bk05052022
  - Dim_DMSCustomer_history
  - Dim_GLChecks_Degen
  - DimDMSCoraAccount
  - Fact_Inventory
  - factCIT
  - factFIREBookingsWeOwe
  - FandI_DMS
  - GLDetail_ MissingAcctInfo
  - QuartileOpportunityMart
row_count: 0
size_kb: 0
column_count: 57
index_count: 0
check_constraint_count: 0
extraction_warnings:
  - MISSING_VIEW_DATABASE_STATE
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: table
- **Schema**: dbo
- **Row Count**: 0
- **Size**: 0 KB

## Columns

| Name                     | Type     | Nullable | Identity | Default | Description |
| ------------------------ | -------- | -------- | -------- | ------- | ----------- |
| `GL_cora_acct_id`        | int      | ✓        |          |         |             |
| `companyid`              | varchar  | ✓        |          |         |             |
| `refer`                  | varchar  | ✓        |          |         |             |
| `custno`                 | varchar  | ✓        |          |         |             |
| `SVC_cora_acct_id`       | int      | ✓        |          |         |             |
| `ronumber`               | varchar  | ✓        |          |         |             |
| `CountOfRepairOrders`    | int      | ✓        |          |         |             |
| `SumServiceCostAmt`      | numeric  | ✓        |          |         |             |
| `SumServiceSaleAmt`      | numeric  | ✓        |          |         |             |
| `SonicCustID`            | int      | ✓        |          |         |             |
| `Lkp1_DimCustomerID`     | int      | ✓        |          |         |             |
| `CstBusinessName`        | varchar  | ✓        |          |         |             |
| `CstFullName`            | varchar  | ✓        |          |         |             |
| `CstSalutation`          | varchar  | ✓        |          |         |             |
| `CstNameFirst`           | varchar  | ✓        |          |         |             |
| `CstNameMiddle`          | varchar  | ✓        |          |         |             |
| `CstNameLast`            | varchar  | ✓        |          |         |             |
| `CstSuffix`              | varchar  | ✓        |          |         |             |
| `CstGender`              | varchar  | ✓        |          |         |             |
| `CstBirthdate`           | int      | ✓        |          |         |             |
| `CstYearOfBirth`         | int      | ✓        |          |         |             |
| `CstAddressLine1`        | varchar  | ✓        |          |         |             |
| `CstAddressLine2`        | varchar  | ✓        |          |         |             |
| `CstAddressCity`         | varchar  | ✓        |          |         |             |
| `CstAddressState`        | varchar  | ✓        |          |         |             |
| `CstAddressZipCode`      | varchar  | ✓        |          |         |             |
| `CstCounty`              | varchar  | ✓        |          |         |             |
| `DimGeoLocationID`       | int      | ✓        |          |         |             |
| `CstCellPhone`           | varchar  | ✓        |          |         |             |
| `CstHomePhone`           | varchar  | ✓        |          |         |             |
| `CstBusinessPhone`       | varchar  | ✓        |          |         |             |
| `CstEmailAddress`        | varchar  | ✓        |          |         |             |
| `CstRace`                | varchar  | ✓        |          |         |             |
| `CstMaritalStatus`       | varchar  | ✓        |          |         |             |
| `CstCreateDate`          | datetime | ✓        |          |         |             |
| `CstUpdateDate`          | datetime | ✓        |          |         |             |
| `IsHomeOwner`            | varchar  | ✓        |          |         |             |
| `IsHeadOfHouseHold`      | varchar  | ✓        |          |         |             |
| `IsBusiness`             | varchar  | ✓        |          |         |             |
| `IsIndividual`           | varchar  | ✓        |          |         |             |
| `IsBuyer`                | varchar  | ✓        |          |         |             |
| `IsCoBuyer`              | varchar  | ✓        |          |         |             |
| `IsLease`                | varchar  | ✓        |          |         |             |
| `IsService`              | varchar  | ✓        |          |         |             |
| `IsFandI`                | varchar  | ✓        |          |         |             |
| `IsParts`                | varchar  | ✓        |          |         |             |
| `IsBodyShop`             | varchar  | ✓        |          |         |             |
| `ADPMailAbility`         | int      | ✓        |          |         |             |
| `CstLastSaleDate`        | int      | ✓        |          |         |             |
| `CstLastLeaseDate`       | int      | ✓        |          |         |             |
| `CstLastServiceDate`     | int      | ✓        |          |         |             |
| `CstLastPartsDate`       | int      | ✓        |          |         |             |
| `MetaRowEffectiveDate`   | datetime | ✓        |          |         |             |
| `MetaRowExpiredDate`     | datetime | ✓        |          |         |             |
| `MetaRowLastChangedDate` | datetime | ✓        |          |         |             |
| `MetaRowIsCurrent`       | varchar  | ✓        |          |         |             |
| `Lookup 2.DimCustomerID` | int      | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.CustomerXREF_KeyLU → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "soniccustid" in both tables
  - Column: `SonicCustID` → `SonicCustID`
- **column_match**: dbo.ServiceCustomerDetail → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "soniccustid" in both tables
  - Column: `SonicCustID` → `SonicCustID`
- **column_match**: dbo.Dim_Customer → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "cstnamemiddle" in both tables
  - Column: `CstNameMiddle` → `CstNameMiddle`
- **column_match**: dbo.ServiceCustomerDetail → dbo.xDim_Customer
  - Confidence: 80%
  - Evidence: Exact column name match: "cstnamemiddle" in both tables
  - Column: `CstNameMiddle` → `CstNameMiddle`
- **column_match**: dbo.Dim_Customer → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "dimgeolocationid" in both tables
  - Column: `DimGeoLocationID` → `DimGeoLocationID`
- **column_match**: dbo.Dim_DMSCustomer → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "dimgeolocationid" in both tables
  - Column: `DimGeoLocationID` → `DimGeoLocationID`
- **column_match**: dbo.dim_dmsCustomer_bk05052022 → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "dimgeolocationid" in both tables
  - Column: `DimGeoLocationID` → `DimGeoLocationID`
- **column_match**: dbo.Dim_DMSCustomer_history → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "dimgeolocationid" in both tables
  - Column: `DimGeoLocationID` → `DimGeoLocationID`
- **column_match**: dbo.Dim_Geography → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "dimgeolocationid" in both tables
  - Column: `DimGeoLocationId` → `DimGeoLocationID`
- **column_match**: dbo.Dim_GeoLocation → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "dimgeolocationid" in both tables
  - Column: `DimGeoLocationId` → `DimGeoLocationID`
- **column_match**: dbo.ServiceCustomerDetail → dbo.xDim_Customer
  - Confidence: 80%
  - Evidence: Exact column name match: "dimgeolocationid" in both tables
  - Column: `DimGeoLocationID` → `DimGeoLocationID`
- **column_match**: dbo.Dim_Customer → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "isindividual" in both tables
  - Column: `IsIndividual` → `IsIndividual`
- **column_match**: dbo.Dim_DMSCustomer → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "isindividual" in both tables
  - Column: `IsIndividual` → `IsIndividual`
- **column_match**: dbo.dim_dmsCustomer_bk05052022 → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "isindividual" in both tables
  - Column: `IsIndividual` → `IsIndividual`
- **column_match**: dbo.Dim_DMSCustomer_history → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "isindividual" in both tables
  - Column: `IsIndividual` → `IsIndividual`
- **column_match**: dbo.ServiceCustomerDetail → dbo.xDim_Customer
  - Confidence: 80%
  - Evidence: Exact column name match: "isindividual" in both tables
  - Column: `IsIndividual` → `IsIndividual`
- **column_match**: dbo.Dim_GLChecks_Degen → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.DimDMSCoraAccount → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.Fact_Inventory → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.factCIT → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.factFIREBookingsWeOwe → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.FandI_DMS → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.GLDetail\_ MissingAcctInfo → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.QuartileOpportunityMart → dbo.ServiceCustomerDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.ServiceCustomerDetail → dbo.Syndicate_Floorplan_Funding
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.ServiceCustomerDetail → dbo.Syndicate_Floorplan_Funding_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.ServiceCustomerDetail → dbo.Syndicate_Floorplan_Payoff
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.ServiceCustomerDetail → dbo.Syndicate_Floorplan_Payoff_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.ServiceCustomerDetail → dbo.Syndicate_Floorplan_Payoff_up
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `CompanyID`
- **column_match**: dbo.ServiceCustomerDetail → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.ServiceCustomerDetail → dbo.VS_CUST
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.ServiceCustomerDetail → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
