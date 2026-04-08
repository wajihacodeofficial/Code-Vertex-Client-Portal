const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Service role client — bypasses RLS, for backend use ONLY
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        }
    }
);

module.exports = supabase;
