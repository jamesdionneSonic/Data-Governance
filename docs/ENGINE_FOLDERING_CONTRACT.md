# Engine Foldering Contract

This is the quick-reference contract for ADR-012.

## Rule

The app lives in `src/`.

Batch engines live in `engines/`.

Command wrappers live in `scripts/`.

Generated artifacts live in the existing generated-output folders such as
`data/`, `docs/`, `outputs/`, and `tmp/`.

## Target Folders

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

## Script Policy

New large implementation files should not be added to `scripts/`.

Scripts should:

- parse CLI arguments;
- call an engine module;
- report exit status;
- keep existing npm command names stable.

Scripts should not:

- contain the primary page-generation engine;
- contain source-specific parser logic;
- contain broad publish logic that cannot be tested separately;
- duplicate shared support-doc or connector behavior.

## Migration Policy

Move one family at a time and validate with the existing command names.

Do not combine a folder migration with:

- live publishing;
- generated content redesign;
- connector auth changes;
- parser/extractor behavior changes;
- broad runtime package changes.

Use `docs/CODEX_ENGINE_FOLDERING_MIGRATION_PACKET.md` before moving code.
