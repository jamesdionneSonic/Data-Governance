---
name: usp_FacebookDueForService
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on: []
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql


CREATE   PROCEDURE [dbo].[usp_FacebookDueForService]


/*********************************************************************************************************

Purpose : Get Source data for FB Due for Service customers
		 Customers who pruchased their vehicle at Sonic and have not serviced their vehicle at sonic location for more than 12/15 months to last 60 months of vehicle purchased.
EXEC [dbo].[usp_FacebookDueForService]

Updated By  :  Jaya Charan
Updated On  :  [28/08/2021]
Description :  Updated the Query by changing back track months for luxury and non-luxury brands from 15 and 12 to 12 and 9 respectively


Updated By  :  Jaya Charan
Updated On  :  [15/09/2021]
Description :  Change to send audience once in every month

Updated By  :  Jaya Charan
Updated On  :  [23/02/2022]
Description :  Removed Chevrolert and Ford under 9 months bracket so as to be picked for 12 months

Updated By  :  Keerthi K
Updated On  :  [29/04/2022]
Description :  Getting 3 new columns(PhoneNumber, ZipCode, City) With the existing columns
*******************************************************************************************************/
AS
     BEGIN

         WITH NonServiceCustomers
              AS (
              SELECT DISTINCT
                     FF.DMSCustomerKey,
                     DC.DMSCstNameFirst,
                     DC.DMSCstNameLast,
                     COALESCE(DC.DMSCstEmailAddress1, DMSCstEmailAddress2) AS CustomerEmailAddress
					  /*NEW SELECT FOR PHONE NO, ZIP CODE AND CITY --Added on 29/04/2022*/
			,CONCAT(1,COALESCE(DC.DMSCstHomePhone, DC.DMSCstCellPhone, DC.DMSCstBusinessPhone)) AS PhoneNumber
			,DC.DMSCstAddressZipCode as ZipCode
			,DC.DMSCstAddressCity as City,
                     FF.EntityKey,
                     COALESCE(DELux.EntDealerLvl1, DENonLux.EntDealerlvl1) AS EntDealerLvl1,
                     FS.LastServiceDateKey,
                     'DueForService' AS AudienceType



             FROM Sonic_DW.dbo.Dim_Vehicle(nolock) AS DV
                   INNER JOIN Sonic_DW.dbo.FactFire(nolock) AS FF ON DV.VehicleKey = FF.VehicleKey
                   INNER JOIN Sonic_DW.dbo.Dim_DMSCustomer(nolock) AS DC ON DC.DMSCustomerKey = FF.DMSCustomerKey
                   LEFT JOIN Sonic_DW.dbo.Fact_Service(nolock) AS FS ON FF.EntityKey = FS.EntityKey
                                                                        AND FF.DMSCustomerKey = FS.DMSCustomerKey
                                                                        AND FF.VehicleKey = FS.VehicleKey
                   LEFT JOIN Sonic_DW.dbo.Dim_Entity(nolock) AS DELux ON DELux.EntityKey = FF.EntityKey
                                                                         AND DELux.EntBrand NOT IN( 'Honda', 'Hyundai', 'Kia', 'Mini', 'Nissan', 'Subaru', 'Toyota', 'VW' )
                   LEFT JOIN Sonic_DW.dbo.Dim_Entity(nolock) AS DENonLux ON DENonLux.EntityKey = FF.EntityKey
                                                                            AND DENonLux.EntBrand IN('Honda', 'Hyundai', 'Kia', 'Mini', 'Nissan', 'Subaru', 'Toyota', 'VW')
              WHERE(CAST(CAST(ISNULL(FS.LastServiceDateKey, 19000101) AS VARCHAR(10)) AS DATE) < (CASE
                                                                                                      WHEN DELux.EntityKey IS NOT NULL
                                                                                                      THEN DATEADD(Month, -12, CAST(CAST(FF.AccountingDateKey AS VARCHAR(10)) AS DATE))
                                                                                                      WHEN DENonLux.EntityKey IS NOT NULL
                                                                                                      THEN DATEADD(Month, -9, CAST(CAST(FF.AccountingDateKey AS VARCHAR(10)) AS DATE))
                                                                                                      ELSE DATEADD(Month, -12, GETDATE())
                                                                                                  END) -- vehicle serviced earlier than 9/12 months
                    AND CAST(CAST(FF.AccountingDateKey AS VARCHAR(10)) AS DATE) >= DATEADD(Month, -60, GETDATE())) -- purchase date capped at 60 months
                   AND FF.fiwipstatuscode IN('F') -- vehicle purchased
AND FF.DMSCustomerKey != -1
AND (DC.DMSCstNameFirst IS NOT NULL
     OR DC.DMSCstNameFirst IS NOT NULL)
		AND  CAST( (RIGHT(FS.LastServiceDateKey,2)) AS INT)= CAST (DATEPART(DD,GETDATE()) AS INT) --Addition condition to resent once everymonth Date:2021/15/09
		AND DATEPART(YYYY,GETDATE()) > CAST (LEFT(FS.LastServiceDateKey,4)   AS INT)

AND COALESCE(DC.DMSCstEmailAddress1, DMSCstEmailAddress2) IS NOT NULL

				    AND COALESCE(DC.DMSCstEmailAddress1, DMSCstEmailAddress2) <> 'Unknown'

------NEW WHERE CONDITION
			AND CONCAT(1,COALESCE(DC.DMSCstHomePhone, DC.DMSCstCellPhone, DC.DMSCstBusinessPhone))  IS NOT NULL
			AND DC.DMSCstAddressZipCode   IS NOT NULL
		    AND DC.DMSCstAddressCity   IS NOT NULL
			AND DC.DMSCstAddressZipCode <> 'Unknown'
		    AND DC.DMSCstAddressCity   <> 'Unknown'  )

 -- find the Customers that Serviced Recently
