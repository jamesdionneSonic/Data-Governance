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
- Cite package artifacts and raw evidence paths.
- Maintainers decide whether a recommendation becomes implementation work.

## Template

Use `recommendations/templates/rule-recommendation.md`.
