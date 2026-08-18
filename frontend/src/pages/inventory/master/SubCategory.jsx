import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getSubCategory } from "../../../services/inventory/master";
import Layout from "../../../components/Layout";
import "../../../styles/main.css";

function SubCategory() {
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/inventory/subcategory/edit/${id}`);
  };

  useEffect(() => {
    loadSubCategory();
  }, []);

  const loadSubCategory = async () => {
    try {
      setLoading(true);
      const data = await getSubCategory({});
      setSubCategoryData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="department-list-table-wrap">
        <div className="department-list-heading">
          <div>
            <span>Inventory</span>
            <h1>Sub Category</h1>
          </div>

          <NavLink to="/inventory/subcategory/new" className="add-btn">
            + Add Sub Category
          </NavLink>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>SL No</th>
                <th>Category Name</th>
                <th>Sub Category Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {subCategoryData.map((category, index) => (
                <tr key={category.subcategory_id}>
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell">{category.category_name}</td>
                  <td className="table-cell">{category.subcategory_name}</td>
                  <td className="table-cell">{category.status}</td>
                  <td className="table-cell">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(category.subcategory_id)}
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

export default SubCategory;
