# Snowflake Lineage Incremental Process

## Default Rule

Snowflake lineage ingestion is incremental by default.

Use:

```powershell
npm run snowflake:lineage:ingest
```

Default behavior:

- uses the saved connector `snowflake-bipslyv-tlb12786`;
- clears the local dead proxy variables for the Snowflake SDK process unless
  `--respect-proxy` is passed;
- runs `SHOW DATABASES`;
- harvests visible non-internal database information schemas;
- writes only new or changed Snowflake object markdown/context artifacts;
- upserts only the Snowflake slice in the DevOps catalog repo;
- does not delete stale Snowflake objects.

The command writes an ingestion state file:

`../Sonic-data-lineage/reports/snowflake-bipslyv-tlb12786-ingestion-state.json`

Object signatures in that file determine whether an object is new, changed, or
unchanged on the next run.

## Full Refresh

Use full refresh only when stale Snowflake objects should be removed or the
entire Snowflake slice must be rewritten:

```powershell
npm run snowflake:lineage:ingest -- --full-refresh
```

Do not use full-system catalog rebuild commands for routine Snowflake metadata
refreshes. Rebuild the runtime package after the Snowflake slice changes:

```powershell
npm run lineage:runtime:package
npm run lineage:runtime:check
npm run lineage:answers:check
npm run lineage:runtime:sync
```

## Confluence Dry Runs

Human-readable Snowflake database catalog pages:

```powershell
node scripts/build-human-confluence-catalog-dry-run.mjs --database CDK_ROADSTER_ELEAD_SONIC,HYPERNOVA_SONIC_CUSTACCESS,SNOWFLAKE_SAMPLE_DATA
```

Computer-friendly Snowflake Rovo retrieval artifacts:

```powershell
npm run confluence:snowflake-rovo:dry-run
```

Live Confluence publish remains a separate approval step after dry-run review.

## Current Scope

Current harvested object-bearing databases:

- `CDK_ROADSTER_ELEAD_SONIC`
- `HYPERNOVA_SONIC_CUSTACCESS`
- `SNOWFLAKE_SAMPLE_DATA`

The internal `SNOWFLAKE` database is skipped by default. Pass
`--include-snowflake-internal` only when internal/account-usage metadata is
explicitly in scope.
