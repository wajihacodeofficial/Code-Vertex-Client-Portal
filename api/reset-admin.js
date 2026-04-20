const supabase = require('./db');
require('dotenv').config();

/**
 * Resets the password for the admin account in Supabase Auth.
 * Usage: node api/reset-admin.js
 */
async function resetAdminPassword() {
    const email = 'admin@codevertex.solutions';
    const newPassword = 'AdminCodey@110';

    console.log(`\n🔄 Resetting password for: ${email}`);

    // 1. Find user in auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
        console.error('❌ Error listing users:', listError.message);
        return;
    }

    const adminUser = users.find(u => u.email === email);

    if (!adminUser) {
        console.log(`❌ Admin user ${email} not found in Supabase Auth.`);
        return;
    }

    // 2. Update password in Supabase Auth
    const { error: updateError } = await supabase.auth.admin.updateUserById(
        adminUser.id,
        { password: newPassword, email_confirm: true }
    );

    if (updateError) {
        console.error('❌ Error updating password in Auth:', updateError.message);
        return;
    }

    console.log(`✅ Password successfully reset in Supabase Auth.`);

    // 3. Update public.users table (including password_hash for legacy compatibility)
    const { error: dbError } = await supabase
        .from('users')
        .update({ 
            password_hash: newPassword,
            status: 'approved',
            email_verified: true 
        })
        .eq('email', email);

    if (dbError) {
        console.error('⚠️  Warning: Failed to update public.users table:', dbError.message);
    } else {
        console.log(`✅ public.users table synchronized.`);
    }

    console.log(`\n✨ Done! Admin is ready.`);
}

resetAdminPassword();
