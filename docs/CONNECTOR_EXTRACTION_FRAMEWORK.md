# Connector Extraction Framework

## Purpose

The connector framework separates managed connector access from metadata extraction logic.
Admins create connectors and grant access; the extraction runtime turns every source into the same canonical metadata events.

## Architecture

1. Managed connector registry
   - Stores connector type, config, credential reference, permissions, and run history.
   - Never returns raw secrets to the frontend.

2. Extraction kernel
   - Creates the adapter for the connector.
   - Validates config and credential mode.
   - Builds extraction plans.
   - Executes streams.
   - Emits canonical events.
   - Serializes actionable errors with phase, stream, remediation, and details.

3. Adapter families
   - BI/reporting: Power BI, MicroStrategy Cloud, SSAS, Tableau, Qlik, Cognos, BusinessObjects, and similar tools.
   - Data/warehouse: SQL Server, PostgreSQL, Snowflake, BigQuery, Databricks, Redshift.
   - Cloud platform/storage: Purview, AWS Glue, S3, Dataplex, GCS, ADLS.
   - Pipeline/code/API: ADF, Airflow, dbt, Git repositories, OpenAPI.
   - Streaming/ERP/ML: Kafka, Salesforce, SAP, feature/model registries.
   - Existing SQL Server and SSIS ingestion screens are compatibility entry points only; they execute through the same SQL Server and SSIS adapters used by managed connectors.

4. Canonical event model
   - `metadata.object`
   - `metadata.column`
   - `metadata.metric`
   - `metadata.dashboard`
   - `metadata.report`
   - `metadata.dataset`
   - `metadata.semantic_model`
   - `metadata.data_source`
   - `lineage.edge`
   - `usage.event`
   - `quality.signal`
   - `extraction.warning`

## Adapter Contract

Every connector adapter implements the same behavior:

```js
{
  testConnection(),
  discoverStreams(),
  readStream(streamName, cursor),
  getCapabilities()
}
```

Adapters should only contain source-specific API details. Pagination, run history, permissions, errors, canonical event normalization, and downstream publishing belong in the shared runtime.

## Error Handling

Connector errors must be actionable:

- `CONNECTOR_CONFIG_ERROR`: missing or invalid connector config.
- `CONNECTOR_CREDENTIAL_ERROR`: missing, unsupported, or unsafe credential mode.
- `CONNECTOR_STREAM_ERROR`: unsupported stream request.
- `CONNECTOR_RUNTIME_ERROR`: live API/source failure.

Each error includes phase, connector id, connector type, stream, remediation, and details.

## BI Report Profile Framework

BI/reporting connectors use the extraction runtime to build a separate BI profile contract. This is intentionally different from database profiling:

- Database profiling runs aggregate-safe queries against tables and returns counts, null rates, distinct counts, ranges, and freshness signals.
- BI report profiling reads reporting metadata and returns report/dashboard inventory, semantic models, datasets, data sources, measures, fields, usage signals, refresh/subscription signals, and lineage relationships.
- BI report profiling never queries report result rows and never stores raw values from reports.

The managed connector API exposes:

- `POST /api/v1/connectors/:id/bi-profile/plan`
- `POST /api/v1/connectors/:id/bi-profile/run`

Both endpoints use the same connector permission model as extraction. Admins can store service-account or managed-identity credential references once, grant users `view` and `run`, and users can profile approved BI sources without seeing source secrets.

Every BI profile returns the same enterprise-safe envelope:

- `profile_type: bi_report_profile`
- `captures_raw_report_data: false`
- `raw_values_retained: false`
- `secret_exposed: false`
- structured profile summary counts
- coverage checks and gaps
- top impact candidates
- computer-friendly package output
- Confluence-ready markdown summary
- plain-English answer text for the assistant/Jarvis experience

The current shared framework covers Power BI, Power BI Report Server, MicroStrategy Cloud, SSAS, SSRS, Tableau, Looker, Qlik Cloud, Qlik Sense, Domo, Sigma, Mode, Metabase, Superset, Redash, Amazon QuickSight, Grafana, IBM Cognos, SAP BusinessObjects, Oracle Analytics, ThoughtSpot, Sisense, and Salesforce report/dashboard metadata.

## Connector Metadata Profile Framework

Cloud storage, catalog platforms, pipeline/orchestration tools, code repositories, OpenAPI, Kafka, Salesforce, and SAP use a third profile contract: connector metadata profiles. These profiles are metadata-only and do not store raw source payload values.

