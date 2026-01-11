#!/bin/bash
# Simple deployment guide for testing compiled contracts

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLI="$PROJECT_ROOT/packages/cli/dist/index.js"
BUILD_DIR="$PROJECT_ROOT/deploy-test"

echo "Setting up test deployment..."
mkdir -p "$BUILD_DIR"
cd "$BUILD_DIR"

# Function to create and deploy a contract
deploy_contract() {
  local name=$1
  local example=$2
  
  echo ""
  echo "=== Deploying $name ==="
  
  # Compile
  echo "Compiling..."
  MOVE_CODE=$(node "$CLI" compile -s "$PROJECT_ROOT/packages/compiler/examples/$example.movejs")
  
  if [ $? -ne 0 ]; then
    echo "Compilation failed!"
    return 1
  fi
  
  # Create Move project
  mkdir -p "$name/sources"
  cat > "$name/Move.toml" << EOF
[package]
name = "$name"
version = "0.0.1"

[dependencies.Aptos]
git = "https://github.com/aptos-labs/aptos-core.git"
git_subdir = "aptos-move/framework/aptos-framework"
rev = "main"

[addresses]
$name = "0x1"
EOF

  echo "$MOVE_CODE" > "$name/sources/${name,,}.move"
  
  echo "Building Move package..."
  cd "$name"
  movement aptos move build --profile testnet
  
  if [ $? -ne 0 ]; then
    echo "Build failed!"
    cd ..
    return 1
  fi
  
  echo "Publishing to testnet..."
  movement aptos move publish --profile testnet
  
  if [ $? -ne 0 ]; then
    echo "Publish failed!"
    cd ..
    return 1
  fi
  
  cd ..
  echo "✓ Deployed $name successfully!"
}

# Deploy all contracts
echo "Starting deployment of Js2Move contracts..."

deploy_contract "Helloworld" "01-helloworld"
deploy_contract "SimpleToken" "02-simple-token"
deploy_contract "NFT" "03-nft"
deploy_contract "DefiVault" "04-defi-vault"
deploy_contract "VotingContract" "05-voting-contract"

echo ""
echo "=== Deployment Complete ==="
echo "Contracts deployed to Movement Testnet"
