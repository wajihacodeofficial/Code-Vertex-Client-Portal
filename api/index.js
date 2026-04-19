const express = require('express');
const cors = require('cors');
require('dotenv').config();

const supabase = require('./db');
const { sendOTP, verifyOTP, sendPasswordResetLink } = require('./otp');

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
}));
app.use(express.json());

// ═══════════════════════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════════════════════

/**
 * POST /api/auth/signup
 * Creates a new user in Supabase Auth + public.users profile table,
 * then sends a 6-digit OTP to their email for verification.
 */
app.post('/api/auth/signup', async (req, res) => {
    const { name, email, password, role, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Name, email, password, and role are required.' });
    }

    if (!['client', 'team'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be client or team.' });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    try {
        // Step 1: Check if email already exists in our users table
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email.toLowerCase())
            .maybeSingle();

        if (existingUser) {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }

        // Step 2: Create user in Supabase Auth (disabled until OTP verified)
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: email.toLowerCase(),
            password,
            email_confirm: false, // Will be confirmed after OTP
            user_metadata: { name, role },
        });

        if (authError) {
            if (authError.message.includes('already been registered')) {
                return res.status(409).json({ error: 'An account with this email already exists.' });
            }
            return res.status(400).json({ error: authError.message });
        }

        // Step 3: Insert user profile into public.users
        const { error: dbError } = await supabase
            .from('users')
            .insert({
                supabase_uid: authData.user.id,
                email: email.toLowerCase(),
                name,
                role,
                phone: phone || null,
                status: 'pending',
                email_verified: false,
            });

        if (dbError) {
            // Rollback: delete the auth user if profile insert fails
            console.error('[Signup DB Error]:', dbError.message, dbError.details);
            await supabase.auth.admin.deleteUser(authData.user.id);
            return res.status(500).json({ error: 'Failed to create user profile: ' + dbError.message });
        }

        // Step 4: Generate and send OTP
        await sendOTP(email.toLowerCase());

        res.status(201).json({
            message: 'Account created. Please check your email for the verification code.',
            email: email.toLowerCase(),
        });
    } catch (err) {
        console.error('❌  [Signup Error]:', err);
        const errorMessage = err.message || 'Signup failed. Please try again.';
        res.status(500).json({ 
            error: 'Signup failed. Internal Server Error.',
            details: process.env.NODE_ENV === 'production' ? null : errorMessage
        });
    }
});

/**
 * POST /api/auth/verify-otp
 * Validates the 6-digit OTP and marks the user email as verified.
 */
app.post('/api/auth/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required.' });
    }

    if (!/^\d{6}$/.test(otp)) {
        return res.status(400).json({ error: 'OTP must be a 6-digit number.' });
    }

    try {
        // Validate OTP
        const result = await verifyOTP(email.toLowerCase(), otp);

        if (!result.valid) {
            return res.status(400).json({ error: result.error || 'Invalid or expired OTP' });
        }

        // Find the user in Supabase Auth by email
        const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) {
            return res.status(500).json({ error: 'Failed to verify user.' });
        }

        const authUser = authUsers.users.find(u => u.email === email.toLowerCase());
        if (!authUser) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Confirm email in Supabase Auth
        await supabase.auth.admin.updateUserById(authUser.id, {
            email_confirm: true,
        });

        // Update email_verified in public.users
        await supabase
            .from('users')
            .update({ email_verified: true })
            .eq('email', email.toLowerCase());

        res.json({
            message: 'Email verified successfully. Your account is pending admin approval.',
        });
    } catch (err) {
        console.error('[Verify OTP Error]', err);
        res.status(500).json({ error: 'Verification failed. Please try again.' });
    }
});

/**
 * POST /api/auth/resend-otp
 * Resends a new OTP to the given email (invalidates previous OTPs).
 */
app.post('/api/auth/resend-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    try {
        // Make sure the user exists
        const { data: user } = await supabase
            .from('users')
            .select('email_verified')
            .eq('email', email.toLowerCase())
            .maybeSingle();

        if (!user) {
            return res.status(404).json({ error: 'No account found with this email.' });
        }

        if (user.email_verified) {
            return res.status(400).json({ error: 'Email is already verified.' });
        }

        await sendOTP(email.toLowerCase());

        res.json({ message: 'A new verification code has been sent to your email.' });
    } catch (err) {
        console.error('[Resend OTP Error]', err);
        res.status(500).json({ error: 'Failed to resend OTP. Please try again.' });
    }
});

/**
 * POST /api/auth/login
 * Validates email + password against Supabase Auth, then checks
 * email_verified and account status in public.users.
 */
