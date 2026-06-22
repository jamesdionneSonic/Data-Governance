# Sonic Lineage Runtime Package Manifest Contract

## Purpose

This contract defines the required identity, source, count, path, quality, and
validation fields for an approved Sonic lineage runtime package.

The manifest is the first machine-readable file a Codex skill, plugin, script,
or future service must open. It tells the consumer what package it is reading,
where it came from, what paths are safe to use, and whether the package has
enough validation metadata to be trusted.

Consumer/package compatibility is tracked in
`docs/LINEAGE_RUNTIME_PACKAGE_COMPATIBILITY_MATRIX.md`.

## Manifest Files

| File                             | Required | Purpose                                                                                    |
| -------------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| `manifest.json`                  | Yes      | Full package identity, source, counts, entrypoints, quality gates, and validation metadata |
| `latest.json`                    | Yes      | Compact package identity and hash for quick startup/version disclosure                     |
| `indexes/artifact-manifest.json` | Yes      | Advertises exact artifact paths and capabilities so consumers do not guess paths           |
| `indexes/path-contract.json`     | Yes      | States which path families are available and unavailable                                   |
| `catalog-manifest.json`          | Yes      | Source catalog manifest used to cross-check package object counts                          |

## Required `manifest.json` Fields

| Field                                   | Required                    | Notes                                                                                |
| --------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------ |
| `schema_version`                        | Yes                         | Integer package manifest schema version                                              |
| `package_name`                          | Yes                         | Must be `sonic-data-lineage-runtime`                                                 |
| `version`                               | Yes                         | Published package version, such as `2026.6.13-1`                                     |
| `generated_at`                          | Yes                         | ISO timestamp for the package build                                                  |
| `runtime_content_hash`                  | Yes                         | Stable hash for the package payload under review                                     |
| `source.catalog_remote_url`             | Yes                         | Generated catalog repository URL                                                     |
| `source.catalog_generated_at`           | Yes                         | ISO timestamp from the source catalog manifest                                       |
| `source.catalog_schema_version`         | Yes                         | Source catalog schema version                                                        |
| `counts.object_count`                   | Yes                         | Must match `catalog-manifest.json` and registry row count                            |
| `counts.database_count`                 | Yes                         | Must be present for consumer sanity checks                                           |
| `counts.context_pack_count`             | Yes                         | Must match package context-pack coverage                                             |
| `counts.ssis_package_context_count`     | Yes                         | Required for SSIS documentation support workflows                                    |
| `counts.canonical_object_count`         | Yes                         | Required for resolver quality checks                                                 |
| `counts.duplicate_object_count`         | Yes                         | Required so consumers can disclose ambiguity risk                                    |
| `counts.unresolved_server_object_count` | Yes                         | Required so consumers can disclose unresolved-source risk                            |
| `entrypoints`                           | Yes                         | Must advertise machine-readable paths instead of relying on path guessing            |
| `retrieval_order`                       | Yes                         | Must define the deterministic consumer read order                                    |
| `quality_gates`                         | Yes                         | Must include blocked raw server/database pairs and profile-index safety requirements |
| `profile_index`                         | Yes                         | Must advertise profile-index paths even when profile coverage is empty               |
| `artifact_manifest`                     | Yes                         | May be embedded or referenced by `indexes/artifact-manifest.json`                    |
| `validation`                            | Yes for next package schema | See validation section below                                                         |

## Required `latest.json` Fields

| Field                               | Required | Notes                                             |
| ----------------------------------- | -------- | ------------------------------------------------- |
| `package_name`                      | Yes      | Must match `manifest.json`                        |
| `version`                           | Yes      | Must match `manifest.json`                        |
| `generated_at`                      | Yes      | Must match package build timestamp                |
| `runtime_content_hash`              | Yes      | Must match `manifest.json`                        |
| `manifest_path`                     | Yes      | Must be `manifest.json`                           |
| `registry_path`                     | Yes      | Must point to the registry JSONL path             |
| `canonical_registry_path`           | Yes      | Must point to the canonical registry JSONL path   |
| `database_index_path`               | Yes      | Must point to `registry/database-index.json`      |
| `routing_entrypoints_path`          | Yes      | Must point to `indexes/entrypoints.json`          |
| `path_contract_path`                | Yes      | Must point to `indexes/path-contract.json`        |
| `profile_index_manifest_path`       | Yes      | Must point to `profile-index/manifest.json`       |
| `profile_index_latest_summary_path` | Yes      | Must point to `profile-index/latest-summary.json` |

## Validation Metadata

Package build validation and package approval happen at different times.

`manifest.json` should include a `validation` object in the next package schema:

```json
{
  "validation": {
    "status": "pending_validation",
    "required_gates": [
      "lineage:runtime:check",
      "lineage:answers:check",
      "lineage:runtime:readback",
      "published-package-readback",
      "lineage:runtime:skill-check"
    ],
    "approval_record": "docs/LINEAGE_RUNTIME_PACKAGE_APPROVAL_CHECKLIST.md"
  }
}
```

Allowed `validation.status` values:

| Status               | Meaning                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------- |
| `pending_validation` | Package has been built but not fully approved                                                |
| `approved`           | Package passed required gates and has a matching approval/readback record                    |
| `rejected`           | Package failed validation or approval                                                        |
| `needs_rebuild`      | Package content is valid enough to inspect but should not be treated as the approved version |

Final approval must still be recorded in
`docs/LINEAGE_RUNTIME_PACKAGE_APPROVAL_CHECKLIST.md` and
`docs/lineage-runtime-readbacks/**` because published-package readback and skill
smoke checks happen after the package is built.

## Current Package Note

The current local package version `2026.6.13-1` has the required identity,
source, count, entrypoint, quality-gate, and profile-index fields. It does not
yet include an embedded `validation` object. Until the next package schema adds
that field, consumers must use the approval checklist and readback records for
the final validation status.

Current approved published package:

| Field                          | Value                                                                        |
| ------------------------------ | ---------------------------------------------------------------------------- |
| Package version                | `2026.6.13-1`                                                                |
| Published runtime content hash | `ab840383d8e4f9b1e1036523965536b03d23f2270959025d63a658f4daeece6e`           |
| Approval record                | `docs/LINEAGE_RUNTIME_PACKAGE_APPROVAL_CHECKLIST.md`                         |
| Published readback record      | `docs/lineage-runtime-readbacks/2026-06-18-published-package-2026.6.13-1.md` |
| Skill smoke record             | `docs/lineage-runtime-readbacks/2026-06-18-skill-readiness-2026.6.13-1.md`   |

## Consumer Rules

- Start with `manifest.json`, then `latest.json`.
- Report `version` and `runtime_content_hash` in decision-grade answers.
- Refuse to mix artifacts across package versions or hashes.
- Use only paths advertised by `entrypoints`, `indexes/artifact-manifest.json`,
  `indexes/path-contract.json`, registry rows, answer cards, or context packs.
- Treat missing validation metadata as `pending_validation` unless an approval
  checklist and readback record prove the exact package version/hash is approved.
- Use Confluence only for human governance context, not package validation.
