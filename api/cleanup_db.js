const supabase = require('./db');

async function cleanup() {
    console.log('🚀 Starting Comprehensive Database Purge...');

    try {
        // 1. Clear all data tables first to avoid FK constraints issues
        const dataTables = [
            'tickets',
            'invoices',
            'change_requests',
            'payment_milestones',
            'project_financials',
            'scope_features',
            'project_scope',
            'project_tech_stack',
            'projects',
            'otp_verifications'
        ];

        for (const table of dataTables) {
            console.log(`🧹 Clearing table: ${table}...`);
            const { error } = await supabase
                .from(table)
                .delete()
                .filter('id', 'neq', '00000000-0000-0000-0000-000000000000'); // Deletes all rows
            
            if (error) {
                console.warn(`⚠️ Warning clearing ${table}: ${error.message}`);
            } else {
                console.log(`✅ ${table} cleared.`);
            }
        }

        // 2. Fetch all users to filter out the system admin
        const { data: users, error: fetchErr } = await supabase
            .from('users')
            .select('id, email, supabase_uid');
            
        if (fetchErr) throw fetchErr;

        console.log(`\n👥 Processing ${users.length} users...`);

        for (const user of users) {
            // Keep the system admin
            if (user.email === 'admin@codevertex.solutions') {
                console.log(`⭐ Keeping System Admin: ${user.email}`);
                continue;
            }

            console.log(`🗑️ Deleting user and profile: ${user.email}`);
            
            // Delete from Supabase Auth if applicable
            if (user.supabase_uid) {
                const { error: authErr } = await supabase.auth.admin.deleteUser(user.supabase_uid);
                if (authErr) console.warn(`   Auth Delete Warning: ${authErr.message}`);
            }
            
            // Delete from public.users
            const { error: dbErr } = await supabase
                .from('users')
                .delete()
                .eq('id', user.id);
                
            if (dbErr) console.warn(`   Profile Delete Warning: ${dbErr.message}`);
        }

        console.log('\n✨ Database Cleanup Complete! Only System Admin remains.');
    } catch (err) {
        console.error('\n❌ Cleanup Failed:', err.message);
    }
}

cleanup();
