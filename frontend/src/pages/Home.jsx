import Layout from "../components/Layout";
import "../styles/home.css";

const kpiData = [
  { label: "Total Requests", value: "128", trend: "+12%", tone: "pink" },
  { label: "Pending Review", value: "24", trend: "8 urgent", tone: "amber" },
  { label: "Approved", value: "86", trend: "+18 this week", tone: "green" },
  { label: "Stock Alerts", value: "09", trend: "3 critical", tone: "blue" },
];

const chartData = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 58 },
  { month: "Mar", value: 48 },
  { month: "Apr", value: 72 },
  { month: "May", value: 64 },
  { month: "Jun", value: 91 },
  { month: "Jul", value: 78 },
];

const activityData = [
  "MacBook Air request received",
  "iPhone 13 request approved",
  "Vendor quote updated",
];

function Home() {
  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-heading">
          <div>
            <span>Overview</span>
            <h1>Dashboard</h1>
          </div>
          {/* <button type="button" className="dashboard-action">
            Export Report
          </button> */}
        </div>

        {/* <div className="dashboard-grid">
          {kpiData.map((item) => (
            <div className={`dashboard-card ${item.tone}`} key={item.label}>
              <div className="card-icon">{item.label.charAt(0)}</div>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.trend}</small>
            </div>
          ))}
        </div> */}

        {/* <div className="dashboard-panels">
          <section className="chart-panel">
            <div className="panel-heading">
              <div>
                <span>Requests</span>
                <h2>Monthly Movement</h2>
              </div>
              <strong>+16.4%</strong>
            </div>

            <div className="bar-chart" aria-label="Monthly request bar chart">
              {chartData.map((item) => (
                <div className="bar-item" key={item.month}>
                  <div className="bar-track">
                    <span style={{ height: `${item.value}%` }}></span>
                  </div>
                  <small>{item.month}</small>
                </div>
              ))}
            </div>
          </section>

          <aside className="insight-panel">
            <div className="panel-heading">
              <div>
                <span>Status</span>
                <h2>Request Health</h2>
              </div>
            </div>

            <div className="status-ring">
              <div>
                <strong>74%</strong>
                <span>On Track</span>
              </div>
            </div>

            <div className="activity-list">
              {activityData.map((item) => (
                <div className="activity-item" key={item}>
                  <span></span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </aside>
        </div> */}
      </div>
    </Layout>
  );
}

export default Home;
