-- =====================================================
-- DONATOR BADGE SYSTEM SETUP
-- Run this in Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =====================================================

-- Step 1: Create user_profiles table to track donator status
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    is_donator BOOLEAN DEFAULT FALSE,
    donator_note TEXT, -- Optional note about the donation
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_donator ON user_profiles(is_donator) WHERE is_donator = TRUE;

-- Step 3: Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policy for public read access (anyone can see donator badges)
CREATE POLICY "Allow public read access" ON user_profiles
    FOR SELECT
    USING (true);

-- Step 5: Create policy for admin insert/update (only admins can manage donator status)
CREATE POLICY "Allow admin insert" ON user_profiles
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE LOWER(admins.email) = LOWER(auth.jwt() ->> 'email')
        )
        OR auth.jwt() ->> 'email' = '9m2pju@hamradio.my'
    );

CREATE POLICY "Allow admin update" ON user_profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE LOWER(admins.email) = LOWER(auth.jwt() ->> 'email')
        )
        OR auth.jwt() ->> 'email' = '9m2pju@hamradio.my'
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE LOWER(admins.email) = LOWER(auth.jwt() ->> 'email')
        )
        OR auth.jwt() ->> 'email' = '9m2pju@hamradio.my'
    );

-- Step 6: Create policy for admin delete
CREATE POLICY "Allow admin delete" ON user_profiles
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE LOWER(admins.email) = LOWER(auth.jwt() ->> 'email')
        )
        OR auth.jwt() ->> 'email' = '9m2pju@hamradio.my'
    );

-- Step 7: Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Done! Your donator badge system is ready.
-- Admins can now assign donator badges via the admin panel.
