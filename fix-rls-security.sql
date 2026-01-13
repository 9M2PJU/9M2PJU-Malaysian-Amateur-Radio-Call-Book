-- =====================================================
-- FIX RLS SECURITY - PREVENT UNAUTHORIZED UPDATES
-- Run this in Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =====================================================

-- Step 1: Drop the insecure update policy
DROP POLICY IF EXISTS "Allow public update" ON callsigns;

-- Step 2: Create secure update policy - users can only update their own callsigns
CREATE POLICY "Allow owner update" ON callsigns
    FOR UPDATE
    USING (auth.uid() = user_id)  -- Only if current user owns the record
    WITH CHECK (auth.uid() = user_id);  -- Prevent changing user_id to someone else

-- Step 3: Create admin override policy (optional - for admin user)
-- This allows the admin to update any callsign
-- Replace 'YOUR_ADMIN_USER_ID' with actual admin UUID from auth.users table
-- CREATE POLICY "Allow admin update" ON callsigns
--     FOR UPDATE
--     USING (auth.uid() = 'YOUR_ADMIN_USER_ID'::uuid);

-- Step 4: Also secure the INSERT policy to track ownership
DROP POLICY IF EXISTS "Allow public insert" ON callsigns;

CREATE POLICY "Allow authenticated insert" ON callsigns
    FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL  -- Must be logged in
        AND (user_id = auth.uid() OR user_id IS NULL)  -- Can only set own user_id
    );

-- Done! Security is now enforced at database level.
-- Users can only update callsigns they own (where user_id matches their auth.uid())
