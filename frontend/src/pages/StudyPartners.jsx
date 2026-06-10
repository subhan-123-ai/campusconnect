import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { studyRequestService } from '../services/studyRequestService';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const StudyPartners = () => {
  const [students, setStudents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestsTab, setShowRequestsTab] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    semester: '',
  });

  useEffect(() => {
    if (showRequestsTab) {
      fetchRequests();
    } else {
      fetchStudents();
    }
  }, [showRequestsTab, filters]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await authService.getStudents(filters);
      setStudents(data.students);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await studyRequestService.getMyStudyRequests({ limit: 50 });
      setRequests(data.requests);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (studentId) => {
    const subject = prompt('What subject do you want to study together?');
    if (!subject) return;

    try {
      await studyRequestService.sendStudyRequest({
        receiverId: studentId,
        subject,
      });
      toast.success('Request sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await studyRequestService.acceptStudyRequest(requestId);
      toast.success('Request accepted!');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to accept request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await studyRequestService.rejectStudyRequest(requestId);
      toast.success('Request rejected');
      fetchRequests();
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">👥 Study Partners</h1>

      {/* Tab Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setShowRequestsTab(false)}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            !showRequestsTab
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Find Partners
        </button>
        <button
          onClick={() => setShowRequestsTab(true)}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            showRequestsTab
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          My Requests
        </button>
      </div>

      {!showRequestsTab ? (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex gap-4">
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Departments</option>
              {['AI', 'CS', 'SE', 'DS'].map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              value={filters.semester}
              onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
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

          {/* Students Grid */}
          {students.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <div key={student._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="text-center">
                    <div className="text-5xl mb-2">👤</div>
                    <h3 className="text-lg font-bold text-gray-800">{student.name}</h3>
                    <p className="text-gray-600 text-sm">{student.email}</p>
                  </div>

                  <div className="space-y-2 my-4 text-sm text-gray-600">
                    <p>🎓 {student.department}</p>
                    <p>📚 Semester {student.semester}</p>
                    <p className="line-clamp-2">{student.bio || 'No bio'}</p>
                  </div>

                  <button
                    onClick={() => handleSendRequest(student._id)}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg hover:shadow-lg transition"
                  >
                    💌 Send Request
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No students found matching your filters</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Requests List */}
          {requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {request.sender.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{request.sender.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      request.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : request.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">
                    <strong>Subject:</strong> {request.subject}
                  </p>

                  {request.message && (
                    <p className="text-gray-600 mb-4">{request.message}</p>
                  )}

                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(request._id)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        ✅ Accept
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No study requests yet</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudyPartners;