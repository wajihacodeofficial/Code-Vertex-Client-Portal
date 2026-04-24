-- Code Vertex Enterprise Portal Schema
-- Requires PostgreSQL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'team', 'client')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'In Progress',
    progress INTEGER DEFAULT 0,
    pm_id UUID REFERENCES users(id),
    client_id UUID REFERENCES users(id),
    deadline DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tech Stack Mapping
CREATE TABLE project_tech_stack (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    tech VARCHAR(100) NOT NULL,
    PRIMARY KEY (project_id, tech)
);

-- Scope Versioning
CREATE TABLE project_scope (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    version VARCHAR(50) DEFAULT 'v1.0',
    is_approved BOOLEAN DEFAULT FALSE,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Scope Inclusions/Exclusions
CREATE TABLE scope_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scope_id UUID REFERENCES project_scope(id) ON DELETE CASCADE,
    feature TEXT NOT NULL,
    is_included BOOLEAN DEFAULT TRUE
);

-- Internal Financials Master
CREATE TABLE project_financials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
    total_budget DECIMAL(12, 2) NOT NULL DEFAULT 0,
    paid_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'USD',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Financial Milestones
CREATE TABLE payment_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    financials_id UUID REFERENCES project_financials(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Overdue')),
    condition TEXT
);

-- Immutable Change Requests
CREATE TABLE change_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Pending Review' CHECK (status IN ('Pending Review', 'Approved', 'Rejected')),
    cost DECIMAL(12, 2) DEFAULT 0,
    timeline_impact_days INTEGER DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Invoicing Engine
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Paid', 'Unpaid', 'Overdue')),
    issue_date DATE,
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ticketing System
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES users(id),
    subject VARCHAR(255) NOT NULL,
    priority VARCHAR(50) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    status VARCHAR(50) DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Default Super Admin (password: AdminCodey@110 hashed if needed, storing plaintext for dev mock here)
INSERT INTO users (email, password_hash, name, role, status) 
VALUES ('admin@codevertex.solutions', 'SUPABASE_AUTH', 'System Admin', 'admin', 'approved')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password_hash, name, role, status) 
VALUES ('team@codevertex.solution', 'TeamCodey@110', 'Team Member', 'team', 'pending')
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password_hash, name, role, status) 
VALUES ('testclient@gmail.com', 'Client@123', 'Test Client', 'client', 'approved')
ON CONFLICT (email) DO NOTHING;
