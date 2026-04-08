-- ============================================================
-- Code Vertex Client Portal — Supabase Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID generation (already available in Supabase)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── OTP Verifications Table ─────────────────────────────────
-- Stores 6-digit OTPs for email verification (5-minute expiry)
CREATE TABLE IF NOT EXISTS otp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast OTP lookups by email
CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_verifications(email);

-- Auto-expire: clean up OTPs older than 1 hour to keep table lean
-- (Supabase doesn't have cron by default; use pg_cron extension or clean up on insert)

-- ─── Update public.users table ────────────────────────────────
-- Add email_verified column if it doesn't already exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS supabase_uid UUID UNIQUE;

-- ─── Initial Admin Accounts ──────────────────────────────────
-- NOTE: Passwords are now managed by Supabase Auth, NOT stored here.
-- After running this migration, create admin users through:
--   Supabase Dashboard → Authentication → Users → Invite user
-- OR use the /api/auth/signup endpoint.
--
-- After creating via Supabase Auth, insert profile manually or let
-- the signup endpoint handle it. Example profile insert:
--
-- INSERT INTO users (email, name, role, status, email_verified)
-- VALUES ('admin@codevertex.solutions', 'System Admin', 'admin', 'approved', true)
-- ON CONFLICT (email) DO NOTHING;

-- ─── Row Level Security (RLS) ────────────────────────────────
-- Enable RLS on users table for security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow service role (backend) full access (bypasses RLS)
-- Frontend only reads its own profile via authenticated JWT
CREATE POLICY IF NOT EXISTS "Users can read own profile" 
    ON users FOR SELECT 
    USING (auth.uid() = supabase_uid);

-- OTP table: only backend (service role) should read/write
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;
-- Service role bypasses RLS automatically — no policy needed for backend ops
