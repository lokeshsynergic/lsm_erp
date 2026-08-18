import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import "../../styles/employeeAdd.css";
import { getMobileUsers } from "../../services/users/userService";

function MobileUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMobileUsers();
  }, []);

  const fetchMobileUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMobileUsers();
      console.log("Mobile Users fetched:", data);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching mobile users:", err);
      setError(err.message || "Error loading mobile users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="employee-add">
        {/* Breadcrumb Header */}
        <div className="employee-add-breadcrumb">
          <span>Users</span>
          <span className="separator">›</span>
          <span>Mobile Users</span>
        </div>

        {error && (
          <div
            style={{
              padding: "12px 16px",
              marginBottom: "16px",
              backgroundColor: "#fee",
              color: "#c33",
              borderRadius: "6px",
              border: "1px solid #fcc",
            }}
          >
            Error: {error}
          </div>
        )}

        {loading && (
          <div
            style={{
              padding: "12px 16px",
              marginBottom: "16px",
              backgroundColor: "#f0f0f0",
              color: "#666",
              borderRadius: "6px",
              border: "1px solid #ddd",
            }}
          >
            ⏳ Loading mobile users...
          </div>
        )}

        {/* Page Heading */}
        <div className="employee-add-heading">
          <div>
            <h1>Mobile Users</h1>
            <p>Total Users: {users.length}</p>
          </div>
        </div>

        {/* Users Table */}
        <div style={{ marginTop: "20px", overflowX: "auto" }}>
          {!loading && users.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f5f5f5",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: "600",
                    }}
                  >
                    User ID
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: "600",
                    }}
                  >
                    User Type
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: "600",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: "600",
                    }}
                  >
                    Created Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user.id || index}
                    style={{ borderBottom: "1px solid #eee" }}
                  >
                    <td style={{ padding: "12px" }}>{user.user_id}</td>
                    <td style={{ padding: "12px" }}>{user.usertype || "N/A"}</td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor: user.user_status === 'A'
                            ? "#efe"
                            : "#fee",
                          color: user.user_status === 'A' ? "#3c3" : "#c33",
                          fontSize: "12px",
                        }}
                      >
                        {user.user_status === 'A' ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : !loading && (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#999",
              }}
            >
              No mobile users found
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default MobileUsers;
