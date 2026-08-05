import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import "../../styles/addForm.css";
import { saveCategory, getCategoryById } from "../../services/hrms/masterService";

function AddCategory() {
 const [categoryName, setCategoryName] = useState("");
   const navigate = useNavigate();
   const { id } = useParams();
 
   useEffect(() => {
     if (id) {
       loadCategory();
     }
   }, [id]);
 
   const loadCategory = async () => {
     try {
       const data = await getCategoryById(id);
       if (data && data.category_name) {
         setCategoryName(data.category_name);
       }
     } catch (error) {
       console.error("Failed to load category details:", error);
     }
   };
 
   const handleSubmit = (e) => {
     e.preventDefault();
 
     if (!categoryName.trim()) {
       console.error("Category name is empty");
       return;
     }

     const payload = { category_name: categoryName };

     saveCategory(payload, id)
       .then((response) => {
         console.log("✓ SUCCESS - Category saved:", response);
         navigate("/hrms/category");
       })
       .catch((error) => {
         console.error("✗ ERROR - Failed to save category:", error);
       });
   };

  return (
    <Layout>
      <div className="add-form">
        <div className="form-heading">
          <span>HRMS</span>
          <h1>Add Category</h1>
        </div>

        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label htmlFor="name">Category Name</label>
            <input
              type="text"
              id="name"
              name="category_name"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
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
              onClick={() => navigate("/hrms/category")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default AddCategory;
