import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore, selectIsStudentSession } from '../store/authStore';
import { authService } from '../services/authService';
import PasswordInput from '../components/PasswordInput';
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
  const isStudentSession = useAuthStore(selectIsStudentSession);

  useEffect(() => {
    if (isStudentSession) {
      navigate('/dashboard', { replace: true });
    }
  }, [isStudentSession, navigate]);

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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:min-h-screen">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">CampusConnect</h1>
          <p className="mt-2 text-gray-600">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">University</label>
            <select
              name="universityId"
              value={formData.universityId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your university</option>
              {universities.map((uni) => (
                <option key={uni._id} value={uni._id}>
                  {uni.shortName} - {uni.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 py-2 font-semibold text-white transition hover:shadow-lg disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <Link
            to="/admin/login"
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-indigo-200 bg-indigo-50 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
          >
            Admin Login
          </Link>
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
