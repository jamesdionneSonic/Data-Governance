# Recommendation Review Decision

## Recommendation

- original file:
- reviewer:
- review date:
- decision: `accepted / rejected / needs evidence / converted to work item`

## Decision Summary

Explain the review outcome in plain English.

## Evidence Reviewed

Package artifacts:

-

Raw evidence paths, if reviewed:

-

## Review Notes

- package version/hash confirmed: yes/no
- artifact paths are package-advertised: yes/no
- raw evidence is safe and necessary: yes/no/not used
- recommendation changes engine behavior: yes/no
- recommendation changes documentation only: yes/no

## Required Follow-Up

Choose one:

- no change
- request more evidence from submitter
- update documentation
- create implementation work item
- create failing test first
- reject and archive

Details:

If the recommendation is accepted for engine, parser, extractor, generator, or
classification behavior, create
`recommendations/templates/accepted-recommendation-test-plan.md` before
implementation starts.

## Implementation Boundary

If accepted for engine/parser/extractor/generator behavior, maintainers must
create implementation work outside the teammate evidence workflow. Accepted
recommendations do not directly change ingestion engines.
