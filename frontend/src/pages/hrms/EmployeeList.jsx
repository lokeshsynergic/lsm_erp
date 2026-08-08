import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import "../../styles/employeeList.css";
import "../../styles/main.css";
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
      {/* <div className="department-list"> */}
        <div className="department-list-table-wrap">
        <div className="department-list-heading">
          <div>
            <span>HRMS</span>
            <h1>Employee</h1>
          </div>
          <NavLink to="/hrms/employee/new" className="add-employee-btn">
            + Add Employee
          </NavLink>
        </div>

        <div className="table-container">
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
                  <td className="table-cell">{employee.emp_code}</td>
                  <td className="table-cell">{employee.first_name} {employee.middle_name} {employee.last_name}</td>
                  <td className="table-cell">{employee.designation}</td>
                  <td className="table-cell">{employee.department}</td>
                  <td className="table-cell">
                    <span
                      className={`status-badge ${employee.status.toLowerCase()}`}
                    >
                      {employee.status}
                    </span>
                  </td>
                 <td className="table-cell">
  {employee.date_of_joining
    ? new Date(employee.date_of_joining).toLocaleDateString('en-GB')
    : ''}
</td>
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
