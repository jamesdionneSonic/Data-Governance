# Data Feed Final Targets

This summarizes the final table or file targets found in the Sonic Data Lineage DevOps artifacts for the requested feeds. It separates feed/package names from final table names, because several feeds use folder or project names that do not appear in the final business table name.

## FUEL

The top-level `FUEL` package evidence I found is orchestration/audit oriented. I did not find a final business fact table with `Fuel` in the table name for the top-level `FUEL` feed.

| Package                                                                | Final target found                         | Target type         | Notes                                                                                                                 |
| ---------------------------------------------------------------------- | ------------------------------------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `FUEL.DataMartEvent.Sonic_DW_FUEL_MSTR_DataMartEvent_Cube_Master.dtsx` | `L1-5FSQL-01.Sonic_DW.dbo.MSTR_EventAudit` | Audit/control table | Downstream answer card shows one downstream object, `MSTR_EventAudit`; this does not look like a business fact table. |

Evidence:

- `answers/downstream/by-object-id/3ed8e76d89cace23.json`
- `servers/V1-SSIS25-01,_11040/ssis_packages/FUEL/DataMartEvent/Sonic_DW_FUEL_MSTR_DataMartEvent_Cube_Master.dtsx.md`

## FORCE

FORCE uses final Sonic_DW fact tables, but the final table names are service/parts subject names rather than `FORCE`-named tables.

| Package                            | Final business table written                         | Other targets / notes                                                                             |
| ---------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `SONIC_Fact_PartsSalesDetail.dtsx` | `L1-5FSQL-01.Sonic_DW.dbo.Fact_PartsSalesDetail`     | Also writes staging/helper objects and `SSIS.Audit.Fact_DataAudit`.                               |
| `SONIC_Fact_Service.dtsx`          | `L1-5FSQL-01.Sonic_DW.dbo.Fact_Service`              | Also writes staging/helper objects and `SSIS.Audit.Fact_DataAudit`.                               |
| `SONIC_Fact_ServiceDetail.dtsx`    | `L1-5FSQL-01.Sonic_DW.dbo.Fact_ServiceDetail`        | Also writes `Fact_MenuOpportunity`, staging/helper objects, audit, and references `Fact_Service`. |
| `Fact_Service_WIP_Snapshot.dtsx`   | `L1-5FSQL-01.Sonic_DW.dbo.Fact_Service_WIP_Snapshot` | Also writes `SSIS.AUDIT.Fact_DataAudit`.                                                          |

Evidence:

- `servers/V1-SSIS25-01,_11040/ssis_packages/FORCE/FORCE_-_Dependency_Check_and_Load/SONIC_Fact_PartsSalesDetail.dtsx.md`
- `servers/V1-SSIS25-01,_11040/ssis_packages/FORCE/FORCE_-_Dependency_Check_and_Load/SONIC_Fact_Service.dtsx.md`
- `servers/V1-SSIS25-01,_11040/ssis_packages/FORCE/FORCE_-_Dependency_Check_and_Load/SONIC_Fact_ServiceDetail.dtsx.md`
- `servers/V1-SSIS25-01,_11040/ssis_packages/FORCE/FORCE_-_Dependency_Check_and_Load/Fact_Service_WIP_Snapshot.dtsx.md`

## FIRE

The FIRE package evidence separates the underlying Sonic_DW source table from the exported feed file.

| Package                          | Final table / feed target                                                          | Target type           | Notes                                                                            |
| -------------------------------- | ---------------------------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------- |
| `FIRE-/Run/SONIC_FTP_Sales.dtsx` | `Sonic_DW.dbo.FactFireSummary`                                                     | Source business table | The package maps from `SODB - FactFireSummary` / `Sonic_DW.dbo.FactFireSummary`. |
| `FIRE-/Run/SONIC_FTP_Sales.dtsx` | `V1-SSIS25-01, 11040.SSISDB.external_sources.FIRE-.Run.SONIC_FTP_Sales.DFFL_-_Csv` | External file output  | The package writes a flat-file destination named `DFFL - Csv`.                   |
| `KPI.DataLoad.KPI_FIRE.dtsx`     | `L1-5FSQL-01.Sonic_DW.kpi.Fact_KPIMetricActual_Calc`                               | KPI fact table        | This is a KPI metric load tied to FIRE, not the FIRE sales/feed file itself.     |

Evidence:

- `servers/V1-SSIS25-01,_11040/ssis_packages/FIRE-/Run/SONIC_FTP_Sales.dtsx.md`
- `servers/V1-SSIS25-01,_11040/ssis_packages/KPI/DataLoad/KPI_FIRE.dtsx.md`
- `servers/L1-5FSQL-01/databases/Sonic_DW/tables/dbo__FactFireSummary.md`

## FUEL_II

`FUEL/II` has final fact loads, but the final table names are GL subject names, not `Fuel`-named tables.

