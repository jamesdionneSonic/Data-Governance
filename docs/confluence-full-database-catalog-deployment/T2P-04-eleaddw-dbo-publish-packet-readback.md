# T2P-04 eLeadDW.dbo Publish Packet Readback

Date: 2026-06-23

This packet prepared the reviewed Confluence publish packet for the first
complete one-schema Tier 2 slice:

`Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo`

No live Confluence publish, cleanup, archive, delete, or move action was run.

## Scope

| Signal           | Value                                              |
| ---------------- | -------------------------------------------------- |
| Packet           | T2P-04                                             |
| Backlog items    | T2OBJ-006; T2OBJ-007 remains pending live approval |
| Platform/Product | `SQL Server`                                       |
| Database         | `eLeadDW`                                          |
| Schema           | `dbo`                                              |
| Publish mode     | reviewed publish packet only                       |
| Cleanup mode     | none                                               |

## Publish Packet

| Signal            | Value                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| Packet JSON       | `docs/confluence-full-database-catalog-deployment/T2P-04-eleaddw-dbo-tier2-publish-packet.json` |
| Packet markdown   | `docs/confluence-full-database-catalog-deployment/T2P-04-eleaddw-dbo-tier2-publish-packet.md`   |
| Validation status | `passed`                                                                                        |

## Planned Pages

| Signal                 | Value |
| ---------------------- | ----: |
| Reference parent pages |     2 |
| Link refresh pages     |     2 |
| Thin object pages      |    55 |
| Total planned entries  |    59 |

Reference parent pages:

- `Sonic Data Lineage / Database Catalog`
- `Sonic Data Lineage / Database Catalog / SQL Server`

Link refresh pages:

- `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW`
- `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo`

## Link Refresh Signals

| Signal                             | Value |
| ---------------------------------- | ----: |
| Schema object rows                 |    55 |
| Objects planned in packet          |    55 |
| Pending rows before publish        |    55 |
| Schema-page object links rendered  |   175 |
| `Most Used Objects` links rendered |    10 |

Pending rows are expected before live publish. A post-publish readback must
confirm the pages exist before the rows can be treated as live linked pages.

## Commands

```powershell
npm run confluence:full:tier2:eleaddw-dbo:publish:dry-run
```

This command ran:

1. `npm run confluence:full:tier2:eleaddw-dbo:dry-run`
2. `npm run confluence:human:check`
3. `npm run confluence:full:tier2:eleaddw-dbo:publish-packet`
4. `node scripts/publish-human-confluence-catalog-pilot.mjs --packet docs/confluence-full-database-catalog-deployment/T2P-04-eleaddw-dbo-tier2-publish-packet.json`

Results:

- Scoped dry-run generated 57 pages.
- Human catalog dry-run check passed.
- Publish packet validation passed with no failures.
- Publisher dry run succeeded with `publish: false`.

## Live Publish Gate

Live publish still requires explicit approval for:

`Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo`

Approved live publish command after explicit approval:

```powershell
npm run confluence:full:tier2:eleaddw-dbo:publish
```

Post-publish verification command:

```powershell
npm run confluence:full:tier2:eleaddw-dbo:published:check
```

Do not run cleanup commands from the Tier 2 publish approval.
