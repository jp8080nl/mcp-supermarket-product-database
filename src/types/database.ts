// Database types based on the PRD schema

export interface Supermarket {
  id: string; // UUID
  name: string;
  logo_url?: string | null;
  website_url?: string | null;
  created_at: Date;
}

export interface SupermarketBranch {
  id: string; // UUID
  supermarket_id: string;
  branch_name?: string | null;
  address_line1?: string | null;
  postal_code?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  branch_external_id?: string | null;
  created_at: Date;
}

export interface Product {
  id: string; // UUID
  supermarket_id: string;
  store_product_id: string;
  product_name: string;
  brand?: string | null;
  categories?: Record<string, unknown> | null; // JSONB
  package_description?: string | null;
  package_quantity?: number | null;
  package_unit?: string | null;
  barcode_ean?: string | null;
  image_url?: string | null;
  expiration_category?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface PriceHistory {
  id: string; // UUID
  product_id: string;
  price_datetime: Date;
  current_price_cents: number;
  unit_price_amount_cents?: number | null;
  unit_price_unit_description?: string | null;
  is_on_promotion: boolean;
  promotion_description?: string | null;
  promotion_original_price_cents?: number | null;
  created_at: Date;
}
