import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Resources from './pages/Resources';
import UploadResource from './pages/UploadResource';
import Events from './pages/Events';
import StudyPartners from './pages/StudyPartners';
import Complaints from './pages/Complaints';
import MyComplaints from './pages/MyComplaints';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function PublicLayout({ children }) {
  return <AppLayout isLoggedIn={false}>{children}</AppLayout>;
}

function AuthLayout({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <AppLayout isLoggedIn={isAuthenticated}>
      <ProtectedRoute>{children}</ProtectedRoute>
    </AppLayout>
  );
}

function AdminLayout({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return (
    <AppLayout isLoggedIn={isAuthenticated}>
      <ProtectedRoute requireAdmin>{children}</ProtectedRoute>
    </AppLayout>
  );
}

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

        <Route path="/dashboard" element={<AuthLayout><Dashboard /></AuthLayout>} />
        <Route path="/profile" element={<AuthLayout><Profile /></AuthLayout>} />
        <Route path="/resources" element={<AuthLayout><Resources /></AuthLayout>} />
        <Route path="/upload-resource" element={<AuthLayout><UploadResource /></AuthLayout>} />
        <Route path="/events" element={<AuthLayout><Events /></AuthLayout>} />
        <Route path="/study-partners" element={<AuthLayout><StudyPartners /></AuthLayout>} />
        <Route path="/complaints" element={<AuthLayout><Complaints /></AuthLayout>} />
        <Route path="/my-complaints" element={<AuthLayout><MyComplaints /></AuthLayout>} />
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />

        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
