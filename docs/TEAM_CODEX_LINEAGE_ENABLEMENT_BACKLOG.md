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

| ID      | Item                                                                 | Status | Owner               | Acceptance Criteria                                                                                                                                   |
| ------- | -------------------------------------------------------------------- | ------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| TCE-000 | Approve ADR-007 for package-first team enablement                    | Done   | Data/platform owner | ADR accepted and decision recorded before plugin/cloud work                                                                                           |
| TCE-001 | Publish this consumer contract as required AI context                | Done   | Data/platform owner | `docs/SONIC_LINEAGE_RUNTIME_CONSUMER_CONTRACT.md` is linked from docs index, contributor rules, and skill docs                                        |
| TCE-002 | Update Sonic lineage skill instructions to use the consumer contract | Done   | Skill owner         | Skill now defines approved-package mode, cites version/hash expectations, and refuses ingestion-engine edits in teammate workflows                    |
| TCE-003 | Add a medium-model execution packet template                         | Done   | Data/platform owner | `docs/CODEX_LINEAGE_EXECUTION_PACKET_TEMPLATE.md` includes files to read, commands, acceptance checks, and prohibited areas                           |
| TCE-004 | Add AI safety note to contributor docs                               | Done   | Repo maintainer     | `CONTRIBUTOR.md` says teammate evidence workflows may submit recommendations, not update ingestion/parser/extractor/generator/rebuild code            |
| TCE-005 | Add package/version disclosure rule                                  | Done   | Skill owner         | Skill requires package version/hash in evidence lines for decision-grade approved-package answers                                                     |
| TCE-006 | Add "no path guessing" instruction to AI docs                        | Done   | Skill owner         | Skill and execution packet require advertised paths from entrypoints, path contract, artifact manifest, registry rows, answer cards, or context packs |
| TCE-007 | Add hard-stop instruction before Azure Phase 5                       | Done   | Data/platform owner | Skill, contributor rules, contract, execution packet, and backlog include required STOP prompt before Azure platform work                             |

Exit criteria:

- ADR, contract, and backlog are linked from documentation.
- Future agents know the source of truth, prohibited write areas, and hard-stop rule.
- No teammate workflow can be interpreted as permission to update ingestion engines.

## Phase 1: Runtime Package Contract And Validation

Objective: make the package the stable product boundary.

| ID      | Item                                                            | Status | Owner         | Acceptance Criteria                                                                                                                                                                                                                                                       |
| ------- | --------------------------------------------------------------- | ------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TCE-101 | Reconcile existing runtime backlog with current manifest counts | Done   | Package owner | `LINEAGE_RUNTIME_PACKAGE_BACKLOG.md` reflects current package version `2026.6.13-1`, local hash, published hash, object count `6692`, and payload file count `83461`                                                                                                      |
| TCE-102 | Define approved package manifest fields                         | Done   | Package owner | `docs/LINEAGE_RUNTIME_PACKAGE_MANIFEST_CONTRACT.md` defines required identity, source, count, hash, entrypoint, quality-gate, and validation fields; current package uses approval/readback records for final validation status until the next schema embeds `validation` |
| TCE-103 | Define published package readback contract                      | Done   | Package owner | `docs/LINEAGE_RUNTIME_READBACK_PROCESS.md` defines clean-consumer readback, baseline checks, and package version/hash reporting                                                                                                                                           |
| TCE-104 | Add package compatibility matrix                                | Done   | Package owner | `docs/LINEAGE_RUNTIME_PACKAGE_COMPATIBILITY_MATRIX.md` states which skill/script/plugin consumers support package schema `1`, approved package version `2026.6.13-1`, and future plugin/Azure compatibility gates                                                         |
| TCE-105 | Add package approval checklist                                  | Done   | Package owner | `docs/LINEAGE_RUNTIME_PACKAGE_APPROVAL_CHECKLIST.md` includes runtime check, answer quality, profile-index safety, publish dry-run, live publish/existing-version proof, published readback, and skill smoke checks                                                       |
| TCE-106 | Add stale-package warning behavior                              | Done   | Skill owner   | Consumer-kit and maintainer skill/contract warn when package version/hash is older, mismatched, missing, or cannot be checked against approved latest                                                                                                                     |
| TCE-107 | Validate package can support SSIS documentation workflows       | Done   | SSIS owner    | `npm run lineage:runtime:ssis-check` covers folder, project, package, source reads, lookup reads, target maintenance, writes/loads, package calls, and column mappings                                                                                                    |

