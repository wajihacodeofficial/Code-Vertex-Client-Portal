const nodemailer = require('nodemailer');
const supabase = require('./db');
require('dotenv').config();

// ─── SMTP Transporter ───────────────────────────────────
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.zoho.com',
    port: parseInt(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE !== 'false', // Defaults to true for 465
    auth: {
        user: process.env.SMTP_USER || process.env.ZOHO_EMAIL,
        pass: process.env.SMTP_PASS || process.env.ZOHO_PASSWORD,
    },
});

/**
 * Generates a cryptographically safe 6-digit OTP string.
 */
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Stores OTP in the database and sends it via Zoho SMTP.
 * Invalidates any previous unused OTPs for the same email first.
 * @param {string} email
 * @returns {Promise<void>}
 */
async function sendOTP(email) {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Invalidate any previous OTPs for this email
    await supabase
        .from('otp_verifications')
        .update({ used: true })
        .eq('email', email.toLowerCase())
        .eq('used', false);

    // Insert fresh OTP
    const { error: insertError } = await supabase
        .from('otp_verifications')
        .insert({
            email: email.toLowerCase(),
            otp_code: otp,
            expires_at: expiresAt.toISOString(),
            used: false,
        });

    if (insertError) {
        throw new Error('Failed to store OTP: ' + insertError.message);
    }

    // Send OTP via SMTP
    const senderName = process.env.MAIL_FROM || process.env.ZOHO_FROM_NAME || 'Code Vertex';
    const senderEmail = process.env.SMTP_USER || process.env.ZOHO_EMAIL;

    await transporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: email,
        subject: 'Your Code Vertex Verification Code',
        html: `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0f0f0f; border-radius: 16px; overflow: hidden; border: 1px solid #1f1f1f;">
                <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 32px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">Code Vertex</h1>
                    <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px;">Email Verification</p>
                </div>
                <div style="padding: 40px 32px; text-align: center;">
                    <p style="color: #a0a0a0; font-size: 15px; margin: 0 0 28px; line-height: 1.6;">
                        Use the code below to verify your email address.<br/>
                        This code expires in <strong style="color: #22c55e;">5 minutes</strong>.
                    </p>
                    <div style="background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px; padding: 28px; margin: 0 auto 28px; display: inline-block; min-width: 200px;">
                        <span style="font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #22c55e; font-family: 'Courier New', monospace;">${otp}</span>
                    </div>
                    <p style="color: #666; font-size: 12px; margin: 0; line-height: 1.6;">
                        If you didn't request this, please ignore this email.<br/>
                        Never share this code with anyone.
                    </p>
                </div>
                <div style="padding: 20px 32px; border-top: 1px solid #1f1f1f; text-align: center;">
                    <p style="color: #444; font-size: 11px; margin: 0;">© ${new Date().getFullYear()} Code Vertex · <a href="https://codevertex.solutions" style="color: #22c55e; text-decoration: none;">codevertex.solutions</a></p>
                </div>
            </div>
        `,
    });
}

/**
 * Validates OTP for a given email.
 * @param {string} email
 * @param {string} otpCode
 * @returns {Promise<{ valid: boolean, error?: string }>}
 */
async function verifyOTP(email, otpCode) {
    const { data: records, error } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('otp_code', otpCode.trim())
        .eq('used', false)
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) {
        return { valid: false, error: 'Database error during OTP check' };
    }

    if (!records || records.length === 0) {
        return { valid: false, error: 'Invalid or expired OTP' };
    }

    const record = records[0];

    // Check expiry
    if (new Date() > new Date(record.expires_at)) {
        return { valid: false, error: 'OTP has expired. Please request a new one.' };
    }

    // Mark OTP as used
    await supabase
        .from('otp_verifications')
        .update({ used: true })
        .eq('id', record.id);

    return { valid: true };
}

module.exports = { sendOTP, verifyOTP };
