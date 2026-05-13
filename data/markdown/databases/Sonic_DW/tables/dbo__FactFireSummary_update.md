---
name: FactFireSummary_update
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on:
  - CallSourceDedupe20211221_FactRows_2
  - ControllerPoints
  - CustomerMatchResult
  - CustomerMatchResult_bak
  - Dim_Account
  - Dim_Account_20250618
  - Dim_Account_20250918_Clone
  - Dim_Account_Bk
  - Dim_Account_BKP_20250709
  - Dim_Account_old
  - Dim_Account_testing
  - Dim_AccountMgmt
  - Dim_AccountMgmtGrouping
  - Dim_ActivityStatus
  - Dim_Application
  - Dim_AutoTrader
  - Dim_CarsImpressionType
  - Dim_CarsLeadType
  - Dim_CarsProduct
  - Dim_CBNumber
  - Dim_CouponXref
  - Dim_Customer
  - Dim_DMSCustomer
  - dim_dmsCustomer_bk05052022
  - Dim_DMSCustomer_history
  - Dim_DMSEmployee
  - Dim_ECStatusEmail
  - Dim_ECStatusPhone
  - Dim_ECStatusText
  - Dim_Entity
  - Dim_EPTContactStatus
  - Dim_EPTEmailURL
  - Dim_EPTNotificationType
  - Dim_Expense
  - Dim_FIProduct
  - Dim_GeoLocation
  - dim_GLSchedule_degen
  - dim_GLSchedule_degen_arc
  - Dim_GLScheduleSummary_degen
  - Dim_HFM
  - Dim_HFMBrand
  - Dim_Journal
  - Dim_KeyWord
  - Dim_LaborType
  - Dim_LaborType_Transact
  - Dim_LeadSource
  - Dim_LeadStatus
  - Dim_Lender
  - Dim_MailCoupon
  - Dim_MailPiece
  - Dim_MgmtRollup
  - Dim_OffenseLevel
  - Dim_OpCode
  - Dim_Operator
  - Dim_OpportunitySource
  - Dim_Part
  - Dim_PricingGrid
  - Dim_Referrer
  - Dim_RegionalTechnologyManager
  - Dim_Scenario
  - Dim_SchedExceptionAccounts
  - Dim_Schedule
  - Dim_ScheduleException
  - Dim_SearchPhrase
  - Dim_SECRollup
  - Dim_SecurityAssetClass
  - Dim_SecurityAssetGroup
  - Dim_SecurityModule
  - Dim_SecurityOffense
  - Dim_SEMCampaign
  - Dim_Status
  - Dim_Step
  - Dim_StepSource
  - Dim_StepTarget
  - Dim_StockType
  - Dim_Validation
  - Dim_Vehicle
  - dim_vehicle_20241119
  - dim_vehicle_20241119_test
  - dim_vehicle_20241216
  - Dim_Vehicle_20250130
  - dim_vehicle_bkp_20241204
  - dim_vehicle_BKP_20241209
  - dim_vehicle_bkp_20241212
  - Dim_Vehicle_bkp_20241213
  - Dim_Vehicle_bkp_20250130
  - dim_vehicle_BKP_20250131
  - dim_vehicle_BKP_20250203
  - Dim_Vehicle_BKP_20250204
  - Dim_Vehicle_BKP_20250206
  - dim_Vehicle_bkp_20250403
  - dim_Vehicle_bkp_20250410
  - dim_vehicle_BKP_20250702
  - Dim_Vehicle_new
  - dim_vehicle_PreUpdate_20250702
  - Dim_VehicleDetail
  - Dim_VehicleGeneral
  - Dim_WebPage
  - DimActivityStatus
  - DimActivityType
  - DimAdSource
  - DimAdSource_orig
  - DimApplicationSource
  - DimAssociate
  - DimAssociate_0418
  - DimAssociate_07282023
  - DimAssociate_0816
  - DimAssociate_914_new
  - DimAssociate_bk_0413
  - DimAssociate_FULL
  - DimAssociate_newfile
  - DimAssociate0711
  - DimAssociate0829
  - DimAssociate1010
  - DimAssociate110724
  - DimAuctionSource
  - DimCallRevuDepartment
  - DimCategory
  - DimCategoryType
  - DimCustomer
  - DimCustomer_20250109
  - dimcustomer_bk05052022
  - DimDealType
  - DimDMSCoraAccount
  - DimDMSLegacyDealXREF
  - DimEmployee
  - DimEmployeeEleadDepartments
  - DimFinanceDecision
  - DimFinanceSource
  - DimFocusCustomer
  - DimGMBMetric
  - DimIVROption
  - DimLeadSource
  - DimLeadSource_Backup
  - DimLeadStatus
  - DimLeadSubSource
  - DimOpportunityPositionXREF
  - DimOpportunitySource
  - DimPurchaseMethod
  - DimRemedyDetail
  - DimRemedyUser
  - DimRemedyUserGroup
  - DimReportingSource
  - DimResult
  - DimReviewStatus
  - DimService
  - DimServiceAppointment
  - DimServiceAppointmentDetail
  - DimServiceAppointmentDetail_BKP
  - DimServiceType
  - DimSourceSystem
  - DimStatus
  - DimStatusType
  - DimSurveyAuditDetail
  - DimSurveyAuditDetail_BK_20211018
  - DimSurveyQuestion
  - DimTransportCompany
  - DimVehicle
  - DimVehicleHistory
  - DimVehicleSought
  - DimVehicleSoughtXref
  - DimVehicleSoughtXref_UAT
  - DimVehicleType
  - DimVin
  - DimVinHistory
  - DimWorkflow
  - Fact_Appointment
  - Fact_AutoTrader
  - Fact_AutoTraderVINLevel
  - Fact_AutoTraderVINLevel_338_339
  - Fact_BlackBookLeads
  - Fact_CallBright
  - Fact_CarsInvoice
  - Fact_DataLoad
  - Fact_DDCVehicleViews
  - Fact_DQValidation
  - Fact_GLBalances
  - Fact_GLChecks
  - Fact_GLSchedule
  - Fact_GLSchedule_arc
  - Fact_GLScheduleSummary
  - Fact_GLScheduleSummary_bk_12_11_2023
  - Fact_GoldDigger
  - Fact_HFM
  - Fact_HFM_20250619
  - Fact_HFM_20250819
  - Fact_HFM_20250916
  - Fact_HFM_Backup20250819
  - Fact_HFM_bk
  - Fact_HFM_bk_20230630
  - Fact_HFM_bk_20230712
  - Fact_HFM_Budget_T5_2025
  - Fact_HFM_Dev
  - Fact_HFM_Dev2
  - Fact_HFM_Dev3
  - Fact_HFM_Dev4
  - Fact_HFM_Snapshot
  - Fact_HFMBudget
  - Fact_HFMManual
  - Fact_Inventory
  - Fact_Jumpstart
  - Fact_LeadBySource
  - Fact_Merchandising
  - Fact_PartsSalesDetail
  - Fact_PromoMailing
  - Fact_SecurityAwareness
  - Fact_SecurityOffenses
  - Fact_SEM
  - Fact_SEO
  - Fact_Service
  - Fact_Service_arch
  - Fact_Service_DISCOUNT_NOT_MATCHED
  - Fact_ServiceDetail
  - Fact_ServiceDetail_arch
  - Fact_ServiceDetail_DISCOUNT_NOT_MATCHED
  - Fact_SymantecEvents
  - Fact_test_service
  - Fact_Vulnerabilities
  - Fact_WhiteHatSecurity_Event
  - FactActivity
  - FactActivity_0805
  - FactCallSource
  - FactCallSourceNew
  - FactCBABuyerTarget
  - FactCollisionCSI
  - FactCSIQuarterly
  - factFIRE
  - factFIRE_BMWMini
  - FactFireBookings_preDW
  - factFIREBookingsWeOwe
  - FactFireSummary
  - CSI_Email_Change_Tracking
  - Dim_Entity
  - FactFireSummary
  - CSI_Email_Change_Tracking
  - Dim_EPOpCodeBucket_Transact
  - DimFocusCustomer
  - DimGMBMetric
  - DimVehicle
  - DimVehicleBodyStyle
  - DimVehicleCab
  - DimVehicleCategory
  - DimVehicleChassis
  - DimVehicleCylinders
  - DimVehicleDMVCategory
  - DimVehicleDriveType
  - DimVehicleEngine
  - DimVehicleExteriorColor
  - DimVehicleFuelType
  - DimVehicleHistory
  - DimVehicleInteriorColor
  - DimVehicleMake
  - DimVehicleModel
  - DimVehicleModelNumber
  - DimVehicleRestraints
  - DimVehicleSeries
  - DimVehicleTransmission
  - DimVehicleTrim
  - DimVin
  - DimVinHistory
  - Doc_TXN_BulkPermissionAdd
  - Fact_ReconAging_TXN
  - Fact_TrafficManagementGoals
  - FactFireSummary
  - FactFireSummary
