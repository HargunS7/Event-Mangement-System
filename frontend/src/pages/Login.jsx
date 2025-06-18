import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

export default function Login() {
  const navigate = useNavigate();
  // const [form, setForm] = useState({ email: '',username:'', password: '' });
  const [form,setForm] = useState({identifier :'',password:''});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // const { email,username, password } = form;

    // if ((!email&&username) || !password) {
    //   setError('Email or Username and password are required.');
    //   setIsLoading(false);
    //   return;
    // }

    const { identifier, password } = form;

    if (!identifier || !password) {
        setError('Email or Username and password are required.');
        setIsLoading(false);
        return;
    }

    try {
      // adding login with username or email
      // let useremail = email;

      // if(!email&&username){
      //   const {data,error} = await supabase
      //     .from('profiles')
      //     .select('email')
      //     .eq('username',username)
      //     .single();

      //   if(error||!data){
      //     throw new error('Invalid Username');
      //   }

      //   useremail = email;

      // }

      // const { data, error: loginError } = await supabase.auth.signInWithPassword({
      //   email:useremail,
      //   password,
      // });

      let email = identifier;

    // If it doesn't contain @, assume it's a username
    if (!identifier.includes('@')) {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', identifier)
        .single();

      if (error || !data) throw new Error('Username not found.');
      email = data.email;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

      if (loginError) throw loginError;

      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Decorative circles */}
      <div className="decoration-circle-1" />
      <div className="decoration-circle-2" />

      <motion.div
        className="form-container"
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
          <h1 className="page-title">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="identifier"
                placeholder="Email address or Username"
                value={form.identifier}
                onChange={handleChange}
                className="input-field pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="input-field pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="error-message"
            >
              <FiAlertCircle className="flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="success-message"
            >
              <FiCheckCircle className="flex-shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}

          <motion.button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </motion.button>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="link-text">
                Create one
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
