const supabase = require('./db');

/**
 * UTILITY SCRIPT: Insert Active Team Accounts
 * Bypasses OTP and Admin Approval to insert pre-verified "team" members.
 */
async function createPreVerifiedAccounts() {
    const defaultPassword = 'fake_password_for_hasher'; // Since we are creating them via DB first

    const users = [
        {
            email: 'wajiha@codevertex.solutions',
            name: 'Wajiha Zehra',
            password: 'Wajiha@1514',
            role: 'team',
            status: 'approved',
            email_verified: true
        },
        {
            email: 'rehan@codevertex.solutions',
            name: 'Muhammad Rehan Hussain',
            password: 'Rehan@1514',
            role: 'team',
            status: 'approved',
            email_verified: true
        }
    ];

    console.log('🚀 Creating Auto-Verified Team Accounts...\n');

    for (const userData of users) {
        try {
            const email = userData.email.toLowerCase();
            console.log(`Processing: ${email}`);

            // 1. Create in Supabase Auth bypassing email confirmation
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: email,
                password: userData.password,
                email_confirm: true // Bypass OTP requirement
            });

            if (authError) {
                if (authError.message.includes('already exists')) {
                    console.log(`   ⚠️ Auth User already exists. Fetching UID...`);
                } else {
                    console.error(`   ❌ Auth Error for ${email}:`, authError.message);
                    continue;
                }
            } else {
                 console.log(`   ✅ Auth user created successfully.`);
            }

            // Fallback to fetch UUID if we hit the 'already exists' warning.
            let uid = authData?.user?.id;
            if (!uid) {
                const { data: listAllUsers } = await supabase.auth.admin.listUsers();
                const matchedUser = listAllUsers.users.find(u => u.email === email);
                if (matchedUser) uid = matchedUser.id;
            }

            if (!uid) {
                 console.error(`   ❌ Could not retrieve Auth UID to attach profile.`);
                 continue;
            }

            // 2. Upsert profile into public.users bypassing Admin Approval (status: 'approved')
            const { error: dbError } = await supabase
                .from('users')
                .upsert({
                    supabase_uid: uid,
                    email: email,
                    name: userData.name,
                    role: userData.role,
                    status: userData.status,
                    email_verified: userData.email_verified
                }, { onConflict: 'email' });

            if (dbError) {
                console.error(`   ❌ Profile Upsert Error:`, dbError.message);
            } else {
                console.log(`   ✅ Profile successfully inserted/updated as APPROVED and VERIFIED.`);
            }

            console.log(`--- Finished for ${email} ---\n`);

        } catch (err) {
            console.error(`   🛑 Unexpected error processing ${userData.email}:`, err.message);
        }
    }
}

createPreVerifiedAccounts();
