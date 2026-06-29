# Connector Metadata Delta Engine

This engine implements ADR-028 for source-agnostic metadata comparison.

## Placement

Core implementation:

```text
engines/connectors/metadata-delta/
```

Thin command wrapper:

```text
scripts/plan-source-metadata-delta.mjs
```

Future app/service wrappers should import the engine instead of duplicating
comparison logic.

## Baseline

The comparison baseline is the DevOps lineage repository:

```text
../Sonic-data-lineage
```

Primary baseline files:

- `registry/object-registry.jsonl`
- object context packs referenced by `context_pack_json_path`

Rovo and Confluence pages are downstream outputs. They must not be used to
decide whether source metadata changed.

## Canonical Current Object Shape

The engine accepts current metadata objects in this minimum shape:

```json
{
  "canonical_id": "object:source:database.schema.object",
  "display_name": "database.schema.object",
  "object_type": "table",
  "database": "Sonic_DW",
  "schema": "dbo",
  "object_name": "DimVehicle",
  "source_family": "sql_server",
  "source_system": "connector-id",
  "metadata": {
    "columns": [],
    "lineage_edges": [],
    "definition_hash": ""
  }
}
```

Aliases accepted for `canonical_id`:

- `object_id`
- `id`
- `canonicalId`

If the object already provides `metadata_signature`, that signature is used.
Otherwise, the engine computes one from stable metadata fields.

## Delta Manifest

The engine emits:

- new objects
- changed objects
- unchanged objects
- retained stale objects
- removed stale objects when `full_refresh` is explicitly used

Downstream processing must use this manifest before AI summaries, DevOps writes,
runtime package updates, Rovo artifact generation, or Confluence publication.
