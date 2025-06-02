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

echo "📋 Database Setup Options"
echo "========================"
echo ""
echo "Your Supabase project URL: $SUPABASE_URL"
echo ""
echo "Choose how to run the migrations:"
echo "1) Automatic - Using Supabase Management API (recommended)"
echo "2) Semi-automatic - Generate a single SQL file to run in dashboard"
echo "3) Manual - Follow step-by-step instructions"
echo ""
echo -n "Enter your choice (1-3): "
read -r choice

case $choice in
    1)
        echo ""
        echo "🔧 Setting up automatic migration..."
        echo ""
        
        # Check if database password is in .env
        DB_PASSWORD=$(get_env_value "SUPABASE_DB_PASSWORD")
        
        if [ -z "$DB_PASSWORD" ] || [ "$DB_PASSWORD" = "your-database-password-here" ]; then
            echo "To run migrations automatically, we need your database password."
            echo "You can find this in Supabase Dashboard > Settings > Database"
            echo ""
            echo -n "Enter your database password (input hidden): "
            read -s DB_PASSWORD
            echo ""
            echo ""
            
            # Offer to save to .env
            echo "Would you like to save the database password to .env? (y/n)"
            read -r save_response
            if [[ "$save_response" =~ ^[Yy]$ ]]; then
                # Update .env file
                if grep -q "SUPABASE_DB_PASSWORD=" .env; then
                    # Update existing line
                    sed -i.bak "s/SUPABASE_DB_PASSWORD=.*/SUPABASE_DB_PASSWORD=$DB_PASSWORD/" .env
                else
                    # Add new line
                    echo "" >> .env
                    echo "# Database Configuration (for migrations only - not used by MCP server)" >> .env
                    echo "SUPABASE_DB_PASSWORD=$DB_PASSWORD" >> .env
                fi
                echo "✅ Database password saved to .env"
            fi
        else
            echo "✅ Using database password from .env"
        fi
        echo ""
        
        # For Supabase, we need to construct the correct database URL
        echo "📋 To get your database connection string:"
        echo "1. Go to your Supabase Dashboard > Settings > Database"
        echo "2. Look for 'Connection string' under 'Connection info'"
        echo "3. Use the 'URI' format"
        echo ""
        echo "Or press Enter to try with the standard format..."
        echo ""
        
        # Extract project ref from URL (compatible with macOS)
        PROJECT_REF=$(echo $SUPABASE_URL | sed 's|https://||' | cut -d'.' -f1)
        
        # Try multiple possible formats
        # Format 1: Direct connection (most common)
        DB_URL="postgresql://postgres:${DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres"
        
        echo "Trying connection to: db.${PROJECT_REF}.supabase.co..."
        
        echo "🚀 Running migrations..."
        
        # Check if psql is available
        if command -v psql &> /dev/null; then
            # Run migrations using psql
            for migration in db/migrations/*.sql; do
                echo "Running $(basename $migration)..."
                if PGPASSWORD=$DB_PASSWORD psql $DB_URL -f $migration; then
                    echo "✅ $(basename $migration) completed"
                else
                    echo "❌ Failed to run $(basename $migration)"
                    echo "Please check your database password and try again"
                    exit 1
                fi
            done
            echo ""
            echo "✅ All migrations completed successfully!"
        else
            echo "❌ psql not found. Please install PostgreSQL client tools:"
            echo "   Mac: brew install postgresql"
            echo "   Ubuntu/Debian: sudo apt-get install postgresql-client"
            echo "   Or choose option 2 or 3"
            exit 1
        fi
        ;;
        
    2)
        echo ""
        echo "🔧 Generating combined migration file..."
        
        # Create a combined SQL file
        COMBINED_FILE="db/combined_migrations.sql"
        echo "-- Combined migrations for MCP Supermarket Database" > $COMBINED_FILE
        echo "-- Generated on $(date)" >> $COMBINED_FILE
        echo "" >> $COMBINED_FILE
        
        for migration in db/migrations/*.sql; do
            echo "-- ========================================" >> $COMBINED_FILE
            echo "-- Migration: $(basename $migration)" >> $COMBINED_FILE
            echo "-- ========================================" >> $COMBINED_FILE
            cat $migration >> $COMBINED_FILE
            echo "" >> $COMBINED_FILE
            echo "" >> $COMBINED_FILE
        done
        
        echo "✅ Combined migration file created: $COMBINED_FILE"
        echo ""
        echo "📋 Next steps:"
        echo "1. Go to your Supabase Dashboard: $SUPABASE_URL"
        echo "2. Navigate to SQL Editor"
        echo "3. Click 'New query'"
        echo "4. Copy and paste the contents of: $COMBINED_FILE"
        echo "5. Click 'Run'"
        echo ""
        echo "The combined file contains all migrations in the correct order."
        ;;
        
    3)
        echo ""
        echo "📋 Manual Setup Instructions"
        echo "============================"
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
        ;;
        
    *)
        echo "Invalid choice. Please run the script again and choose 1, 2, or 3."
        exit 1
        ;;
esac

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