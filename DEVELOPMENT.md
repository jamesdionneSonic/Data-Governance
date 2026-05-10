# Development Guide

## Local Setup

### Prerequisites
- Node.js 18+ 
- Docker Desktop
- Git

### Initial Setup

```bash
# Clone repository
git clone https://github.com/jamesdionneSonic/Data-Governance.git
cd Data-Governance

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Setup git hooks
npm run prepare
```

### Running Locally

#### Option 1: Full Stack (Recommended)
```bash
docker compose up -d

# Frontend: http://localhost:5173
# Backend: http://localhost:3000
# Meilisearch: http://localhost:7700
```

#### Option 2: Backend Only (for development)
```bash
# Terminal 1: Start Meilisearch + Frontend via Docker
docker compose up -d meilisearch frontend

# Terminal 2: Run backend locally
npm run dev
```

## Development Workflow

### Making Changes

1. **Create feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make code changes**
   - Follow existing code style (ESLint will validate)
   - Write tests for new functionality
   - Aim for >80% coverage

3. **Run checks locally**
```bash
npm run lint        # Fix linting issues
npm run format      # Format code
npm test           # Run tests
npm run test:e2e   # Run E2E tests (optional)
```

4. **Commit changes**
```bash
git add .
git commit -m "feat: description of changes"
```
   - Pre-commit hooks will run linting automatically
   - If hooks fail, fix the issues and try again

5. **Push and create PR**
```bash
git push origin feature/your-feature-name
# Create PR on GitHub
```

### Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start backend in development mode |
| `npm run start` | Start backend in production mode |
| `npm test` | Run unit tests with coverage |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:e2e` | Run Cypress E2E tests |
| `npm run test:e2e:open` | Open Cypress UI |
| `npm run lint` | Run ESLint and fix issues |
| `npm run format` | Format code with Prettier |

## Project Structure

```
src/
├── api/              # Express route handlers
├── services/         # Business logic (parsing, search, permissions)
├── middleware/       # Express middleware (auth, error handling, logging)
├── utils/            # Utility functions and configuration
└── frontend/         # Frontend app placeholder

tests/
├── unit/            # Unit tests
└── e2e/             # End-to-end tests (Cypress)

config/             # Configuration files
data/              # Markdown documentation files
docker/            # Docker related files
.github/           # GitHub Actions workflows
```

## Code Standards

### JavaScript/ES6
- Use ES6 modules (`import`/`export`)
- Use async/await for promises
- No `var`, use `let` and `const`
- Use arrow functions where appropriate

### Naming
- camelCase for variables and functions
- PascalCase for classes and components
- UPPER_CASE for constants
- Prefix private methods with `_`

### Comments
```javascript
/**
 * Brief description of what this does
 * @param {type} paramName - Description of parameter
 * @returns {type} Description of return value
 */
export function myFunction(paramName) {
  // Implementation
}
```

### Testing
- All new features require tests
- Target >80% code coverage
- Use descriptive test names
- Group related tests in `describe` blocks

```javascript
describe('Feature Name', () => {
  test('should do something specific', () => {
    // Arrange, Act, Assert pattern
  });
});
```

## Debugging

### Backend
```bash
# Run with debug logging
DEBUG=* npm run dev

# Use Node debugger
node --inspect src/index.js
# Then open chrome://inspect in Chrome
```

### Frontend
- React DevTools browser extension
- Redux DevTools extension
- Network tab in browser DevTools

### Docker
```bash
# View logs
docker compose logs -f backend
docker compose logs -f meilisearch

# Execute command in container
docker compose exec backend npm test

# Shell into container
docker compose exec backend sh
```

## Git Workflow

### Branch Naming
```
feature/description        # New feature
fix/description           # Bug fix
docs/description          # Documentation
refactor/description      # Code refactoring
test/description          # Test additions
```

### Commit Message Format
```
type: description

Optional detailed explanation
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples**:
```
feat: add markdown parser service
fix: handle circular dependencies in lineage
docs: update local dev setup guide
```

### Pull Request
- Title: `[PHASE0-001] Brief description`
- Description: Include what changed and why
- Link related issues
- Request reviewers
- Ensure CI passes

## Getting Help

- **Questions**: Open GitHub Discussion
- **Bugs**: File GitHub Issue with reproduction steps
- **Documentation**: Check [docs/DEVELOPMENT.md](../docs/DEVELOPMENT.md)
- **Architecture**: See [docs/ENTERPRISE_ARCHITECTURE.md](../docs/ENTERPRISE_ARCHITECTURE.md)

## Performance Tips

- Use `npm run test:watch` during development
- Hot-reload is enabled in backend container
- Frontend auto-rebuilds on changes
- Check coverage report to find untested code

## Common Issues

### "Port already in use"
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm ci
```

### "Docker container won't start"
```bash
# Rebuild container
docker compose build --no-cache
docker compose up -d
```

## Next Steps

- Read [docs/ENTERPRISE_ARCHITECTURE.md](../docs/ENTERPRISE_ARCHITECTURE.md)
- Review [docs/PRODUCT_REQUIREMENTS.md](../docs/PRODUCT_REQUIREMENTS.md)
- Check Phase 1 stories in [docs/PROJECT_BACKLOG.md](../docs/PROJECT_BACKLOG.md)
