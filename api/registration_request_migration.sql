-- Migration: Add Registration Requests Table
-- Bucket: registration-documents (ensure this is created in Supabase Dashboard)

CREATE TABLE IF NOT EXISTS registration_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    document_url TEXT,
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ensure users table has status 'pending' by default
ALTER TABLE users ALTER COLUMN status SET DEFAULT 'pending';

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_registration_requests_status ON registration_requests(status);
CREATE INDEX IF NOT EXISTS idx_registration_requests_user_id ON registration_requests(user_id);
