# eLeadDW Azure DevOps Runtime Package Dry Run Readback - 2026-06-20

## Work Packet

- Backlog item: `ELDW-006`
- Purpose: prepare machine-readable runtime artifacts for Azure DevOps review without publishing.
- Publish mode: `dry-run`
- Output root: `data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run`
- Source catalog root: `data/markdown/servers/L1-DWASQL-02,12010/databases/eLeadDW`

## Generated Runtime Artifacts

| Artifact Family          | Path                                                                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Runtime manifest         | `data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run/manifest.json`                                      |
| Latest pointer           | `data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run/latest.json`                                        |
| Object registry          | `data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run/registry/object-registry.jsonl`                     |
| Canonical objects        | `data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run/registry/canonical-objects.jsonl`                   |
| Database index           | `data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run/registry/database-index.json`                       |
| Object path index        | `data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run/registry/object-path-index.json`                    |
| Alias index              | `data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run/indexes/aliases/by-key.json`                        |
| Context packs            | `data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run/context-packs/objects/by-id`                        |
| Summary answer cards     | `data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run/answers/summary/by-object-id`                       |
| Upstream answer cards    | `data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run/answers/upstream/by-object-id`                      |
| Downstream answer cards  | `data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run/answers/downstream/by-object-id`                    |
| Usage-count answer cards | `data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run/answers/usage-count/by-object-id`                   |
| Profile teaser cards     | `data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run/answers/profile-teaser/by-object-id`                |
| Validation report        | `data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run/validation/eleaddw-runtime-dry-run-validation.json` |

## Counts

| Count                                   |  Value |
| --------------------------------------- | -----: |
| Canonical objects                       |    440 |
| Registry rows                           |    440 |
| Alias keys                              |  1,320 |
| Context packs                           |    440 |
| Answer cards                            |  2,200 |
| Positive upstream/downstream edges      |    308 |
| Review-needed edges retained as review  | 27,618 |
| Files/directories under dry-run root    |  2,672 |
| JSON files scanned for forbidden values |  2,649 |

## Validation

| Check                                                | Result  |
| ---------------------------------------------------- | ------- |
| `eLeadDW` records are present                        | Passed  |
| Object counts reconcile to canonical dbo object list | Passed  |
| Alias index is present                               | Passed  |
| Context packs are present                            | Passed  |
| Answer cards are present                             | Passed  |
| Raw rows exposed                                     | No      |
| Sample data exposed                                  | No      |
| Secrets exposed                                      | No      |
| Credentials exposed                                  | No      |
| Connection strings exposed                           | No      |
| Teammate consumer-kit boundary respected             | Passed  |
| Azure DevOps live publish                            | Not run |
| Confluence live publish                              | Not run |

## Boundary Notes

- This dry run did not publish to Azure DevOps.
- This dry run did not publish to Confluence.
- It did not copy ingestion engines, parser code, extractor code, generator code, secrets, credentials, connection strings, raw rows, or sample data into a teammate-facing repository.
- `column_match` edges remain review-needed and are not promoted as high-confidence lineage.

## Acceptance Criteria

| Criterion                                                                    | Status |
| ---------------------------------------------------------------------------- | ------ |
| `eLeadDW` records are present and count-reconciled                           | Passed |
| No secrets, credentials, connection strings, raw rows, or sample data appear | Passed |
| Teammate consumer-kit boundaries are respected                               | Passed |
| Live publish does not occur                                                  | Passed |

## Hard Stop

Do not continue to Azure DevOps publication from this dry run without explicit user approval after reviewing this readback.

## Next Packet

The next packet is `ELDW-007: Build Human Confluence Catalog Dry Run`. It is not started by this Azure DevOps runtime dry run.
