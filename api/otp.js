const supabase = require('./db');
const { sendEmail } = require('./utils/sendEmail');
const { generateOtp } = require('./utils/generateOtp');
require('dotenv').config();

/**
 * Stores OTP in the database and sends it via Resend.
 * @param {string} email
 * @param {object} metadata - Optional registration metadata
 */
async function sendOTP(email, metadata = null) {
    const normalizedEmail = email.trim().toLowerCase();
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 1. Clear old OTPs
    await supabase
        .from('otp_verifications')
        .update({ used: true })
        .eq('email', normalizedEmail)
        .eq('used', false);

    // 2. Insert new OTP
    const { error } = await supabase
        .from('otp_verifications')
        .insert({
            email: normalizedEmail,
            otp_code: otp,
            expires_at: expiresAt.toISOString(),
            used: false,
            metadata: metadata
        });

    if (error) throw new Error('Failed to store OTP: ' + error.message);

    // 3. Send Email
    const html = `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #22c55e; text-align: center;">Verification Code</h2>
            <p>Hello,</p>
            <p>Your verification code for Code Vertex is:</p>
            <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333; border-radius: 5px; margin: 20px 0;">
                ${otp}
            </div>
            <p style="color: #666; font-size: 12px; text-align: center;">This code expires in 10 minutes. Do not share it with anyone.</p>
        </div>
    `;

    await sendEmail(normalizedEmail, 'Your Verification Code - Code Vertex', html);
    console.log(`✅ [OTP]: Code ${otp} sent to ${normalizedEmail}`);
}

/**
 * Verifies OTP and returns metadata.
 */
async function verifyOTP(email, otpCode) {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = otpCode.trim();

    const { data: records, error } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('email', normalizedEmail)
        .eq('otp_code', normalizedOtp)
        .eq('used', false)
        .order('created_at', { ascending: false })
        .limit(1);

    if (error || !records || records.length === 0) {
        return { valid: false, error: 'Invalid or expired OTP' };
    }

    const record = records[0];

    if (new Date() > new Date(record.expires_at)) {
        return { valid: false, error: 'OTP has expired' };
    }

    // Mark as used
    await supabase
        .from('otp_verifications')
        .update({ used: true })
        .eq('id', record.id);

    return { valid: true, metadata: record.metadata };
}

/**
 * Sends a password reset link.
 */
async function sendPasswordResetLink(email) {
    const normalizedEmail = email.trim().toLowerCase();
    const token = generateOtp();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await supabase
        .from('otp_verifications')
        .update({ used: true })
        .eq('email', normalizedEmail)
        .eq('used', false);

    const { error } = await supabase
        .from('otp_verifications')
        .insert({
            email: normalizedEmail,
            otp_code: token,
            expires_at: expiresAt.toISOString(),
            used: false
        });

    if (error) throw error;

    const frontendUrl = process.env.FRONTEND_URL || 'https://portal.codevertex.solutions';
    const resetLink = `${frontendUrl}/reset-password?token=${token}&email=${encodeURIComponent(normalizedEmail)}`;

    const html = `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #22c55e; text-align: center;">Password Reset</h2>
            <p>You requested to reset your password. Click the button below to proceed:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="background-color: #22c55e; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </div>
            <p style="color: #666; font-size: 12px; text-align: center;">This link expires in 15 minutes. If you did not request this, please ignore this email.</p>
        </div>
    `;

    await sendEmail(normalizedEmail, 'Password Reset - Code Vertex', html);
}

module.exports = { sendOTP, verifyOTP, sendPasswordResetLink };
