import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FiUser, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return navigate('/login');
      setUser(user);
    });
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const { data: exists } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', form.username)
      .single();

    if (exists) {
      setError('Username already taken');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from('profiles')
      .upsert([{ 
        id: user.id,
        email: user.email,
        ...form }]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setSuccess('Profile completed! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Decorative background circles */}
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
          <h1 className="page-title">Complete Your Profile</h1>
          <p className="text-gray-600">Just one last step to get started</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {['first_name', 'last_name', 'username'].map((field, index) => (
            <div key={field} className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name={field}
                placeholder={field === 'username' ? 'Username (unique)' : field.split('_').map(cap => cap.charAt(0).toUpperCase() + cap.slice(1)).join(' ')}
                value={form[field]}
                onChange={handleChange}
                required
                className="input-field pl-10"
              />
            </div>
          ))}

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
            disabled={loading}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Submitting...
              </div>
            ) : (
              'Submit'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
