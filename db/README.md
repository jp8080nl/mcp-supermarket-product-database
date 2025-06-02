# Database Setup

This directory contains SQL migrations for setting up the Supabase database schema.

## Prerequisites

1. Create a Supabase project at https://supabase.com
2. Note down your project URL and anon key

## Migration Files

1. **001_create_tables.sql** - Creates the four main tables:
   - `supermarkets` - Supermarket chains
   - `supermarket_branches` - Store locations
   - `products` - Product catalog
   - `price_history` - Price tracking

2. **002_setup_rls_policies.sql** - Sets up Row Level Security:
   - Enables RLS on all tables
   - Creates read-only policies for anonymous access
   - No write access for anonymous users (only service role)

3. **003_seed_supermarkets.sql** - Seeds initial data:
   - Adds Albert Heijn and Jumbo supermarket chains

## Setup Instructions

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run each migration file in order (001, 002, 003)

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref <your-project-ref>

# Run migrations
supabase db push
```

### Option 3: Direct PostgreSQL Connection

```bash
# Connect to your Supabase database
psql -h <your-project>.supabase.co -p 5432 -d postgres -U postgres

# Run each migration
\i db/migrations/001_create_tables.sql
\i db/migrations/002_setup_rls_policies.sql
\i db/migrations/003_seed_supermarkets.sql
```

## Environment Configuration

After setting up the database, create a `.env` file in the project root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## Verification

To verify the setup:

1. Tables should be created and visible in Supabase Table Editor
2. RLS policies should be active (check in Authentication > Policies)
3. Test the connection:
   ```bash
   npm run dev
   ```
   The server should connect successfully without errors

## Notes

- The anon key provides read-only access via RLS policies
- Write operations require the service role key (not used in MCP server)
- The schema matches the TypeScript types in `src/types/supabase.ts`