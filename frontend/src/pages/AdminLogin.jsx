import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore, selectIsAdminSession } from '../store/authStore';
import PasswordInput from '../components/PasswordInput';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const adminLogin = useAuthStore((state) => state.adminLogin);
  const isAdminSession = useAuthStore(selectIsAdminSession);

  useEffect(() => {
    if (isAdminSession) {
      navigate('/admin', { replace: true });
    }
  }, [isAdminSession, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Email and password are required');
      return;
    }

    setLoading(true);

    try {
      await adminLogin(formData);
      toast.success('Admin login successful!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 text-center sm:mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl text-white sm:h-16 sm:w-16 sm:text-3xl">
            🛡️
          </div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Admin Portal</h1>
          <p className="mt-2 text-slate-500">Sign in to manage all universities</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Admin Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-500"
              placeholder="admin@gmail.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              inputClassName="py-2.5 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in as Admin'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Student login?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
            Go to student portal
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
