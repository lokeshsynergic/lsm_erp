import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import "../../../styles/addForm.css";
import { saveUnit, getUnitById } from "../../../services/inventory/master";

function AddUnit() {
 const [unitName, setUnitName] = useState("");
   const navigate = useNavigate();
   const { id } = useParams();
 
   useEffect(() => {
     if (id) {
       loadUnit();
     }
   }, [id]);
 
   const loadUnit = async () => {
     try {
       const data = await getUnitById(id);
       if (data && data.unit_name) {
         setUnitName(data.unit_name);
       }
     } catch (error) {
       console.error("Failed to load unit details:", error);
     }
   };
 
   const handleSubmit = (e) => {
     e.preventDefault();
 
     if (!unitName.trim()) {
       console.error("Unit name is empty");
       return;
     }

     const payload = { unit_name: unitName };

     saveUnit(payload, id)
       .then((response) => {
         console.log("✓ SUCCESS - Unit saved:", response);
         navigate("/inventory/unit");
       })
       .catch((error) => {
         console.error("✗ ERROR - Failed to save unit:", error);
       });
   };

  return (
    <Layout>
      <div className="add-form">
        <div className="form-heading">
          <span>Inventory</span>
          <h1>{id ? "Edit Unit" : "Add Unit"}</h1>
        </div>

        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label htmlFor="name">Unit Name</label>
            <input
              type="text"
              id="name"
              name="unit_name"
              placeholder="Enter unit name"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
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
              onClick={() => navigate("/inventory/unit")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default AddUnit;
