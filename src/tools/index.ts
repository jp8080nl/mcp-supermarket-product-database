import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { productSearchTool, searchProducts } from './productSearch.js';
import { withErrorHandling } from '../utils/errors.js';

const tools = [
  productSearchTool,
  // Additional tools will be added here
];

export function registerTools(server: Server) {
  // Register available tools
  server.setRequestHandler(ListToolsRequestSchema, () => ({
    tools,
  }));

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'search_products': {
        const handler = withErrorHandling(searchProducts, 'Product search');
        const results = await handler(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  });

  console.error('Tools registration completed');
}
