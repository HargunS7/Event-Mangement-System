const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANNON_KEY
);

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  console.log('🔐 Received token:', token);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token' });
  }

  // ✅ FIXED: Use raw token only
  const { data: { user }, error } = await supabase.auth.getUser(token);
  console.log('🔎 Supabase auth.getUser:', user);

  if (error || !user) {
    console.log('❌ Token validation failed:', error?.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.log('⚠️ Profile error:', profileError.message);
    return res.status(500).json({ error: 'Unauthorized: Profile not found' });
  }

  req.user = profile;
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  next();
};

module.exports = { authMiddleware, adminOnly };
