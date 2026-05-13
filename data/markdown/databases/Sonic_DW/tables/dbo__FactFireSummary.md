---
name: FactFireSummary
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
  - CSI_Email_Change_Tracking
  - Dim_Entity
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
row_count: 0
size_kb: 0
column_count: 158
index_count: 2
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
| `VehicleMileage`           | int      | ✓        |          |         |             |

## Constraints

- **Primary Key**: PK_FactFireSummary12
  - Columns: FactFireSummaryKey

## Indexes

- **idx_nc_Accountingdatekey_EntityKey** (NONCLUSTERED)
  - Unique: No
  - Primary Key: No
  - Key Columns: AccountingDateKey ASC, EntityKey ASC
  - Included Columns: Age, APR, AssignedFlag, BackCost, SecuritySale, Meta_LoadDate, TireWheelCost, TireWheelCount, TireWheelSale, SecurityChargeback, SecurityCost, SecurityCount, MaintenanceSale, RoadstarChargeback, RoadstarCost, RoadstarCount, RoadstarSale, TireWheelChargeback, PhantomCost, PhantomCount, PhantomSale, MaintenanceChargeback, MaintenanceCost, MaintenanceCount, InsuranceSale, LeaseWearTearChargeback, LeaseWearTearCost, LeaseWearTearCount, LeaseWearTearSale, PhantomChargeback, OtherCost, OtherCount, OtherSale, InsuranceChargeback, InsuranceCost, InsuranceCount, VSASale, KeyChargeback, KeyCost, KeyCount, KeySale, OtherChargeback, Trade2StockNumber, Trade2VIN, VIN, VSAChargeback, VSACost, VSACount, TradeAllowance, TradeGross, TradeStockNumber, TradeVIN, Trade2ACV, Trade2Gross, SalesPerson2, SaleType, StatCount, StockNumber, Term, TradeACV, ProductCount, ProductOnlyFlag, Recon, SalesManager, SalesPercent, SalesPerson1, PenetrationCount, PermaPlateChargeback, PermaPlateCost, PermaPlateCount, PermaPlateSale, PointsHeld, ModelName, ModelYear, OriginalAccountingDate, OtherAdjustment, Pack, Payment, GapCount, GapSale, HardWeOweGross, Incentives, MakeName, MatchType, FrontGrossAllIn, FrontSale, FrontWeOwes, FundedDate, GapChargeback, GapCost, FinanceReserveCount, FINet, FIPack, FIStockNumber, FrontCost, FrontGross, FinanceAmount, FinanceCharge, FinanceCompany, FinanceManager, FinanceReserve, FinanceReserveChargeback, DingDentCount, DingDentSale, DocFee, FactoryBonus, FICora, FIIncome, DealEvent10Date, DealNumber, DealStatus, DealType, DingDentChargeback, DingDentCost, DealEvent7Date, DealEvent8, DealEvent8Date, DealEvent9, DealEvent9Date, DealEvent10, ContractDateKey, COSAdj, CustomerNumber, DealEvent6, DealEvent6Date, DealEvent7, CashInBankDateKey, CertifiedFlag, Chargebacks, ChargebacksOver90, ChargebacksUnder90, ClosingManager, BackGross, BackSale, BankFee, BookedDateKey, BuyRate, CashDown
- **PK_FactFireSummary12** (CLUSTERED)
  - Unique: Yes
  - Primary Key: Yes
  - Key Columns: FactFireSummaryKey ASC

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Relationships

### High Confidence (≥ 0.8)

