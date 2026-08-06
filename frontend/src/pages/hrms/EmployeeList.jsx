import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import "../../styles/employeeList.css";
import { getEmployee } from "../../services/hrms/employeeService";

function EmployeeList() {
  const [employeeData, setEmployeeData] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const navigate = useNavigate();
 
   const handleEdit = (id) => {
        navigate(`/hrms/employee/edit/${id}`);
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
                <tr key={employee.emp_code}>
                  <td>{employee.emp_code}</td>
                  <td>{employee.first_name} {employee.middle_name} {employee.last_name}</td>
                  <td>{employee.designation}</td>
                  <td>{employee.department}</td>
                  <td>
                    <span
                      className={`status-badge ${employee.status.toLowerCase()}`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td>{employee.date_of_joining}</td>
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
