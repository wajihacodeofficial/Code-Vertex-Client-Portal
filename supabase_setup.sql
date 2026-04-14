-- Code Vertex Supabase Setup (Idempotent Version)

-- 1. Create Profiles table (extending Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'team', 'client')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    phone TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Trigger Function (OR REPLACE handle updates)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role, status)
    VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'), 
    COALESCE(new.raw_user_meta_data->>'role', 'client'),
    'pending'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT,
    status TEXT DEFAULT 'In Progress',
    progress INTEGER DEFAULT 0,
    pm_id UUID REFERENCES public.profiles(id),
    client_id UUID REFERENCES public.profiles(id),
    deadline DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tech Stack Mapping
CREATE TABLE IF NOT EXISTS public.project_tech_stack (
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    tech TEXT NOT NULL,
    PRIMARY KEY (project_id, tech)
);

-- 5. Scope Versioning
CREATE TABLE IF NOT EXISTS public.project_scope (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    version TEXT DEFAULT 'v1.0',
    is_approved BOOLEAN DEFAULT FALSE,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Scope Inclusions/Exclusions
CREATE TABLE IF NOT EXISTS public.scope_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scope_id UUID REFERENCES public.project_scope(id) ON DELETE CASCADE,
    feature TEXT NOT NULL,
    is_included BOOLEAN DEFAULT TRUE
);

-- 7. Internal Financials Master
CREATE TABLE IF NOT EXISTS public.project_financials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE UNIQUE,
    total_budget DECIMAL(12, 2) NOT NULL DEFAULT 0,
    paid_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Financial Milestones
CREATE TABLE IF NOT EXISTS public.payment_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    financials_id UUID REFERENCES public.project_financials(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    due_date DATE,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Overdue')),
    condition TEXT
);

-- 9. Immutable Change Requests
CREATE TABLE IF NOT EXISTS public.change_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Pending Review' CHECK (status IN ('Pending Review', 'Approved', 'Rejected')),
    cost DECIMAL(12, 2) DEFAULT 0,
    timeline_impact_days INTEGER DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Invoicing Engine
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Paid', 'Unpaid', 'Overdue')),
    issue_date DATE,
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Ticketing System
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES public.profiles(id),
    subject TEXT NOT NULL,
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on all tables (safe to run multiple times)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tech_stack ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_scope ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scope_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- 12. Email Verification Tokens
CREATE TABLE IF NOT EXISTS public.email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.email_verification_tokens ENABLE ROW LEVEL SECURITY;
-- Internal only, no RLS policies needed for public access as it's backend-managed.

