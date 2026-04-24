const supabase = require('./db');

/**
 * Creates pre-approved team accounts in both Supabase Auth and public.users.
 * Run this script once using: node api/createTeamAccounts.js
 */
const teamAccounts = [
    {
        name: 'Wajiha',
        email: 'wajiha@codevertex.solutions',
        password: 'CodeVertex@2024', // Change after first login
        role: 'team',
    },
    {
        name: 'Rehan',
        email: 'rehan@codevertex.solutions',
        password: 'CodeVertex@2024', // Change after first login
        role: 'team',
    },
];

async function createTeamAccount({ name, email, password, role }) {
    const lowerEmail = email.toLowerCase();
    console.log(`\n🔄 Processing: ${lowerEmail}`);

    // 1. Check if already exists in public.users
    const { data: existing } = await supabase
        .from('users')
        .select('id, status, email_verified')
        .eq('email', lowerEmail)
        .maybeSingle();

    if (existing) {
        console.log(`   ⚠️  Already in DB (status: ${existing.status}). Ensuring approved...`);
        // Ensure they are approved in DB
        await supabase.from('users').update({ status: 'approved', email_verified: true }).eq('email', lowerEmail);

        // Also ensure they are confirmed in Supabase Auth
        const { data: authList } = await supabase.auth.admin.listUsers();
        const authUser = authList?.users?.find(u => u.email === lowerEmail);
        if (authUser) {
            await supabase.auth.admin.updateUserById(authUser.id, { email_confirm: true });
            console.log(`   ✅ Auth + DB status synchronized to approved.`);
        }
        return;
    }

    // 2. Create in Supabase Auth with email pre-confirmed
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: lowerEmail,
        password,
        email_confirm: true, // Pre-confirm so they can login immediately
        user_metadata: { name, role },
    });

    if (authError) {
        if (authError.message.includes('already been registered')) {
            console.log(`   ⚠️  Already in Supabase Auth. Syncing...`);
            const { data: authList } = await supabase.auth.admin.listUsers();
            const authUser = authList?.users?.find(u => u.email === lowerEmail);
            if (authUser) {
                await supabase.auth.admin.updateUserById(authUser.id, { email_confirm: true });
                // Try to insert into public.users
                await supabase.from('users').upsert({
                    supabase_uid: authUser.id,
                    email: lowerEmail,
                    name,
                    role,
                    status: 'approved',
                    email_verified: true,
                    password_hash: password, // Store password to keep legacy DB in sync
                }, { onConflict: 'email' });
                console.log(`   ✅ Synchronized (Auth existed, DB upserted).`);
            }
        } else {
            console.error(`   ❌ Auth Error: ${authError.message}`);
        }
        return;
    }

    console.log(`   ✅ Created in Supabase Auth (UID: ${authData.user.id})`);

    // 3. Insert into public.users as approved team member
    const { error: dbError } = await supabase.from('users').insert({
        supabase_uid: authData.user.id,
        email: lowerEmail,
        name,
        role,
        status: 'approved',
        email_verified: true,
        password_hash: 'SUPABASE_AUTH',
    });

    if (dbError) {
        console.error(`   ❌ DB Insert Error: ${dbError.message}`);
        // Rollback auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
    } else {
        console.log(`   ✅ Inserted into public.users as approved team member.`);
        console.log(`   🔑 Login: ${lowerEmail} / CodeVertex@2024`);
    }
}

async function main() {
    console.log('🚀 Creating Team Accounts...');
    for (const account of teamAccounts) {
        await createTeamAccount(account);
    }
    console.log('\n✨ Done! Team accounts are ready to login.');
    console.log('⚠️  Reminder: Ask team members to change their password after first login.\n');
}

main();
