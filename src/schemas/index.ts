import { z } from 'zod';

// Supermarkets table schema
export const supermarketSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  logo_url: z.string().url().nullable().optional(),
  website_url: z.string().url().nullable().optional(),
  created_at: z.string().datetime({ offset: true }).optional(),
});

export type Supermarket = z.infer<typeof supermarketSchema>;

// Supermarket branches table schema
export const supermarketBranchSchema = z.object({
  id: z.string().uuid(),
  supermarket_id: z.string().uuid(),
  branch_name: z.string().nullable().optional(),
  address_line1: z.string().nullable().optional(),
  postal_code: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  branch_external_id: z.string().nullable().optional(),
  created_at: z.string().datetime({ offset: true }).optional(),
});

export type SupermarketBranch = z.infer<typeof supermarketBranchSchema>;

// Products table schema
export const productSchema = z.object({
  id: z.string().uuid(),
  supermarket_id: z.string().uuid(),
  store_product_id: z.string().min(1),
  product_name: z.string().min(1),
  brand: z.string().nullable().optional(),
  categories: z.array(z.string()).nullable().optional(),
  package_description: z.string().nullable().optional(),
  package_quantity: z.number().positive().nullable().optional(),
  package_unit: z.string().nullable().optional(),
  barcode_ean: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  expiration_category: z.string().nullable().optional(), // NULL for Release 1
  created_at: z.string().datetime({ offset: true }).optional(),
  updated_at: z.string().datetime({ offset: true }).optional(),
});

export type Product = z.infer<typeof productSchema>;

// Price history table schema
export const priceHistorySchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid(),
  price_datetime: z.string().datetime({ offset: true }),
  current_price_cents: z.number().int().nonnegative(),
  unit_price_amount_cents: z.number().int().nonnegative().nullable().optional(),
  unit_price_unit_description: z.string().nullable().optional(),
  is_on_promotion: z.boolean().default(false),
  promotion_description: z.string().nullable().optional(),
  promotion_original_price_cents: z.number().int().nonnegative().nullable().optional(),
  created_at: z.string().datetime({ offset: true }).optional(),
});

export type PriceHistory = z.infer<typeof priceHistorySchema>;

// API input schemas for MCP tools
export const productSearchInputSchema = z.object({
  query: z.string().min(1).describe('Search query for product name, brand, or description'),
  supermarket_id: z.string().uuid().optional().describe('Filter by specific supermarket'),
  limit: z.number().int().positive().max(100).default(20).describe('Maximum number of results'),
  offset: z.number().int().nonnegative().default(0).describe('Offset for pagination'),
});

export type ProductSearchInput = z.infer<typeof productSearchInputSchema>;

export const barcodeSearchInputSchema = z.object({
  barcode: z.string().min(1).describe('EAN barcode to search for'),
  supermarket_id: z.string().uuid().optional().describe('Filter by specific supermarket'),
});

export type BarcodeSearchInput = z.infer<typeof barcodeSearchInputSchema>;

export const priceComparisonInputSchema = z.object({
  product_name: z.string().min(1).describe('Product name to compare prices for'),
  brand: z.string().optional().describe('Optional brand filter'),
  include_promotions: z.boolean().default(true).describe('Include promotional prices'),
});

export type PriceComparisonInput = z.infer<typeof priceComparisonInputSchema>;

export const currentPriceInputSchema = z.object({
  product_id: z.string().uuid().describe('Product ID to get current price for'),
});

export type CurrentPriceInput = z.infer<typeof currentPriceInputSchema>;

export const priceHistoryInputSchema = z.object({
  product_id: z.string().uuid().describe('Product ID to get price history for'),
  start_date: z
    .string()
    .datetime({ offset: true })
    .optional()
    .describe('Start date for price history'),
  end_date: z.string().datetime({ offset: true }).optional().describe('End date for price history'),
  limit: z
    .number()
    .int()
    .positive()
    .max(1000)
    .default(100)
    .describe('Maximum number of price points'),
});

export type PriceHistoryInput = z.infer<typeof priceHistoryInputSchema>;

export const supermarketListInputSchema = z.object({
  include_branches: z.boolean().default(false).describe('Include branch information'),
});

export type SupermarketListInput = z.infer<typeof supermarketListInputSchema>;

// Response schemas
export const productWithPriceSchema = productSchema.extend({
  current_price: priceHistorySchema.optional(),
  supermarket: supermarketSchema.optional(),
});

export type ProductWithPrice = z.infer<typeof productWithPriceSchema>;

export const priceComparisonResultSchema = z.object({
  product_name: z.string(),
  brand: z.string().nullable().optional(),
  comparisons: z.array(
    z.object({
      supermarket: supermarketSchema,
      product: productSchema,
      current_price: priceHistorySchema.optional(),
      price_per_unit: z
        .object({
          amount_cents: z.number().int().nonnegative(),
          unit: z.string(),
        })
        .nullable()
        .optional(),
    })
  ),
  cheapest_option: z
    .object({
      supermarket_name: z.string(),
      price_cents: z.number().int().nonnegative(),
      savings_percentage: z.number().min(0).max(100),
    })
    .optional(),
});

export type PriceComparisonResult = z.infer<typeof priceComparisonResultSchema>;
