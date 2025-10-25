# Database Setup for Guardian Protocol

This directory contains the database setup files for the Guardian Protocol application.

## Setup Instructions

### 1. Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor

### 2. Create the Entry Profile Table
1. Copy the contents of `setup.sql`
2. Paste it into the SQL Editor in Supabase
3. Click "Run" to execute the script

### 3. Verify the Setup
The script will:
- Create the `entry_profile` table with proper structure
- Add indexes for better performance
- Insert sample data for testing
- Enable Row Level Security (RLS)

### 4. Environment Variables
Make sure your `.env.local` file contains:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Table Structure

The `entry_profile` table includes:
- `id`: Primary key (auto-increment)
- `entry_id`: Unique identifier for each entity
- `primary_name`: Main name of the entity
- `aliases`: Array of alternative names
- `status`: Entity status (SAFE or ALERT)
- `last_seen`: Time when entity was last seen
- `confidence_score`: Confidence level (0.0 to 1.0)
- `location`: Current or last known location
- `card_id`: Associated card identifier
- `device_hash`: Device identifier hash
- `created_at`: Record creation timestamp
- `updated_at`: Record update timestamp

## Sample Data

The setup script includes 10 sample entities with various statuses and locations for testing purposes.
