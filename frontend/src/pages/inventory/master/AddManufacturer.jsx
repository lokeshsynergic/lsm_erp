import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import "../../../styles/addForm.css";
import { saveManufacturer, getManufacturerById } from "../../../services/inventory/master";

function AddManufacturer() {
 const [manufacturerName, setManufacturerName] = useState("");
   const navigate = useNavigate();
   const { id } = useParams();
 
   useEffect(() => {
     if (id) {
       loadManufacturer();
     }
   }, [id]);
 
   const loadManufacturer = async () => {
     try {
       const data = await getManufacturerById(id);
       if (data && data.manufacturer_name) {
         setManufacturerName(data.manufacturer_name);
       }
     } catch (error) {
       console.error("Failed to load manufacturer details:", error);
     }
   };
 
   const handleSubmit = (e) => {
     e.preventDefault();
 
     if (!manufacturerName.trim()) {
       console.error("Manufacturer name is empty");
       return;
     }

     const payload = { manufacturer_name: manufacturerName };

     saveManufacturer(payload, id)
       .then((response) => {
         console.log("✓ SUCCESS - Manufacturer saved:", response);
         navigate("/inventory/manufacturer");
       })
       .catch((error) => {
         console.error("✗ ERROR - Failed to save manufacturer:", error);
       });
   };

  return (
    <Layout>
      <div className="add-form">
        <div className="form-heading">
          <span>Inventory</span>
          <h1>{id ? "Edit Manufacturer" : "Add Manufacturer"}</h1>
        </div>

        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label htmlFor="name">Manufacturer Name</label>
            <input
              type="text"
              id="name"
              name="manufacturer_name"
              placeholder="Enter manufacturer name"
              value={manufacturerName}
              onChange={(e) => setManufacturerName(e.target.value)}
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
              onClick={() => navigate("/inventory/manufacturer")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default AddManufacturer;
