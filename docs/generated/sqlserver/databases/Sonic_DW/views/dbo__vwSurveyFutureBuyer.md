---
name: vwSurveyFutureBuyer
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


CREATE view [dbo].[vwSurveyFutureBuyer] as


With emp as (
select distinct ee.EmployeeKey, a.asolastname + ', '+ asofirstname as EGName, asoworkemailaddress -- ISNULL(ee.WorkEmailAddress,ee.WorkEmailAddress2) AS ExperienceGuideEmailAddress
            --  , ee.EmployeeFullName AS ExperienceGuideName
from  DimEmployee ee
-- LEFT JOIN  emp ON a.OwnedByKey = emp.EmployeeKey
join dimassociate a
on a.asolastname + ', '+ a.asofirstname = ee.EmployeeFullName
and a.asojobcode = 'EPGECONS'
and a.meta_rowiscurrent = 'Y'
and a.AsoEmployeeStatus = 'Active'
)

SELECT distinct
              srvy.ReportingSourceKey
              , srvy.BuyerType
              , srvy.CampaignID
              , null as comments
              , ISNULL(cus.CustomerKey,-1) AS CustomerKey
              , -1 AS CustomerKeyDMS
              , cus.CustomerFirstName AS CustomerFirstName
              , cus.CustomerLastName AS CustomerLastName
              , ISNULL(cus.Phone1, cus.Phone2) AS CustomerPhoneNumber
              , CASE WHEN cus.AddressLine2 IS NULL THEN cus.addressLine1
                           ELSE LTRIM(RTRIM(cus.AddressLine1)) + ' ' + LTRIM(RTRIM(cus.AddressLine2)) END AS CustomerStreetAddress
              , cus.AddressCity AS CustomerCity
              , cus.AddressState AS CustomerState
              , cus.AddressZipCode AS CustomerZipCode
              , ISNULL(cus.email1, cus.email2) AS CustomerEmailAddress
              , '-1' AS DealNumber
              , srvy.EmailID
              , opt.EntityKey
              , GM.GeneralManagerEmailAddress as gm
              , GM.GeneralManagerName as gmn
              , 0 as [HasVehicleServiceContract]
              , srvy.AssociateEmailAddress --LoyaltySpecEmail
              , srvy.AssociateName --LoyaltySpecName
              , 'NA' AS PurchaseType
			  ,emp.asoworkemailaddress AS ExperienceGuideEmailAddress
              --, ISNULL(emp.WorkEmailAddress,emp.WorkEmailAddress2) AS ExperienceGuideEmailAddress
			  ,emp.EGName AS ExperienceGuideName
              --, emp.EmployeeFullName AS ExperienceGuideName
              , srvy.SurveyID
              , 'Pulled in ETL' SurveyStatus
              , opt.EntDealerLvl1 as StoreName
              , null as stock
              , veh.VehMakeDesc AS VehicleMake
              , veh.vehmodelcategory AS VehicleModel
              , veh.vehmodelyear AS VehicleYear
              , opt.LastActivityDateKey AS VisitDateKey
              , convert(varchar(50),SYSTEM_USER) AS CreatedBy
              , SYSDATETIME() AS CreatedDate
