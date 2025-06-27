import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import MyRequests from '../components/MyRequests';
import AdminRequests from '../components/admin/AdminRequests'; // Corrected path
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"> {/* Adjust min-h as needed */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    // This should ideally be caught by ProtectedRoute, but as a fallback:
    return <p className="text-center text-red-500">Please log in to view the dashboard.</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-10"
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-lg text-gray-600">
          Welcome back, <span className="font-semibold text-purple-700">{user?.user_metadata?.first_name || user?.email}!</span>
        </p>
      </div>

      {/* Section for users to submit and view their requests */}
      {/* MyRequests now includes the button to open the EventRequestForm modal */}
      <section>
        <MyRequests />
      </section>

      {/* Admin Section - Conditionally rendered */}
      {user?.role === 'admin' && (
        <section className="mt-12 pt-8 border-t border-gray-300">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 pb-2 border-b-2 border-purple-200">
            Admin Panel: Manage All Requests
          </h2>
          <AdminRequests />
        </section>
      )}
    </motion.div>
  );
};

export default DashboardPage;
