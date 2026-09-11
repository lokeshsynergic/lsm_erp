import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
import "../../../styles/department.css";
import "../../../styles/main.css";
import avtrimage from "../../../image/user_sample.jpg";
import { getEmployeeAttendance } from "../../../services/hrms/employeeService";

function UsersAtten() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    fetchAllUsers();
  }, []);


  const empCode = window.location.pathname.split("/").pop();
 
  const handleFilterSubmit = async (e) => {
    e.preventDefault(); 
    try {
      setLoading(true);
      setError("");
      const data = await getEmployeeAttendance(empCode, fromDate, toDate);
      console.log("All Users fetched:", data);
      setUsers(Array.isArray(data) ? data : []);
      setFilteredUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Error loading users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getEmployeeAttendance(empCode);
      console.log("All Users fetched:", data);
      setUsers(Array.isArray(data) ? data : []);
      setFilteredUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Error loading users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="data-list-table-wrap">
        <div className="data-list-heading">
          <div>
            <span>Users Daily Attendance <span style={{ color: "blue" }}> CODE: {empCode}</span></span>

             <form className="calendar-filter-form" onSubmit={handleFilterSubmit}>
    <div className="filter-group">
      <label htmlFor="fromDate">From:</label>
      <input
        type="date"
        id="fromDate"
        className="filter-date-input"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />
    </div>

    <div className="filter-group">
      <label htmlFor="toDate">To:</label>
      <input
        type="date"
        id="toDate"
        className="filter-date-input"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />
    </div>

    <button type="submit" className="filter-submit-btn">
      Submit
    </button>
  </form>
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red", padding: "12px" }}>Error: {error}</p>}
        {/* Users Table */}
        {filteredUsers.length > 0 ? (
          <table className="table-container">
            <thead>
              <tr>
                <th>SL NO</th>
                <th>Date </th>
                <th>In Time</th>
                <th>In Address</th>
                <th>In Picture</th>
                <th>Out Time</th>
                <th>Out Address</th>
                <th>Out Picture</th>
                <th>Working Hours</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id || index}>
                  <td>{index + 1}</td>
                  <td> {user.indatetime
                      ? new Date(user.indatetime).toLocaleDateString()
                      : "N/A"}</td>
                  <td> {user.indatetime
                      ? new Date(user.indatetime).toLocaleTimeString()
                      : "N/A"}</td>
                  <td>{user.in_address}</td>
                  <td><img
  src={user.in_picture_url ? `${process.env.REACT_APP_API_END_POINT}/${user.in_picture_url}` : avtrimage}
  alt="In" height="50" width="50"
/></td>
                  <td> {user.out_dttime
                      ? new Date(user.out_dttime).toLocaleTimeString()
                      : "N/A"}</td>
                  <td>{user.out_address}</td>
                  <td><img
  src={user.out_picture_url ? `${process.env.REACT_APP_API_END_POINT}/${user.out_picture_url}` : avtrimage}
  alt="Out" height="50" width="50"
/></td>
                  <td>{user.working_hours || "N/A"}</td>
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

export default UsersAtten;
