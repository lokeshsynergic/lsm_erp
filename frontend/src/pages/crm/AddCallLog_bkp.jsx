import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import "../../styles/addCallLog.css";

function AddCallLog() {
  const navigate = useNavigate();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Handle form submission
    navigate("/crm/call-log");
  };

  const handleCancel = () => {
    navigate("/crm/call-log");
  };

  return (
    <Layout>
      <div className="add-call-log-container">
        <div className="page-header">
          <h1>Add Call Log</h1>
        </div>

        <form onSubmit={handleSubmit} className="call-log-form">
          {/* Call Details Section */}
          <div className="form-section">
            <h2 className="section-title">Call Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="callNo">Call No</label>
                <input
                  type="text"
                  id="callNo"
                  name="callNo"
                  value={formData.callNo}
                  onChange={handleInputChange}
                  placeholder="Enter call number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="hospital">Hospital/Customer</label>
                <input
                  type="text"
                  id="hospital"
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleInputChange}
                  placeholder="Enter hospital or customer name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Enter department"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactPerson">Contact Person</label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="Enter contact person name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="mobile">Mobile</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="engineer">Engineer</label>
                <input
                  type="text"
                  id="engineer"
                  name="engineer"
                  value={formData.engineer}
                  onChange={handleInputChange}
                  placeholder="Enter engineer name"
                />
              </div>
            </div>
          </div>

          {/* Equipment Details Section */}
          <div className="form-section">
            <h2 className="section-title">Equipment Details</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="equipmentName">Equipment Name</label>
                <input
                  type="text"
                  id="equipmentName"
                  name="equipmentName"
                  value={formData.equipmentName}
                  onChange={handleInputChange}
                  placeholder="Enter equipment name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="make">Make</label>
                <input
                  type="text"
                  id="make"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  placeholder="Enter make"
                />
              </div>

              <div className="form-group">
                <label htmlFor="model">Model</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="Enter model"
                />
              </div>

              <div className="form-group">
                <label htmlFor="serialNo">Serial No</label>
                <input
                  type="text"
                  id="serialNo"
                  name="serialNo"
                  value={formData.serialNo}
                  onChange={handleInputChange}
                  placeholder="Enter serial number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="assetId">Asset ID</label>
                <input
                  type="text"
                  id="assetId"
                  name="assetId"
                  value={formData.assetId}
                  onChange={handleInputChange}
                  placeholder="Enter asset ID"
                />
              </div>
            </div>
          </div>

          {/* Service Details Section */}
          <div className="form-section">
            <h2 className="section-title">Service Details</h2>

            <div className="form-group full-width">
              <label>Service Type</label>
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="breakdown"
                    name="serviceType"
                    value="Breakdown"
                    checked={formData.serviceType.includes("Breakdown")}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="breakdown">Breakdown</label>
                </div>

                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="pm"
                    name="serviceType"
                    value="PM"
                    checked={formData.serviceType.includes("PM")}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="pm">PM</label>
                </div>

                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="installation"
                    name="serviceType"
                    value="Installation"
                    checked={formData.serviceType.includes("Installation")}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="installation">Installation</label>
                </div>

                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="calibration"
                    name="serviceType"
                    value="Calibration"
                    checked={formData.serviceType.includes("Calibration")}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="calibration">Calibration</label>
                </div>

                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="inspection"
                    name="serviceType"
                    value="Inspection"
                    checked={formData.serviceType.includes("Inspection")}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="inspection">Inspection</label>
                </div>
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="complaintReported">Complaint Reported</label>
              <textarea
                id="complaintReported"
                name="complaintReported"
                value={formData.complaintReported}
                onChange={handleInputChange}
                placeholder="Enter complaint details"
                rows="5"
              ></textarea>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              Save Call Log
            </button>
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default AddCallLog;
