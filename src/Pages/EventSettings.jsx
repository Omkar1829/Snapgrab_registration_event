  import React, { useState, useEffect } from "react";
  import { ArrowLeft, Pencil, X, Trash2 } from "lucide-react";
  import { useNavigate, useLocation } from "react-router-dom";
  import axios from "axios";
  const AVAILABLE_FIELDS = [
    { id: 1,
      fieldKey: "Name", 
      label: "Full Name", 
      type: "text",
        required: true 
      },
    { id: 2,
      fieldKey: "Email", 
      label: "Email Address", 
      type: "email" 
      },
    { id: 3, 
      fieldKey: "City", 
      label: "City", 
      type: "text" 
    },
    {
      id: 4,
      fieldKey: "Gender",
      label: "Gender",
      type: "dropdown",
      options: ["Male", "Female", "Other"],
    },
    { id: 5,
      fieldKey: "Phone", 
      label: "Phone Number", 
      type: "number" 
      },
    { id: 6, 
      fieldKey: "EmpID", 
      label: "Employee ID", 
      type: "text" 
    },
    { id: 7, 
      fieldKey: "Spouse", 
      label: "Married / Spouse", 
      type: "checkbox" 
    },
    {
      id: 8,
      fieldKey: "NumberOfChildrens",
      label: "Number of Children",
      type: "number",
    },
    { id: 9, 
      fieldKey: "Others", 
      label: "Other Information", 
      type: "text" 
    },
    { id: 10, 
      fieldKey: "Designation",
      label: "Designation",
        type: "text" 
      },
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
    const [boothType, setBoothType] = useState("stdregistration");
    ;


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
    const [booths, setBooths] = useState([]);

    const [newBoothName, setNewBoothName] = useState("");
    const [allowMultiple, setAllowMultiple] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
const [dragActive, setDragActive] = useState(false);
const [selectedFile, setSelectedFile] = useState(null);
 


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



     useEffect(() => {
    if (!selectedEvent?.ID) return;

    const fetchBooths = async () => {
      try {
        console.log(selectedEvent, 'ID')
        const response = await axios.get(
          `http://192.168.1.106:3070/api/activity?EventId=${selectedEvent.EventId}`
        );

        setBooths(response.data.data); 
      } catch (error) {
        console.error("Error fetching booths:", error);
      }
    };

    fetchBooths();
  }, [selectedEvent, booths]);


    const handleSave = async () => {
      try {
        const payload = {
          Name: tempEventInfo.eventName,
          Location: tempEventInfo.Location,
          Password: tempEventInfo.eventPassword,
        };

        const res = await axios.put(
          `http://192.168.1.106:3070/api/events/${selectedEvent.ID}`,
          payload
        );

      
 
        
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

    const handleAddBooth = async () => {
  if (!newBoothName.trim()) return;

  const payload = {
    EventID: selectedEvent.EventId,
    Name: newBoothName.trim(),
    Type: boothType,
    AllowMultiScan: allowMultiple,
  };

  try {
    await axios.post(
      "http://192.168.1.106:3070/api/activity/create",
      payload
    );
      console.log(selectedEvent, 'ID')
    
    const res = await axios.get(
      `http://192.168.1.106:3070/api/activity?EventId=${selectedEvent.EventId}`
    );

    setBooths(res.data.data);
    setShowBoothModal(false);
    setNewBoothName("");
    setAllowMultiple(false);
    setBoothType("stdregistration");
  } catch (err) {
    console.error("Booth create failed", err);
  }
};

  const handleDeleteBooth = async (Id) => {
 
  if (window.confirm("Are you sure you want to delete this booth?")) {
    try {
      
      await axios.delete(`http://192.168.1.106:3070/api/activity/${Id}`);

      
      setBooths((prev) => prev.filter((booth) => booth.Id !== Id));
      
      alert("Booth deleted successfully!");
    } catch (error) {
      console.error("Error deleting booth:", error);
      alert("Failed to delete booth. Please try again.");
    }
  }
};


const handleCSVUpload = async () => {
  if (!selectedFile) return;

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
   
    await axios.post(`http://192.168.1.106:3070/api/qrregistration/bulk-upload?EventID=${selectedEvent.EventId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("CSV Uploaded Successfully!");
    setShowUploadModal(false);
    setSelectedFile(null);
  } catch (err) {
    console.error("Upload failed", err);
    alert("Failed to upload CSV. Please check the file format.");
  }
};

const handleDownloadTemplate = async () => {
  try {
    
    const response = await axios.get("http://192.168.1.106:3070/api/qrregistration/csv-template", {
      responseType: 'blob', 
    });

    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    
    link.setAttribute('download', 'attendee_template.csv'); 
    
    document.body.appendChild(link);
    link.click();
    
    
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Template download failed:", error);
    alert("Could not download template. Please try again later.");
  }
};




    return (
      <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
        
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
              <div className="absolute right-0 flex items-center gap-2">
  
  <button
    onClick={() => setShowUploadModal(true)}
    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium shadow-md"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
    <span className="hidden sm:inline">Upload CSV</span>
  </button>
</div>
              <div className="absolute right-0 flex items-center gap-2">
 
</div>

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

          <div className="hidden md:block w-1/3 bg-white overflow-auto">
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
                    <div className="flex items-center justify-between gap-2">
    <span className="text-gray-800 font-semibold text-xs truncate">
      {booth.Name}
    </span>

    <div className="flex items-center gap-2">
      
      <button className="text-indigo-600 hover:text-indigo-700">
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
            d="M3 10h18M3 14h18"
          />
        </svg>
      </button>

                  
      <button
        onClick={() => handleDeleteBooth(booth.ID)}
        className="text-red-500 hover:text-red-600"
      >
        <Trash2 size={14} />
      </button>
    </div>
  </div>



                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl">
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
              <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
    Booth Type
  </label>

  <select
    value={boothType}
    onChange={(e) => setBoothType(e.target.value)}
    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
  >
    <option value="stdregistration">STD Registration</option>
    <option value="vipregistration">VIP Registration</option>
    <option value="checkin">Check In</option>
  </select>

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
                  onClick={handleAddBooth}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  Add
                </button>
              </div>

            
            </div>
            <div>
              
            </div>
          </div>
        )}

        {/* CSV Upload Modal */}
{showUploadModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Upload Attendees (CSV)</h3>
        <button onClick={() => { setShowUploadModal(false); setSelectedFile(null); }} className="text-gray-400 hover:text-gray-600">
          <X size={22} />
        </button>
      </div>

      <div className="p-6">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              setSelectedFile(e.dataTransfer.files[0]);
            }
          }}
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all text-center ${
            dragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400"
          } ${selectedFile ? "bg-green-50 border-green-400" : ""}`}
        >
          <input
            type="file"
            accept=".csv"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          
          <div className="space-y-3">
            <div className="flex justify-center">
              {selectedFile ? (
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              ) : (
                <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              )}
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-700">
                {selectedFile ? selectedFile.name : "Drag and drop your CSV file here"}
              </p>
              <p className="text-gray-500">or click to browse files</p>
            </div>
          </div>
        </div>

        {selectedFile && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-2 text-sm text-blue-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" /></svg>
            Make sure your CSV columns match the event fields.
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end items-center gap-3">
  {/* Download Template Button - Cancel ke starting mein */}
  <button
    onClick={handleDownloadTemplate}
    className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm font-semibold mr-auto"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
    Download Template
  </button>

  <button
    onClick={() => {
      setShowUploadModal(false);
      setSelectedFile(null);
    }}
    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
  >
    Cancel
  </button>
  
  <button
    disabled={!selectedFile}
    onClick={handleCSVUpload}
    className={`px-6 py-2 rounded-lg font-semibold transition-all shadow-md ${
      selectedFile 
        ? "bg-indigo-600 text-white hover:bg-indigo-700" 
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
  >
    Upload Now
  </button>
</div>
    </div>
  </div>
)}
      </div>
    );
  };

  export default EventSettings;
