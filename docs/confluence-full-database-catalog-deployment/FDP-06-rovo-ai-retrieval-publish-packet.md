# FDP-06 Rovo AI Retrieval Publish Packet

## Purpose

This packet prepares the reviewed Rovo AI retrieval artifacts for live
Confluence publication under the separated AI Retrieval Artifacts branch.

It does not publish human Database Catalog pages and it does not clean up,
archive, delete, or move pages.

## Recommendation

Ready for live publish.

## Scope

| Signal            | Value                                                                 |
| ----------------- | --------------------------------------------------------------------- |
| Root path         | `Sonic Data Lineage / AI Retrieval Artifacts`                         |
| Publish mode      | `reviewed publish packet; no live publish performed by builder`       |
| Cleanup mode      | `none; cleanup remains separate`                                      |
| Required labels   | `human-lineage-catalog`, `rovo-ai-retrieval`, `ai-retrieval-artifact` |
| Validation status | `passed`                                                              |

## Planned Pages

| Signal                | Value |
| --------------------- | ----- |
| Navigation pages      | 1     |
| Rovo artifact pages   | 8     |
| Total planned entries | 9     |

## Artifact Pages

| Page                              | Type                        | Path                                                                            |
| --------------------------------- | --------------------------- | ------------------------------------------------------------------------------- |
| `Rovo Start Here`                 | rovo-start-here             | `Sonic Data Lineage / AI Retrieval Artifacts / Rovo Start Here`                 |
| `Rovo Object Locator 001`         | rovo-object-locator         | `Sonic Data Lineage / AI Retrieval Artifacts / Rovo Object Locator 001`         |
| `Rovo Database Context 001`       | rovo-database-context       | `Sonic Data Lineage / AI Retrieval Artifacts / Rovo Database Context 001`       |
| `Rovo Object Summary Context 001` | rovo-object-summary-context | `Sonic Data Lineage / AI Retrieval Artifacts / Rovo Object Summary Context 001` |
| `Rovo Upstream Context 001`       | rovo-upstream-context       | `Sonic Data Lineage / AI Retrieval Artifacts / Rovo Upstream Context 001`       |
| `Rovo Downstream Context 001`     | rovo-downstream-context     | `Sonic Data Lineage / AI Retrieval Artifacts / Rovo Downstream Context 001`     |
| `Rovo Ambiguity Context 001`      | rovo-ambiguity-context      | `Sonic Data Lineage / AI Retrieval Artifacts / Rovo Ambiguity Context 001`      |
| `Rovo Evaluation Prompts`         | rovo-evaluation-prompts     | `Sonic Data Lineage / AI Retrieval Artifacts / Rovo Evaluation Prompts`         |

## Validation

- No packet validation failures.

## Source Artifacts

- Rovo dry-run manifest: `data/confluence/rovo-ai-retrieval-dry-run/manifest.json`
- Rovo dry-run output root: `data/confluence/rovo-ai-retrieval-dry-run`
