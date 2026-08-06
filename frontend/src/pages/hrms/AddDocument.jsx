import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import "../../styles/addForm.css";
import { saveDocument, getDocumentById } from "../../services/hrms/masterService";

function AddDocument() {
 const [documentName, setDocumentName] = useState("");
   const navigate = useNavigate();
   const { id } = useParams();
 
   useEffect(() => {
     if (id) {
       loadDocument();
     }
   }, [id]);
 
   const loadDocument = async () => {
     try {
       const data = await getDocumentById(id);
       if (data && data.document_name) {
         setDocumentName(data.document_name);
       }
     } catch (error) {
       console.error("Failed to load document details:", error);
     }
   };
 
   const handleSubmit = (e) => {
     e.preventDefault();
 
     if (!documentName.trim()) {
       console.error("Document name is empty");
       return;
     }

     const payload = { document_name: documentName };

     saveDocument(payload, id)
       .then((response) => {
         console.log("✓ SUCCESS - Document saved:", response);
         navigate("/hrms/document");
       })
       .catch((error) => {
         console.error("✗ ERROR - Failed to save document:", error);
       });
   };

  return (
    <Layout>
      <div className="add-form">
        <div className="form-heading">
          <span>HRMS</span>
          <h1>Add Document</h1>
        </div>

        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label htmlFor="name">Document Name</label>
            <input
              type="text"
              id="name"
              name="document_name"
              placeholder="Enter document name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Save
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/hrms/document")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default AddDocument;
