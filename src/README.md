# Source Structure

This folder contains application source code.

## Top-level folders

- `components/` reusable UI elements
- `modules/` feature modules
- `services/` business logic and integrations
- `validators/` contract and input/output validation
- `utils/` shared helper functions
- `middleware/` request pipeline behaviors

## Rules

- Keep features modular and testable.
- Route UI data access through BFF endpoints.
- Validate contracts at all boundaries.
