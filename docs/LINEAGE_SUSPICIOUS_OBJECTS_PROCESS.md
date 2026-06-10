# Suspicious Object Investigation Process

## Purpose

Create a repeatable way to investigate lineage gaps, capture reusable evidence, and feed only stable lessons into the engine backlog.

## What Counts As Suspicious

Add an object to the queue when one or more of these are true:

- It has rows and recent data but `external_or_unresolved` lineage
- It has zero upstream edges but clearly business-real columns
- It has retry, queue, or workflow columns that suggest app-owned loading
- It strongly overlaps a known source or view but the engine did not connect them
- It appears in SSIS, jobs, or reports, but the target table still has no writer

## Investigation Order

Work from cheapest evidence to most expensive evidence:

1. Raw markdown object record
2. Neighboring tables and procedures in the same domain
3. SSIS package XML
4. Staging and DW objects
5. Live source-system connections
6. SQL Agent and orchestration metadata
7. Application or external process evidence

## Standard Investigation Checklist

### 1. Baseline The Object

- Record canonical object ID
- Record row count, freshness, and profile status if available
- Record current lineage status and edge counts

### 2. Compare Shape

- Compare columns to nearby source tables, views, and staging facts
- Note overlapping columns
- Note target-only columns that imply enrichment, process state, or app behavior

### 3. Search For Physical Writers

- Stored procedures
- Views
- Functions
- Triggers
- SSIS packages
- SQL Agent jobs
- App/service code if available

### 4. Search For Logical Sources

- Business views
- Source-system tables
- Domain staging tables
- Lookup and mapping tables

### 5. Classify Findings

- `positive`: direct raw evidence proves the edge
- `review`: strong probable source, but not a verified physical writer
- `unresolved_final_writer`: target is real, but final loader remains hidden
- `negative`: candidate looked plausible but is unsupported

### 6. Capture Engine Lessons

- Did this case expose a reusable parser blind spot?
- Did it expose a scoring problem?
- Did it expose a status-classification problem?
- Add or update a row in `docs/LINEAGE_ENGINE_TUNING_BACKLOG.md`

## Deliverable For Each Object

Use this format in the queue:

```text
Object:
Family:
Priority:
Status:

Why suspicious:

Evidence:
- ...

Validated edges:
- ...

Review edges:
- ...

Unresolved edges:
- ...

Potential engine lessons:
- ...

Next best step:
```

## Triage Strategy

- Resolve one source family at a time
- Prefer high-row-count and recently updated unresolved objects first
- Revisit the engine only after several objects point to the same lesson
- Keep unresolved-but-useful findings in the queue instead of forcing premature engine changes

## Queue Location

- Durable queue: `docs/LINEAGE_OBJECT_INVESTIGATION_QUEUE.md`
- Engine lesson backlog: `docs/LINEAGE_ENGINE_TUNING_BACKLOG.md`
