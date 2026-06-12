import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const adminLogin = useAuthStore((state) => state.adminLogin);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-3xl">
            🛡️
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
          <p className="text-slate-500 mt-2">Sign in to manage all universities</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Admin Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="admin@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in as Admin'}
          </button>
        </form>

        <p className="text-center text-slate-500 mt-6 text-sm">
          Student login?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Go to student portal
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