Exit criteria:

- There is one approved runtime package version.
- Published package can be read without local-only paths.
- Consumers can prove which version they used.

## Phase 2: Team Codex Plugin Or Repo Skill

Objective: give teammates a consistent Codex entry point without embedding the data payload in the skill.

Recommendation: use a plugin for team distribution once stable. Use a repo-scoped skill during iteration.

| ID      | Item                                                    | Status | Owner               | Acceptance Criteria                                                                                                                                                                                                                   |
| ------- | ------------------------------------------------------- | ------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TCE-201 | Decide plugin vs repo-scoped skill for first team pilot | Done   | Data/platform owner | Pilot uses repo-scoped `.agents/skills/sonic-lineage-consumer`; graduate to workspace plugin after pilot                                                                                                                              |
| TCE-202 | Build `sonic-lineage-consumer` skill                    | Done   | Skill owner         | `.agents/skills/sonic-lineage-consumer/SKILL.md` explains retrieval order, citation rules, raw evidence rules, and recommendation workflow                                                                                            |
| TCE-203 | Add SSIS documentation subworkflow                      | Done   | Skill owner         | Consumer-kit and maintainer skill define package-first SSIS support-doc workflow, output shape, evidence classification, raw-evidence boundary, and generator-edit prohibition                                                        |
| TCE-204 | Add rule recommendation subworkflow                     | Done   | Skill owner         | Consumer-kit and maintainer skill route bad lineage, SSIS classification, missing edge, and summary-rule issues into structured recommendations instead of code changes                                                               |
| TCE-205 | Add install/readme docs for teammates                   | Done   | Skill owner         | `.agents/README.md` and `docs/TEAM_CODEX_LINEAGE_TRAINING_GUIDE.md` explain repo skill setup and approved package usage                                                                                                               |
| TCE-206 | Add smoke prompt suite                                  | Done   | Skill owner         | `docs/TEAM_CODEX_LINEAGE_SMOKE_PROMPTS.md` covers "what feeds this," "what uses this," "trace SSIS package," "recommend rule change," and "explain confidence"                                                                        |
| TCE-207 | Add package cache location convention                   | Done   | Skill owner         | Consumer-kit and maintainer docs require explicit `LINEAGE_RUNTIME_PACKAGE_ROOT` or repo-local `.lineage-runtime-cache/sonic-data-lineage-runtime/<version>/sonic-data-lineage-runtime/`; arbitrary local folder scans are prohibited |

Exit criteria:

- Two teammates can install and use the same skill/plugin.
- Both get the same answer for baseline prompts from the same package version.
- Skill refuses ingestion-engine edits unless explicitly run by a maintainer in implementation mode.

## Phase 3: Read-Only Raw Evidence Access And Recommendation Intake

Objective: let teammates trace evidence and submit useful recommendations without giving them ingestion-engine write access.

Decision: yes, make raw evidence available, but only as a read-only evidence bundle with strict boundaries.

| ID      | Item                                        | Status | Owner               | Acceptance Criteria                                                                                                                                                                    |
| ------- | ------------------------------------------- | ------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TCE-301 | Define raw evidence bundle contents         | Done   | Data/platform owner | `docs/RAW_EVIDENCE_ACCESS_CONTROL.md` defines approved SSIS/XML/parser/source evidence needed for traceability                                                                         |
| TCE-302 | Exclude unsafe raw data                     | Done   | Data/platform owner | `docs/RAW_EVIDENCE_ACCESS_CONTROL.md` excludes raw values, sample values, report rows, credentials, tokens, secrets, PII                                                               |
| TCE-303 | Separate evidence access from engine access | Done   | Repo/security owner | Raw evidence access doc and skill forbid teammate writes to ingestion/parser/extractor/generator/rebuild code                                                                          |
| TCE-304 | Create rule recommendation schema           | Done   | Rule owner          | `recommendations/templates/rule-recommendation.md` captures package version, object, behavior, evidence, impact, confidence                                                            |
| TCE-305 | Create recommendation queue                 | Done   | Rule owner          | `recommendations/intake/` and `recommendations/reviewed/` provide controlled review folders separate from engine code                                                                  |
| TCE-306 | Add reviewer workflow                       | Done   | Rule owner          | `recommendations/README.md` and `recommendations/templates/review-decision.md` define accept, reject, needs-evidence, and work-item conversion decisions                               |
| TCE-307 | Add tests for accepted rule recommendations | Done   | Rule owner          | `recommendations/templates/accepted-recommendation-test-plan.md` requires failing test, assertion, command, expected pre-fix failure, and expected post-fix pass before implementation |
| TCE-308 | Add raw evidence citation requirement       | Done   | Skill owner         | Consumer-kit and maintainer docs require exact raw evidence file paths plus the reason raw evidence was needed                                                                         |

