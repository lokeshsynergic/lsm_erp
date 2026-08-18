import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCategory } from "../../services/hrms/masterService";
import Layout from "../../components/Layout";
import "../../styles/main.css";

function Category() {
 const [categoryData, setCategoryData] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const navigate = useNavigate();
 
   const handleEdit = (id) => {
        navigate(`/hrms/category/edit/${id}`);
    };
 
      useEffect(() => {
         loadCategory();
     }, []);
 
  const loadCategory = async () => {
         try {
             setLoading(true);
             const data = await getCategory({});
             setCategoryData(data);
         } catch (err) {
             setError(err.message);
         } finally {
             setLoading(false);
         }
     };

  return (
    <Layout>
      <div className="category-list">
        <div className="category-list-heading">
          <div>
            <span>HRMS</span>
            <h1>Category</h1>
          </div>
          <NavLink to="/hrms/category/new" className="add-btn">
            + Add Category
          </NavLink>
        </div>

        <div className="category-list-table-wrap">
          <table>
            <thead>
              <tr>
                <th>SL No</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {categoryData.map((category, index) => (
                <tr key={category.cat_id}>
                  <td>{index + 1}</td>
                  <td>{category.category_name}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(category.cat_id)}
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

export default Category;
