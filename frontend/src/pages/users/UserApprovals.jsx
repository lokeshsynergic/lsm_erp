import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import "../../styles/main.css";
import { getPendingApprovals, approveUser, rejectUser } from "../../services/users/userService";

function UserApprovals() {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [rejectingUserId, setRejectingUserId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPendingApprovals();
      console.log("Pending approvals fetched:", data);
      setPendingUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching pending approvals:", err);
      setError(err.message || "Error loading pending approvals");
      setPendingUsers([]);
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (id) => {
    navigate(`/users/edit/${id}`);
  };
  const handleApprove = async (userId) => {
    try {
      setError("");
      setSuccessMessage("");
      const adminId = localStorage.getItem("user_id") || "admin";
      await approveUser(userId, adminId);
      setSuccessMessage("User approved successfully!");
      fetchPendingApprovals(); // Refresh list
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error approving user:", err);
      setError(err.message || "Error approving user");
    }
  };

  const handleReject = async (userId) => {
    if (!rejectionReason.trim()) {
      setError("Please provide a rejection reason");
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      await rejectUser(userId, rejectionReason);
      setSuccessMessage("User rejected successfully!");
      setRejectingUserId(null);
      setRejectionReason("");
      fetchPendingApprovals(); // Refresh list
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error rejecting user:", err);
      setError(err.message || "Error rejecting user");
    }
  };

  return (
    <Layout>
      <div className="data-list-table-wrap">
        <div className="data-list-heading">
          <div>
            <span>Admin</span>
            <h1>Pending User Approvals</h1>
          </div>
        </div>

        {loading && <p>Loading...</p>}
        
        {error && (
          <p style={{ color: "red", padding: "12px", backgroundColor: "#fee", borderRadius: "6px", margin: "12px 0" }}>
            ⚠️ {error}
          </p>
        )}

        {successMessage && (
          <p style={{ color: "green", padding: "12px", backgroundColor: "#efe", borderRadius: "6px", margin: "12px 0" }}>
            ✓ {successMessage}
          </p>
        )}

        {/* Stats Section */}
        <div style={{ marginBottom: "20px", color: "#666" }}>
          <p>Total Pending: <strong>{pendingUsers.length}</strong></p>
        </div>

        {/* Pending Users Table */}
        {pendingUsers.length > 0 ? (
          <table className="table-container">
            <thead>
              <tr>
                <th>User ID</th>
                <th>User Type</th>
                <th>Mode</th>
                <th>Registration Date</th>
                <th>Actions</th>
              </tr>
            </thead>
              <tbody>
                {pendingUsers.map((user, index) => (
                  <React.Fragment key={user.id || index}>
                    <tr>
                      <td>{user.user_id}</td>
                      <td>{user.usertype || "N/A"}</td>
                      <td>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            backgroundColor:
                              user.usermode === "W" ? "#e3f2fd" : "#f3e5f5",
                            color: user.usermode === "W" ? "#1976d2" : "#7b1fa2",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {user.usermode === "W" ? "Web" : "Mobile"}
                        </span>
                      </td>
                      <td>
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {/* <button
                            type="button"
                            onClick={() => handleApprove(user.id)}
                            className="action-btn approve-btn"
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "#4CAF50",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                          >
                            Approve
                          </button> */}
                          {/* <button
                            type="button"
                            onClick={() => setRejectingUserId(user.id)}
                            className="action-btn reject-btn"
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "#f44336",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                          >
                            Reject
                          </button> */}
                           <button
                        className="edit-btn"
                        onClick={() => handleEdit(user.id)}
                        title="Edit User"
                      ></button>
                        </div>
                      </td>
                    </tr>

                    {/* Rejection Reason Row */}
                    {rejectingUserId === user.id && (
                      <tr style={{ backgroundColor: "#fef8f8" }}>
                        <td colSpan="5" style={{ padding: "16px" }}>
                          <div>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                              Rejection Reason:
                            </label>
                            <textarea
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              placeholder="Enter reason for rejection..."
                              style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                fontFamily: "inherit",
                                fontSize: "14px",
                                minHeight: "60px",
                                marginBottom: "12px",
                              }}
                            />
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                type="button"
                                onClick={() => handleReject(user.id)}
                                style={{
                                  padding: "8px 16px",
                                  backgroundColor: "#f44336",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                }}
                              >
                                Confirm Reject
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setRejectingUserId(null);
                                  setRejectionReason("");
                                }}
                                style={{
                                  padding: "8px 16px",
                                  backgroundColor: "#ccc",
                                  color: "#333",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            !loading && (
              <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                No pending user approvals
              </div>
            )
          )}
      </div>
    </Layout>
  );
}

export default UserApprovals;
