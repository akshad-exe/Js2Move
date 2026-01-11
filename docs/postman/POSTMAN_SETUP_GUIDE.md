# JS2Move API - Postman Collection Setup Guide

## Overview

Complete API testing suite for JS2Move backend with pre-configured environments and automated test scripts.

## Files Included

1. **POSTMAN_COLLECTION.json** - Complete collection with 15 endpoints across 5 categories
2. **POSTMAN_ENV_LOCAL.json** - Local development environment (localhost:8000)
3. **POSTMAN_ENV_STAGING.json** - Staging environment configuration
4. **POSTMAN_ENV_PRODUCTION.json** - Production environment configuration

## Quick Start

### 1. Import Collection

1. Open Postman
2. Click **Import** (top-left)
3. Select **POSTMAN_COLLECTION.json**
4. Click **Import**

### 2. Import Environment

Choose one of the environment files based on your target:

1. Click **Environments** (left sidebar)
2. Click **Import** (top-right)
3. Select one of the environment files:
   - `POSTMAN_ENV_LOCAL.json` - For localhost testing
   - `POSTMAN_ENV_STAGING.json` - For staging environment
   - `POSTMAN_ENV_PRODUCTION.json` - For production

### 3. Select Active Environment

1. Click the environment dropdown (top-right, near "No Environment")
2. Select your desired environment (Local, Staging, or Production)

### 4. Start Testing

All endpoints are organized in folders:
- **Compiler** - Code compilation, validation, and analysis
- **Gas** - Gas estimation and pricing
- **Deployment** - Smart contract deployment and status
- **Blockchain** - Network and transaction queries
- **Examples** - Get available Move.js examples

## API Endpoints Summary

### Compiler (3 endpoints)
- `POST /api/v1/compiler/compile` - Compile Move.js to Move
- `POST /api/v1/compiler/validate` - Validate Move.js syntax
- `POST /api/v1/compiler/analyze` - Analyze Move.js code

### Gas (2 endpoints)
- `POST /api/v1/gas/estimate` - Estimate gas for deployment
- `GET /api/v1/gas/price` - Get current gas price in APT

### Deployment (4 endpoints)
- `POST /api/v1/deploy/contract` - Deploy smart contract to blockchain
- `GET /api/v1/deploy/list` - List all deployments
- `GET /api/v1/deploy/:deploymentId` - Get deployment details
- `GET /api/v1/deploy/:deploymentId/status` - Get deployment status

### Blockchain (3 endpoints)
- `GET /api/v1/network/status` - Get network status
- `GET /api/v1/transaction/:txHash` - Get transaction details
- `GET /api/v1/account/:address` - Get account information

### Examples (3 endpoints)
- `GET /api/v1/examples` - Get all available examples
- `GET /api/v1/examples/search?q=token` - Search examples
- `GET /api/v1/examples/:exampleId` - Get single example

## Environment Variables

### Automatic Variables (Auto-populated by tests)
- `deployment_id` - Last created deployment ID
- `last_tx_hash` - Last transaction hash
- `account_address` - Current account address
- `transaction_hash` - Current transaction hash

### Manual Variables
- `base_url` - API server URL (http://localhost:8000)
- `api_version` - API version (v1)
- `example_id` - Example identifier (default: counter)

## Test Scripts

Each endpoint includes automated test scripts that:
1. Check HTTP status codes
2. Validate response structure
3. Capture important values for use in subsequent requests
4. Log results

To run tests:
1. Select any request from the collection
2. Click **Send**
3. View results in the **Tests** tab

To run all tests at once:
1. Right-click on the collection folder
2. Select **Run collection**
3. View results in the Collection Runner

## Example Workflow

### 1. Compile Code
```
POST /api/v1/compiler/compile
Body: { "code": "public fun hello(): string { return \"Hello, Move!\"; }" }
```
Response captures compiled output.

### 2. Estimate Gas
```
POST /api/v1/gas/estimate
Body: { "compiledCode": "{{compiled_output}}" }
```
Response auto-populates `gas_estimate` variable.

### 3. Deploy Contract
```
POST /api/v1/deploy/contract
Body: { "code": "...", "gasLimit": "{{gas_estimate}}" }
```
Response captures `deployment_id`.

### 4. Check Status
```
GET /api/v1/deploy/{{deployment_id}}/status
```
Monitors deployment progress.

## Environment Switching

To switch environments:
1. Click environment dropdown (top-right)
2. Select desired environment
3. All requests automatically use the new base URL

### Updating Base URLs
If deploying to custom servers:
1. Click **Environments** (left sidebar)
2. Edit the environment
3. Update `base_url` value
4. Click **Save**

## Troubleshooting

### Request Returns 404
- Verify correct environment is selected
- Check `base_url` is accessible (e.g., `http://localhost:8000`)
- Ensure backend server is running

### Authentication Errors
- Current setup uses no authentication
- If backend requires auth, add headers to the collection:
  1. Click collection name
  2. Go to **Authorization** tab
  3. Select auth type and configure

### Variable Not Found
- Ensure previous requests have been executed
- Check **Tests** tab to see if capture scripts executed
- View environment variables: Click **Environments** → Select environment → View values

## Advanced Usage

### Creating New Requests
1. Click the **+** tab
2. Select request method (GET, POST, etc.)
3. Enter URL: `{{base_url}}/api/{{api_version}}/endpoint`
4. Add body, headers as needed
5. Click **Tests** to add validation scripts

### Adding Pre-request Scripts
For custom logic before requests:
1. Open request
2. Click **Pre-request Script** tab
3. Add JavaScript code
4. Example: Generate timestamps, hash values, etc.

### Using Collections in CI/CD
Export collection and use Newman CLI:
```bash
npm install -g newman
newman run POSTMAN_COLLECTION.json -e POSTMAN_ENV_LOCAL.json
```

## Support

For issues with endpoints or collection setup:
1. Check backend logs: `pnpm dev -w packages/backend`
2. Verify environment variables are correct
3. Review request body format against examples
4. Check test results for specific error messages

## Next Steps

1. ✅ Import collection and environments
2. ✅ Select Local environment
3. ✅ Test Compiler endpoints (GET /examples first)
4. ✅ Test Gas endpoints
5. ✅ Test Deployment endpoints
6. ✅ Explore Blockchain endpoints

Happy testing! 🚀
