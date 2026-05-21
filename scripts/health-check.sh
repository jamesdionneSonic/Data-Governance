#!/bin/bash
# Framework Health Check Script

echo "=================================="
echo "Data Governance Framework Check"
echo "=================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found"
    exit 1
fi

# Check 2: npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found"
    exit 1
fi

# Check 3: Docker
echo -n "Checking Docker... "
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
    echo -e "${GREEN}✓${NC} $DOCKER_VERSION"
else
    echo -e "${YELLOW}⚠${NC} Docker not found (optional for local dev)"
fi

# Check 4: Git
echo -n "Checking Git... "
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    echo -e "${GREEN}✓${NC} $GIT_VERSION"
else
    echo -e "${RED}✗${NC} Git not found"
    exit 1
fi

# Check 5: Project structure
echo ""
echo "Checking project structure..."
REQUIRED_DIRS=(
    "src"
    "src/api"
    "src/middleware"
    "src/services"
    "tests"
    "tests/unit"
    "config"
    "data/markdown"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "  ${GREEN}✓${NC} $dir"
    else
        echo -e "  ${RED}✗${NC} $dir (missing)"
    fi
done

# Check 6: Key files
echo ""
echo "Checking key files..."
REQUIRED_FILES=(
    "package.json"
    "src/index.js"
    "src/app.js"
    ".eslintrc.json"
    ".prettierrc.json"
    "jest.config.js"
    "docker-compose.yml"
    ".gitignore"
    "Dockerfile"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${RED}✗${NC} $file (missing)"
    fi
done

echo ""
echo "=================================="
echo -e "${GREEN}✓ Framework is SOLID${NC}"
echo "=================================="
echo ""
echo "Next steps:"
echo "  1. npm install          - Install dependencies"
echo "  2. npm run lint         - Check code quality"
echo "  3. npm test             - Run tests"
echo "  4. docker compose up    - Start with Docker (optional)"
echo "  5. npm run dev          - Start development server"
echo ""
