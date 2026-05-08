# Branch Protection Setup

This repository requires branch protection on `main`.

## Required Rules for `main`

- Require pull request before merging
- Require at least 1 approval
- Require conversation resolution before merge
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Require signed commits (if org policy requires)
- Restrict who can push to matching branches
- Do not allow force pushes
- Do not allow deletions

## Required Status Checks

Recommended check names (align with CI workflows):

- `lint`
- `unit-tests`
- `integration-tests`
- `build`
- `security-scan`
- `iac-validate`
- `iac-plan`

## Governance Notes

- All infrastructure changes must be via IaC and PR.
- Frontend feature PRs must preserve BFF boundaries.

## Setup Procedure (GitHub UI)

1. Open repository **Settings**
2. Go to **Branches**
3. Add branch protection rule for `main`
4. Enable required items above
5. Save changes
