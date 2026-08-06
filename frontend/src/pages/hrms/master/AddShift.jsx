import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import "../../../styles/addForm.css";
import { saveShift, getShiftById } from "../../../services/hrms/masterService";

function AddShift() {
 const [shiftName, setShiftName] = useState("");
   const [startTime, setStartTime] = useState("");
   const [endTime, setEndTime] = useState("");
   const [graceInTime, setGraceInTime] = useState("");
   const [graceOutTime, setGraceOutTime] = useState("");
   const [minimumWorkingHours, setMinimumWorkingHours] = useState("");
   const [maximumShiftHours, setMaximumShiftHours] = useState("");
   const navigate = useNavigate();
   const { id } = useParams();
 
   useEffect(() => {
     if (id) {
       loadShift();
     }
   }, [id]);
 
   const loadShift = async () => {
     try {
       const data = await getShiftById(id);
       if (data) {
         setShiftName(data.shiftName || "");
         setStartTime(data.startTime || "");
         setEndTime(data.endTime || "");
         setGraceInTime(data.graceInTime || "");
         setGraceOutTime(data.graceOutTime || "");
         setMinimumWorkingHours(data.minimumWorkingHours || "");
        // setMaximumShiftHours(data.maximumShiftHours || "");
       }
     } catch (error) {
       console.error("Failed to load shift details:", error);
     }
   };
 
   const handleSubmit = (e) => {
     e.preventDefault();
 
     if (!shiftName.trim()) {
       console.error("Shift name is empty");
       return;
     }

     const payload = {
       shiftName: shiftName,
       startTime: startTime,
       endTime: endTime,
       graceInTime: Number(graceInTime),
       graceOutTime: Number(graceOutTime),
       minimumWorkingHours: Number(minimumWorkingHours),
       // maximumShiftHours: Number(maximumShiftHours)
     };

     saveShift(payload, id)
       .then((response) => {
         console.log("✓ SUCCESS - Shift saved:", response);
         navigate("/hrms/shift");
       })
       .catch((error) => {
         console.error("✗ ERROR - Failed to save shift:", error);
       });
   };

  return (
    <Layout>
      <div className="add-form">
        <div className="form-heading">
          <span>HRMS</span>
          <h1>Add Shift</h1>
        </div>

        <form onSubmit={handleSubmit} className="form-container-shift">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Shift Name</label>
              <input
                type="text"
                id="name"
                name="shift_name"
                placeholder="Enter shift name"
                value={shiftName}
                onChange={(e) => setShiftName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="start_time"
                placeholder="Enter start time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                name="end_time"
                placeholder="Enter end time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="graceInTime">Grace In Time (minutes)</label>
              <input
                type="number"
                id="graceInTime"
                name="grace_in_time"
                placeholder="Enter grace in time"
                value={graceInTime}
                onChange={(e) => setGraceInTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="graceOutTime">Grace Out Time (minutes)</label>
              <input
                type="number"
                id="graceOutTime"
                name="grace_out_time"
                placeholder="Enter grace out time"
                value={graceOutTime}
                onChange={(e) => setGraceOutTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="minimumWorkingHours">Minimum Working Hours</label>
              <input
                type="number"
                id="minimumWorkingHours"
                name="minimum_working_hours"
                placeholder="Enter minimum working hours"
                value={minimumWorkingHours}
                onChange={(e) => setMinimumWorkingHours(e.target.value)}
                required
              />
            </div>
          </div>

          {/* <div className="form-row single-col">
            <div className="form-group">
              <label htmlFor="maximumShiftHours">Maximum Shift Hours</label>
              <input
                type="number"
                id="maximumShiftHours"
                name="maximum_shift_hours"
                placeholder="Enter maximum shift hours"
                value={maximumShiftHours}
                onChange={(e) => setMaximumShiftHours(e.target.value)}
                required
              />
            </div>
          </div> */}

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Save
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/hrms/shift")} 
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default AddShift;
