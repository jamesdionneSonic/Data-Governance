# Engines

This folder is the target home for batch documentation, catalog, connector, and
lineage-runtime engines.

See:

- `docs/adr/ADR-012-Separate-Documentation-Engines-From-App-Runtime.md`
- `docs/ENGINE_FOLDERING_CONTRACT.md`
- `docs/CODEX_ENGINE_FOLDERING_MIGRATION_PACKET.md`

The current `scripts/` folder may still contain legacy implementations. During
migration, keep existing npm command names stable and turn scripts into thin
wrappers around modules in this folder.

## Target Layout

```text
engines/
  catalog/
  lineage-runtime/
  confluence-human-catalog/
  support-docs/
    shared/
    adf/
    ssis/
    ssrs/
  connectors/
    shared-runtime/
    adf/
    sql-server/
    ssis/
    ssrs/
  governance/
```

Do not run live Confluence or DevOps publication as part of a folder migration.
