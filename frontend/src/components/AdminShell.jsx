import { Outlet } from 'react-router-dom';
import AdminProtectedRoute from './AdminProtectedRoute';
import AdminPanelLayout from '../layouts/AdminPanelLayout';

export default function AdminShell() {
  return (
    <AdminProtectedRoute>
      <AdminPanelLayout>
        <Outlet />
      </AdminPanelLayout>
    </AdminProtectedRoute>
  );
}
