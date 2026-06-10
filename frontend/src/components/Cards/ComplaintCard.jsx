export default function ComplaintCard({ complaint }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Resolved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Rejected':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return '⏳';
      case 'In Progress':
        return '🔄';
      case 'Resolved':
        return '✅';
      case 'Rejected':
        return '❌';
      default:
        return '📋';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Professor': '👨‍🏫',
      'Hostel': '🏠',
      'Cafeteria': '🍽️',
      'Internet': '📡',
      'Classroom': '🎓',
      'Transport': '🚌',
      'Other': '⚠️'
    };
    return icons[category] || '📋';
  };

  return (
    <div className="card">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        
        {/* Header Info */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-3">
            <span className="shrink-0 text-2xl">{getCategoryIcon(complaint.category)}</span>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900">{complaint.category} Issue</h3>
              <p className="text-xs text-gray-500">ID: #{(complaint._id || complaint.id || '').toString().slice(-6)}</p>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`shrink-0 self-start rounded-full border px-4 py-2 text-center text-sm font-bold whitespace-nowrap ${getStatusColor(complaint.status)}`}>
          <span className="mr-1">{getStatusIcon(complaint.status)}</span>
          {complaint.status}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4">{complaint.description}</p>

      {/* Meta Info */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-t border-b border-gray-200 mb-4 text-sm">
        <div>
          <p className="text-gray-600">Submitted</p>
          <p className="font-medium text-gray-900">
            {complaint.submittedAt ||
              (complaint.createdAt
                ? new Date(complaint.createdAt).toLocaleDateString()
                : '—')}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Anonymous</p>
          <p className="font-medium text-gray-900">
            {complaint.anonymous ? '✓ Yes' : '✗ No'}
          </p>
        </div>
        {complaint.resolvedAt && (
          <div>
            <p className="text-gray-600">Resolved</p>
            <p className="font-medium text-gray-900">{complaint.resolvedAt}</p>
          </div>
        )}
      </div>

      {/* Response (if available) */}
      {(complaint.response || complaint.adminRemarks) && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p className="text-xs font-bold text-primary mb-2">💬 Admin Response</p>
          <p className="text-sm text-gray-700">{complaint.response || complaint.adminRemarks}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="flex-1 border border-primary text-primary py-2 rounded-lg hover:bg-blue-50 font-medium transition">
          View Details
        </button>
        {complaint.status === 'Pending' && (
          <button className="flex-1 bg-danger text-white py-2 rounded-lg hover:bg-red-600 font-medium transition">
            Withdraw
          </button>
        )}
      </div>
    </div>
  );
}