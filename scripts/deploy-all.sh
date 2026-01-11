#!/bin/bash
# Deploy all Move packages to Movement devnet

set -e

echo "🚀 Deploy All Move Packages to Movement"
echo "========================================"

PACKAGES_DIR="/mnt/e/Codebase/Hackathon/Js2Move/packages/compiler/out/aptos"
PROFILE="${1:-local-dev}"
BYTECODE_VERSION="${2:-6}"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get all package directories
PACKAGES=$(find "$PACKAGES_DIR" -maxdepth 1 -type d -not -path "$PACKAGES_DIR" | sort)

if [ -z "$PACKAGES" ]; then
    echo -e "${RED}No packages found in $PACKAGES_DIR${NC}"
    exit 1
fi

echo -e "${BLUE}Found packages:${NC}"
for PACKAGE_DIR in $PACKAGES; do
    PACKAGE_NAME=$(basename "$PACKAGE_DIR")
    echo "  - $PACKAGE_NAME"
done
echo ""

# Deploy each package
for PACKAGE_DIR in $PACKAGES; do
    PACKAGE_NAME=$(basename "$PACKAGE_DIR")

    echo -e "${YELLOW}Deploying: $PACKAGE_NAME${NC}"
    echo "─────────────────────────────────────"

    if bash /mnt/e/Codebase/Hackathon/Js2Move/scripts/test-deployment.sh "$PACKAGE_DIR" "$PROFILE" "$BYTECODE_VERSION"; then
        echo -e "${GREEN}✅ $PACKAGE_NAME deployed successfully!${NC}"
        echo ""
    else
        echo -e "${RED}❌ $PACKAGE_NAME deployment failed${NC}"
        exit 1
    fi
done

echo -e "${GREEN}🎉 All packages deployed successfully!${NC}"