app.post('/api/auth/login', async (req, res) => {
    const { email, password, role: requestedRole } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        // Step 1: Authenticate with Supabase Auth (real password check)
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: email.toLowerCase(),
            password,
        });

        if (authError) {
            // Supabase returns 'Invalid login credentials' for wrong email/password
            if (authError.message.includes('Invalid login credentials') || authError.status === 400) {
                return res.json({ success: false, error: 'Invalid email or password.' });
            }
            if (authError.message.includes('Email not confirmed')) {
                return res.json({ success: false, error: 'Please verify your email first. Check your inbox for the verification code.' });
            }
            return res.json({ success: false, error: authError.message });
        }

        // Step 2: Check email verification status in our DB
        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase())
            .maybeSingle();

        if (profileError || !userProfile) {
            return res.json({ success: false, error: 'Invalid email or password.' });
        }

        if (!userProfile.email_verified) {
            return res.json({ success: false, error: 'Please verify your email first. Check your inbox for the verification code.' });
        }

        // Step 3: Check account status
        if (userProfile.status === 'pending') {
            return res.json({ success: false, error: 'Your account is awaiting admin approval. You will be notified once approved.' });
        }

        if (userProfile.status === 'rejected') {
            return res.json({ success: false, error: 'Your account has been rejected. Please contact support.' });
        }

        // Step 4: Role validation
        if (requestedRole && userProfile.role !== requestedRole) {
            // Allow admin to log in as team
            const isAdminAsTeam = userProfile.role === 'admin' && requestedRole === 'team';
            if (!isAdminAsTeam) {
                return res.json({
                    success: false,
                    error: `Role mismatch. This is a ${userProfile.role} account.`
                });
            }
        }

        // Step 5: Return session + profile
        res.json({
            success: true,
            message: 'Login successful.',
            session: authData.session, // Contains access_token (JWT)
            user: {
                id: userProfile.id,
                supabase_uid: userProfile.supabase_uid,
                email: userProfile.email,
                name: userProfile.name,
                role: userProfile.role,
                status: userProfile.status,
                phone: userProfile.phone,
            },
        });
    } catch (err) {
        console.error('[Login Error]', err);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

/**
 * POST /api/auth/forgot-password
 * Generates a password reset link and sends it via email.
 */
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    try {
        const { data: user } = await supabase
            .from('users')
            .select('email')
            .eq('email', email.toLowerCase())
            .maybeSingle();

        if (!user) {
            // Return success even if user not found to prevent email enumeration
            return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }

        await sendPasswordResetLink(email.toLowerCase());
        res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (err) {
        console.error('[Forgot Password Error]', err);
        res.status(500).json({ error: 'Failed to process forgot password request.' });
    }
});

/**
 * POST /api/auth/reset-password
 * Verifies the token and updates the user's password.
 */
app.post('/api/auth/reset-password', async (req, res) => {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
        return res.status(400).json({ error: 'Email, token, and new password are required.' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    try {
        // 1. Verify token
        const result = await verifyOTP(email.toLowerCase(), token);
        if (!result.valid) {
            return res.status(400).json({ error: result.error || 'Invalid or expired token' });
        }

        // 2. Find user in Supabase Auth
        const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) {
            return res.status(500).json({ error: 'Failed to access user accounts.' });
        }

        const authUser = authUsers.users.find(u => u.email === email.toLowerCase());
        if (!authUser) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // 3. Update password
        const { error: updateError } = await supabase.auth.admin.updateUserById(authUser.id, {
            password: newPassword,
        });

        if (updateError) {
            return res.status(400).json({ error: updateError.message });
        }

        res.json({ message: 'Password has been successfully reset.' });
    } catch (err) {
        console.error('[Reset Password Error]', err);
        res.status(500).json({ error: 'Failed to reset password.' });
    }
});

/**
 * POST /api/auth/logout
 * Signs out the current user from Supabase Auth.
 */
app.post('/api/auth/logout', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
        // Sign out using the user's access token
        await supabase.auth.admin.signOut(token);
    }

    res.json({ message: 'Logged out successfully.' });
});

// ═══════════════════════════════════════════════════════════════
// USERS ROUTES
// ═══════════════════════════════════════════════════════════════

