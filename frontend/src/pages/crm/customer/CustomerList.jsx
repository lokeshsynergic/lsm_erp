import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import "../../../styles/main.css";
import { deleteCustomer, getCustomers } from "../../../services/crm/customers";

function CustomerList() {
  const [customerData, setCustomerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterTier, setFilterTier] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const customerTypes = [
    "all",
    ...new Set(customerData.map((customer) => customer.customer_type).filter(Boolean)),
  ];
  const accountTiers = [
    "all",
    ...new Set(customerData.map((customer) => customer.account_tier).filter(Boolean)),
  ];

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers({});
      setCustomerData(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/inventory/customer/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(id);
        await loadCustomers();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    let filtered = [...customerData];

    if (searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          customer.customer_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.trade_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.primary_mobile?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((customer) => customer.relationship_status === filterStatus);
    }

    if (filterType !== "all") {
      filtered = filtered.filter((customer) => customer.customer_type === filterType);
    }

    if (filterTier !== "all") {
      filtered = filtered.filter((customer) => customer.account_tier === filterTier);
    }

    filtered.sort((a, b) => {
      let compareA;
      let compareB;

      switch (sortBy) {
        case "code":
          compareA = a.customer_code?.toLowerCase() || "";
          compareB = b.customer_code?.toLowerCase() || "";
          break;
        case "type":
          compareA = a.customer_type?.toLowerCase() || "";
          compareB = b.customer_type?.toLowerCase() || "";
          break;
        case "status":
          compareA = a.relationship_status?.toLowerCase() || "";
          compareB = b.relationship_status?.toLowerCase() || "";
          break;
        case "name":
        default:
          compareA = a.customer_name?.toLowerCase() || "";
          compareB = b.customer_name?.toLowerCase() || "";
          break;
      }

      if (sortOrder === "asc") {
        return compareA < compareB ? -1 : compareA > compareB ? 1 : 0;
      }

      return compareA > compareB ? -1 : compareA < compareB ? 1 : 0;
    });

    setFilteredData(filtered);
  }, [customerData, searchTerm, filterStatus, filterType, filterTier, sortBy, sortOrder]);

  return (
    <Layout>
      <div className="department-list-table-wrap">
        <div className="department-list-heading">
          <div>
            <span>INVENTORY</span>
            <h1>Customers</h1>
          </div>
          <NavLink to="/inventory/customer/new" className="add-btn">
            + Add Customer
          </NavLink>
        </div>

        <div className="filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by code, name, trade name, mobile..."
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Blacklisted">Blacklisted</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              {customerTypes.map(
                (type) =>
                  type !== "all" && (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  )
              )}
            </select>

            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Tiers</option>
              {accountTiers.map(
                (tier) =>
                  tier !== "all" && (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  )
              )}
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
              <option value="name">Sort by Name</option>
              <option value="code">Sort by Code</option>
              <option value="type">Sort by Type</option>
              <option value="status">Sort by Status</option>
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
                setFilterType("all");
                setFilterTier("all");
                setSortBy("name");
                setSortOrder("asc");
              }}
            >
              Reset
            </button>
          </div>

          <div className="results-count">
            Showing {filteredData.length} of {customerData.length} customers
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer Code</th>
                <th>Customer Name</th>
                <th>Type</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Tier</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((customer) => (
                  <tr key={customer.customer_id}>
                    <td className="table-cell">{customer.customer_code}</td>
                    <td className="table-cell">{customer.customer_name}</td>
                    <td className="table-cell">{customer.customer_type}</td>
                    <td className="table-cell">{customer.primary_mobile}</td>
                    <td className="table-cell">{customer.primary_email}</td>
                    <td className="table-cell">{customer.account_tier || "-"}</td>
                    <td className="table-cell">
                      <span className={`status-badge ${(customer.relationship_status || "").toLowerCase()}`}>
                        {customer.relationship_status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(customer.customer_id)}
                          title="Edit Customer"
                        >
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(customer.customer_id)}
                          title="Delete Customer"
                          aria-label="Delete Customer"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    {loading ? "Loading..." : "No customers found"}
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

export default CustomerList;
