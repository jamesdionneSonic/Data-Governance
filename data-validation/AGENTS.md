# Data Validation Lab Agent Guidance

Follow `docs/adr/ADR-023-Repeatable-Read-Only-Data-Validation-Lab.md` and
`docs/DATA_VALIDATION_LAB_CONTRACT.md` before changing this folder.

## Hard Rules

- Do not create, alter, drop, insert, update, delete, merge, or truncate source
  system data.
- Do not commit business-data CSVs, raw row samples, credentials, tokens, or
  connection strings with secrets.
- Keep Excel workbooks as review surfaces. Put comparison logic in scripts and
  SQL files.
- Keep daily operations executable by one command after setup.
- Treat DMS as source of record for `snowflake-dms-shared-consumption` until an
  explicit governance decision changes that rule.

## Dataset Work

Each dataset must stay under:

```text
data-validation/datasets/<dataset-id>
```

Use bounded SQL and stable CSV output names. If detail extracts are needed,
respect the row limit in `config/validation-scope.yml`.

## Publishing Boundary

This folder is local validation infrastructure. Do not publish row-level outputs
to Confluence or DevOps unless a separate approved packet explicitly allows it.
