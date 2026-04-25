const express = require('express');
const cors = require('cors');
require('dotenv').config();

const supabase = require('./db');
const { sendOTP, verifyOTP, sendPasswordResetLink } = require('./otp');

const app = express();
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:3000', 'https://portal.codevertex.solutions', process.env.FRONTEND_URL].filter(Boolean),
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true
    }
});

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://portal.codevertex.solutions', process.env.FRONTEND_URL].filter(Boolean),
    credentials: true,
}));
app.use(express.json());

// Attach io to app for use in routes
app.set('io', io);

// ─── HEALTH CHECK ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
    });
});

// ─── ROUTES ───────────────────────────────────────────────────
const registrationRequestsRouter = require('./routes/registrationRequests');
app.use('/api/registration-requests', registrationRequestsRouter);

const authRouter = express.Router();

// ═══════════════════════════════════════════════════════════════
// AUTH ROUTES
// ═══════════════════════════════════════════════════════════════

authRouter.post('/signup', async (req, res) => {
    let { name, email, password, role, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Name, email, password, and role are required.' });
    }

    // Normalization
    name = name.trim();
    email = email.trim().toLowerCase();

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
            .eq('email', email)
            .maybeSingle();

        if (existingUser) {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }

        // Step 2: Generate and send OTP (with metadata for later creation)
        const metadata = { name, password, role, phone: phone || null };
        await sendOTP(email, metadata);

        console.log(`📧 [Signup Step 1]: OTP sent to ${email}`);
        res.status(200).json({
            message: 'Verification code sent to your email. Please verify to complete registration.',
            email: email
        });

    } catch (err) {
        console.error('❌ [Signup Error]:', err);
        res.status(500).json({ error: 'Registration failed. ' + err.message });
    }
});

authRouter.get('/verify-otp', (req, res) => {
    res.json({ message: 'Auth verify-otp route is active. Use POST to verify your code.' });
});

authRouter.post('/verify-otp', async (req, res) => {
    let { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required.' });
    }

    email = email.trim().toLowerCase();
    otp = otp.trim();

    try {
        // 1. Verify OTP and get metadata
        const result = await verifyOTP(email, otp);

        if (!result.valid) {
            return res.status(400).json({ error: result.error || 'Invalid or expired OTP' });
        }

        const metadata = result.metadata;
        if (!metadata) {
            return res.status(400).json({ error: 'Registration session expired. Please sign up again.' });
        }

        // 2. Create user in Supabase Auth (Admin SDK)
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: email,
            password: metadata.password,
            email_confirm: true,
            user_metadata: { name: metadata.name, role: metadata.role }
        });

        if (authError) {
            console.error('[Verify OTP] Auth Error:', authError.message);
            return res.status(500).json({ error: 'Auth creation failed: ' + authError.message });
        }

        // 3. Insert into public.users
        const { data: userData, error: dbError } = await supabase
            .from('users')
            .insert({
                supabase_uid: authData.user.id,
                email: email,
                name: metadata.name,
                role: metadata.role,
                phone: metadata.phone,
                status: 'pending',
                email_verified: true,
                password_hash: 'SUPABASE_AUTH'
            })
            .select('id')
            .single();

        if (dbError) {
            console.error('[Verify OTP] DB Error:', dbError.message);
            return res.status(500).json({ error: 'Database record creation failed.' });
        }

        // 4. Create registration request
        await supabase
            .from('registration_requests')
            .insert({
                user_id: userData.id,
                role: metadata.role,
                status: 'PENDING'
            });

        // 5. Notify Admin via Socket.io
        const io = req.app.get('io');
        if (io) {
            io.emit('new_registration_request', {
                email: email,
                name: metadata.name,
                role: metadata.role
            });
        }

        console.log(`✅ [Registration Complete]: ${email} - Awaiting Approval`);
        res.json({ message: 'Email verified. Your account is now awaiting admin approval.' });

    } catch (err) {
        console.error('[Verify OTP Error]', err);
        res.status(500).json({ error: 'Verification failed.' });
    }
});

