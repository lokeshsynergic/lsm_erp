import { NavLink, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import "../../styles/department.css";
import { getDepartment } from "../../services/hrms/masterService";
import { useState, useEffect } from "react";

function Department() {
  const [departmentData, setDepartmentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
//   const handleEdit = (id) => {
//     console.log("Edit department with id:", id);
//   };
  const handleEdit = (id) => {
       navigate(`/hrms/department/edit/${id}`);
   };

     useEffect(() => {
        loadDepartment();
    }, []);

 const loadDepartment = async () => {
        try {
            setLoading(true);
            const data = await getDepartment({});
            setDepartmentData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

  


// Removed duplicate state and useEffect declarations



  return (
    <Layout>
      <div className="department-list">
        <div className="department-list-heading">
          <div>
            <span>HRMS</span>
            <h1>Department</h1>
          </div>

          <NavLink to="/hrms/department/new" className="add-btn">
            + Add Department
          </NavLink>
        </div>

        <div className="department-list-table-wrap">
          <table>
            <thead>
              <tr>
                <th>SL No</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {departmentData.map((department, index) => (
                <tr key={department.dept_id}>
                  <td>{index + 1}</td>
                  <td>{department.department_name}</td>
                  <td>
                    <button className="edit-btn"
                      onClick={() => handleEdit(department.dept_id)}
                    >
                      Edit
                    </button>
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

export default Department;