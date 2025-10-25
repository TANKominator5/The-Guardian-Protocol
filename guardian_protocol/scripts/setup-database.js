#!/usr/bin/env node

/**
 * Database Setup Script for Guardian Protocol
 * 
 * This script helps you set up the entities table in your Supabase database.
 * Make sure you have your Supabase credentials in your .env.local file.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the SQL setup file
const setupSqlPath = path.join(__dirname, '..', 'database', 'setup.sql');
const setupSql = fs.readFileSync(setupSqlPath, 'utf8');

console.log('🚀 Guardian Protocol Database Setup');
console.log('=====================================\n');

console.log('📋 Setup Instructions:');
console.log('1. Go to your Supabase project dashboard');
console.log('2. Navigate to the SQL Editor');
console.log('3. Copy and paste the following SQL script:');
console.log('\n' + '='.repeat(50));
console.log(setupSql);
console.log('='.repeat(50));

console.log('\n✅ After running the SQL script:');
console.log('- The entities table will be created');
console.log('- Sample data will be inserted');
console.log('- Indexes will be added for performance');
console.log('- Row Level Security will be enabled');

console.log('\n🔧 Environment Variables Required:');
console.log('- NEXT_PUBLIC_SUPABASE_URL');
console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');

console.log('\n📖 For detailed instructions, see: database/README.md');
console.log('\n🎉 Once setup is complete, your entities page should work!');
