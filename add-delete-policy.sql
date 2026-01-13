-- =====================================================
-- ADD DELETE POLICY
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable DELETE for owners and admin
CREATE POLICY "Allow owner or admin delete" ON callsigns
    FOR DELETE
    USING (
        auth.uid() = user_id
        OR 
        auth.jwt() ->> 'email' = '9m2pju@hamradio.my'
    );
