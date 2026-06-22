# Codex ADF Operation Packet

Use this packet before multi-step Azure Data Factory operations, including
starting more than one pipeline, continuing an existing queue, monitoring a
batch of runs, or changing how ADF operations are triggered.

The goal is to make the work executable by a balanced Codex model at normal
speed with medium thinking.

## Required Pre-Flight

Read these first:

1. `docs/adr/ADR-010-ADF-Operations-Through-Saved-Connector.md`
2. `docs/ADF_PIPELINE_OPERATIONS.md`
3. `.agents/skills/adf-operations/SKILL.md`
4. `docs/adr/ADR-004-Single-Shared-Connector-Runtime.md`
5. `docs/CONNECTOR_EXTRACTION_FRAMEWORK.md`

## Operation Scope

- saved connector id:
- factory:
- subscription id:
- resource group:
- requested operation:
- operator/user request:

## Pipeline Queue

List the exact live pipeline names in order:

1.

## Selected Pipeline

- pipeline name:
- reason selected:
- parameters:
- previous run status checked: yes/no

## Commands To Run

Mark every Azure command as approval-required when sandbox escalation is needed.

- list pipelines:
- start selected pipeline:
- check selected run:
- optional activity-run check:

## Stop Conditions

Stop if any of these happen:

- selected pipeline is ambiguous or missing;
- required parameters are unknown;
- Azure context does not match the saved connector;
- run creation fails;
- run status is `Failed`, `Cancelled`, or otherwise abnormal;
- user asks for broad parallel execution;
- the task requires changing auth, permissions, retries, schedules, code, or
  service-principal behavior.

## Expected Output

- ordered queue
- selected pipeline
- run id
- first status check
- next queue item
- caveats or blockers

## Validation

Minimum validation:

- run id returned by Azure
- one status poll returned from Azure
- no secrets or raw activity output included in final response

For documentation/code updates:

- `git diff --check`
- relevant syntax or unit checks when source files change

## Completion Note

Record:

- pipeline started
- run id
- status timestamp
- parameters used
- next pipeline in queue
- whether the user must explicitly approve continuing
