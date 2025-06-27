import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { FiUser, FiMail, FiPhone, FiSave, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, fetchUserProfile, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    username: '', // Display only
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      // User object from AuthContext might have profile data at root or in user_metadata
      // This attempts to gracefully handle both structures.
      const profileData = user.user_metadata || user;
      setFormData({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        email: user.email || '', // Email is always at the root of the auth user object
        phone: profileData.phone || '',
        username: profileData.username || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const { first_name, last_name, email, phone } = formData;

    if (!first_name || !last_name || !email) {
      setError('First name, last name, and email are required.');
      setIsSubmitting(false);
      toast.error('First name, last name, and email are required.');
      return;
    }

    try {
      const updatesToProfile = {
        first_name,
        last_name,
        phone,
        // username cannot be updated as per requirements
        updated_at: new Date(), // Keep track of updates
      };

      // Update profile data in 'profiles' table
      const { error: profileError } = await supabase
        .from('profiles')
        .update(updatesToProfile)
        .eq('id', user.id);

      if (profileError) throw profileError;

      let emailChangeMessage = '';
      // If email has changed, update it in auth.users as well
      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email });
        if (emailError) throw emailError;
        emailChangeMessage = ' Please check your new email address for a confirmation link if it was changed.';
      }

      toast.success(`Profile updated successfully!${emailChangeMessage}`);

      // Refresh user data in AuthContext
      if (fetchUserProfile) {
        await fetchUserProfile(user.id);
      }

    } catch (err) {
      console.error('Profile update error:', err);
      const errorMessage = err.message || 'Failed to update profile.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading && !user) { // Show loading only if user data isn't available yet
     return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (!user && !authLoading) { // If done loading and still no user, something is wrong (should be caught by ProtectedRoute)
    return <p className="text-center text-red-500">User not found. Please log in.</p>;
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-xl" // Adjusted padding
    >
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-800 text-center">Update Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {/* First Name */}
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              <input type="text" name="first_name" id="first_name" value={formData.first_name} onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                disabled={isSubmitting} required />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              <input type="text" name="last_name" id="last_name" value={formData.last_name} onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                disabled={isSubmitting} required />
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email_profile" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            <input type="email" name="email" id="email_profile" value={formData.email} onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              disabled={isSubmitting} required />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-xs text-gray-500">(Optional)</span></label>
          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="e.g., +1234567890" disabled={isSubmitting} />
          </div>
        </div>

        {/* Username (Display Only) */}
        <div>
          <label htmlFor="username_profile_display" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            <input type="text" name="username_profile_display" id="username_profile_display" value={formData.username}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm text-gray-500 cursor-not-allowed"
              disabled={true} // Username cannot be changed
            />
          </div>
           <p className="mt-1 text-xs text-gray-500">Username cannot be changed.</p>
        </div>

        {error && ( // This local error is now mostly a fallback, toasts are primary
          <div className="flex items-center space-x-2 bg-red-50 p-3 rounded-md border border-red-200 text-red-700 text-sm">
            <FiAlertCircle className="flex-shrink-0 h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || authLoading}
          className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition duration-150 ease-in-out"
        >
          <FiSave className="mr-2 h-5 w-5" />
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </motion.div>
  );
};

export default ProfilePage;
