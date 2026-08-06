import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getShift } from "../../../services/hrms/masterService";
import Layout from "../../../components/Layout";
import "../../../styles/category.css";

function Shift() {
 const [shiftData, setShiftData] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const navigate = useNavigate();

   const handleEdit = (id) => {
        navigate(`/hrms/shift/edit/${id}`);
    };
 
      useEffect(() => {
         loadShift();
     }, []);
 
  const loadShift = async () => {
         try {
             setLoading(true);
             const data = await getShift({});
             setShiftData(data);
         } catch (err) {
             setError(err.message);
         } finally {
             setLoading(false);
         }
     };

  return (
    <Layout>
      <div className="department-list">
        <div className="department-list-heading">
          <div>
            <span>HRMS</span>
            <h1>Shift</h1>
          </div>
          <NavLink to="/hrms/shift/new" className="add-btn">
            + Add Shift
          </NavLink>
        </div>

        <div className="shift-list-table-wrap">
          <table>
            <thead>
              <tr>
                <th>SL No</th>
                <th>Name</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Grace In Time</th>
                <th>Grace Out Time</th>
                <th>Minimum Working Hours</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {shiftData.map((shift, index) => (
                <tr key={shift.shiftCode}>
                  <td>{index + 1}</td>
                  <td>{shift.shiftName}</td>
                  <td>{shift.startTime}</td>
                  <td>{shift.endTime}</td>
                  <td>{shift.graceInTime}</td>
                  <td>{shift.graceOutTime}</td>
                  <td>{shift.minimumWorkingHours}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(shift.shiftCode)}
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

export default Shift;
