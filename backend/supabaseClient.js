const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // NOT anon key
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
