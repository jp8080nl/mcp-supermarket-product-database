# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) server for a supermarket price comparison system targeting Dutch supermarkets (Albert Heijn and Jumbo). The system collects, stores, and provides access to product and pricing data, tracking price developments over time.

The broader project architecture (from PRD) includes:
- Python scrapers for data collection from supermarket APIs
- n8n for automation/orchestration
- Supabase/PostgreSQL for primary data storage
- Vue.js frontend for user interface
- This MCP server acts as an interface layer for data access and management

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
- **SQLite3** - Local database (likely for caching/local operations while Supabase is the main data store)
- **Zod** - Schema validation for API inputs/outputs
- **TypeScript** - Type-safe development with ES modules
- **Docker** - For containerization (following the overall system architecture approach)

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

This MCP server should provide tools for:
- Querying product information across supermarkets
- Searching products by name, brand, or barcode
- Retrieving current and historical prices
- Comparing prices between supermarkets
- Managing local SQLite cache of frequently accessed data
- Potentially triggering data refresh operations

### Security Considerations

- The MCP server should only have read access to the main database
- No direct modification of product/price data through MCP tools
- Data modifications are handled by the Python scrapers with appropriate credentials

## Development Notes

- The project uses ES modules (`"type": "module"` in package.json)
- TypeScript configuration targets ES2022 with module resolution
- Main entry point: `src/index.ts`
- Built files output to `dist/` directory
- Release 1 assumes national pricing (no per-branch price variations)