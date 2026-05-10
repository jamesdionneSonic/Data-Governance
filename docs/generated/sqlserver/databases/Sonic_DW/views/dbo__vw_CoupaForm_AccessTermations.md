---
name: vw_CoupaForm_AccessTermations
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

1- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_CoupaForm_AccessTermations
AS
WITH CoupaNames AS (SELECT        easy_form_response_id, first_name, last_name, middle_initial, access_termination_date, LTRIM(RTRIM(first_name + '.' + ISNULL(NULLIF (middle_initial, '') + '.', '') + last_name)) AS Pattern_FullDot, 
                                                                             LTRIM(RTRIM(first_name + '.' + last_name)) AS Pattern_NoMI, LTRIM(RTRIM(first_name + ISNULL(middle_initial, '') + last_name)) AS Pattern_C
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
