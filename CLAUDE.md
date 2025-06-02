# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) server for a supermarket price comparison system targeting Dutch supermarkets (Albert Heijn and Jumbo). The system collects, stores, and provides access to product and pricing data, tracking price developments over time.

**IMPORTANT: Server-Side Architecture Decision (Updated)**
- This MCP server runs on a cloud server, NOT on user's local machines
- Direct connection to Supabase (no local SQLite caching needed)
- Users connect to the MCP server via MCP client configuration
- Server-to-server communication with Supabase for optimal performance

The broader project architecture (from PRD) includes:
- Python scrapers for data collection from supermarket APIs
- n8n for automation/orchestration
- Supabase/PostgreSQL for primary data storage
- Vue.js frontend for user interface
- This MCP server acts as a cloud-hosted interface layer for data access

## Key Commands

### Development
- `npm run dev` - Run the TypeScript server in development mode with watch/hot reload
- `npm run build` - Build the TypeScript code to JavaScript
- `npm start` - Run the built JavaScript server
- `npm install` - Install all dependencies

## Architecture

### Overall System Technology Stack (from PRD)
The complete supermarket price comparison system uses:
- **Backend Data Collection:** Python (with libraries like `requests`, `SupermarktConnector`, `AppiePy`)
- **Automation/Orchestration:** n8n
- **Database:** Supabase (PostgreSQL)
- **Frontend Framework:** Vue.js
- **Frontend API Communication:** `supabase-js` library
- **Containerization:** Docker
- **Version Control:** GitHub with GitHub Projects

### This MCP Server Technology Stack
This specific repository implements the MCP server component using:
- **MCP SDK** (`@modelcontextprotocol/sdk`) - For building the MCP server
- **Supabase Client** - Direct connection to Supabase (no SQLite needed)
- **Zod** - Schema validation for API inputs/outputs
- **TypeScript** - Type-safe development with ES modules
- **Docker** - For containerization and cloud deployment

### Database Schema (from PRD)

The system uses four main tables with the following structure:

**`supermarkets`** - Supermarket chains
- `id` (UUID, PK)
- `name` (TEXT, NOT NULL, UNIQUE)
- `logo_url` (TEXT)
- `website_url` (TEXT)
- `created_at` (TIMESTAMPTZ)

**`supermarket_branches`** - Physical store locations
- `id` (UUID, PK)
- `supermarket_id` (UUID, FK to supermarkets.id)
- `branch_name` (TEXT)
- `address_line1` (TEXT)
- `postal_code` (TEXT)
- `city` (TEXT)
- `latitude` (NUMERIC)
- `longitude` (NUMERIC)
- `branch_external_id` (TEXT)
- `created_at` (TIMESTAMPTZ)

**`products`** - Product catalog per supermarket
- `id` (UUID, PK)
- `supermarket_id` (UUID, FK to supermarkets.id)
- `store_product_id` (TEXT, NOT NULL)
- `product_name` (TEXT, NOT NULL)
- `brand` (TEXT)
- `categories` (JSONB)
- `package_description` (TEXT)
- `package_quantity` (NUMERIC)
- `package_unit` (TEXT)
- `barcode_ean` (TEXT)
- `image_url` (TEXT)
- `expiration_category` (TEXT) - NULL for Release 1
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)
- UNIQUE constraint on (supermarket_id, store_product_id)

**`price_history`** - Historical price tracking
- `id` (UUID, PK)
- `product_id` (UUID, FK to products.id ON DELETE CASCADE)
- `price_datetime` (TIMESTAMPTZ, NOT NULL)
- `current_price_cents` (INTEGER, NOT NULL)
- `unit_price_amount_cents` (INTEGER)
- `unit_price_unit_description` (TEXT)
- `is_on_promotion` (BOOLEAN, DEFAULT FALSE)
- `promotion_description` (TEXT)
- `promotion_original_price_cents` (INTEGER)
- `created_at` (TIMESTAMPTZ)
- Index on (product_id, price_datetime DESC)

### MCP Server Responsibilities

This MCP server provides tools for:
- Querying product information across supermarkets
- Searching products by name, brand, or barcode
- Retrieving current and historical prices
- Comparing prices between supermarkets
- Direct queries to Supabase for real-time data
- Serving multiple concurrent MCP client connections

### Security Considerations

- The MCP server uses Supabase anon key (read-only access)
- No direct modification of product/price data through MCP tools
- Data modifications are handled by the Python scrapers with service role key
- Server-side deployment keeps credentials secure
- Consider implementing rate limiting per client connection

## Development Notes

- The project uses ES modules (`"type": "module"` in package.json)
- TypeScript configuration targets ES2022 with module resolution
- Main entry point: `src/index.ts`
- Built files output to `dist/` directory
- Release 1 assumes national pricing (no per-branch price variations)

## Project Management & Git Best Practices

### Task Management
- We use **GitHub Issues** to track all tasks, features, and bugs
- Issues are labeled by component (e.g., `mcp-server`), type (e.g., `feature`, `bug`), and priority
- Check closed issues to understand completed work
- Check open issues to see pending features and known issues

### Git Workflow
- **Always create feature branches** for new work (e.g., `feature/add-product-search`)
- **Never commit directly to main** - use Pull Requests for all changes
- **Write clear, descriptive commit messages** following conventional commits format
- **Keep commits atomic** - one logical change per commit
- **Run tests before committing** - ensure `npm run build` succeeds
- **Use GitHub Pull Requests** for code review and merging
- **Link PRs to Issues** using keywords like "Fixes #123" or "Closes #123"
- **Squash and merge** PRs to keep main branch history clean

### Pull Request Guidelines
1. Create PR with descriptive title and summary
2. Reference related GitHub issue(s)
3. Ensure all checks pass (builds, tests)
4. Request review from team members
5. Address review feedback
6. Merge only after approval

## Deployment Architecture

- **Server-side deployment** - MCP server runs on cloud infrastructure
- **No local installation** - Users configure MCP clients to connect to server endpoint
- **Scalable** - Can serve multiple concurrent users
- **Direct Supabase access** - No need for local caching layer
- **Docker-based** - Containerized for easy deployment and scaling