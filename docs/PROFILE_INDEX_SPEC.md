# Profile Index Safety And Storage Specification

## Purpose

Profile indexes are the machine-readable metadata layer used by the app, DevOps/Azure data pack, and Codex skills to answer profile, quality, metric, sensitivity, and freshness questions without reconnecting to source systems or scanning large markdown corpora.

This specification is the source of truth for profile index safety, storage, and publication rules.

## Storage Layers

Profile data has three separate storage layers. Do not collapse these into one format.

| Layer | Purpose | Example Location | Primary Consumer |
| --- | --- | --- | --- |
| Operational run store | Local connector/scheduler state and raw run audit metadata after sanitization. | `data/_runtime/profiles` | App runtime and scheduler |
| Run artifacts | Sanitized JSON plus human-readable markdown evidence for each connector/profile run. | `data/markdown/_runtime/profile-runs` | Humans, audit, DevOps export staging |
| Profile index | Compact latest-state lookup shards for fast app and skill answers. | `data/lineage-runtime-package/sonic-data-lineage-runtime/profile-index` | App, Codex skill, automated consumers |

Markdown is a human-readable summary and citation layer. It is not the primary storage format for large profile result sets.

## DevOps/Azure Data Pack Policy

Sanitized profile indexes may live in a DevOps repo and may be published as part of the Azure data pack.

The DevOps/Azure data pack may contain:

- row counts
- column counts
- null counts and null percentages
- distinct counts or approximate distinct counts
- min, max, mean, median, standard deviation, and range for non-sensitive numeric/date columns where policy allows
- freshness timestamps
- profile run ids and connector ids
- source object ids, database/schema/table names, and column names
- PII, PHI, confidential, financial, and sensitivity flags
- metric candidates and metric confidence
- quality warnings, drift flags, completeness gaps, and stale-profile warnings
- lineage links, downstream impact hints, and source evidence paths
- coverage gaps and structured remediation errors

The DevOps/Azure data pack must not contain:

- raw row values
- sample values
- report result rows
- dashboard cell values
- user-entered report filter values when they contain business data
- customer names, emails, phone numbers, VINs, addresses, SSNs, or other PII values
- credential values, tokens, connection strings, vault references, or secret references
- unrestricted source payloads from APIs, cloud storage, BI tools, catalogs, repositories, queues, or pipelines
- raw SQL result sets beyond aggregate profile rows
- raw min/max values for sensitive text columns or sensitive identifiers

## Required Safety Fields

Every persisted profile run artifact and profile index shard must include these fields or equivalent schema properties:

```json
{
  "raw_data_captured": false,
  "raw_values_retained": false,
  "secret_exposed": false,
  "profile_index_safe": true
}
```

BI profile artifacts must also include:

```json
{
  "captures_raw_report_data": false,
  "report_result_rows_queried": false
}
```

## Proposed Profile Index Shape

The profile index should be sharded for cheap lookup and skill access:

```text
data/lineage-runtime-package/sonic-data-lineage-runtime/profile-index/
  manifest.json
  latest-summary.json
  by-database/
    <database>.json
  by-object-id/
    <object-id>.json
  by-object-name/
    <normalized-name>.json
  by-column-name/
    <normalized-column>.json
  flags/
    pii.json
    metrics.json
    quality-gaps.json
    stale-profiles.json
```

`manifest.json` must record:

- profile index version
- build timestamp
- source run ids
- source artifact paths
- object count
- column count
- checksum/hash summary
- safety validation status
- publisher/build mode

## Canonical Object And Column Keys

Profile index shards must use the same canonical identity model as the lineage runtime package:

- stable object id when available
- server/source system
- database
- schema
- object name
- object type
- normalized lookup aliases
- case-preserving display name

Column profile records must include the parent object id and fully qualified display path.

## Skill Access Requirements

The Sonic data lineage skill must read profile indexes before falling back to run markdown or Confluence for profile questions.

The skill should use profile-index shards for questions such as:

- "What does the profile say about this table?"
- "How many rows are in this object?"
- "Which columns are mostly null?"
- "Which columns look like metrics?"
- "Which columns are PII?"
- "Is this profile stale?"
- "What changed since the last profile?"

The skill should cite the profile index shard and the source run artifact used as evidence.

## Enforcement Requirements

Documentation is not enough. The project must enforce this policy with code and tests:

- shared sanitizer for profile run artifacts and profile index shards
- schema validation for profile index files
- tests that fail if forbidden fields are persisted
- tests that fail if `sample_values`, `raw_rows`, `preview_data`, `example_value`, `raw_payload`, `credential`, `token`, `secret`, or `connection_string` appears in profile index output
- CI/export validation before DevOps publish
- structured remediation errors when unsafe data is detected

## Developer And AI Rules

- Do not add profile data persistence without updating this spec when the storage shape changes.
- Do not store raw data in markdown, JSON artifacts, logs, screenshots, test fixtures, or DevOps exports.
- Do not use markdown as the primary profile index for Azure-scale data.
- Do not make the skill scan large profile-run artifact folders for routine answers.
- Do not bypass sanitizers or masking helpers.
- Do not create a second profile engine for one connector family. Connector-specific code belongs in adapters; profile interpretation belongs in the shared profile services.
