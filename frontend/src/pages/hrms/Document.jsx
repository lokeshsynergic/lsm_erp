import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDocument } from "../../services/hrms/masterService";
import Layout from "../../components/Layout";
import "../../styles/department.css";
import "../../styles/main.css";

function Document() {
 const [documentData, setDocumentData] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const navigate = useNavigate();
 //   const handleEdit = (id) => {
 //     console.log("Edit department with id:", id);
 //   };
   const handleEdit = (id) => {
        navigate(`/hrms/document/edit/${id}`);
    };
 
      useEffect(() => {
         loadDocument();
     }, []);
 
  const loadDocument = async () => {
         try {
             setLoading(true);
             const data = await getDocument({});
             setDocumentData(data);
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
            <h1>Document</h1>
          </div>
          <NavLink to="/hrms/document/new" className="add-btn">
            + Add Document
          </NavLink>
        </div>

        <div className="department-list-table-wrap">
          <table>
            <thead>
              <tr>
                <th>SL No</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {documentData.map((document, index) => (
                <tr key={document.doc_id}>
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell">{document.document_name}</td>
                  <td className="table-cell">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(document.doc_id)}
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

export default Document;
