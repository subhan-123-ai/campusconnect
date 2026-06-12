import { Navigate } from 'react-router-dom';
import { useAuthStore, selectIsAdminSession } from '../store/authStore';
import Loader from './Loader';

const AdminProtectedRoute = ({ children }) => {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAdminSession = useAuthStore(selectIsAdminSession);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAdminSession) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
