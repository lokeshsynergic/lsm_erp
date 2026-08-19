import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import "../../../styles/employeeList.css";
import "../../../styles/main.css";
import { getProducts } from "../../../services/inventory/products";

function ProductList() {
  const [productData, setProductData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterManufacturer, setFilterManufacturer] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Extract unique categories and manufacturers
  const categories = ["all", ...new Set(productData.map((prod) => prod.categoryName).filter(Boolean))];
  const manufacturers = ["all", ...new Set(productData.map((prod) => prod.manufacturerName).filter(Boolean))];

  const handleEdit = (id) => {
    navigate(`/inventory/products/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // Add delete functionality when backend supports it
        console.log(`Delete product ${id}`);
      } catch (err) {
        console.error("Failed to delete product:", err);
      }
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts({});
      setProductData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...productData];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (prod) =>
          prod.productCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prod.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prod.shortName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((prod) => prod.status === filterStatus);
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter((prod) => prod.categoryName === filterCategory);
    }

    // Manufacturer filter
    if (filterManufacturer !== "all") {
      filtered = filtered.filter((prod) => prod.manufacturerName === filterManufacturer);
    }

    // Sorting
    filtered.sort((a, b) => {
      let compareA, compareB;

      switch (sortBy) {
        case "name":
          compareA = a.productName?.toLowerCase() || "";
          compareB = b.productName?.toLowerCase() || "";
          break;
        case "code":
          compareA = a.productCode?.toLowerCase() || "";
          compareB = b.productCode?.toLowerCase() || "";
          break;
        case "category":
          compareA = a.categoryName?.toLowerCase() || "";
          compareB = b.categoryName?.toLowerCase() || "";
          break;
        case "manufacturer":
          compareA = a.manufacturerName?.toLowerCase() || "";
          compareB = b.manufacturerName?.toLowerCase() || "";
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return compareA < compareB ? -1 : compareA > compareB ? 1 : 0;
      } else {
        return compareA > compareB ? -1 : compareA < compareB ? 1 : 0;
      }
    });

    setFilteredData(filtered);
  }, [productData, searchTerm, filterStatus, filterCategory, filterManufacturer, sortBy, sortOrder]);

  return (
    <Layout>
      <div className="department-list-table-wrap">
        <div className="department-list-heading">
          <div>
            <span>INVENTORY</span>
            <h1>Products</h1>
          </div>
          <NavLink to="/inventory/products/new" className="add-btn">
            + Add Product
          </NavLink>
        </div>

        {/* Search and Filter Section */}
        <div className="filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by code, name, short name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Discontinued">Discontinued</option>
              <option value="Blocked">Blocked</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                cat !== "all" && <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={filterManufacturer}
              onChange={(e) => setFilterManufacturer(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Manufacturers</option>
              {manufacturers.map((mfg) => (
                mfg !== "all" && <option key={mfg} value={mfg}>{mfg}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Sort by Name</option>
              <option value="code">Sort by Code</option>
              <option value="category">Sort by Category</option>
              <option value="manufacturer">Sort by Manufacturer</option>
            </select>

            <button
              className="sort-order-btn"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>

            <button
              className="reset-btn"
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
                setFilterCategory("all");
                setFilterManufacturer("all");
                setSortBy("name");
                setSortOrder("asc");
              }}
            >
              Reset
            </button>
          </div>

          <div className="results-count">
            Showing {filteredData.length} of {productData.length} products
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Product Code</th>
                <th>Product Name</th>
                <th>Short Name</th>
                <th>Category</th>
                <th>Manufacturer</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((product) => (
                  <tr key={product.product_id}>
                    <td className="table-cell">{product.productCode}</td>
                    <td className="table-cell">{product.productName}</td>
                    <td className="table-cell">{product.shortName || "-"}</td>
                    <td className="table-cell">{product.categoryName || "-"}</td>
                    <td className="table-cell">{product.manufacturerName || "-"}</td>
                    <td className="table-cell">
                      <span className={`status-badge ${product.status.toLowerCase()}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(product.product_id)}
                          title="Edit Product"
                        >
                          
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(product.product_id)}
                          title="Delete Product"
                        >
                          
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    {loading ? "Loading..." : "No products found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
    </Layout>
  );
}

export default ProductList;
