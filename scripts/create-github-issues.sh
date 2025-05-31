#!/bin/bash

# Script to create GitHub issues for MCP Server Development
# Make sure you're authenticated with: gh auth login

echo "Creating GitHub issues for MCP Server Development..."

# Create labels first
echo "Creating labels..."
gh label create "mcp-server" --description "MCP server specific tasks" --color "0366d6" || true
gh label create "infrastructure" --description "Setup and configuration" --color "c5def5" || true
gh label create "feature" --description "New functionality" --color "a2eeef" || true
gh label create "documentation" --description "Documentation tasks" --color "0075ca" || true
gh label create "testing" --description "Testing related" --color "d876e3" || true
gh label create "priority:high" --description "High priority" --color "d73a4a" || true
gh label create "priority:medium" --description "Medium priority" --color "fbca04" || true
gh label create "priority:low" --description "Low priority" --color "0e8a16" || true

# Setup & Infrastructure Issues
echo "Creating Setup & Infrastructure issues..."
gh issue create --title "Set up Docker configuration for MCP server" \
  --body "Configure Docker for the MCP server component to ensure consistent development and deployment environments." \
  --label "infrastructure,mcp-server,priority:high"

gh issue create --title "Initialize TypeScript project structure" \
  --body "Set up the TypeScript project with proper configuration, including tsconfig.json, ESLint, and module structure." \
  --label "infrastructure,mcp-server,priority:high"

gh issue create --title "Configure SQLite database schema" \
  --body "Create SQLite schema for local caching of product and price data. Should mirror the main Supabase schema." \
  --label "infrastructure,mcp-server,priority:high"

gh issue create --title "Set up connection to Supabase (read-only access)" \
  --body "Configure secure read-only connection to Supabase PostgreSQL database. Ensure proper credential management." \
  --label "infrastructure,mcp-server,priority:high"

# Core MCP Tools Development
echo "Creating Core MCP Tools issues..."
gh issue create --title "Implement product search tool" \
  --body "Create MCP tool for searching products by name and brand. Should support partial matching and return relevant product details." \
  --label "feature,mcp-server,priority:high"

gh issue create --title "Implement barcode lookup tool" \
  --body "Create MCP tool for looking up products by EAN barcode. Should return product information from all supermarkets." \
  --label "feature,mcp-server,priority:medium"

gh issue create --title "Implement price comparison tool" \
  --body "Create MCP tool to compare prices of the same/similar products between Albert Heijn and Jumbo." \
  --label "feature,mcp-server,priority:high"

gh issue create --title "Implement current price retrieval tool" \
  --body "Create MCP tool to get the current price of a specific product, including promotion information." \
  --label "feature,mcp-server,priority:high"

gh issue create --title "Implement price history retrieval tool" \
  --body "Create MCP tool to retrieve historical price data for a product, enabling price trend analysis." \
  --label "feature,mcp-server,priority:medium"

gh issue create --title "Implement supermarket branch lookup tool" \
  --body "Create MCP tool to find supermarket branches by location, postal code, or city. Focus on Noord-Holland region." \
  --label "feature,mcp-server,priority:low"

# Data Synchronization
echo "Creating Data Synchronization issues..."
gh issue create --title "Design SQLite caching strategy" \
  --body "Design an efficient caching strategy for SQLite to minimize Supabase queries while ensuring data freshness." \
  --label "feature,mcp-server,priority:high"

gh issue create --title "Implement Supabase to SQLite sync mechanism" \
  --body "Create a mechanism to sync data from Supabase to local SQLite cache. Consider incremental updates." \
  --label "feature,mcp-server,priority:high"

gh issue create --title "Add cache invalidation logic" \
  --body "Implement logic to invalidate stale cache entries and trigger re-sync when needed." \
  --label "feature,mcp-server,priority:medium"

gh issue create --title "Create background sync scheduler" \
  --body "Implement a scheduler to periodically sync data from Supabase to keep the local cache updated." \
  --label "feature,mcp-server,priority:medium"

# API & Validation
echo "Creating API & Validation issues..."
gh issue create --title "Define Zod schemas for all data models" \
  --body "Create comprehensive Zod schemas for products, prices, supermarkets, and branches matching the database schema." \
  --label "feature,mcp-server,priority:high"

gh issue create --title "Implement input validation for all tools" \
  --body "Add robust input validation using Zod for all MCP tool parameters to ensure data integrity." \
  --label "feature,mcp-server,priority:high"

gh issue create --title "Add error handling and user-friendly error messages" \
  --body "Implement comprehensive error handling with clear, actionable error messages for users." \
  --label "feature,mcp-server,priority:medium"

gh issue create --title "Create TypeScript types from Zod schemas" \
  --body "Generate TypeScript types from Zod schemas to ensure type safety throughout the codebase." \
  --label "feature,mcp-server,priority:medium"

# Testing & Documentation
echo "Creating Testing & Documentation issues..."
gh issue create --title "Write unit tests for all MCP tools" \
  --body "Create comprehensive unit tests for each MCP tool using Jest or similar testing framework." \
  --label "testing,mcp-server,priority:high"

gh issue create --title "Add integration tests with mock data" \
  --body "Create integration tests that test the full flow from MCP tool invocation to response." \
  --label "testing,mcp-server,priority:medium"

gh issue create --title "Create README with usage examples" \
  --body "Write a comprehensive README with installation instructions, configuration, and usage examples for each tool." \
  --label "documentation,mcp-server,priority:high"

gh issue create --title "Document all available MCP tools and their parameters" \
  --body "Create detailed documentation for each MCP tool, including parameters, return values, and example usage." \
  --label "documentation,mcp-server,priority:high"

# Deployment & Operations
echo "Creating Deployment & Operations issues..."
gh issue create --title "Create Dockerfile for MCP server" \
  --body "Create an optimized Dockerfile for the MCP server with multi-stage build for smaller image size." \
  --label "infrastructure,mcp-server,priority:high"

gh issue create --title "Add docker-compose configuration" \
  --body "Create docker-compose.yml for easy local development and testing with all required services." \
  --label "infrastructure,mcp-server,priority:medium"

gh issue create --title "Set up logging and monitoring" \
  --body "Implement structured logging and basic monitoring for the MCP server operations." \
  --label "infrastructure,mcp-server,priority:medium"

gh issue create --title "Create deployment documentation" \
  --body "Document the deployment process, including environment variables, secrets management, and operational considerations." \
  --label "documentation,infrastructure,mcp-server,priority:medium"

# Integration Points
echo "Creating Integration Points issues..."
gh issue create --title "Test integration with Supabase read endpoints" \
  --body "Thoroughly test all Supabase integration points, ensuring proper error handling and connection management." \
  --label "testing,mcp-server,priority:high"

gh issue create --title "Ensure compatibility with MCP client applications" \
  --body "Test the MCP server with various MCP clients to ensure compatibility and proper tool discovery." \
  --label "testing,mcp-server,priority:high"

gh issue create --title "Validate data consistency between SQLite cache and Supabase" \
  --body "Create validation checks to ensure data consistency between the local cache and the main database." \
  --label "testing,mcp-server,priority:medium"

echo "Done! All issues have been created."
echo "Visit https://github.com/jp8080nl/mcp-supermarket-product-database/issues to see them."