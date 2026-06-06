# Data Dictionary and Metadata Enrichment

## Purpose

The data dictionary layer turns loaded catalog metadata into a browsable, exportable schema view. It is metadata-only: it exposes object names, columns, types, owners, business context, lineage counts, and semantic hints. It does not read or persist raw business data values.

## API

| Endpoint | Purpose |
| --- | --- |
| `GET /api/v1/dictionary` | Returns a filterable schema hierarchy with object and column counts. Supports `database`, `schema`, `type`, `q`, `limit`, and `offset`. |
| `GET /api/v1/dictionary/:assetId` | Returns one object dictionary with normalized columns, business metadata, upstream/downstream references, and completeness flags. |
| `GET /api/v1/dictionary/:assetId/export.md` | Exports the object dictionary as Markdown for documentation or review. |
| `PUT /api/v1/objects/:assetId` | Saves editable markdown-backed business metadata fields and refreshes runtime caches. |

## Editable Metadata Fields

The object update path accepts these governance enrichment fields:

- `description`
- `owner`
- `steward`
- `domain_manager`
- `custodian`
- `sensitivity`
- `tags`
- `business_domain`
- `business_justification`
- `business_processes`
- `use_cases`
- `documentation_links`
- `related_dashboards`

Array-like fields may be submitted as arrays or comma-separated strings. The service normalizes them before writing YAML frontmatter.

## Generated Enrichment Contract

Raw extractors and markdown rebuilds should call `applyDictionaryEnrichmentContract` before writing catalog markdown. The contract adds metadata-only fields that the data dictionary can use immediately, while preserving any steward-authored values already present.

Object-level generated fields:

- `business_domain`
- `business_justification`
- `business_processes`
- `use_cases`
- `documentation_links`
- `related_dashboards`
- `steward`
- `domain_manager`
- `custodian`
- `data_dictionary.status/source/enrichment_version/enriched_at`

Column-level generated fields:

- `business_name`
- `description`
- `semantic_type`
- `is_metric`
- `is_identifier`
- `is_dimension`
- `sensitivity`
- `classifications`
- `classification_tags`
- `dictionary_confidence`

The inference rules use metadata only: object/database/schema names, tags, column names, and data types. They do not read or persist raw row values. Inferred descriptions are intentionally conservative so a steward can replace them with stronger business definitions later.

To enrich existing local markdown after a raw-data refresh:

```bash
npm run catalog:dictionary:enrich -- --data-path data/markdown
npm run catalog:index
npm run catalog:runtime:check
```

The same contract is wired into `src/services/markdownFromSqlServer.js` and `scripts/rebuild-catalog-from-raw.mjs`, so regenerated catalog files keep the enriched dictionary shape.

## UI Behavior

Catalog Search now loads the dictionary payload when an object is selected. The object detail panel shows:

- column name, type, semantic role, sensitivity, and description;
- a Markdown dictionary export action;
- editable business metadata fields for domain, processes, use cases, justification, links, and related dashboards.

## Validation

Covered by:

- `tests/unit/markdown-enrichment-contract.test.js`
- `tests/unit/schema-dictionary-service.test.js`
- `tests/unit/dictionary-api.test.js`
- `tests/e2e/smoke.spec.js` dictionary protected-endpoint smoke check

Run locally:

```bash
npm test -- --runInBand --coverage=false tests/unit/markdown-enrichment-contract.test.js tests/unit/schema-dictionary-service.test.js tests/unit/dictionary-api.test.js
npm run test:e2e
```
