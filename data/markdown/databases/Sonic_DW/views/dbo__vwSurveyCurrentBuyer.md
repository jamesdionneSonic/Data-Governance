---
name: vwSurveyCurrentBuyer
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on:
  - Dim_DMSCustomer
  - Dim_DMSEmployee
  - Dim_Entity
  - dim_FIGLAccounts
  - DimAssociate
  - DimEntityRelationship
  - DimEntityRelationshipType
  - DimReportingSource
  - DimSurvey
  - DimSurveyAssociate
  - factFIRE
  - vwDimVehicle
dependency_count: 12
column_count: 38
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.Dim_DMSCustomer** (U )
- **dbo.Dim_DMSEmployee** (U )
- **dbo.Dim_Entity** (U )
- **dbo.dim_FIGLAccounts** (U )
- **dbo.DimAssociate** (U )
- **dbo.DimEntityRelationship** (U )
- **dbo.DimEntityRelationshipType** (U )
- **dbo.DimReportingSource** (U )
- **dbo.DimSurvey** (U )
- **dbo.DimSurveyAssociate** (U )
- **dbo.factFIRE** (U )
- **dbo.vwDimVehicle** (V )

## Columns

| Name                        | Type      | Nullable | Description |
| --------------------------- | --------- | -------- | ----------- |
| `ReportingSourceKey`        | int       |          |             |
| `BuyerType`                 | varchar   | ✓        |             |
| `CampaignID`                | varchar   |          |             |
| `comments`                  | int       | ✓        |             |
| `CustomerKey`               | int       |          |             |
| `CustomerKeyDMS`            | int       | ✓        |             |
| `CustomerFirstName`         | varchar   | ✓        |             |
| `CustomerLastName`          | varchar   | ✓        |             |
| `CustomerPhoneNumber`       | varchar   | ✓        |             |
| `CustomerStreetAddress`     | varchar   | ✓        |             |
| `CustomerCity`              | varchar   | ✓        |             |
| `CustomerState`             | varchar   | ✓        |             |
| `CustomerZipCode`           | varchar   | ✓        |             |
| `CustomerEmailAddress`      | varchar   | ✓        |             |
| `DealNumber`                | varchar   | ✓        |             |
| `EmailID`                   | varchar   |          |             |
| `EntityKey`                 | int       | ✓        |             |
| `gm`                        | varchar   | ✓        |             |
| `gmn`                       | varchar   | ✓        |             |
| `HasVehicleServiceContract` | varchar   |          |             |
| `AssociateEmailAddress`     | varchar   | ✓        |             |
| `AssociateName`             | varchar   | ✓        |             |
| `PurchaseType`              | varchar   | ✓        |             |
| `ExperienceGuideEmail`      | varchar   | ✓        |             |
| `ExperienceGuideName`       | varchar   | ✓        |             |
| `SurveyID`                  | varchar   |          |             |
| `SurveyStatus`              | varchar   |          |             |
| `EntDealerLvl1`             | varchar   | ✓        |             |
| `StockNumber`               | varchar   |          |             |
| `VehicleMake`               | varchar   | ✓        |             |
| `VehicleModel`              | varchar   | ✓        |             |
| `VehicleYear`               | int       | ✓        |             |
| `VisitDateKey`              | int       | ✓        |             |
| `CreatedBy`                 | varchar   | ✓        |             |
| `CreatedDate`               | datetime2 |          |             |
| `DeliverySpecialistEmail`   | varchar   | ✓        |             |
| `DeliverySpecialistName`    | varchar   | ✓        |             |
| `IsOnlineSales`             | varchar   |          |             |

## Definition

