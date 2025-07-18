-- Migration script to add IP tracking columns to existing tables
-- Run this if you already have existing tables

-- Add IP tracking columns to donors table
ALTER TABLE donors ADD COLUMN IF NOT EXISTS ip_address INET;
ALTER TABLE donors ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE donors ADD COLUMN IF NOT EXISTS registration_source VARCHAR(50) DEFAULT 'web';

-- Add IP tracking columns to blood_requests table
ALTER TABLE blood_requests ADD COLUMN IF NOT EXISTS ip_address INET;
ALTER TABLE blood_requests ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Add IP tracking columns to contact_messages table
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS ip_address INET;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Add indexes for better performance on IP addresses
CREATE INDEX IF NOT EXISTS idx_donors_ip_address ON donors(ip_address);
CREATE INDEX IF NOT EXISTS idx_blood_requests_ip_address ON blood_requests(ip_address);
CREATE INDEX IF NOT EXISTS idx_contact_messages_ip_address ON contact_messages(ip_address);

-- Add indexes for user agents (for analytics)
CREATE INDEX IF NOT EXISTS idx_donors_user_agent ON donors USING hash(user_agent);
CREATE INDEX IF NOT EXISTS idx_blood_requests_user_agent ON blood_requests USING hash(user_agent);
CREATE INDEX IF NOT EXISTS idx_contact_messages_user_agent ON contact_messages USING hash(user_agent);

-- Add comment to document the purpose
COMMENT ON COLUMN donors.ip_address IS 'IP address of the user when they registered';
COMMENT ON COLUMN donors.user_agent IS 'Browser user agent string for device identification';
COMMENT ON COLUMN donors.registration_source IS 'Source of registration (web, mobile, etc.)';

COMMENT ON COLUMN blood_requests.ip_address IS 'IP address of the user when they submitted the request';
COMMENT ON COLUMN blood_requests.user_agent IS 'Browser user agent string for device identification';

COMMENT ON COLUMN contact_messages.ip_address IS 'IP address of the user when they sent the message';
COMMENT ON COLUMN contact_messages.user_agent IS 'Browser user agent string for device identification';
