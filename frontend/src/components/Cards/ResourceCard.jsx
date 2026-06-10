export default function ResourceCard({ resource }) {
  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{resource.icon}</div>
        <span className="bg-blue-100 text-primary text-xs px-3 py-1 rounded-full font-bold">
          Sem {resource.semester}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
        {resource.title}
      </h3>

      {/* Subject & Uploader */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subject:</span>
          <span className="font-bold text-primary">{resource.subject}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Uploaded by:</span>
          <span className="font-medium text-gray-900">{resource.uploader}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Date:</span>
          <span className="text-gray-600">{resource.uploadedAt}</span>
        </div>
      </div>

      {/* Download Stats */}
      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📥</span>
            <span>{resource.downloads} downloads</span>
          </div>
          <div className="flex gap-2">
            <button className="⭐">
              
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="button" className="flex-1 rounded-lg bg-primary py-2 font-medium text-white transition hover:bg-blue-600">
          📥 Download
        </button>
        <button type="button" className="flex-1 rounded-lg border border-primary py-2 font-medium text-primary transition hover:bg-blue-50">
          👁️ Preview
        </button>
      </div>
    </div>
  );
}