```sql




CREATE view [dbo].[vwSurveyCurrentBuyer] as
SELECT	distinct
        srvy.ReportingSourceKey
        , srvy.BuyerType
        , srvy.CampaignID
		, null as comments
        , -1 as CustomerKey
        , ff.DMSCustomerKey AS CustomerKeyDMS
        , cus.DMSCstNameFirst AS CustomerFirstName
        , cus.DMSCstNameLast AS CustomerLastName
        , COALESCE(cus.DMSCstHomePhone, cus.DMSCstCellPhone, cus.DMSCstBusinessPhone) AS CustomerPhoneNumber
        , CASE WHEN cus.DMSCstAddressLine2 IS NULL THEN LTRIM(RTRIM(cus.DMSCstAddressLine1))
               ELSE LTRIM(RTRIM(cus.DMSCstAddressLine1)) + ' ' + LTRIM(RTRIM(cus.DMSCstAddressLine2)) END AS CustomerStreetAddress
        , cus.DMSCstAddressCity AS CustomerCity
        , cus.DMSCstAddressState AS CustomerState
        , cus.DMSCstAddressZipCode AS CustomerZipCode
        , COALESCE(cus.DMSCstEmailAddress1, cus.dmscstemailaddress2, cus.DMSCstEmailAddressOther) AS CustomerEmailAddress
        , ff.dealno AS DealNumber
        , srvy.EmailID
		, ff.EntityKey
		,gm.GeneralManagerEmailAddress as gm
		,gm.GeneralManagerName  as gmn
		, CASE WHEN con.DMSCustomerKey IS NOT NULL THEN 'YES' ELSE 'NO' END as HasVehicleServiceContract
		, srvy.AssociateEmailAddress
        , srvy.AssociateName
        , replace(ff.PurchaseType, '(Buy)', '') AS PurchaseType
		, emp.AsoWorkEmailAddress AS ExperienceGuideEmail
        , emp.EmployeeName AS ExperienceGuideName
	--	,emp.custno --I added for testing...  DM
	--	,ff.salesperson1key
        , srvy.SurveyID
		, 'Pulled in ETL' as SurveyStatus
        , ff.EntDealerLvl1
		, ff.StockNo AS StockNumber
        , vwv.MakeDescription AS VehicleMake
        , vwv.ModelDescription AS VehicleModel
        , vwv.ModelYear AS VehicleYear
        , ff.AccountingDateKey AS VisitDateKey
        , convert(varchar(50),SYSTEM_USER) AS CreatedBy
        , SYSDATETIME() AS CreatedDate
		,ds.ASOWorkEmailAddress as [DeliverySpecialistEmail]
      ,ds.EmployeeName as [DeliverySpecialistName]
      , case when dc.entitykey is null then '0' else '1' end as [IsOnlineSales]
FROM   (
			SELECT ff.EntityKey, ff.dealno, ff.AccountingDateKey, ISNULL(ff.StockNo,'Unknown') as StockNo
				 , ff.DMSCustomerKey, ff.VehicleKey, ff.PurchaseType, ff.SalesPerson1Key, de.EntDealerLvl1,ff.fimgrkey
	        FROM   dbo.factFIRE AS ff
		           INNER JOIN dbo.dim_FIGLAccounts fi ON ff.FIGLProductKey = fi.FIGLProductKey
			       INNER JOIN (
				              SELECT	rel.EntityKey, EntDealerLvl1, CAST(CONVERT(CHAR(8), rel.StartDate, 112) AS int) AS StartDate
					          FROM      DimEntityRelationshipType AS typ
						                INNER JOIN DimEntityRelationship AS rel ON typ.RelationshipTypeGuid = rel.RelationshipTypeGuid
							            INNER JOIN Dim_Entity AS de ON rel.EntityKey = de.EntityKey
	                          WHERE		typ.RelationshipType = 'SurveyGizmoStores'
		                                AND rel.IsActive = 1
			                  ) as de ON ff.EntityKey = de.EntityKey

	        WHERE	ff.VSC_RowLastUpdated >= getdate()-60
		            AND ff.fiwipstatuscode in ('F') --finalized deals
			        AND ff.statcount > 0
				    AND ff.IsRetail = 'IsRetail'
					AND ff.DMSCustomerKey > 0
	                AND fi.FIGLProductCategory = 'frontgross'
		            AND fi.FIAccountType = 'S'
			        AND ISNULL(ff.dealno,-1) != -1
				    AND AccountingDateKey >= de.StartDate
					--And ff.entitykey in (580,581,583)
	        GROUP BY ff.EntityKey, ff.dealno, ff.AccountingDateKey, ISNULL(ff.StockNo,'Unknown'), ff.DMSCustomerKey, ff.VehicleKey
		             , ff.PurchaseType, ff.SalesPerson1Key, de.EntDealerLvl1,ff.fimgrkey
				) AS ff
					Left JOIN (
				SELECT	rel.EntityKey, EntDealerLvl1, CAST(CONVERT(CHAR(8), rel.StartDate, 112) AS int) AS StartDate
				FROM      DimEntityRelationshipType AS typ
						INNER JOIN DimEntityRelationship AS rel ON typ.RelationshipTypeGuid = rel.RelationshipTypeGuid
						INNER JOIN Dim_Entity AS de ON rel.EntityKey = de.EntityKey
	            WHERE		typ.RelationshipType = 'SurveyGizmo Delivery Center'
		                AND rel.IsActive = 1
			    ) as dc ON ff.EntityKey = dc.EntityKey
		LEFT JOIN dbo.Dim_DMSCustomer AS cus ON ff.dmsCustomerKey = cus.dmscustomerkey
        INNER JOIN (  /* currently active survey gizmo campaign/surveys by entity key for Current Buyers */
                      SELECT src.ReportingSourceKey, src.SourceDescription AS BuyerType
                           , srv.EntityKey, srv.SurveyID, srv.campaignid, srv.emailid
                           , ass.AssociateEmailAddress, LTRIM(RTRIM(ass.associatelastName)) + ', ' + LTRIM(RTRIM(ass.associateFirstName)) as AssociateName
                      FROM   DimReportingSource AS src
                             INNER JOIN DimSurvey AS srv ON src.ReportingSourceKey = srv.ReportingSourceKey
                             LEFT JOIN DimSurveyAssociate AS ass ON srv.EntityKey = ass.EntityKey AND ass.IsActive = 1
                      WHERE  src.Meta_NaturalKey = '59*Buyer'
                             AND srv.IsActive = 1
                    ) AS srvy ON ff.EntityKey = srvy.EntityKey
         JOIN dbo.DimSurveyAssociate ass ON ff.EntityKey = ass.Entitykey AND ass.IsActive = 1
			--Updated source for vehicle attributes to use new vwDimVehicle instead of Dim_Vehicle.
			----In order to do this we need to join ff.stockno to FactVehicleInventorySIMS to get the vehiclekey.   DRM 20200730
		JOIN dbo.Dim_entity ffe
		on ff.entitykey = ffe.entitykey


		LEFT JOIN SIMS_DW.dbo.FactVehicleInventorySims s
			ON ff.stockno = s.stocknumber
			and s.Meta_RowIsCurrent = 'Y'

		Left join dbo.dim_entity se
		on (se.entitykey = s.currstoreEntitykey)
		--or se.entitykey = s.storeEntityKey)

		and se.entdealerlvl1 = ffe.entdealerlvl1
			---and s.EntityKey = ff.EntityKey
		--	and (s.CurrStoreEntityKey = ff.Entitykey or s.storeEntityKey = ff.entitykey)
			--and s.storeEntityKey = ff.entitykey
			and s.Meta_RowIsCurrent = 'Y' ---- this query gives dups


        Left JOIN dbo.vwDimVehicle vwv on s.vehiclekey = vwv.vehiclekey
					and vwv.IsValidVin = 'Y'
        LEFT JOIN (
                         SELECT DISTINCT   a.AsoWorkEmailAddress, ee.AssociateKey--,ee.EMPNameCode
						, LTRIM(RTRIM(ee.AsoNameLast)) + ', ' + LTRIM(RTRIM(ee.AsoNameFirst)) AS EmployeeName--ee.EMPName1
						,ee.custno
                   FROM   Dim_DMSEmployee ee
                          JOIN dim_entity e ON e.EntCora_Account_ID = ee.cora_acct_id
                         left JOIN DimAssociate a ON a.AsoLocation = e.EntADPCompanyID AND a.AsoTimeClockID = ee.custno
                   WHERE  ee.Meta_RowIsCurrent = 'Y'
                          AND a.Meta_RowIsCurrent = 'Y'
                          AND AsoEmployeeStatus = 'Active'
						  and e.EntDefaultDlrshpLvl1 = 1
						   and a.asolocation = e.entadpcompanyid
			--Add explicitly mapped EG's
					UNION

						Select   a.AsoWorkEmailAddress, ee.AssociateKey--,ee.EMPNameCode
						, LTRIM(RTRIM(ee.AsoNameLast)) + ', ' + LTRIM(RTRIM(ee.AsoNameFirst)) AS EmployeeName--ee.EMPName1
						,ee.custno
                   FROM   Dim_DMSEmployee ee
                          JOIN dim_entity e ON e.EntCora_Account_ID = ee.cora_acct_id
                      	 join sonic_dw.dbo.SurveyGizmoEGMapping egm
						 on ee.custno = egm.CDKTimeClockID

						join DimAssociate a
						 ON egm.FusionTimeClockID = a.AsoTimeClockID
						 and a.asolocation = e.entadpcompanyid

                   WHERE  a.Meta_RowIsCurrent = 'Y'
				   and ee.Meta_RowIsCurrent = 'Y'
				--Add VEGs
				   UNION --added query below for the Virtual Experience guides.  Adding them by jobcode as their companyID is corporate and not location based.  DRM 2/15/2021

					Select  a.AsoWorkEmailAddress, ee.AssociateKey--,ee.cora_acct_id--,a.asolocation,a.asodms4digit,a.asodepartment
						, LTRIM(RTRIM(ee.AsoNameLast)) + ', ' + LTRIM(RTRIM(ee.AsoNameFirst)) AS EmployeeName--ee.EMPName1
						,ee.custno
                   FROM   Dim_DMSEmployee ee
                         JOIN dim_entity e
						 ON e.EntCora_Account_ID = ee.cora_acct_id
                         left JOIN DimAssociate a ON --a.AsoLocation = e.EntADPCompanyID
						  a.AsoTimeClockID = ee.custno
                   WHERE  ee.Meta_RowIsCurrent = 'Y'
                          AND a.Meta_RowIsCurrent = 'Y'
                          AND AsoEmployeeStatus = 'Active'
						  AND ASOJOBCODE = 'EPVEG'


                   ) AS emp ON ff.SalesPerson1Key = emp.AssociateKey

		LEFT JOIN (
		      SELECT DISTINCT a.AsoWorkEmailAddress, ee.AssociateKey--,ee.cora_acct_id--,a.asolocation,a.asodms4digit,a.asodepartment
						, LTRIM(RTRIM(ee.AsoNameLast)) + ', ' + LTRIM(RTRIM(ee.AsoNameFirst)) AS EmployeeName--ee.EMPName1
						,ee.custno
                   FROM   Dim_DMSEmployee ee
                         -- JOIN dim_entity e ON e.EntCora_Account_ID = ee.cora_acct_id
                         left JOIN DimAssociate a ON --a.AsoLocation = e.EntADPCompanyID
						  a.AsoTimeClockID = ee.custno
                   WHERE  ee.Meta_RowIsCurrent = 'Y'
                          AND a.Meta_RowIsCurrent = 'Y'
                          AND AsoEmployeeStatus = 'Active'
						  AND ASOJOBCODE = 'EPDCS'
						--  and ee.cora_acct_id = 18762
		) as ds ON ff.FiMgrkey = ds.AssociateKey

         LEFT JOIN (
                    SELECT ff.EntityKey, ff.dealno, ff.AccountingDateKey, ISNULL(ff.StockNo,'Unknown') as StockNo
                           , ff.DMSCustomerKey, ff.VehicleKey, ff.PurchaseType, ff.SalesPerson1Key,ff.Amount,fi.FIGLProductCategory
                    FROM   dbo.factFIRE AS ff
                           INNER JOIN dbo.dim_FIGLAccounts fi ON ff.FIGLProductKey = fi.FIGLProductKey
                    WHERE  ff.AccountingDateKey >= 20190513 --cast(convert(char(8), dateadd(dd, -3, getdate()), 112) as int)
                           AND ff.VSC_RowLastUpdated >= convert(date,getdate()-31)
						   --Changed to look at data updated just today using VSC_RowlastUpdated date - regardless of accountingdate.
                           AND ff.fiwipstatuscode in ('F') --finalized deals only.   I took out 'B'
                           and ff.IsRetail = 'IsRetail'  --Added to eliminate auction purchases & wholesale deals.
                           AND ff.statcount > 0
                           AND ff.DMSCustomerKey >0    --there should not be any -1's as those will not be able to be contacted anyway.
                           AND fi.FIGLProductCategory = 'Service Contract' --Changed to look for Service Contract product category
                           and fi.FIAccountType = 'S'
                           AND ISNULL(ff.dealno,-1) != -1
					GROUP BY ff.EntityKey, ff.dealno, ff.AccountingDateKey, ISNULL(ff.StockNo,'Unknown'), ff.DMSCustomerKey, ff.VehicleKey,
                                           ff.PurchaseType, ff.SalesPerson1Key,ff.Amount,fi.FIGLProductCategory
			) as con



            ON ff.AccountingDateKey = con.AccountingDateKey
            AND ff.DMSCustomerKey = con.DMSCustomerKey
            AND ff.EntityKey = con.EntityKey
            AND ff.dealno = con.dealno


			Left JOIN (

	select	distinct e.entitykey, LTRIM(RTRIM(a.AsoLastName)) + ', ' + LTRIM(RTRIM(a.AsoFirstName)) as GeneralManagerName
            , AsoWorkEmailAddress as GeneralManagerEmailAddress
	from    sonic_dw.dbo.dimassociate a
           join sonic_dw.dbo.dim_entity e on a.asodms4digit = convert(varchar(3),e.entadpcompanyid) + convert(varchar(1),entaccountingprefix)
			--join sonic_dw.dbo.dim_entity e on a.asolocation = e.entadpcompanyid
            --JOIN DimSurveyAudit AS aud ON e.EntityKey = aud.EntityKey
	where	AsoJobCode in ('ADGM','EPGM','DSGSMGR')
            and Meta_RowIsCurrent = 'Y'
            and AsoEmployeeStatus = 'Active'
            and e.CurrentPrefixFlag = 'Active'
            and e.entactive = 'Active'
			--order by e.entitykey
            --and aud.GeneralManagerName is null
	UNION

		SELECT	rel.EntityKey, AsoLastName + ', '+ asofirstName, asoworkemailaddress
				FROM      DimEntityRelationshipType AS typ
						INNER JOIN DimEntityRelationship AS rel ON typ.RelationshipTypeGuid = rel.RelationshipTypeGuid
						INNER JOIN Dim_Entity AS de ON rel.EntityKey = de.EntityKey
						INNER JOIN DimAssociate a
						on a.asoemployeenumber = rel.integerfield
						Inner Join Dim_Entity e
						on rel.entitykey = e.entitykey
	            WHERE		typ.RelationshipType = 'GMSecondaryAssignment'
				and	 a.meta_rowiscurrent = 'Y'
				and e.entlineofbusiness = 'EchoPark'
				and rel.isactive = 1
			--	and AsoEmployeeStatus = 'Active'
			-- order by rel.entitykey
		--	order by entitykey
	--select entitykey,gmname,gmemailaddress from Sonic_DW.[dbo].[SurveyGizmoGM] order by entitykey

		) as GM
			on gm.entitykey = ff.entitykey

		--	where gm.GeneralManagerEmailAddress is null
		--	order by stocknumber





```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
