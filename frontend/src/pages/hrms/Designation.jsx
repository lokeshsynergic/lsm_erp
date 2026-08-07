import { NavLink, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import "../../styles/department.css";
import "../../styles/main.css";
import { getDesignation } from "../../services/hrms/masterService";
import { useState, useEffect } from "react";

function Designation() {
  const [designationData, setDesignationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
//   const handleEdit = (id) => {
//     console.log("Edit department with id:", id);
//   };
  const handleEdit = (id) => {
       navigate(`/hrms/designation/edit/${id}`);
   };

     useEffect(() => {
        loadDesignation();
    }, []);

 const loadDesignation = async () => {
        try {
            setLoading(true);
            const data = await getDesignation({});
            setDesignationData(data);
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
            <h1>Designation</h1>
          </div>

          <NavLink to="/hrms/designation/new" className="add-btn">
            + Add Designation
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
              {designationData.map((designation, index) => (
                <tr key={designation.desig_id}>
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell">{designation.designation_name}</td>
                  <td className="table-cell">
                    <button className="edit-btn"
                      onClick={() => handleEdit(designation.desig_id)}
                    >
                    
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

export default Designation;