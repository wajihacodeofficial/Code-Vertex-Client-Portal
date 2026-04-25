const supabase = require('./db');
require('dotenv').config();

/**
 * ONE-TIME SETUP SCRIPT
 * Properly creates the admin account in Supabase Auth and links it to the users table.
 * Run with: node api/setup-admin.js
 */
async function setupAdmin() {
    const adminEmail = 'admin@codevertex.solutions';
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'AdminCodey@110';

    console.log('🚀 Starting Admin Setup...');

    try {
        // 1. Check if user already exists in Auth
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;

        let authUser = users.find(u => u.email === adminEmail);

        if (!authUser) {
            console.log(`👤 Creating admin in Supabase Auth: ${adminEmail}`);
            const { data, error: createError } = await supabase.auth.admin.createUser({
                email: adminEmail,
                password: adminPassword,
                email_confirm: true,
                user_metadata: { name: 'System Admin', role: 'admin' }
            });

            if (createError) throw createError;
            authUser = data.user;
            console.log('✅ Admin created in Supabase Auth.');
        } else {
            console.log('ℹ️ Admin already exists in Supabase Auth.');
        }

        // 2. Link or create profile in public.users
        console.log('🔗 Linking Auth user to public.users table...');
        
        const { data: existingProfile } = await supabase
            .from('users')
            .select('id')
            .eq('email', adminEmail)
            .maybeSingle();

        if (existingProfile) {
            const { error: updateError } = await supabase
                .from('users')
                .update({ 
                    supabase_uid: authUser.id,
                    status: 'approved',
                    email_verified: true,
                    role: 'admin'
                })
                .eq('id', existingProfile.id);

            if (updateError) throw updateError;
            console.log('✅ Existing admin profile updated and linked.');
        } else {
            const { error: insertError } = await supabase
                .from('users')
                .insert({
                    supabase_uid: authUser.id,
                    email: adminEmail,
                    name: 'System Admin',
                    role: 'admin',
                    status: 'approved',
                    email_verified: true,
                    password_hash: 'SUPABASE_AUTH'
                });

            if (insertError) throw insertError;
            console.log('✅ New admin profile created and linked.');
        }

        console.log('\n✨ Admin setup complete! You can now login with:');
        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔑 Password: ${adminPassword}`);

    } catch (err) {
        console.error('\n❌ Admin setup failed:', err.message);
    }
}

setupAdmin();
