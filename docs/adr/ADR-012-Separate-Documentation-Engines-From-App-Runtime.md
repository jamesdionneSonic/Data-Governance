# ADR-012: Separate Documentation Engines From App Runtime

## Status

Accepted

## Date

2026-06-19

## Context

The Data Governance repository now contains two different kinds of Node.js
work:

- the running app, API, UI, and shared services under `src/`;
- batch documentation and lineage engines currently implemented mostly as
  executable files under `scripts/`.

The current layout is workable for maintainers but not clear enough for
repeatable medium-intelligence work. A Codex session has to infer which scripts
are command wrappers, which scripts contain engine logic, which scripts publish
to Confluence or DevOps, and which scripts are safe to modify for a specific
documentation family.

The repository also needs a clear boundary between generated support
documentation engines, Sonic lineage runtime packaging, connector metadata
harvest, and the app-facing API/UI code. Without that boundary, broad refreshes
and page-generation changes risk accidental coupling to app runtime behavior or
live publish flows.

## Decision

Documentation, catalog, connector, and lineage-runtime engines will be moved
out of broad `scripts/` implementations into named folders under `engines/`.
The `scripts/` directory will remain the command-line surface used by npm
scripts, scheduled jobs, and Codex commands, but scripts should become thin
wrappers around engine modules.

The target layout is:

```text
engines/
  catalog/
    rebuild/
    repo-export/
    validation/
  lineage-runtime/
    package/
    indexes/
    answers/
    validation/
  confluence-human-catalog/
    database-catalog/
    product-catalog/
    object-pages/
    validation/
    publish/
  support-docs/
    shared/
    adf/
    ssis/
    ssrs/
    validation/
    publish/
  connectors/
    shared-runtime/
    adf/
    sql-server/
    ssis/
    ssrs/
  governance/
    packets/
    checks/

scripts/
  thin command wrappers only

src/
  app, API, UI, and app runtime services
```

The folder names are part of the architecture contract:

| Folder                             | Purpose                                                                                       |
| ---------------------------------- | --------------------------------------------------------------------------------------------- |
| `engines/catalog`                  | Build local markdown/catalog artifacts from sanitized metadata and raw catalog sources.       |
| `engines/lineage-runtime`          | Build, index, validate, and package machine-readable lineage artifacts for DevOps and skills. |
| `engines/confluence-human-catalog` | Generate and publish human-facing Sonic Data Lineage Confluence pages.                        |
| `engines/support-docs`             | Generate and publish ADF, SSIS, and SSRS support documentation.                               |
| `engines/connectors`               | Shared connector runtime extensions and source-specific metadata adapters.                    |
| `engines/governance`               | Execution packets, validation helpers, and policy checks used by engine workflows.            |
| `scripts`                          | Stable command wrappers; do not accumulate new engine logic here.                             |
| `src`                              | Runtime application code: API, UI, middleware, app services, and interactive features.        |

Existing npm commands should remain stable during migration. A command such as
`npm run confluence:human:dry-run` may continue to execute
`scripts/build-human-confluence-catalog-dry-run.mjs`, but that script should
delegate to `engines/confluence-human-catalog/...` once migrated.

## Implementation Rules

- New documentation-generation logic must be added under `engines/`, not as a
  new large script in `scripts/`.
- New executable commands may be added under `scripts/` only when they are thin
  wrappers around engine modules.
- Move one engine family at a time. Do not combine folder migration, generator
  behavior changes, and live publish in the same pass.
- Keep npm script names stable unless a separate migration plan updates every
  caller and maintainer document.
- Shared deterministic logic belongs under `engines/support-docs/shared`,
  `engines/connectors/shared-runtime`, or `engines/lineage-runtime` depending on
  ownership. Do not duplicate source-specific versions of the same engine rule.
- App/UI changes remain under `src/`. Vue or frontend code may consume runtime
  artifacts, but it must not become the source of truth for Confluence or DevOps
  documentation generation.
- Generated outputs stay in the existing generated-data areas such as `data/`,
  `docs/`, `outputs/`, or `tmp/` unless a later ADR changes the artifact layout.
- Live publication remains governed by the existing Confluence, DevOps, and
  support-documentation approval rules.

## Medium-Intelligence Migration Contract

A balanced Codex session at normal speed with medium thinking may perform a
folder migration when the work is limited to:

1. one engine family, such as SSRS support docs or the human database catalog;
2. moving implementation code under the matching `engines/` folder;
3. leaving existing npm command names in place;
4. updating imports and wrapper scripts;
5. running the existing dry-run/check/build commands;
6. avoiding live publish.

Stop and request stronger review before:

- moving multiple engine families in one pass;
- changing parser, extractor, auth, connector, or publish behavior;
- replacing npm command names used by docs or automation;
- changing generated page content and folder structure in the same migration;
- running broad live Confluence or DevOps publication.

## Consequences

- Future maintainers can identify engine ownership from paths instead of
  guessing from script names.
- Codex can safely route medium-intelligence work to one bounded folder.
- The app remains cleaner: runtime API/UI code stays under `src`, while batch
  generation and publishing engines live under `engines`.
- The migration can happen incrementally without breaking existing commands.

## Related Documents

- `docs/CODEX_ENGINE_FOLDERING_MIGRATION_PACKET.md`
- `docs/adr/ADR-004-Single-Shared-Connector-Runtime.md`
- `docs/adr/ADR-009-Human-Centered-Confluence-Lineage-Catalog.md`
- `docs/adr/ADR-011-Unified-Support-Documentation-Refresh-Contract.md`
- `docs/CONFLUENCE_DATABASE_CATALOG_LAYOUT.md`
