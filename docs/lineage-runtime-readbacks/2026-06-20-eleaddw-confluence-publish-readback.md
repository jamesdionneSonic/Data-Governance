# eLeadDW Confluence Human And Rovo Publish Readback

Date: 2026-06-20
Work packet: ELDW-011
Approval source: user approved publishing all reviewed files after ELDW-010

## Result

Published the reviewed eLeadDW human catalog pages and Rovo retrieval pages to
Confluence under `Sonic Data Lineage`.

No cleanup, archive, delete, page move, parser change, extractor change,
lineage-scoring change, auth change, raw-row publication, or secret publication
was performed.

## Published Scope

Referenced parent pages:

| Parent                                        | Page id      |
| --------------------------------------------- | ------------ |
| `Sonic Data Lineage / Database Catalog`       | `2282422274` |
| `Sonic Data Lineage / AI Retrieval Artifacts` | `2283831324` |

Published human catalog pages:

| Page                                                            | Confluence action | Page id      | Version |
| --------------------------------------------------------------- | ----------------- | ------------ | ------: |
| `Sonic Data Lineage / Database Catalog / eLeadDW`               | updated           | `2282062269` |       8 |
| `Sonic Data Lineage / Database Catalog / eLeadDW / eLeadDW.dbo` | updated           | `2287992921` |       2 |

Published Rovo retrieval pages:

| Page                                      | Confluence action | Page id      | Version |
| ----------------------------------------- | ----------------- | ------------ | ------: |
| `Rovo Ambiguity Context eLeadDW 001`      | updated           | `2290384897` |       2 |
| `Rovo Column Context eLeadDW 001`         | updated           | `2288418952` |       2 |
| `Rovo Database Context eLeadDW 001`       | updated           | `2290221063` |       2 |
| `Rovo Downstream Context eLeadDW 001`     | updated           | `2290417665` |       2 |
| `Rovo Object Locator eLeadDW 001`         | updated           | `2289598469` |       2 |
| `Rovo Object Locator eLeadDW 002`         | updated           | `2290450433` |       2 |
| `Rovo Object Locator eLeadDW 003`         | updated           | `2290483201` |       2 |
| `Rovo Object Locator eLeadDW 004`         | updated           | `2290515969` |       2 |
| `Rovo Object Locator eLeadDW 005`         | updated           | `2290515993` |       2 |
| `Rovo Object Summary Context eLeadDW 001` | updated           | `2288877580` |       2 |
| `Rovo Start Here - eLeadDW`               | updated           | `2290548737` |       2 |
| `Rovo Upstream Context eLeadDW 001`       | updated           | `2289893381` |       2 |

## Publish Packet

Final publish packet:

`docs/confluence-full-database-catalog-deployment/ELDW-011-eleaddw-confluence-publish-packet-v2.json`

Final publish output root:

`data/confluence/eleaddw-approved-confluence-publish-v2`

Dry-run command:

```powershell
node scripts/publish-human-confluence-catalog-pilot.mjs --output-root data/confluence/eleaddw-approved-confluence-publish-v2 --packet docs/confluence-full-database-catalog-deployment/ELDW-011-eleaddw-confluence-publish-packet-v2.json
```

Live publish command:

```powershell
node scripts/publish-human-confluence-catalog-pilot.mjs --output-root data/confluence/eleaddw-approved-confluence-publish-v2 --packet docs/confluence-full-database-catalog-deployment/ELDW-011-eleaddw-confluence-publish-packet-v2.json --publish
```

## Title Collision Handling

The original dry-run schema path was:

`Sonic Data Lineage / Database Catalog / eLeadDW / dbo`

The first live publish attempt failed on that page because Confluence returned:

`A page with this title already exists`

Confluence enforced title uniqueness for `dbo` across the space. To complete the
approved publish without deleting or moving any existing page, the schema page
was published under:

`Sonic Data Lineage / Database Catalog / eLeadDW / eLeadDW.dbo`

This is an intentional live-publish exception caused by Confluence title
constraints. It avoids the explicitly rejected old generated title pattern
`Schema - eLeadDW.dbo` and does not perform cleanup.

## Key Readback

Human catalog:

- `eLeadDW` database page updated.
- `eLeadDW.dbo` schema page updated.
- Unsupported owner, data steward, SLA, lifecycle/status, live freshness, and
  certification facts remain `not surfaced in metadata`.

Rovo retrieval:

- `Rovo Object Locator eLeadDW 002` contains the locator for
  `eLeadDW.dbo.dwFullOpportunity`.
- Rovo database context resolves `database:eLeadDW`.
- Rovo pages remain under `Sonic Data Lineage / AI Retrieval Artifacts`, not
  under the human database catalog.

## Cleanup Boundary

Cleanup was not approved and was not run.

The following actions remain out of scope:

- archive old pages;
- delete old pages;
- move old pages;
- replace generated pages broadly;
- clean superseded schema-title candidates.

## Caveats

The `column_match` edges remain review-needed evidence. They must not be
presented as confirmed business lineage.

The live schema page title is `eLeadDW.dbo` instead of the preferred short title
`dbo` because Confluence rejected the duplicate `dbo` title.

## Stop Point

ELDW-011 is complete.

ELDW-012, final readback and handoff, has not been started.
