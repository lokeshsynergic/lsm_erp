import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, AlertTriangle, Users, UserX } from "lucide-react";
import Layout from "../../../components/Layout";
import "../../../styles/department.css";
import "../../../styles/main.css";
import "../../../styles/attendanceDashboard.css";
import { todayattnsumm, getLast30DaysAttendance } from "../../../services/hrms/employeeService";
import { getAllUsers } from "../../../services/users/userService";

function AttendanceDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [calendarDays, setCalendarDays] = useState([]);

  // Map to store 30-day attendance lookup: key = `${user_id}_${dateStr}`
  const [attendanceMap, setAttendanceMap] = useState({});

  // Dynamic state for the 4 top metrics
  const [metricsData, setMetricsData] = useState({
    onTime: 0,
    late: 0,
    outOfOffice: 0,
    absent: 0,
  });

  useEffect(() => {
    fetchAllUsers();
    fetchAttendanceRecords();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Error loading users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch 30-day attendance records and create hash map
  const fetchAttendanceRecords = async () => {
    try {
      const data = await getLast30DaysAttendance();
      if (Array.isArray(data)) {
        const map = {};
        data.forEach((item) => {
          map[`${item.user_id}_${item.date}`] = item.status;
        });
        setAttendanceMap(map);
      }
    } catch (err) {
      console.error("Error fetching 30-day attendance records:", err);
    }
  };

  // Generate last 30 days dates dynamically
  useEffect(() => {
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      days.push({
        dateObj: d,
        dayNum: d.getDate(),
        dayName: d.toLocaleDateString("en-US", { weekday: "narrow" }),
        dateStr: d.toISOString().split("T")[0],
        isWeekend: d.getDay() === 0 || d.getDay() === 6,
      });
    }
    setCalendarDays(days);
    fetchSummaryData();
  }, []);

  const fetchSummaryData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await todayattnsumm();

      if (res) {
        const totalEmp = parseInt(res.total_employee || 0, 10);
        const onTime = parseInt(res.total_on_time || 0, 10);
        const late = parseInt(res.total_late || 0, 10);
        const outOfOffice = parseInt(res.total_out_of_office || 0, 10);
        const calculatedAbsent = totalEmp - (onTime + late);

        setMetricsData({
          onTime,
          late,
          outOfOffice,
          absent: calculatedAbsent,
        });
      }
    } catch (err) {
      console.error("Error fetching summary metrics:", err);
      setError(err.message || "Error loading summary metrics");
    } finally {
      setLoading(false);
    }
  };

  // Helper to generate initials avatar
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  // Status lookup from backend dataset
  const getDayStatusClass = (dateStr, userId, isWeekend) => {
  // 1. Weekend takes priority
  if (isWeekend) return "status-weekly-off";

  // 2. Fetch record from Hash Map
  const key = `${userId}_${dateStr}`;
  const status = attendanceMap[key];

  // 3. Return explicit status or fallback to absent
  switch (status) {
    case "present":
      return "status-present";
    case "out_of_office":
      return "status-wfh";
    case "late":
      return "status-late";
    case "leave":
      return "status-paid-leave";
    default:
      return "status-absent"; // Fallback for missing/null data
  }
};

  // Dynamic cards array driven by state
  const metrics = [
    {
      id: 1,
      title: "On Time",
      count: metricsData.onTime,
      status: "Punctual arrivals today",
      icon: Clock,
      type: "on-time",
    },
    {
      id: 2,
      title: "Late",
      count: metricsData.late,
      status: "Requires attention",
      icon: AlertTriangle,
      type: "late",
    },
    {
      id: 3,
      title: "Field Users",
      count: metricsData.outOfOffice,
      status: "Out of office today",
      icon: Users,
      type: "field-users",
    },
    {
      id: 4,
      title: "Absent",
      count: metricsData.absent,
      status: "Calculated non-attendees",
      icon: UserX,
      type: "absent",
    },
  ];

  return (
    <Layout>
      <div className="data-list-table-wrap">
        <div className="data-list-heading">
          <div>
            <span>Attendance Dashboard</span>
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "#E61B24", padding: "12px" }}>Error: {error}</p>}

        {/* Brand Metrics Cards */}
        <div className="metrics-container">
          <div className="metrics-grid">
            {metrics.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className={`metric-card ${item.type}`}>
                  <div className="metric-card-content">
                    <div>
                      <p className="metric-title">{item.title}</p>
                      <h3 className="metric-value">{item.count}</h3>
                    </div>
                    <div className="metric-icon-wrapper">
                      <Icon size={24} />
                    </div>
                  </div>
                  <div className="metric-footer">
                    <span>{item.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 30-Day Attendance Calendar Section */}
        <div className="calendar-card-container">
          <div className="calendar-header-toolbar">
            <h2 className="calendar-title">Team Calendar (Last 30 Days)</h2>
          </div>

          <div className="calendar-scroll-wrapper">
            <table className="calendar-matrix-table">
              <thead>
                <tr>
                  <th className="sticky-user-column header-cell">Employee</th>
                  {calendarDays.map((day, idx) => (
                    <th key={idx} className={`day-header-cell ${day.isWeekend ? "weekend-cell" : ""}`}>
                      <span className="day-name">{day.dayName}</span>
                      <span className="day-number">{day.dayNum}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, uIdx) => (
                    <tr key={user.id || user.user_id || uIdx}>
                      <td className="sticky-user-column body-cell">
                        <div className="user-profile-info">
                          <div className="user-avatar-circle">
                            {getInitials(user.user_id)}
                          </div>
                          <span className="user-name-text">{user.user_id}</span>
                        </div>
                      </td>
                      {calendarDays.map((day, dIdx) => {
                        const statusClass = getDayStatusClass(day.dateStr, user.user_id, day.isWeekend);
                        return (
                          <td key={dIdx} className="day-status-cell">
                            <span className={`status-pill ${statusClass}`}>
                              {day.dayNum}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  !loading && (
                    <tr>
                      <td colSpan={calendarDays.length + 1} className="no-users-cell">
                        No users found
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Legend Section */}
          <div className="calendar-legend-bar">
            <div className="legend-item"><span className="legend-dot status-present"></span> Present</div>
            <div className="legend-item"><span className="legend-dot status-wfh"></span> Out of Office</div>
            <div className="legend-item"><span className="legend-dot status-weekly-off"></span> Weekly Off</div>
            <div className="legend-item"><span className="legend-dot status-paid-leave"></span> Paid Leave</div>
            <div className="legend-item"><span className="legend-dot status-late"></span> Late</div>
            <div className="legend-item"><span className="legend-dot status-absent"></span> Absent</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AttendanceDashboard;