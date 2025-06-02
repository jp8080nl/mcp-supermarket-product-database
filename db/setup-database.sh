#!/bin/bash

# Database Setup Script for Supabase
# This script helps set up the database schema for the MCP Supermarket Product Database

set -e

echo "🛒 MCP Supermarket Product Database Setup"
echo "========================================"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.example .env
    echo "✅ Created .env file. Please update it with your Supabase credentials."
    echo ""
fi

# Function to extract value from .env file
get_env_value() {
    grep "^$1=" .env | cut -d '=' -f2- | tr -d '"' | tr -d "'"
}

# Read Supabase configuration
SUPABASE_URL=$(get_env_value "SUPABASE_URL")
SUPABASE_ANON_KEY=$(get_env_value "SUPABASE_ANON_KEY")

if [ -z "$SUPABASE_URL" ] || [ "$SUPABASE_URL" = "https://your-project.supabase.co" ]; then
    echo "❌ Error: SUPABASE_URL not configured in .env file"
    echo "Please update .env with your Supabase project URL"
    exit 1
fi

if [ -z "$SUPABASE_ANON_KEY" ] || [ "$SUPABASE_ANON_KEY" = "your-anon-key-here" ]; then
    echo "❌ Error: SUPABASE_ANON_KEY not configured in .env file"
    echo "Please update .env with your Supabase anon key"
    exit 1
fi

echo "📋 Database Setup Instructions"
echo "=============================="
echo ""
echo "Your Supabase project URL: $SUPABASE_URL"
echo ""
echo "Please follow these steps to set up your database:"
echo ""
echo "1. Go to your Supabase Dashboard:"
echo "   $SUPABASE_URL"
echo ""
echo "2. Navigate to SQL Editor (in the left sidebar)"
echo ""
echo "3. Run these migration files in order:"
echo "   - Copy and paste contents of: db/migrations/001_create_tables.sql"
echo "   - Click 'Run' and wait for completion"
echo "   - Copy and paste contents of: db/migrations/002_setup_rls_policies.sql"
echo "   - Click 'Run' and wait for completion"
echo "   - Copy and paste contents of: db/migrations/003_seed_supermarkets.sql"
echo "   - Click 'Run' and wait for completion"
echo ""
echo "4. Verify the setup:"
echo "   - Go to Table Editor in Supabase"
echo "   - You should see 4 tables: supermarkets, supermarket_branches, products, price_history"
echo "   - The supermarkets table should have 2 rows (Albert Heijn and Jumbo)"
echo ""
echo "5. Test the connection:"
echo "   npm run build && npm start"
echo ""
echo "📝 Note: If you have Supabase CLI installed, you can also run:"
echo "   supabase db push --db-url postgresql://postgres:[password]@[host]:5432/postgres"
echo ""

# Offer to test the connection
echo "Would you like to test the database connection now? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔍 Testing database connection..."
    npm run build > /dev/null 2>&1
    
    # Create a simple test script
    cat > test-connection.js << 'EOF'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('supermarkets')
      .select('name')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection test failed:', error.message);
      console.error('   Make sure you have run all migration scripts');
      process.exit(1);
    }
    
    console.log('✅ Database connection successful!');
    if (data && data.length > 0) {
      console.log('✅ Found supermarket:', data[0].name);
    } else {
      console.log('⚠️  No supermarkets found. Make sure to run 003_seed_supermarkets.sql');
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

testConnection();
EOF

    # Load environment variables and run test
    export $(grep -v '^#' .env | xargs)
    node test-connection.js
    rm test-connection.js
fi

echo ""
echo "🎉 Setup instructions complete!"
echo "Once your database is set up, you can start developing with:"
echo "   npm run dev"