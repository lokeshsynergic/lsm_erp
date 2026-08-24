import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import "../../styles/department.css";
import "../../styles/main.css";
import { getAllUsers } from "../../services/users/userService";

function Userslist() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all"); // "all", "W" (web), "M" (mobile)

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, userTypeFilter]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllUsers();
      console.log("All Users fetched:", data);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Error loading users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((user) =>
        user.user_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // User type filter
    if (userTypeFilter !== "all") {
      filtered = filtered.filter((user) => user.usermode === userTypeFilter);
    }

    setFilteredUsers(filtered);
  };

  return (
    <Layout>
      <div className="data-list-table-wrap">
        <div className="data-list-heading">
          <div>
            <span>Admin</span>
            <h1>Users</h1>
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red", padding: "12px" }}>Error: {error}</p>}

        {/* Search and Filter Section */}
        <div className="filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <button
              onClick={() => setUserTypeFilter("all")}
              className={`filter-btn ${userTypeFilter === "all" ? "active" : ""}`}
            >
              All Users
            </button>
            <button
              onClick={() => setUserTypeFilter("W")}
              className={`filter-btn ${userTypeFilter === "W" ? "active" : ""}`}
            >
              Web Users
            </button>
            <button
              onClick={() => setUserTypeFilter("M")}
              className={`filter-btn ${userTypeFilter === "M" ? "active" : ""}`}
            >
              Mobile Users
            </button>
          </div>
        </div>

        {/* Users Table */}
        {filteredUsers.length > 0 ? (
          <table className="table-container">
            <thead>
              <tr>
                <th>User ID</th>
                <th>User Type</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Approval</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id || index}>
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
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: user.user_status === "A"
                          ? "#efe"
                          : "#fee",
                        color: user.user_status === "A" ? "#3c3" : "#c33",
                        fontSize: "12px",
                      }}
                    >
                      {user.user_status === "A" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: user.is_approved ? "#efe" : "#fee",
                        color: user.is_approved ? "#3c3" : "#c33",
                        fontSize: "12px",
                      }}
                    >
                      {user.is_approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading && (
            <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
              No users found
            </div>
          )
        )}
      </div>
    </Layout>
  );
}

export default Userslist;
