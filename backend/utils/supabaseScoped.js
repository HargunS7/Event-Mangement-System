const {createClient} = require("@supabase/supabase-js");

function getSupabaseFromReq(req){
    const token = req.headers.authorization?.replace('Bearer ','');
    const headers = token ?{Authorization : `Bearer ${token}`} : {};
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY,
        {global:{headers}}
    );

}

module.exports={getSupabaseFromReq};