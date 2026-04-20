const supabase = require('./db');
const { sendOTP } = require('./otp');

async function testSignup() {
    const testEmail = 'test_team_' + Date.now() + '@example.com';
    const name = 'Test Team';
    const password = 'Password@123';
    const role = 'team';

    console.log(`🧪 Testing signup for ${testEmail}...`);

    try {
        // Step 1: Auth creation
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: testEmail,
            password: password,
            email_confirm: false,
            user_metadata: { name, role }
        });

        if (authError) {
            console.error('❌ Auth Error:', authError.message);
            return;
        }

        console.log('✅ Auth success (UID:', authData.user.id, ')');

        // Step 2: DB Insert
        const { error: dbError } = await supabase
            .from('users')
            .insert({
                supabase_uid: authData.user.id,
                email: testEmail,
                name,
                role,
                status: 'pending',
                email_verified: false,
                password_hash: 'SUPABASE_AUTH'
            });

        if (dbError) {
            console.error('❌ DB Error:', dbError.message, dbError.details);
            // Cleanup
            await supabase.auth.admin.deleteUser(authData.user.id);
            return;
        }

        console.log('✅ DB Insert success');

        // Step 3: OTP
        try {
            await sendOTP(testEmail);
            console.log('✅ OTP Success');
        } catch (otpErr) {
            console.error('❌ OTP Error:', otpErr.message);
        }

        // Final Cleanup
        console.log('🧹 Cleaning up test user...');
        await supabase.from('users').delete().eq('email', testEmail);
        await supabase.auth.admin.deleteUser(authData.user.id);
        console.log('✨ Test finished.');

    } catch (err) {
        console.error('🛑 Unexpected error:', err);
    }
}

testSignup();
