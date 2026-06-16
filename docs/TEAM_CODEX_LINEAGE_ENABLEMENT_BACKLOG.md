# Team Codex Lineage Enablement Backlog

## Executive Summary

The immediate goal is not to "move everything to Azure." The immediate goal is to let teammates use the same Sonic lineage evidence in Codex without local drift, unsafe writes, or inconsistent answers.

The recommended path is:

1. Update AI-facing documentation first so medium-intelligence agents can execute safely.
2. Formalize the runtime package and consumer contract.
3. Publish and validate one approved package version.
4. Ship a team Codex plugin/skill that consumes that package.
5. Expose read-only raw evidence for traceability and rule recommendations.
6. Stop before Azure platform expansion and ask for explicit approval.

Azure remains the right long-term operating platform for governed UI access, Entra ID, audit, and production operations. It should not be allowed to start until the package/plugin operating model is stable.

## Execution Constraint

All backlog items must be written so they can be executed by a balanced Codex model at normal speed with medium thinking, referred to here as `5.5 medium max`.

That means each implementation packet must include:

- exact files to read first
- exact commands to run
- expected outputs
- acceptance criteria
- rollback or no-change rule
- whether code edits are allowed
- whether ingestion engine edits are prohibited

## Phase 0: AI Documentation And Guardrails First

Objective: make future AI runs safe before any teammate enablement or cloud work starts.

| ID      | Item                                                                 | Status   | Owner               | Acceptance Criteria                                                                                                   |
| ------- | -------------------------------------------------------------------- | -------- | ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| TCE-000 | Approve ADR-007 for package-first team enablement                    | Proposed | Data/platform owner | ADR accepted or revised; decision recorded before plugin/cloud work                                                   |
| TCE-001 | Publish this consumer contract as required AI context                | Proposed | Data/platform owner | `docs/SONIC_LINEAGE_RUNTIME_CONSUMER_CONTRACT.md` is linked from docs index and referenced by skill/plugin docs       |
| TCE-002 | Update Sonic lineage skill instructions to use the consumer contract | Planned  | Skill owner         | Skill reads approved runtime package first, cites artifacts, and refuses ingestion-engine edits in teammate workflows |
| TCE-003 | Add a medium-model execution packet template                         | Planned  | Data/platform owner | Template includes files to read, commands, acceptance checks, and prohibited areas                                    |
| TCE-004 | Add AI safety note to contributor docs                               | Planned  | Repo maintainer     | `CONTRIBUTOR.md` says teammate evidence workflows may create recommendations, not ingestion changes                   |
| TCE-005 | Add package/version disclosure rule                                  | Planned  | Skill owner         | Codex answers include package version/hash when used for decisions                                                    |
| TCE-006 | Add "no path guessing" instruction to AI docs                        | Planned  | Skill owner         | Skill follows `indexes/path-contract.json` and `indexes/artifact-manifest.json`                                       |
| TCE-007 | Add hard-stop instruction before Azure Phase 5                       | Proposed | Data/platform owner | AI docs include required STOP prompt before Azure platform work                                                       |

Exit criteria:

- ADR, contract, and backlog are linked from documentation.
- Future agents know the source of truth, prohibited write areas, and hard-stop rule.
- No teammate workflow can be interpreted as permission to update ingestion engines.

## Phase 1: Runtime Package Contract And Validation

Objective: make the package the stable product boundary.

| ID      | Item                                                            | Status  | Owner         | Acceptance Criteria                                                                                                                 |
| ------- | --------------------------------------------------------------- | ------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| TCE-101 | Reconcile existing runtime backlog with current manifest counts | Planned | Package owner | `LINEAGE_RUNTIME_PACKAGE_BACKLOG.md` reflects current package version, object count, file count, and hash                           |
| TCE-102 | Define approved package manifest fields                         | Planned | Package owner | Manifest includes package name, version, generated time, source repo, object count, database count, content hash, validation status |
| TCE-103 | Define published package readback contract                      | Planned | Package owner | Clean consumer can resolve object, open answer card, open context pack, open SSIS context, and report package version               |
| TCE-104 | Add package compatibility matrix                                | Planned | Package owner | Matrix states which skill/plugin version supports which package schema version                                                      |
| TCE-105 | Add package approval checklist                                  | Planned | Package owner | Checklist includes runtime check, answer quality, profile-index safety, publish dry-run, live publish, readback                     |
| TCE-106 | Add stale-package warning behavior                              | Planned | Skill owner   | Skill warns when local cache version is older than approved latest                                                                  |
| TCE-107 | Validate package can support SSIS documentation workflows       | Planned | SSIS owner    | Test prompts cover folder, project, package, source reads, lookup reads, target maintenance, writes, and package calls              |

Exit criteria:

- There is one approved runtime package version.
- Published package can be read without local-only paths.
- Consumers can prove which version they used.

## Phase 2: Team Codex Plugin Or Repo Skill

Objective: give teammates a consistent Codex entry point without embedding the data payload in the skill.

Recommendation: use a plugin for team distribution once stable. Use a repo-scoped skill during iteration.

