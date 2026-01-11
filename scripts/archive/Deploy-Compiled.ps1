# Deployment Script for Js2Move Compiled Contracts (PowerShell)
# This script compiles MoveJS files to Move and deploys them to Movement Network

param(
    [string]$Profile = "testnet"
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$CliPath = Join-Path $ProjectRoot "packages\cli\dist\index.js"
$BuildDir = Join-Path $ProjectRoot "build\deployed"

# Color functions
function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "  $Message" -ForegroundColor Cyan
}

function Write-Step {
    param([string]$Message)
    Write-Host "`n=== $Message ===" -ForegroundColor Yellow
}

# Check requirements
function Test-Requirements {
    Write-Step "Checking Requirements"
    
    # Check Node.js
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Error "Node.js is required but not installed"
        exit 1
    }
    Write-Info "Found Node.js"
    
    # Check Movement CLI
    if (-not (Get-Command movement -ErrorAction SilentlyContinue)) {
        Write-Error "Movement CLI is required but not installed"
        Write-Info "Install with: curl -s https://raw.githubusercontent.com/movementlabsxyz/movement/main/scripts/install.sh | bash"
        exit 1
    }
    Write-Info "Found Movement CLI"
    
    # Check CLI is built
    if (-not (Test-Path $CliPath)) {
        Write-Error "CLI not found at $CliPath. Run: pnpm build"
        exit 1
    }
    Write-Info "Found Js2Move CLI"
    
    Write-Success "All requirements satisfied"
}

# Compile MoveJS to Move
function Compile-MoveJS {
    param([string]$MoveJSFile)
    
    if (-not (Test-Path $MoveJSFile)) {
        Write-Error "File not found: $MoveJSFile"
        return $null
    }
    
    Write-Info "Compiling: $(Split-Path -Leaf $MoveJSFile)"
    $output = & node $CliPath compile -s $MoveJSFile 2>$null
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Compilation failed"
        return $null
    }
    
    return $output
}

# Create Move project structure
function New-MoveProject {
    param(
        [string]$ModuleName,
        [string]$MoveCode
    )
    
    $projectDir = Join-Path $BuildDir $ModuleName
    $sourcesDir = Join-Path $projectDir "sources"
    
    # Create directories
    New-Item -ItemType Directory -Path $sourcesDir -Force | Out-Null
    
    # Create Move.toml
    $moveToml = @"
[package]
name = "$ModuleName"
version = "0.0.1"

[dependencies.Aptos]
git = "https://github.com/aptos-labs/aptos-core.git"
git_subdir = "aptos-move/framework/aptos-framework"
rev = "main"

[addresses]
$ModuleName = "0x1"
"@
    
    Set-Content -Path (Join-Path $projectDir "Move.toml") -Value $moveToml -Force
    
    # Create Move source
    $sourceFile = Join-Path $sourcesDir "$($ModuleName.ToLower()).move"
    Set-Content -Path $sourceFile -Value $MoveCode -Force
    
    Write-Success "Created Move project: $projectDir"
    return $projectDir
}

# Deploy to testnet
function Deploy-ToTestnet {
    param(
        [string]$ModuleName,
        [string]$MoveCode
    )
    
    Write-Info "Creating Move project for $ModuleName..."
    $projectDir = New-MoveProject -ModuleName $ModuleName -MoveCode $MoveCode
    
    Write-Info "Building Move package..."
    Push-Location $projectDir
    
    $buildOutput = & movement aptos move build --profile $Profile 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Build failed for $ModuleName"
        Write-Host $buildOutput
        Pop-Location
        return $false
    }
    
    Write-Info "Publishing to Movement Testnet ($Profile)..."
    $deployOutput = & movement aptos move publish --profile $Profile 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Publish failed for $ModuleName"
        Write-Host $deployOutput
        Pop-Location
        return $false
    }
    
    Pop-Location
    Write-Success "Successfully deployed $ModuleName"
    return $true
}

# Main execution
function Invoke-Deployment {
    Write-Host @"
╔════════════════════════════════════════╗
║  Js2Move Deployment Script (PowerShell)║
╚════════════════════════════════════════╝
"@ -ForegroundColor Cyan
    
    Test-Requirements
    
    # Create build directory
    New-Item -ItemType Directory -Path $BuildDir -Force | Out-Null
    
    $examples = @(
        @{ Name = "01-helloworld"; Module = "Helloworld" },
        @{ Name = "02-simple-token"; Module = "SimpleToken" },
        @{ Name = "03-nft"; Module = "NFT" },
        @{ Name = "04-defi-vault"; Module = "DefiVault" },
        @{ Name = "05-voting-contract"; Module = "VotingContract" }
    )
    
    $deployed = 0
    $failed = 0
    
    foreach ($example in $examples) {
        $moveJSFile = Join-Path $ProjectRoot "packages\compiler\examples\$($example.Name).movejs"
        $moduleName = $example.Module
        
        Write-Step "Deploying: $($example.Name)"
        
        # Compile
        $moveCode = Compile-MoveJS -MoveJSFile $moveJSFile
        if ($null -eq $moveCode) {
            Write-Error "Compilation failed for $($example.Name)"
            $failed++
            continue
        }
        
        # Deploy
        $success = Deploy-ToTestnet -ModuleName $moduleName -MoveCode $moveCode
        if ($success) {
            $deployed++
        } else {
            $failed++
        }
    }
    
    Write-Step "Deployment Summary"
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
    Write-Success "Deployed: $deployed"
    Write-Error "Failed: $failed"
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
    
    if ($failed -eq 0) {
        Write-Success "All contracts deployed successfully!"
        return $true
    } else {
        Write-Error "Some contracts failed to deploy"
        return $false
    }
}

# Run deployment
$result = Invoke-Deployment
exit $(if ($result) { 0 } else { 1 })
