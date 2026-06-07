# Connector Metadata Profile Framework

## Purpose

The connector metadata profile framework captures safe operational metadata for sources that are not databases and are not BI/reporting platforms.

It profiles:

- Salesforce CRM objects, reports, dashboards, and report-object dependencies
- Cloud storage inventories, paths, inferred schemas, classifications, and storage lineage
- Catalog platform assets, classifications, glossary terms, schemas, and lineage
- Pipeline/orchestration assets, tasks, datasets, connections, schedules, jobs, and lineage
- Code repository assets, Python scripts, SQL files, notebooks, dbt artifacts, and code lineage

It does not profile raw source values. The profile is metadata-only and returns no secrets, credential references, or unrestricted source payload values.

## Supported Connectors

- `salesforce`
- `azure_storage`
- `aws_s3`
- `gcs`
- `azure_purview`
- `aws_glue`
- `gcp_dataplex`
- `azure_data_factory`
- `ssis`
- `airflow`
- `dbt`
- `git_repository`

Next pass:

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

Unsupported next-pass connectors return a `CONNECTOR_CONFIG_ERROR` with remediation that names the currently supported metadata-profile connector types and calls out `openapi`, `kafka`, and `sap` as next-pass work.

## Architecture Rule

Do not build separate profiling engines for storage, catalog, pipeline, repository, and Salesforce connectors. Tool-specific API details belong in connector adapters and source clients. Metadata profile interpretation belongs in `src/services/connectorMetadataProfileService.js`, which consumes canonical events from the shared extraction runtime.
