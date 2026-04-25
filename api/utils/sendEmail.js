const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an email using Resend.
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email body (HTML)
 */
async function sendEmail(to, subject, html) {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.warn('⚠️  RESEND_API_KEY is not set. Logging email to console instead.');
            console.log(`\n📧  [EMAIL LOG] To: ${to}\nSubject: ${subject}\nBody: ${html}\n`);
            return;
        }

        const { data, error } = await resend.emails.send({
            from: process.env.MAIL_FROM || 'Code Vertex <onboarding@resend.dev>',
            to: [to],
            subject: subject,
            html: html,
        });

        if (error) {
            throw error;
        }

        return data;
    } catch (err) {
        console.error('❌  [Resend Error]:', err.message);
        throw new Error('Failed to send email: ' + err.message);
    }
}

module.exports = { sendEmail };
