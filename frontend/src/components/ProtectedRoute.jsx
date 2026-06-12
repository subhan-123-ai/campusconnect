import { Navigate } from 'react-router-dom';
import { useAuthStore, selectIsStudentSession } from '../store/authStore';
import Loader from './Loader';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);
  const loginType = useAuthStore((state) => state.loginType);
  const isStudentSession = useAuthStore(selectIsStudentSession);

  if (isLoading) {
    return <Loader />;
  }

  if (loginType === 'admin' || user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (!isStudentSession) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
