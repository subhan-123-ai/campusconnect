import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { complaintService } from '../services/complaintService';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import axiosInstance from '../api/axios';

const AdminDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      if (activeTab === 'dashboard') {
        const statsData = await axiosInstance.get('/admin/dashboard/stats');
        setStats(statsData.data.stats);
      } else if (activeTab === 'complaints') {
        const complaintData = await complaintService.getAllComplaints({ limit: 50 });
        setComplaints(complaintData.complaints);
      } else if (activeTab === 'users') {
        const userData = await axiosInstance.get('/admin/users', {
          params: { limit: 50 },
        });
        setUsers(userData.data.users);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComplaintStatus = async (complaintId, status) => {
    if (!status) return;

    try {
      await complaintService.updateComplaintStatus(complaintId, {
        status,
        adminRemarks: 'Updated by admin',
      });
      toast.success('Complaint status updated');
      fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update complaint');
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await axiosInstance.patch(`/admin/users/${userId}/ban`);
      toast.success('User banned');
      fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to ban user');
    }
  };

  const currentUserId = user?.id?.toString() || user?._id?.toString();

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">⚙️ Admin Dashboard</h1>

      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-6 py-2 font-semibold border-b-2 transition ${
            activeTab === 'dashboard'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-6 py-2 font-semibold border-b-2 transition ${
            activeTab === 'complaints'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Complaints
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2 font-semibold border-b-2 transition ${
            activeTab === 'users'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Users
        </button>
      </div>

      {activeTab === 'dashboard' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 font-semibold">Total Users</p>
            <h3 className="text-4xl font-bold text-blue-600 mt-2">{stats.totalUsers}</h3>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 font-semibold">Total Resources</p>
            <h3 className="text-4xl font-bold text-green-600 mt-2">{stats.totalResources}</h3>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 font-semibold">Total Events</p>
            <h3 className="text-4xl font-bold text-orange-600 mt-2">{stats.totalEvents}</h3>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 font-semibold">Pending Complaints</p>
            <h3 className="text-4xl font-bold text-red-600 mt-2">{stats.pendingComplaints}</h3>
          </div>
        </div>
      )}

      {activeTab === 'complaints' && (
        <div className="space-y-4">
          {complaints.length > 0 ? (
            complaints.map((complaint) => (
              <div key={complaint._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{complaint.category}</h3>
                    <p className="text-gray-600 text-sm">
                      By: {complaint.anonymous ? 'Anonymous' : complaint.submittedBy?.name || 'Unknown'}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                    {complaint.status}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{complaint.description}</p>

                <div className="flex gap-2">
                  <select
                    onChange={(e) =>
                      handleUpdateComplaintStatus(complaint._id, e.target.value)
                    }
                    defaultValue=""
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Change Status</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No complaints to manage</p>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-gray-800 font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-gray-800 font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-gray-800 font-semibold">Department</th>
                <th className="px-6 py-3 text-left text-gray-800 font-semibold">Role</th>
                <th className="px-6 py-3 text-left text-gray-800 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{u.name}</td>
                  <td className="px-6 py-3">{u.email}</td>
                  <td className="px-6 py-3">{u.department}</td>
                  <td className="px-6 py-3 capitalize">{u.role}</td>
                  <td className="px-6 py-3">
                    {u._id.toString() !== currentUserId && u.role !== 'admin' && (
                      <button
                        onClick={() => handleBanUser(u._id)}
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                      >
                        Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
