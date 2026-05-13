---
name: vw_Fact_DQValidation
database: Sonic_DW
type: view
schema: dq
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 4
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dq

## Dependencies

This view depends on:

- **dbo.Dim_Account** (U )
- **dbo.Fact_DQValidation** (U )
- **dbo.vw_Dim_Status** (V )
- **dq.Dim_ValidationManagement** (U )

## Definition

```sql

Create VIEW [dq].[vw_Fact_DQValidation]
AS
WITH fact AS (
					/*Join to dim account to get a accountnumber and account for each records since these values are nto stored natively in the fact*/
					SELECT
						  f.SourceKey
						, f.StepKey
						, f.TargetKey
						, f.StatusKey
						, f.ValidationKey
						, f.EntityKey
						, f.DateKey
						, f.HostItemID
						, f.Cora_Acct_ID
						, f.ImpactDateKey
						, f.AccountKey
						, da.AccAccountNumber	as Prefixed_AccountNumber
						, da.AccAccount			as Base_AccountNumber
						, da.AccPrefix			as Accounting_Prefix
						, f.RowID
						, f.ETLExecution_ID
						, f.ETLSequenceID
						, f.ErrorCount
						, f.Variance
						, f.ExpectedValue
						, f.User_ID
						, f.Meta_ComputerName
						, f.Meta_LoadDate
					FROM dbo.fact_DQValidation f
						left join dbo.dim_account da
							on f.accountkey = da.accountkey
			)
SELECT
		  f.SourceKey
		, f.StepKey
		, f.TargetKey
		, f.StatusKey
		, s.Is_DataLoad_Err
		, s.Is_Val_Err
		, f.ValidationKey
		, f.EntityKey
		, f.DateKey
		, f.HostItemID
		, f.Cora_Acct_ID
		, f.ImpactDateKey
		, f.AccountKey
		, f.Prefixed_AccountNumber
		, f.Base_AccountNumber
		, f.RowID
		, f.ETLExecution_ID
		, f.ETLSequenceID
		, f.ErrorCount
		, f.Variance
		, f.ExpectedValue
		, f.User_ID
		, f.Meta_ComputerName
		, f.Meta_LoadDate
FROM fact f
	INNER JOIN dbo.vw_Dim_Status s
		ON f.StatusKey = s.StatusKey
WHERE NOT EXISTS
						(
							select *
							from dq.dim_ValidationManagement vm
							where
									f.sourcekey = vm.sourcekey
								and f.TargetKey = vm.TargetKey
								and f.StepKey	= vm.StepKey
								and f.ValidationKey = vm.ValidationKey
								and case when vm.EntityKey		is null then 1 else f.EntityKey		end = case when vm.EntityKey	is null then 1 else vm.EntityKey		end
								and case when vm.AccountKey		is null then 1 else f.AccountKey	end = case when vm.AccountKey	is null then 1 else vm.AccountKey		end
								and case when vm.Prefixed_AccountNumber	is null then 1 else f.Prefixed_AccountNumber	end = case when vm.Prefixed_AccountNumber	is null then 1 else vm.Prefixed_AccountNumber	end
								and case when vm.Base_AccountNumber		is null then 1 else f.Base_AccountNumber		end = case when vm.Base_AccountNumber		is null then 1 else vm.Base_AccountNumber		end
								and case when vm.Accounting_Prefix		is null then 1 else f.Accounting_Prefix			end = case when vm.Accounting_Prefix		is null then 1 else vm.Accounting_Prefix		end
								and case when vm.Cora_Acct_ID	is null then 1 else f.Cora_Acct_ID	end = case when vm.Cora_Acct_ID is null then 1	else vm.Cora_Acct_ID	end
								and case when vm.RowID			is null then '1' else f.RowID		end = case when vm.RowID		is null then '1' else vm.RowID			end
								and vm.ActiveExclusionFlag = 1	/*Exclusion is Active*/
									/*Companyid is not natively stored in the fact cannont determine how to acquire this yet.*/
								--and case when vm.CompanyID		is null then 1 else f.CompanyID		end = case when vm.CompanyID	is null then 1	else vm.CompanyID		end
								and (
											/*The exclusion applies only to validations processed with the range for exclusion*/
											(
													f.DateKey between vm.ExcludeFromDate and vm.ExcludeToDate
												and vm.Exclude_Always = 0
											)
										OR
											/*always exclude the validation*/
											(
												vm.Exclude_Always = 1
											)
									)
								and (
											/*impacted date is within the exclusion impact range*/
											(
													f.ImpactDateKey between vm.ImpactDateKey_ExcludeStart and vm.ImpactDateKey_ExcludeEnd
												and vm.ImpactDate_ExcludeAlways = 0
											)
										OR
											/*always exclude the validation*/
											(
												vm.ImpactDate_ExcludeAlways = 1
											)
									)
						)


```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
