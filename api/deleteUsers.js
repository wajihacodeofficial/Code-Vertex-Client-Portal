const supabase = require('./db');

const uids = ['44E5F776', 'E50B582C', '08DE636A', '668A1361', '45F80E33'];

async function deleteUsers() {
    try {
        const { data: users, error } = await supabase.from('users').select('*');
        if (error) {
            console.error("Fetch DB error:", error.message);
            return;
        }
        
        console.log(`Found ${users.length} users in DB. Filtering...`);
        let count = 0;
        
        for (const user of users) {
             const upperId = user.id ? user.id.toUpperCase() : '';
             const matches = uids.some(uid => upperId.startsWith(uid));
             
             if (matches) {
                 console.log(`Deleting: ${user.name} (${user.id})`);
                 if (user.supabase_uid) {
                     const { error: authErr } = await supabase.auth.admin.deleteUser(user.supabase_uid);
                     if (authErr) {
                         console.error("Auth Delete Error (might be already deleted):", authErr.message);
                     } else {
                         console.log("Deleted from Auth.");
                     }
                 }
                 
                 const { error: dbErr } = await supabase.from('users').delete().eq('id', user.id);
                 if (dbErr) {
                     console.error("DB Delete Error:", dbErr.message);
                 } else {
                     console.log("Deleted from Postgres DB.");
                 }
                 count++;
             }
        }
        console.log(`Done. Deleted ${count} users.`);
    } catch (err) {
         console.error("Unexpected Error:", err);
    }
}
deleteUsers();
