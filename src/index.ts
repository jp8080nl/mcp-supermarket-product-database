#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
// import { config } from './config/index.js';
import { registerTools } from './tools/index.js';

async function main() {
  console.error('Starting MCP Supermarket Product Database Server...');

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

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('MCP server started successfully');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
