import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import "../../styles/callLog.css";

function CallLog() {
  const navigate = useNavigate();
  const [callLogs] = React.useState([
    {
      id: 1,
      contactName: "John Doe",
      phoneNumber: "123-456-7890",
      callDate: "2024-08-04",
      callTime: "10:30 AM",
      duration: "5 mins",
      notes: "Discussed project requirements",
      status: "Completed",
    },
    {
      id: 2,
      contactName: "Jane Smith",
      phoneNumber: "098-765-4321",
      callDate: "2024-08-03",
      callTime: "2:15 PM",
      duration: "12 mins",
      notes: "Follow-up on previous meeting",
      status: "Completed",
    },
  ]);

  return (
    <Layout>
      <div className="call-log-container">
        <h1>Call Log</h1>
        <div className="call-log-actions">
          <button 
            className="btn-new-call"
            onClick={() => navigate("/crm/call-log/add")}
          >
            + New Call
          </button>
        </div>

        <table className="call-log-table">
          <thead>
            <tr>
              <th>Contact Name</th>
              <th>Phone Number</th>
              <th>Date</th>
              <th>Time</th>
              <th>Duration</th>
              <th>Notes</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {callLogs.map((log) => (
              <tr key={log.id}>
                <td className="table-cell">{log.contactName}</td>
                <td className="table-cell">{log.phoneNumber}</td>
                <td className="table-cell">{log.callDate}</td>
                <td className="table-cell">{log.callTime}</td>
                <td className="table-cell">{log.duration}</td>
                <td className="table-cell">{log.notes}</td>
                <td className="table-cell">
                  <span className={`status ${log.status.toLowerCase()}`}>
                    {log.status}
                  </span>
                </td>
                <td className="table-cell">
                  <button className="btn-edit">Edit</button>
                  <button className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default CallLog;
