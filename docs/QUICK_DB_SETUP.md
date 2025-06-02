# Quick Database Setup

Since you're having connection issues with the automated script, here's the quickest way to set up your database:

## One-Step Setup

1. Go to your Supabase Dashboard: https://zbdlbypsaefatzgstatv.supabase.co
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy ALL contents from: `db/run-migrations.sql`
5. Paste into the SQL Editor
6. Click **Run**

That's it! This single file contains all three migrations combined.

## Verify Setup

After running the migration:

1. Go to **Table Editor** - you should see 4 tables
2. Check the `supermarkets` table - it should have 2 rows (Albert Heijn and Jumbo)

## Test Connection

```bash
npm run build
npm start
```

You should see:
```
Starting MCP Supermarket Product Database Server...
Supabase client initialized
Supabase connection test successful
MCP server started successfully
```

## Troubleshooting

If you get any errors:
- Make sure you copied the ENTIRE contents of `db/run-migrations.sql`
- Check the SQL Editor for any error messages
- Ensure your Supabase project is active (not paused)