# Profiling Execution Framework

## Purpose

The profiling framework produces metadata-safe aggregate statistics for governed tables and views:

- row count
- null count and null percent
- distinct count where safe
- min, max, and mean for numeric/date columns where safe
- freshness, limitations, skipped assets, and execution errors

It never stores raw row values. Sensitive columns are automatically limited to safer aggregate checks.

## Execution Modes

| Mode | What It Does | Source Impact |
| --- | --- | --- |
| `dry_run` | Builds the profile plan and generated SQL only. | No source query. |
| `simulate` | Produces deterministic aggregate sample results for workflow/UI validation. | No source query. |
| `live` | Uses a connector executor to run aggregate queries. | Source query, admin-only API request, read-only expected. |

## Profile Modes

| Mode | Intended Use | Guardrail |
| --- | --- | --- |
| `metadata_only` | Use existing catalog/markdown stats when available. | No live scan. |
| `sample` | Lightweight source validation. | Uses sampling and timeout settings. |
| `full_scan` | High-confidence official profile. | Blocked unless `allow_full_scan` is explicitly true. |

## Supported Database Dialects

The framework is shared, but query generation is dialect-specific.

| Connector Type | Profiling Dialect | Query Plan Status |
| --- | --- | --- |
| `sql_server` | `sql_server` | Built-in aggregate SQL with lock timeout and read-uncommitted hints. |
| `postgresql` | `postgresql` | Built-in aggregate SQL with statement and lock timeout settings. |
| `snowflake` | `snowflake` | Built-in aggregate SQL with statement timeout and approximate distinct counts. |
| `bigquery` | `bigquery` | Built-in aggregate SQL with approximate distinct counts; byte/time limits must be enforced in the BigQuery job config. |
| `databricks` | `databricks` | Built-in Spark SQL aggregate plan with approximate distinct counts; timeout is enforced by the SQL warehouse/client. |
| `aws_redshift` | `redshift` | Built-in Redshift aggregate SQL with statement timeout and approximate distinct counts where supported. |

Cloud catalogs, storage systems, BI tools, APIs, repositories, streams, and pipeline connectors can carry profile results through the same output contract, but they do not receive live SQL profile plans unless they expose a tabular database engine behind the connector.

## SQL Safety Contract

Generated plans include dialect-appropriate safety controls. SQL Server plans include:

- `SET LOCK_TIMEOUT <ms>`
- `SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED`
- read-only aggregate `SELECT` statements
- `WITH (READUNCOMMITTED)` for sampled/live source reads
- full-scan blocking unless explicitly allowed
- max table, max column, max estimated-row guardrails

PostgreSQL, Snowflake, BigQuery, Databricks, and Redshift use the equivalent safe aggregate pattern for their engines where portable syntax exists. These choices reduce blocking risk but do not make a live query mathematically impossible to affect a server. Production connectors should still use read-only credentials, a reporting replica when available, query governor/resource governor settings, warehouse/job timeout settings, and scheduled off-peak windows for larger profiles.

## Output Contract

The API returns a computer-friendly package:

- `run`: execution status, warnings, errors, safety settings, aggregate profiles
- `package`: JSON export contract suitable for `profiles/<asset-id>.profile.json`
- `confluence`: human-safe markdown summary
- `answer`: plain-English status for UI or assistant responses

The same aggregate profile can be merged back into an asset object with:

- asset-level `row_count`
- asset-level `profile_summary`
- column-level `null_count`, `null_percent`, `distinct_count`, `min`, `max`, `mean`, and `profiled_at`

## API

| Endpoint | Use |
| --- | --- |
| `GET /api/v1/profiling/contract` | Describes supported modes, safety defaults, statistics, and output targets. |
| `POST /api/v1/profiling/plan` | Builds a profiling plan from catalog objects or supplied assets. |
| `POST /api/v1/profiling/run` | Runs `dry_run`, `simulate`, or `live` framework mode. |
| `POST /api/v1/profiling/apply` | Returns an asset object with aggregate profile metadata merged in. |
| `POST /api/v1/profiling/confluence-summary` | Builds a Confluence-safe markdown summary from a run. |

## Connector Integration

Warehouse connectors advertise `supports_profiling: true`. Database-backed connectors can now run through the managed connector runtime with `supports_live_profile: true` when the connector type has a supported executor path.

Supported live executor paths:

| Connector Type | Live Executor Path | Notes |
| --- | --- | --- |
| `sql_server` | Direct `mssql` driver | Uses read-only aggregate SQL, one-connection pool, query timeout, and lock timeout. |
| `postgresql` | Direct `pg` driver | Uses read-only aggregate SQL with statement and query timeout settings. |
| `snowflake` | Direct `snowflake-sdk` driver | Uses the Snowflake Node driver and returns aggregate rows only. |
| `bigquery` | BigQuery REST query API | Requires access token and `project_id`; does not retain raw values. |
| `databricks` | Databricks SQL Statements REST API | Requires workspace URL, token/PAT, and SQL warehouse ID. |
| `aws_redshift` | Direct AWS SDK v3 Redshift Data API | Uses `ExecuteStatement`, polls `DescribeStatement`, and reads JSON aggregate results with `GetStatementResult`. An explicit `profile_endpoint` can still override this path. |

The connector runtime also supports `mockProfileRows` for deterministic tests and demos. Mock rows must be aggregate rows only, with aliases like `row_count`, `<column>__null_count`, `<column>__distinct_count`, `<column>__min`, `<column>__max`, and `<column>__mean`.

To make a connector live-profile capable, implement an executor with:

```js
async runProfileAction(action) {
  // Run action.query.sql using read-only credentials and source timeout settings.
  // Return aggregate profile rows only. Do not return raw values.
}
```

Managed connector profiling APIs:

| Endpoint | Use |
| --- | --- |
| `POST /api/v1/connectors/:id/profile/plan` | Builds a source-specific aggregate profile plan for a managed connector. |
| `POST /api/v1/connectors/:id/profile/run` | Runs connector-backed profiling with connector permissions and admin-only live execution. |
| `POST /api/v1/profiling/plan` with `connector_id` | Delegates planning to the managed connector runtime. |
| `POST /api/v1/profiling/run` with `connector_id` | Delegates execution to the managed connector runtime. |

Live connector profile runs record `raw_data_captured: false`, `secret_exposed: false`, and `profile_run: true` in connector run history. Credential values and vault references are not returned in profile run payloads.

## UI

Metric Intelligence now includes a Profile Execution panel. It can:

- generate a safe plan
- run dry-run/simulated/live modes
- show safety status and no-raw-values status
- preview generated SQL
- show a Confluence summary preview

## Validation

Automated coverage includes:

- unit tests for dialect-specific plan generation and aggregate row parsing
- connector service tests for managed connector profile plan/run, permission checks, and remediation errors
- connector API tests for `/profile/plan` and `/profile/run`
- profiling API tests for `connector_id` delegation
- Playwright memory-stability coverage that cycles major app views and asserts no page errors, no non-favicon 4xx resources, and bounded heap growth
