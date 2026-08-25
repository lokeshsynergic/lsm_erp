import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import "../../../styles/addForm.css";
import { saveBranch, getBranchById } from "../../../services/hrms/masterService";

function AddBranch() {
 const [branchName, setBranchName] = useState("");
 const [branchAddress, setBranchAddress] = useState("");
 const [branchLatitude, setBranchLatitude] = useState("");
  const [branchLongitude, setBranchLongitude] = useState("");
  const [branchLoginRange, setBranchLoginRange] = useState("");

  const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
    const { id } = useParams();


   useEffect(() => {
     if (id) {
       loadBranch();
     }
   }, [id]);
 
   const loadBranch = async () => {
     try {
       const data = await getBranchById(id);
       if (data && data.branch_name) {
         setBranchName(data.branch_name);
         setBranchAddress(data.complete_address);
         setBranchLatitude(data.latitude);
         setBranchLongitude(data.longitude);
         setBranchLoginRange(data.login_range); 
       }
     } catch (error) {
       console.error("Failed to load branch details:", error);
     }
   };
 
   const handleSubmit = (e) => {
     e.preventDefault();
 
     if (!branchName.trim()) {
       console.error("Branch name is empty");
       return;
     }

     const payload = { branch_name: branchName,complete_address:branchAddress,latitude:branchLatitude,longitude:branchLongitude,branch_flag:'B',login_range:branchLoginRange,created_by:'Admin' };

     saveBranch(payload, id)
       .then((response) => {
         console.log("✓ SUCCESS - Branch saved:", response);
         navigate("/hrms/branch");
       })
       .catch((error) => {
         console.error("✗ ERROR - Failed to save branch:", error);
       });
   };

  return (
    <Layout>
      <div className="add-form">
        <div className="form-heading">
          <span>HRMS</span>
          <h1>Add Branch</h1>
        </div>

        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label htmlFor="name">Branch Name</label>
            <input
              type="text"
              id="name"
              name="branch_name"
              placeholder="Enter branch name"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Branch Complete Address</label>
            <textarea
              id="name"
              name="branch_address"
              placeholder="Enter branch complete address"
              value={branchAddress}
              onChange={(e) => setBranchAddress(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-row">
           <div className="form-group">
            <label htmlFor="name">Latitude</label>
            <input
              type="text"
              id="name"
              name="latitude"
              placeholder="Enter branch latitude"
              value={branchLatitude}
              onChange={(e) => setBranchLatitude(e.target.value)}
              required
            />
          </div>

           <div className="form-group">
            <label htmlFor="name">Longitude</label>
            <input
              type="text"
              id="name"
              name="longitude"
              placeholder="Enter branch longitude"
              value={branchLongitude}
              onChange={(e) => setBranchLongitude(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Login Range</label>
            <input
              type="text"
              id="login_range"
              name="login_range"
              placeholder="Enter branch login range"
              value={branchLoginRange}
              onChange={(e) => setBranchLoginRange(e.target.value)}
              required
            />
          </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Save
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/hrms/branch")}
            >
              Cancel
            </button>
          </div>


        </form>
      </div>
    </Layout>
  );
}

export default AddBranch;
