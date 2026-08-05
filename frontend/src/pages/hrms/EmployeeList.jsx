import { NavLink } from "react-router-dom";
import Layout from "../../components/Layout";
import employeeData from "../../data/employeeData";
import "../../styles/employeeList.css";

function EmployeeList() {
  return (
    <Layout>
      <div className="employee-list">
        <div className="employee-list-heading">
          <div>
            <span>HRMS</span>
            <h1>Employee</h1>
          </div>
          <NavLink to="/hrms/employee/new" className="add-employee-btn">
            + Add Employee
          </NavLink>
        </div>

        <div className="employee-list-table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Status</th>
                <th>Date of Joining</th>
              </tr>
            </thead>

            <tbody>
              {employeeData.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.designation}</td>
                  <td>{employee.department}</td>
                  <td>
                    <span
                      className={`status-badge ${employee.status.toLowerCase()}`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td>{employee.dateOfJoining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default EmployeeList;
