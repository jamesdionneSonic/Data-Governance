---
name: uspLoadIBEXSurveyResponseAudit
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql

/**********************************************************************************************************************************
-- CHANGE LOG
-- 07/05/2022:	DMD - Created procedure
-- 11/07/2022:	DMD - Added CASE for BuyerType and TGT.SurveyAuditKey = LTRIM(RTRIM(SRC.SurveyID)), also added UPDATE for matching existing records
-- 11/16/2022:	DMD - Removed INSERT and DimCustomer reference to handle dupes since we're only updating existing records now
************************************************************************************************************************************/

--EXEC [dbo].[uspLoadIBEXSurveyResponseAudit]


CREATE PROC [dbo].[uspLoadIBEXSurveyResponseAudit]
AS

BEGIN
MERGE [Sonic_DW].[dbo].[DimSurveyAudit] TGT --ORDER by SentDate DESC
	USING
		(
			SELECT
					'-1' AS ReportingSourceKey
					,CASE WHEN st.EventType = 1 THEN 'Buyer' WHEN st.EventType = 2 THEN 'Future Buyer' ELSE 'Unknown' END AS BuyerType
					,'-1' AS CampaignID
					,'No Match - IBEX Insert' AS Comments
					--,ISNULL(cs.CustomerKey,'-1') AS CustomerKey
					--,ISNULL(cs.DMSCustomerKey,'-1') AS [CustomerKeyDMS]
					,st.FirstName AS CustomerFirstName
					,st.LastName AS CustomerLastName
					,st.Phone AS CustomerPhoneNumber
					,st.CustomerAddress AS CustomerStreetAddress
					,st.CustomerCity AS CustomerCity
					,st.CustomerState AS CustomerState
					,st.CustomerZIP AS CustomerZipCode
					,st.Email AS CustomerEmailAddress
					,st.SMSOptIn
					,NULL AS DealNumber
					,'-1' AS EmailID
					,ent.EntityKey
					,st.LocationName as StoreName
					,st.GeneralManagerName
					,st.GeneralMangerID AS GeneralManagerEmailAddress
					,CASE WHEN st.ExtendedService = 1 THEN 'YES' ELSE 'NO' END AS HasVehicleServiceContract
					,st.LoyaltySpecialistName
					,st.LoyaltySpecialistID AS LoyaltySpecialistEmailAddress
					,CASE WHEN st.PurchaseType = '0' THEN 'Cash'
						WHEN st.PurchaseType = '1' THEN 'Finance'
						WHEN st.PurchaseType = '2' THEN 'Lease'
						ELSE 'Unknown' END AS PurchaseType
					,st.ExperienceGuideName
					,st.ExperienceGuideID AS ExperienceGuideEmailAddress
					,st.SurveyID
					,st.StockNumber
					,st.Brand AS VehicleMake
					,st.VehicleModel
					,st.ModelYear AS VehicleYear
					,vsd.DateKey AS VisitDateKey
					,'1' AS IsSent
					--,st.DeliveryDate
					,st.Delivered AS SentDate
					,st.Completed
					,st.DeliverySpecialistName
					,st.DeliverySpecialistID AS DeliverySpecialistEmail
					,CASE WHEN LTRIM(RTRIM(st.IsOnlineSale)) = '1' THEN 1 ELSE 0 END AS [IsOnlineSales]
					,st.Meta_SourceSystemName
					,st.Meta_Src_Sys_ID
			FROM [ETL_Staging].[stage].[IBEXSurveyResponseAudit] st
			LEFT JOIN Sonic_DW.dbo.dim_entity ent
				ON LTRIM(RTRIM(st.LocationCode)) = CONVERT(VARCHAR,ent.EntityKey)
			--LEFT JOIN	(
			--				SELECT 	CustomerKey
			--						,DMSCustomerKey
			--						,CustomerFirstName
			--						,CustomerLastName
			--						,Email1
			--						,Email2
			--						,Meta_LoadDate
			--						,Meta_RowLastChangeDate
			--						,ROW_NUMBER() OVER(PARTITION BY CustomerFirstName, CustomerLastName, Email1, Email2 ORDER BY Meta_RowLastChangeDate DESC, Meta_LoadDate DESC, CustomerKey DESC) AS rn
			--				FROM Sonic_DW.dbo.DimCustomer
			--			) cs
			--	ON LTRIM(RTRIM(st.FirstName)) = LTRIM(RTRIM(cs.CustomerFirstName))
			--	AND  LTRIM(RTRIM(st.LastName)) = LTRIM(RTRIM(cs.CustomerLastName))
			--	AND (LTRIM(RTRIM(st.Email)) = LTRIM(RTRIM(cs.Email1)) OR LTRIM(RTRIM(st.Email)) = LTRIM(RTRIM(cs.Email2)))
			--	AND cs.rn = 1
			LEFT JOIN Sonic_DW.dbo.Dim_Date vsd
				ON CONVERT(DATE, st.VisitDate) = vsd.FullDate
		)  SRC
	ON
		TGT.SurveyAuditKey = LTRIM(RTRIM(SRC.SurveyID))
		--AND TGT.CustomerKeyDMS = SRC.CustomerKeyDMS
		--AND TGT.EntityKey = SRC.EntityKey
		--AND TGT.SurveyID = SRC.SurveyID
		--AND TGT.VisitDateKey = SRC.VisitDateKey
		--AND TGT.StockNumber = SRC.StockNumber
		--AND LTRIM(RTRIM(TGT.CustomerFirstName)) = LTRIM(RTRIM(SRC.CustomerFirstName))
		--AND LTRIM(RTRIM(TGT.CustomerLastName)) = LTRIM(RTRIM(SRC.CustomerLastName))
		--AND LTRIM(RTRIM(TGT.CustomerPhoneNumber)) = LTRIM(RTRIM(SRC.CustomerPhoneNumber))
		--AND LTRIM(RTRIM(TGT.CustomerEmailAddress)) = LTRIM(RTRIM(SRC.CustomerEmailAddress))

