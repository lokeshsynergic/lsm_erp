import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getShift } from "../../../services/hrms/masterService";
import Layout from "../../../components/Layout";
import "../../../styles/main.css";

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
      {/* <div className="department-list"> */}
      <div className="department-list-table-wrap">
        <div className="department-list-heading">
          <div>
            <span>HRMS</span>
            <h1>Shift</h1>
          </div>
          <NavLink to="/hrms/shift/new" className="add-btn">
            + Add Shift
          </NavLink>
        </div>

        <div className="table-container">
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
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell">{shift.shiftName}</td>
                  <td className="table-cell">{shift.startTime}</td>
                  <td className="table-cell">{shift.endTime}</td>
                  <td className="table-cell">{shift.graceInTime}</td>
                  <td className="table-cell">{shift.graceOutTime}</td>
                  <td className="table-cell">{shift.minimumWorkingHours}</td>
                  <td className="table-cell">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(shift.shiftCode)}
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

export default Shift;
