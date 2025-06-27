import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Assuming AuthContext is in this path
import { FiLogOut, FiUser, FiLogIn, FiUserPlus, FiGrid } from 'react-icons/fi'; // Example icons

const Header = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/'); // Redirect to home or login page after logout
    } catch (error) {
      console.error('Failed to log out:', error);
      // Handle logout error (e.g., show a toast notification)
    }
  };

  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Site Name */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              {/* Placeholder for a logo */}
              <svg className="h-8 w-8 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m0 0A8.001 8.001 0 004 12a8.001 8.001 0 008 5.747m0-11.494A8.001 8.001 0 0120 12a8.001 8.001 0 01-8-5.747M12 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              <span className="font-bold text-xl tracking-tight">EventHub</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-4 items-center">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">Home</Link>
            <Link to="/events" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">Events</Link>
            {!loading && user && (
              <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">Dashboard</Link>
            )}
          </nav>

          {/* Auth Buttons / Profile Dropdown */}
          <div className="hidden md:flex items-center space-x-3">
            {loading ? (
              <div className="animate-pulse h-8 w-20 bg-white/30 rounded-md"></div>
            ) : user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white transition-colors">
                  <FiUser className="h-5 w-5" />
                  <span>{user.user_metadata?.first_name || user.email?.split('@')[0]}</span>
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 ease-in-out transform scale-95 group-hover:scale-100 origin-top-right">
                  <Link to="/profile" className="flex items-center px-4 py-2 text-sm hover:bg-gray-100">
                    <FiUser className="mr-2" /> Update Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <FiLogOut className="mr-2" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium border border-white hover:bg-white hover:text-indigo-600 transition-colors">
                  <FiLogIn/>
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium bg-yellow-400 hover:bg-yellow-500 text-indigo-700 transition-colors">
                  <FiUserPlus/>
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button - Basic placeholder */}
          <div className="md:hidden flex items-center">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu (e.g., hamburger icon) */}
              <FiGrid className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu, show/hide based on menu state - to be implemented if full mobile nav is needed */}
    </header>
  );
};

export default Header;
