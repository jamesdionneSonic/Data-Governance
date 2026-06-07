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

Warehouse connectors advertise `supports_profiling: true`. Live execution remains `supports_live_profile: false` until a source-specific executor is attached. That is intentional: a connector should return a clear remediation error instead of pretending to profile a live source.

To make a connector live-profile capable, implement an executor with:

```js
async runProfileAction(action) {
  // Run action.query.sql using read-only credentials and source timeout settings.
  // Return aggregate profile rows only. Do not return raw values.
}
```

## UI

Metric Intelligence now includes a Profile Execution panel. It can:

- generate a safe plan
- run dry-run/simulated/live modes
- show safety status and no-raw-values status
- preview generated SQL
- show a Confluence summary preview