- **column_match**: dbo.CallSourceDedupe20211221_FactRows_2 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.ControllerPoints → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.CustomerMatchResult → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.CustomerMatchResult_bak → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Account → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Account_20250618 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Account_20250918_Clone → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Account_Bk → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Account_BKP_20250709 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Account_old → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Account_testing → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_AccountMgmt → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_AccountMgmtGrouping → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_ActivityStatus → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Application → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_AutoTrader → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_CarsImpressionType → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_CarsLeadType → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_CarsProduct → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_CBNumber → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_CouponXref → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Customer → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_DMSCustomer → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_dmsCustomer_bk05052022 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_DMSCustomer_history → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_DMSEmployee → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_ECStatusEmail → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_ECStatusPhone → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_ECStatusText → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Entity → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_EPTContactStatus → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_EPTEmailURL → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_EPTNotificationType → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Expense → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_FIProduct → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_GeoLocation → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_id` → `ETLExecution_ID`
- **column_match**: dbo.dim_GLSchedule_degen → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_GLSchedule_degen_arc → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_GLScheduleSummary_degen → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_HFM → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_HFMBrand → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Journal → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_KeyWord → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_LaborType → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_LaborType_Transact → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_LeadSource → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_LeadStatus → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Lender → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_MailCoupon → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_MailPiece → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_MgmtRollup → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_OffenseLevel → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_OpCode → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Operator → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_OpportunitySource → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Part → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_PricingGrid → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Referrer → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_RegionalTechnologyManager → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Scenario → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_SchedExceptionAccounts → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Schedule → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_ScheduleException → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_SearchPhrase → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_SECRollup → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_SecurityAssetClass → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_SecurityAssetGroup → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_SecurityModule → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_SecurityOffense → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_SEMCampaign → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Status → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Step → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_StepSource → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_StepTarget → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_StockType → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Validation → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Vehicle → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_vehicle_20241119 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_vehicle_20241119_test → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_vehicle_20241216 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Vehicle_20250130 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_vehicle_bkp_20241204 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_vehicle_BKP_20241209 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_vehicle_bkp_20241212 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Vehicle_bkp_20241213 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Vehicle_bkp_20250130 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_vehicle_BKP_20250131 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_vehicle_BKP_20250203 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Vehicle_BKP_20250204 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Vehicle_BKP_20250206 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_Vehicle_bkp_20250403 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_Vehicle_bkp_20250410 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_vehicle_BKP_20250702 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_Vehicle_new → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dim_vehicle_PreUpdate_20250702 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_VehicleDetail → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_VehicleGeneral → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Dim_WebPage → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimActivityStatus → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimActivityType → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAdSource → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAdSource_orig → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimApplicationSource → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate_0418 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate_07282023 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate_0816 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate_914_new → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate_bk_0413 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate_FULL → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate_newfile → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate0711 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate0829 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate1010 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAssociate110724 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimAuctionSource → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimCallRevuDepartment → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimCategory → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimCategoryType → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimCustomer → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimCustomer_20250109 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.dimcustomer_bk05052022 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimDealType → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimDMSCoraAccount → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimDMSLegacyDealXREF → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimEmployee → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimEmployeeEleadDepartments → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimFinanceDecision → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimFinanceSource → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimFocusCustomer → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_Id` → `ETLExecution_ID`
- **column_match**: dbo.DimGMBMetric → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_id` → `ETLExecution_ID`
- **column_match**: dbo.DimIVROption → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimLeadSource → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimLeadSource_Backup → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimLeadStatus → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimLeadSubSource → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimOpportunityPositionXREF → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimOpportunitySource → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimPurchaseMethod → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimRemedyDetail → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimRemedyUser → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimRemedyUserGroup → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimReportingSource → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimResult → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimReviewStatus → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimService → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimServiceAppointment → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimServiceAppointmentDetail → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimServiceAppointmentDetail_BKP → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimServiceType → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimSourceSystem → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimStatus → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimStatusType → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimSurveyAuditDetail → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimSurveyAuditDetail_BK_20211018 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimSurveyQuestion → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimTransportCompany → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimVehicle → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimVehicleHistory → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimVehicleSought → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimVehicleSoughtXref → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimVehicleSoughtXref_UAT → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimVehicleType → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimVin → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimVinHistory → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.DimWorkflow → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_Appointment → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_AutoTrader → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_AutoTraderVINLevel → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_AutoTraderVINLevel_338_339 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_BlackBookLeads → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_CallBright → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_CarsInvoice → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_DataLoad → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_DDCVehicleViews → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_DQValidation → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_GLBalances → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_GLChecks → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_GLSchedule → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_GLSchedule_arc → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_GLScheduleSummary → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_GLScheduleSummary_bk_12_11_2023 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_GoldDigger → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_20250619 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_20250819 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_20250916 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_Backup20250819 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_bk → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_bk_20230630 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_bk_20230712 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_Budget_T5_2025 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_Dev → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_Dev2 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_Dev3 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_Dev4 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFM_Snapshot → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFMBudget → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_HFMManual → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_Inventory → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_Jumpstart → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_LeadBySource → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_Merchandising → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_PartsSalesDetail → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_PromoMailing → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_SecurityAwareness → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_SecurityOffenses → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_SEM → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_SEO → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_Service → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_Service_arch → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_Service_DISCOUNT_NOT_MATCHED → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_ServiceDetail → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_ServiceDetail_arch → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_ServiceDetail_DISCOUNT_NOT_MATCHED → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_SymantecEvents → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_test_service → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_Vulnerabilities → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.Fact_WhiteHatSecurity_Event → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactActivity → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactActivity_0805 → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactCallSource → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactCallSourceNew → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactCBABuyerTarget → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactCollisionCSI → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactCSIQuarterly → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.factFIRE → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.factFIRE_BMWMini → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireBookings_preDW → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.factFIREBookingsWeOwe → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactFocusBudget
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_Id`
- **column_match**: dbo.FactFireSummary → dbo.FactMSCTasks
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactMSCTasksDept
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactOpportunity
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactOpportunity_0805
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactOpportunity_10032023
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactOpportunity_10042023
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactOpportunity_20250109
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactRemedy
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactServiceAppointment
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactServiceAppointmentDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactSurveyAuditDetail
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactSurveyAuditDetail\_\_BK_20211018
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummary_06102022
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummary_06132022
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummary_07292023
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummary_20230706
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummary_20230727
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummary_bk02172022
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.Facttrafficsummary_TMR_Export
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.Facttrafficsummary_TMR_Export_06142022
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummary_TMR_Export_1006
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.Facttrafficsummary_TMR_Export_bk02172022
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.Facttrafficsummary_TMR_Export_old 0610
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummary_TMR_Export_zz
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummaryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummaryDaily_07292023
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummaryDaily_20230706
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummaryDaily_20230727
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummaryDailyDept
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummarySubSource
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummarySubSource_05032024
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummarySubSource_20240404
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummarySubSourcebkp
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactVehicleInventory
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactVehiclePriceChangeNotification
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FactVehiclePurchase
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FOCUS_Elead_ActivityTypeChange
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.FOCUS_Elead_ActivityTypeChange_UAT
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.GLDetail\_ MissingAcctInfo
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.SalesTranAssociate_Outbound
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.Sonic_Dim_CarsLeadType
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.Sonic_Dim_CarsStockType
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.Sonic_Dim_CarsTimeZone
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.Sonic_Dim_CarsVehicleStatus
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.TargetSourceRel
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.testassociate
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.xDim_Customer
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.zzzDim_Associate
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.FactFireSummary → dbo.zzzzDimAssociate
  - Confidence: 80%
  - Evidence: Exact column name match: "etlexecution_id" in both tables
  - Column: `ETLExecution_ID` → `ETLExecution_ID`
