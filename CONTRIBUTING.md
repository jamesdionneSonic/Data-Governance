# Contributing

Thanks for contributing to Data Governance.

## Engineering Guardrails (Non-Negotiable)

- Use **Backend-for-Frontend (BFF)** architecture for all frontend-facing APIs.
- Use **Infrastructure as Code (IaC) First** for all environment/platform changes.
- Do not implement monolithic code paths; prefer modular, reusable components.
- Validate all incoming/outgoing contracts.

## Branching

- `main` is protected.
- Create feature branches from `main`: `feature/<phase>-<short-name>`.
- Keep pull requests focused and small when possible.

## Pull Request Requirements

- Link to backlog story/phase in PR description.
- Include test evidence and impact notes.
- Include docs updates when behavior/contracts change.
- Pass CI checks before merge.

## Development Flow

1. Pull latest `main`
2. Create branch
3. Implement scoped change
4. Run local checks
5. Open PR using the project template

## Definition of Done

- Acceptance criteria met
- Tests added/updated and passing
- Security and validation checks pass
- Documentation updated

For detailed standards, see [CONTRIBUTOR.md](CONTRIBUTOR.md).
