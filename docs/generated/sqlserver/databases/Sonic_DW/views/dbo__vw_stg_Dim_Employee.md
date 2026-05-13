---
name: vw_stg_Dim_Employee
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

/********************************************************
*- Created By CDE 06/08/2012
*- Updated to view to add additional fields CDE 06/08/2012
*- Updated view.Added column EmployeeName 04/01/2015
   By Bhramar Chandrakar
*********************************************************/
CREATE VIEW [dbo].[vw_stg_Dim_Employee]
AS
WITH cte_stg_Dim_Employee
AS (
	SELECT CONVERT(INT, a.cora_acct_id) AS cora_acct_id
		,CONVERT(VARCHAR(17), a.accountingaccount) AS accountingaccount
		,CONVERT(VARCHAR(17), a.custno) AS custno
		,CONVERT(VARCHAR(40), a.hostitemid) AS hostitemid
		,CONVERT(VARCHAR(150), a.EmployeeName) AS EmployeeName
		,CONVERT(VARCHAR(25), a.firstname) AS AsoNameFirst
		,CONVERT(VARCHAR(40), a.lastname) AS AsoNameLast
		,CONVERT(VARCHAR(40), a.middlename) AS EMPMiddleName
		,CONVERT(VARCHAR(40), a.name1) AS EMPName1
		,CONVERT(VARCHAR(45), a.address) AS EMPAddress
		,CONVERT(VARCHAR(45), a.addresssecondline) AS EMPAddress2
		,CONVERT(VARCHAR(35), a.city) AS EMPCity
		,CONVERT(CHAR(2), a.STATE) AS EMPState
		,CONVERT(VARCHAR(10), a.ziporpostalcode) AS EMPZipPostal
		,CONVERT(VARCHAR(1), a.namecode) AS EMPNameCode
		,CONVERT(CHAR(1), NULLIF(LTRIM(RTRIM(c.class)), '')) AS AsoTechClass
		,CONVERT(VARCHAR(18), NULLIF(LTRIM(RTRIM(c.department)), '')) AS AsoTechDepartment
		,CONVERT(VARCHAR(10), NULLIF(LTRIM(RTRIM(c.licensenumber)), '')) AS AsoTechLicenseNumber
		,CONVERT(CHAR(1), NULLIF(LTRIM(RTRIM(c.teamleader)), '')) AS AsoTechTeamLeader
		,CONVERT(CHAR(1), NULLIF(LTRIM(RTRIM(c.teamnumber)), '')) AS AsoTechTeamNumber
		,CONVERT(NUMERIC(12, 2), c.technicianhourlyrate) AS AsoTechHourlyRate
		,
		--CONVERT(int, a.ETLExecution_ID) AS ETLExecution_ID,
		--CONVERT(int, a.Meta_Src_Sys_ID) AS Meta_Src_Sys_ID,
		CAST(CONVERT(VARCHAR(10), a.dateadded, 112) AS INT) AS CreatedDate
		,CAST(CONVERT(VARCHAR(10), a.lastupdated, 112) AS INT) AS UpdatedDate
		,CONVERT(VARCHAR(20), a.Meta_SourceSystemName) AS Meta__SourceSystemName
		,
		--CONVERT(datetime, a.Meta_RowEffectiveDate) AS Meta_RowEffectiveDate,
		CONVERT(DATETIME, a.Meta_RowExpiredDate) AS Meta__RowExpiredDate
		,
		--CONVERT(char(1), a.Meta_RowIsCurrent) AS Meta_RowIsCurrent,
		CONVERT(DATETIME, a.Meta_RowLastChangedDate) AS Meta__RowLastChangedDate
		,CONVERT(INT, a.Meta_AuditKey) AS Meta__AuditKey
		,CONVERT(VARCHAR(255), a.Meta_NaturalKey) AS Meta__NaturalKey
		,CONVERT(INT, a.Meta_Checksum) AS Meta__Checksum
		,ROW_NUMBER() OVER (
			ORDER BY a.cora_acct_id
				,a.hostitemid
			) AS RowNum
		,RANK() OVER (
			ORDER BY a.cora_acct_id
				,a.hostitemid
			) AS RowRank
	FROM ETL_Staging.wrk.DMS_employee_staging a WITH (NOLOCK)
	LEFT JOIN dbo.Dim_DMSEmployee b WITH (NOLOCK) ON a.cora_acct_id = b.cora_acct_id --natural key
		AND a.hostitemid = b.hostitemid --natural key
		--AND a.custno = b.custno --natural key
	LEFT JOIN (
		SELECT *
		FROM ETL_Staging.wrk.DMS_technician_staging a WITH (NOLOCK)
		WHERE a.rowlastupdated = (
				SELECT MAX(x.rowlastupdated)
				FROM ETL_Staging.wrk.DMS_technician_staging x
				WHERE x.accountingaccount = a.accountingaccount
					AND x.techniciannumber = a.techniciannumber
				)
		) AS c ON a.accountingaccount = c.accountingaccount
		AND a.custno = c.techniciannumber
	WHERE b.custno IS NULL
	)
SELECT em.*
FROM cte_stg_Dim_Employee AS em
WHERE em.RowNum = em.RowRank;

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
