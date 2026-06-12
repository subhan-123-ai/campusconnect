import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    universityId: '',
  });
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const data = await authService.getAllUniversities();
        setUniversities(data.universities);
      } catch (error) {
        toast.error('Failed to load universities');
      }
    };
    fetchUniversities();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.universityId) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);

    try {
      await login(formData);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">CampusConnect</h1>
          <p className="text-gray-600 mt-2">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="your@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {/* University */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              University
            </label>
            <select
              name="universityId"
              value={formData.universityId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="">Select your university</option>
              {universities.map((uni) => (
                <option key={uni._id} value={uni._id}>
                  {uni.shortName} - {uni.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <Link
            to="/admin/login"
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-indigo-200 bg-indigo-50 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
          >
            🛡️ Admin Login
          </Link>
          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;