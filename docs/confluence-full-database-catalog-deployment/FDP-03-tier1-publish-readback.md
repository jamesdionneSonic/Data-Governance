# FDP-03 Tier 1 Publish Packet Readback

Generated: `2026-06-19`

## Scope

This packet prepared the reviewed Tier 1 Database Catalog publish packet for:

```text
Sonic Data Lineage / Database Catalog
```

No live Confluence publish was performed. No cleanup, archive, delete, or move
was performed.

## Publish Packet

| Signal            | Value                                                                               |
| ----------------- | ----------------------------------------------------------------------------------- |
| Packet JSON       | `docs/confluence-full-database-catalog-deployment/FDP-03-tier1-publish-packet.json` |
| Packet markdown   | `docs/confluence-full-database-catalog-deployment/FDP-03-tier1-publish-packet.md`   |
| Validation status | `passed`                                                                            |
| Publish mode      | reviewed packet only                                                                |
| Cleanup mode      | report-only                                                                         |

## Planned Pages

| Signal                                         | Value |
| ---------------------------------------------- | ----- |
| Navigation pages                               | 1     |
| Database pages                                 | 32    |
| Schema pages                                   | 145   |
| Leaf pages                                     | 177   |
| Total planned pages                            | 178   |
| Included objects represented on schema indexes | 5,134 |
| Excluded SSIS package/catalog artifacts        | 2,051 |
| Superseded cleanup candidates                  | 170   |

## Boundary Decisions

- The packet includes only Tier 1 Database Catalog navigation, database pages,
  and schema pages.
- Product pages, object pilot pages, thin object pages, Rovo retrieval
  artifacts, SSIS support documentation, and SSRS support documentation are not
  included in this publish packet.
- `ssisdb` package and dataset artifacts are excluded from Database Catalog
  publication and remain in SSIS support documentation.
- The separate cataloged `SSIS.Meta` database table remains in scope because it
  is not an `ssisdb` package/catalog artifact.

## Validation

Commands run:

```powershell
node --check scripts\build-full-database-catalog-tier1-publish-packet.mjs
node --check scripts\publish-human-confluence-catalog-pilot.mjs
node --check scripts\check-human-confluence-catalog-pilot.mjs
npm run confluence:human:dry-run
npm run confluence:human:check
npm run confluence:full:inventory
npm run confluence:full:tier1:publish-packet
node scripts\publish-human-confluence-catalog-pilot.mjs --packet docs\confluence-full-database-catalog-deployment\FDP-03-tier1-publish-packet.json
```

Results:

- Dry-run validation passed for 213 generated source pages.
- Tier 1 packet validation passed with no failures.
- Publisher dry run succeeded with `publish: false`.
- Publisher dry run used labels:
  - `human-lineage-catalog`
  - `database-catalog`
  - `database-catalog-tier1`

## Live Publish Gate

Live publish still requires explicit user approval.

Approved live publish command:

```powershell
npm run confluence:full:tier1:publish
```

Post-publish verification command:

```powershell
npm run confluence:full:tier1:published:check
```

Do not run cleanup commands from the Tier 1 publish approval.
