# Supabase Database Setup Guide

This guide walks you through setting up a Supabase database for the MCP Supermarket Product Database project.

## 1. Create a Supabase Account and Project

1. Go to [Supabase](https://supabase.com) and sign up for a free account
2. Click "New Project" in your dashboard
3. Fill in the project details:
   - **Name**: `mcp-supermarket-db` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to you
   - **Pricing Plan**: Free tier is sufficient for development

4. Click "Create new project" and wait for provisioning (~2 minutes)

## 2. Get Your Project Credentials

Once your project is ready:

1. Go to **Settings** (gear icon) → **API**
2. You'll find:
   - **Project URL**: `https://[your-project-id].supabase.co`
   - **Anon public key**: A long string starting with `eyJ...`
   
3. Copy these values - you'll need them for the `.env` file

## 3. Set Up the Database Schema

### Option A: Using Supabase Dashboard (Recommended)

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click "New query"
3. Copy and paste the contents of each file in order:
   - `db/migrations/001_create_tables.sql`
   - `db/migrations/002_setup_rls_policies.sql`
   - `db/migrations/003_seed_supermarkets.sql`
4. After pasting each file, click "Run" and wait for success
5. You should see "Success. No rows returned" for each migration

### Option B: Using the Setup Script

1. First, create your `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   SUPABASE_URL=https://[your-project-id].supabase.co
   SUPABASE_ANON_KEY=[your-anon-key]
   SUPABASE_DB_PASSWORD=[your-database-password]  # Optional - for automated migrations
   ```

3. Run the setup script:
   ```bash
   ./db/setup-database.sh
   ```

## 4. Verify the Setup

### In Supabase Dashboard:

1. Go to **Table Editor** (left sidebar)
2. You should see 4 tables:
   - `supermarkets` (with 2 rows: Albert Heijn and Jumbo)
   - `supermarket_branches` (empty)
   - `products` (empty)
   - `price_history` (empty)

3. Go to **Authentication** → **Policies**
4. You should see RLS policies enabled for all tables

### Test with MCP Server:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build and start the server:
   ```bash
   npm run build
   npm start
   ```

3. You should see:
   ```
   Starting MCP Supermarket Product Database Server...
   Supabase client initialized
   Supabase connection test successful
   MCP server started successfully
   ```

## 5. Troubleshooting

### "Database connection test failed"
- Ensure you've run all three migration scripts
- Check that your `.env` file has the correct credentials
- Verify your Supabase project is active (not paused)

### "Table does not exist" errors
- Make sure you ran the migrations in order (001, 002, 003)
- Check the SQL Editor history in Supabase for any errors

### RLS Policy errors
- Ensure you ran `002_setup_rls_policies.sql`
- The anon key only has read access - write operations will fail

## 6. Next Steps

1. The database is now ready for the MCP server
2. You can test the product search tool using an MCP client
3. Product and price data will be populated by the Python scrapers (separate project)

## Security Notes

- **Never commit your `.env` file** - it's in `.gitignore`
- The anon key is safe to use in frontend applications (read-only)
- Keep your service role key secret (only for backend scrapers)
- RLS policies ensure data security at the database level