row_count: 0
size_kb: 0
column_count: 157
index_count: 1
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

| Name                       | Type     | Nullable | Identity | Default | Description |
| -------------------------- | -------- | -------- | -------- | ------- | ----------- |
| `FactFireSummaryKey`       | int      |          | ✓        |         |             |
| `AccountingDateKey`        | int      |          |          |         |             |
| `Age`                      | int      |          |          |         |             |
| `APR`                      | numeric  |          |          |         |             |
| `AssignedFlag`             | bit      |          |          |         |             |
| `BackCost`                 | numeric  |          |          |         |             |
| `BackGross`                | numeric  |          |          |         |             |
| `BackSale`                 | numeric  |          |          |         |             |
| `BankFee`                  | int      |          |          |         |             |
| `BookedDateKey`            | int      |          |          |         |             |
| `BuyRate`                  | numeric  |          |          |         |             |
| `CashDown`                 | numeric  |          |          |         |             |
| `CashInBankDateKey`        | int      |          |          |         |             |
| `CertifiedFlag`            | char     |          |          |         |             |
| `Chargebacks`              | numeric  |          |          |         |             |
| `ChargebacksOver90`        | numeric  |          |          |         |             |
| `ChargebacksUnder90`       | numeric  |          |          |         |             |
| `ClosingManager`           | varchar  |          |          |         |             |
| `ClosingManagerKey`        | int      |          |          |         |             |
| `ContractDateKey`          | int      |          |          |         |             |
| `COSAdj`                   | numeric  |          |          |         |             |
| `CustomerNumber`           | varchar  |          |          |         |             |
| `DMSCustomerKey`           | int      |          |          |         |             |
| `DealEvent6`               | varchar  |          |          |         |             |
| `DealEvent6Date`           | date     |          |          |         |             |
| `DealEvent7`               | varchar  |          |          |         |             |
| `DealEvent7Date`           | date     |          |          |         |             |
| `DealEvent8`               | varchar  |          |          |         |             |
| `DealEvent8Date`           | date     |          |          |         |             |
| `DealEvent9`               | varchar  |          |          |         |             |
| `DealEvent9Date`           | date     |          |          |         |             |
| `DealEvent10`              | varchar  |          |          |         |             |
| `DealEvent10Date`          | date     |          |          |         |             |
| `DealNumber`               | varchar  |          |          |         |             |
| `DealStatus`               | varchar  |          |          |         |             |
| `DealType`                 | varchar  |          |          |         |             |
| `DealTypeFI`               | varchar  |          |          |         |             |
| `DingDentChargeback`       | numeric  |          |          |         |             |
| `DingDentCost`             | numeric  |          |          |         |             |
| `DingDentCount`            | int      |          |          |         |             |
| `DingDentSale`             | numeric  |          |          |         |             |
| `DocFee`                   | numeric  |          |          |         |             |
| `EntAccountingPrefix`      | varchar  |          |          |         |             |
| `EntADPCompanyID`          | varchar  |          |          |         |             |
| `EntCoraAccountID`         | int      |          |          |         |             |
| `EntityKey`                | int      |          |          |         |             |
| `FactoryBonus`             | numeric  |          |          |         |             |
| `FICora`                   | int      |          |          |         |             |
| `FIIncome`                 | numeric  |          |          |         |             |
| `FILogon`                  | varchar  |          |          |         |             |
| `FinanceAmount`            | numeric  |          |          |         |             |
| `FinanceCharge`            | numeric  |          |          |         |             |
| `FinanceCompany`           | varchar  |          |          |         |             |
| `FinanceManager`           | varchar  |          |          |         |             |
| `FinanceReserve`           | numeric  |          |          |         |             |
| `FinanceReserveChargeback` | numeric  |          |          |         |             |
| `FinanceReserveCount`      | int      |          |          |         |             |
| `FINet`                    | numeric  |          |          |         |             |
| `FIPack`                   | numeric  |          |          |         |             |
| `FIStockNumber`            | varchar  |          |          |         |             |
| `FrontCost`                | numeric  |          |          |         |             |
| `FrontGross`               | numeric  |          |          |         |             |
| `FrontGrossAllIn`          | numeric  |          |          |         |             |
| `FrontSale`                | numeric  |          |          |         |             |
| `FrontWeOwes`              | numeric  |          |          |         |             |
| `FundedDate`               | varchar  |          |          |         |             |
| `FinanceManagerKey`        | int      |          |          |         |             |
| `GapChargeback`            | numeric  |          |          |         |             |
| `GapCost`                  | numeric  |          |          |         |             |
| `GapCount`                 | int      |          |          |         |             |
| `GapSale`                  | numeric  |          |          |         |             |
| `HardWeOweGross`           | numeric  | ✓        |          |         |             |
| `Incentives`               | numeric  |          |          |         |             |
| `LenderKey`                | int      |          |          |         |             |
| `MakeName`                 | varchar  |          |          |         |             |
| `MatchType`                | varchar  |          |          |         |             |
| `ModelName`                | varchar  |          |          |         |             |
| `ModelYear`                | int      |          |          |         |             |
| `OriginalAccountingDate`   | datetime |          |          |         |             |
| `OtherAdjustment`          | numeric  |          |          |         |             |
| `Pack`                     | numeric  |          |          |         |             |
| `Payment`                  | numeric  |          |          |         |             |
| `PenetrationCount`         | int      |          |          |         |             |
| `PermaPlateChargeback`     | numeric  |          |          |         |             |
| `PermaPlateCost`           | numeric  |          |          |         |             |
| `PermaPlateCount`          | int      |          |          |         |             |
| `PermaPlateSale`           | numeric  |          |          |         |             |
| `PointsHeld`               | numeric  |          |          |         |             |
| `ProductCount`             | int      |          |          |         |             |
| `ProductOnlyFlag`          | bit      |          |          |         |             |
| `Recon`                    | numeric  |          |          |         |             |
| `SalesManager`             | varchar  |          |          |         |             |
| `SalesPercent`             | decimal  |          |          |         |             |
| `SalesPerson1`             | varchar  |          |          |         |             |
| `SalesPerson2`             | varchar  |          |          |         |             |
| `SaleType`                 | varchar  |          |          |         |             |
| `SalesPerson1key`          | int      |          |          |         |             |
| `Salesperson2key`          | int      |          |          |         |             |
| `SalesManagerKey`          | int      |          |          |         |             |
| `StatCount`                | int      |          |          |         |             |
| `StockNumber`              | varchar  |          |          |         |             |
| `Term`                     | int      |          |          |         |             |
| `TotalGross`               | numeric  |          |          |         |             |
| `TradeACV`                 | numeric  |          |          |         |             |
| `TradeAllowance`           | numeric  |          |          |         |             |
| `TradeGross`               | numeric  |          |          |         |             |
| `TradeStockNumber`         | varchar  |          |          |         |             |
| `TradeVIN`                 | varchar  |          |          |         |             |
| `Trade2ACV`                | numeric  |          |          |         |             |
| `Trade2Gross`              | numeric  |          |          |         |             |
| `Trade2StockNumber`        | varchar  |          |          |         |             |
| `Trade2VIN`                | varchar  |          |          |         |             |
| `VIN`                      | varchar  |          |          |         |             |
| `VSAChargeback`            | numeric  |          |          |         |             |
| `VSACost`                  | numeric  |          |          |         |             |
| `VSACount`                 | int      |          |          |         |             |
| `VSASale`                  | numeric  |          |          |         |             |
| `KeyChargeback`            | int      |          |          |         |             |
| `KeyCost`                  | int      |          |          |         |             |
| `KeyCount`                 | numeric  |          |          |         |             |
| `KeySale`                  | int      |          |          |         |             |
| `OtherChargeback`          | int      |          |          |         |             |
| `OtherCost`                | int      |          |          |         |             |
| `OtherCount`               | numeric  |          |          |         |             |
| `OtherSale`                | int      |          |          |         |             |
| `InsuranceChargeback`      | int      |          |          |         |             |
| `InsuranceCost`            | int      |          |          |         |             |
| `InsuranceCount`           | numeric  |          |          |         |             |
| `InsuranceSale`            | int      |          |          |         |             |
| `LeaseWearTearChargeback`  | int      |          |          |         |             |
| `LeaseWearTearCost`        | int      |          |          |         |             |
| `LeaseWearTearCount`       | numeric  |          |          |         |             |
| `LeaseWearTearSale`        | int      |          |          |         |             |
| `PhantomChargeback`        | int      |          |          |         |             |
| `PhantomCost`              | int      |          |          |         |             |
| `PhantomCount`             | numeric  |          |          |         |             |
| `PhantomSale`              | int      |          |          |         |             |
| `MaintenanceChargeback`    | int      |          |          |         |             |
| `MaintenanceCost`          | int      |          |          |         |             |
| `MaintenanceCount`         | numeric  |          |          |         |             |
| `MaintenanceSale`          | int      |          |          |         |             |
| `RoadstarChargeback`       | int      |          |          |         |             |
| `RoadstarCost`             | int      |          |          |         |             |
| `RoadstarCount`            | numeric  |          |          |         |             |
| `RoadstarSale`             | int      |          |          |         |             |
| `TireWheelChargeback`      | int      |          |          |         |             |
| `TireWheelCost`            | int      |          |          |         |             |
| `TireWheelCount`           | numeric  |          |          |         |             |
| `TireWheelSale`            | int      |          |          |         |             |
| `SecurityChargeback`       | int      |          |          |         |             |
| `SecurityCost`             | int      |          |          |         |             |
| `SecurityCount`            | numeric  |          |          |         |             |
| `SecuritySale`             | int      |          |          |         |             |
| `ETLExecution_ID`          | int      |          |          |         |             |
| `Meta_ComputerName`        | varchar  |          |          |         |             |
| `Meta_LoadDate`            | datetime |          |          |         |             |
| `Meta_UserID`              | varchar  |          |          |         |             |

