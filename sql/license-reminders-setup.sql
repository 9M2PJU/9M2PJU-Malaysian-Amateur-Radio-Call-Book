-- License Reminder Tracking Table
-- This table tracks which reminders have been sent to avoid duplicates

CREATE TABLE IF NOT EXISTS license_reminders_sent (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    callsign TEXT NOT NULL,
    email TEXT NOT NULL,
    days_before INTEGER NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Prevent duplicate reminders for same callsign at same interval
    CONSTRAINT unique_reminder UNIQUE(callsign, days_before)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_reminders_callsign ON license_reminders_sent(callsign);
CREATE INDEX IF NOT EXISTS idx_reminders_sent_at ON license_reminders_sent(sent_at);

-- Enable RLS (optional, since this is backend-only)
ALTER TABLE license_reminders_sent ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can access (Edge Functions use service role)
CREATE POLICY "Service role only" ON license_reminders_sent
    FOR ALL
    USING (auth.role() = 'service_role');
