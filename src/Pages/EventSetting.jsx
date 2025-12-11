import React, { useState } from 'react';
import { ArrowLeft, Pencil, X } from 'lucide-react';

const EventSettings = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [eventInfo, setEventInfo] = useState({
    eventName: 'Tech Summit 2024',
    eventPassword: ''
  });
  const [tempEventInfo, setTempEventInfo] = useState({
    eventName: '',
    eventPassword: ''
  });

  const handleEditClick = () => {
    setTempEventInfo({
      eventName: eventInfo.eventName,
      eventPassword: ''
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempEventInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    console.log('Going back to dashboard');
  };

  const handleSave = () => {
    if (tempEventInfo.eventName) {
      setEventInfo({
        eventName: tempEventInfo.eventName,
        eventPassword: tempEventInfo.eventPassword || eventInfo.eventPassword
      });
    }
    setShowEditModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between relative">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm sm:text-base"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl sm:text-2xl font-bold text-gray-900">
              Settings
            </h1>
            <div className="w-16 sm:w-24"></div>
          </div>
        </div>
      </div>

      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Event Name Card */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Name
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={eventInfo.eventName}
                readOnly
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
              />
              <button
                onClick={handleEditClick}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 whitespace-nowrap"
              >
                <Pencil size={18} />
                Edit
              </button>
            </div>
          </div>
        </div>

        
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Registration Fields</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500" />
              <span className="text-gray-700 font-medium">Name</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500" />
              <span className="text-gray-700 font-medium">Email</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500" />
              <span className="text-gray-700 font-medium">City</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500" />
              <span className="text-gray-700 font-medium">Gender</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500" />
              <span className="text-gray-700 font-medium">Event ID</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500" />
              <span className="text-gray-700 font-medium">Phone</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500" />
              <span className="text-gray-700 font-medium">Emp ID</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500" />
              <span className="text-gray-700 font-medium">Spouse</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500" />
              <span className="text-gray-700 font-medium">Number Of Childrens</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500" />
              <span className="text-gray-700 font-medium">Other</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500" />
              <span className="text-gray-700 font-medium">Designation Type</span>
            </label>
          </div>
        </div>
      </div>

      
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Edit Event Details</h3>
              <button
                onClick={() => setShowEditModal(false)}
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
                    value={tempEventInfo.eventName}
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
                    name="eventPassword"
                    value={tempEventInfo.eventPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter new password"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventSettings;