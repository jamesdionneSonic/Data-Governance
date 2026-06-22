# Linked-Server Alias Lineage Refresh Process

This process repairs lineage when SQL modules reference an old linked-server
name but the catalog uses a newer canonical server identity.

## Current Approved Alias

| Alias        | Canonical            |
| ------------ | -------------------- |
| `COR-SQL-02` | `L1-DWASQL-02,12010` |
| `cor-sql-02` | `L1-DWASQL-02,12010` |

## Why This Process Exists

The lineage extractor can capture the dependency correctly but still fail to
connect it to the catalog if server identity differs. That creates shallow
answers, such as stopping at an ETL staging table instead of resolving the
upstream eLeadDW source tables.

## Low-Intelligence Flow

1. Build the targeted packet:

   ```powershell
   npm run lineage:cor-sql:packet
   ```

2. Refresh only affected SQL metadata:

   ```powershell
   npm run lineage:cor-sql:refresh
   ```

3. Rebuild local markdown-derived catalog artifacts:

   ```powershell
   npm run catalog:rebuild
   ```

4. Build and validate the runtime package:

   ```powershell
   npm run lineage:runtime:package
   npm run lineage:runtime:check
   npm run lineage:answers:check
   npm run lineage:runtime:readback
   ```

5. Sync the machine-readable DevOps repo:

   ```powershell
   npm run lineage:runtime:sync
   ```

6. Publish only after reviewing the packet output and validation evidence.

## Targeted SQL Scope

`npm run lineage:cor-sql:refresh` is intentionally limited to:

- `Sonic_DW`
- `ETL_Staging`
- `eLeadDW`
- `DMS`
- `Speed`
- `WebV`
- `Sonic_XREF`
- `BI_WorkDB`

Do not add databases to this command unless a live dependency query proves they
are part of the same alias issue.

## Confluence Scope

Prefer updating:

- Rovo object locator/context pages affected by the corrected alias;
- object pages for explicitly affected objects such as `FactOpportunity`;
- database/schema pages only when their counts or aliases change.

Do not run full-catalog Confluence regeneration for this process.

## DevOps Scope

Sync runtime package artifacts to the generated DevOps repo after validation.
Publishing the Azure Artifacts package needs a new version if the runtime
content hash changed.

## Review Checklist

- The packet under `docs/lineage-runtime-readbacks/` exists.
- `data/analysis/raw/live-domain-refresh-summary.json` lists only approved
  targets.
- Runtime validation passes.
- Answer readback shows corrected upstream source objects.
- `COR-SQL-02` remains only as documented alias history, not as a canonical
  runtime object ID.