The managed connector API exposes:

- `POST /api/v1/connectors/:id/metadata-profile/plan`
- `POST /api/v1/connectors/:id/metadata-profile/run`

Supported metadata-profile connectors:

- Salesforce
- Azure Storage / ADLS
- Amazon S3
- Google Cloud Storage
- Microsoft Purview
- AWS Glue Data Catalog
- Google Dataplex / Data Catalog
- Azure Data Factory
- SQL Server Integration Services
- Apache Airflow
- dbt Core / Cloud
- Git repositories
- OpenAPI
- Apache Kafka
- SAP OData / ERP metadata

The profile captures inventory objects, storage locations, schemas, columns, classifications, glossary terms, pipelines, tasks, jobs, datasets, connections, schedules, repositories, code assets, tests, reports, dashboards, API endpoints, streaming assets, SAP extractors, lineage edges, coverage gaps, computer-friendly packages, Confluence-ready markdown, and assistant-ready answer text.

## Managed Profile Scheduler

All profile types can be automated through the managed connector scheduler:

- `GET /api/v1/connectors/profile-schedules`
- `POST /api/v1/connectors/profile-schedules`
- `GET /api/v1/connectors/profile-schedules/:scheduleId`
- `PUT /api/v1/connectors/profile-schedules/:scheduleId`
- `DELETE /api/v1/connectors/profile-schedules/:scheduleId`
- `POST /api/v1/connectors/profile-schedules/:scheduleId/run`
- `POST /api/v1/connectors/profile-schedules/tick`

The scheduler does not create a second extraction path. Schedule type `auto` routes to the same aggregate, BI report, or connector metadata profile service used by the manual API. Admins own schedule creation and execution, and stored schedule options are sanitized so secrets, credential references, raw metadata payloads, and test mocks are not persisted.

## Implementation Rule

The runtime is designed to harvest metadata, not business data. Connectors should collect object names, schemas, columns, measures, relationships, reports, dashboards, usage signals, lineage edges, and quality signals. They must not store raw PII values or unrestricted source data.

Profile output and DevOps/Azure data pack publication must follow `docs/PROFILE_INDEX_SPEC.md`. Connector adapters may emit canonical events and sanitized aggregate/profile metadata, but they must not persist raw source payloads, sample values, report result rows, dashboard cell values, credentials, tokens, or vault references.

Live SQL Server and SSIS adapters wrap the existing extractors so legacy ingestion and managed connectors do not become two competing engines. REST, signed HTTP, native-driver, repository, and artifact-based sources all run through the same adapter contract and emit the same canonical event model.

## Documented Bridge Adapters

Every connector type has a bridge contract. A bridge is not a second extractor; it is the common adapter shell that knows:

- required source config fields;
- accepted credential modes;
- documented source streams and endpoints;
- how to normalize live-shaped metadata payloads into canonical events;
- how to fail with operator-friendly remediation when a live source is not configured.

The live path now runs in this order:

1. Existing extractor bridge, where available, such as SQL Server and SSIS.
2. Inline payloads: `metadata_payload`, `seed_metadata`, `sample_metadata`, or test `mockMetadata`.
3. Direct source API client, where the connector has a REST/JSON metadata API.
4. Stream endpoint override: `stream_endpoints`, `source_endpoints`, or `endpoints` keyed by stream name.
5. Generic metadata endpoint fallback: `metadata_endpoint` or `catalog_endpoint`.
6. Native SDK/driver remediation when the source requires non-HTTP database/semantic-model access.

Bridge adapters accept these metadata inputs:

- `metadata_payload`: JSON metadata supplied directly with the run.
- `seed_metadata` or `sample_metadata`: JSON metadata stored in connector config.
- `metadata_endpoint` or `catalog_endpoint`: an HTTP/HTTPS endpoint that returns JSON metadata.
- `stream_endpoints` or `source_endpoints`: per-stream HTTP/HTTPS JSON endpoints for source-specific overrides.
- `mockMetadata`: test-only payload used by unit tests and extractor conformance tests.

If a connector is run with `dry_run: true`, the bridge returns a documented plan event for each requested stream. If a connector is run live with `dry_run: false` and no metadata input is configured, the run returns `CONNECTOR_RUNTIME_ERROR` with remediation that names the accepted metadata inputs, credential requirements, package requirements, or documented endpoint for the failed stream.

## Existing Extractor Conformance

