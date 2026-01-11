#!/bin/bash
# Deployment Script for Js2Move Compiled Contracts
# This script compiles MoveJS files to Move and deploys them to Movement Network

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CLI_BIN="$PROJECT_ROOT/packages/cli/dist/index.js"
BUILD_DIR="$PROJECT_ROOT/build/deployed"
TESTNET_PROFILE="${1:-testnet}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Ensure we have required tools
check_requirements() {
  if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is required but not installed${NC}"
    exit 1
  fi
  
  if ! command -v movement &> /dev/null; then
    echo -e "${RED}Error: Movement CLI is required but not installed${NC}"
    echo "Install with: curl -s https://raw.githubusercontent.com/movementlabsxyz/movement/main/scripts/install.sh | bash"
    exit 1
  fi

  echo -e "${GREEN}✓ Requirements satisfied${NC}"
}

# Create Move project structure from compiled code
create_move_project() {
  local module_name=$1
  local move_code=$2
  local project_dir="$BUILD_DIR/$module_name"
  
  mkdir -p "$project_dir/sources"
  
  # Create Move.toml
  cat > "$project_dir/Move.toml" << EOF
[package]
name = "$module_name"
version = "0.0.1"

[dependencies.Aptos]
git = "https://github.com/aptos-labs/aptos-core.git"
git_subdir = "aptos-move/framework/aptos-framework"
rev = "main"

[addresses]
$module_name = "0x1"
EOF

  # Write Move source
  echo "$move_code" > "$project_dir/sources/${module_name,,}.move"
  
  echo -e "${GREEN}✓ Created Move project: $project_dir${NC}"
  echo "$project_dir"
}

# Compile a single MoveJS file to Move
compile_movejs() {
  local movejs_file=$1
  
  if [ ! -f "$movejs_file" ]; then
    echo -e "${RED}Error: File not found: $movejs_file${NC}"
    return 1
  fi
  
  echo -e "${YELLOW}Compiling: $(basename $movejs_file)${NC}"
  node "$CLI_BIN" compile -s "$movejs_file"
}

# Deploy compiled Move code to testnet
deploy_to_testnet() {
  local module_name=$1
  local move_code=$2
  
  echo -e "${YELLOW}Creating Move project for $module_name...${NC}"
  local project_dir=$(create_move_project "$module_name" "$move_code")
  
  echo -e "${YELLOW}Building Move package...${NC}"
  cd "$project_dir"
  movement aptos move build --profile "$TESTNET_PROFILE" || {
    echo -e "${RED}Build failed for $module_name${NC}"
    return 1
  }
  
  echo -e "${YELLOW}Publishing to Movement Testnet ($TESTNET_PROFILE)...${NC}"
  movement aptos move publish --profile "$TESTNET_PROFILE" || {
    echo -e "${RED}Publish failed for $module_name${NC}"
    return 1
  }
  
  cd - > /dev/null
  echo -e "${GREEN}✓ Successfully deployed $module_name${NC}"
}

# Main deployment workflow
main() {
  echo -e "${YELLOW}========== Js2Move Deployment Script ==========${NC}"
  
  check_requirements
  mkdir -p "$BUILD_DIR"
  
  # Array of examples to deploy
  local examples=(
    "01-helloworld"
    "02-simple-token"
    "03-nft"
    "04-defi-vault"
    "05-voting-contract"
  )
  
  local deployed=0
  local failed=0
  
  for example in "${examples[@]}"; do
    local movejs_file="$PROJECT_ROOT/packages/compiler/examples/${example}.movejs"
    local module_name="${example#*-}" # Remove number prefix
    module_name="${module_name//-/_}"  # Replace hyphens with underscores
    module_name="${module_name^}"      # Capitalize first letter
    
    echo -e "\n${YELLOW}=== Deploying: $example ===${NC}"
    
    # Compile MoveJS to Move
    local move_code=$(compile_movejs "$movejs_file") || {
      echo -e "${RED}✗ Compilation failed for $example${NC}"
      ((failed++))
      continue
    }
    
    # Deploy to testnet
    deploy_to_testnet "$module_name" "$move_code" || {
      ((failed++))
      continue
    }
    
    ((deployed++))
  done
  
  echo -e "\n${YELLOW}========== Deployment Summary ==========${NC}"
  echo -e "${GREEN}Deployed: $deployed${NC}"
  echo -e "${RED}Failed: $failed${NC}"
  
  if [ $failed -eq 0 ]; then
    echo -e "${GREEN}All contracts deployed successfully!${NC}"
    return 0
  else
    echo -e "${RED}Some contracts failed to deploy${NC}"
    return 1
  fi
}

main "$@"
