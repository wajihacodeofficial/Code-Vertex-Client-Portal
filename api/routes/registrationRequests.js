const express = require('express');
const router = express.Router();
const supabase = require('../db');
const nodemailer = require('nodemailer');

// ─── SMTP Transporter (Same as in otp.js) ───────────────────────────────────
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.zoho.com',
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE !== 'false',
    auth: {
        user: process.env.SMTP_USER || process.env.ZOHO_EMAIL,
        pass: process.env.SMTP_PASS || process.env.ZOHO_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

/**
 * POST /api/registration-requests/submit
 * Create a new registration request and notify admin.
 */
router.post('/submit', async (req, res) => {
    const { userId, role, documentUrl } = req.body;

    if (!userId || !role) {
        return res.status(400).json({ error: 'User ID and role are required.' });
    }

    try {
        // 1. Create entry in registration_requests table
        const { data, error } = await supabase
            .from('registration_requests')
            .insert({
                user_id: userId,
                role: role,
                document_url: documentUrl,
                status: 'PENDING'
            })
            .select()
            .single();

        if (error) throw error;

        // 2. Set user status to pending in users table
        const { error: userError } = await supabase
            .from('users')
            .update({ status: 'pending' })
            .eq('id', userId);

        if (userError) throw userError;

        // 3. Emit Socket.io event to notify admin
        const io = req.app.get('io');
        if (io) {
            io.emit('new_registration_request', data);
        }

        res.status(201).json({ message: 'Registration request submitted successfully.', data });
    } catch (err) {
        console.error('[Registration Submit Error]:', err.message);
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/registration-requests
 * Fetch all pending registration requests for admin.
 */
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('registration_requests')
            .select(`
                *,
                users (
                    name,
                    email,
                    phone,
                    role
                )
            `)
            .eq('status', 'PENDING')
            .order('created_at', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        console.error('[Fetch Requests Error]:', err.message);
        res.status(500).json({ error: err.message });
    }
});

/**
 * PATCH /api/registration-requests/:id/review
 * Approve or reject a registration request.
 * Body: { action: "APPROVE" | "REJECT", rejection_reason?: string }
 */
router.patch('/:id/review', async (req, res) => {
    const { id } = req.params;
    const { action, rejection_reason } = req.body;

    if (!['APPROVE', 'REJECT'].includes(action)) {
        return res.status(400).json({ error: 'Invalid action. Must be APPROVE or REJECT.' });
    }

    if (action === 'REJECT' && !rejection_reason) {
        return res.status(400).json({ error: 'Rejection reason is required for REJECT action.' });
    }

    try {
        // 1. Get request details
        const { data: request, error: fetchError } = await supabase
            .from('registration_requests')
            .select('*, users(email, name, supabase_uid)')
            .eq('id', id)
            .single();

        if (fetchError || !request) {
            return res.status(404).json({ error: 'Registration request not found.' });
        }

        const userEmail = request.users.email;
        const userName = request.users.name;
        const targetStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
        const userStatus = action === 'APPROVE' ? 'approved' : 'rejected';

        // 2. Update registration_requests table
        const { error: rrError } = await supabase
            .from('registration_requests')
            .update({ 
                status: targetStatus, 
                rejection_reason: action === 'REJECT' ? rejection_reason : null 
            })
            .eq('id', id);

        if (rrError) throw rrError;

        // 3. Update users table status
        const { error: userError } = await supabase
            .from('users')
            .update({ status: userStatus })
            .eq('id', request.user_id);

        if (userError) throw userError;

        // 4. Send Email Notification
        const subject = action === 'APPROVE' ? 'Account Approved - Code Vertex' : 'Account Registration Update - Code Vertex';
        const html = action === 'APPROVE'
            ? `<div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #22c55e;">Congratulations!</h2>
                <p>Hello <strong>${userName}</strong>,</p>
                <p>Your registration request for the Code Vertex Client Portal has been <strong>APPROVED</strong>.</p>
                <p>You can now log in to your dashboard using your registered email and password.</p>
                <a href="${process.env.FRONTEND_URL || 'https://portal.codevertex.solutions'}/login" style="display: inline-block; padding: 10px 20px; background-color: #22c55e; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">Login Now</a>
               </div>`
            : `<div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #ef4444;">Registration Update</h2>
                <p>Hello <strong>${userName}</strong>,</p>
                <p>We regret to inform you that your registration request has been <strong>REJECTED</strong>.</p>
                <p><strong>Reason:</strong> ${rejection_reason}</p>
                <p>If you believe this is a mistake, please contact our support team.</p>
               </div>`;

        await transporter.sendMail({
            from: `"Code Vertex Admin" <${process.env.SMTP_USER}>`,
            to: userEmail,
            subject: subject,
            html: html
        }).catch(err => console.error('Approval/Rejection Email Error:', err.message));

        // 5. Emit Socket.io event
        const io = req.app.get('io');
        if (io) {
            const eventName = action === 'APPROVE' ? 'registration_approved' : 'registration_rejected';
            io.emit(eventName, { userId: request.user_id, email: userEmail });
        }

        console.log(`📢 [Admin Decision]: ${action} for ${userEmail}`);
        res.json({ success: true, message: `Registration ${targetStatus.toLowerCase()} successfully.` });

    } catch (err) {
        console.error('[Admin Decision Error]:', err.message);
        res.status(500).json({ error: 'Failed to process decision.' });
    }
});

module.exports = router;