// UPDATE USER PROFILE
app.patch('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, phone, company, avatar } = req.body;

    try {
        const { data, error } = await supabase
            .from('users')
            .update({ name, phone, company, avatar })
            .eq('id', id)
            .select()
            .maybeSingle();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, email, name, role, status, phone, email_verified, created_at');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/users/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value.' });
    }

    try {
        const { data, error } = await supabase
            .from('users')
            .update({ status })
            .eq('id', id)
            .select()
            .maybeSingle();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Step 1: Fetch the user profile to get the supabase_uid
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('supabase_uid, email')
            .eq('id', id)
            .maybeSingle();
            
        if (fetchError) throw fetchError;
        
        if (user && user.supabase_uid) {
            // Step 2: Delete from Supabase Auth
            const { error: authError } = await supabase.auth.admin.deleteUser(user.supabase_uid);
            // If user doesn't exist in auth, we continue (might have been deleted already)
            if (authError && !authError.message.includes('User not found')) {
                console.error('Supabase Auth deletion error:', authError.message);
            }
        }

        // Step 3: Delete the profile from public.users
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) throw error;
        
        res.json({ message: 'User and authenticaton account deleted successfully' });
    } catch (err) {
        console.error('User deletion failed:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ═══════════════════════════════════════════════════════════════
// PROJECTS ROUTES
// ═══════════════════════════════════════════════════════════════

app.get('/api/projects', async (req, res) => {
    try {
        const { data, error } = await supabase.from('projects').select('*');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/projects', async (req, res) => {
    const { 
        name, 
        description, 
        type, 
        client_id, 
        deadline, 
        status = 'In Progress', 
        progress = 0,
        tech_stack = [],
        team = []
    } = req.body;

    try {
        const { data, error } = await supabase
            .from('projects')
            .insert({ 
                name, 
                description, 
                type, 
                client_id, 
                deadline, 
                status, 
                progress,
                tech_stack,
                team
            })
            .select()
            .maybeSingle();
            
        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const { data, error } = await supabase
            .from('projects')
            .update(updates)
            .eq('id', id)
            .select()
            .maybeSingle();
            
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ═══════════════════════════════════════════════════════════════
// INVOICES ROUTES
// ═══════════════════════════════════════════════════════════════

app.get('/api/invoices', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('invoices')
            .select('*, projects(name)');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/invoices', async (req, res) => {
    const { amount, status, project_id, issue_date, due_date } = req.body;
    try {
        const { data, error } = await supabase
            .from('invoices')
            .insert({ amount, status, project_id, issue_date, due_date })
            .select()
            .maybeSingle();
        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/invoices/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('invoices').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: 'Invoice deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/invoices/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const { data, error } = await supabase
            .from('invoices')
            .update(updates)
            .eq('id', id)
            .select()
            .maybeSingle();
            
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// ═══════════════════════════════════════════════════════════════
// TICKETS ROUTES
// ═══════════════════════════════════════════════════════════════

app.get('/api/tickets', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('tickets')
            .select('*, projects(name), users(name)');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/tickets', async (req, res) => {
    const { project_id, reporter_id, subject, priority, description } = req.body;
    try {
        const { data, error } = await supabase
            .from('tickets')
            .insert({ project_id, reporter_id, subject, priority, description })
            .select()
            .maybeSingle();
        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/tickets/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('tickets').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: 'Ticket deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/tickets/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const { data, error } = await supabase
            .from('tickets')
            .update(updates)
            .eq('id', id)
            .select()
            .maybeSingle();
            
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ═══════════════════════════════════════════════════════════════
// ADMIN DASHBOARD ROUTES
// ═══════════════════════════════════════════════════════════════

app.get('/api/admin/stats', async (req, res) => {
    try {
        const { data: users } = await supabase.from('users').select('*');
        const { data: projects } = await supabase.from('projects').select('*');
        const { data: invoices } = await supabase.from('invoices').select('*');
        const { data: tickets } = await supabase.from('tickets').select('*');

        const stats = {
            totalRevenue: (invoices || []).filter(i => i.status === 'Paid').reduce((sum, i) => sum + Number(i.amount), 0) || 0,
            activeProjects: (projects || []).filter(p => p.status === 'In Progress').length || 0,
            activeClients: (users || []).filter(u => u.role === 'client' && u.status === 'approved').length || 0,
            pendingApprovals: (users || []).filter(u => u.status === 'pending' && u.email_verified === true).length || 0,
            totalUsers: (users || []).length || 0
        };

        res.json({
            stats,
            users,
            projects,
            invoices,
            tickets
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ═══════════════════════════════════════════════════════════════
// SERVER START
// ═══════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`\n✅ Code Vertex Platform Server running on port ${PORT}`);
        console.log(`   Auth: Supabase Auth + OTP (Zoho SMTP)`);
        console.log(`   Endpoints: /api/auth/{signup,login,verify-otp,resend-otp,logout}\n`);
    });
}

// Export the Express API for Vercel serverless integration
module.exports = app;