| ID      | Item                                                    | Status  | Owner               | Acceptance Criteria                                                                                                        |
| ------- | ------------------------------------------------------- | ------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| TCE-201 | Decide plugin vs repo-scoped skill for first team pilot | Planned | Data/platform owner | Decision records pilot scope, install path, update process, and owner                                                      |
| TCE-202 | Build `sonic-lineage-consumer` skill                    | Planned | Skill owner         | Skill explains retrieval order, citation rules, raw evidence rules, and recommendation workflow                            |
| TCE-203 | Add SSIS documentation subworkflow                      | Planned | Skill owner         | Skill can produce support docs from package and raw evidence without editing generators                                    |
| TCE-204 | Add rule recommendation subworkflow                     | Planned | Skill owner         | Skill outputs structured recommendation, not code changes                                                                  |
| TCE-205 | Add install/readme docs for teammates                   | Planned | Skill owner         | Teammate can install plugin/skill and point it to approved package                                                         |
| TCE-206 | Add smoke prompt suite                                  | Planned | Skill owner         | Prompts cover "what feeds this," "what uses this," "trace SSIS package," "recommend rule change," and "explain confidence" |
| TCE-207 | Add package cache location convention                   | Planned | Skill owner         | Plugin/skill has deterministic cache path and does not scan arbitrary local copies first                                   |

Exit criteria:

- Two teammates can install and use the same skill/plugin.
- Both get the same answer for baseline prompts from the same package version.
- Skill refuses ingestion-engine edits unless explicitly run by a maintainer in implementation mode.

## Phase 3: Read-Only Raw Evidence Access And Recommendation Intake

Objective: let teammates trace evidence and submit useful recommendations without giving them ingestion-engine write access.

Decision: yes, make raw evidence available, but only as a read-only evidence bundle with strict boundaries.

| ID      | Item                                        | Status  | Owner               | Acceptance Criteria                                                                                                      |
| ------- | ------------------------------------------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| TCE-301 | Define raw evidence bundle contents         | Planned | Data/platform owner | Bundle includes only approved SSIS/XML/parser/source evidence needed for traceability                                    |
| TCE-302 | Exclude unsafe raw data                     | Planned | Data/platform owner | No raw row values, sample values, report result rows, credentials, tokens, connection strings, or unrestricted payloads  |
| TCE-303 | Separate evidence access from engine access | Planned | Repo/security owner | Teammates can read evidence but cannot write `src/services`, `scripts/rebuild*`, extractor, parser, or generator code    |
| TCE-304 | Create rule recommendation schema           | Planned | Rule owner          | Recommendation includes package version, object, current behavior, expected behavior, evidence paths, impact, confidence |
| TCE-305 | Create recommendation queue                 | Planned | Rule owner          | Recommendations are stored in a reviewable folder/system separate from engine code                                       |
| TCE-306 | Add reviewer workflow                       | Planned | Rule owner          | Maintainer can accept, reject, request evidence, or convert recommendation into implementation work                      |
| TCE-307 | Add tests for accepted rule recommendations | Planned | Rule owner          | Accepted recommendation creates failing test first, then engine change by maintainer only                                |
| TCE-308 | Add raw evidence citation requirement       | Planned | Skill owner         | Codex cites exact evidence files used for recommendation                                                                 |

Exit criteria:

- Teammates can trace tables/packages themselves.
- Teammates can submit recommendations.
- Teammates cannot update ingestion engines through the evidence workflow.

## Phase 4: Pilot, Training, And Operating Model

Objective: prove the workflow with real Sonic problems before platform expansion.

| ID      | Item                              | Status  | Owner               | Acceptance Criteria                                                                                       |
| ------- | --------------------------------- | ------- | ------------------- | --------------------------------------------------------------------------------------------------------- |
| TCE-401 | Select 2-3 pilot teammates        | Planned | Data/platform owner | Pilot users represent data engineering, BI/support, and governance or operations                          |
| TCE-402 | Select pilot use cases            | Planned | Data/platform owner | Use cases include SSIS documentation, lineage validation, and impact/rule recommendation                  |
| TCE-403 | Run baseline prompt parity test   | Planned | Skill owner         | All pilot users get same answer/version/citations for baseline prompts                                    |
| TCE-404 | Run SSIS documentation pilot      | Planned | SSIS owner          | Pilot produces one reviewed SSIS support document with citations                                          |
| TCE-405 | Run rule recommendation pilot     | Planned | Rule owner          | Pilot submits at least three recommendations, with accepted/rejected outcomes recorded                    |
| TCE-406 | Add training guide                | Planned | Data/platform owner | Guide explains approved package, raw evidence boundaries, and how to submit recommendations               |
| TCE-407 | Measure pilot friction            | Planned | Data/platform owner | Track stale package issues, missing evidence, confusing answers, bad recommendations, and access problems |
| TCE-408 | Update backlog from pilot results | Planned | Data/platform owner | Issues are converted into package, skill, contract, or platform backlog items                             |

Exit criteria:

