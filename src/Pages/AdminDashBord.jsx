import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function AdminDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventData, setEventData] = useState({
    eventName: '',
    eventId: '',
    eventPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (eventData.eventName && eventData.eventId && eventData.eventPassword) {
      setEvents(prev => [...prev, { 
        eventName: eventData.eventName, 
        eventId: eventData.eventId 
      }]);
      setShowModal(false);
      setEventData({ eventName: '', eventId: '', eventPassword: '' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                AdminDashboard
              </h1>
            </div>

            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium hover:shadow-lg"
            >
              <Plus size={20} />
              Create New Event
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {event.eventName}
              </h3>
              <p className="text-gray-600">
                <span className="font-medium">Event ID:</span> {event.eventId}
              </p>
            </div>
          ))}
        </div>
      </div>

      
      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Create New Event</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    value={eventData.eventName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter event name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event ID
                  </label>
                  <input
                    type="text"
                    name="eventId"
                    value={eventData.eventId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter event ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Password
                  </label>
                  <input
                    type="password"
                    name="eventPassword"
                    value={eventData.eventPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter event password"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}