import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourceService } from '../services/resourceService';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    subject: '',
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
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📚 Study Resources</h1>
        <Link
          to="/upload-resource"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition"
        >
          + Upload Resource
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search by subject..."
          value={filters.subject}
          onChange={(e) => {
            setFilters({ ...filters, subject: e.target.value });
            setPage(1);
          }}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <select
          value={filters.semester}
          onChange={(e) => {
            setFilters({ ...filters, semester: e.target.value });
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>
      </div>

      {/* Resources Grid */}
      {resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {resources.map((resource) => (
            <div
              key={resource._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">{resource.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{resource.description}</p>

              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                  {resource.subject}
                </span>
                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                  Sem {resource.semester}
                </span>
              </div>

              <p className="text-gray-500 text-sm mb-4">
                By: {resource.uploadedBy.name}
              </p>

              <button
                onClick={() => handleDownload(resource)}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg hover:shadow-lg transition"
              >
                ⬇️ Download
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No resources found. Be the first to upload!</p>
        </div>
      )}
    </div>
  );
};

export default Resources;