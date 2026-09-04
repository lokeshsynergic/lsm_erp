import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Layout from "../../../components/Layout";
import "../../../styles/department.css";
import "../../../styles/main.css";
import { getvisitlog, updateVisitReview } from "../../../services/crm/activity";

function VisitLog() {
  const navigate = useNavigate();
  const [visitLogs, setVisitLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Filter States
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [empCode, setEmpCode] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [visitOutcome, setVisitOutcome] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dateTimeOfVisit");
  const [sortOrder, setSortOrder] = useState("desc");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [reviewStatus, setReviewStatus] = useState("");
  const [remarks, setRemarks] = useState("");

  // Load data on component mount
  useEffect(() => {
    loadVisitLogs();
  }, []);

  // Apply filters and sorting when filters change
  useEffect(() => {
    applyFilters();
  }, [visitLogs, fromDate, toDate, empCode, organizationName, visitOutcome, searchTerm, sortBy, sortOrder]);

  const loadVisitLogs = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Build query params only for provided filters
      const params = new URLSearchParams();
      if (fromDate) params.append("from_date", fromDate);
      if (toDate) params.append("to_date", toDate);
      if (empCode) params.append("emp_code", empCode);
      if (visitOutcome) params.append("outcome", visitOutcome);
      if (organizationName) params.append("organization", organizationName);
      
      const logsArray = await getvisitlog(
        fromDate || "",
        toDate || "",
        empCode || "",
        visitOutcome || ""
      );
      
      setVisitLogs(logsArray || []);
    } catch (err) {
      setError(err.message || "Error loading visit logs");
      console.error("Error loading visit logs:", err);
      setVisitLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...visitLogs];

    // Organization filter
    if (organizationName) {
      filtered = filtered.filter(
        (log) =>
          log.organizationName?.toLowerCase().includes(organizationName.toLowerCase())
      );
    }

    // Search filter (searches across multiple fields)
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.nameOfEmployee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.product?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let compareA, compareB;

      switch (sortBy) {
        case "dateTimeOfVisit":
          compareA = new Date(a.dateTimeOfVisit || 0);
          compareB = new Date(b.dateTimeOfVisit || 0);
          break;
        case "nameOfEmployee":
          compareA = a.nameOfEmployee?.toLowerCase() || "";
          compareB = b.nameOfEmployee?.toLowerCase() || "";
          break;
        case "organizationName":
          compareA = a.organizationName?.toLowerCase() || "";
          compareB = b.organizationName?.toLowerCase() || "";
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return compareA < compareB ? -1 : compareA > compareB ? 1 : 0;
      } else {
        return compareA > compareB ? -1 : compareA < compareB ? 1 : 0;
      }
    });

    setFilteredLogs(filtered);
  };

  const handleEdit = (id) => {
    navigate(`/crm/activity/visit-log/edit/${id}`);
  };

  const handleActionClick = (log) => {
    setSelectedVisit(log);
    setReviewStatus(log.visitReviewStatus || "");
    setRemarks(log.remarks || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVisit(null);
    setReviewStatus("");
    setRemarks("");
  };

  const handleModalSubmit = async () => {
    try {
      if (!reviewStatus || !remarks) {
        alert("Please fill in all required fields (Review Status and Remarks)");
        return;
      }

      // Call API to update visit review
      await updateVisitReview(
        selectedVisit.visitId,
        reviewStatus,
        remarks
      );

      // Show success message
      alert("Visit review updated successfully!");
      closeModal();
      
      // Reload data after update
      loadVisitLogs();
    } catch (err) {
      console.error("Error updating visit:", err);
      alert("Error updating visit. Please try again.");
    }
  };

  const getOutcomeColor = (outcome) => {
    const colorMap = {
      success: "#10b981",
      pending: "#f59e0b",
      failed: "#ef4444",
      qualified: "#3b82f6",
      rejected: "#dc2626",
      duplicate: "#8b5cf6",
      "on hold": "#6b7280",
    };
    return colorMap[outcome?.toLowerCase()] || "#6b7280";
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setEmpCode("");
    setOrganizationName("");
    setVisitOutcome("");
    setSearchTerm("");
    setSortBy("dateTimeOfVisit");
    setSortOrder("desc");
  };

  return (
    <Layout>
      <div className="department-list">
      

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red", padding: "12px" }}>Error: {error}</p>}

    
        <div className="department-list-table-wrap">

              <div className="department-list-heading">
          <div>
            <span>CRM</span>
            <h1>Visit Log</h1>
          </div>

          <NavLink to="/crm/activity/visit-log/add" className="add-btn">
            + Add Visit
          </NavLink>
        </div>
          {/* Filter Controls */}
          <div className="filter-section">
            <div className="filter-row-top">
              <div className="date-input-group">
                <label>From Date:</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="date-input"
                />
              </div>
              <div className="date-input-group">
                <label>To Date:</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="date-input"
                />
              </div>
              <div className="search-box">
              <input
                type="text"
                placeholder="Search by employee, organization, product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            </div>

            

            <div className="filter-controls">
              <input
                type="text"
                placeholder="Employee Code"
                value={empCode}
                onChange={(e) => setEmpCode(e.target.value)}
                className="filter-select"
              />

              <input
                type="text"
                placeholder="Organization"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="filter-select"
              />

              <select
                value={visitOutcome}
                onChange={(e) => setVisitOutcome(e.target.value)}
                className="filter-select"
              >
                <option value="">All Outcomes</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Qualified">Qualified</option>
                <option value="Rejected">Rejected</option>
                <option value="Duplicate">Duplicate</option>
                <option value="On Hold">On Hold</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="dateTimeOfVisit">Sort by Date</option>
                <option value="nameOfEmployee">Sort by Employee</option>
                <option value="organizationName">Sort by Organization</option>
              </select>

              <button
                className="sort-order-btn"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>

              <button className="reset-btn" onClick={handleReset}>
                Reset
              </button>
            </div>

            <div className="results-count">
              Showing {filteredLogs.length} of {visitLogs.length} visit logs
            </div>
          </div>

          {/* Table Section */}
          {!loading && filteredLogs.length > 0 && (
            <table className="department-table">
              <thead>
                <tr>
                  <th>Sl.No.</th>
                  <th>Date & Time of Visit</th>
                  <th>Employee Name</th>
                  <th>Organization Name</th>
                  <th>Product</th>
                  <th>Visit Outcome</th>
                  <th>Review Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.visitId}>
                    <td className="table-cell">{log.slNo}</td>
                    <td className="table-cell">
                      {log.dateTimeOfVisit
                        ? new Date(log.dateTimeOfVisit).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="table-cell">{log.nameOfEmployee || "N/A"}</td>
                    <td className="table-cell">{log.organizationName || "N/A"}</td>
                    <td className="table-cell">{log.product || "N/A"}</td>
                    <td className="table-cell">
                      <span
                        className="badge"
                        style={{
                          backgroundColor: getOutcomeColor(log.visitOutcome),
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {log.visitOutcome || "N/A"}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`status-badge ${log.visitReviewStatus?.toLowerCase().replace(/\s+/g, '-')}`}>
                        {log.visitReviewStatus || "N/A"}
                      </span>
                    </td>
                    <td className="table-cell action-buttons">
                      <button
                        className="action-btn"
                        title="Review Visit"
                        onClick={() => handleActionClick(log)}
                      ></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && filteredLogs.length === 0 && visitLogs.length === 0 && (
            <div className="empty-state-content">
              <p>No visit logs found. Start by adding a new visit.</p>
            </div>
          )}

          {!loading && filteredLogs.length === 0 && visitLogs.length > 0 && (
            <div className="empty-state-content">
              <p>No visit logs match your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedVisit && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Review Visit Log</h2>
              <button className="modal-close-btn" onClick={closeModal}>×</button>
            </div>

            <div className="modal-body">
              {/* Readonly Fields */}
              <div className="modal-section">
                <div className="form-group">
                  <label>Discussion Notes :</label>
                  <textarea
                    className="form-input readonly"
                    value={selectedVisit.discussionNotes || "N/A"}
                    readOnly
                    rows="4"
                  />
                </div>

                <div className="form-row">
                  <div className="" style={{ flex: "0 0 50%" }}>
                    <label>Expected Value :</label>
                    <input
                      type="text"
                      className="form-input readonly"
                      value={selectedVisit.expectedValue || "N/A"}
                      readOnly
                    />
                  </div>

                  <div className="" style={{ flex: "1" }}>
                    <label>Review Status *</label>
                    <select
                      className="form-input"
                      value={reviewStatus}
                      onChange={(e) => setReviewStatus(e.target.value)}
                    >
                      <option value="">Select Review Status</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Duplicate">Duplicate</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Remarks *</label>
                  <textarea
                    className="form-input"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter remarks or notes"
                    rows="4"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn-submit" onClick={handleModalSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default VisitLog;
