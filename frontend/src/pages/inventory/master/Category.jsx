import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCategory } from "../../../services/inventory/master";
import Layout from "../../../components/Layout";
import "../../../styles/main.css";

function Category() {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/inventory/category/edit/${id}`);
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
      <div className="department-list-table-wrap">
        <div className="department-list-heading">
          <div>
            <span>Inventory</span>
            <h1>Category</h1>
          </div>

          <NavLink to="/inventory/category/new" className="add-btn">
            + Add Category
          </NavLink>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>SL No</th>
                <th>Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {categoryData.map((category, index) => (
                <tr key={category.category_id}>
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell">{category.category_name}</td>
                  <td className="table-cell">{category.status}</td>
                  <td className="table-cell">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(category.category_id)}
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

export default Category;
