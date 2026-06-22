# Sonic Lineage Recommendations

This folder is the controlled intake location for teammate lineage, SSIS, and rule-engine recommendations.

Recommendations are not implementation changes. They are review requests backed by approved package artifacts and, when needed, read-only raw evidence.

## Folder Structure

```text
recommendations/
  intake/       New teammate submissions
  reviewed/     Reviewed recommendations with decision recorded
  templates/    Submission templates
```

## Rules

- Do not include raw row values, sample values, report result rows, credentials, tokens, connection strings, or PII values.
- Do not modify ingestion engines, parser engines, extractor code, generator code, or catalog rebuild scripts from this workflow.
- Include package version and runtime content hash.
- Cite exact package artifact paths.
- Cite exact raw evidence file paths and why raw evidence was needed when raw
  evidence is used.
- Maintainers decide whether a recommendation becomes implementation work.

## Template

Use `recommendations/templates/rule-recommendation.md`.

Reviewers use `recommendations/templates/review-decision.md`.

Accepted engine-behavior recommendations use
`recommendations/templates/accepted-recommendation-test-plan.md` before
implementation starts.

## Codex Workflow

When using `$sonic-lineage-consumer`, resolve the object or package from the
approved runtime package first, then cite package artifacts. Open read-only raw
evidence only when package artifacts cannot prove the current or expected
behavior. When raw evidence is used, include a `Raw evidence:` line with exact
file paths and the reason package artifacts were not enough. This workflow
produces review-ready recommendations only; maintainers turn accepted
recommendations into tests and implementation work.

## Reviewer Workflow

Maintainers review recommendations from `recommendations/intake/`.

1. Confirm package version and runtime content hash are present.
2. Confirm cited package artifact paths are advertised by the package.
3. Confirm any raw evidence paths are exact files, safe, read-only, and
   necessary.
4. Choose a decision:
   - `accepted`
   - `rejected`
   - `needs evidence`
   - `converted to work item`
5. Record the decision using `recommendations/templates/review-decision.md`.
6. Move reviewed recommendations to `recommendations/reviewed/` with the
   decision record or append the decision to the submitted recommendation.
7. If accepted for engine behavior, create implementation work for maintainers.
   Do not let the teammate evidence workflow edit engine code directly.
8. Before implementation starts, create an accepted-recommendation test plan
   that names the failing test, assertion, command, expected pre-fix failure,
   and expected post-fix pass.
