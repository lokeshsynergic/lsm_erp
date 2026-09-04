import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import "../../styles/employeeList.css";
import "../../styles/main.css";
import { getEmployee } from "../../services/hrms/employeeService";

function EmployeeList() {
  const [employeeData, setEmployeeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, A (active), I (inactive)
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterDesignation, setFilterDesignation] = useState("all");
  const [sortBy, setSortBy] = useState("name"); // name, joining_date, department
  const [sortOrder, setSortOrder] = useState("asc"); // asc, desc

  // Extract unique departments and designations
  const departments = ["all", ...new Set(employeeData.map((emp) => emp.department).filter(Boolean))];
  const designations = ["all", ...new Set(employeeData.map((emp) => emp.designation).filter(Boolean))];

  const handleEdit = (id) => {
    navigate(`/hrms/employee/edit/${id}`);
  };

  const handleStatusToggle = async (emp_id, currentStatus) => {
    try {
      const newStatus = currentStatus === "A" ? "I" : "A";
      // Assuming the API supports PATCH or PUT to update status
      // For now, we'll just update the local state
      const updatedData = employeeData.map((emp) =>
        emp.emp_id === emp_id ? { ...emp, status: newStatus } : emp
      );
      setEmployeeData(updatedData);
      console.log(`Employee ${emp_id} status changed to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update employee status:", err);
    }
  };

  useEffect(() => {
    loadEmployee();
  }, []);

  const loadEmployee = async () => {
    try {
      setLoading(true);
      const data = await getEmployee({});
      setEmployeeData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...employeeData];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.emp_code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((emp) => emp.status === filterStatus);
    }

    // Department filter
    if (filterDepartment !== "all") {
      filtered = filtered.filter((emp) => emp.department === filterDepartment);
    }

    // Designation filter
    if (filterDesignation !== "all") {
      filtered = filtered.filter((emp) => emp.designation === filterDesignation);
    }

    // Sorting
    filtered.sort((a, b) => {
      let compareA, compareB;

      switch (sortBy) {
        case "name":
          compareA = (a.first_name + a.last_name).toLowerCase();
          compareB = (b.first_name + b.last_name).toLowerCase();
          break;
        case "joining_date":
          compareA = new Date(a.date_of_joining).getTime();
          compareB = new Date(b.date_of_joining).getTime();
          break;
        case "department":
          compareA = a.department?.toLowerCase() || "";
          compareB = b.department?.toLowerCase() || "";
          break;
        case "designation":
          compareA = a.designation?.toLowerCase() || "";
          compareB = b.designation?.toLowerCase() || "";
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

    setFilteredData(filtered);
  }, [employeeData, searchTerm, filterStatus, filterDepartment, filterDesignation, sortBy, sortOrder]);

  return (
    <Layout>
      <div className="department-list-table-wrap">
        <div className="department-list-heading">
          <div>
            <span>HRMS</span>
            <h1>Employee</h1>
          </div>
          <NavLink to="/hrms/employee/new" className="add-btn">
            + Add Employee
          </NavLink>
        </div>

        {/* Search and Filter Section */}
        <div className="filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, code..."
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
              <option value="A">Active</option>
              <option value="I">Inactive</option>
            </select>

            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                dept !== "all" && <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={filterDesignation}
              onChange={(e) => setFilterDesignation(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Designations</option>
              {designations.map((desig) => (
                desig !== "all" && <option key={desig} value={desig}>{desig}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Sort by Name</option>
              <option value="joining_date">Sort by Joining Date</option>
              <option value="department">Sort by Department</option>
              <option value="designation">Sort by Designation</option>
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
                setFilterDepartment("all");
                setFilterDesignation("all");
                setSortBy("name");
                setSortOrder("asc");
              }}
            >
              Reset
            </button>
          </div>

          <div className="results-count">
            Showing {filteredData.length} of {employeeData.length} employees
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Status</th>
                <th>Date of Joining</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((employee) => (
                  <tr key={employee.emp_code}>
                    <td className="table-cell">{employee.emp_code}</td>
                    <td className="table-cell">
                      {employee.first_name} {employee.middle_name} {employee.last_name}
                    </td>
                    <td className="table-cell">{employee.department}</td>
                    <td className="table-cell">{employee.designation}</td>
                    <td className="table-cell">
                      <button
                        className={`status-badge ${employee.status.toLowerCase()}`}
                        onClick={() => handleStatusToggle(employee.emp_id, employee.status)}
                        title="Click to toggle status"
                      >
                        {employee.status === "A" ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="table-cell">
                      {employee.date_of_joining
                        ? new Date(employee.date_of_joining).toLocaleDateString("en-GB")
                        : ""}
                    </td>
                    <td className="table-cell">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(employee.emp_id)}
                        title="Edit Employee"
                      ></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default EmployeeList;
