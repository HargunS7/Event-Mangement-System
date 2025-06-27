import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can render a loading spinner or a blank page while auth state is loading
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    // User not authenticated, redirect to login page
    // You can pass the current location to redirect back after login
    // import { useLocation } from 'react-router-dom';
    // const location = useLocation();
    // return <Navigate to="/login" state={{ from: location }} replace />;
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the child components (Outlet or children)
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
