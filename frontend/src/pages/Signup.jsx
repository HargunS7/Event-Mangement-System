import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // For checking existing username
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiAtSign } from 'react-icons/fi'; // Removed FiAlertCircle, FiCheckCircle
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, user, loading: authLoading } = useAuth(); // Added user, authLoading
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Local error state for form validation, not for server errors which will be toasts
  const [formError, setFormError] = useState('');


  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (formError) setFormError(''); // Clear error on change
  };

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !authLoading) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, location.state]);

  const validatePassword = (password) => {
    // Password must be at least 8 characters, include uppercase, lowercase, number, and special character.
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      setFormError('Password needs 8+ chars: uppercase, lowercase, number, special char.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(''); // Clear previous form errors
    setIsSubmitting(true);

    const { firstName, lastName, email, username, password, confirmPassword } = form;

    if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
      setFormError('All fields are required.');
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    if (!validatePassword(password)) {
      // validatePassword sets its own error message
      setIsSubmitting(false);
      return;
    }

    try {
      // Check if username is already taken - this should ideally be a database constraint / RLS policy too
      const { data: existingUser, error: existingUserError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUserError && existingUserError.code !== 'PGRST116') { // PGRST116: 'single' row not found, which is good
        throw existingUserError;
      }
      if (existingUser) {
        setFormError('Username already taken. Please choose another.');
        setIsSubmitting(false);
        return;
      }

      const { error: signUpError } = await signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            username,
            // role: 'user', // Default role can be set by a Supabase trigger/function
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      toast.success('Signup successful! Please check your email to confirm your account.');
      setForm({ firstName: '', lastName: '', email: '', username: '', password: '', confirmPassword: '' });
      // Don't navigate immediately, user needs to confirm email.
      // Maybe navigate to a "Check your email" page or back to login.
      setTimeout(() => navigate('/login'), 4000);
    } catch (err) {
      console.error("Signup error:", err);
      // Display a generic error or err.message if it's user-friendly
      toast.error(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Decorative circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <motion.div
        className="form-container bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg z-10" // max-w-lg for slightly wider form
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
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600">Join us and start managing your events</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
           {formError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 bg-red-50 p-3 rounded-md border border-red-200 text-red-700 text-sm mb-4"
            >
              <FiAlertCircle className="flex-shrink-0 h-5 w-5" />
              <span>{formError}</span>
            </motion.div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="firstName" type="text" name="firstName" placeholder="John"
                  value={form.firstName} onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="lastName" type="text" name="lastName" placeholder="Doe"
                  value={form.lastName} onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="email_signup" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="email_signup" type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label htmlFor="username_signup" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <FiAtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="username_signup" type="text" name="username" placeholder="johndoe"
                value={form.username} onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password_signup" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="password_signup" type="password" name="password" placeholder="••••••••"
                value={form.password} onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                disabled={isSubmitting}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">8+ chars: upper, lower, number, special.</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="confirmPassword" type="password" name="confirmPassword" placeholder="••••••••"
                value={form.confirmPassword} onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            disabled={isSubmitting || authLoading}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Creating account...
              </div>
            ) : (
              'Create Account'
            )}
          </motion.button>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
