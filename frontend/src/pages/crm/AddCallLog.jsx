import React, { useState } from "react";
import Layout from "../../components/Layout";
import "../../styles/employeeAdd.css"; 
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CallLogPDF } from './CallLogPDF';// Using the same styling structure as EmployeeAdd

const tabs = [
  "Call Details",
  "Equipment Details",
  "Service Details",
  "Action Taken",
  "Spare Parts Used",
  "Equipment Status",
];

function AddCallLog() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [showServiceType, setShowServiceType] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    callNo: "",
    date: "",
    hospital: "",
    department: "",
    contactPerson: "",
    mobile: "",
    engineer: "",
    equipmentName: "",
    make: "",
    model: "",
    serialNo: "",
    assetId: "",
    serviceType: [],
    complaintReported: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      serviceType: checked
        ? [...prev.serviceType, value]
        : prev.serviceType.filter((item) => item !== value),
    }));
  };

  const handleSave = () => {
    console.log("Form Data:", formData);
    // Handle form submit logic here
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
          <span>New Call Log</span>
        </div>
        <PDFDownloadLink
  document={<CallLogPDF formData={formData} />}
  fileName="Call_Log.pdf"
  style={{ textDecoration: 'none' }}
>
  {({ loading }) => (
    <button className="save-btn" style={{ backgroundColor: '#0F172A', color: '#FFF' }}>
      {loading ? 'Generating PDF...' : 'Download PDF'}
    </button>
  )}
</PDFDownloadLink>

        {/* Page Heading & Actions */}
        <div className="employee-add-heading">
          <div>
            <h1>New Call Log</h1>
            <span className="not-saved-badge">Not Saved</span>
          </div>
          <button type="button" className="save-btn" onClick={handleSave}>
            Save
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
              <div className="form-field">
                <label>
                  Call No <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="callNo"
                  value={formData.callNo}
                  onChange={handleInputChange}
                  placeholder="Enter call number"
                />
              </div>

              <div className="form-field">
                <label>
                  Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-field">
                <label>
                  Hospital / Customer <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="hospital"
                  value={formData.hospital}
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
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="Enter contact person name"
                />
              </div>

              <div className="form-field">
                <label>Mobile</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number"
                />
              </div>

              <div className="form-field">
                <label>Engineer</label>
                <input
                  type="text"
                  name="engineer"
                  value={formData.engineer}
                  onChange={handleInputChange}
                  placeholder="Enter engineer name"
                />
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
                  name="equipmentName"
                  value={formData.equipmentName}
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
                  name="serialNo"
                  value={formData.serialNo}
                  onChange={handleInputChange}
                  placeholder="Enter serial number"
                />
              </div>

              <div className="form-field">
                <label>Asset ID</label>
                <input
                  type="text"
                  name="assetId"
                  value={formData.assetId}
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
                    name="complaintReported"
                    rows="4"
                    value={formData.complaintReported}
                    onChange={handleInputChange}
                    placeholder="Enter complaint details"
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
                  Service Types
                  <span className={`chevron ${showServiceType ? "open" : ""}`}>
                    ⌃
                  </span>
                </button>

                {showServiceType && (
                  <div className="checkbox-group" style={{ padding: "16px 0", display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    {["Breakdown", "PM", "Installation", "Calibration", "Inspection"].map((type) => (
                      <label key={type} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          value={type}
                          checked={formData.serviceType.includes(type)}
                          onChange={handleCheckboxChange}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          {activeTab === "Action Taken" && (
            <>
              <div className="form-grid">
                <div className="form-field full-width">
                  <label>Action Taken</label>
                  <textarea
                    name="actionTaken"
                    rows="4"
                    value={formData.actionTaken}
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
                    name="sparePartsDetails"
                    rows="4"
                    value={formData.sparePartsDetails}
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

          {activeTab === "Equipment Status" && (
            <>
           
               <div className="form-grid">
                <button
                  type="button"
                  className="section-toggle"
                  onClick={() => setShowServiceType((open) => !open)}
                >
                  Equipment Status
                  <span className={`chevron ${showServiceType ? "open" : ""}`}>
                   
                  </span>
                </button>

                {showServiceType && (
                  <div className="checkbox-group" style={{ padding: "16px 0", display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    {["Breakdown", "PM", "Installation", "Calibration", "Inspection"].map((type) => (
                      <label key={type} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          value={type}
                          checked={formData.serviceType.includes(type)}
                          onChange={handleCheckboxChange}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default AddCallLog;