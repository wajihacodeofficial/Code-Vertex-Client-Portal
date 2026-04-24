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
                    phone
                )
            `)
            .eq('status', 'PENDING')
            .order('created_at', { ascending: false });

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
 */
router.patch('/:id/review', async (req, res) => {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be APPROVED or REJECTED.' });
    }

    if (status === 'REJECTED' && !rejectionReason) {
        return res.status(400).json({ error: 'Rejection reason is required.' });
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

        // 2. Update request status
        const { error: updateError } = await supabase
            .from('registration_requests')
            .update({ status, rejection_reason: rejectionReason || null })
            .eq('id', id);

        if (updateError) throw updateError;

        // 3. Update user status in users table
        const userStatus = status.toLowerCase(); // 'approved' or 'rejected'
        const { error: userUpdateError } = await supabase
            .from('users')
            .update({ status: userStatus })
            .eq('id', request.user_id);

        if (userUpdateError) throw userUpdateError;

        // 4. If approved, confirm email in Supabase Auth to allow login
        if (status === 'APPROVED' && request.users.supabase_uid) {
            await supabase.auth.admin.updateUserById(request.users.supabase_uid, {
                email_confirm: true
            });
        }

        // 5. Send Email
        const emailSubject = status === 'APPROVED' ? 'Account Approved - Code Vertex' : 'Account Rejected - Code Vertex';
        const emailContent = status === 'APPROVED' 
            ? `<p>Hello ${userName},</p><p>Your account has been approved. You can now log in to the portal.</p>`
            : `<p>Hello ${userName},</p><p>Your registration was rejected for the following reason:</p><p><strong>${rejectionReason}</strong></p><p>Please re-apply with the correct details.</p>`;

        try {
            await transporter.sendMail({
                from: `"Code Vertex Admin" <${process.env.SMTP_USER || process.env.ZOHO_EMAIL}>`,
                to: userEmail,
                subject: emailSubject,
                html: emailContent
            });
        } catch (mailErr) {
            console.error('[Mail Error]:', mailErr.message);
            // Don't fail the whole request if mail fails, but log it
        }

        // 6. Emit Socket event to notify user (if they are connected)
        const io = req.app.get('io');
        if (io) {
            io.emit('registration_update', { userId: request.user_id, status });
        }

        res.json({ message: `Registration ${status.toLowerCase()} successfully.` });
    } catch (err) {
        console.error('[Review Request Error]:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
