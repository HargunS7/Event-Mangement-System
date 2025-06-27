import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    // Logged in but not an admin, redirect to dashboard or a 'not authorized' page
    // For now, redirecting to dashboard.
    // Consider creating a specific 'NotAuthorizedPage.jsx' for a better UX.
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and is an admin, render the child components
  return children ? children : <Outlet />;
};

export default AdminRoute;
