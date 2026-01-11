#!/bin/bash
# Test Move package unit tests

set -e

echo "🧪 Movement Move Unit Tests"
echo "=============================="

# Configuration
PACKAGE_DIR="${1:-.}"
PACKAGE_NAME=$(basename "$PACKAGE_DIR")
BYTECODE_VERSION="${3:-6}"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}📦 Package: ${PACKAGE_NAME}${NC}"
echo -e "${BLUE}📁 Directory: ${PACKAGE_DIR}${NC}"
echo ""

# Step 1: Verify package structure
echo -e "${BLUE}Step 1: Verifying package structure...${NC}"
if [ ! -f "$PACKAGE_DIR/Move.toml" ]; then
  echo -e "${RED}❌ Move.toml not found${NC}"
  exit 1
fi
if [ ! -d "$PACKAGE_DIR/sources" ]; then
  echo -e "${RED}❌ sources/ directory not found${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Package structure valid${NC}"
echo ""

# Step 2: Check Movement CLI
echo -e "${BLUE}Step 2: Checking Movement CLI...${NC}"
if ! command -v movement &> /dev/null; then
  echo -e "${RED}❌ Movement CLI not found${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Movement CLI available${NC}"
echo ""

# Step 3: Run tests
echo -e "${BLUE}Step 3: Running unit tests...${NC}"
echo -e "${YELLOW}Command: movement move test --package-dir \"$PACKAGE_DIR\" --bytecode-version $BYTECODE_VERSION${NC}"
echo ""

if movement move test \
  --package-dir "$PACKAGE_DIR" \
  --bytecode-version "$BYTECODE_VERSION"; then
  echo ""
  echo -e "${GREEN}✅ All tests passed!${NC}"
  echo ""
else
  echo ""
  echo -e "${RED}❌ Tests failed${NC}"
  exit 1
fi
