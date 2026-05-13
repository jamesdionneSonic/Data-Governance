---
name: UnclaimedProperty_2026
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - CustomerXREF_KeyLU
  - Dim_DMSEmployee
  - Dim_GLChecks_Degen
  - dim_GLSchedule_degen
  - Dim_Lender
  - Dim_PartSaleType
  - DM_CVLA
  - DM_CVLAInv
  - Fact_DQValidation
  - factFIREBookingsWeOwe
  - FandI_DMS
  - GLDetail_ MissingAcctInfo
  - Dim_GLChecks_Degen
  - DimDMSCoraAccount
  - Fact_Inventory
  - factCIT
  - factFIREBookingsWeOwe
  - FandI_DMS
  - GLDetail_ MissingAcctInfo
  - QuartileOpportunityMart
  - ServiceCustomerDetail
  - Syndicate_Floorplan_Funding
  - Syndicate_Floorplan_Funding_Old
  - Syndicate_Floorplan_Payoff
  - Syndicate_Floorplan_Payoff_Old
  - Syndicate_Floorplan_Payoff_up
  - Dim_GLChecks_Degen
  - factFIRE
  - factFIRE_BMWMini
  - GLDetail_ MissingAcctInfo
row_count: 0
size_kb: 0
column_count: 42
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

| Name                                | Type     | Nullable | Identity | Default | Description |
| ----------------------------------- | -------- | -------- | -------- | ------- | ----------- |
| `lookupid`                          | varchar  | ✓        |          |         |             |
| `GLCheckDegenKey`                   | int      |          |          |         |             |
| `cora_acct_id`                      | int      | ✓        |          |         |             |
| `companyid`                         | varchar  | ✓        |          |         |             |
| `chknumber`                         | varchar  | ✓        |          |         |             |
| `interfacecode`                     | varchar  | ✓        |          |         |             |
| `journalid`                         | varchar  | ✓        |          |         |             |
| `docdescription`                    | varchar  | ✓        |          |         |             |
| `control`                           | varchar  | ✓        |          |         |             |
| `controltype`                       | varchar  | ✓        |          |         |             |
| `accountnumber`                     | varchar  | ✓        |          |         |             |
| `Payee`                             | varchar  | ✓        |          |         |             |
| `controldesc`                       | varchar  | ✓        |          |         |             |
| `checktype`                         | varchar  | ✓        |          |         |             |
| `vendornumber`                      | varchar  | ✓        |          |         |             |
| `check_address`                     | varchar  | ✓        |          |         |             |
| `check_city`                        | varchar  | ✓        |          |         |             |
| `check_state`                       | varchar  | ✓        |          |         |             |
| `check_zip`                         | varchar  | ✓        |          |         |             |
| `Account_Number`                    | int      |          |          |         |             |
| `Check_Number`                      | int      |          |          |         |             |
| `Last_Trans_Date`                   | date     |          |          |         |             |
| `Amount_Due`                        | nvarchar |          |          |         |             |
| `Last_Name_Business_Name`           | nvarchar | ✓        |          |         |             |
| `First_Name`                        | nvarchar | ✓        |          |         |             |
| `MI`                                | nvarchar | ✓        |          |         |             |
| `Suffix`                            | nvarchar | ✓        |          |         |             |
| `Care_of_Name`                      | nvarchar | ✓        |          |         |             |
| `Address_1`                         | nvarchar | ✓        |          |         |             |
| `Address_2`                         | nvarchar | ✓        |          |         |             |
| `City`                              | nvarchar | ✓        |          |         |             |
| `State`                             | nvarchar | ✓        |          |         |             |
| `Zip`                               | nvarchar | ✓        |          |         |             |
| `Country`                           | nvarchar | ✓        |          |         |             |
| `Property_Type`                     | nvarchar | ✓        |          |         |             |
| `SSN_FEIN`                          | nvarchar | ✓        |          |         |             |
| `Date_of_Birth`                     | nvarchar | ✓        |          |         |             |
| `Dealership_Corp`                   | smallint |          |          |         |             |
| `Dealership_Name`                   | nvarchar | ✓        |          |         |             |
| `Dealership_State_of_Incorporation` | nvarchar | ✓        |          |         |             |
| `Employee_Number`                   | nvarchar | ✓        |          |         |             |
| `Custom_Field`                      | nvarchar | ✓        |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.CustomerXREF_KeyLU → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_DMSEmployee → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_GLChecks_Degen → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.dim_GLSchedule_degen → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `Cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_Lender → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_PartSaleType → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.DM_CVLA → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.DM_CVLAInv → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Fact_DQValidation → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `Cora_Acct_ID` → `cora_acct_id`
- **column_match**: dbo.factFIREBookingsWeOwe → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.FandI_DMS → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.GLDetail\_ MissingAcctInfo → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_ID` → `cora_acct_id`
- **column_match**: dbo.UnclaimedProperty_2026 → dbo.VendorMRXREF_Keys
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.UnclaimedProperty_2026 → dbo.VendorXREFID_Key_LU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.UnclaimedProperty_2026 → dbo.VS_CUST
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.UnclaimedProperty_2026 → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.UnclaimedProperty_2026 → dbo.xCustomerXREF_KeyLU
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.UnclaimedProperty_2026 → dbo.xrfCoraCompanyPrefix
  - Confidence: 80%
  - Evidence: Exact column name match: "cora_acct_id" in both tables
  - Column: `cora_acct_id` → `cora_acct_id`
- **column_match**: dbo.Dim_GLChecks_Degen → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.DimDMSCoraAccount → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.Fact_Inventory → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.factCIT → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.factFIREBookingsWeOwe → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.FandI_DMS → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.GLDetail\_ MissingAcctInfo → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.QuartileOpportunityMart → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.ServiceCustomerDetail → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.Syndicate_Floorplan_Funding → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.Syndicate_Floorplan_Funding_Old → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.Syndicate_Floorplan_Payoff → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.Syndicate_Floorplan_Payoff_Old → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.Syndicate_Floorplan_Payoff_up → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `CompanyID` → `companyid`
- **column_match**: dbo.UnclaimedProperty_2026 → dbo.VS_CUST
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.UnclaimedProperty_2026 → dbo.VS_Cust2
  - Confidence: 80%
  - Evidence: Exact column name match: "companyid" in both tables
  - Column: `companyid` → `companyid`
- **column_match**: dbo.Dim_GLChecks_Degen → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "journalid" in both tables
  - Column: `journalid` → `journalid`
- **column_match**: dbo.factFIRE → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "journalid" in both tables
  - Column: `journalid` → `journalid`
- **column_match**: dbo.factFIRE_BMWMini → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "journalid" in both tables
  - Column: `journalid` → `journalid`
- **column_match**: dbo.GLDetail\_ MissingAcctInfo → dbo.UnclaimedProperty_2026
  - Confidence: 80%
  - Evidence: Exact column name match: "journalid" in both tables
  - Column: `journalid` → `journalid`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