FROM   ( --Updated to process by Max ActualStartDateKey DRM 20200730
                     SELECT opt.FocusCustomerKey
                                  , opt.EntityKey
                                  , de.EntDealerLvl1
                                  , max(act.ActualStartDateKey) as LastActivityDateKey
                                  , max(act.Meta_Naturalkey) as LastActivityMeta_Naturalkey
                     FROM   FactOpportunity AS opt
                                  INNER JOIN FactActivity AS act ON opt.FactOpportunityKey = act.FactOpportunityKey
                                  INNER JOIN DimActivityType typ ON act.ActivityTypeKey = typ.ActivityTypeKey
                                  INNER JOIN DimActivityStatus AS stat ON act.ActivityStatusKey = stat.ActivityStatusKey
                                  INNER JOIN (
                                         SELECT rel.EntityKey, EntDealerLvl1, CAST(CONVERT(CHAR(8), rel.StartDate, 112) AS int) AS StartDate
                                         FROM   DimEntityRelationshipType AS typ
                                                       INNER JOIN DimEntityRelationship AS rel ON typ.RelationshipTypeGuid = rel.RelationshipTypeGuid
                                                       INNER JOIN Dim_Entity AS de ON rel.EntityKey = de.EntityKey
                                         WHERE  typ.RelationshipType = 'SurveyGizmoStores'
                                                       AND rel.IsActive = 1
                                         ) as de
                                         ON opt.EntityKey = de.EntityKey
                     WHERE  opt.LeadState = 'Active'   -- opportunity still active
                                  AND act.ActivityTypeKey in (12,13,25,50,26,27,3,7,40,8,5,44,45,6,46,48) --- showroom visits     --Updated DRM 20200730
                                  AND act.ActualStartDateKey >= cast(convert(char(8), dateadd(dd, -31, getdate()), 112) as int)
                                  AND stat.ActivityStatusdesc = 'Completed'       -- visit completed
                                  AND ActualStartDateKey >= de.StartDate
                     GROUP BY opt.FocusCustomerKey, opt.EntityKey, de.EntDealerLvl1
                     Having max(act.ActualStartDateKey) between cast(convert(char(8), dateadd(dd, -31, getdate()), 112) as int)
                                                                                  AND cast(convert(char(8), dateadd(dd, -5, getdate()), 112) as int) -- Updated DRM 20200730
                     ) as opt
              JOIN FactOpportunity o
              ON o.FocusCustomerKey = opt.FocusCustomerKey --Added DRM 20200730
              JOIN FactActivity a
              on a.Meta_NaturalKey = opt.LastActivityMeta_Naturalkey
              and a.FactOpportunityKey = o.FactOpportunityKey --Added DRM 20200730
              join dimactivitytype dat on a.activitytypekey = dat.activitytypekey
              LEFT JOIN DimCustomer AS cus ON opt.FocusCustomerKey = cus.CustomerKey
              INNER JOIN Dim_Vehicle AS veh ON o.VehicleKey = veh.VehicleKey
              LEFT JOIN  emp ON a.OwnedByKey = emp.EmployeeKey -- LEFT JOIN DimEmployee AS emp ON a.OwnedByKey = emp.EmployeeKey


              INNER JOIN (  /* currently active survey gizmo campaign/surveys by entity key for Future Buyers */
                           SELECT src.ReportingSourceKey, src.SourceDescription AS BuyerType
                                         , srv.EntityKey, srv.SurveyID, srv.campaignid, srv.emailid
                                         , ass.AssociateEmailAddress, LTRIM(RTRIM(ass.associatelastName)) + ', ' + LTRIM(RTRIM(ass.associateFirstName)) as AssociateName
                           FROM   DimReportingSource AS src
                                         INNER JOIN DimSurvey AS srv ON src.ReportingSourceKey = srv.ReportingSourceKey
                                         LEFT JOIN DimSurveyAssociate AS ass      ON srv.EntityKey = ass.EntityKey AND ass.IsActive = 1
                           WHERE  src.Meta_NaturalKey = '59*Future Buyer'
                                         AND srv.IsActive = 1
                           ) AS srvy
                     ON opt.EntityKey = srvy.EntityKey
--Find GMs
       LEFT JOIN (

       select distinct e.entitykey, LTRIM(RTRIM(a.AsoLastName)) + ', ' + LTRIM(RTRIM(a.AsoFirstName)) as GeneralManagerName
            , AsoWorkEmailAddress as GeneralManagerEmailAddress
       from    sonic_dw.dbo.dimassociate a
            join sonic_dw.dbo.dim_entity e on a.asolocation = e.entadpcompanyid
            --JOIN DimSurveyAudit AS aud ON e.EntityKey = aud.EntityKey
       where  AsoJobCode in ('ADGM','EPGM','DSGSMGR')
            and Meta_RowIsCurrent = 'Y'
            and AsoEmployeeStatus = 'Active'
            and e.EntDefaultDlrshpLvl1 = 1
            and e.entactive = 'Active'
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
     --  select entitykey,gmname,gmemailaddress from Sonic_DW.[dbo].[SurveyGizmoGM]

              ) as GM
                     on gm.entitykey = opt.entitykey
WHERE  veh.VehModelYear >0 ;

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
