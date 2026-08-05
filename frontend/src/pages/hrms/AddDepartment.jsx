import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import "../../styles/addForm.css";
import {
  getDepartmentById,
  saveDepartment,
} from "../../services/hrms/masterService";

function AddDepartment() {
  const [departmentName, setDepartmentName] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      loadDepartment();
    }
  }, [id]);

  const loadDepartment = async () => {
    try {
      const data = await getDepartmentById(id);
      if (data && data.department_name) {
        setDepartmentName(data.department_name);
      }
    } catch (error) {
      console.error("Failed to load department details:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!departmentName.trim()) {
      console.error("Department name is empty");
      return;
    }

    const payload = { department_name: departmentName };

    saveDepartment(payload, id)
      .then((response) => {
        console.log("✓ SUCCESS - Department saved:", response);
        navigate("/hrms/department");
      })
      .catch((error) => {
        console.error("✗ ERROR - Failed to save department:", error);
      });
  };

  return (
    <Layout>
      <div className="add-form">
        <div className="form-heading">
          <span>HRMS</span>
          <h1>{id ? "Edit Department" : "Add Department"}</h1>
        </div>

        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label htmlFor="name">Department Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter department name"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
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
              onClick={() => navigate("/hrms/department")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default AddDepartment;