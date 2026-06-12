import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore, selectIsStudentSession } from '../store/authStore';
import { authService } from '../services/authService';
import PasswordInput from '../components/PasswordInput';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    semester: '',
    universityId: '',
  });
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const isStudentSession = useAuthStore(selectIsStudentSession);

  const departments = ['AI', 'CS', 'SE', 'DS', 'BBA', 'EE'];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

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

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.department ||
      !formData.semester ||
      !formData.universityId
    ) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:min-h-screen">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">CampusConnect</h1>
          <p className="mt-2 text-gray-600">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Muhammad Subhan"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Semester</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select semester</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">University</label>
            <select
              name="universityId"
              value={formData.universityId}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
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
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
