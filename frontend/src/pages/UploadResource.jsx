import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resourceService } from '../services/resourceService';
import toast from 'react-hot-toast';

const UploadResource = () => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    semester: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const subjects = [
    'ADBMS',
    'DSA',
    'Web Development',
    'Mobile App',
    'AI',
    'ML',
    'Cloud Computing',
    'Cybersecurity',
  ];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const allowed = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ];

    if (!allowed.includes(selected.type)) {
      toast.error('Only PDF and image files are allowed');
      e.target.value = '';
      return;
    }

    if (selected.size > 15 * 1024 * 1024) {
      toast.error('File size must be under 15MB');
      e.target.value = '';
      return;
    }

    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.subject || !formData.semester || !file) {
      toast.error('Please fill all required fields and upload a file');
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('subject', formData.subject);
      payload.append('semester', formData.semester);
      payload.append('description', formData.description);
      payload.append('file', file);

      await resourceService.uploadResource(payload);
      toast.success('Resource uploaded! Pending admin approval.');
      navigate('/resources');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">📤 Upload Study Resource</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resource Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., ADBMS Complete Notes"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select subject</option>
              {subjects.map((subj) => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Semester *</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select semester</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Brief description of the resource..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File (PDF or Image) *
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,application/pdf,image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700"
            />
            {file && (
              <p className="text-sm text-green-600 mt-2">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              Accepted: PDF, JPG, PNG, WEBP, GIF — max 15MB
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
          >
            {loading ? 'Uploading...' : '📤 Upload Resource'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadResource;
