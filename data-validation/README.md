# Data Validation Lab

The Data Validation Lab is the local, repeatable validation area for comparing
candidate data sources against the current source of record.

It is designed for:

- read-only SQL against source systems;
- stable local CSV outputs;
- Excel dashboards that refresh from `current/`;
- daily one-command execution;
- exception tracking across refreshes.

## Layout

```text
data-validation/
  datasets/
    <dataset-id>/
      config/
      sql/
      scripts/
      current/
      runs/
      excel/
```

## Current Dataset

`datasets/snowflake-dms-shared-consumption`

Compares Snowflake shared consumption tables against SQL Server DMS for:

- Jaguar Land Rover Santa Monica;
- Mercedes-Benz of Calabasas.

## Daily Shape

Once implemented, daily operation should be:

```powershell
.\data-validation\datasets\<dataset-id>\scripts\run_validation.ps1
```

Then open the Excel workbook under the dataset `excel/` folder and refresh the
queries connected to `current/` CSVs.

## Source Control Rule

Business-data CSVs are local working outputs and are ignored by Git. Commit the
workflow, SQL, config, contracts, and workbook templates only.
