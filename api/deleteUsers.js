const supabase = require('./db');

/**
 * MASS DELETION SCRIPT
 * Removes ALL users from both public.users and Supabase Auth
 * EXCEPT the specified whitelist.
 */
const emailsToKeep = [
    'admin@codevertex.solutions',
    'rehan@codevertex.solutions'
];

async function runCleanup() {
    console.log('🚀 Starting Mass User Cleanup...\n');
    console.log(`Whitelist (WILL NOT BE DELETED): ${emailsToKeep.join(', ')}\n`);

    try {
        // 1. Fetch ALL users from the database
        const { data: dbUsers, error: fetchErr } = await supabase
            .from('users')
            .select('id, email, supabase_uid, name');

        if (fetchErr) {
            console.error(`❌ DB Fetch Error:`, fetchErr.message);
            return;
        }

        console.log(`Found ${dbUsers.length} users in the database.\n`);

        for (const user of dbUsers) {
            const lowerEmail = user.email.toLowerCase();

            if (emailsToKeep.includes(lowerEmail)) {
                console.log(`✅ Keeping: ${user.name} (${lowerEmail})`);
                continue;
            }

            console.log(`🗑️ Processing Deletion for: ${user.name} (${lowerEmail})`);

            // 2. Delete from Supabase Auth
            let authUid = user.supabase_uid;

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
                    console.log(`   ✅ Removed from Supabase Auth.`);
                }
            } else {
                console.log(`   ℹ️ No matching account found in Supabase Auth.`);
            }

            // 3. Delete from public.users profile table
            const { error: dbDeleteErr } = await supabase
                .from('users')
                .delete()
                .eq('id', user.id);

            if (dbDeleteErr) {
                console.error(`   ❌ DB Delete Error:`, dbDeleteErr.message);
            } else {
                console.log(`   ✅ Removed from users table.`);
            }
            console.log('---');
        }

    } catch (err) {
        console.error(`🛑 Unexpected error during cleanup:`, err.message);
    }

    console.log('✨ Mass cleanup process finished.');
}

runCleanup();
