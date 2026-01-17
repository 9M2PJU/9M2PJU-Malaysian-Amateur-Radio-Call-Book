-- Add updated_at column to callsigns table
ALTER TABLE public.callsigns
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;

-- Optional: Create a trigger to automatically update updated_at (good practice, but we are handling it in frontend too for now)
-- For now, just adding the column as requested.
