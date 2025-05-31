// Supabase database types generated from schema
// This matches the schema defined in the PRD

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      supermarkets: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          website_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          website_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          website_url?: string | null;
          created_at?: string;
        };
      };
      supermarket_branches: {
        Row: {
          id: string;
          supermarket_id: string;
          branch_name: string | null;
          address_line1: string | null;
          postal_code: string | null;
          city: string | null;
          latitude: number | null;
          longitude: number | null;
          branch_external_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          supermarket_id: string;
          branch_name?: string | null;
          address_line1?: string | null;
          postal_code?: string | null;
          city?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          branch_external_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          supermarket_id?: string;
          branch_name?: string | null;
          address_line1?: string | null;
          postal_code?: string | null;
          city?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          branch_external_id?: string | null;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          supermarket_id: string;
          store_product_id: string;
          product_name: string;
          brand: string | null;
          categories: Json | null;
          package_description: string | null;
          package_quantity: number | null;
          package_unit: string | null;
          barcode_ean: string | null;
          image_url: string | null;
          expiration_category: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supermarket_id: string;
          store_product_id: string;
          product_name: string;
          brand?: string | null;
          categories?: Json | null;
          package_description?: string | null;
          package_quantity?: number | null;
          package_unit?: string | null;
          barcode_ean?: string | null;
          image_url?: string | null;
          expiration_category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          supermarket_id?: string;
          store_product_id?: string;
          product_name?: string;
          brand?: string | null;
          categories?: Json | null;
          package_description?: string | null;
          package_quantity?: number | null;
          package_unit?: string | null;
          barcode_ean?: string | null;
          image_url?: string | null;
          expiration_category?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      price_history: {
        Row: {
          id: string;
          product_id: string;
          price_datetime: string;
          current_price_cents: number;
          unit_price_amount_cents: number | null;
          unit_price_unit_description: string | null;
          is_on_promotion: boolean;
          promotion_description: string | null;
          promotion_original_price_cents: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          price_datetime: string;
          current_price_cents: number;
          unit_price_amount_cents?: number | null;
          unit_price_unit_description?: string | null;
          is_on_promotion?: boolean;
          promotion_description?: string | null;
          promotion_original_price_cents?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          price_datetime?: string;
          current_price_cents?: number;
          unit_price_amount_cents?: number | null;
          unit_price_unit_description?: string | null;
          is_on_promotion?: boolean;
          promotion_description?: string | null;
          promotion_original_price_cents?: number | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
