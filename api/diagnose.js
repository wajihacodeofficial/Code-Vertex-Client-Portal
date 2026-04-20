const supabase = require('./db');
require('dotenv').config();

async function diagnose() {
    console.log('🔍 Starting System Diagnosis...\n');
    
    // 1. Check Supabase Connection
    const supabaseUrl = process.env.SUPABASE_URL;
    console.log(`📡 Supabase URL: ${supabaseUrl ? supabaseUrl.replace(/(https:\/\/).*(.supabase.co)/, '$1***$2') : 'MISSING'}`);
    
    try {
        // 2. Audit Supabase Auth
        console.log('\n🔐 Auditing Supabase Auth Users...');
        const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
            console.error('❌ Failed to list Supabase Auth users:', authError.message);
        } else {
            console.log(`✅ Found ${authUsers.length} users in Supabase Auth.`);
        }

        // 3. Audit Public Users Table
        console.log('\n👥 Auditing public.users Table...');
        const { data: dbUsers, error: dbError } = await supabase
            .from('users')
            .select('id, email, role, status, supabase_uid');
        
        if (dbError) {
            console.error('❌ Failed to list public.users:', dbError.message);
        } else {
            console.log(`✅ Found ${dbUsers.length} users in public.users.`);
            
            // Check for pending approvals
            const pending = dbUsers.filter(u => u.status === 'pending');
            console.log(`🕒 Pending Approvals: ${pending.length}`);
            pending.forEach(u => console.log(`   - ${u.email} (${u.role})`));
        }

        // 4. Synchronization Check
        console.log('\n🔄 Synchronization Analysis:');
        
        if (authUsers && dbUsers) {
            const authEmails = authUsers.map(u => u.email.toLowerCase());
            const dbEmails = dbUsers.map(u => u.email.toLowerCase());
            
            // Users in Auth but NOT in DB
            const orphansInAuth = authUsers.filter(au => !dbEmails.includes(au.email.toLowerCase()));
            if (orphansInAuth.length > 0) {
                console.log(`⚠️  ${orphansInAuth.length} users exist in Auth but MISSING from public.users:`);
                orphansInAuth.forEach(u => console.log(`   - ${u.email}`));
            } else {
                console.log('✅ No orphans found in Supabase Auth.');
            }

            // Users in DB but NOT in Auth
            const orphansInDb = dbUsers.filter(du => !authEmails.includes(du.email.toLowerCase()));
            if (orphansInDb.length > 0) {
                console.log(`⚠️  ${orphansInDb.length} users exist in DB but MISSING from Supabase Auth:`);
                orphansInDb.forEach(u => console.log(`   - ${u.email}`));
            } else {
                console.log('✅ No orphans found in public.users.');
            }
            
            // Admin Check
            const adminEmail = 'admin@codevertex.solutions';
            const adminInAuth = authUsers.find(u => u.email.toLowerCase() === adminEmail);
            const adminInDb = dbUsers.find(u => u.email.toLowerCase() === adminEmail);
            
            console.log(`\n⭐ Admin State (${adminEmail}):`);
            console.log(`   - In Auth: ${adminInAuth ? '✅ (UID: ' + adminInAuth.id + ')' : '❌ MISSING'}`);
            console.log(`   - In DB:   ${adminInDb ? '✅ (Status: ' + adminInDb.status + ')' : '❌ MISSING'}`);
            
            if (adminInAuth && adminInDb && adminInDb.supabase_uid !== adminInAuth.id) {
                console.log('❌ CRITICAL: Admin supabase_uid mismatch between Auth and DB!');
            }
        }

    } catch (err) {
        console.error('🛑 Unexpected Diagnosis Error:', err.message);
    }

    console.log('\n✨ Diagnosis Complete.');
}

diagnose();
