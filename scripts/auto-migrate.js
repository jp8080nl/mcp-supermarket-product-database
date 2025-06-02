#!/usr/bin/env node

import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

async function runAllMigrations() {
  let client;
  
  // Check if full connection string is provided
  if (process.env.SUPABASE_CONNECTION_STRING) {
    console.log('🔌 Using connection string from .env');
    client = new pg.Client(process.env.SUPABASE_CONNECTION_STRING);
  } else {
    // Try to build connection string
    const supabaseUrl = process.env.SUPABASE_URL;
    const dbPassword = process.env.SUPABASE_DB_PASSWORD;
    
    if (!supabaseUrl || !dbPassword) {
      console.error('❌ Missing required environment variables');
      console.error('\nOption 1: Add full connection string to .env:');
      console.error('  SUPABASE_CONNECTION_STRING=<copy from Supabase Dashboard>');
      console.error('\nOption 2: Add individual credentials:');
      console.error('  SUPABASE_URL=https://your-project.supabase.co');
      console.error('  SUPABASE_DB_PASSWORD=your-database-password');
      process.exit(1);
    }

    // Extract project ID from URL
    const projectId = supabaseUrl.replace('https://', '').split('.')[0];
    
    console.log(`📍 Project: ${projectId}`);
    console.log('🔍 Attempting to connect...\n');

    // Try different connection string formats
    const connectionFormats = [
      `postgresql://postgres.${projectId}:${dbPassword}@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`,
      `postgresql://postgres:${dbPassword}@db.${projectId}.supabase.co:5432/postgres`,
      `postgresql://postgres.${projectId}:${dbPassword}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`,
      `postgresql://postgres.${projectId}:${dbPassword}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
    ];

    let connected = false;
    for (const connectionString of connectionFormats) {
      client = new pg.Client(connectionString);
      
      try {
        await client.connect();
        connected = true;
        console.log('✅ Connected to database\n');
        break;
      } catch (err) {
        await client.end();
      }
    }

    if (!connected) {
      console.error('❌ Could not connect with auto-detected connection string');
      console.error('\n📋 To fix this:');
      console.error('1. Go to Supabase Dashboard > Settings > Database');
      console.error('2. Copy the "Connection string" (URI format)');
      console.error('3. Add to .env file:');
      console.error('   SUPABASE_CONNECTION_STRING=<paste-connection-string-here>');
      console.error('4. Run npm run migrate again');
      process.exit(1);
    }
  }

  console.log('🚀 Starting database migrations...\n');

  try {
    // Connect if using direct connection string
    if (process.env.SUPABASE_CONNECTION_STRING) {
      await client.connect();
      console.log('✅ Connected to database\n');
    }

    // Get all SQL files from migrations folder
    const migrationsDir = join(__dirname, '..', 'db', 'migrations');
    const migrationFiles = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure correct order

    console.log(`📁 Found ${migrationFiles.length} migration files:\n`);

    // Loop through each migration file
    for (const file of migrationFiles) {
      console.log(`📄 Running ${file}...`);
      
      // Read the SQL file
      const filePath = join(migrationsDir, file);
      const sql = readFileSync(filePath, 'utf8');
      
      try {
        // Execute the SQL
        await client.query(sql);
        console.log(`✅ ${file} completed successfully\n`);
      } catch (error) {
        console.error(`❌ Error running ${file}:`);
        console.error(`   ${error.message}\n`);
        throw error; // Stop on first error
      }
    }

    console.log('🎉 All migrations completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check your database password is correct');
    console.error('2. Ensure your Supabase project is active');
    console.error('3. Verify the connection string format for your region');
    process.exit(1);
  } finally {
    // Always close the connection
    await client.end();
  }
}

// Run the migrations
runAllMigrations();