import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintService } from '../services/complaintService';
import ComplaintCard from '../components/Cards/ComplaintCard';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

export default function MyComplaints() {
  const [filterStatus, setFilterStatus] = useState('');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const data = await complaintService.getMyComplaints({ limit: 100 });
        setComplaints(data.complaints || []);
      } catch (error) {
        toast.error('Failed to load complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const statuses = ['Pending', 'Resolved', 'Rejected'];

  const filteredComplaints = filterStatus
    ? complaints.filter((complaint) => complaint.status === filterStatus)
    : complaints;

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === 'Pending').length,
    resolved: complaints.filter((c) => c.status === 'Resolved').length,
    rejected: complaints.filter((c) => c.status === 'Rejected').length,
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-50 py-8 sm:py-12">
      <div className="container-main">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">My Complaints</h1>
          <p className="text-gray-600 mt-2">Track the status of your submitted complaints</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <p className="text-gray-600 text-sm">Total Complaints</p>
            <p className="text-3xl font-bold text-primary mt-2">{stats.total}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-danger mt-2">{stats.pending}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm">Resolved</p>
            <p className="text-3xl font-bold text-success mt-2">{stats.resolved}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm">Rejected</p>
            <p className="text-3xl font-bold text-warning mt-2">{stats.rejected}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterStatus('')}
              className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                filterStatus === ''
                  ? 'btn-primary'
                  : 'border border-gray-300 text-gray-700 hover:border-primary'
              }`}
            >
              All Complaints
            </button>
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                  filterStatus === status
                    ? 'btn-primary'
                    : 'border border-gray-300 text-gray-700 hover:border-primary'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {filteredComplaints.length > 0 ? (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard key={complaint._id} complaint={complaint} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900">No complaints found</h3>
            <p className="text-gray-600 mt-2">
              {complaints.length === 0
                ? 'You have not submitted any complaints yet'
                : 'No complaints with this status'}
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/complaints" className="btn-primary inline-block">
            ➕ Submit New Complaint
          </Link>
        </div>
      </div>
    </div>
  );
}
