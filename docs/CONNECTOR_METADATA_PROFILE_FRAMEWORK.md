# Connector Metadata Profile Framework

## Purpose

The connector metadata profile framework captures safe operational metadata for sources that are not databases and are not BI/reporting platforms.

It profiles:

- Salesforce CRM objects, reports, dashboards, and report-object dependencies
- Cloud storage inventories, paths, inferred schemas, classifications, and storage lineage
- Catalog platform assets, classifications, glossary terms, schemas, and lineage
- Pipeline/orchestration assets, tasks, datasets, connections, schedules, jobs, and lineage
- Code repository assets, Python scripts, SQL files, notebooks, dbt artifacts, and code lineage
- API endpoint contracts, operations, schemas, and API lineage
- Kafka clusters, topics, schemas, consumers, and streaming lineage
- SAP service catalogs, business objects, extractors, OData metadata, and ERP lineage

It does not profile raw source values. The profile is metadata-only and returns no secrets, credential references, or unrestricted source payload values.

Connector metadata profile persistence, markdown summaries, profile indexes, and DevOps/Azure data pack publication must follow `docs/PROFILE_INDEX_SPEC.md`. Metadata profile indexes may store inventory, schemas, classifications, relationships, lineage, coverage gaps, and remediation errors. They must not store raw source payloads, sample values, credentials, tokens, or unrestricted business data.

## Supported Connectors

- `salesforce`
- `azure_storage`
- `aws_s3`
- `gcs`
- `azure_purview`
- `aws_glue`
- `aws_athena`
- `gcp_dataplex`
- `azure_data_factory`
- `ssis`
- `airflow`
- `dbt`
- `git_repository`
- `openapi`
- `kafka`
- `sap`

## API

```http
POST /api/v1/connectors/:id/metadata-profile/plan
POST /api/v1/connectors/:id/metadata-profile/run
```

The routes use the same managed connector permission model:

- `view` permission can plan a profile.
- `run` permission can run a profile.
- Stored credentials stay server-side.

## Output

Each run returns:

- `profile_type: connector_metadata_profile`
- `assets`
- `storage_locations`
- `objects`
- `schemas`
- `columns`
- `classifications`
- `glossary_terms`
- `pipelines`
- `tasks`
- `jobs`
- `datasets`
- `connections`
- `schedules`
- `repositories`
- `code_assets`
- `tests`
- `reports`
- `dashboards`
- `api_endpoints`
- `streaming_assets`
- `sap_extractors`
- `lineage_edges`
- `coverage_checks`
- `gaps`
- `top_impact_candidates`
- `summary`
- `package`
- `confluence`
- `answer`

## Error Handling

The framework uses the shared connector error model:

- `CONNECTOR_CONFIG_ERROR`
- `CONNECTOR_CREDENTIAL_ERROR`
- `CONNECTOR_STREAM_ERROR`
- `CONNECTOR_RUNTIME_ERROR`

Unsupported connectors return a `CONNECTOR_CONFIG_ERROR` with remediation that names the currently supported metadata-profile connector families. OpenAPI, Kafka, and SAP are now part of the supported metadata-profile set.

## Scheduling

Profile scheduling uses the managed connector scheduler instead of a separate job system:

```http
GET /api/v1/connectors/profile-schedules
POST /api/v1/connectors/profile-schedules
GET /api/v1/connectors/profile-schedules/:scheduleId
PUT /api/v1/connectors/profile-schedules/:scheduleId
DELETE /api/v1/connectors/profile-schedules/:scheduleId
POST /api/v1/connectors/profile-schedules/:scheduleId/run
GET /api/v1/connectors/profile-schedules/:scheduleId/runs
GET /api/v1/connectors/profile-schedules/status
POST /api/v1/connectors/profile-schedules/worker/start
POST /api/v1/connectors/profile-schedules/worker/stop
POST /api/v1/connectors/profile-schedules/tick
```

Schedule type `auto` resolves to:

- aggregate database profile for database and warehouse connectors
- BI report profile for BI connectors
- connector metadata profile for cloud, catalog, pipeline, repository, API, Kafka, Salesforce, and SAP connectors

Schedules store sanitized options only. Inline payloads such as `metadata_payload`, test mocks, and credential-like fields are stripped or masked before the schedule is persisted.

The scheduler has an in-process worker plus a local runtime store for environments that do not yet have SQL operational storage. By default the store writes to `data/_runtime/profiles`, and each run exports sanitized JSON plus Confluence-ready markdown artifacts. Use `PROFILE_SCHEDULER_ENABLED`, `PROFILE_SCHEDULER_INTERVAL_MS`, `PROFILE_SCHEDULER_TICK_LIMIT`, `PROFILE_RUNTIME_DIR`, `PROFILE_SCHEDULER_STORE_PATH`, and `PROFILE_ARTIFACT_DIR` to control the worker and file locations.

## Architecture Rule

Do not build separate profiling engines for storage, catalog, pipeline, repository, and Salesforce connectors. Tool-specific API details belong in connector adapters and source clients. Metadata profile interpretation belongs in `src/services/connectorMetadataProfileService.js`, which consumes canonical events from the shared extraction runtime.

For Azure Data Factory, metadata profiles may include factory, pipeline,
activity, dataset, linked-service, trigger, integration-runtime, managed-network,
lineage, and bounded run-history metadata. Manual pipeline starts are not
metadata profiles; use `docs/adr/ADR-010-ADF-Operations-Through-Saved-Connector.md`
and `docs/ADF_PIPELINE_OPERATIONS.md` for ADF trigger operations.

For AWS, connector metadata profiles and lineage ingestion are separate but
compatible layers. `aws_s3`, `aws_glue`, `aws_athena`, and `quicksight` use the
shared connector runtime for metadata acquisition. AWS lineage interpretation
belongs in `engines/connectors/aws/`, where JavaScript creates native AWS
assets and deterministic edges before the source metadata delta engine runs.
Current AWS connector records are explicitly routed to MDP through
`config/aws-lineage-product-routing.json`; future AWS connectors must declare
their own product route instead of inheriting MDP.
See `docs/adr/ADR-029-AWS-And-Non-Database-Lineage-Ingestion.md` and
`docs/AWS_LINEAGE_INGESTION.md`.
