---
name: usp_FacebookEquityCustomers
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

/*
Author: JayCharan
Updated Date: June 27, 2021
Desc: This procedure gets a list of Equity Brand Customers with Logic for Honda and Non Honda brands

2021/07/21  -	 Added logic for Toyota brand (EOEMonth = 48, EOERange = 35)

2021/08/28  -    Added logic to included Jaguar, Land Rover and Porsche under 18 months payment

*/
CREATE    PROCEDURE [dbo].[usp_FacebookEquityCustomers] @EOEMonth INT
	,@EOERange INT
AS
BEGIN
	DECLARE @EOEStartDate DATE
		,@EOEEndDate DATE
		,@AudienceType VARCHAR(500)

	--,@EOEMonth INT = 24
	--,@EOERange INT = 13;
	SET @EOEStartDate = CONVERT(DATE, DATEADD(mm, @EOEMonth - @EOERange, GETDATE()))
	SET @EOEEndDate = CONVERT(DATE, DATEADD(mm, @EOEMonth, GETDATE()));

	IF (@EOEMonth = 18)
	BEGIN
		SELECT ff.entitykey
			,e.EntDealerLvl1
			,cast(cast(accountingdatekey AS VARCHAR) AS SMALLDATETIME) AS TransactionDate
			,ff.DMSCustomerKey AS CustomerID
			,c.DMSCstNameFirst
			,COALESCE(DMSCstNameLast, c.DMSCstBusinessName) AS DMSCstNameLast
			,COALESCE(DMSCstEmailAddress1, DMSCstEmailAddress2) AS EmailAddress


			/*NEW SELECT FOR PHONE NO, ZIP CODE AND CITY --Added on 29/04/2022*/
			,CONCAT(1,COALESCE(c.DMSCstHomePhone, c.DMSCstCellPhone, c.DMSCstBusinessPhone)) AS PhoneNumber
			,c.DMSCstAddressZipCode as ZipCode
			,c.DMSCstAddressCity as City
			--CONVERT(DATE, DATEADD(mm, term / 2, d.fulldate)) as [term/2],--
			--CONVERT(DATE,DATEADD(mm,ff.term,d.fulldate)) DateCheckedFor,--
			--DATEDIFF(MONTH,d.fulldate, GETDATE())   as TermsCompleted,
			--@EOEStartDate GreaterThanEqualDate,--
			--@EOEEndDate  LessThanDate,--
			--e.EntBrand,
			,'Equity Customers' AS AudienceType
			,EM.BigIntegerField AS AudienceID
		FROM factfire(NOLOCK) ff
		JOIN dim_FIGLAccounts(NOLOCK) fa ON fa.FIGLProductKey = ff.FIGLProductKey
		JOIN dim_date d(NOLOCK) ON d.datekey = ff.accountingdatekey
		JOIN Dim_DMSCustomer(NOLOCK) c ON ff.DMSCustomerKey = c.DMSCustomerKey
		JOIN dim_entity(NOLOCK) e ON e.entitykey = ff.entitykey
		JOIN Sonic_DW.dbo.DimEntityRelationship(NOLOCK) EM ON EM.EntityKey = e.EntityKey
		JOIN Sonic_DW.dbo.DimEntityRelationshipType(NOLOCK) ET ON EM.RelationshipTypeGuid = ET.RelationshipTypeGuid
		WHERE --Logic  added for Non Honda and Non Toyota Brands  21/7/2021
			ET.RelationshipType = 'FBAudienceEquityCustomers'
			AND e.EntBrand NOT IN (
				'Honda'
				,'Toyota'
				)
			AND CONVERT(DATE, DATEADD(mm, term / 2, d.fulldate)) < GETDATE()
			AND CONVERT(DATE, DATEADD(mm, ff.term, d.fulldate)) >= @EOEStartDate
			AND CONVERT(DATE, DATEADD(mm, ff.term, d.fulldate)) < @EOEEndDate
			AND term > 0
			AND ff.DealTypeKey IN (
				1
				,2
				)
			AND fa.FIGLProductCategory = 'FrontGross'
			AND TransactionType = 'Vehicle Deal'
			AND fiwipstatuscode = 'F'
			AND COALESCE(c.DMSCstEmailAddress1, c.DMSCstEmailAddress2) IS NOT NULL
			AND COALESCE(c.DMSCstEmailAddress1, c.DMSCstEmailAddress2) <> 'Unknown'
			------NEW WHERE CONDITION
			AND CONCAT(1,COALESCE(c.DMSCstHomePhone, c.DMSCstCellPhone, c.DMSCstBusinessPhone))  IS NOT NULL
			AND c.DMSCstAddressZipCode   IS NOT NULL
		    AND c.DMSCstAddressCity   IS NOT NULL
			AND c.DMSCstAddressZipCode <> 'Unknown'
		    AND c.DMSCstAddressCity   <> 'Unknown'

	END;

	IF (@EOEMonth = 48)
	BEGIN
		SELECT ff.entitykey
			,e.EntDealerLvl1
			,cast(cast(accountingdatekey AS VARCHAR) AS SMALLDATETIME) AS TransactionDate
			,ff.DMSCustomerKey AS CustomerID
			,c.DMSCstNameFirst
			,COALESCE(DMSCstNameLast, c.DMSCstBusinessName) AS DMSCstNameLast
			,COALESCE(DMSCstEmailAddress1, DMSCstEmailAddress2) AS EmailAddress

			/*NEW SELECT FOR PHONE NO, ZIP CODE AND CITY --Added on 29/04/2022*/
			,CONCAT(1,COALESCE(c.DMSCstHomePhone, c.DMSCstCellPhone, c.DMSCstBusinessPhone)) AS PhoneNumber
			,c.DMSCstAddressZipCode as ZipCode
			,c.DMSCstAddressCity as City,
			--CONVERT(DATE, DATEADD(mm, term / 2, d.fulldate)) as [term/2],--
			--CONVERT(DATE,DATEADD(mm,ff.term,d.fulldate)) DateCheckedFor,--
			--DATEDIFF(MONTH,d.fulldate, GETDATE())   as TermsCompleted,
			--@EOEStartDate GreaterThanEqualDate,--
			--@EOEEndDate  LessThanDate,--
			--e.EntBrand,
			'Equity Customers' AS AudienceType
			,EM.BigIntegerField AS AudienceID
		FROM factfire(NOLOCK) ff
		JOIN dim_FIGLAccounts(NOLOCK) fa ON fa.FIGLProductKey = ff.FIGLProductKey
		JOIN dim_date d(NOLOCK) ON d.datekey = ff.accountingdatekey
		JOIN Dim_DMSCustomer(NOLOCK) c ON ff.DMSCustomerKey = c.DMSCustomerKey
		JOIN dim_entity(NOLOCK) e ON e.entitykey = ff.entitykey
		JOIN Sonic_DW.dbo.DimEntityRelationship(NOLOCK) EM ON EM.EntityKey = e.EntityKey
		JOIN Sonic_DW.dbo.DimEntityRelationshipType(NOLOCK) ET ON EM.RelationshipTypeGuid = ET.RelationshipTypeGuid
		WHERE
			--Logic added for Honda brands  7/7/2021
			ET.RelationshipType = 'FBAudienceEquityCustomers'
			AND e.EntBrand IN ('Toyota')
			AND CONVERT(DATE, DATEADD(mm, term / 2, d.fulldate)) < GETDATE()
			AND CONVERT(DATE, DATEADD(mm, ff.term, d.fulldate)) >= @EOEStartDate
			AND CONVERT(DATE, DATEADD(mm, ff.term, d.fulldate)) < @EOEEndDate
			AND term > 0
			AND ff.DealTypeKey IN (
				1
				,2
				)
			AND fa.FIGLProductCategory = 'FrontGross'
			AND TransactionType = 'Vehicle Deal'
			AND fiwipstatuscode = 'F'
			AND COALESCE(c.DMSCstEmailAddress1, c.DMSCstEmailAddress2) IS NOT NULL
			AND COALESCE(c.DMSCstEmailAddress1, c.DMSCstEmailAddress2) <> 'Unknown'
			------NEW WHERE CONDITION
			AND CONCAT(1,COALESCE(c.DMSCstHomePhone, c.DMSCstCellPhone, c.DMSCstBusinessPhone))  IS NOT NULL
			AND c.DMSCstAddressZipCode   IS NOT NULL
		    AND c.DMSCstAddressCity   IS NOT NULL
			AND c.DMSCstAddressZipCode <> 'Unknown'
		    AND c.DMSCstAddressCity   <> 'Unknown'

	END;

	IF (@EOEMonth = 24)
	BEGIN
		SELECT ff.entitykey
			,e.EntDealerLvl1
			,cast(cast(accountingdatekey AS VARCHAR) AS SMALLDATETIME) AS TransactionDate
			,ff.DMSCustomerKey AS CustomerID
			,c.DMSCstNameFirst
			,COALESCE(DMSCstNameLast, c.DMSCstBusinessName) AS DMSCstNameLast
			,COALESCE(DMSCstEmailAddress1, DMSCstEmailAddress2) AS EmailAddress

			/*NEW SELECT FOR PHONE NO, ZIP CODE AND CITY --Added on 29/04/2022*/
			,CONCAT(1,COALESCE(c.DMSCstHomePhone, c.DMSCstCellPhone, c.DMSCstBusinessPhone)) AS PhoneNumber
			,c.DMSCstAddressZipCode as ZipCode
			,c.DMSCstAddressCity as City,
			--CONVERT(DATE, DATEADD(mm, term / 2, d.fulldate)) as [term/2],--
			--CONVERT(DATE,DATEADD(mm,ff.term,d.fulldate)) DateCheckedFor,--
			--DATEDIFF(MONTH,d.fulldate, GETDATE())   as TermsCompleted,
			--@EOEStartDate GreaterThanEqualDate,--
			--@EOEEndDate  LessThanDate,--
			--e.EntBrand,
			'Equity Customers' AS AudienceType
			,EM.BigIntegerField AS AudienceID
		FROM factfire(NOLOCK) ff
		JOIN dim_FIGLAccounts(NOLOCK) fa ON fa.FIGLProductKey = ff.FIGLProductKey
		JOIN dim_date d(NOLOCK) ON d.datekey = ff.accountingdatekey
		JOIN Dim_DMSCustomer(NOLOCK) c ON ff.DMSCustomerKey = c.DMSCustomerKey
		JOIN dim_entity(NOLOCK) e ON e.entitykey = ff.entitykey
		JOIN Sonic_DW.dbo.DimEntityRelationship(NOLOCK) EM ON EM.EntityKey = e.EntityKey
		JOIN Sonic_DW.dbo.DimEntityRelationshipType(NOLOCK) ET ON EM.RelationshipTypeGuid = ET.RelationshipTypeGuid
		WHERE
			--Logic added for Honda brands  7/7/2021
			ET.RelationshipType = 'FBAudienceEquityCustomers'
			AND e.EntBrand IN ('Honda')
			AND DATEDIFF(MONTH, d.fulldate, GETDATE()) BETWEEN 12
				AND 28
			AND CONVERT(DATE, DATEADD(mm, ff.term, d.fulldate)) >= @EOEStartDate
			AND CONVERT(DATE, DATEADD(mm, ff.term, d.fulldate)) < @EOEEndDate
			AND term > 0
			AND ff.DealTypeKey IN (
				1
				,2
				)
			AND fa.FIGLProductCategory = 'FrontGross'
			AND TransactionType = 'Vehicle Deal'
			AND fiwipstatuscode = 'F'
			AND COALESCE(c.DMSCstEmailAddress1, c.DMSCstEmailAddress2) IS NOT NULL
			AND COALESCE(c.DMSCstEmailAddress1, c.DMSCstEmailAddress2) <> 'Unknown'
			------NEW WHERE CONDITION
			AND CONCAT(1,COALESCE(c.DMSCstHomePhone, c.DMSCstCellPhone, c.DMSCstBusinessPhone))  IS NOT NULL
			AND c.DMSCstAddressZipCode   IS NOT NULL
		    AND c.DMSCstAddressCity   IS NOT NULL
			AND c.DMSCstAddressZipCode <> 'Unknown'
		    AND c.DMSCstAddressCity   <> 'Unknown'

	END;
END;
--END of Source SP

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