- SQL Server live extraction uses `SqlServerLiveAdapter`, which delegates to `SqlServerMetadataExtractor`, then normalizes tables, views, procedures, functions, triggers, columns, and relationships into canonical events.
- SSIS live extraction uses `SsisLiveAdapter`, which delegates to `SsisMetadataExtractor`, then normalizes packages, tasks, connections, parameters, environments, agent jobs, and lineage edges into canonical events.
- Legacy routes such as `/api/v1/ingestion/connect-sql-server` and `/api/v1/ssis/extract` remain available for the current UI, but they call `runConnectorExtractionForConfig()` and return `connectorExtraction` status, adapter, stream results, summary, and errors.
- New connector implementations must follow the same pattern: source-specific API calls live inside an adapter; extraction runs, snapshots, permissions, errors, and canonical summaries stay in the shared connector runtime.

## Bridge Coverage

The bridge map currently covers:

- Databases and warehouses: SQL Server, PostgreSQL, Snowflake, BigQuery, Databricks, Redshift.
- Cloud/catalog/storage: Microsoft Purview, Azure Storage/ADLS, AWS Glue, S3, Google Dataplex/Data Catalog, GCS.
- Pipelines and code: Azure Data Factory, SSIS, Airflow, dbt, Git repositories, OpenAPI.
- BI and reporting: Power BI, Power BI Report Server, MicroStrategy Cloud, SSAS, SSRS, Tableau, Looker, Qlik, Domo, Sigma, Mode, Metabase, Superset, Redash, QuickSight, Grafana, Cognos, SAP BusinessObjects, Oracle Analytics, ThoughtSpot, Sisense.
- Streaming, ERP/CRM, and ML: Kafka, Salesforce, SAP, and feature/model registry family adapters.

The unit suite verifies every connector definition has a bridge and can emit at least one canonical dry-run event.

## Direct Source Clients

The direct source client layer currently supports REST/JSON metadata calls for:

- Airflow
- Azure Data Factory
- Microsoft Purview
- Azure Storage / ADLS Blob metadata manifests and container listings
- AWS Glue signed metadata endpoints
- AWS S3 signed bucket/object metadata endpoints
- AWS Redshift Data API signed metadata endpoints
- BigQuery
- Cognos content metadata endpoints
- Databricks Unity Catalog and Jobs
- dbt artifact URLs and configured manifest/catalog payloads
- Domo
- Google Dataplex/Data Catalog
- Google Cloud Storage
- GitHub and Azure DevOps Git repositories
- Grafana
- Looker
- Metabase
- MicroStrategy Cloud
- Mode
- OpenAPI
- Power BI
- Power BI Report Server
- QuickSight signed metadata endpoints
- Qlik Cloud
- Qlik Sense
- Redash
- SAP OData catalog endpoints
- Salesforce
- SAP BusinessObjects REST endpoints
- Sigma
- SSRS
- Superset
- Tableau
- ThoughtSpot
- Oracle Analytics REST endpoints
- Sisense REST endpoints
- Kafka REST / Schema Registry endpoints

Repository and dbt connectors also support local/configured artifact extraction without calling an external API: configured repository file lists, dbt `manifest_json`, and source payloads are parsed directly into canonical metadata.

The current coverage report is:

- 43 connector definitions registered.
- 43 documented bridge adapters plumbed.
- 38 direct REST, signed HTTP, repository, or artifact source clients plumbed.
- 5 native/existing extractor families: SQL Server, SSIS, PostgreSQL, Snowflake, and on-prem SSAS.

SQL Server and SSIS are live through the existing extractor bridges. PostgreSQL and Snowflake use native driver paths and return package-specific remediation when the optional package is not installed (`pg` or `snowflake-sdk`). SSAS returns XMLA/ADOMD remediation until a concrete XMLA client is added or a JSON metadata endpoint is configured.

AWS Glue, S3, Redshift, and QuickSight have first-pass SigV4-signed HTTP clients. They still need live credential smoke tests and source-specific operation hardening with real Sonic credentials before they should be considered production-certified.

## End-To-End Validation

Last full local validation: 2026-06-06.

- `npm test -- --runInBand --coverage=false`: 56 test suites passed, 534 tests passed.
- `npm run test:e2e`: 8 Playwright smoke tests passed.
- `npm run build`: completed successfully. The current build script is a placeholder echo, so this confirms the configured build command works but does not yet perform a production asset compile.
- `node --check src/services/connectorRuntime/sourceClients.js`: passed.
- Connector coverage check: 43/43 bridge adapters, 38 direct clients, 5 native/existing extractor families.
