---
term: Personally Identifiable Information
domain: Compliance
status: approved
owner: privacy-team
steward: privacy.officer@company.com
abbreviation: PII
related_terms: [GDPR, Sensitive Data, Data Classification, Confidential]
tags: [compliance, privacy, classification, pii]
created_at: 2026-01-01
last_reviewed: 2026-06-01
---

# Personally Identifiable Information (PII)

## Definition

**Personally Identifiable Information (PII)** refers to any data that could potentially be
used to identify a specific individual, either alone or in combination with other data.

## Examples of PII

- Full name, email address, phone number
- Social Security Number (SSN), passport number
- Physical address, IP address, device identifiers
- Biometric data, health information, financial records

## Classification Requirements

All data assets containing PII must be tagged with:

- `sensitivity: confidential` or `sensitivity: restricted`
- `classification: pii`
- An assigned Data Steward from the Privacy team

## Regulatory Context

- **GDPR (EU)**: Requires consent, right to erasure, data minimization
- **CCPA (California)**: Requires disclosure and opt-out rights
- **HIPAA (US Healthcare)**: Specific rules for healthcare PII (PHI)

## Handling Requirements

- Encrypt at rest and in transit
- Log all access
- Restrict to need-to-know basis
- Anonymize or pseudonymize for analytics use
