import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AnimatePresence } from 'framer-motion'; // For page transitions later

// Core Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyRedirect from './pages/VerifyRedirect';

// Admin Pages
import AdminEventsPage from './pages/admin/AdminEventsPage';
import AdminEventRequestsPage from './pages/admin/AdminEventRequestsPage';

// Layout and Route Protection
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      {/* <AnimatePresence mode="wait"> */}
        <Routes>
          {/* Public routes wrapped in Layout */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/events" element={<Layout><EventsPage /></Layout>} />
          <Route path="/about" element={<Layout><AboutUsPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          <Route path="/privacy" element={<Layout><PrivacyPolicyPage /></Layout>} />

          {/* Auth routes - typically without the main Layout, or with a simpler one */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<VerifyRedirect />} />

          {/* Protected Routes (require authentication) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          </Route>

          {/* Admin Routes (require authentication and 'admin' role) */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/events" element={<Layout><AdminEventsPage /></Layout>} />
            <Route path="/admin/event-requests" element={<Layout><AdminEventRequestsPage /></Layout>} />
            {/* Note: Admin requests might also be part of the main dashboard for an admin user,
                so /admin/event-requests might be an alternative or supplementary route.
                The DashboardPage component will handle showing admin-specific content.
            */}
          </Route>

          {/* Catch-all for 404 Not Found page (optional) */}
          {/* <Route path="*" element={<Layout><NotFoundPage /></Layout>} /> */}
        </Routes>
      {/* </AnimatePresence> */}
    </Router>
  );
}

export default App;
