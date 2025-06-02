import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';
import type { Database as DatabaseTypes } from '../types/supabase.js';

export class Database {
  private supabase: SupabaseClient<DatabaseTypes> | null = null;

  constructor() {
    this.initializeSupabase();
  }

  private initializeSupabase(): void {
    const { url, anonKey } = config.supabase;

    if (!url || !anonKey) {
      console.error('Warning: Supabase credentials not configured');
      return;
    }

    this.supabase = createClient<DatabaseTypes>(url, anonKey, {
      auth: {
        persistSession: false, // Server-side, no need for session persistence
      },
      global: {
        headers: {
          'x-application': 'mcp-supermarket-server',
        },
      },
    });

    console.error('Supabase client initialized');
  }

  getClient(): SupabaseClient<DatabaseTypes> | null {
    return this.supabase;
  }

  async testConnection(): Promise<boolean> {
    if (!this.supabase) {
      console.error('Supabase client not initialized');
      return false;
    }

    try {
      // Test query to check connection
      const { error } = await this.supabase.from('supermarkets').select('id').limit(1);

      if (error) {
        console.error('Supabase connection test failed:', error.message);
        return false;
      }

      console.error('Supabase connection test successful');
      return true;
    } catch (err) {
      console.error('Supabase connection test error:', err);
      return false;
    }
  }

  close(): void {
    // Supabase client doesn't need explicit cleanup
    this.supabase = null;
    console.error('Database connections closed');
  }
}
