---
name: vw_HiringProcess_Slides
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

1- **Type**: View

- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_HiringProcess_Slides
AS
SELECT        Hire_ID, Hire_SlideNum, Hire_SlideCategory, Hire_SlideCategoryOrder, Hire_SlideDesc, '\images\shared\hiring\slides\slide' + CAST(Hire_SlideNum AS varchar(10)) + '.jpg' AS Hire_SlideLocation
FROM            dbo.HiringProcess_Slides

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
