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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCallLogs();
  }, []);

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

        {!loading && callLogs.length > 0 && (
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
                {callLogs.map((log, index) => (
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

        {!loading && callLogs.length === 0 && !error && (
          <p style={{ textAlign: "center", padding: "20px" }}>No call logs found</p>
        )}
      </div>
    </Layout>
  );
}

export default CallLog;
