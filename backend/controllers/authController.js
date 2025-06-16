const { supabase } = require('../supabaseClient');
const validator = require('validator');

// SIGNUP
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName, username } = req.body;

  if (!email || !password || !confirmPassword || !firstName || !lastName || !username) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  //E-mail validator
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }   

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        'Password must be at least 8 characters long, include uppercase, lowercase, number, and special character',
    });
  }

  // Check if username already exists
  const { data: existing, error: usernameError } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single();

  if (existing) {
    return res.status(400).json({ error: 'Username already taken' });
  }

  // Create user
  const { data: userData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signupError) return res.status(400).json({ error: signupError.message });

  const userId = userData.user.id;

  const { error: profileError } = await supabase.from('profiles').insert([
    {
      id: userId,
      first_name: firstName,
      last_name: lastName,
      username,
    },
  ]);

  if (profileError) return res.status(500).json({ error: profileError.message });

  res.status(201).json({ message: 'Signup successful', user: userData.user });
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({ message: 'Login successful', session: data.session, user: data.user });
};

module.exports = { signup, login };
