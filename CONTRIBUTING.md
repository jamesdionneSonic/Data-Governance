# Contributing

Thanks for contributing to Data Governance.

## Engineering Guardrails (Non-Negotiable)

- Use **Backend-for-Frontend (BFF)** architecture for all frontend-facing APIs.
- Use **Infrastructure as Code (IaC) First** for all environment/platform changes.
- Do not implement monolithic code paths; prefer modular, reusable components.
- Do not implement monolithic UI surfaces; every page must have one primary workflow owner, one primary job, and one default user state.
- Validate all incoming/outgoing contracts.
- Reuse the shared connector/runtime engine for source connections, tests, ingestion, profiling, and schedules; do not create a second SQL/SSIS connection path.
- Do not run ad-hoc SQL Server, ODBC, `mssql`, `msnodesqlv8`, `sqlcmd`, or SSIS probes outside the shared connector runtime; add guarded diagnostics inside the runtime instead.
- Follow `docs/UI_WORKFLOW_SPEC.md` and `docs/adr/ADR-005-Workflow-Led-UI-Surfaces.md` before adding cards, tables, tabs, buttons, or navigation entries.

## Branching

- `main` is protected.
- Create feature branches from `main`: `feature/<phase>-<short-name>`.
- Keep pull requests focused and small when possible.

## Pull Request Requirements

- Link to backlog story/phase in PR description.
- Name the workflow owner for UI changes, such as Home/Search, Lineage Explorer, Glossary & Metrics, Review Work, Profiling, Connections, Lineage Acquisition, or Platform Admin.
- For UI workflow remediation backlog work, complete the packet in `docs/CODEX_UI_WORK_PACKET_TEMPLATE.md` and follow `docs/UI_WORKFLOW_MIGRATION_PLAN.md`.
- Include test evidence and impact notes.
- Include docs updates when behavior/contracts change.
- Pass CI checks before merge.

## Development Flow

1. Pull latest `main`
2. Create branch
3. Implement scoped change
4. Run local checks
5. Open PR using the project template

## Required Local Checks

Before committing or pushing, run:

```bash
npm run verify:ci
```

This intentionally mirrors the GitHub Actions gates and also checks that local Git
identity and reachable `HEAD` history do not contain blocked contributor metadata.
Commits for this repository must use:

- `user.name`: `jamesdionneSonic`
- `user.email`: `james.dionne@sonicautomotive.com`

Do not commit with personal, placeholder, or stale identities such as
`GleanChef`, `jadionne@gleanchef.com`, `Your Name`, or `you@example.com`.

If GitHub still shows a removed contributor after a history rewrite, audit and
clean every reachable remote ref, including stale feature branches, pull refs,
and tags. GitHub UI contributor sidebars can lag behind the API, but old refs can
also keep old contributor metadata legitimately reachable.

## Definition of Done

- Acceptance criteria met
- Tests added/updated and passing
- Security and validation checks pass
- `npm run verify:ci` passes locally
- Documentation updated

For detailed standards, see [CONTRIBUTOR.md](CONTRIBUTOR.md).
