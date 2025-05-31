#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { getDatabase, closeDatabase } from './db/client.js';
import { registerTools } from './tools/index.js';

async function main() {
  console.error('Starting MCP Supermarket Product Database Server...');

  // Initialize database connection
  const db = getDatabase();
  const isConnected = await db.testConnection();

  if (!isConnected) {
    console.error('Warning: Database connection failed. Some features may be unavailable.');
  }

  const server = new Server(
    {
      name: 'mcp-supermarket-product-database',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register all tools
  registerTools(server);

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.error('Shutting down gracefully...');
    closeDatabase();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.error('Shutting down gracefully...');
    closeDatabase();
    process.exit(0);
  });

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('MCP server started successfully');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
