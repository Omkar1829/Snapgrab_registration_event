import React, { useState, useEffect } from "react";
import { ArrowLeft, Pencil, X ,  Trash2} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
const AVAILABLE_FIELDS = [
  { id: 1, fieldKey: "Name", label: "Full Name", type: "text", required: true },
  { id: 2, fieldKey: "Email", label: "Email Address", type: "email" },
  { id: 3, fieldKey: "City", label: "City", type: "text" },
  {
    id: 4,
    fieldKey: "Gender",
    label: "Gender",
    type: "dropdown",
    options: ["Male", "Female", "Other"],
  },
  { id: 5, fieldKey: "Phone", label: "Phone Number", type: "number" },
  { id: 6, fieldKey: "EmpID", label: "Employee ID", type: "text" },
  { id: 7, fieldKey: "Spouse", label: "Married / Spouse", type: "checkbox" },
  {
    id: 8,
    fieldKey: "NumberOfChildrens",
    label: "Number of Children",
    type: "number",
  },
  { id: 9, fieldKey: "Others", label: "Other Information", type: "text" },
  { id: 10, fieldKey: "Designation", label: "Designation", type: "text" },
  {
    id: 11,
    fieldKey: "Type",
    label: "Registration Type",
    type: "dropdown",
    options: ["Employee", "Family", "Guest"],
  },
];

const EventSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedEvent = location.state;

  const [showEditModal, setShowEditModal] = useState(false);
  const [showBoothModal, setShowBoothModal] = useState(false);
  const [eventInfo, setEventInfo] = useState({
    eventName: selectedEvent?.Name || "",
    eventPassword: selectedEvent?.Password || "",
    Location: selectedEvent?.Location || "",
  });
  const [tempEventInfo, setTempEventInfo] = useState({
    eventName: "",
    eventPassword: "",
    Location: "",
  });
  const [selectedFields, setSelectedFields] = useState([]);
  const [booths, setBooths] = useState([{ id: 1, name: "Booth 1" }]);
  const [newBoothName, setNewBoothName] = useState("");
  const [allowMultiple, setAllowMultiple] = useState(false);

  const handleEditClick = () => {
    setTempEventInfo({
      eventName: eventInfo.eventName,
      Location: eventInfo.Location,
      eventPassword: "",
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempEventInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        Name: tempEventInfo.eventName,
        Location: tempEventInfo.Location,
        Password: tempEventInfo.eventPassword,
      };

      const res = await axios.put(
        `http://192.168.0.66:3070/api/events/${selectedEvent.ID}`,
        payload
      );

      // UI update after success
      setEventInfo({
        eventName: res.data.Name,
        location: res.data.Location,
      });

      setShowEditModal(false);
    } catch (error) {
      console.error("Event update failed:", error.response || error.message);
    }
  };

  const handleFieldToggle = (fieldKey) => {
    setSelectedFields((prev) =>
      prev.includes(fieldKey)
        ? prev.filter((key) => key !== fieldKey)
        : [...prev, fieldKey]
    );
  };

  const handleAddBooth = () => {
    if (newBoothName.trim()) {
      const newBooth = { id: booths.length + 1, name: newBoothName.trim() };
      setBooths([...booths, newBooth]);
      setNewBoothName("");
      setShowBoothModal(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
      {/* Navbar */}
      <div className="bg-white shadow-sm flex-shrink-0 border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between relative">
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        <div className="w-full lg:w-2/3 overflow-auto border-r border-gray-200">
          <div className="p-4 sm:p-6 space-y-4">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 sm:p-5">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Event Name
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={eventInfo.eventName}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed font-medium text-sm"
                />
                <button
                  onClick={handleEditClick}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all whitespace-nowrap font-semibold text-sm"
                >
                  <Pencil size={16} />
                  Edit
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 sm:p-5">
              <h2 className="text-base font-bold text-gray-800 mb-4">
                Registration Fields
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVAILABLE_FIELDS.map((field) => (
                  <label
                    key={field.id}
                    className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field.fieldKey)}
                      onChange={() => handleFieldToggle(field.fieldKey)}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                      {field.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-1/3 bg-white overflow-auto">
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-gray-800">Booths</h2>
              <button
                onClick={() => setShowBoothModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-xs font-semibold"
              >
                Add Booth
              </button>
            </div>

          <div className="space-y-2">
  {booths.map((booth) => (
    <div
      key={booth.id}
      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200 shadow-lg"
    >
      <div className="flex items-center">
        {/* Booth Name */}
        <span className="text-gray-800 font-semibold text-sm truncate mr-2">
          {booth.name}
        </span>

        {/* Icons – name ke bilkul baaju */}
        <div className="flex items-center gap-1 ml-auto">
          <button className="text-indigo-600 hover:text-indigo-700">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>

          <button
            onClick={() => handleDeleteBooth(booth.id)}
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  ))}
</div>


          </div>
        </div>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold text-gray-800">Booths</h2>
            <button
              onClick={() => setShowBoothModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-xs font-semibold"
            >
              Add Booth
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {booths.map((booth) => (
              <div
                key={booth.id}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 border border-gray-200 shadow-lg flex-shrink-0 min-w-[120px]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-800 font-semibold text-xs truncate">
                    {booth.name}
                  </span>
                  <button className="text-indigo-600 hover:text-indigo-700 flex-shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                Edit Event Details
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={22} />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  name="eventName"
                  value={tempEventInfo.eventName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="Enter event name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Password
                </label>
                <input
                  type="password"
                  name="eventPassword"
                  value={tempEventInfo.eventPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Location
                </label>
                <input
                  type="text"
                  name="Location"
                  value={tempEventInfo.Location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="Enter new Location"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showBoothModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Add New Booth
            </h2>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Booth Name
            </label>
            <input
              type="text"
              value={newBoothName}
              onChange={(e) => setNewBoothName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="Enter booth name"
            />

            <div className="flex items-center justify-between mt-6">
              <span className="text-sm font-medium text-gray-700">
                Allow multiple
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowMultiple}
                  onChange={(e) => setAllowMultiple(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => {
                  setShowBoothModal(false);
                  setNewBoothName("");
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClick={handleAddBooth}
                }}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventSettings;
