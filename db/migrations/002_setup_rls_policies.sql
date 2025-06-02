-- Migration: Set up Row Level Security (RLS) policies
-- Description: Enable RLS and create read-only policies for anonymous users

-- Enable Row Level Security on all tables
ALTER TABLE supermarkets ENABLE ROW LEVEL SECURITY;
ALTER TABLE supermarket_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- Create read-only policies for anonymous role
-- These policies allow SELECT access for the anon role (used by frontend)

-- Policy for supermarkets table
CREATE POLICY "Allow anonymous read access to supermarkets" ON supermarkets
    FOR SELECT
    TO anon
    USING (true);

-- Policy for supermarket_branches table
CREATE POLICY "Allow anonymous read access to supermarket_branches" ON supermarket_branches
    FOR SELECT
    TO anon
    USING (true);

-- Policy for products table
CREATE POLICY "Allow anonymous read access to products" ON products
    FOR SELECT
    TO anon
    USING (true);

-- Policy for price_history table
CREATE POLICY "Allow anonymous read access to price_history" ON price_history
    FOR SELECT
    TO anon
    USING (true);

-- Note: No INSERT, UPDATE, or DELETE policies are created for the anon role
-- Data modifications are only allowed via the service role (used by scrapers)