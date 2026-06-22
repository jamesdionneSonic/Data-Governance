# FDP-06 Rovo AI Retrieval Live Publish Readback

Generated: 2026-06-19

## Scope

Rovo AI retrieval artifacts were published live to Confluence under:

```text
Sonic Data Lineage / AI Retrieval Artifacts
```

This publish covered compact retrieval pages only. It did not publish additional
Database Catalog pages and it did not perform cleanup, archive, delete, or move
actions.

## Publish Result

| Signal                         | Value                                                                                                                                                                                                                              |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Publish command                | `node scripts\publish-human-confluence-catalog-pilot.mjs --output-root data\confluence\rovo-ai-retrieval-dry-run --packet docs\confluence-full-database-catalog-deployment\FDP-06-rovo-ai-retrieval-publish-packet.json --publish` |
| Publish status                 | Published                                                                                                                                                                                                                          |
| Root page ID                   | `2221670415`                                                                                                                                                                                                                       |
| AI Retrieval Artifacts page ID | `2283831324`                                                                                                                                                                                                                       |
| Navigation pages               | 1                                                                                                                                                                                                                                  |
| Rovo artifact pages            | 8                                                                                                                                                                                                                                  |
| Total checked entries          | 9                                                                                                                                                                                                                                  |

## Post-Publish Verification

| Command                                   | Result |
| ----------------------------------------- | ------ |
| `npm run confluence:rovo:published:check` | Passed |

Verification checked all 9 planned entries and reported no failures. The Rovo
artifact pages were verified for required labels and page-specific snippets such
as lookup order, locator fields, VendorData context, DimVehicle/FactOpportunity
ambiguity, and upstream/downstream lineage context.

## Published Pages

| Page                              | Page ID      | Version after publish |
| --------------------------------- | ------------ | --------------------- |
| `AI Retrieval Artifacts`          | `2283831324` | 2                     |
| `Rovo Ambiguity Context 001`      | `2287796430` | 1                     |
| `Rovo Database Context 001`       | `2287435955` | 1                     |
| `Rovo Downstream Context 001`     | `2288025872` | 1                     |
| `Rovo Evaluation Prompts`         | `2288058628` | 1                     |
| `Rovo Object Locator 001`         | `2288091449` | 1                     |
| `Rovo Object Summary Context 001` | `2288091472` | 1                     |
| `Rovo Start Here`                 | `2288025895` | 1                     |
| `Rovo Upstream Context 001`       | `2287665495` | 1                     |

## Rovo Coverage

The published artifacts support the initial Rovo question families:

| Question family                                               | Retrieval artifact                                                                         |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Tell me about the database `VendorData`                       | `Rovo Database Context 001`                                                                |
| Tell me about the `DimVehicle` table                          | `Rovo Object Locator 001`, `Rovo Ambiguity Context 001`, `Rovo Object Summary Context 001` |
| Show me the lineage of `FactOpportunity`                      | `Rovo Upstream Context 001`, `Rovo Downstream Context 001`                                 |
| Evaluate unsupported owner/SLA/freshness/certification claims | `Rovo Evaluation Prompts`                                                                  |

## Guardrails Preserved

- Rovo artifacts were published under `AI Retrieval Artifacts`, not under `Database Catalog`.
- Unsupported owner, SLA, lifecycle/status, live freshness, and certification facts remain marked as not surfaced in metadata.
- Raw rows, sample values, secrets, credentials, and connection strings were not published by the validator.
- No cleanup, archive, delete, or move was performed.
- SSIS package/catalog artifacts from `ssisdb` remain excluded from Database Catalog publication.

## Implementation Notes

FDP-06 added repeatable Rovo publish tooling:

- `scripts/build-rovo-ai-retrieval-publish-packet.mjs`
- `npm run confluence:rovo:publish-packet`
- `npm run confluence:rovo:publish:dry-run`
- `npm run confluence:rovo:publish`
- `npm run confluence:rovo:published:check`

The shared Confluence publisher/checker now support `--output-root` so Rovo
artifacts can be published from `data/confluence/rovo-ai-retrieval-dry-run`
without mixing them into the human Database Catalog dry-run cache.

## Next Gate

FDP-06 is live and verified. The remaining deployment gate is cleanup/final
readback, which still requires separate explicit cleanup approval before any
archive, delete, or move action.
