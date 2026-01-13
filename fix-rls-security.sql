-- =====================================================
-- ADD ADMIN OVERRIDE TO RLS POLICY
-- Run this in Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =====================================================

-- Step 1: Drop the current update policy
DROP POLICY IF EXISTS "Allow owner update" ON callsigns;

-- Step 2: Create new update policy with admin override
-- Admin (9m2pju@hamradio.my) can edit any callsign
-- Regular users can only edit their own callsigns
CREATE POLICY "Allow owner or admin update" ON callsigns
    FOR UPDATE
    USING (
        auth.uid() = user_id  -- Owner can update
        OR 
        (SELECT email FROM auth.users WHERE id = auth.uid()) = '9m2pju@hamradio.my'  -- Admin can update any
    )
    WITH CHECK (
        auth.uid() = user_id
        OR 
        (SELECT email FROM auth.users WHERE id = auth.uid()) = '9m2pju@hamradio.my'
    );

-- Done! Admin can now edit any callsign.
