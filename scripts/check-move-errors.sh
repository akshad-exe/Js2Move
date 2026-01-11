#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m'

SEARCH_DIR="${1:-.}"
BYTECODE_VERSION=6
ERRORS_FOUND=0
PACKAGES_CHECKED=0
ERROR_PACKAGES=()

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Move Code Check - All Packages${NC}"
echo -e "${BLUE}Directory: $SEARCH_DIR${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Find all Move.toml files (each indicates a package)
PACKAGES=$(find "$SEARCH_DIR" -name "Move.toml" -type f | xargs dirname | sort)

if [ -z "$PACKAGES" ]; then
    echo -e "${YELLOW}⚠ No Move packages found in $SEARCH_DIR${NC}"
    exit 1
fi

# Check each package
for PACKAGE_DIR in $PACKAGES; do
    PACKAGE_NAME=$(basename "$PACKAGE_DIR")
    PACKAGES_CHECKED=$((PACKAGES_CHECKED + 1))
    
    echo -e "${MAGENTA}[Package $PACKAGES_CHECKED: $PACKAGE_NAME]${NC}"
    
    # Run syntax check
    CHECK_OUTPUT=$(cd "$PACKAGE_DIR" && movement move build --bytecode-version $BYTECODE_VERSION 2>&1)
    
    # Extract errors and warnings
    ERRORS=$(echo "$CHECK_OUTPUT" | grep -E "(^error:|^warning:)" || true)
    
    if [ -z "$ERRORS" ]; then
        echo -e "${GREEN}  ✓ No errors or warnings${NC}"
    else
        echo -e "${RED}  ✗ Found issues:${NC}"
        echo "$ERRORS" | while read -r line; do
            if echo "$line" | grep -q "^error:"; then
                echo -e "    ${RED}$line${NC}"
            else
                echo -e "    ${YELLOW}$line${NC}"
            fi
        done
        ERROR_PACKAGES+=("$PACKAGE_NAME")
        ERRORS_FOUND=$((ERRORS_FOUND + 1))
    fi
    echo ""
done

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo "Packages checked: $PACKAGES_CHECKED"
echo "Packages with errors: $ERRORS_FOUND"

if [ $ERRORS_FOUND -eq 0 ]; then
    echo -e "${GREEN}✓ All packages passed syntax check!${NC}"
    exit 0
else
    echo -e "${RED}✗ Issues found in:${NC}"
    for pkg in "${ERROR_PACKAGES[@]}"; do
        echo -e "  ${RED}• $pkg${NC}"
    done
    exit 1
fi
