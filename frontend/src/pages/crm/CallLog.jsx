import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { pdf } from '@react-pdf/renderer';
import Layout from "../../components/Layout";
import "../../styles/department.css";
import "../../styles/main.css";
import { getCalllog } from "../../services/crm/call_log";
import { CallLogPDF } from "./CallLogPDF";

function CallLog() {
  const navigate = useNavigate();
  const [callLogs, setCallLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterEquipment, setFilterEquipment] = useState("all");
  const [sortBy, setSortBy] = useState("call_no");
  const [sortOrder, setSortOrder] = useState("asc");

  // Extract unique equipment names and statuses
  const equipmentNames = ["all", ...new Set(callLogs.map((log) => log.equipment_name || log.equipmentName).filter(Boolean))];
  const statuses = ["all", ...new Set(callLogs.map((log) => log.equipment_status).filter(Boolean))];

  useEffect(() => {
    loadCallLogs();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...callLogs];

    // Search filter (search in call_no, customer, contact person, mobile)
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.call_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (log.customer || log.customer_name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (log.contactPerson || log.contact_person)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (log.mobile || log.mobile_number)?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((log) => log.equipment_status === filterStatus);
    }

    // Equipment filter
    if (filterEquipment !== "all") {
      filtered = filtered.filter(
        (log) => (log.equipment_name || log.equipmentName) === filterEquipment
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let compareA, compareB;

      switch (sortBy) {
        case "call_no":
          compareA = a.call_no?.toLowerCase() || "";
          compareB = b.call_no?.toLowerCase() || "";
          break;
        case "customer":
          compareA = (a.customer || a.customer_name)?.toLowerCase() || "";
          compareB = (b.customer || b.customer_name)?.toLowerCase() || "";
          break;
        case "status":
          compareA = a.equipment_status?.toLowerCase() || "";
          compareB = b.equipment_status?.toLowerCase() || "";
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
  }, [callLogs, searchTerm, filterStatus, filterEquipment, sortBy, sortOrder]);

  const loadCallLogs = async () => {
    try {
      setLoading(true);
      const data = await getCalllog({});
      // Handle if data is an array or object
      const logsArray = Array.isArray(data) ? data : data.data || [];
      setCallLogs(logsArray);
    } catch (err) {
      setError(err.message || "Error loading call logs");
      console.error("Error loading call logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/crm/call-log/edit/${id}`);
  };

  const handlePrint = async (log) => {
    try {
      // Format data for PDF
      const formattedData = {
        callNo: log.call_no,
        date: log.date || new Date().toLocaleDateString(),
        hospital: log.customer || log.customer_name,
        department: log.department,
        contactPerson: log.contactPerson || log.contact_person,
        mobile: log.mobile || log.mobile_number,
        engineer: log.engineer || log.service_call_engineer_name,
        equipmentName: log.equipmentName || log.equipment_name,
        make: log.make,
        model: log.model,
        serialNo: log.serial_no || log.serialNo,
        assetId: log.asset_id || log.assetId,
        complaintReported: log.complaintReported || log.complaint_reported,
        actionTaken: log.action_taken || log.actionTaken,
        spareParts: log.spare_parts || log.spareParts,
        status: log.equipment_status,
      };

      // Generate PDF blob
      const pdfBlob = await pdf(
        <CallLogPDF formData={formattedData} />
      ).toBlob();

      // Create URL from blob and open in new window
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');

      // Clean up the URL after opening
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  // const handleDelete = (id) => {
  //   if (window.confirm("Are you sure you want to delete this call log?")) {
  //     // Add delete functionality here
  //     console.log("Delete call log:", id);
  //   }
  // };

  return (
    <Layout>
      <div className="department-list">
        <div className="department-list-heading">
          <div>
            <span>CRM</span>
            <h1>Call Log</h1>
          </div>

          <NavLink to="/crm/call-log/add" className="add-btn">
            + Add Call Log
          </NavLink>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red", padding: "12px" }}>Error: {error}</p>}

        {/* Search and Filter Section */}
        <div className="filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by call no, customer, contact, mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="Open">Open</option>
              <option value="Close">Close</option>
              <option value="Inprogress">Inprogress</option>
              <option value="Spareout">Spareout</option>
              {statuses.map((status) => (
                status !== "all" && status !== "Open" && status !== "Close" && status !== "Inprogress" && status !== "Spareout" && <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={filterEquipment}
              onChange={(e) => setFilterEquipment(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Equipment</option>
              {equipmentNames.map((equipment) => (
                equipment !== "all" && <option key={equipment} value={equipment}>{equipment}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="call_no">Sort by Call No</option>
              <option value="customer">Sort by Customer</option>
              <option value="status">Sort by Status</option>
            </select>

            <button
              className="sort-order-btn"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>

            <button
              className="reset-btn"
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
                setFilterEquipment("all");
                setSortBy("call_no");
                setSortOrder("asc");
              }}
            >
              Reset
            </button>
          </div>

          <div className="results-count">
            Showing {filteredLogs.length} of {callLogs.length} call logs
          </div>
        </div>

        {!loading && filteredLogs.length > 0 && (
          <div className="department-list-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>SL No</th>
                  <th>Call No</th>
                  <th>Customer Name</th>
                  <th>Contact Person</th>
                  <th>Mobile</th>
                  <th>Equipment Name</th>
                  <th>Complaint Reported</th>
                  <th>Engineer</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr key={log.id || index}>
                    <td className="table-cell">{index + 1}</td>
                    <td className="table-cell">{log.call_no || "-"}</td>
                    <td className="table-cell">{log.customer || log.customer_name || "-"}</td>
                    <td className="table-cell">{log.contactPerson || log.contact_person || "-"}</td>
                    <td className="table-cell">{log.mobile || log.mobile_number || "-"}</td>
                    <td className="table-cell">{log.equipmentName || log.equipment_name || "-"}</td>
                    <td className="table-cell">{log.complaintReported || log.complaint_reported || "-"}</td>

                    <td className="table-cell">{log.engineer || log.service_call_engineer_name || "-"}</td>
                    <td className="table-cell">
                      <span className={`status-badge ${
                        log.equipment_status === 'Close' ? 'close' :
                        log.equipment_status === 'Open' ? 'open' : 'other'
                      }`}>
                        {log.equipment_status || "-"}
                      </span>
                    </td>
                    <td className="table-cell action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(log.id)}
                        title="Edit"
                      >
                      </button>
                      <button
                        className="print-btn"
                        onClick={() => handlePrint(log)}
                        title="Print"
                      >
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredLogs.length === 0 && !error && (
          <p style={{ textAlign: "center", padding: "20px" }}>No call logs found</p>
        )}
      </div>
    </Layout>
  );
}

export default CallLog;
