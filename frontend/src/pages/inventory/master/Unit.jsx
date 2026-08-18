import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUnit } from "../../../services/inventory/master";
import Layout from "../../../components/Layout";
import "../../../styles/main.css";

function Unit() {
  const [unitData, setUnitData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/inventory/unit/edit/${id}`);
  };

  useEffect(() => {
    loadUnit();
  }, []);

  const loadUnit = async () => {
    try {
      setLoading(true);
      const data = await getUnit({});
      setUnitData(data);
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
            <h1>Unit </h1>
          </div>

          <NavLink to="/inventory/unit/new" className="add-btn">
            + Add Unit
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
              {unitData.map((unit, index) => (
                <tr key={unit.unit_id}>
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell">{unit.unit_name}</td>
                  <td className="table-cell">{unit.status}</td>
                  <td className="table-cell">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(unit.unit_id)}
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

export default Unit;
