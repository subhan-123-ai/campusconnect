export default function EventCard({ event }) {
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{event.icon}</div>
        <span className="bg-primary bg-opacity-10 text-primary text-xs px-3 py-1 rounded-full font-bold">
          {event.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
        {event.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {event.description}
      </p>

      {/* Event Details */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <span>📅</span>
          <span>{formatDate(event.date)}</span>
          <span>•</span>
          <span>{event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <span>📍</span>
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <span>👥</span>
          <span>{event.attendees} people interested</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <span>🎯</span>
          <span>By {event.organizer}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 border-t border-gray-200 pt-4 sm:flex-row">
        <button type="button" className="flex-1 rounded-lg bg-primary py-2 font-medium text-white transition hover:bg-blue-600">
          Register
        </button>
        <button type="button" className="flex-1 rounded-lg border border-primary py-2 font-medium text-primary transition hover:bg-blue-50">
          Learn More
        </button>
      </div>
    </div>
  );
}