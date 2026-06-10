import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { resourceService } from '../services/resourceService';
import { eventService } from '../services/eventService';
import { complaintService } from '../services/complaintService';
import { studyRequestService } from '../services/studyRequestService';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState({
    resources: 0,
    events: 0,
    complaints: 0,
    studyRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resourcesData, eventsData, complaintsData, requestsData] = await Promise.all([
          resourceService.getResources({ limit: 1 }),
          eventService.getEvents({ limit: 1 }),
          complaintService.getMyComplaints({ limit: 1 }),
          studyRequestService.getMyStudyRequests({ limit: 1 }),
        ]);

        setStats({
          resources: resourcesData.pagination?.total || 0,
          events: eventsData.pagination?.total || 0,
          complaints: complaintsData.pagination?.total || 0,
          studyRequests: requestsData.pagination?.total || 0,
        });
      } catch (error) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          {user?.university?.shortName} Campus Portal
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Resources Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Study Resources</p>
              <h3 className="text-4xl font-bold mt-2">{stats.resources}</h3>
            </div>
            <div className="text-5xl opacity-20">📚</div>
          </div>
        </div>

        {/* Events Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Upcoming Events</p>
              <h3 className="text-4xl font-bold mt-2">{stats.events}</h3>
            </div>
            <div className="text-5xl opacity-20">🎯</div>
          </div>
        </div>

        {/* Complaints Card */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">My Complaints</p>
              <h3 className="text-4xl font-bold mt-2">{stats.complaints}</h3>
            </div>
            <div className="text-5xl opacity-20">📝</div>
          </div>
        </div>

        {/* Study Requests Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Study Requests</p>
              <h3 className="text-4xl font-bold mt-2">{stats.studyRequests}</h3>
            </div>
            <div className="text-5xl opacity-20">👥</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/resources"
            className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition text-center"
          >
            <span className="text-3xl">📚</span>
            <p className="font-semibold text-gray-800 mt-2">View Resources</p>
          </Link>

          <Link
            to="/upload-resource"
            className="p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition text-center"
          >
            <span className="text-3xl">⬆️</span>
            <p className="font-semibold text-gray-800 mt-2">Upload Notes</p>
          </Link>

          <Link
            to="/events"
            className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg hover:bg-orange-100 transition text-center"
          >
            <span className="text-3xl">🎯</span>
            <p className="font-semibold text-gray-800 mt-2">View Events</p>
          </Link>

          <Link
            to="/study-partners"
            className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition text-center"
          >
            <span className="text-3xl">👥</span>
            <p className="font-semibold text-gray-800 mt-2">Find Partners</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;