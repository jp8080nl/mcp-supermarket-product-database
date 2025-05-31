# MCP Supermarket Product Database

An MCP (Model Context Protocol) server for managing and querying supermarket product and pricing data from Dutch supermarkets (Albert Heijn and Jumbo).

## Overview

This MCP server provides tools for:
- Searching products by name, brand, or barcode
- Comparing prices between supermarkets
- Retrieving current and historical pricing data
- Finding supermarket locations

The server connects directly to a Supabase/PostgreSQL database for real-time data access. It's designed to run on a cloud server, with MCP clients connecting remotely.

## Prerequisites

- Node.js 20+ (for local development)
- Docker & Docker Compose (for containerized development)
- Supabase account with configured database (optional for initial development)

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/jp8080nl/mcp-supermarket-product-database.git
cd mcp-supermarket-product-database
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials (when available).

## Development

### Local Development

```bash
# Run in development mode with hot reload
npm run dev

# Build TypeScript
npm run build

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Format code
npm run format
```

### Docker Development

```bash
# Build and run with Docker Compose
docker compose up mcp-server

# Run in detached mode
docker compose up -d mcp-server

# View logs
docker compose logs -f mcp-server

# Stop services
docker compose down
```

### Development Shell

Access a development shell in the container:

```bash
docker compose run --rm mcp-dev
```

## Project Structure

```
src/
├── index.ts          # Main entry point
├── config/           # Configuration management
├── db/               # Database connections and queries
├── schemas/          # Zod validation schemas
├── tools/            # MCP tool implementations
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Available MCP Tools

(To be implemented)

- `searchProducts` - Search for products by name or brand
- `lookupBarcode` - Find product by EAN barcode
- `comparePrice` - Compare prices between supermarkets
- `getCurrentPrice` - Get current price for a product
- `getPriceHistory` - Retrieve historical pricing data
- `findBranches` - Find supermarket locations

## Database Schema

The system works with four main tables:

- `supermarkets` - Supermarket chains
- `supermarket_branches` - Physical store locations
- `products` - Product catalog per supermarket
- `price_history` - Historical price tracking

See [docs/PRD.md](docs/PRD.md) for detailed schema information.

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT