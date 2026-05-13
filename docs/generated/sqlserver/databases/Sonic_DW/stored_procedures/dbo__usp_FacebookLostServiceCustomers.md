---
name: usp_FacebookLostServiceCustomers
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


CREATE   PROCEDURE [dbo].[usp_FacebookLostServiceCustomers]


/*********************************************************************************************************

Purpose : Get Source data for FB Lost Service customers
EXEC [dbo].[usp_FacebookLostServiceCustomers]

Updated By  :  Jaya Charan
Updated On  :  [28/08/2021]
Description :  Updated the to include Porsche , Jaguar and Land Rover in NonLuxury


Updated By  :  Jaya Charan
Updated On  :  [15/09/2021]
Description :  Change to send audience once in every month

Updated By  :  Jaya Charan
Updated On  :  [23/02/2022]
Description :  Added brand GMC,Cadillac,Chevrolet for 12 months

Updated By  :  Keerthi K
Updated On  :  [29/04/2022]
Description :  Getting 3 new columns(PhoneNumber, ZipCode, City) With the existing columns
*******************************************************************************************************/

AS
     BEGIN


         WITH LostCustomers
              AS (
              SELECT FS.EntityKey,
                     COALESCE(DELux.EntDealerLvl1, DENonLux.EntDealerlvl1) AS EntDealerLvl1,
                     FS.LastServiceDateKey AS TransactionDate,
					   FS.DMSCustomerKey,
                     DC.DMSCstNameFirst,
                -- DC.DMSCstNameLast,
                     COALESCE(DC.DMSCstNameLast, DC.DMSCstBusinessName) AS DMSCstNameLast,
                     COALESCE(DC.DMSCstEmailAddress1, DMSCstEmailAddress2) AS CustomerEmailAddress
					 /*NEW SELECT FOR PHONE NO, ZIP CODE AND CITY --Added on 29/04/2022*/
			,CONCAT(1,COALESCE(DC.DMSCstHomePhone, DC.DMSCstCellPhone, DC.DMSCstBusinessPhone)) AS PhoneNumber
			,DC.DMSCstAddressZipCode as ZipCode
			,DC.DMSCstAddressCity as City,

                     'LostServiceCustomers' AS AudienceType



              FROM Sonic_DW.dbo.Fact_Service ((nolock))AS FS
                   INNER JOIN Sonic_DW.dbo.Dim_DMSCustomer (nolock) AS DC ON DC.DMSCustomerKey = FS.DMSCustomerKey
                   INNER JOIN Sonic_DW.dbo.Dim_Vehicle (nolock) AS DV ON DV.VehicleKey = FS.VehicleKey
                   LEFT JOIN Sonic_DW.dbo.Dim_Entity (nolock) AS DELux ON DELux.EntityKey = FS.EntityKey
                                                                 AND DELux.EntBrand NOT IN('Chevrolet', 'Ford', 'Honda', 'Hyundai', 'Kia', 'Mini', 'Nissan', 'Subaru', 'Toyota', 'VW','Porsche','Jaguar','Land Rover', 'GMC','Cadillac')
                   LEFT JOIN Sonic_DW.dbo.Dim_Entity (nolock) AS DENonLux ON DENonLux.EntityKey = FS.EntityKey
                                                                    AND DENonLux.EntBrand IN('Chevrolet', 'Ford', 'Honda', 'Hyundai', 'Kia', 'Mini', 'Nissan', 'Subaru', 'Toyota', 'VW','Porsche','Jaguar','Land Rover', 'GMC','Cadillac')
              WHERE(CAST(CAST(FS.LastServiceDateKey AS VARCHAR(10)) AS DATE) < (CASE
                                                                                    WHEN DELux.EntityKey IS NOT NULL
                                                                                    THEN DATEADD(Month, -15, GETDATE())
                                                                                    WHEN DENonLux.EntityKey IS NOT NULL
                                                                                    THEN DATEADD(Month, -12, GETDATE())
                                                                                    ELSE DATEADD(Month, -15, GETDATE())
                                                                                END)
                    AND CAST(CAST(FS.LastServiceDateKey AS VARCHAR(10)) AS DATE) >= DATEADD(Month, -60, GETDATE()))
                   AND FS.DMSCustomerKey != -1

		AND  CAST( (RIGHT(FS.LastServiceDateKey,2)) AS INT)= CAST (DATEPART(DD,GETDATE()) AS INT) --Addition condition to resent once everymonthDate:2021/15/09
		AND DATEPART(YYYY,GETDATE()) > CAST (LEFT(FS.LastServiceDateKey,4)   AS INT)

                   AND COALESCE(DC.DMSCstEmailAddress1, DMSCstEmailAddress2) IS NOT NULL

		------NEW WHERE CONDITION
			AND CONCAT(1,COALESCE(DC.DMSCstHomePhone, DC.DMSCstCellPhone, DC.DMSCstBusinessPhone))  IS NOT NULL
			AND DC.DMSCstAddressZipCode   IS NOT NULL
		    AND DC.DMSCstAddressCity   IS NOT NULL
			AND DC.DMSCstAddressZipCode <> 'Unknown'
		    AND DC.DMSCstAddressCity   <> 'Unknown'  )

 -- find the Customers that Serviced Recently
     ,RecentCustomers
              AS (
              SELECT FS.EntityKey,
                     COALESCE(DELux.EntDealerLvl1, DENonLux.EntDealerlvl1) AS EntDealerLvl1,
                     FS.LastServiceDateKey AS TransactionDate,
			  FS.DMSCustomerKey,
                     DC.DMSCstNameFirst,
                 ---DC.DMSCstNameLast,
                     COALESCE(DC.DMSCstNameLast, DC.DMSCstBusinessName) AS DMSCstNameLast,
                     COALESCE(DC.DMSCstEmailAddress1, DMSCstEmailAddress2) AS CustomerEmailAddress

		/*NEW SELECT FOR PHONE NO, ZIP CODE AND CITY --Added on 29/04/2022*/
			,CONCAT(1,COALESCE(DC.DMSCstHomePhone, DC.DMSCstCellPhone, DC.DMSCstBusinessPhone)) AS PhoneNumber
			,DC.DMSCstAddressZipCode as ZipCode
			,DC.DMSCstAddressCity as City,

                     'LostServiceCustomers' AS AudienceType


              FROM Sonic_DW.dbo.Fact_Service (nolock) AS FS
                   INNER JOIN Sonic_DW.dbo.Dim_DMSCustomer (nolock) AS DC ON DC.DMSCustomerKey = FS.DMSCustomerKey
                   INNER JOIN Sonic_DW.dbo.Dim_Vehicle (nolock) AS DV ON DV.VehicleKey = FS.VehicleKey
                   LEFT JOIN Sonic_DW.dbo.Dim_Entity (nolock) AS DELux ON DELux.EntityKey = FS.EntityKey
                                                                 AND DELux.EntBrand NOT IN('Chevrolet', 'Ford', 'Honda', 'Hyundai', 'Kia', 'Mini', 'Nissan', 'Subaru', 'Toyota', 'VW','Porsche','Jaguar','Land Rover', 'GMC','Cadillac')
                   LEFT JOIN Sonic_DW.dbo.Dim_Entity (nolock) AS DENonLux ON DENonLux.EntityKey = FS.EntityKey
                                                                    AND DENonLux.EntBrand IN('Chevrolet', 'Ford', 'Honda', 'Hyundai', 'Kia', 'Mini', 'Nissan', 'Subaru', 'Toyota', 'VW','Porsche','Jaguar','Land Rover', 'GMC','Cadillac')
              WHERE(CAST(CAST(FS.LastServiceDateKey AS VARCHAR(10)) AS DATE) > (CASE
                                                                                    WHEN DELux.EntityKey IS NOT NULL
                                                                                    THEN DATEADD(Month, -15, GETDATE())
                                                                                    WHEN DENonLux.EntityKey IS NOT NULL
                                                                                    THEN DATEADD(Month, -12, GETDATE())
                                                                                    ELSE DATEADD(Month, -15, GETDATE())
                                                                                END)
                    AND CAST(CAST(FS.LastServiceDateKey AS VARCHAR(10)) AS DATE) <= GETDATE())
                   AND FS.DMSCustomerKey != -1

		AND  CAST( (RIGHT(FS.LastServiceDateKey,2)) AS INT)= CAST (DATEPART(DD,GETDATE()) AS INT) --Addition condition to resent once everymonth Date:2021/08/09
		AND DATEPART(YYYY,GETDATE()) > CAST (LEFT(FS.LastServiceDateKey,4)   AS INT)

                   AND COALESCE(DC.DMSCstEmailAddress1, DMSCstEmailAddress2) IS NOT NULL
				    ------NEW WHERE CONDITION
			AND CONCAT(1,COALESCE(DC.DMSCstHomePhone, DC.DMSCstCellPhone, DC.DMSCstBusinessPhone))  IS NOT NULL
			AND DC.DMSCstAddressZipCode   IS NOT NULL
		    AND DC.DMSCstAddressCity   IS NOT NULL
			AND DC.DMSCstAddressZipCode <> 'Unknown'
		    AND DC.DMSCstAddressCity   <> 'Unknown'
                   AND FS.ServiceType <> 'INT')


 -- exclude recent customers

              SELECT
			   LC.EntityKey,
                     LC.EntDealerLvl1,
                     cast(cast(MAX(LC.TransactionDate) as varchar) as  smalldatetime) AS TransactionDate,
			   LC.DMSCustomerKey,
                     LC.DMSCstNameFirst,
                     LC.DMSCstNameLast,
                     LC.CustomerEmailAddress
 /*NEW SELECT FOR PHONE NO, ZIP CODE AND CITY --Added on 29/04/2022*/
		        	, LC.PhoneNumber
			        ,LC.ZipCode
			       ,LC.City ,
                     LC.AudienceType,
                     EM.BigIntegerField AS AudienceID

              FROM LostCustomers AS LC
                   LEFT JOIN RecentCustomers AS RC ON LC.DMSCustomerKey = RC.DMSCustomerKey
                   JOIN Sonic_DW.dbo.DimEntityRelationship (nolock) EM ON EM.EntityKey = LC.EntityKey
                   JOIN Sonic_DW.dbo.DimEntityRelationshipType (nolock) ET ON EM.RelationshipTypeGuid = ET.RelationshipTypeGuid
              WHERE ET.RelationshipType = 'FBAudienceLostCustomers'
                    AND RC.DMSCustomerKey IS NULL
              GROUP BY LC.DMSCustomerKey,
                       LC.DMSCstNameFirst,
                       LC.DMSCstNameLast,
                       LC.CustomerEmailAddress,
LC.PhoneNumber
			        ,LC.ZipCode
			       ,LC.City,
                       LC.EntityKey,
                       LC.EntDealerLvl1,
                       LC.AudienceType,
                       EM.BigIntegerField;
     END;
--END of Source SP

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