## Constraints

- **Primary Key**: PK_FactFireSummary121
  - Columns: FactFireSummaryKey

## Indexes

- **PK_FactFireSummary121** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: FactFireSummaryKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.CallSourceDedupe20211221_FactRows_2 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.ControllerPoints → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.CustomerMatchResult → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.CustomerMatchResult_bak → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Account → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Account_20250618 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Account_20250918_Clone → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Account_Bk → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Account_BKP_20250709 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Account_old → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Account_testing → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_AccountMgmt → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_AccountMgmtGrouping → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_ActivityStatus → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Application → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_AutoTrader → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_CarsImpressionType → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_CarsLeadType → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_CarsProduct → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_CBNumber → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_CouponXref → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Customer → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_DMSCustomer → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_dmsCustomer_bk05052022 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_DMSCustomer_history → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_DMSEmployee → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_ECStatusEmail → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_ECStatusPhone → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_ECStatusText → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Entity → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_EPTContactStatus → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_EPTEmailURL → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_EPTNotificationType → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Expense → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_FIProduct → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_GeoLocation → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_id` → `ETLExecution_ID`
- **column_match**: dbo.dim_GLSchedule_degen → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_GLSchedule_degen_arc → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_GLScheduleSummary_degen → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_HFM → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_HFMBrand → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Journal → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_KeyWord → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_LaborType → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_LaborType_Transact → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_LeadSource → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_LeadStatus → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Lender → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_MailCoupon → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_MailPiece → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_MgmtRollup → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_OffenseLevel → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_OpCode → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Operator → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_OpportunitySource → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Part → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_PricingGrid → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Referrer → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_RegionalTechnologyManager → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Scenario → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_SchedExceptionAccounts → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Schedule → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_ScheduleException → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_SearchPhrase → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_SECRollup → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_SecurityAssetClass → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_SecurityAssetGroup → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_SecurityModule → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_SecurityOffense → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_SEMCampaign → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Status → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Step → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_StepSource → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_StepTarget → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_StockType → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Validation → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Vehicle → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_vehicle_20241119 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_vehicle_20241119_test → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_vehicle_20241216 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Vehicle_20250130 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_vehicle_bkp_20241204 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_vehicle_BKP_20241209 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_vehicle_bkp_20241212 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Vehicle_bkp_20241213 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Vehicle_bkp_20250130 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_vehicle_BKP_20250131 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_vehicle_BKP_20250203 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Vehicle_BKP_20250204 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Vehicle_BKP_20250206 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_Vehicle_bkp_20250403 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_Vehicle_bkp_20250410 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_vehicle_BKP_20250702 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Vehicle_new → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_vehicle_PreUpdate_20250702 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_VehicleDetail → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_VehicleGeneral → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_WebPage → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimActivityStatus → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimActivityType → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAdSource → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAdSource_orig → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimApplicationSource → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate_0418 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate_07282023 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate_0816 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate_914_new → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate_bk_0413 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate_FULL → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate_newfile → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate0711 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate0829 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate1010 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate110724 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAuctionSource → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimCallRevuDepartment → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimCategory → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimCategoryType → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimCustomer → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimCustomer_20250109 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dimcustomer_bk05052022 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimDealType → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimDMSCoraAccount → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimDMSLegacyDealXREF → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimEmployee → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimEmployeeEleadDepartments → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimFinanceDecision → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimFinanceSource → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimFocusCustomer → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_Id` → `ETLExecution_ID`
- **column_match**: dbo.DimGMBMetric → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_id` → `ETLExecution_ID`
- **column_match**: dbo.DimIVROption → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimLeadSource → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimLeadSource_Backup → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimLeadStatus → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimLeadSubSource → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimOpportunityPositionXREF → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimOpportunitySource → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimPurchaseMethod → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimRemedyDetail → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimRemedyUser → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimRemedyUserGroup → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimReportingSource → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimResult → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimReviewStatus → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimService → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimServiceAppointment → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimServiceAppointmentDetail → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimServiceAppointmentDetail_BKP → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimServiceType → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimSourceSystem → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimStatus → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimStatusType → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimSurveyAuditDetail → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimSurveyAuditDetail_BK_20211018 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimSurveyQuestion → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimTransportCompany → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimVehicle → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimVehicleHistory → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimVehicleSought → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimVehicleSoughtXref → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimVehicleSoughtXref_UAT → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimVehicleType → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimVin → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimVinHistory → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimWorkflow → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_Appointment → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_AutoTrader → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_AutoTraderVINLevel → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_AutoTraderVINLevel_338_339 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_BlackBookLeads → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_CallBright → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_CarsInvoice → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_DataLoad → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_DDCVehicleViews → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_DQValidation → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_GLBalances → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_GLChecks → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_GLSchedule → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_GLSchedule_arc → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_GLScheduleSummary → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_GLScheduleSummary_bk_12_11_2023 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_GoldDigger → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_20250619 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_20250819 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_20250916 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_Backup20250819 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_bk → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_bk_20230630 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_bk_20230712 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_Budget_T5_2025 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_Dev → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_Dev2 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_Dev3 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_Dev4 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_Snapshot → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFMBudget → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFMManual → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_Inventory → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_Jumpstart → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_LeadBySource → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_Merchandising → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_PartsSalesDetail → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_PromoMailing → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_SecurityAwareness → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_SecurityOffenses → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_SEM → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_SEO → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_Service → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_Service_arch → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_Service_DISCOUNT_NOT_MATCHED → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_ServiceDetail → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_ServiceDetail_arch → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_ServiceDetail_DISCOUNT_NOT_MATCHED → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_SymantecEvents → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_test_service → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_Vulnerabilities → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_WhiteHatSecurity_Event → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactActivity → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactActivity_0805 → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactCallSource → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactCallSourceNew → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactCBABuyerTarget → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactCollisionCSI → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactCSIQuarterly → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.factFIRE → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.factFIRE_BMWMini → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireBookings_preDW → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.factFIREBookingsWeOwe → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactFocusBudget
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_Id`
- **column_match**: dbo.FactFireSummary_update → dbo.FactMSCTasks
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactMSCTasksDept
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactOpportunity
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactOpportunity_0805
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactOpportunity_10032023
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactOpportunity_10042023
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactOpportunity_20250109
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactRemedy
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactServiceAppointment
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactServiceAppointmentDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactSurveyAuditDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactSurveyAuditDetail\_\_BK_20211018
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummary_06102022
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummary_06132022
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummary_07292023
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummary_20230706
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummary_20230727
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummary_bk02172022
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.Facttrafficsummary_TMR_Export
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.Facttrafficsummary_TMR_Export_06142022
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummary_TMR_Export_1006
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.Facttrafficsummary_TMR_Export_bk02172022
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.Facttrafficsummary_TMR_Export_old 0610
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummary_TMR_Export_zz
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummaryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummaryDaily_07292023
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummaryDaily_20230706
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummaryDaily_20230727
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummaryDailyDept
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummarySubSource
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummarySubSource_05032024
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummarySubSource_20240404
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummarySubSourcebkp
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactVehicleInventory
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactVehiclePriceChangeNotification
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactVehiclePurchase
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FOCUS_Elead_ActivityTypeChange
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.FOCUS_Elead_ActivityTypeChange_UAT
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary*update → dbo.GLDetail* MissingAcctInfo
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.SalesTranAssociate_Outbound
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.Sonic_Dim_CarsLeadType
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.Sonic_Dim_CarsStockType
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.Sonic_Dim_CarsTimeZone
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.Sonic_Dim_CarsVehicleStatus
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.TargetSourceRel
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.testassociate
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.xDim_Customer
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.zzzDim_Associate
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary_update → dbo.zzzzDimAssociate
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.CSI_Email_Change_Tracking → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "entadpcompanyid" in both tables
  - Column: `entadpcompanyid` → `EntADPCompanyID`
