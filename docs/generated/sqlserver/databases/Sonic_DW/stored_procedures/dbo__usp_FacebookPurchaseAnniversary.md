---
name: usp_FacebookPurchaseAnniversary
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






CREATE    PROCEDURE [dbo].[usp_FacebookPurchaseAnniversary] --@LastLoadDate DATETIME
AS
     BEGIN
 --Declare @LastLoadDate Datetime = '04/1/2019'

         SELECT ff.entitykey,
                e.EntDealerLvl1,
--,ff.dealno
                cast(cast(accountingdatekey as varchar) as smalldatetime) AS TransactionDate,
                ff.DMSCustomerKey AS CustomerID,
                c.DMSCstNameFirst,
                COALESCE(DMSCstNameLast, c.DMSCstBusinessName) AS DMSCstNameLast,
                COALESCE(DMSCstEmailAddress1, DMSCstEmailAddress2) AS EmailAddress
				/*NEW SELECT FOR PHONE NO, ZIP CODE AND CITY --Added on 29/04/2022*/
			,CONCAT(1,COALESCE(c.DMSCstHomePhone, c.DMSCstCellPhone, c.DMSCstBusinessPhone)) AS PhoneNumber
			,c.DMSCstAddressZipCode as ZipCode
			,c.DMSCstAddressCity as City,

                'PurchaseAnniversary' AS FBAudience,
			 Em.BigIntegerField as AudienceID
--,ff.FIGLProductKey
--,fa.FIGLProductCategory
--,d.fulldate,apr,buyrateapr
--,term,dateadd(mm,term,d.fulldate) as TermDate
--,dateadd(mm,term/2,d.fulldate) as TermDiv2
--,datepart(mm,d.fulldate) as monum
--,datepart(dd,d.fulldate) as daynum
         FROM factfire (nolock)  ff
              JOIN dim_FIGLAccounts (nolock) fa ON fa.FIGLProductKey = ff.FIGLProductKey
              JOIN dim_date  (nolock) d ON d.datekey = ff.accountingdatekey
              JOIN Dim_DMSCustomer  (nolock) c ON ff.DMSCustomerKey = c.DMSCustomerKey
              JOIN dim_entity   (nolock) e ON e.entitykey = ff.entitykey
              JOIN Sonic_DW.dbo.DimEntityRelationship   (nolock) EM ON EM.EntityKey = e.EntityKey
              JOIN Sonic_DW.dbo.DimEntityRelationshipType  (nolock) ET ON EM.RelationshipTypeGuid = ET.RelationshipTypeGuid
         WHERE ET.RelationshipType = 'FBAudiencePurchaseAnniversary'
		AND DATEPART(DD,d.fulldate)= DATEPART(DD,GETDATE())
		AND  DATEPART(MM,d.fulldate)= DATEPART(MM,GETDATE())
		AND   DATEPART(YYYY,GETDATE()) > DATEPART(YYYY,d.fulldate)
    		 --and term >0
               AND fa.FIGLProductCategory = 'FrontGross'
--and dealtypekey = 2
               AND TransactionType = 'Vehicle Deal'
               AND fiwipstatuscode = 'F'
               AND ff.statcount = 1
               AND COALESCE(c.DMSCstEmailAddress1, c.DMSCstEmailAddress2) IS NOT NULL
			   AND COALESCE(c.DMSCstEmailAddress1, c.DMSCstEmailAddress2) <> 'Unknown'

			------NEW WHERE CONDITION
			AND CONCAT(1,COALESCE(c.DMSCstHomePhone, c.DMSCstCellPhone, c.DMSCstBusinessPhone))  IS NOT NULL
			AND c.DMSCstAddressZipCode   IS NOT NULL
		    AND c.DMSCstAddressCity   IS NOT NULL
			AND c.DMSCstAddressZipCode <> 'Unknown'
		    AND c.DMSCstAddressCity   <> 'Unknown'
--order by d.fulldate     desc

     END;
	 --END of Source SP

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