WHEN MATCHED
--AND TGT.Meta_SourceSystemName <> 'IBEX'
THEN

UPDATE SET
	 TGT.SurveyStatus = 'Completed'
	,TGT.DeliverySpecialistName = SRC.DeliverySpecialistName
	,TGT.DeliverySpecialistEmail = SRC.DeliverySpecialistEmail
	,TGT.IsOnlineSales = SRC.IsOnlineSales
	,TGT.Meta_SourceSystemName = 'IBEX'
	,TGT.Meta_Src_Sys_ID = 73
	,TGT.ModifiedBy = SYSTEM_USER
	,TGT.ModifiedDate = GETDATE()


--WHEN NOT MATCHED THEN INSERT
--(
--       [ReportingSourceKey]
--      ,[BuyerType]
--      ,[CampaignID]
--      ,[Comments]
--      ,[CustomerKey]
--      ,[CustomerKeyDMS]
--      ,[CustomerFirstName]
--      ,[CustomerLastName]
--      ,[CustomerPhoneNumber]
--      ,[CustomerStreetAddress]
--      ,[CustomerCity]
--      ,[CustomerState]
--      ,[CustomerZipCode]
--      ,[CustomerEmailAddress]
--      ,[DealNumber]
--      ,[EmailID]
--      ,[EntityKey]
--      ,[GeneralManagerEmailAddress]
--      ,[GeneralManagerName]
--      ,[HasVehicleServiceContract]
--      ,[LoyaltySpecialistEmailAddress]
--      ,[LoyaltySpecialistName]
--      ,[PurchaseType]
--      ,[ExperienceGuideEmailAddress]
--      ,[ExperienceGuideName]
--      ,[SurveyID]
--      ,[SurveyStatus]
--      ,[StoreName]
--      ,[StockNumber]
--      ,[VehicleMake]
--      ,[VehicleModel]
--      ,[VehicleYear]
--      ,[VisitDateKey]
--      ,[IsSent]
--      ,[SentDate]
--      ,[CreatedBy]
--      ,[CreatedDate]
--      ,[ModifiedBy]
--      ,[ModifiedDate]
--      ,[DeliverySpecialistName]
--      ,[DeliverySpecialistEmail]
--      ,[IsOnlineSales]
--      ,[ETLExecutionID]
--	,Meta_SourceSystemName
--	,Meta_Src_Sys_ID
--)

--VALUES
--(
--       SRC.[ReportingSourceKey]
--      ,SRC.[BuyerType]
--      ,SRC.[CampaignID]
--      ,SRC.[Comments]
--      ,SRC.[CustomerKey]
--      ,SRC.[CustomerKeyDMS]
--      ,SRC.[CustomerFirstName]
--      ,SRC.[CustomerLastName]
--      ,SRC.[CustomerPhoneNumber]
--      ,SRC.[CustomerStreetAddress]
--      ,SRC.[CustomerCity]
--      ,SRC.[CustomerState]
--      ,SRC.[CustomerZipCode]
--      ,SRC.[CustomerEmailAddress]
--      ,SRC.[DealNumber]
--      ,SRC.[EmailID]
--      ,SRC.[EntityKey]
--      ,SRC.[GeneralManagerEmailAddress]
--      ,SRC.[GeneralManagerName]
--      ,SRC.[HasVehicleServiceContract]
--      ,SRC.[LoyaltySpecialistEmailAddress]
--      ,SRC.[LoyaltySpecialistName]
--      ,SRC.[PurchaseType]
--      ,SRC.[ExperienceGuideEmailAddress]
--      ,SRC.[ExperienceGuideName]
--      ,SRC.[SurveyID]
--      ,'Completed'
--      ,SRC.[StoreName]
--      ,SRC.[StockNumber]
--      ,SRC.[VehicleMake]
--      ,SRC.[VehicleModel]
--      ,SRC.[VehicleYear]
--      ,SRC.[VisitDateKey]
--      ,SRC.[IsSent]
--      ,SRC.[SentDate]
--      ,SYSTEM_USER
--      ,GETDATE()
--      ,SYSTEM_USER
--      ,GETDATE()
--      ,SRC.[DeliverySpecialistName]
--      ,SRC.[DeliverySpecialistEmail]
--      ,SRC.[IsOnlineSales]
--      ,NULL
--	,SRC.Meta_SourceSystemName
--	,SRC.Meta_Src_Sys_ID
--)


      ;


END





```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
