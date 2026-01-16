-- =====================================================
-- MIGRATE DONATOR BADGES TO CALLSIGN-SPECIFIC
-- Run this in Supabase SQL Editor after the initial setup
-- =====================================================

-- Step 1: Add callsign_id column to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS callsign_id UUID REFERENCES callsigns(id) ON DELETE CASCADE;

-- Step 2: Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_callsign_id ON user_profiles(callsign_id);

-- Step 3: Drop the old email-based unique constraint if it exists
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_email_key;

-- Step 4: Update the table structure
-- Note: If you have existing data, you'll need to manually migrate it
-- For now, we'll clean up any email-based entries and start fresh with callsign-specific

-- Optional: Clear existing data (only if you haven't assigned badges yet)
-- DELETE FROM user_profiles WHERE callsign_id IS NULL;

-- Done! Now badges are assigned to specific callsigns, not emails.
