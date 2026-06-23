# T2P-06 Sonic_DW.dbo Pilot Refresh Readback

Date: 2026-06-23

This packet prepared a dry-run refresh for the 25 existing live Tier 2 pilot
pages under `Sonic_DW.dbo`.

No live Confluence publish, cleanup, archive, delete, or move action was run.

## Results

| Signal                           | Value |
| -------------------------------- | ----: |
| Old pilot pages checked          |    25 |
| Stale flat-path pages            |    25 |
| Refreshed object pages generated |    25 |
| Link refresh pages generated     |     2 |
| Total planned entries            |    29 |

## Outputs

| Signal                  | Value                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| Publish packet JSON     | `docs/confluence-full-database-catalog-deployment/T2P-06-sonic-dw-dbo-pilot-refresh-packet.json` |
| Publish packet markdown | `docs/confluence-full-database-catalog-deployment/T2P-06-sonic-dw-dbo-pilot-refresh-packet.md`   |
| Source live readback    | `docs/confluence-full-database-catalog-deployment/FDP-04-tier2-batch01-live-publish-readback.md` |

## Commands

```powershell
npm run confluence:full:tier2:pilot-refresh:dry-run
```

The command rebuilt a scoped dry-run for only the 25 stale pilot objects, ran the
human catalog dry-run checker, built this reviewed refresh packet, and exercised
the publisher with `publish: false`.

## Live Gate

Live publish still requires explicit approval.

After approval:

```powershell
npm run confluence:full:tier2:pilot-refresh:publish
```

Post-publish verification:

```powershell
npm run confluence:full:tier2:pilot-refresh:published:check
```

Cleanup remains separate even after refreshed pages publish.
