# ADR-010: Run Azure Data Factory Operations Through Saved Connectors

## Status

Accepted

## Date

2026-06-18

## Context

The team added a real saved Azure Data Factory connector for
`adf-dw-marketing-prod` in `rg-data-warehouse-prod`. The connector stores
source configuration and uses the shared connector runtime to collect ADF
metadata, activities, datasets, linked services, triggers, integration runtimes,
lineage, and bounded run telemetry.

The team also needs to start ADF processes from Codex during operational work.
This is higher risk than metadata harvest because starting a pipeline is an
external production side effect. A medium-thinking Codex run can perform this
work safely only when the process is made explicit, bounded, observable, and
based on the saved connector inventory.

## Decision

ADF metadata discovery, pipeline queue construction, run-history checks, and
manual pipeline starts must use the saved ADF connector as the source of truth.

For the current Sonic production marketing ADF factory, the saved connector is:

- connector id: `azure-data-factory-adf-dw-marketing-prod`
- tenant id: `b7944855-1c04-4fee-8f07-749ae6f28735`
- subscription id: `bee9b611-da99-4cfc-9fb7-50f1359e5ca2`
- resource group: `rg-data-warehouse-prod`
- factory name: `adf-dw-marketing-prod`
- credential mode: `azure_cli`

An operator or AI agent may start ADF pipelines only after:

1. confirming the saved connector test is healthy or the current Azure CLI
   context can access the same factory;
2. listing live pipeline names from the saved connector/factory;
3. creating an ordered queue and showing the selected first item;
4. starting only the selected item unless the user explicitly asks to continue
   with the next item;
5. recording the run id, start time, status, and any parameters used;
6. checking at least one status poll after the start;
7. stopping on `Failed`, `Cancelled`, permission errors, missing parameters, or
   an ambiguous pipeline selection.

The allowed operational trigger path for now is Azure Management API
`createRun` with the saved connector's factory identifiers and local delegated
Azure CLI authentication. This is a temporary operator path until the app has a
first-class guarded `runPipeline` action in the connector service. It is not a
new metadata extraction engine and must not be used to harvest ADF metadata
outside the connector runtime.

## Consequences

- Future Codex runs can operate ADF at medium thinking because the queue,
  trigger, and monitoring process is deterministic.
- Pipeline starts remain explicit, one-at-a-time, and auditable.
- ADF metadata and lineage stay governed by the shared connector runtime.
- Broad parallel triggering, parameter guessing, and hidden retries are not
  allowed.
- A future implementation should add a guarded connector-service action so the
  UI/API can trigger pipelines without shelling out to Azure CLI.

## Implementation Rules

- Use `docs/ADF_PIPELINE_OPERATIONS.md` before triggering an ADF pipeline.
- Use `docs/CODEX_ADF_OPERATION_PACKET.md` for any multi-pipeline or repeated
  ADF operation.
- Use `.agents/skills/adf-operations/SKILL.md` when Codex is asked to inspect,
  queue, trigger, monitor, or report on ADF pipelines.
- Do not invent pipeline names from Jira story titles or business wording.
- Do not start a second pipeline until the first run id and status are captured.
- Do not pass parameters unless they are provided by the user, documented by the
  pipeline definition, or already defaulted by ADF.
- Do not expose secrets, tokens, linked-service connection strings, or raw
  activity output.
- Do not use ADF activity output as business data evidence unless a separate
  approved evidence packet allows it.
- Stop and ask for stronger review before adding app code that changes
  production trigger behavior, auth, permissions, service principal use, retry
  policies, schedule automation, or parallel execution.

## Current Pipeline Queue

The first observed pipeline list from `adf-dw-marketing-prod` included child
pipelines and parent orchestrators. After inspecting triggers and pipeline
definitions, the operational queue must start at parent orchestrators:

1. `pl_Marketing_AWS_Export`
2. `pl_Marketing_AWS_Export_history` only when the user explicitly requests
   the history process

`pl_eLead_Org_Mappings` was manually started on 2026-06-18 with run id
`25a7eb13-deff-4018-bdc5-ddd70d980f2b`; it later failed because the required
operational parameters were blank. The scheduled trigger pattern shows that
`pl_Marketing_AWS_Export` creates `OpBatchID`, `OpProcessExecutionID`, and
`OpProcessExecutionStatusID`, then passes them into child pipelines.

See `docs/ADF_MARKETING_AWS_EXPORT_METADATA.md` for the current orchestration
metadata.

## Related Documents

- `docs/adr/ADR-004-Single-Shared-Connector-Runtime.md`
- `docs/CONNECTOR_EXTRACTION_FRAMEWORK.md`
- `docs/CONNECTOR_METADATA_PROFILE_FRAMEWORK.md`
- `docs/ADF_PIPELINE_OPERATIONS.md`
- `docs/ADF_MARKETING_AWS_EXPORT_METADATA.md`
- `docs/CODEX_ADF_OPERATION_PACKET.md`
- `.agents/skills/adf-operations/SKILL.md`
