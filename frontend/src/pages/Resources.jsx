import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourceService } from '../services/resourceService';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const DEPARTMENTS = ['AI', 'CS', 'SE', 'DS', 'BBA', 'EE'];

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    subject: '',
    department: '',
    semester: '',
  });

  useEffect(() => {
    fetchResources();
  }, [page, filters]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await resourceService.getResources({
        ...filters,
        page,
        limit: 10,
      });
      setResources(data.resources);
    } catch (error) {
      toast.error('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resource) => {
    try {
      await resourceService.downloadResourceFile(
        resource._id,
        resource.fileName || `${resource.title}.pdf`
      );
      toast.success('Download started!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to download resource');
    }
  };

  if (loading && page === 1) {
    return <Loader />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Study Resources</h1>
        <Link
          to="/upload-resource"
          className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2 text-sm text-white transition hover:shadow-lg sm:px-6 sm:text-base"
        >
          + Upload Resource
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-lg bg-white p-4 shadow-md sm:flex-row sm:gap-4">
        <input
          type="text"
          placeholder="Search by subject..."
          value={filters.subject}
          onChange={(e) => {
            setFilters({ ...filters, subject: e.target.value });
            setPage(1);
          }}
          className="input-field sm:flex-1"
        />
        <select
          value={filters.department}
          onChange={(e) => {
            setFilters({ ...filters, department: e.target.value });
            setPage(1);
          }}
          className="input-field sm:w-40"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <select
          value={filters.semester}
          onChange={(e) => {
            setFilters({ ...filters, semester: e.target.value });
            setPage(1);
          }}
          className="input-field sm:w-44"
        >
          <option value="">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>
      </div>

      {resources.length > 0 ? (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <div
              key={resource._id}
              className="rounded-lg bg-white p-5 shadow-md transition hover:shadow-lg sm:p-6"
            >
              <h3 className="mb-2 text-lg font-bold text-gray-800">{resource.title}</h3>
              <p className="mb-3 line-clamp-3 text-sm text-gray-600">{resource.description}</p>

              <div className="mb-4 flex flex-wrap gap-2">
                {resource.department && (
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-800">
                    {resource.department}
                  </span>
                )}
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800">
                  {resource.subject}
                </span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-800">
                  Sem {resource.semester}
                </span>
              </div>

              <p className="mb-4 text-sm text-gray-500">By: {resource.uploadedBy.name}</p>

              <button
                type="button"
                onClick={() => handleDownload(resource)}
                className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 py-2 text-white transition hover:shadow-lg"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-600">No resources found. Be the first to upload!</p>
        </div>
      )}
    </div>
  );
};

export default Resources;
