import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import "../../../styles/addForm.css";
import { saveSubCategory, getSubCategoryById,getCategory } from "../../../services/inventory/master";

function SubCategoryAdd() {
 const [subcategory_name, setSubcategoryName] = useState("");
   const navigate = useNavigate();
   const { id } = useParams();
   const [categories, setCategories] = useState([]);
   const [category_id, setCategoryId] = useState("");
   const [categoriesLoaded, setCategoriesLoaded] = useState(false);

   // Fetch categories on mount
   useEffect(() => {
     const fetchCategories = async () => {
       try {
         const data = await getCategory();
         setCategories(Array.isArray(data) ? data : []);
         setCategoriesLoaded(true);
       } catch (error) {
         console.error("Failed to load categories:", error);
         setCategoriesLoaded(true);
       }
     };

     fetchCategories();
   }, []);

   // Load subcategory data after categories are loaded
   useEffect(() => {
     if (id && categoriesLoaded) {
       loadSubCategory();
     }
   }, [id, categoriesLoaded]);
 
   const loadSubCategory = async () => {
     try {
       const data = await getSubCategoryById(id);
       if (data) {
         if (data.subcategory_name) {
           setSubcategoryName(data.subcategory_name);
         }
         if (data.category_id) {
           setCategoryId(data.category_id);
         }
       }
     } catch (error) {
       console.error("Failed to load subcategory details:", error);
     }
   };
 
   const handleSubmit = (e) => {
     e.preventDefault();
 
     if (!subcategory_name.trim()) {
       console.error("Subcategory name is empty");
       return;
     }

     const payload = { subcategory_name: subcategory_name, category_id: category_id };

     saveSubCategory(payload, id)
       .then((response) => {
         console.log("✓ SUCCESS - Subcategory saved:", response);
         navigate("/inventory/subcategory");
       })
       .catch((error) => {
         console.error("✗ ERROR - Failed to save subcategory:", error);
       });
   };

  return (
    <Layout>
      <div className="add-form">
        <div className="form-heading">
          <span>Inventory</span>
          <h1>{id ? "Edit Subcategory" : "Add Subcategory"}</h1>
        </div>

        <form onSubmit={handleSubmit} className="form-container">
           <div className="form-group">
            <label htmlFor="name">Category</label>
            <select
              id="category"
              name="category_id"
              value={category_id}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="name">Sub Category Name</label>
            <input
              type="text"
              id="subcategory_name"
              name="subcategory_name"
              placeholder="Enter subcategory name"
              value={subcategory_name}
              onChange={(e) => setSubcategoryName(e.target.value)}
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
              onClick={() => navigate("/inventory/subcategory")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default SubCategoryAdd;