- Pilot users can work without your local machine.
- Recommendations improve the rules engine without uncontrolled engine edits.
- The package/plugin model is proven useful before Azure expansion.

## Phase 5: HARD STOP Before Azure Platform Expansion

Objective: prevent premature cloud/platform work.

This phase is not work. It is a mandatory decision gate.

Required Codex prompt before any Phase 5 work:

`STOP: Phase 5 starts Azure platform expansion. The package/plugin operating model must be accepted first. Do you want to continue into Azure platform work now?`

| ID           | Item                            | Status               | Owner               | Acceptance Criteria                                                                                 |
| ------------ | ------------------------------- | -------------------- | ------------------- | --------------------------------------------------------------------------------------------------- |
| TCE-STOP-501 | Confirm Phase 0-4 exit criteria | Blocked Until Review | Data/platform owner | Evidence shows docs, contract, package, plugin/skill, raw evidence controls, and pilot are accepted |
| TCE-STOP-502 | Ask explicit continue question  | Blocked Until Review | Codex/user          | Codex asks the STOP question and waits for explicit approval                                        |
| TCE-STOP-503 | Record management decision      | Blocked Until Review | Data/platform owner | Decision logged as continue, defer, or reject Azure phase                                           |

No Azure App Service, Azure SQL, Blob, Redis, Key Vault, managed identity, private endpoint, production Entra deployment, or cloud migration work may start before this stop is cleared.

## Phase 6: Azure Platform Expansion Only If Approved

Objective: move the proven operating model to a governed platform.

| ID      | Item                                     | Status      | Owner          | Acceptance Criteria                                                                 |
| ------- | ---------------------------------------- | ----------- | -------------- | ----------------------------------------------------------------------------------- |
| TCE-601 | Refresh cloud migration runbook          | Not Started | Platform owner | Runbook reflects current app/package reality, not stale "no running services" state |
| TCE-602 | Define Azure target data plane           | Not Started | Platform owner | Decide what lives in Azure SQL, Blob, Redis, App Insights, and package feed         |
| TCE-603 | Define production auth and RBAC          | Not Started | Security owner | Entra groups map to app roles and package/evidence access policies                  |
| TCE-604 | Implement package ingestion in cloud app | Not Started | Platform owner | Cloud app reads approved package version and reports version/hash                   |
| TCE-605 | Add observability and audit              | Not Started | Platform owner | Package access, searches, exports, and recommendation submissions are auditable     |
| TCE-606 | Run dual operation                       | Not Started | Platform owner | Cloud UI and Codex package consumers return consistent answers                      |

## Required ADRs And Contracts

| Artifact                     | Purpose                                                                               | Status                         |
| ---------------------------- | ------------------------------------------------------------------------------------- | ------------------------------ |
| ADR-007                      | Package-first team Codex enablement, raw evidence boundaries, Azure hard stop         | Proposed                       |
| Runtime consumer contract    | Defines package, raw evidence, recommendation, and skill/plugin rules                 | Proposed                       |
| Package manifest contract    | Defines required package fields and compatibility                                     | Needed                         |
| Raw evidence access contract | Defines what raw evidence can be shared and what is prohibited                        | Needed, partially covered here |
| Rule recommendation contract | Defines teammate recommendation format and review workflow                            | Needed                         |
| Plugin/skill contract        | Defines retrieval order, citation rules, refusal behavior, and cache/version behavior | Needed                         |
| Azure phase entry contract   | Defines stop gate and minimum criteria before cloud work                              | Needed, partially covered here |

## Raw Data Recommendation

Make raw evidence available, but do not make raw data broadly editable or authoritative.

The useful middle ground is a read-only raw evidence bundle. Teammates should be able to trace how a table, procedure, package, or report was interpreted. They should be able to submit a recommendation when they find a bad rule or missing edge. They should not be able to change ingestion engines directly.

This is the right boundary because the team needs creativity at the evidence and recommendation layer, while ingestion/parser changes need controlled ownership, tests, and release discipline.

## Management Decisions Needed

| Decision                 | Options                                          | Recommendation                                                                     |
| ------------------------ | ------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Team distribution format | Repo skill, personal skill, plugin               | Start repo skill for pilot, graduate to workspace plugin                           |
| Data distribution        | Git repo only, Azure Artifacts package, both     | Use versioned package as canonical; DevOps repo as inspectable generated companion |
| Raw evidence access      | None, full raw access, read-only evidence bundle | Read-only evidence bundle                                                          |
| Engine write access      | Broad teammate write, maintainer-only, no one    | Maintainer-only                                                                    |
| Azure timing             | Start now, after pilot, defer indefinitely       | Hard stop after Phase 4; continue only with explicit approval                      |

## Success Measures

- 100% of Codex answers cite package version for decision-grade answers.
- Baseline prompts return the same answer for all pilot users.
- No teammate workflow writes to ingestion engine code.
- Rule recommendations include evidence paths and package hash.
- Accepted recommendations create tests before engine changes.
- Azure work does not start until Phase 5 stop is explicitly approved.
