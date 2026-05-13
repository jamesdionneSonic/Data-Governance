---
name: usp_FacebookEndOfFinanceTerm
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
depends_on:
  - Dim_Date
  - Dim_DMSCustomer
  - Dim_Entity
  - dim_FIGLAccounts
  - factFIRE
dependency_count: 5
parameter_count: 2
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Dependencies

This procedure depends on:

- **dbo.Dim_Date** (U )
- **dbo.Dim_DMSCustomer** (U )
- **dbo.Dim_Entity** (U )
- **dbo.dim_FIGLAccounts** (U )
- **dbo.factFIRE** (U )

## Parameters

| Name        | Type | Output | Default |
| ----------- | ---- | ------ | ------- |
| `@EOFMonth` | int  | No     | No      |
| `@EOFRange` | int  | No     | No      |

## Definition

```sql

/*

Author: Sumit Tandon
Create Date: May 9, 2019
Create Desc: This procedure gets a list of Customers

Sample Call :
    EXEC [Sonic_DW].[dbo].[usp_FacebookEndOfFinanceTerm] 6, 3
Sample params:
    FBAudienceEndofFinance1months - @EOFMonth = 1, EOFRange = 1

Alter By			Alter Date	   Alter Notes
---------------	----------	   ---------------------
Jay				2020-09-22	   Altered SP to list customers based on the EOF Month and Start range that is passed in the @EOFMonth and @EOFRange parameters
Jay				2021-06-10	   Altered SP to add logic for Brands Honda, Lexus and Toyota
Jay				2021-06-19	   Altered SP to add logic for Brands Audi, BMW and Mercedes
Jay				2021-08-28	   Altered SP to add logic for Prosche in 12 months and Jaguar and Land Rover in 9 months
Jay				2022-02-23	   Altered SP to add logic for Ford, GMC, Cadillac, Chevrolet in 12 months
Keerthi k       2022-04-29    Getting 3 new columns(PhoneNumber, ZipCode, City) With the existing columns
*/
CREATE    PROCEDURE [dbo].[usp_FacebookEndOfFinanceTerm] @EOFMonth INT
	,@EOFRange INT
AS
BEGIN
	DECLARE @AudienceType VARCHAR(500)
		,@EOFStartDate DATE
		,@EOFEndDate DATE;

	SELECT @AudienceType = CASE @EOFMonth
			WHEN 24
				THEN 'FBAudienceEndofFinance'
			WHEN 12
				THEN 'FBAudienceEndofFinance'
			WHEN --Added @EOFMonth 9 for BMW, Audi and Mercedes 7/7/2021
				9
				THEN 'FBAudienceEndofFinance'
			WHEN 6
				THEN 'FBAudienceEndofFinance'
			WHEN 3
				THEN 'FBAudienceEndofFinance3months'
			WHEN 2
				THEN 'FBAudienceEndofFinance2months'
			WHEN 1
				THEN 'FBAudienceEndofFinance1months'
			END
		,@EOFStartDate = CONVERT(DATE, DATEADD(mm, @EOFMonth - @EOFRange, GETDATE()))
		,@EOFEndDate = CONVERT(DATE, DATEADD(mm, @EOFMonth, GETDATE()));

	SELECT ff.entitykey
		,e.EntDealerLvl1
		,CAST(CAST(ff.accountingdatekey AS VARCHAR) AS SMALLDATETIME) AS TransactionDate
		,ff.DMSCustomerKey AS CustomerID
		,c.DMSCstNameFirst
		,c.DMSCstNameLast
		,COALESCE(c.DMSCstEmailAddress1, c.DMSCstEmailAddress2) AS EmailAddress
		/*NEW SELECT FOR PHONE NO, ZIP CODE AND CITY --Added on 29/04/2022*/
			,CONCAT(1,COALESCE(c.DMSCstHomePhone, c.DMSCstCellPhone, c.DMSCstBusinessPhone)) AS PhoneNumber
			,c.DMSCstAddressZipCode as ZipCode
			,c.DMSCstAddressCity as City
		,@AudienceType AS AudienceType
		,EM.BigIntegerField AS AudienceID
	--e.EntBrand,
	--ff.term,
	--d.fulldate TransactionDate,
	--CONVERT(DATE, DATEADD(mm, term, d.fulldate)) EndDate,
	--CONVERT(DATE, DATEADD(mm, term, d.fulldate)) DateCheckedFor,
	--@EOFStartDate GreaterThanEqualDate,
	--@EOFEndDate LessThanDate
	FROM factfire(NOLOCK) ff
	JOIN dim_FIGLAccounts(NOLOCK) fa ON fa.FIGLProductKey = ff.FIGLProductKey
	JOIN dim_date(NOLOCK) d ON d.datekey = ff.accountingdatekey
	JOIN Dim_DMSCustomer(NOLOCK) c ON ff.DMSCustomerKey = c.DMSCustomerKey
	JOIN dim_entity(NOLOCK) e ON e.entitykey = ff.entitykey
	JOIN Sonic_DW.dbo.DimEntityRelationship(NOLOCK) EM ON EM.EntityKey = e.EntityKey
	JOIN Sonic_DW.dbo.DimEntityRelationshipType(NOLOCK) ET ON EM.RelationshipTypeGuid = ET.RelationshipTypeGuid
	WHERE (
			@EOFMonth = 9 --Logic added  for 9 months for BMW,Mercedes and BMW 7/7/2021
			AND e.EntBrand IN (
				'Audi'
				,'BMW'
				,'Mercedes'
				,'Jaguar'
				,'Land Rover'
				)
			AND ET.RelationshipType = @AudienceType
			AND CONVERT(DATE, DATEADD(mm, ff.term, d.fulldate)) >= @EOFStartDate
			AND CONVERT(DATE, DATEADD(mm, ff.term, d.fulldate)) < @EOFEndDate
			AND ff.term > 0
			AND fa.FIGLProductCategory = 'FrontGross'
			AND ff.DealTypeKey = 2
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
			@EOFMonth = 12
			AND e.EntBrand IN (
				'Lexus'
				,'Toyota'
				,'Porsche'
				,'Ford'
				,'GMC'
				,'Cadillac'
				,'Chevrolet'
				)
			AND ET.RelationshipType = @AudienceType
			AND CONVERT(DATE, DATEADD(mm, ff.term, d.fulldate)) >= @EOFStartDate
			AND CONVERT(DATE, DATEADD(mm, ff.term, d.fulldate)) < @EOFEndDate
			AND ff.term > 0
			AND fa.FIGLProductCategory = 'FrontGross'
			AND ff.DealTypeKey = 2
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
			@EOFMonth = 24
			AND e.EntBrand IN ('Honda')
			AND ET.RelationshipType = @AudienceType
			AND CONVERT(DATE, DATEADD(mm, ff.term, d.fulldate)) >= @EOFStartDate
			AND CONVERT(DATE, DATEADD(mm, ff.term, d.fulldate)) < @EOFEndDate
			AND ff.term > 0
			AND fa.FIGLProductCategory = 'FrontGross'
			AND ff.DealTypeKey = 2
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
			@EOFMonth <= 6
			AND ET.RelationshipType = @AudienceType
			AND CONVERT(DATE, DATEADD(mm, ff.term, d.fulldate)) >= @EOFStartDate
			AND CONVERT(DATE, DATEADD(mm, ff.term, d.fulldate)) < @EOFEndDate
			AND ff.term > 0
			AND fa.FIGLProductCategory = 'FrontGross'
			AND ff.DealTypeKey = 2
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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
