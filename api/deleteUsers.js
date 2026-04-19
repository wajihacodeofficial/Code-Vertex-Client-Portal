const supabase = require('./db');

/**
 * TARGETED USER DELETION SCRIPT
 * Removes users from BOTH public.users and Supabase Auth
 */
const emailsToDelete = [
    'wajiha@codevertex.solutions',
    'rehan@codevertex.solutions'
];

async function runTargetedCleanup() {
    console.log('🚀 Starting Targeted User Cleanup...\n');

    for (const email of emailsToDelete) {
        try {
            const lowerEmail = email.toLowerCase();
            console.log(`🔍 Processing: ${lowerEmail}`);

            // 1. Find user in the database to get their supabase_uid
            const { data: user, error: fetchErr } = await supabase
                .from('users')
                .select('id, name, supabase_uid')
                .eq('email', lowerEmail)
                .maybeSingle();

            if (fetchErr) {
                console.error(`   ❌ DB Fetch Error for ${lowerEmail}:`, fetchErr.message);
                continue;
            }

            if (!user) {
                console.warn(`   ⚠️ User not found in database. Checking Supabase Auth directly...`);
                // Note: Without the UID from the DB, we'd need to list all auth users to find the email
            } else {
                console.log(`   👤 Found: ${user.name} (UUID: ${user.id})`);
            }

            // 2. Delete from Supabase Auth
            // If we found them in the DB, use that UID. If not, we try to find them in Auth by listing.
            let authUid = user?.supabase_uid;

            if (!authUid) {
                const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
                if (!listError) {
                    const authMatch = authUsers.users.find(u => u.email === lowerEmail);
                    if (authMatch) authUid = authMatch.id;
                }
            }

            if (authUid) {
                const { error: authErr } = await supabase.auth.admin.deleteUser(authUid);
                if (authErr) {
                    console.warn(`   ⚠️ Auth Delete Warning: ${authErr.message}`);
                } else {
                    console.log(`   ✅ Successfully removed from Supabase Auth.`);
                }
            } else {
                console.log(`   ℹ️ No matching account found in Supabase Auth.`);
            }

            // 3. Delete from public.users profile table
            if (user) {
                const { error: dbErr } = await supabase
                    .from('users')
                    .delete()
                    .eq('id', user.id);

                if (dbErr) {
                    console.error(`   ❌ DB Delete Error:`, dbErr.message);
                } else {
                    console.log(`   ✅ Successfully removed from users table.`);
                }
            }

            console.log(`--- Done with ${lowerEmail} ---\n`);
        } catch (err) {
            console.error(`   🛑 Unexpected error processing ${email}:`, err.message);
        }
    }

    console.log('✨ Cleanup process finished.');
}

runTargetedCleanup();
