import { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEvents({ limit: 20 });
      setEvents(data.events);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.location || !formData.date) {
      toast.error('All fields are required');
      return;
    }

    try {
      await eventService.createEvent(formData);
      toast.success('Event created! Pending admin approval.');
      setShowModal(false);
      setFormData({ title: '', description: '', location: '', date: '' });
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await eventService.registerForEvent(eventId);
      toast.success('Registered for event!');
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🎯 Campus Events</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition"
        >
          + Create Event
        </button>
      </div>

      {/* Events Grid */}
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-4">{event.description}</p>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-500">
                  📍 {event.location}
                </p>
                <p className="text-sm text-gray-500">
                  📅 {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  👥 {event.registrations} registered
                </p>
              </div>

              <button
                onClick={() => handleRegister(event._id)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg hover:shadow-lg transition"
              >
                ✅ Register
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No events yet. Check back later!</p>
        </div>
      )}

      {/* Create Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Event</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Event Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <textarea
                name="description"
                placeholder="Event Description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;