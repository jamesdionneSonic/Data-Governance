# Frontend

This folder is reserved for frontend-specific source artifacts.

## Purpose

- Hold UI entry points or feature code when the frontend is managed inside `src/`
- Coordinate with the Docker-based frontend shell in `docker/frontend/`

## Notes

- Keep the frontend thin and focused on presentation.
- Reuse backend data only through the API layer.
- If the active frontend lives elsewhere, keep this folder documented until the structure is consolidated.
