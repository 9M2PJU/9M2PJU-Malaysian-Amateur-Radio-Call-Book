-- =====================================================
-- SITE STATS TABLE FOR VISITOR TRACKING
-- Run this in Supabase SQL Editor
-- =====================================================

-- Create table to track site statistics
CREATE TABLE IF NOT EXISTS site_stats (
    id SERIAL PRIMARY KEY,
    total_visits INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT NOW()
);

-- Insert initial row if not exists
INSERT INTO site_stats (id, total_visits) VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Function to increment visitor count and return new count
CREATE OR REPLACE FUNCTION increment_visit()
RETURNS INTEGER AS $$
DECLARE new_count INTEGER;
BEGIN
    UPDATE site_stats 
    SET total_visits = total_visits + 1, last_updated = NOW() 
    WHERE id = 1 
    RETURNING total_visits INTO new_count;
    RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current visit count
CREATE OR REPLACE FUNCTION get_visit_count()
RETURNS INTEGER AS $$
DECLARE current_count INTEGER;
BEGIN
    SELECT total_visits INTO current_count FROM site_stats WHERE id = 1;
    RETURN COALESCE(current_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access
GRANT EXECUTE ON FUNCTION increment_visit() TO authenticated;
GRANT EXECUTE ON FUNCTION get_visit_count() TO authenticated;
GRANT EXECUTE ON FUNCTION get_visit_count() TO anon;

-- Done! Now visitors can be tracked.