,RecentCustomers
              AS (
              SELECT DISTINCT
                     FS.DMSCustomerKey,
                     DC.DMSCstNameFirst,
                     DC.DMSCstNameLast,
                     COALESCE(DC.DMSCstEmailAddress1, DMSCstEmailAddress2) AS CustomerEmailAddress
					 /*NEW SELECT FOR PHONE NO, ZIP CODE AND CITY --Added on 29/04/2022*/
			,CONCAT(1,COALESCE(DC.DMSCstHomePhone, DC.DMSCstCellPhone, DC.DMSCstBusinessPhone)) AS PhoneNumber
			,DC.DMSCstAddressZipCode as ZipCode
			,DC.DMSCstAddressCity as City,
                     FS.EntityKey,
                     COALESCE(DELux.EntDealerLvl1, DENonLux.EntDealerlvl1) AS EntDealerLvl1,
                     FS.LastServiceDateKey,
                     'DueForService' AS AudienceType



              FROM Sonic_DW.dbo.Fact_Service(nolock) AS FS
                   INNER JOIN Sonic_DW.dbo.Dim_DMSCustomer(nolock) AS DC ON DC.DMSCustomerKey = FS.DMSCustomerKey
                   INNER JOIN Sonic_DW.dbo.Dim_Vehicle(nolock) AS DV ON DV.VehicleKey = FS.VehicleKey
                   LEFT JOIN Sonic_DW.dbo.Dim_Entity(nolock) AS DELux ON DELux.EntityKey = FS.EntityKey
                                                                         AND DELux.EntBrand NOT IN('Honda', 'Hyundai', 'Kia', 'Mini', 'Nissan', 'Subaru', 'Toyota', 'VW' )
                   LEFT JOIN Sonic_DW.dbo.Dim_Entity(nolock) AS DENonLux ON DENonLux.EntityKey = FS.EntityKey
                                                                            AND DENonLux.EntBrand IN( 'Honda', 'Hyundai', 'Kia', 'Mini', 'Nissan', 'Subaru', 'Toyota', 'VW' )
              WHERE(CAST(CAST(FS.LastServiceDateKey AS VARCHAR(10)) AS DATE) > (CASE
                                                                                    WHEN DELux.EntityKey IS NOT NULL
                                                                                    THEN DATEADD(Month, -12, GETDATE())
                                                                                    WHEN DENonLux.EntityKey IS NOT NULL
                                                                                    THEN DATEADD(Month, -9, GETDATE())
                                                                                    ELSE DATEADD(Month, -12, GETDATE())
                                                                                END)  -- vehicle serviced within last 9/12 months
                    AND CAST(CAST(FS.LastServiceDateKey AS VARCHAR(10)) AS DATE) <= GETDATE())
		AND  CAST( (RIGHT(FS.LastServiceDateKey,2)) AS INT)= CAST (DATEPART(DD,GETDATE()) AS INT) --Addition condition to resent once everymonth Date:2021/08/09
		AND DATEPART(YYYY,GETDATE()) > CAST (LEFT(FS.LastServiceDateKey,4)   AS INT)

                   AND FS.DMSCustomerKey != -1
                   AND (DC.DMSCstNameFirst IS NOT NULL
                        OR DC.DMSCstNameFirst IS NOT NULL)
                   AND COALESCE(DC.DMSCstEmailAddress1, DMSCstEmailAddress2) IS NOT NULL

				    AND COALESCE(DC.DMSCstEmailAddress1, DMSCstEmailAddress2) <> 'Unknown'

	------NEW WHERE CONDITION
			AND CONCAT(1,COALESCE(DC.DMSCstHomePhone, DC.DMSCstCellPhone, DC.DMSCstBusinessPhone))  IS NOT NULL
			AND DC.DMSCstAddressZipCode   IS NOT NULL
		    AND DC.DMSCstAddressCity   IS NOT NULL
			AND DC.DMSCstAddressZipCode <> 'Unknown'
		    AND DC.DMSCstAddressCity   <> 'Unknown' )

 -- exclude recent customers [we don't want to email Customers who recently serviced their vehicle]

              SELECT DISTINCT
			   LC.EntityKey EntityKey,
                     LC.EntDealerLvl1 EntDealerLvl1,
                     cast(cast(LC.LastServiceDateKey as varchar) as smalldatetime) TransactionDate,
                     LC.DMSCustomerKey AS CustomerID,
                     LC.DMSCstNameFirst FirstName,
                     LC.DMSCstNameLast LastName,
                     LC.CustomerEmailAddress Email,
					  /*NEW SELECT FOR PHONE NO, ZIP CODE AND CITY --Added on 29/04/2022*/
					  LC.PhoneNumber
			        ,LC.ZipCode
			       ,LC.City,
                    LC.AudienceType AudienceType,
                     EM.BigIntegerField AS AudienceID

              FROM NonServiceCustomers AS LC
                   LEFT JOIN RecentCustomers AS RC ON LC.DMSCustomerKey = RC.DMSCustomerKey
                   JOIN Sonic_DW.dbo.DimEntityRelationship (nolock) EM ON EM.EntityKey = LC.EntityKey
                   JOIN Sonic_DW.dbo.DimEntityRelationshipType (nolock) ET ON EM.RelationshipTypeGuid = ET.RelationshipTypeGuid
              WHERE ET.RelationshipType = 'FBAudienceDueforService'
                    AND RC.DMSCustomerKey IS NULL;
     END;
--END of Source SP

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
