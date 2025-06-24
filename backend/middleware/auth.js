const { createClient } = require('@supabase/supabase-js');

// Create two clients - one for auth, one for database operations
const authClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANNON_KEY
);

const serviceClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  console.log('🔐 Received token:', token);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token' });
  }

  try {
    // Validate token with auth client
    const { data: { user }, error } = await authClient.auth.getUser(token);
    console.log('🔎 Supabase auth.getUser:', user);

    if (error || !user) {
      console.log('❌ Token validation failed:', error?.message);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Use service client to fetch profile (bypasses RLS)
    const { data: profile, error: profileError } = await serviceClient
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .maybeSingle();

    console.log('📛 Matching user.id:', user.id);
    console.log('📋 Matched profile:', profile);
    console.log('⚠️ Profile error:', profileError);

    if (profileError) {
      console.log('⚠️ Profile error:', profileError.message);
      return res.status(500).json({ error: 'Database error while fetching profile' });
    }
    
    if (!profile) {
      console.log('❌ Profile not found for user:', user.id);
      return res.status(403).json({ error: 'Profile not found or access denied' });
    }

    // Ensure role exists, default to 'user' if missing
    if (!profile.role) {
      console.log('⚠️ No role found for user, defaulting to "user"');
      profile.role = 'user';
    }

    req.user = profile;
    console.log('✅ User authenticated:', { id: profile.id, role: profile.role });
    next();
  } catch (error) {
    console.log('❌ Middleware error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  next();
};

module.exports = { authMiddleware, adminOnly };
