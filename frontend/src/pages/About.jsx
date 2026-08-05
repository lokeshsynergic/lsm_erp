import Layout from "../components/Layout";
import requestData from "../data/requestData";
import "../styles/about.css";

function About() {
  return (
    <Layout>

      <div className="container">
        <h2>Material Requests</h2>

        <div className="filter-bar">
          <input placeholder="ID" />
          <input placeholder="Title" />

          <select>
            <option>Purpose</option>
          </select>

          <input placeholder="Company" />

          <select>
            <option>Received</option>
          </select>
        </div>

        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Purpose</th>
              <th>ID</th>
              <th>Age</th>
            </tr>
          </thead>

          <tbody>
            {requestData.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>

                <td>
                  <span className="status">
                    {item.status}
                  </span>
                </td>

                <td>{item.purpose}</td>
                <td>{item.id}</td>
                <td>{item.age}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </Layout>
  );
}

export default About;