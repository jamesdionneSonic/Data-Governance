# Codex COR-SQL-02 Linked-Server Alias Refresh Packet

Use this packet to refresh only lineage affected by stale `COR-SQL-02`
references. It is designed for low-intelligence execution.

## Required Setting

- Model: cheapest Codex-capable model with command execution
- Speed: fastest
- Thinking: low
- Mode: one checklist step at a time

Stop before any architecture change, new alias inference, parser redesign,
scoring change, broad Confluence publish, or Azure/DevOps credential change.

## Fixed Alias

| Field                   | Value                                                        |
| ----------------------- | ------------------------------------------------------------ |
| Stale server token      | `COR-SQL-02` / `cor-sql-02`                                  |
| Canonical linked server | `L1-DWASQL-02,12010`                                         |
| Referencing databases   | `ETL_Staging`, `Sonic_DW`                                    |
| Referenced databases    | `eLeadDW`, `DMS`, `Speed`, `WebV`, `Sonic_XREF`, `BI_WorkDB` |

## Required Reading

1. `docs/adr/ADR-019-Linked-Server-Alias-Lineage-Refresh.md`
2. `docs/LINKED_SERVER_ALIAS_LINEAGE_REFRESH_PROCESS.md`
3. `docs/LINKED_SERVER_ALIAS_LINEAGE_BACKLOG.md`
4. `docs/LINEAGE_RUNTIME_PACKAGE_BACKLOG.md`
5. `docs/CONFLUENCE_LINEAGE_REPOSITORY.md`

## Approved Scope

Allowed:

- update local SQL markdown for the affected SQL targets;
- rebuild catalog/runtime artifacts from corrected aliases;
- sync generated runtime artifacts to the DevOps lineage repo;
- update Confluence AI retrieval artifacts and affected human pages after the
  targeted packet is reviewed.

Not allowed:

- full-catalog redesign;
- broad Confluence tree regeneration;
- unrestricted dry-run matrix;
- raw row extraction;
- publishing credentials, secrets, or connection strings;
- canonicalizing UAT/dev/test/lab aliases without review.

## Commands

Run in order.

```powershell
npm run lineage:cor-sql:packet
npm run lineage:cor-sql:refresh
npm run catalog:rebuild
npm run lineage:runtime:package
npm run lineage:runtime:check
npm run lineage:answers:check
npm run lineage:runtime:readback
npm run lineage:runtime:sync
```

Approval-required commands:

```powershell
npm run lineage:runtime:publish -- --dry-run
npm run lineage:runtime:publish -- --version=<new-version>
npm run confluence:rovo:validate
npm run confluence:rovo:publish-packet
node scripts/publish-human-confluence-catalog-pilot.mjs --output-root data/confluence/rovo-ai-retrieval-dry-run --packet docs/confluence-full-database-catalog-deployment/FDP-06-rovo-ai-retrieval-publish-packet.json --publish
```

## Acceptance Criteria

- `COR-SQL-02` and `cor-sql-02` are normalized to
  `L1-DWASQL-02,12010` in generated canonical references.
- `Sonic_DW.dbo.FactOpportunity` upstream answers include the full eLeadDW
  source family when supported by live dependency evidence.
- DevOps runtime repo sync writes a new `reports/runtime-sync-summary.json`.
- Confluence affected pages cite corrected runtime artifact paths.
- No raw business rows, sample values, tokens, passwords, or connection strings
  appear in generated outputs.

## Stop Triggers

Stop immediately if:

- any target refresh returns zero objects;
- a source database is unavailable or requires new credentials;
- validation still shows unresolved `COR-SQL-02` runtime identities;
- a command would publish broad Confluence or DevOps content outside this alias
  scope;
- a new alias appears that is not in this packet.
