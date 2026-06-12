import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resourceService } from '../services/resourceService';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['AI', 'CS', 'SE', 'DS', 'BBA', 'EE'];

const UploadResource = () => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    department: '',
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

    if (!formData.title || !formData.subject || !formData.department || !formData.semester || !file) {
      toast.error('Please fill all required fields and upload a file');
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('subject', formData.subject);
      payload.append('department', formData.department);
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
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="rounded-lg bg-white p-5 shadow-lg sm:p-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-800 sm:mb-8 sm:text-3xl">
          Upload Study Resource
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Resource Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., ADBMS Complete Notes"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Semester *</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select semester</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Subject *</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select subject</option>
              {subjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Brief description of the resource..."
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Upload File (PDF or Image) *
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,application/pdf,image/*"
              onChange={handleFileChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-700 sm:px-4 sm:file:mr-4 sm:file:px-4"
            />
            {file && (
              <p className="mt-2 break-all text-sm text-green-600">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Accepted: PDF, JPG, PNG, WEBP, GIF — max 15MB
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 py-3 font-semibold text-white transition hover:shadow-lg disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload Resource'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadResource;