authRouter.post('/resend-otp', async (req, res) => {
    let { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    // Normalization
    email = email.trim().toLowerCase();

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

authRouter.post('/login', async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    email = email.trim().toLowerCase();

    try {
        console.log(`🔑 [Login]: Attempting for ${email}`);
        
        // 1. Authenticate with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            console.log(`⚠️ [Login Failed]: ${email} - ${authError.message}`);
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // 2. Fetch user record from users table via supabase_uid
        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('supabase_uid', authData.user.id)
            .maybeSingle();

        if (profileError || !userProfile) {
            console.error(`❌ [Login Error]: User ${email} authenticated but profile not found in DB.`);
            return res.status(401).json({ error: 'User profile not found.' });
        }

        // 3. Guard: Check account status
        if (userProfile.status === 'pending') {
            return res.status(403).json({ error: 'Your account is pending admin approval.' });
        }

        if (userProfile.status === 'rejected') {
            // Try to find rejection reason
            const { data: regReq } = await supabase
                .from('registration_requests')
                .select('rejection_reason')
                .eq('user_id', userProfile.id)
                .eq('status', 'REJECTED')
                .maybeSingle();

            const reason = regReq?.rejection_reason ? ` Reason: ${regReq.rejection_reason}` : '';
            return res.status(403).json({ error: `Registration rejected.${reason}` });
        }

        console.log(`✅ [Login Success]: ${email} (Role: ${userProfile.role})`);

        // 4. Return session + profile
        res.json({
            success: true,
            message: 'Login successful.',
            session: authData.session,
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
        res.status(500).json({ error: 'Internal server error during login.' });
    }
});

authRouter.post('/forgot-password', async (req, res) => {
    let { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
    }

    // Normalization
    email = email.trim().toLowerCase();

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

authRouter.post('/reset-password', async (req, res) => {
    let { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
        return res.status(400).json({ error: 'Email, token, and new password are required.' });
    }
    
    // Normalization
    email = email.trim().toLowerCase();
    token = token.trim();

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

authRouter.post('/logout', async (req, res) => {
    try {
        // Explicitly clear the session from the backend client instance
        await supabase.auth.signOut();
        console.log('🚪 [Logout]: Backend session explicitly terminated.');
    } catch (err) {
        console.warn('🚪 [Logout]: Background signout warning (likely already stateless):', err.message);
    }
    
    res.json({ success: true, message: 'Logged out successfully.' });
});

app.use('/api/auth', authRouter);

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
        // Fetch the user to get their supabase_uid
        const { data: userProfile, error: fetchError } = await supabase
            .from('users')
            .select('supabase_uid, email, email_verified')
            .eq('id', id)
            .maybeSingle();

        if (fetchError) throw fetchError;

        // When APPROVING: also confirm email in Supabase Auth so signInWithPassword works
        if (status === 'approved' && userProfile?.supabase_uid) {
            // 1. Confirm email in Supabase Auth
            await supabase.auth.admin.updateUserById(userProfile.supabase_uid, {
                email_confirm: true,
            });

            // 2. Also ensure email_verified is true in public.users
            await supabase
                .from('users')
                .update({ email_verified: true })
                .eq('id', id);

            console.log(`[Approval] Email confirmed in Auth for: ${userProfile.email}`);
        }

        // Update the status in public.users
        const { data, error } = await supabase
            .from('users')
            .update({ status })
            .eq('id', id)
            .select()
            .maybeSingle();

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('[Approve User Error]:', err.message);
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
        const { data: users, error: usersError } = await supabase.from('users').select('*');
        if (usersError) {
            console.error('[Admin Stats] Users Fetch Error:', usersError.message);
            throw usersError;
        }

        const { data: projects, error: projectsError } = await supabase.from('projects').select('*');
        const { data: invoices, error: invoicesError } = await supabase.from('invoices').select('*');
        const { data: tickets, error: ticketsError } = await supabase.from('tickets').select('*');

        const stats = {
            totalRevenue: (invoices || []).filter(i => i.status === 'Paid').reduce((sum, i) => sum + Number(i.amount), 0) || 0,
            activeProjects: (projects || []).filter(p => p.status === 'In Progress').length || 0,
            activeClients: (users || []).filter(u => u.role === 'client' && u.status === 'approved').length || 0,
            pendingApprovals: (users || []).filter(u => u.status === 'pending').length || 0,
            totalUsers: (users || []).length || 0
        };

        res.json({
            stats,
            users: users || [],
            projects: projects || [],
            invoices: invoices || [],
            tickets: tickets || []
        });
    } catch (err) {
        console.error('[Admin Stats Error]', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ═══════════════════════════════════════════════════════════════
// SERVER START
// ═══════════════════════════════════════════════════════════════

// Startup Diagnostics
console.log('🚀 [Server]: Starting Code Vertex Backend...');
console.log(`🌐 [Environment]: ${process.env.NODE_ENV || 'development'}`);
console.log(`📡 [Supabase URL]: ${process.env.SUPABASE_URL ? process.env.SUPABASE_URL.replace(/(https:\/\/).*(.supabase.co)/, '$1***$2') : 'NOT CONFIGURED'}`);

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    server.listen(PORT, () => {
        console.log(`\n✅ Code Vertex Platform Server running on port ${PORT}`);
        console.log(`   Auth: Supabase Auth + OTP (Zoho SMTP)`);
        console.log(`   Socket: Active and listening`);
        console.log(`   Endpoints: /api/auth/{signup,login,verify-otp,resend-otp,logout}\n`);
    });
}

// Export the Express API for Vercel serverless integration
// Export the Server for non-serverless environments and App for Vercel
module.exports = process.env.NODE_ENV === 'production' ? app : server;