- **column_match**: dbo.Dim_Entity → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "entadpcompanyid" in both tables
  - Column: `EntADPCompanyID` → `EntADPCompanyID`
- **column_match**: dbo.FactFireSummary → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "entadpcompanyid" in both tables
  - Column: `EntADPCompanyID` → `EntADPCompanyID`
- **column_match**: dbo.FactFireSummary_update → dbo.Syndicate_FPAccounts
  - Confidence: 80%
  - Evidence: Exact column name match: "entadpcompanyid" in both tables
  - Column: `EntADPCompanyID` → `EntADPCompanyID`
- **column_match**: dbo.CSI_Email_Change_Tracking → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Dim_EPOpCodeBucket_Transact → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimFocusCustomer → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserId` → `Meta_UserID`
- **column_match**: dbo.DimGMBMetric → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicle → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleBodyStyle → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCategory → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleChassis → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCylinders → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleDMVCategory → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleDriveType → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleEngine → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleExteriorColor → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleFuelType → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleHistory → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleInteriorColor → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleMake → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModelNumber → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleRestraints → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleSeries → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTrim → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVin → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVinHistory → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Doc_TXN_BulkPermissionAdd → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Fact_ReconAging_TXN → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Fact_TrafficManagementGoals → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactGMB
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactMSCTasks
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactMSCTasksDept
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummary_06102022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummary_06132022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummary_07292023
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummary_20230706
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummary_20230727
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummary_bk02172022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.Facttrafficsummary_TMR_Export
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.Facttrafficsummary_TMR_Export_06142022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummary_TMR_Export_1006
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.Facttrafficsummary_TMR_Export_bk02172022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.Facttrafficsummary_TMR_Export_old 0610
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummary_TMR_Export_zz
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummaryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummaryDaily_07292023
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummaryDaily_20230706
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummaryDaily_20230727
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummaryDailyDept
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummarySubSource
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummarySubSource_05032024
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummarySubSource_20240404
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactTrafficSummarySubSourcebkp
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactVehicleInventory
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.FactVehiclePriceChangeNotification
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.SalesTranAssociate_Outbound
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.Syndicate_Floorplan_BoA_Dont_Fund
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.Syndicate_Floorplan_BoA_Dont_Fund_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.Syndicate_Floorplan_BoA_Response
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.Syndicate_Floorplan_BoA_Response_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.Syndicate_Floorplan_BoA_Response_Old2
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.Syndicate_Floorplan_BoA_Response_tmp
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.Syndicate_Floorplan_Payoff
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.Syndicate_Floorplan_Payoff_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.Syndicate_Floorplan_Payoffs_Skip
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.Syndicate_Floorplan_Payoffs_Skip_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.Syndicate_MaxPayoff
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.Syndicate_MaxPayoff_History
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary_update → dbo.Syndicate_MaxPayoff_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "entcoraaccountid" in both tables
  - Column: `EntCoraAccountID` → `EntCoraAccountID`

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
