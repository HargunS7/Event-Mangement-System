import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Keep for username to email lookup for now
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState(''); // Local form error
  // const [success, setSuccess] = useState(''); // Success will be handled by navigation
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !authLoading) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, location.state]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // setSuccess('');
    setIsSubmitting(true);

    const { identifier, password } = form;

    if (!identifier || !password) {
      setError('Email/Username and password are required.');
      setIsSubmitting(false);
      return;
    }

    try {
      let emailToSignIn = identifier;

      if (!identifier.includes('@')) {
        // Attempt to get email from username via profiles table
        // This logic might be better inside the AuthContext's signIn if it's a common pattern
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', identifier)
          .single();

        if (profileError || !profile) {
          throw new Error('Invalid username or credentials.');
        }
        emailToSignIn = profile.email;
      }

      await signIn({ email: emailToSignIn, password });
      // Navigation is handled by the useEffect hook watching the user state
      // No need for setSuccess or manual navigation here
      toast.success('Login successful! Redirecting...');
      // The useEffect will navigate to /dashboard or `from` location
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || 'Failed to login. Please check your credentials.');
      toast.error(err.message || 'Failed to login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If auth is loading and user is not yet available, show a generic loading state or nothing
  // to prevent flashing the login form if already logged in.
  if (authLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Decorative circles from original design can be kept if desired */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <motion.div
        className="form-container bg-white p-8 rounded-xl shadow-2xl w-full max-w-md z-10" // Added bg, rounded, shadow, max-w
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1> {/* Updated page-title styling */}
          <p className="text-gray-600">Sign in to your account to continue</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased space-y */}
          <div> {/* Wrapped input in div for better error message placement if needed */}
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">Email or Username</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="identifier"
                type="text"
                name="identifier"
                placeholder="your@email.com or username"
                value={form.identifier}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" // Updated input-field styling
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password_login" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="password_login"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" // Updated input-field styling
                disabled={isSubmitting}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 bg-red-50 p-3 rounded-md border border-red-200 text-red-700 text-sm" // Updated error-message styling
            >
              <FiAlertCircle className="flex-shrink-0 h-5 w-5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Success message is removed, toast notifications are used instead */}

          <motion.button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50" // Updated btn-primary styling
            disabled={isSubmitting || authLoading}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </motion.button>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600"> {/* Updated text size */}
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-purple-600 hover:text-purple-500">
                Create one
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
