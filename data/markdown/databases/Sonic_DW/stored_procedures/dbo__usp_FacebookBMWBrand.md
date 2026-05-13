---
name: usp_FacebookBMWBrand
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
parameter_count: 1
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
| `@BMWRange` | int  | No     | No      |

## Definition

```sql

/*
Author: JayCharan
Create Date: June 27, 2021
Create Desc: This procedure gets a list of BMW Brand Customers

Updated By  :  Keerthi K
Updated On  :  [29/04/2022]
Description :  Getting 3 new columns(PhoneNumber, ZipCode, City) With the existing columns
*/
CREATE


 PROCEDURE [dbo].[usp_FacebookBMWBrand] @BMWRange INT
AS
BEGIN
	DECLARE @BMWStartDate DATE
		,@BMWEndDate DATE
		,@AudienceType VARCHAR(500);

	SET @AudienceType = 'FBAudienceBMWBrand'
	SET @BMWStartDate = CONVERT(DATE, DATEADD(mm, - @BMWRange, GETDATE()))
	SET @BMWEndDate = CAST(GETDATE() AS DATE);

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
	--,d.fulldate DateCheckedFor
	--,@BMWStartDate GreaterThanEqualDate
	--,@BMWEndDate LessThanDate
	--,e.EntBrand
	FROM factfire(NOLOCK) ff
	JOIN dim_FIGLAccounts(NOLOCK) fa ON fa.FIGLProductKey = ff.FIGLProductKey
	JOIN dim_date(NOLOCK) d ON d.datekey = ff.accountingdatekey
	JOIN Dim_DMSCustomer(NOLOCK) c ON ff.DMSCustomerKey = c.DMSCustomerKey
	JOIN dim_entity(NOLOCK) e ON e.entitykey = ff.entitykey
	JOIN Sonic_DW.dbo.DimEntityRelationship(NOLOCK) EM ON EM.EntityKey = e.EntityKey
	JOIN Sonic_DW.dbo.DimEntityRelationshipType(NOLOCK) ET ON EM.RelationshipTypeGuid = ET.RelationshipTypeGuid
	WHERE e.EntBrand = 'BMW'
		AND ET.RelationshipType = 'FBAudienceBMWBrand'
		AND d.fulldate >= @BMWStartDate
		AND d.fulldate < @BMWEndDate
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
END;
--END of Source SP

```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
