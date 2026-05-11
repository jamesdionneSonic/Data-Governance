# Validators

This folder is reserved for validation helpers and contract checks.

## Purpose

- Validate input payloads
- Validate output contracts
- Enforce boundary rules before data reaches services

## Notes

- Keep validators pure and deterministic.
- Return structured validation results when possible.
- Use validators at boundaries before business logic executes.
