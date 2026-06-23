# Snowflake Connector: bipslyv / tlb12786

## Purpose

This is the permanent framework connector for the Snowflake account opened through:

`https://app.snowflake.com/bipslyv/tlb12786/`

The Snowsight URL maps to the Snowflake organization/account pair:

- Organization: `bipslyv`
- Account name: `tlb12786`
- Connector account identifier: `bipslyv-tlb12786`
- Saved connector id: `snowflake-bipslyv-tlb12786`

## Registration

Register or refresh the saved connector:

```powershell
npm run connector:snowflake:bipslyv:register
```

That command saves the connector metadata through `connectorService.upsertConnector`.
It does not perform a live login unless explicitly requested.

To verify the live connection and run a bounded metadata harvest:

```powershell
npm run connector:snowflake:bipslyv:register -- --verify-live
```

## Runtime Secrets

No Snowflake username, password, or token is stored in the repository or in the
saved connector record. The connector stores environment-variable names and the
runtime resolves them when executing Snowflake metadata or profiling work.

Required environment variables:

- `SNOWFLAKE_BIPSLYV_TLB12786_USERNAME`
- `SNOWFLAKE_BIPSLYV_TLB12786_PASSWORD`
- `SNOWFLAKE_BIPSLYV_TLB12786_WAREHOUSE`
- `SNOWFLAKE_BIPSLYV_TLB12786_DATABASE`

Optional environment variables:

- `SNOWFLAKE_BIPSLYV_TLB12786_SCHEMA`
- `SNOWFLAKE_BIPSLYV_TLB12786_ROLE`

## Framework Notes

The connector uses the existing Snowflake native-driver path in
`src/services/connectorRuntime/sourceClients.js` and aggregate profiling path in
`src/services/connectorRuntime/profileExecutors.js`.

Runtime value resolution supports `runtime_env` maps on both connector config and
credentials so secret-bearing values can be supplied by the service environment
without being persisted in the connector store.
