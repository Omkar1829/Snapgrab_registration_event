import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function AdminDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
      const navigate = useNavigate();


  const [eventData, setEventData] = useState({
    CreatedON: new Date().toISOString(),
    Name: '',
    Password: '',
    Location: '',
    role: 'Admin',
  });

  const handleDelete = (e, index) => {
    e.stopPropagation();
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setEventData((prev) => ({
        ...prev
      }));
    } else {
      setEventData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

 const handleSubmit = async () => {
  if (!eventData.Name || !eventData.Password) return;

  const payload = {
    Name: eventData.Name,
    EventId: "EVT07",               // default
    Password: eventData.Password,
    Location: eventData.Location,
    Role: eventData.role,
  };

  try {
    const res = await fetch("http://192.168.0.66:3070/api/events/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Event creation failed");
    }

    const savedEvent = await res.json();

    
    setEvents((prev) => [...prev, savedEvent]);

   

    setShowModal(false);
  } catch (error) {
    console.error("Create event error:", error);
  }
};



  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://192.168.0.66:3070/api/events/');
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);


  const displayRole = (role) => {
    if (!role) return 'None selected';
    
    
    if (typeof role === 'string') {
      return role.charAt(0).toUpperCase() + role.slice(1);
    }
    
    
    if (typeof role === 'object') {
      const selectedRoles = Object.keys(role)
        .filter((key) => role[key])
        .map((key) => key.charAt(0).toUpperCase() + key.slice(1));
      
      return selectedRoles.length > 0 ? selectedRoles.join(', ') : 'None selected';
    }
    
    return 'None selected';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              AdminDashboard
            </h1>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 font-medium hover:shadow-lg"
            >
              <Plus size={20} />
              <span className="hidden sm:block">Create New Event</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <div
              key={index}
               onClick={() => navigate("/EventSettings/${Id}")}
              className="relative bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            >
              <button
                onClick={(e) => handleDelete(e, index)}
                className="absolute top-3 right-3 text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {event.Name}
              </h3>

              <p className="text-gray-600 mb-1">
                <span className="font-medium">Location:</span>{' '}
                {event.Location || 'Not specified'}
              </p>

              <div className="mt-3">
                <span className="text-sm font-medium text-gray-700">Role: </span>
                <span className="text-sm text-indigo-600 font-medium">
                  {displayRole(event.Role || event.role)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-screen overflow-y-auto mx-4">
            <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Create New Event
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="px-4 sm:px-6 py-4">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    name="Name"
                    value={eventData.Name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter event name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Password
                  </label>
                  <input
                    type="password"
                    name="Password"
                    value={eventData.Password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter event password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="Location"
                    value={eventData.Location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter event location"
                  />
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
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