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
        console.log(`💡 Try creating it first using a signup or custom script.`);
        return;
    }

    // 2. Update password in Supabase Auth
    const { data: updated, error: updateError } = await supabase.auth.admin.updateUserById(
        adminUser.id,
        { password: newPassword, email_confirm: true }
    );

    if (updateError) {
        console.error('❌ Error updating password in Auth:', updateError.message);
        return;
    }

    console.log(`✅ Password successfully reset in Supabase Auth.`);

    // 3. Ensure the public.users table is also updated (though login only checks Auth)
    const { error: dbError } = await supabase
        .from('users')
        .update({ 
            password_hash: newPassword, // Note: The app uses Auth, but we keep this for consistency if needed
            status: 'approved',
            email_verified: true 
        })
        .eq('email', email);

    if (dbError) {
        console.error('⚠️  Warning: Failed to update public.users table (not critical):', dbError.message);
    } else {
        console.log(`✅ public.users table synchronized to 'approved'.`);
    }

    console.log(`\n✨ Done! You can now login with:`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${newPassword}\n`);
}

resetAdminPassword();
