import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import "../../styles/addForm.css";
import { saveDesignation, getDesignationById } from "../../services/hrms/masterService";

function AddDesignation() {
 const [designationName, setDesignationName] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      loadDesignation();
    }
  }, [id]);

  const loadDesignation = async () => {
    try {
      const data = await getDesignationById(id);
      if (data && data.designation_name) {
        setDesignationName(data.designation_name);
      }
    } catch (error) {
      console.error("Failed to load designation details:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!designationName.trim()) {
      console.error("Designation name is empty");
      return;
    }

    const payload = { designation_name: designationName };

    saveDesignation(payload, id)
      .then((response) => {
        console.log("✓ SUCCESS - Designation saved:", response);
        navigate("/hrms/designation");
      })
      .catch((error) => {
        console.error("✗ ERROR - Failed to save designation:", error);
      });
  };

  return (
    <Layout>
      <div className="add-form">
        <div className="form-heading">
          <span>HRMS</span>
          <h1>{id ? "Edit Designation" : "Add Designation"}</h1>
        </div>

        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label htmlFor="name">Designation Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter designation name"
              value={designationName}
              onChange={(e) => setDesignationName(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Save
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/hrms/designation")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default AddDesignation;
