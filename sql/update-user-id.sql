-- Add user_id column to callsigns table
-- This links the callsign to the registered user who created it
ALTER TABLE callsigns ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Optional: Create an index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_callsigns_user_id ON callsigns(user_id);

-- Run this in Supabase SQL Editor!
