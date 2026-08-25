import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getBranch } from "../../../services/hrms/masterService";
import Layout from "../../../components/Layout";
import "../../../styles/department.css";
import "../../../styles/main.css";

function ListBranch() {
 const [branchData, setBranchData] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const navigate = useNavigate();
 //   const handleEdit = (id) => {
 //     console.log("Edit department with id:", id);
 //   };
   const handleEdit = (id) => {
        navigate(`/hrms/branch/edit/${id}`);
    };
 
      useEffect(() => {
         loadBranch();
     }, []);

  const loadBranch = async () => {
         try {
             setLoading(true);
             const data = await getBranch({});
             setBranchData(data);
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
            <h1>Branch</h1>
          </div>
          <NavLink to="/hrms/branch/new" className="add-btn">
            + Add Branch
          </NavLink>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>SL No</th>
                <th>Name</th>
                <th>Complete Address</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Login Range</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {branchData.map((branch, index) => (
                <tr key={branch.branch_id}>
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell">{branch.branch_name}</td>
                  <td className="table-cell">{branch.complete_address}</td>
                  <td className="table-cell">{branch.latitude}</td>
                  <td className="table-cell">{branch.longitude}</td>
                  <td className="table-cell">{branch.login_range}</td>
                  <td className="table-cell">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(branch.branch_id)}
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

export default ListBranch;
