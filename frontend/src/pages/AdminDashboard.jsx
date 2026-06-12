import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { adminService } from '../services/adminService';
import { complaintService } from '../services/complaintService';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const getTabFromPath = (pathname) => {
  if (pathname.includes('/universities')) return 'universities';
  if (pathname.includes('/users')) return 'users';
  if (pathname.includes('/resources')) return 'resources';
  if (pathname.includes('/events')) return 'events';
  if (pathname.includes('/complaints')) return 'complaints';
  return 'dashboard';
};

const statusColors = {
  Pending: 'bg-amber-100 text-amber-800',
  Resolved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

const StatCard = ({ label, value, color, sub }) => (
  <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <h3 className={`mt-2 text-3xl font-bold ${color}`}>{value ?? 0}</h3>
    {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
  </div>
);

const ActionButton = ({ onClick, variant = 'primary', children, disabled }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    ghost: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

const AdminDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const activeTab = getTabFromPath(location.pathname);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [universityFilter, setUniversityFilter] = useState('');
  const [complaintFilter, setComplaintFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [remarksMap, setRemarksMap] = useState({});
  const [newUniversity, setNewUniversity] = useState({
    name: '',
    shortName: '',
    city: '',
  });

  const currentUserId = user?.id?.toString() || user?._id?.toString();

  const loadUniversities = useCallback(async () => {
    try {
      const data = await adminService.getUniversities();
      setUniversities(data.universities || []);
    } catch {
      try {
        const fallback = await authService.getAllUniversities();
        setUniversities(fallback.universities || []);
      } catch {
        /* optional */
      }
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const uniParams = universityFilter ? { universityId: universityFilter } : {};

      if (activeTab === 'dashboard') {
        const data = await adminService.getDashboardStats(uniParams);
        setStats(data.stats);
      } else if (activeTab === 'universities') {
        const data = await adminService.getUniversities();
        setUniversities(data.universities || []);
      } else if (activeTab === 'users') {
        const data = await adminService.getUsers({ limit: 100, ...uniParams });
        setUsers(data.users || []);
      } else if (activeTab === 'resources') {
        const params = { ...uniParams };
        if (resourceFilter === 'pending') params.status = 'pending';
        else if (resourceFilter === 'approved') params.status = 'approved';
        const data = await adminService.getResources(params);
        setResources(data.resources || []);
      } else if (activeTab === 'events') {
        const params = { ...uniParams };
        if (eventFilter === 'pending') params.status = 'pending';
        else if (eventFilter === 'approved') params.status = 'approved';
        const data = await adminService.getEvents(params);
        setEvents(data.events || []);
      } else if (activeTab === 'complaints') {
        const params = { limit: 100, ...uniParams };
        if (complaintFilter) params.status = complaintFilter;
        const data = await complaintService.getAllComplaints(params);
        setComplaints(data.complaints || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, [
    activeTab,
    universityFilter,
    resourceFilter,
    eventFilter,
    complaintFilter,
  ]);

  useEffect(() => {
    loadUniversities();
  }, [loadUniversities]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const confirmAction = (message) => window.confirm(message);

  const handleUserAction = async (action, userId, label) => {
    if (!confirmAction(`Are you sure you want to ${label} this user?`)) return;
    try {
      await adminService[action](userId);
      toast.success(`User ${label} successfully`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${label} user`);
    }
  };

  const handleResourceAction = async (action, resourceId, label) => {
    if (!confirmAction(`Are you sure you want to ${label} this resource?`)) return;
    try {
      await adminService[action](resourceId);
      toast.success(`Resource ${label}`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${label} resource`);
    }
  };

  const handleEventAction = async (action, eventId, label) => {
    if (!confirmAction(`Are you sure you want to ${label} this event?`)) return;
    try {
      await adminService[action](eventId);
      toast.success(`Event ${label}`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${label} event`);
    }
  };

  const handleComplaintStatus = async (complaintId, status) => {
    const remarks = remarksMap[complaintId] || '';
    try {
      await complaintService.updateComplaintStatus(complaintId, {
        status,
        adminRemarks: remarks || `Marked as ${status} by admin`,
      });
      toast.success(`Complaint ${status.toLowerCase()}`);
      setRemarksMap((prev) => ({ ...prev, [complaintId]: '' }));
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update complaint');
    }
  };

  const handleCreateUniversity = async (e) => {
    e.preventDefault();
    if (!newUniversity.name || !newUniversity.shortName || !newUniversity.city) {
      toast.error('All university fields are required');
      return;
    }
    try {
      await adminService.createUniversity(newUniversity);
      toast.success('University added');
      setNewUniversity({ name: '', shortName: '', city: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add university');
    }
  };

  const handleDeleteUniversity = async (universityId, shortName) => {
    if (!window.confirm(`Delete university ${shortName}? This cannot be undone.`)) return;
    try {
      await adminService.deleteUniversity(universityId);
      toast.success('University deleted');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete university');
    }
  };

  const uniName = (item) =>
    item?.university?.shortName || item?.university?.name || '—';

  if (loading && !stats && activeTab === 'dashboard') {
    return <Loader />;
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        {activeTab !== 'universities' && (
          <div className="mb-6">
            <select
              value={universityFilter}
              onChange={(e) => setUniversityFilter(e.target.value)}
              className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">All Universities</option>
              {universities.map((uni) => (
                <option key={uni._id} value={uni._id}>
                  {uni.shortName} — {uni.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <Loader />
        ) : (
          <>
            {activeTab === 'dashboard' && stats && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <StatCard label="Total Students" value={stats.totalUsers} color="text-blue-600" />
                <StatCard label="Resources" value={stats.totalResources} color="text-green-600" />
                <StatCard label="Events" value={stats.totalEvents} color="text-orange-600" />
                <StatCard
                  label="Pending Complaints"
                  value={stats.pendingComplaints}
                  color="text-red-600"
                />
                <StatCard
                  label="Pending Resources"
                  value={stats.pendingResources}
                  color="text-purple-600"
                  sub="Awaiting approval"
                />
                <StatCard
                  label="Pending Events"
                  value={stats.pendingEvents}
                  color="text-indigo-600"
                  sub="Awaiting approval"
                />
              </div>
            )}

            {activeTab === 'universities' && (
              <div className="space-y-6">
                <form
                  onSubmit={handleCreateUniversity}
                  className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <h3 className="mb-4 text-lg font-bold text-gray-900">Add New University</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <input
                      type="text"
                      placeholder="Full name"
                      value={newUniversity.name}
                      onChange={(e) =>
                        setNewUniversity({ ...newUniversity, name: e.target.value })
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Short name (e.g. ITU)"
                      value={newUniversity.shortName}
                      onChange={(e) =>
                        setNewUniversity({ ...newUniversity, shortName: e.target.value })
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={newUniversity.city}
                      onChange={(e) =>
                        setNewUniversity({ ...newUniversity, city: e.target.value })
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    + Add University
                  </button>
                </form>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {universities.map((uni) => (
                    <div
                      key={uni._id}
                      className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{uni.shortName}</h3>
                          <p className="text-sm text-gray-500">{uni.name}</p>
                          <p className="text-xs text-gray-400">{uni.city}</p>
                        </div>
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
                          {uni.stats?.users || 0} students
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="rounded-lg bg-gray-50 p-2">
                          <p className="font-bold text-gray-800">{uni.stats?.resources || 0}</p>
                          <p className="text-gray-500">Resources</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-2">
                          <p className="font-bold text-gray-800">{uni.stats?.events || 0}</p>
                          <p className="text-gray-500">Events</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-2">
                          <p className="font-bold text-red-600">
                            {uni.stats?.pendingComplaints || 0}
                          </p>
                          <p className="text-gray-500">Complaints</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteUniversity(uni._id, uni.shortName)}
                        className="mt-4 w-full rounded-lg bg-red-100 py-2 text-xs font-semibold text-red-700 hover:bg-red-200"
                      >
                        Remove University
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">University</th>
                        <th className="px-4 py-3">Dept</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u) => {
                        const isSelf = u._id.toString() === currentUserId;
                        const canManage = !isSelf && u.role !== 'admin';
                        return (
                          <tr key={u._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{u.name}</td>
                            <td className="px-4 py-3 text-gray-600">{u.email}</td>
                            <td className="px-4 py-3">{uniName(u)}</td>
                            <td className="px-4 py-3">{u.department}</td>
                            <td className="px-4 py-3 capitalize">{u.role}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {u.isBanned && (
                                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                                    Banned
                                  </span>
                                )}
                                {!u.isActive && (
                                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                                    Restricted
                                  </span>
                                )}
                                {u.isActive && !u.isBanned && (
                                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                                    Active
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {canManage ? (
                                <div className="flex flex-wrap gap-1">
                                  {u.isBanned ? (
                                    <ActionButton
                                      variant="success"
                                      onClick={() => handleUserAction('unbanUser', u._id, 'unbanned')}
                                    >
                                      Unban
                                    </ActionButton>
                                  ) : (
                                    <ActionButton
                                      variant="warning"
                                      onClick={() => handleUserAction('banUser', u._id, 'banned')}
                                    >
                                      Ban
                                    </ActionButton>
                                  )}
                                  {!u.isActive ? (
                                    <ActionButton
                                      variant="success"
                                      onClick={() =>
                                        handleUserAction('activateUser', u._id, 'activated')
                                      }
                                    >
                                      Activate
                                    </ActionButton>
                                  ) : (
                                    <ActionButton
                                      variant="ghost"
                                      onClick={() =>
                                        handleUserAction('restrictUser', u._id, 'restricted')
                                      }
                                    >
                                      Restrict
                                    </ActionButton>
                                  )}
                                  <ActionButton
                                    variant="danger"
                                    onClick={() => handleUserAction('deleteUser', u._id, 'deleted')}
                                  >
                                    Delete
                                  </ActionButton>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {users.length === 0 && (
                    <p className="p-8 text-center text-gray-500">No users found</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div>
                <div className="mb-4 flex gap-2">
                  {['all', 'pending', 'approved'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setResourceFilter(f)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize ${
                        resourceFilter === f
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-600 border'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="space-y-4">
                  {resources.map((r) => (
                    <div
                      key={r._id}
                      className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900">{r.title}</h3>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                r.isApproved
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {r.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {r.subject} • Sem {r.semester} • {uniName(r)}
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            By: {r.uploadedBy?.name || 'Unknown'} • {r.downloads} downloads
                          </p>
                          {r.description && (
                            <p className="mt-2 text-sm text-gray-700">{r.description}</p>
                          )}
                        </div>
                        <div className="flex shrink-0 flex-wrap gap-2">
                          {!r.isApproved && (
                            <ActionButton
                              variant="success"
                              onClick={() =>
                                handleResourceAction('approveResource', r._id, 'approved')
                              }
                            >
                              Approve
                            </ActionButton>
                          )}
                          <ActionButton
                            variant="danger"
                            onClick={() =>
                              handleResourceAction('deleteResource', r._id, 'deleted')
                            }
                          >
                            Delete
                          </ActionButton>
                        </div>
                      </div>
                    </div>
                  ))}
                  {resources.length === 0 && (
                    <p className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
                      No resources found
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div>
                <div className="mb-4 flex gap-2">
                  {['all', 'pending', 'approved'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setEventFilter(f)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize ${
                        eventFilter === f
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-600 border'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="space-y-4">
                  {events.map((e) => (
                    <div
                      key={e._id}
                      className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900">{e.title}</h3>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                e.isApproved
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {e.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {e.location} • {new Date(e.date).toLocaleDateString()} • {uniName(e)}
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            Organizer: {e.organizer?.name || 'Unknown'} • {e.registrations}{' '}
                            registrations
                          </p>
                          <p className="mt-2 text-sm text-gray-700">{e.description}</p>
                        </div>
                        <div className="flex shrink-0 flex-wrap gap-2">
                          {!e.isApproved && (
                            <ActionButton
                              variant="success"
                              onClick={() => handleEventAction('approveEvent', e._id, 'approved')}
                            >
                              Approve
                            </ActionButton>
                          )}
                          <ActionButton
                            variant="danger"
                            onClick={() => handleEventAction('deleteEvent', e._id, 'deleted')}
                          >
                            Delete
                          </ActionButton>
                        </div>
                      </div>
                    </div>
                  ))}
                  {events.length === 0 && (
                    <p className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
                      No events found
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'complaints' && (
              <div>
                <div className="mb-4 flex flex-wrap gap-2">
                  {['', 'Pending', 'Resolved', 'Rejected'].map((f) => (
                    <button
                      key={f || 'all'}
                      type="button"
                      onClick={() => setComplaintFilter(f)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        complaintFilter === f
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-600 border'
                      }`}
                    >
                      {f || 'All'}
                    </button>
                  ))}
                </div>
                <div className="space-y-4">
                  {complaints.map((c) => (
                    <div
                      key={c._id}
                      className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                    >
                      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-gray-900">{c.category}</h3>
                          <p className="text-sm text-gray-500">
                            {c.anonymous
                              ? 'Anonymous'
                              : c.submittedBy?.name || 'Unknown'}{' '}
                            • {uniName(c)} •{' '}
                            {new Date(c.createdAt).toLocaleDateString()}
                          </p>
                          <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                            Priority: {c.priority}
                          </span>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[c.status]}`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <p className="mb-4 text-sm text-gray-700">{c.description}</p>
                      {c.adminRemarks && (
                        <p className="mb-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                          <span className="font-semibold">Admin remarks:</span> {c.adminRemarks}
                        </p>
                      )}
                      <input
                        type="text"
                        placeholder="Add admin remarks (optional)"
                        value={remarksMap[c._id] || ''}
                        onChange={(e) =>
                          setRemarksMap((prev) => ({ ...prev, [c._id]: e.target.value }))
                        }
                        className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                      <div className="flex flex-wrap gap-2">
                        {c.status !== 'Resolved' && (
                          <ActionButton
                            variant="success"
                            onClick={() => handleComplaintStatus(c._id, 'Resolved')}
                          >
                            Resolve
                          </ActionButton>
                        )}
                        {c.status !== 'Rejected' && (
                          <ActionButton
                            variant="danger"
                            onClick={() => handleComplaintStatus(c._id, 'Rejected')}
                          >
                            Reject
                          </ActionButton>
                        )}
                        {c.status !== 'Pending' && (
                          <ActionButton
                            variant="ghost"
                            onClick={() => handleComplaintStatus(c._id, 'Pending')}
                          >
                            Mark Pending
                          </ActionButton>
                        )}
                      </div>
                    </div>
                  ))}
                  {complaints.length === 0 && (
                    <p className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
                      No complaints found
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
