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

    // 3. Update public.users table
    // Fetch user by email to get their internal DB ID
    const { data: dbUser, error: findError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

    if (!dbUser) {
        console.log(`⚠️  Admin not found in public.users. Creating profile...`);
        const { error: insertError } = await supabase
            .from('users')
            .insert({
                supabase_uid: adminUser.id,
                email: email,
                name: 'System Admin',
                role: 'admin',
                status: 'approved',
                email_verified: true,
                password_hash: 'SUPABASE_AUTH'
            });
        
        if (insertError) {
            console.error('❌ Failed to create admin profile:', insertError.message);
        } else {
            console.log('✅ Admin profile created in public.users.');
        }
    } else {
        const { error: dbError } = await supabase
            .from('users')
            .update({ 
                supabase_uid: adminUser.id,
                status: 'approved',
                email_verified: true,
                password_hash: 'SUPABASE_AUTH' 
            })
            .eq('id', dbUser.id);

        if (dbError) {
            console.error('❌ Failed to update public.users table:', dbError.message);
        } else {
            console.log(`✅ public.users table synchronized.`);
        }
    }

    console.log(`\n✨ Done! Admin is ready.`);
}

resetAdminPassword();
