import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Loader from './Loader';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
