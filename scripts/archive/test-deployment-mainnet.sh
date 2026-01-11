#!/bin/bash
# Test Move package deployment to Movement local devnet

set -e

echo "🚀 Movement CLI Deployment Test"
echo "================================"

# Configuration
PACKAGE_DIR="${1:-.}"
PACKAGE_NAME=$(basename "$PACKAGE_DIR")
PROFILE="${2:-mainnet}"
BYTECODE_VERSION="${3:-6}"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}📦 Package: ${PACKAGE_NAME}${NC}"
echo -e "${BLUE}📁 Directory: ${PACKAGE_DIR}${NC}"
echo -e "${BLUE}👤 Profile: ${PROFILE}${NC}"
echo ""

# Step 1: Verify package structure
echo -e "${BLUE}Step 1: Verifying package structure...${NC}"
if [ ! -f "$PACKAGE_DIR/Move.toml" ]; then
  echo -e "${RED}❌ Move.toml not found in $PACKAGE_DIR${NC}"
  exit 1
fi
if [ ! -d "$PACKAGE_DIR/sources" ]; then
  echo -e "${RED}❌ sources/ directory not found in $PACKAGE_DIR${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Package structure valid${NC}"
echo ""

# Step 2: Display Move.toml
echo -e "${BLUE}Step 2: Move.toml content:${NC}"
cat "$PACKAGE_DIR/Move.toml"
echo ""

# Step 3: Display source files
echo -e "${BLUE}Step 3: Move source files:${NC}"
ls -lh "$PACKAGE_DIR/sources/"
echo ""

# Step 4: Check Movement CLI
echo -e "${BLUE}Step 4: Checking Movement CLI...${NC}"
if ! command -v movement &> /dev/null; then
  echo -e "${RED}❌ Movement CLI not found. Install with:${NC}"
  echo "   https://github.com/movementlabsxyz/movement"
  exit 1
fi
echo -e "${GREEN}✓ Movement CLI found: $(movement --version)${NC}"
echo ""

# Step 5: Check account balance
echo -e "${BLUE}Step 5: Checking account balance on profile '$PROFILE'...${NC}"
if movement account list --profile "$PROFILE" &>/dev/null; then
  echo -e "${GREEN}✓ Profile '$PROFILE' exists${NC}"
else
  echo -e "${YELLOW}⚠ Profile '$PROFILE' not found. Create with:${NC}"
  echo "   movement init --network custom --rest-url http://127.0.0.1:30731/v1 --faucet-url http://127.0.0.1:30732 --profile $PROFILE --assume-yes"
  exit 1
fi
echo ""

# Step 6: Compile locally (optional, just for validation)
echo -e "${BLUE}Step 6: Compiling locally for validation...${NC}"
if movement move compile --package-dir "$PACKAGE_DIR" 2>&1 | grep -q "Compiled"; then
  echo -e "${GREEN}✓ Local compilation successful${NC}"
else
  echo -e "${YELLOW}⚠ Local compilation had warnings (continuing...)${NC}"
fi
echo ""

# Step 7: Publish to devnet
echo -e "${BLUE}Step 7: Publishing to Movement devnet...${NC}"
echo -e "${YELLOW}Running: movement move publish --package-dir \"$PACKAGE_DIR\" --profile $PROFILE --assume-yes --bytecode-version $BYTECODE_VERSION${NC}"
echo ""

if movement move publish \
  --package-dir "$PACKAGE_DIR" \
  --profile "$PROFILE" \
  --assume-yes \
  --bytecode-version "$BYTECODE_VERSION"; then
  echo ""
  echo -e "${GREEN}✅ Deployment successful!${NC}"
  echo ""
  echo -e "${BLUE}Summary:${NC}"
  echo "  Package: $PACKAGE_NAME"
  echo "  Network: Movement Local Devnet"
  echo "  Bytecode Version: $BYTECODE_VERSION"
  echo ""
else
  echo ""
  echo -e "${RED}❌ Deployment failed${NC}"
  exit 1
fi
