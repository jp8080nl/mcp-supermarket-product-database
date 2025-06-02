import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { getDatabase } from '../db/client.js';
import { productSearchInputSchema, productWithPriceSchema } from '../schemas/index.js';
import type { ProductWithPrice, PriceHistory } from '../schemas/index.js';

export const productSearchTool: Tool = {
  name: 'search_products',
  description: 'Search for products by name, brand, or description across supermarkets',
  inputSchema: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query for product name, brand, or description',
      },
      supermarket_id: {
        type: 'string',
        description: 'Filter by specific supermarket (optional)',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results (default: 20, max: 100)',
        default: 20,
      },
      offset: {
        type: 'number',
        description: 'Offset for pagination (default: 0)',
        default: 0,
      },
    },
    required: ['query'],
  },
};

export async function searchProducts(input: unknown): Promise<ProductWithPrice[]> {
  // Validate input
  const validatedInput = productSearchInputSchema.parse(input);

  // Get database client
  const db = getDatabase();
  const supabase = db.getClient();

  // Handle missing database connection
  if (!supabase) {
    throw new Error(
      'Database connection not available. Please ensure Supabase credentials are configured.'
    );
  }

  try {
    // Build the query
    let query = supabase
      .from('products')
      .select(
        `
        *,
        supermarket:supermarkets!inner(id, name, logo_url, website_url),
        current_price:price_history(
          id,
          product_id,
          price_datetime,
          current_price_cents,
          unit_price_amount_cents,
          unit_price_unit_description,
          is_on_promotion,
          promotion_description,
          promotion_original_price_cents
        )
      `
      )
      .or(`product_name.ilike.%${validatedInput.query}%,brand.ilike.%${validatedInput.query}%`)
      .order('product_name', { ascending: true })
      .limit(validatedInput.limit)
      .range(validatedInput.offset, validatedInput.offset + validatedInput.limit - 1);

    // Add supermarket filter if provided
    if (validatedInput.supermarket_id) {
      query = query.eq('supermarket_id', validatedInput.supermarket_id);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to search products: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Process the results to get the most recent price for each product
    const productsWithPrice: ProductWithPrice[] = data.map((product: any) => {
      // Get the most recent price from price_history
      const priceHistory = product.current_price as PriceHistory[] | undefined;
      const currentPrice =
        priceHistory && priceHistory.length > 0
          ? priceHistory.sort(
              (a, b) => new Date(b.price_datetime).getTime() - new Date(a.price_datetime).getTime()
            )[0]
          : undefined;

      return {
        ...product,
        current_price: currentPrice,
        supermarket: product.supermarket,
      } as ProductWithPrice;
    });

    // Validate output
    return productsWithPrice.map((p) => productWithPriceSchema.parse(p));
  } catch (error) {
    // Enhance error messages for common issues
    if (error instanceof Error) {
      if (error.message.includes('Failed to search products:')) {
        throw error;
      }
      throw new Error(`Product search failed: ${error.message}`);
    }
    throw new Error('An unexpected error occurred during product search');
  }
}
