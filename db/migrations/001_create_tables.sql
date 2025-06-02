-- Migration: Create initial database schema
-- Description: Creates the four main tables for the supermarket price comparison system

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create supermarkets table (chains)
CREATE TABLE IF NOT EXISTS supermarkets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    website_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create supermarket_branches table (locations)
CREATE TABLE IF NOT EXISTS supermarket_branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supermarket_id UUID NOT NULL REFERENCES supermarkets(id) ON DELETE CASCADE,
    branch_name TEXT,
    address_line1 TEXT,
    postal_code TEXT,
    city TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    branch_external_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on supermarket_id for faster lookups
CREATE INDEX idx_branches_supermarket_id ON supermarket_branches(supermarket_id);

-- 3. Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supermarket_id UUID NOT NULL REFERENCES supermarkets(id) ON DELETE CASCADE,
    store_product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    brand TEXT,
    categories JSONB,
    package_description TEXT,
    package_quantity NUMERIC,
    package_unit TEXT,
    barcode_ean TEXT,
    image_url TEXT,
    expiration_category TEXT, -- NULL for Release 1
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(supermarket_id, store_product_id)
);

-- Create indexes for products table
CREATE INDEX idx_products_supermarket_id ON products(supermarket_id);
CREATE INDEX idx_products_name ON products(product_name);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_barcode ON products(barcode_ean);

-- 4. Create price_history table
CREATE TABLE IF NOT EXISTS price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    price_datetime TIMESTAMPTZ NOT NULL,
    current_price_cents INTEGER NOT NULL CHECK (current_price_cents >= 0),
    unit_price_amount_cents INTEGER CHECK (unit_price_amount_cents >= 0),
    unit_price_unit_description TEXT,
    is_on_promotion BOOLEAN NOT NULL DEFAULT FALSE,
    promotion_description TEXT,
    promotion_original_price_cents INTEGER CHECK (promotion_original_price_cents >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for price history queries
CREATE INDEX idx_price_history_product_datetime ON price_history (product_id, price_datetime DESC);

-- Add update trigger for products.updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments to tables for documentation
COMMENT ON TABLE supermarkets IS 'Supermarket chains (e.g., Albert Heijn, Jumbo)';
COMMENT ON TABLE supermarket_branches IS 'Physical store locations for each supermarket chain';
COMMENT ON TABLE products IS 'Product catalog per supermarket with unique store product IDs';
COMMENT ON TABLE price_history IS 'Historical price tracking for products with promotion information';