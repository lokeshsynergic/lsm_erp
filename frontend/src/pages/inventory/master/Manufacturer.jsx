import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getManufacturer } from "../../../services/inventory/master";
import Layout from "../../../components/Layout";
import "../../../styles/main.css";

function Manufacturer() {
  const [manufacturerData, setManufacturerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/inventory/manufacturer/edit/${id}`);
  };

  useEffect(() => {
    loadManufacturer();
  }, []);

  const loadManufacturer = async () => {
    try {
      setLoading(true);
      const data = await getManufacturer({});
      setManufacturerData(data);
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
            <h1>Manufacturer </h1>
          </div>

          <NavLink to="/inventory/manufacturer/new" className="add-btn">
            + Add Manufacturer
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
              {manufacturerData.map((manufacturer, index) => (
                <tr key={manufacturer.manufacturer_id}>
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell">{manufacturer.manufacturer_name}</td>
                  <td className="table-cell">{manufacturer.status}</td>
                  <td className="table-cell">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(manufacturer.manufacturer_id)}
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

export default Manufacturer;
