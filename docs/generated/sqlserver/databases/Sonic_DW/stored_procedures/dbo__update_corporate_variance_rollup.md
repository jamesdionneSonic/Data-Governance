---
name: update_corporate_variance_rollup
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

CREATE PROC [dbo].[update_corporate_variance_rollup] (@SecLevel0_Desc VARCHAR(100),@corporatevariancerollup VARCHAR(100) = NULL) as

IF ISNULL(@corporatevariancerollup,100)   <> (SELECT top 1 ISNULL(ds.CorporateVarianceRollup,0) FROM dbo.Dim_SECRollup ds WHERE ds.SECLevel0_Desc =  @SecLevel0_Desc
order by SECLevel0_Desc)

              UPDATE
                     [Sonic_DW].dbo.Dim_SECRollup
                     SET CorporateVarianceRollup = @corporatevariancerollup
                     WHERE SECLevel0_Desc = @SecLevel0_Desc

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
