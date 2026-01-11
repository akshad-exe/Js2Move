#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PACKAGES_DIR="/mnt/e/Codebase/Hackathon/Js2Move/packages/compiler/out/aptos"
BYTECODE_VERSION=6
FAILED_TESTS=()
PASSED_TESTS=()

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Move Contract Build & Test Suite${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if packages directory exists
if [ ! -d "$PACKAGES_DIR" ]; then
    echo -e "${RED}Error: Packages directory not found at $PACKAGES_DIR${NC}"
    exit 1
fi

# Get all package directories
PACKAGES=$(find "$PACKAGES_DIR" -maxdepth 1 -type d -not -path "$PACKAGES_DIR" | sort)

if [ -z "$PACKAGES" ]; then
    echo -e "${RED}No packages found in $PACKAGES_DIR${NC}"
    exit 1
fi

# Iterate through each package
for PACKAGE_DIR in $PACKAGES; do
    PACKAGE_NAME=$(basename "$PACKAGE_DIR")
    
    echo -e "${YELLOW}[Package: $PACKAGE_NAME]${NC}"
    echo "─────────────────────────────────────"
    
    # Check if Move.toml exists
    if [ ! -f "$PACKAGE_DIR/Move.toml" ]; then
        echo -e "${RED}✗ Move.toml not found${NC}"
        FAILED_TESTS+=("$PACKAGE_NAME (missing Move.toml)")
        echo ""
        continue
    fi
    
    # Build the package
    echo -e "${BLUE}Building...${NC}"
    BUILD_OUTPUT=$(cd "$PACKAGE_DIR" && movement move build --bytecode-version $BYTECODE_VERSION 2>&1)
    BUILD_EXIT=$?
    
    if [ $BUILD_EXIT -eq 0 ]; then
        echo -e "${GREEN}✓ Build successful${NC}"
    else
        echo -e "${RED}✗ Build failed${NC}"
        echo "$BUILD_OUTPUT"
        FAILED_TESTS+=("$PACKAGE_NAME (build)")
        echo ""
        continue
    fi
    
    # Run unit tests
    echo -e "${BLUE}Running unit tests...${NC}"
    TEST_OUTPUT=$(cd "$PACKAGE_DIR" && movement move test --bytecode-version $BYTECODE_VERSION 2>&1)
    TEST_EXIT=$?
    
    if [ $TEST_EXIT -eq 0 ]; then
        # Extract test results
        TEST_COUNT=$(echo "$TEST_OUTPUT" | grep -oP 'Total tests: \K[0-9]+' || echo "0")
        PASSED_COUNT=$(echo "$TEST_OUTPUT" | grep -oP 'passed: \K[0-9]+' || echo "0")
        
        if [ "$TEST_COUNT" -eq 0 ]; then
            echo -e "${YELLOW}⚠ No tests found${NC}"
        else
            echo -e "${GREEN}✓ Tests passed ($PASSED_COUNT/$TEST_COUNT)${NC}"
            PASSED_TESTS+=("$PACKAGE_NAME")
        fi
    else
        echo -e "${RED}✗ Tests failed${NC}"
        echo "$TEST_OUTPUT" | tail -10
        FAILED_TESTS+=("$PACKAGE_NAME (test)")
    fi
    
    echo ""
done

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Summary${NC}"
echo -e "${BLUE}========================================${NC}"

if [ ${#PASSED_TESTS[@]} -gt 0 ]; then
    echo -e "${GREEN}Passed:${NC}"
    for test in "${PASSED_TESTS[@]}"; do
        echo -e "  ${GREEN}✓${NC} $test"
    done
fi

if [ ${#FAILED_TESTS[@]} -gt 0 ]; then
    echo ""
    echo -e "${RED}Failed:${NC}"
    for test in "${FAILED_TESTS[@]}"; do
        echo -e "  ${RED}✗${NC} $test"
    done
    exit 1
else
    echo -e "${GREEN}All packages passed!${NC}"
    exit 0
fi