Exit criteria:

- Teammates can trace tables/packages themselves.
- Teammates can submit recommendations.
- Teammates cannot update ingestion engines through the evidence workflow.

## Phase 4: Pilot, Training, And Operating Model

Objective: prove the workflow with real Sonic problems before platform expansion.

| ID      | Item                              | Status  | Owner               | Acceptance Criteria                                                                                                       |
| ------- | --------------------------------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| TCE-401 | Select 2-3 pilot teammates        | Planned | Data/platform owner | Pilot users represent data engineering, BI/support, and governance or operations                                          |
| TCE-402 | Select pilot use cases            | Planned | Data/platform owner | Use cases include SSIS documentation, lineage validation, and impact/rule recommendation                                  |
| TCE-403 | Run baseline prompt parity test   | Planned | Skill owner         | All pilot users get same answer/version/citations for baseline prompts                                                    |
| TCE-404 | Run SSIS documentation pilot      | Planned | SSIS owner          | Pilot produces one reviewed SSIS support document with citations                                                          |
| TCE-405 | Run rule recommendation pilot     | Planned | Rule owner          | Pilot submits at least three recommendations, with accepted/rejected outcomes recorded                                    |
| TCE-406 | Add training guide                | Done    | Data/platform owner | `docs/TEAM_CODEX_LINEAGE_TRAINING_GUIDE.md` explains approved package, raw evidence boundaries, and recommendation intake |
| TCE-407 | Measure pilot friction            | Planned | Data/platform owner | Track stale package issues, missing evidence, confusing answers, bad recommendations, and access problems                 |
| TCE-408 | Update backlog from pilot results | Planned | Data/platform owner | Issues are converted into package, skill, contract, or platform backlog items                                             |

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

| Artifact                     | Purpose                                                                               | Status                                                                                                                                                                                |
| ---------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ADR-007                      | Package-first team Codex enablement, raw evidence boundaries, Azure hard stop         | Accepted                                                                                                                                                                              |
| Runtime consumer contract    | Defines package, raw evidence, recommendation, and skill/plugin rules                 | Published as required context                                                                                                                                                         |
| Package manifest contract    | Defines required package fields and compatibility                                     | Published in `docs/LINEAGE_RUNTIME_PACKAGE_MANIFEST_CONTRACT.md`                                                                                                                      |
| Package approval checklist   | Defines required validation, publish, readback, and skill smoke gates per version     | Published in `docs/LINEAGE_RUNTIME_PACKAGE_APPROVAL_CHECKLIST.md`                                                                                                                     |
| Raw evidence access contract | Defines what raw evidence can be shared and what is prohibited                        | Published in `docs/RAW_EVIDENCE_ACCESS_CONTROL.md`                                                                                                                                    |
| Rule recommendation contract | Defines teammate recommendation format and review workflow                            | Published in `recommendations/templates/rule-recommendation.md`, `recommendations/templates/review-decision.md`, and `recommendations/templates/accepted-recommendation-test-plan.md` |
| Plugin/skill contract        | Defines retrieval order, citation rules, refusal behavior, and cache/version behavior | Repo-scoped pilot skill published in `.agents/skills/sonic-lineage-consumer/`                                                                                                         |
| Azure phase entry contract   | Defines stop gate and minimum criteria before cloud work                              | Needed, partially covered here                                                                                                                                                        |

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
