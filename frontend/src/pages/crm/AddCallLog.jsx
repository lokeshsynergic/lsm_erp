import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/employeeAdd.css"; 
import { PDFDownloadLink } from '@react-pdf/renderer';

import { saveCalllog, getCalllogById } from "../../services/crm/call_log";
import { getEmployee } from "../../services/hrms/employeeService";

const tabs = [
  "Call Details",
  "Equipment Details",
  "Service Details",
  "Action Taken",
  "Spare Parts Used",
];

function AddCallLog() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [showServiceType, setShowServiceType] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [employees, setEmployees] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    callNo: "",
    date: new Date().toISOString().split('T')[0],
    customer: "",
    department: "",
    contact_person: "",
    mobile: "",
    service_provider_type: "OWN",
    engineer: "",
    vendor_name: "",
    equipment_name: "",
    make: "",
    model: "",
    serial_no: "",
    asset_id: "",
    service_type: "",
    complaint_reported: "",
    action_taken: "",
    spare_parts: "",
    equipment_status: "",
    coverage_mode: "",
    priority: "",
    service_close_dttime: "",
  });

  // Fetch employees for dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployee();
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  // Load call log if editing
  useEffect(() => {
    console.log("useEffect triggered with id:", id);
    if (id) {
      loadCallLog();
    }
  }, [id]);

  const loadCallLog = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Loading call log with ID:", id);
      const data = await getCalllogById(id);
      console.log("Call log data loaded:", data);
      
      // Format datetime field for datetime-local input
      const formattedData = {
        ...data,
        call_no: data.call_no || "",
        call_date: data.call_date || "",
        service_close_dttime: data.service_close_dttime 
          ? new Date(data.service_close_dttime).toISOString().slice(0, 16)
          : "",
      };
      
      setFormData(formattedData);
      setIsSaved(true);
    } catch (err) {
      console.error("Error loading call log:", err);
      setError(err.response?.data?.message || err.message || "Error loading call log");
      setIsSaved(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsSaved(false);
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      serviceType: checked
        ? [...prev.serviceType, value]
        : prev.serviceType.filter((item) => item !== value),
    }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      
      // Convert datetime-local to ISO UTC format for backend
      const dataToSave = {
        ...formData,
        service_close_dttime: formData.service_close_dttime
          ? new Date(formData.service_close_dttime).toISOString()
          : null,
      };
      
      const response = await saveCalllog(dataToSave, id);
      setIsSaved(true);
      
      // Navigate back to call log list after successful save
      setTimeout(() => {
        navigate("/crm/call-log");
      }, 1500);
    } catch (err) {
      setError(err.message || "Error saving call log");
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="employee-add">
        {/* Breadcrumb Header */}
        <div className="employee-add-breadcrumb">
          <span>CRM</span>
          <span className="separator">›</span>
          <span>Call Log</span>
          <span className="separator">›</span>
          <span>{id ? "Edit" : "New"} Call Log</span>
        </div>

        {error && (
          <div style={{ 
            padding: "12px 16px", 
            marginBottom: "16px", 
            backgroundColor: "#fee", 
            color: "#c33", 
            borderRadius: "6px",
            border: "1px solid #fcc"
          }}>
            Error: {error}
          </div>
        )}

        {isSaved && !saving && (
          <div style={{ 
            padding: "12px 16px", 
            marginBottom: "16px", 
            backgroundColor: "#efe", 
            color: "#3c3", 
            borderRadius: "6px",
            border: "1px solid #cfc"
          }}>
            ✓ Call log saved successfully!
          </div>
        )}

        {loading && id && (
          <div style={{ 
            padding: "12px 16px", 
            marginBottom: "16px", 
            backgroundColor: "#f0f0f0", 
            color: "#666", 
            borderRadius: "6px",
            border: "1px solid #ddd"
          }}>
            ⏳ Loading call log data...
          </div>
        )}

        <>
            {/* <PDFDownloadLink
              document={<CallLogPDF formData={formData} />}
              fileName="Call_Log.pdf"
              style={{ textDecoration: 'none' }}
            >
              {({ loading }) => (
                <button className="save-btn" style={{ backgroundColor: '#0F172A', color: '#FFF' }}>
                  {loading ? 'Generating PDF...' : 'Download PDF'}
                </button>
              )}
            </PDFDownloadLink> */}

            {/* Page Heading & Actions */}
            <div className="employee-add-heading">
              <div>
                <h1>{id ? "Edit" : "New"} Call Log</h1>
                <span className={`not-saved-badge ${isSaved ? "saved" : ""}`}>
                  {isSaved ? "Saved" : "Not Saved"}
                </span>
              </div>
              <button 
                type="button" 
                className="save-btn" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="employee-add-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`employee-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Form Container */}
            <div className="employee-add-form">
          {/* Tab 1: Call Details */}
          {activeTab === "Call Details" && (
            <div className="form-grid">
              {id && (
              <div className="form-field">
                <label>
                  Call Log No
                </label>
                <p><b>{formData.call_no}</b></p>
              
              </div>
              )}
              <div className="form-field">
                <label>
                  Hospital / Customer <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="customer"
                  value={formData.customer}
                  onChange={handleInputChange}
                  placeholder="Enter hospital or customer name"
                />
              </div>

              <div className="form-field">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Enter department"
                />
              </div>

              <div className="form-field">
                <label>Contact Person</label>
                <input
                  type="text"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleInputChange}
                  placeholder="Enter contact person name"
                />
              </div>

              <div className="form-field">
                <label>Mobile</label>
                <input
                  type="number"
                  name="mobile"
                  value={formData.mobile}
                  maxLength={10}
                  onInput={(e) => {
                    if (e.target.value.length > 10) {
                      e.target.value = e.target.value.slice(0, 10);
                    }
                  }}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number"
                />
              </div>

              
              <div className="form-field">
                <label>Equipment Status</label>
                <select
                  name="equipment_status" required
                  value={formData.equipment_status}
                  onChange={handleInputChange}
                >
                  <option value="">-- Select Equipment Status --</option>
                  <option value="Open">Open</option>
                  <option value="Inprogress">Inprogress</option>
                  <option value="Spareout">Spare Out</option>
                  <option value="Close">Close</option>
                </select>
              </div>

              <div className="form-field">
                <label>Coverage Mode</label>
                <select
                  name="coverage_mode" required
                  value={formData.coverage_mode}
                  onChange={handleInputChange}
                >
                  <option value="">-- Select Coverage Mode --</option>
                  <option value="Warranty">Warranty</option>
                  <option value="AMC">AMC</option>
                  <option value="CMC">CMC</option>
                  <option value="Out of Coverage">Out of Coverage</option>
                </select>
              </div>

              <div className="form-field">
                <label>Service Provider Type <span className="required">*</span></label>
                <div style={{ display: "flex", gap: "20px", marginTop: "8px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="radio"
                      name="service_provider_type"
                      value="OWN"
                      checked={formData.service_provider_type === "OWN"}
                      onChange={handleInputChange}
                    />
                    Own Engineer
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="radio"
                      name="service_provider_type"
                      value="VENDOR"
                      checked={formData.service_provider_type === "VENDOR"}
                      onChange={handleInputChange}
                    />
                    Vendor
                  </label>
                </div>
              </div>

              {formData.service_provider_type === "OWN" && (
                <div className="form-field">
                  <label>Engineer <span className="required">*</span></label>
                  <select
                    name="engineer" required
                    value={formData.engineer}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Select Engineer --</option>
                    {employees.map((emp) => (
                      <option key={emp.emp_code} value={emp.emp_code}>
                        {emp.first_name} {emp.last_name} {emp.last_name} ({emp.emp_code})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.service_provider_type === "VENDOR" && (
                <div className="form-field">
                  <label>Vendor Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="vendor_name"
                    value={formData.vendor_name}
                    onChange={handleInputChange}
                    placeholder="Enter vendor name"
                  />
                </div>
              )}

              <div className="form-field">
                <label>Priority</label>
                <select
                  name="priority" required
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="">-- Select Priority --</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>
          )}

          {/* Tab 2: Equipment Details */}
          {activeTab === "Equipment Details" && (
            <div className="form-grid">
              <div className="form-field">
                <label>Equipment Name</label>
                <input
                  type="text"
                  name="equipment_name"
                  value={formData.equipment_name}
                  onChange={handleInputChange}
                  placeholder="Enter equipment name"
                />
              </div>

              <div className="form-field">
                <label>Make</label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  placeholder="Enter make"
                />
              </div>

              <div className="form-field">
                <label>Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="Enter model"
                />
              </div>

              <div className="form-field">
                <label>Serial No</label>
                <input
                  type="text"
                  name="serial_no"
                  value={formData.serial_no}
                  onChange={handleInputChange}
                  placeholder="Enter serial number"
                />
              </div>

              <div className="form-field">
                <label>Asset ID</label>
                <input
                  type="text"
                  name="asset_id"
                  value={formData.asset_id}
                  onChange={handleInputChange}
                  placeholder="Enter asset ID"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Service Details */}
          {activeTab === "Service Details" && (
            <>
              <div className="form-grid">
                <div className="form-field full-width">
                  <label>Complaint Reported</label>
                  <textarea
                    name="complaint_reported"
                    rows="4"
                    value={formData.complaint_reported}
                    onChange={handleInputChange}
                    placeholder="Enter complaint details"
                  />
                </div>
              </div>

              {/* Collapsible Section for Service Types */}
              <div className="form-section">
                <div className="form-grid">

                   <div className="form-field">
                     <label>Service Types</label>
                      <div className="checkbox-group" >
                        <select name="service_type" value={formData.service_type} onChange={handleInputChange} required>
                          <option value="">Please select</option>
                        <option value="Breakdown">Breakdown</option>
                        <option value="PM">PM</option>
                        <option value="Installation">Installation</option>
                        <option value="Calibration">Calibration</option>
                        <option value="Inspection">Inspection</option>
                        </select>
                        </div>
                  </div>

                   <div className="form-field">
                        <label>Service Close Date and Time</label>
                        <input
                          type="datetime-local"
                          name="service_close_dttime"
                          value={formData.service_close_dttime}
                          onChange={handleInputChange}
                          placeholder="Enter service close date and time"
                        />
                    </div>
                     
                </div>
                <div className="form-grid">
                      
                </div>
                 
              </div>
            </>
          )}
          {activeTab === "Action Taken" && (
            <>
              <div className="form-grid">
                <div className="form-field full-width">
                  <label>Action Taken</label>
                  <textarea
                    name="action_taken"
                    rows="4"
                    value={formData.action_taken}
                    onChange={handleInputChange}
                    placeholder="Enter action taken"
                  />
                </div>
              </div>

              {/* Collapsible Section for Service Types */}
              <div className="form-section">
                <button
                  type="button"
                  className="section-toggle"
                  onClick={() => setShowServiceType((open) => !open)}
                >
                </button>

              </div>
            </>
          )}
          {activeTab === "Spare Parts Used" && (
            <>
              <div className="form-grid">
                <div className="form-field full-width">
                  <label>Spare Parts Details</label>
                  <textarea
                    name="spare_parts"
                    rows="4"
                    value={formData.spare_parts}
                    onChange={handleInputChange}
                    placeholder="Enter spare parts details"
                  />
                </div>
              </div>

              {/* Collapsible Section for Service Types */}
              <div className="form-section">
                <button
                  type="button"
                  className="section-toggle"
                  onClick={() => setShowServiceType((open) => !open)}
                >
                </button>

              </div>
            </>
          )}

          
            </div>
          </>
      </div>
    </Layout>
  );
}

export default AddCallLog;