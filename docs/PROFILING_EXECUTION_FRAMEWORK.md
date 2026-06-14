# Profiling Execution Framework

## Purpose

The profiling framework produces metadata-safe aggregate statistics for governed tables and views:

- row count
- null count and null percent
- distinct count where safe
- min, max, and mean for numeric/date columns where safe
- freshness, limitations, skipped assets, and execution errors

It never stores raw row values. Sensitive columns are automatically limited to safer aggregate checks.

Profile persistence, DevOps/Azure data pack publication, markdown summaries, and Codex skill access are governed by `docs/PROFILE_INDEX_SPEC.md`. That specification is the authoritative safety contract for what profile artifacts and profile indexes may store.

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

Profile output is intentionally split into separate storage layers:

- operational run store for local connector/scheduler state
- sanitized run artifacts for JSON/markdown evidence
- compact profile indexes for app, skill, and DevOps/Azure data pack lookup

Do not use large markdown summaries as the primary Azure-scale profile index.

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

## Scheduling

Recurring profile work is handled by the managed connector profile scheduler:

| Endpoint | Use |
| --- | --- |
| `GET /api/v1/connectors/profile-schedules` | List schedules visible to the caller. |
| `POST /api/v1/connectors/profile-schedules` | Create an admin-owned profile schedule. |
| `GET /api/v1/connectors/profile-schedules/:scheduleId` | Read one schedule. |
| `PUT /api/v1/connectors/profile-schedules/:scheduleId` | Update cadence, status, type, or options. |
| `DELETE /api/v1/connectors/profile-schedules/:scheduleId` | Delete a schedule. |
| `POST /api/v1/connectors/profile-schedules/:scheduleId/run` | Run one active schedule now. |
| `GET /api/v1/connectors/profile-schedules/:scheduleId/runs` | Read sanitized run history for one schedule. |
| `GET /api/v1/connectors/profile-schedules/status` | Read worker, persistence, and artifact status. |
| `POST /api/v1/connectors/profile-schedules/worker/start` | Start the in-process scheduler worker. |
| `POST /api/v1/connectors/profile-schedules/worker/stop` | Stop the in-process scheduler worker. |
| `POST /api/v1/connectors/profile-schedules/tick` | Run all due active schedules up to a configured limit. |

### Future Read-Only Queue Health Contract

The current UI can derive queue-health explanations from existing schedules, queue previews, scheduler status, and recent run history. If those sources stop being sufficient, add a read-only summary endpoint rather than changing scheduler execution:

| Endpoint | Use |
| --- | --- |
| `GET /api/v1/connectors/profile-schedules/queue-health` | Return queue-health summaries for schedules visible to the caller. |
| `GET /api/v1/connectors/profile-schedules/:scheduleId/queue-health` | Return queue-health summary for one visible schedule. |

This contract is intentionally read-only. It must not:

- start, stop, tick, pause, activate, delete, reseed, or reorder schedules
- change profile execution, queue selection, timeout penalty calculation, or freshness windows
- change connector credentials, Windows-auth behavior, runtime permissions, or role visibility
- change profile artifacts, profile-index output, publish behavior, or artifact scrubbing
- require exact pending counts when the current runtime can only support `unknown`

Recommended response shape:

```json
{
  "generated_at": "2026-06-13T12:00:00.000Z",
  "source": "profile_scheduler",
  "schedules": [
    {
      "schedule_id": "vendor-live-profile",
      "schedule_name": "VendorData live queue",
      "connector_id": "vendor-data",
      "profile_type": "aggregate",
      "status": "running",
      "plain_status": "Running normally",
      "plain_summary": "12 live profile objects have completed for this queue.",
      "next_action": "Monitor next run or open queue detail for current progress.",
      "last_run_at": "2026-06-13T11:40:00.000Z",
      "next_run_at": "2026-06-13T12:40:00.000Z",
      "last_delta": {
        "completed_live": 3,
        "failed_live": 0,
        "fresh_skipped": 2,
        "timeout_penalized": 1
      },
      "counts": {
        "completed_live": 12,
        "pending_live": null,
        "pending_live_known": false,
        "failed_live": 0,
        "fresh_skipped": 2,
        "timeout_penalized": 1,
        "selected_this_run": 3
      },
      "blocker": null,
      "recommended_operator_action": "none",
      "publish_status": "published",
      "warnings": [
        {
          "code": "PENDING_COUNT_UNKNOWN",
          "message": "The current runtime does not expose an exact pending total for this schedule."
        }
      ],
      "safe_to_show_by_default": true
    }
  ]
}
```

