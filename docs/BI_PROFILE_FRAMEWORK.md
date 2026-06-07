# BI Profile Framework

## Purpose

The BI profile framework captures governance metadata about reports and semantic-layer assets without retaining report result rows or raw business values.

It answers questions such as:

- Which reports and dashboards exist in a BI tenant?
- Which semantic models, datasets, cubes, explores, universes, or worksheets support them?
- Which metrics, measures, calculated fields, formulas, and report fields are exposed?
- Which data sources or database connections feed the reporting layer?
- Which reports have lineage, owners, usage, refresh, subscriptions, or alerts captured?
- What BI metadata is missing because the connector lacks permission, source support, or a configured stream?

## Scope

Supported through the managed connector runtime:

- Power BI
- Power BI Report Server
- MicroStrategy Cloud
- SQL Server Analysis Services
- SQL Server Reporting Services
- Tableau
- Looker
- Qlik Cloud
- Qlik Sense Enterprise
- Domo
- Sigma
- Mode
- Metabase
- Apache Superset
- Redash
- Amazon QuickSight
- Grafana
- IBM Cognos Analytics
- SAP BusinessObjects
- Oracle Analytics
- ThoughtSpot
- Sisense

Salesforce report/dashboard metadata continues through the standard extraction runtime because Salesforce is classified as ERP/CRM in the connector registry.

## Contract

BI profile responses always carry these safety fields:

```json
{
  "profile_type": "bi_report_profile",
  "captures_raw_report_data": false,
  "captures_raw_data": false,
  "raw_values_retained": false,
  "report_result_rows_queried": false,
  "secret_exposed": false
}
```

The framework profiles metadata only. It does not keep report output rows, dashboard cell values, user-entered filters, credential values, or vault references.

## API

```http
POST /api/v1/connectors/:id/bi-profile/plan
POST /api/v1/connectors/:id/bi-profile/run
```

Both routes use the managed connector permission model:

- `view` permission can plan a profile.
- `run` permission can run a profile.
- Secrets remain server-side and are never returned in API responses.

## Output Sections

Each run builds:

- `reports`
- `dashboards`
- `semantic_models`
- `datasets`
- `data_sources`
- `metrics`
- `fields`
- `usage`
- `schedules`
- `subscriptions`
- `alerts`
- `lineage_edges`
- `coverage_checks`
- `gaps`
- `top_impact_candidates`
- `summary`
- `package`
- `confluence`
- `answer`

## Error Handling

BI profiles use the same connector error model as extraction:

- `CONNECTOR_CONFIG_ERROR`
- `CONNECTOR_CREDENTIAL_ERROR`
- `CONNECTOR_STREAM_ERROR`
- `CONNECTOR_RUNTIME_ERROR`

Errors include connector id, connector type, phase, stream, remediation, and details. A failed stream is recorded as a coverage gap and, when `fail_fast: false`, other streams continue so the profile can still return useful partial metadata.

## Architecture Rule

Do not build separate profiling engines for each BI tool. Tool-specific API details belong in the connector adapter and source client. Profile interpretation belongs in `src/services/biProfileService.js`, which consumes canonical events from every reporting connector.
