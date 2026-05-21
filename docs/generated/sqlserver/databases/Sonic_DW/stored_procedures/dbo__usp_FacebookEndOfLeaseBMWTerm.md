---
name: usp_FacebookEndOfLeaseBMWTerm
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

Author: Sumit Tandon
Create Date: May 9, 2019
Create Desc: This procedure gets a list of Customers


Alter By			Alter Date	   Alter Notes
---------------	----------	   ---------------------
Jay				2020-09-22	   Altered SP to list customers based on the EOL Month and Start range that is passed in the @EOLMonth and @EOLRange parameters
Jay				2021-06-12	   Altered SP to have condition on Brand level Honda, Lexus and Toyota
Jay				2021-06-19	   Altered SP to add logic for Brands Audi, BMW and Mercedes
Jay				2021-08-28	   Altered SP to add logic for Brands Porsche, Jaguar and Land Rover for 9 months payment remaining

keerthi k       2022-04-29     Getting 3 new columns(PhoneNumber, ZipCode, City) With the existing columns
*/
CREATE      PROCEDURE [dbo].[usp_FacebookEndOfLeaseBMWTerm] @EOLMonth INT
	,@EOLRange INT
AS
BEGIN
	DECLARE @EOLStartDate DATE
		,@EOLEndDate DATE
		,@AudienceType VARCHAR(500);


	SELECT @AudienceType = CASE @EOLMonth
			WHEN 12
				THEN 'EndOfLeaseBMWTerm'
			WHEN 9 --Added @EOLMonth =9 for Brands Audi, Mercedes and BMW
				THEN 'EndOfLeaseBMWTerm'
			WHEN 6
				THEN 'EndOfLeaseBMWTerm'
			END
		,@EOLStartDate = CONVERT(DATE, DATEADD(mm, @EOLMonth - @EOLRange, GETDATE()))
		,@EOLEndDate = CONVERT(DATE, DATEADD(mm, @EOLMonth, GETDATE()));

	SELECT ff.entitykey
		,e.EntDealerLvl1
		,CAST(CAST(ff.accountingdatekey AS VARCHAR) AS SMALLDATETIME) AS TransactionDate
		,ff.DMSCustomerKey AS CustomerID
		,c.DMSCstNameFirst
		,COALESCE(c.DMSCstNameLast, c.DMSCstBusinessName) AS DMSCstNameLast
		,COALESCE(c.DMSCstEmailAddress1, c.DMSCstEmailAddress2) AS EmailAddress
		/*NEW SELECT FOR PHONE NO, ZIP CODE AND CITY --Added on 29/04/2022*/
			,CONCAT(1,COALESCE(c.DMSCstHomePhone, c.DMSCstCellPhone, c.DMSCstBusinessPhone)) AS PhoneNumber
			,c.DMSCstAddressZipCode as ZipCode
			,c.DMSCstAddressCity as City
		,@AudienceType AS FBAudienceType
		,EM.BigIntegerField AS AudienceID
	--,ff.term
	--,d.fulldate TransactionDate
	--,CONVERT(DATE,DATEADD(mm,ff.term,d.fulldate)) EndDate
	--,CONVERT(DATE,DATEADD(mm,ff.term,d.fulldate)) DateCheckedFor
	--,@EOLStartDate GreaterThanEqualDate
	--,@EOLEndDate LessThanDate
	FROM factfire(NOLOCK) ff
	JOIN dim_FIGLAccounts(NOLOCK) fa ON fa.FIGLProductKey = ff.FIGLProductKey
	JOIN dim_date(NOLOCK) d ON d.datekey = ff.accountingdatekey
	JOIN Dim_DMSCustomer(NOLOCK) c ON ff.DMSCustomerKey = c.DMSCustomerKey
	JOIN dim_entity(NOLOCK) e ON e.entitykey = ff.entitykey
	JOIN Sonic_DW.dbo.DimEntityRelationship(NOLOCK) EM ON EM.EntityKey = e.EntityKey
	JOIN Sonic_DW.dbo.DimEntityRelationshipType(NOLOCK) ET ON EM.RelationshipTypeGuid = ET.RelationshipTypeGuid
	WHERE (
			@EOLMonth = 12
			AND e.EntBrand IN (
				'Lexus'
				,'Toyota'
				,'Honda'
				)
			AND ET.RelationshipType = 'FBAudienceEndofLeaseBMW'
			AND CONVERT(DATE, DATEADD(mm, ff.term, d.fulldate)) >= @EOLStartDate
			AND CONVERT(DATE, DATEADD(mm, ff.term, d.fulldate)) < @EOLEndDate
			AND ff.term > 0
			AND fa.FIGLProductCategory = 'FrontGross'
			AND ff.dealtypekey = 1
			AND ff.TransactionType = 'Vehicle Deal'
			AND ff.fiwipstatuscode = 'F'
			AND e.EntActive = 'Active'
			AND COALESCE(c.DMSCstEmailAddress1, c.DMSCstEmailAddress2) IS NOT NULL
			AND COALESCE(c.DMSCstEmailAddress1, c.DMSCstEmailAddress2) <> 'Unknown'
			------NEW WHERE CONDITION
			AND CONCAT(1,COALESCE(c.DMSCstHomePhone, c.DMSCstCellPhone, c.DMSCstBusinessPhone))  IS NOT NULL
			AND c.DMSCstAddressZipCode   IS NOT NULL
		    AND c.DMSCstAddressCity   IS NOT NULL
			AND c.DMSCstAddressZipCode <> 'Unknown'
		    AND c.DMSCstAddressCity   <> 'Unknown'
			)
		OR (
			@EOLMonth = 9 --Logic added  for 9 months for BMW,Mercedes 7/7/2021
			AND e.EntBrand IN (
				'Audi'
				,'BMW'
				,'Mercedes'
				,'Porsche'
				,'Jaguar'
				,'Land Rover'
				)--Logic added  for 9 months for Porsche, Jaguar and Land Rover 28/08/2021
			AND ET.RelationshipType = 'FBAudienceEndofLeaseBMW'
			AND CONVERT(DATE, DATEADD(mm, ff.term, d.fulldate)) >= @EOLStartDate
			AND CONVERT(DATE, DATEADD(mm, ff.term, d.fulldate)) < @EOLEndDate
			AND ff.term > 0
			AND fa.FIGLProductCategory = 'FrontGross'
			AND ff.dealtypekey = 1
			AND ff.TransactionType = 'Vehicle Deal'
			AND ff.fiwipstatuscode = 'F'
			AND e.EntActive = 'Active'
			AND COALESCE(c.DMSCstEmailAddress1, c.DMSCstEmailAddress2) IS NOT NULL
			AND COALESCE(c.DMSCstEmailAddress1, c.DMSCstEmailAddress2) <> 'Unknown'
			------NEW WHERE CONDITION
			AND CONCAT(1,COALESCE(c.DMSCstHomePhone, c.DMSCstCellPhone, c.DMSCstBusinessPhone))  IS NOT NULL
			AND c.DMSCstAddressZipCode   IS NOT NULL
		    AND c.DMSCstAddressCity   IS NOT NULL
			AND c.DMSCstAddressZipCode <> 'Unknown'
		    AND c.DMSCstAddressCity   <> 'Unknown'
			)
		OR (
			@EOLMonth = 6
			AND ET.RelationshipType = 'FBAudienceEndofLeaseBMW'
			AND CONVERT(DATE, DATEADD(mm, ff.term, d.fulldate)) >= @EOLStartDate
			AND CONVERT(DATE, DATEADD(mm, ff.term, d.fulldate)) < @EOLEndDate
			AND ff.term > 0
			AND fa.FIGLProductCategory = 'FrontGross'
			AND ff.dealtypekey = 1
			AND ff.TransactionType = 'Vehicle Deal'
			AND ff.fiwipstatuscode = 'F'
			AND e.EntActive = 'Active'
			AND COALESCE(c.DMSCstEmailAddress1, c.DMSCstEmailAddress2) IS NOT NULL
			AND COALESCE(c.DMSCstEmailAddress1, c.DMSCstEmailAddress2) <> 'Unknown'
			------NEW WHERE CONDITION
			AND CONCAT(1,COALESCE(c.DMSCstHomePhone, c.DMSCstCellPhone, c.DMSCstBusinessPhone))  IS NOT NULL
			AND c.DMSCstAddressZipCode   IS NOT NULL
		    AND c.DMSCstAddressCity   IS NOT NULL
			AND c.DMSCstAddressZipCode <> 'Unknown'
		    AND c.DMSCstAddressCity   <> 'Unknown'
			);
END;
--END of Source SP

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