Field rules:

- `pending_live` may be `null` only when `pending_live_known` is `false`; clients must show `Unknown` instead of guessing.
- `plain_status`, `plain_summary`, and `next_action` must be safe default UI text and must not include secrets, credentials, raw SQL, raw rows, sample values, connection strings, token values, or vault references.
- `blocker` should use normalized user-facing categories such as `needs_login_or_vpn`, `missing_column_metadata`, `network_unreachable`, `timeout_retry`, `publish_warning`, or `scheduler_stopped`.
- `recommended_operator_action` should be one of `none`, `open_queue_detail`, `confirm_login_or_vpn`, `refresh_metadata`, `retry_run`, `retry_publish`, `activate_schedule`, or `start_worker`.
- `last_delta` should describe the newest observed change since the previous summary when available, and may be omitted when the runtime cannot compute it without new durable state.

Schedule type `auto` resolves to the existing profile engines: aggregate profiling for database/warehouse connectors, BI report profiling for BI connectors, and metadata profiling for cloud/catalog/storage/pipeline/repository/API/Kafka/Salesforce/SAP connectors. Schedule options are sanitized before persistence so raw payloads, mocks, secrets, tokens, and vault references are not stored.

Recurring schedules are not dry-run previews. Schedule create/update requests must persist `dry_run: false` and a live execution mode for operational profile jobs. Dry-run planning remains available only through explicit ad-hoc plan/preview endpoints.

Before a live schedule run builds aggregate SQL, the planner must verify that each selected live asset has usable column metadata. If selected assets are missing columns, the runtime must perform targeted metadata enrichment through the saved connector, update the metadata used by the planner, and replan the same run. If enrichment succeeds, the run proceeds with live aggregate actions. If enrichment fails, the run fails or partial-fails with an operator-visible reason.

A live schedule run must not be marked successful when selected assets produced no actions because column metadata was missing. In that case, the run summary must identify the blocked assets and report a status such as `partial_failure` or `failed` rather than metadata-only success.

The application starts an in-process worker on server boot unless `PROFILE_SCHEDULER_ENABLED=false` or the process is running tests. The worker ticks every `PROFILE_SCHEDULER_INTERVAL_MS` milliseconds, defaults to 60 seconds, and uses `PROFILE_SCHEDULER_TICK_LIMIT` to cap each pass.

When SQL operational storage is not available, scheduler state is persisted locally under `data/_runtime/profiles` by default. Override with:

- `PROFILE_SCHEDULER_PERSISTENCE=on|off`
- `PROFILE_RUNTIME_DIR`
- `PROFILE_SCHEDULER_STORE_PATH`
- `PROFILE_ARTIFACT_DIR`

Each schedule run writes sanitized JSON plus Confluence-ready markdown artifacts. The runtime store keeps connector status, schedules, run history, and snapshots, but strips or masks inline payloads, tokens, secrets, and vault references. This is a local operational store, not a markdown source-of-truth export.

Published profile indexes should be generated into the lineage runtime package under `profile-index/` and included in the DevOps/Azure data pack only after safety validation confirms no forbidden raw values or secrets are present.

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
- profile scheduler tests for schedule CRUD, due ticks, repeated-failure pause behavior, sanitized run history, status endpoints, and local artifact export
- profile scheduler tests proving recurring schedules cannot persist `dry_run: true`, missing column metadata triggers targeted enrichment before planning, and zero-action live runs caused by missing columns cannot report success
- Playwright memory-stability coverage that cycles major app views and asserts no page errors, no non-favicon 4xx resources, and bounded heap growth
- profile index safety tests that fail when forbidden fields such as `sample_values`, `raw_rows`, `preview_data`, `example_value`, `raw_payload`, `credential`, `token`, `secret`, or `connection_string` appear in persisted profile index output
