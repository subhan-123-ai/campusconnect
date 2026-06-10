export default function StudentCard({ student }) {
  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="text-5xl">{student.avatar}</div>
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">⭐</span>
          <span className="font-bold text-gray-900">{student.rating}</span>
          <span className="text-xs text-gray-600">({student.reviews})</span>
        </div>
      </div>

      {/* Name & Info */}
      <h3 className="text-lg font-bold text-gray-900 mb-1">{student.name}</h3>
      <p className="text-sm text-gray-600 mb-3">{student.bio}</p>

      {/* Details */}
      <div className="space-y-1 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Department:</span>
          <span className="font-bold text-primary">{student.department}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Semester:</span>
          <span className="font-bold text-primary">{student.semester}</span>
        </div>
      </div>

      {/* Subjects */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-600 mb-2">Subjects:</p>
        <div className="flex flex-wrap gap-2">
          {student.subjects.map(subject => (
            <span
              key={subject}
              className="bg-blue-100 text-primary text-xs px-2 py-1 rounded"
            >
              {subject}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="button" className="flex-1 rounded-lg bg-primary py-2 font-medium text-white transition hover:bg-blue-600">
          Connect
        </button>
        <button type="button" className="flex-1 rounded-lg border border-primary py-2 font-medium text-primary transition hover:bg-blue-50">
          View
        </button>
      </div>
    </div>
  );
}