- **column_match**: dbo.CSI_Email_Change_Tracking → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "entadpcompanyid" in both tables
  - Column: `entadpcompanyid` → `EntADPCompanyID`
- **column_match**: dbo.Dim_Entity → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "entadpcompanyid" in both tables
  - Column: `EntADPCompanyID` → `EntADPCompanyID`
- **column_match**: dbo.FactFireSummary → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "entadpcompanyid" in both tables
  - Column: `EntADPCompanyID` → `EntADPCompanyID`
- **column_match**: dbo.FactFireSummary → dbo.Syndicate_FPAccounts
  - Confidence: 80%
  - Evidence: Exact column name match: "entadpcompanyid" in both tables
  - Column: `EntADPCompanyID` → `EntADPCompanyID`
- **column_match**: dbo.CSI_Email_Change_Tracking → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Dim_EPOpCodeBucket_Transact → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimFocusCustomer → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserId` → `Meta_UserID`
- **column_match**: dbo.DimGMBMetric → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicle → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleBodyStyle → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCab → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCategory → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleChassis → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleCylinders → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleDMVCategory → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleDriveType → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleEngine → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleExteriorColor → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleFuelType → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleHistory → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleInteriorColor → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleMake → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModel → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleModelNumber → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleRestraints → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleSeries → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTransmission → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVehicleTrim → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVin → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.DimVinHistory → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Doc_TXN_BulkPermissionAdd → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Fact_ReconAging_TXN → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.Fact_TrafficManagementGoals → dbo.FactFireSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactFireSummary_update
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactGMB
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactMSCTasks
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactMSCTasksDept
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummary
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummary_06102022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummary_06132022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummary_07292023
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummary_20230706
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummary_20230727
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummary_bk02172022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.Facttrafficsummary_TMR_Export
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.Facttrafficsummary_TMR_Export_06142022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummary_TMR_Export_1006
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.Facttrafficsummary_TMR_Export_bk02172022
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.Facttrafficsummary_TMR_Export_old 0610
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummary_TMR_Export_zz
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummaryDaily
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummaryDaily_07292023
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummaryDaily_20230706
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummaryDaily_20230727
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummaryDailyDept
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummarySubSource
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummarySubSource_05032024
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummarySubSource_20240404
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactTrafficSummarySubSourcebkp
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactVehicleInventory
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.FactVehiclePriceChangeNotification
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.SalesTranAssociate_Outbound
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.Syndicate_Floorplan_BoA_Dont_Fund
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.Syndicate_Floorplan_BoA_Dont_Fund_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.Syndicate_Floorplan_BoA_Response
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.Syndicate_Floorplan_BoA_Response_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.Syndicate_Floorplan_BoA_Response_Old2
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.Syndicate_Floorplan_BoA_Response_tmp
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.Syndicate_Floorplan_Payoff
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.Syndicate_Floorplan_Payoff_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.Syndicate_Floorplan_Payoffs_Skip
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.Syndicate_Floorplan_Payoffs_Skip_Old
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.Syndicate_Floorplan_Transaction
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.Syndicate_MaxPayoff
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.Syndicate_MaxPayoff_History
  - Confidence: 80%
  - Evidence: Exact column name match: "meta_userid" in both tables
  - Column: `Meta_UserID` → `Meta_UserID`
- **column_match**: dbo.FactFireSummary → dbo.Syndicate_MaxPayoff_Old
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
