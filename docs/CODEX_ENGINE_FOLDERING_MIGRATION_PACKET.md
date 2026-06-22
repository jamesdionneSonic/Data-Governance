# Codex Engine Foldering Migration Packet

Use this packet when moving existing batch/documentation engine logic out of
`scripts/` and into the ADR-012 `engines/` layout.

This packet is for repository maintainers. It is not for the separate lineage
consumer kit.

## Required Reading

Before making changes, read:

1. `docs/adr/ADR-012-Separate-Documentation-Engines-From-App-Runtime.md`
2. `AI_README.md`
3. `AGENTS.md`
4. Any ADR that owns the selected engine family

Examples:

| Engine family                 | Additional contract                                                      |
| ----------------------------- | ------------------------------------------------------------------------ |
| Human Confluence catalog      | `docs/adr/ADR-009-Human-Centered-Confluence-Lineage-Catalog.md`          |
| Database catalog/object pages | `docs/adr/ADR-013-Complete-Database-Catalog-And-Object-Library-Pages.md` |
| ADF/SSIS/SSRS support docs    | `docs/adr/ADR-011-Unified-Support-Documentation-Refresh-Contract.md`     |
| Connector runtime             | `docs/adr/ADR-004-Single-Shared-Connector-Runtime.md`                    |
| ADF operations                | `docs/adr/ADR-010-ADF-Operations-Through-Saved-Connector.md`             |
| SSIS native hierarchy         | `docs/adr/ADR-006-SSIS-Native-Hierarchy-And-Classified-Lineage.md`       |

## Migration Goal

Move implementation logic into a named `engines/` folder while preserving the
existing command surface.

The desired pattern is:

```text
scripts/<command>.mjs
  thin wrapper only
  imports and invokes
engines/<family>/<capability>/index.mjs
```

Npm scripts should continue to call the wrapper until a separate approved
command migration changes automation and docs.

## Medium-Safe Scope

Choose exactly one engine family per pass:

```text
catalog
lineage-runtime
confluence-human-catalog
support-docs/adf
support-docs/ssis
support-docs/ssrs
connectors/adf
connectors/sql-server
```

Allowed in a medium-intelligence pass:

- create the matching `engines/` subfolders;
- move engine implementation code for the selected family;
- leave command wrappers in `scripts/`;
- update imports;
- update docs that point to the old implementation path;
- run existing local checks and dry runs;
- keep generated output paths unchanged.

Not allowed in the same pass:

- live Confluence publish;
- DevOps package publish;
- auth or secret changes;
- parser/extractor behavior changes;
- semantic-lineage scoring changes;
- broad generated content changes;
- moving more than one unrelated engine family.

## Required Checklist

Fill this out in the working notes or PR description.

| Item                             | Answer |
| -------------------------------- | ------ |
| Engine family                    |        |
| Old implementation files         |        |
| New engine folder                |        |
| Wrapper scripts preserved        |        |
| Npm commands preserved           |        |
| Generated output paths unchanged |        |
| Docs updated                     |        |
| Dry-run command                  |        |
| Validation command               |        |
| Live publish avoided             | Yes    |

## Validation Commands

Run the smallest validation set that proves the moved family still works.

Common checks:

```powershell
npm run build
```

Human catalog:

```powershell
npm run confluence:human:dry-run
npm run confluence:human:check
```

Support docs:

```powershell
npm run adf:support:generate
npm run adf:support:dry-run
npm run ssrs:support:generate
```

Lineage runtime:

```powershell
npm run lineage:runtime:package
npm run lineage:runtime:check
npm run lineage:answers:check
```

Catalog repo:

```powershell
npm run catalog:repo:export
npm run catalog:repo:check
```

## Documentation Update Rules

When a file moves, update:

- `AI_README.md` if future Codex routing changes;
- `AGENTS.md` if the boundary affects maintainer behavior;
- the owning ADR or contract only if the architecture changed;
- command examples only if the command name changes.

Do not update generated docs manually to hide a migration bug. Fix the engine
or wrapper instead.

## Stop Conditions

Stop and ask for review when:

- a command needs to be renamed;
- generated output changes unexpectedly;
- the moved engine imports from `src` in a way that creates an app dependency;
- validation requires live credentials or live publish;
- the migration exposes secrets, raw rows, or unrestricted runtime output.
