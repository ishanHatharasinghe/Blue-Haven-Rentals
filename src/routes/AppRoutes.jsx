import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import LandingPage from "../landing/LandingPage";
import Contact from "../pages/landing-pages/Contact";
import BrowsePlacePage from "../pages/main-pages/BrowsePlacePage";
import UserPage from "../pages/user-pages/UserPage";
import UserDetailsEditPage from "../pages/user-pages/UserDetailsEditPage";
import WelcomeBackPage from "../pages/login-pages/WelcomeBackPage";
import ForgotPwdPage from "../pages/login-pages/ForgotPwdPage";
import PwdResetPage from "../pages/login-pages/PwdResetPage";
import SetNewPwdPage from "../pages/login-pages/SetNewPwdPage";
import AllDonePage from "../pages/login-pages/AllDonePage";
import PasswordResetSuccessPage from "../pages/login-pages/PasswordResetSuccessPage";
import SignupFlow from "../pages/sign-up-pages/SignupFlow";
import SignupCompletePage from "../pages/sign-up-pages/SignupCompletePage";
import AdminDashboard from "../pages/admin-pages/AdminDashboard";
import AdminDashboardOverview from "../pages/admin-pages/AdminDashboardOverview";
import AdminPendingPosts from "../pages/admin-pages/AdminPendingPosts";
import AdminApprovedPosts from "../pages/admin-pages/AdminApprovedPosts";
import AdminUsers from "../pages/admin-pages/AdminUsers";
import AdminAnalytics from "../pages/admin-pages/AdminAnalytics";
import PostAddFormPage from "../pages/main-pages/PostAddFormPage";
import NotFoundPage from "../pages/NotFoundPage";

import ProtectedRoute from "./ProtectedRoute";
import Footer from "../components/Footer";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // If there's a hash, try to scroll to that element
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // No hash, scroll to top
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return null;
}

function ConditionalFooter() {
  const location = useLocation();
  const hiddenPaths = ["/browse", "/browse-more" , "/contact" , "/post-add" , "/user" , "/admin/dashboard" , "/admin/pending-posts" , "/admin/approved-posts" , "/admin/users" , "/admin/analytics" , "/login" , "/forgot-password" , "/password-reset-verification" , "/set-new-password" , "/password-reset-success" , "/signup" , "/signup/complete"];

  // Hide footer on browse pages and all admin pages
  if (
    hiddenPaths.includes(location.pathname) ||
    location.pathname.startsWith("/admin")
  ) {
    return null;
  }

  return <Footer />;
}

function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Contact page */}
        <Route path="/contact" element={<Contact />} />

        {/* Main pages */}
        <Route path="/browse" element={<BrowsePlacePage />} />
        <Route path="/browse-more" element={<BrowsePlacePage />} />

        {/* Post Add page (protected - boarding owners only) */}
        <Route
          path="/post-add"
          element={
            <ProtectedRoute requireRole="boarding_owner">
              <PostAddFormPage />
            </ProtectedRoute>
          }
        />

        {/* User pages (protected) */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/edit"
          element={
            <ProtectedRoute>
              <UserDetailsEditPage />
            </ProtectedRoute>
          }
        />

        {/* Admin pages (protected with admin role) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireRole="admin">
              <AdminDashboardOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pending-posts"
          element={
            <ProtectedRoute requireRole="admin">
              <AdminPendingPosts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/approved-posts"
          element={
            <ProtectedRoute requireRole="admin">
              <AdminApprovedPosts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requireRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute requireRole="admin">
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />

        {/* Auth pages */}
        <Route path="/login" element={<WelcomeBackPage />} />
        <Route path="/forgot-password" element={<ForgotPwdPage />} />
        <Route path="/password-reset-verification" element={<PwdResetPage />} />
        <Route path="/set-new-password" element={<SetNewPwdPage />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccessPage />} />
        <Route path="/signup" element={<SignupFlow />} />
        <Route path="/signup/complete" element={<SignupCompletePage />} />

        {/* 404 Not Found - catch all unmatched routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ConditionalFooter />
    </Router>
  );
}

export default AppRoutes;
