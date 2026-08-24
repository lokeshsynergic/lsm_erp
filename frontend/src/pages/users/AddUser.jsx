import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import "../../styles/addForm.css";
import { useState, useEffect } from "react";
import { getUserById, saveUser } from "../../services/users/userService";
import { getShift } from "../../services/hrms/masterService";

function AddUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form states
  const [userName, setUserName] = useState("");
  const [userIdVal, setUserIdVal] = useState("");
  const [userType, setUserType] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [workMode, setWorkMode] = useState("O");
  const [userStatus, setUserStatus] = useState(""); // Default to Active ('A')

  // UI feedback states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Data states
  const [shifts, setShifts] = useState([]);

  // Fetch shifts list
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const data = await getShift();
        const shiftList = Array.isArray(data) ? data : data?.data || [];
        setShifts(shiftList);
      } catch (error) {
        console.error("Failed to fetch shifts:", error);
      }
    };

    fetchShifts();
  }, []);

  // Fetch single user details on Edit mode
  useEffect(() => {
    if (id) {
      loaduser();
    }
  }, [id]);

  const loaduser = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getUserById(id);
      setUserName(data.name || "");
      setUserIdVal(data.user_id || "");
      setUserType(data.usertype || "");
      setSelectedShift(data.shift_id || "");
      setWorkMode(data.work_mode || "O");
      setUserStatus(data.user_status || "A");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error loading user data");
      setIsSaved(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Payload sending strictly the 4 editable fields
    const payload = {
      user_type: userType,
      shift_id: selectedShift,
      work_mode: workMode,
      user_status: userStatus,
    };

    console.log("Submitting payload:", payload);

    try {
      setLoading(true);
      setError("");
      await saveUser(payload, id);
      setIsSaved(true);
      navigate("/users");
    } catch (err) {
      console.error("Error saving user:", err);
      setError(err.response?.data?.message || err.message || "Error saving user");
      setIsSaved(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="add-form">
        <div className="form-heading">
          <span>HRMS</span>
          <h1>{id ? "Edit User" : "Add User"}</h1>
        </div>

        {error && <div className="error-message" style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="name">User Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter user name"
                readOnly
                value={userName}
              />
            </div>

            <div className="form-field">
              <label htmlFor="userId">User ID</label>
              <input
                type="text"
                id="userId"
                name="userId"
                readOnly
                placeholder="Enter user ID"
                value={userIdVal}
              />
            </div>

            <div className="form-field">
              <label htmlFor="userType">User Type</label>
              <select
                id="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              >
                <option value="">Select user type</option>
                <option value="A">Admin</option>
                <option value="U">User</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="shift">Shift</label>
              <select
                id="shift_id"
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                required
              >
                <option value="">Select shift</option>
                {shifts.map((shift) => (
                  <option
                    key={shift.shiftCode || shift.id}
                    value={shift.shiftCode || shift.id}
                  >
                    {shift.shiftName || shift.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Work Mode</label>
              <div className="radio-group" style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    id="mode_office"
                    name="work_mode"
                    value="O"
                    checked={workMode === "O"}
                    onChange={(e) => setWorkMode(e.target.value)}
                  />
                  Office Mode
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    id="mode_field"
                    name="work_mode"
                    value="F"
                    checked={workMode === "F"}
                    onChange={(e) => setWorkMode(e.target.value)}
                  />
                  Field Mode
                </label>
              </div>
            </div>

            <div className="form-field">
              <label>User Status</label>
              <div className="radio-group" style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    id="status_active"
                    name="user_status"
                    value="A"
                    checked={userStatus === "A"}
                    onChange={(e) => setUserStatus(e.target.value)}
                  />
                  Active
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    id="status_inactive"
                    name="user_status"
                    value="I"
                    checked={userStatus === "I"}
                    onChange={(e) => setUserStatus(e.target.value)}
                  />
                  Inactive
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/hrms/users")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default AddUser;