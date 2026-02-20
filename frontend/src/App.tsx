import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import OwnerPanelPage from "./pages/OwnerPanelPage";
import BadgesPage from "./pages/BadgesPage";
import SettingsPage from "./pages/SettingsPage";
import CustomizePage from "./pages/CustomizePage";
import LinksPage from "./pages/LinksPage";
import TemplatesPage from "./pages/TemplatesPage";
import NotFoundPage from "./pages/NotFoundPage";
import { authAPI } from "./utils/api";
import NewHomePage from "./pages/NewHomePage";

export interface User {
  id: number;
  username: string;
  email: string;
  uid: number;
  role: string;
  isVerified: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  displayName?: string;
  avatar?: string;
  bio?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Add timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        console.error('Auth check timeout');
        setLoading(false);
      }, 10000); // 10 second timeout

      authAPI
        .getMe()
        .then((res) => setUser(res.data.user))
        .catch((err) => {
          console.error('Auth check failed:', err);
          localStorage.removeItem("token");
        })
        .finally(() => {
          clearTimeout(timeout);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 border-4 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewHomePage user={user} />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage setUser={setUser} />} />
        <Route path="/dashboard" element={<DashboardPage user={user} setUser={setUser} />} />
        <Route path="/dashboard/badges" element={<BadgesPage user={user} />} />
        <Route path="/dashboard/settings" element={<SettingsPage user={user} setUser={setUser} />} />
        <Route path="/dashboard/customize" element={<CustomizePage user={user} />} />
        <Route path="/dashboard/links" element={<LinksPage />} />
        <Route path="/dashboard/templates" element={<TemplatesPage />} />
        <Route path="/admin" element={<AdminPage user={user} />} />
        <Route path="/owner" element={<OwnerPanelPage user={user} />} />
        <Route path="/:username" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