| Package                             | Final business table written                      | Other targets / notes                                                                              |
| ----------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `SONIC_GLSchedule_FactLoad.dtsx`    | `L1-5FSQL-01.Sonic_DW.dbo.Fact_GLSchedule`        | Reads `ETL_Staging.dbo.vw_Fuel_II_wrk_GLSchedule_Step_5`; also writes audit.                       |
| `SONIC_GLSchedule_FactLoad_6A.dtsx` | `L1-5FSQL-01.Sonic_DW.dbo.Fact_GLSchedule`        | Reads `ETL_Staging.dbo.vw_Fuel_II_wrk_GLSchedule_Step_6A`; also writes audit.                      |
| `SONIC_DW_GLChecks_FactLoad.dtsx`   | `L1-5FSQL-01.Sonic_DW.dbo.Fact_GLChecks`          | Reads `ETL_Staging.wrk.GLCheck_Step_3`; also writes audit.                                         |
| `SONIC_Fact_GLScheduleSummary.dtsx` | `L1-5FSQL-01.Sonic_DW.dbo.Fact_GLScheduleSummary` | Also writes `ETL_Staging.wrk.AR_schedule_step_3`, `ETL_Staging.wrk.AR_schedule_step_4`, and audit. |

Evidence:

- `servers/V1-SSIS25-01,_11040/ssis_packages/FUEL/II/SONIC_GLSchedule_FactLoad.dtsx.md`
- `servers/V1-SSIS25-01,_11040/ssis_packages/FUEL/II/SONIC_GLSchedule_FactLoad_6A.dtsx.md`
- `servers/V1-SSIS25-01,_11040/ssis_packages/FUEL/II/SONIC_DW_GLChecks_FactLoad.dtsx.md`
- `servers/V1-SSIS25-01,_11040/ssis_packages/FUEL/II/SONIC_Fact_GLScheduleSummary.dtsx.md`

## Turbo

The Turbo evidence I found is a data-quality/metric package, not a Turbo-named business fact table.

| Package                                  | Final target found                            | Target type  | Notes                                                                                                                                  |
| ---------------------------------------- | --------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `DQMetrics.DQ.DQ_Turbo_Consistency.dtsx` | `L1-5FSQL-01.Sonic_DW.Metric.EDWH_METRIC_TBL` | Metric table | `reads_from` is empty in the package artifact; this appears to load/update a metric consistency target rather than a Turbo fact table. |

Evidence:

- `servers/V1-SSIS25-01,_11040/ssis_packages/DQMetrics/DQ/DQ_Turbo_Consistency.dtsx.md`

## MCI

MCI creates an outbound file from Sonic_DW data. I did not find an MCI-named final fact table in the package evidence.

| Package                                          | Source table(s) / output target                                             | Target type           | Notes                                                                                          |
| ------------------------------------------------ | --------------------------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------- |
| `MCI.Franchise.MCI_FranchiseDMS_CreateFile.dtsx` | Reads `L1-5FSQL-01.Sonic_DW.dbo.FactFireSummary` plus supporting dimensions | Source business table | The package artifact shows `writes_to:` with no database table listed.                         |
| `MCI.Franchise.MCI_FranchiseDMS_CreateFile.dtsx` | `MCI.Franchise.MCI_FranchiseDMS_CreateFile.dtsx.FF_Create OutputFile`       | External file dataset | External-source artifact shows this output file dataset is created by the create-file package. |
| `MCI.Franchise.MCI_FranchiseDMS_Master.dtsx`     | No direct table writes                                                      | Orchestrator          | Calls `MCI_FranchiseDMS_CreateFile.dtsx` and process-management procedures.                    |
| `MCI.Franchise.MCI_FranchiseDMS_MoveFile.dtsx`   | No direct table writes                                                      | File/process step     | Process-management and move-file step; no table target listed.                                 |

Evidence:

- `servers/V1-SSIS25-01,_11040/ssis_packages/MCI/Franchise/MCI_FranchiseDMS_CreateFile.dtsx.md`
- `servers/V1-SSIS25-01,_11040/ssis_external_sources/MCI/Franchise/MCI_FranchiseDMS_CreateFile.dtsx/FF_Create_OutputFile.md`
- `servers/V1-SSIS25-01,_11040/ssis_packages/MCI/Franchise/MCI_FranchiseDMS_Master.dtsx.md`
- `servers/V1-SSIS25-01,_11040/ssis_packages/MCI/Franchise/MCI_FranchiseDMS_MoveFile.dtsx.md`

## Quick Read

| Feed      | Final table or output target pattern                                                                             |
| --------- | ---------------------------------------------------------------------------------------------------------------- |
| `FUEL`    | No business fact table found; top-level evidence points to `Sonic_DW.dbo.MSTR_EventAudit`.                       |
| `FORCE`   | Final tables are `Fact_Service`, `Fact_ServiceDetail`, `Fact_Service_WIP_Snapshot`, and `Fact_PartsSalesDetail`. |
| `FIRE`    | Core table is `FactFireSummary`; feed package writes a CSV external-source output.                               |
| `FUEL_II` | Final tables are `Fact_GLSchedule`, `Fact_GLChecks`, and `Fact_GLScheduleSummary`.                               |
| `Turbo`   | Metric target found: `Sonic_DW.Metric.EDWH_METRIC_TBL`; no Turbo fact table found.                               |
| `MCI`     | Outbound file feed created from `FactFireSummary`; no MCI fact table found.                                      |
