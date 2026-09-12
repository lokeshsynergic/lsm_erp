import React, { useState, useEffect, useRef } from "react";
import Layout from "../../../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/employeeAdd.css"; 
import { saveCalllog, getCalllogById,uploadCalllogImage } from "../../../services/crm/call_log";
import { getEmployee } from "../../../services/hrms/employeeService";

const baseTabs = [
  "Call Details"
];

const PRODUCT_OPTIONS = ["Product A", "Product B", "Product C" ,"Cathlab","Bodyheater"];

function SaveCall() {
  const navigate = useNavigate();
  const { id } = useParams();
  // Determine tabs based on whether in edit mode
  const tabs = id ? [...baseTabs, "Documents"] : baseTabs;
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [showServiceType, setShowServiceType] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const productDropdownRef = useRef(null);

  // Documents state
  const [documents, setDocuments] = useState([]);
  const [documentInput, setDocumentInput] = useState({
    file: null,
    description: "",
    fileType: "",
  });

  // Form State
  const [formData, setFormData] = useState({
    callNo: "",
    date: new Date().toISOString().split('T')[0],
    customer: "",
    department: "",
    contact_person: "",
    mobile: "",
    service_provider_type: "OWN",
    engineer: "",
    vendor_name: "",
    equipment_name: "",
    make: "",
    model: "",
    serial_no: "",
    asset_id: "",
    service_type: "",
    complaint_reported: "",
    action_taken: "",
    spare_parts: "",
    equipment_status: "",
    coverage_mode: "",
    priority: "",
    service_close_dttime: "",
    products: [],
  });

  // Fetch employees for dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployee();
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  // Close product dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (productDropdownRef.current && !productDropdownRef.current.contains(e.target)) {
        setIsProductDropdownOpen(false);
        setProductSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProductSelection = (product) => {
    setFormData((prev) => {
      const isSelected = prev.products.includes(product);
      return {
        ...prev,
        products: isSelected
          ? prev.products.filter((p) => p !== product)
          : [...prev.products, product],
      };
    });
    setIsSaved(false);
  };

  // Load call log if editing
  useEffect(() => {
    console.log("useEffect triggered with id:", id);
    if (id) {
      loadCallLog();
    }
  }, [id]);

  const loadCallLog = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("Loading call log with ID:", id);
      const data = await getCalllogById(id);
      console.log("Call log data loaded:", data);
      
      // Format datetime field for datetime-local input
      const formattedData = {
        ...data,
        call_no: data.call_no || "",
        call_date: data.call_date || "",
        service_close_dttime: data.service_close_dttime 
          ? new Date(data.service_close_dttime).toISOString().slice(0, 16)
          : "",
      };
      
      setFormData(formattedData);
      setIsSaved(true);
    } catch (err) {
      console.error("Error loading call log:", err);
      setError(err.response?.data?.message || err.message || "Error loading call log");
      setIsSaved(false);
    } finally {
      setLoading(false);
    }
  };

    // State for dynamic multi-row documents
  const [documentList, setDocumentList] = useState([
    { file: null, description: "", fileType: "" },
  ]);

  // Row management handlers
  const handleAddDocumentRow = () => {
    setDocumentList((prev) => [
      ...prev,
      { file: null, description: "", fileType: "" },
    ]);
  };

  const handleRemoveDocumentRow = (index) => {
    setDocumentList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRowFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...documentList];
      updated[index] = {
        ...updated[index],
        file,
        fileType: file.type.includes("image") ? "image" : "pdf",
      };
      setDocumentList(updated);
    }
  };

  const handleRowDescriptionChange = (index, value) => {
    const updated = [...documentList];
    updated[index].description = value;
    setDocumentList(updated);
  };

  // Reusable upload executor per document row
  const executeImageUpload = async (targetCallNo, docItem) => {
    if (!docItem?.file) return null;

    const calllogFormData = new FormData();
    calllogFormData.append("file", docItem.file);
    calllogFormData.append("serviceCallNo", targetCallNo);
    // calllogFormData.append(
    //   "imagePath",
    //   `uploads/crm/Calllog/${docItem.file.name}`
    // );
    calllogFormData.append("fileType", docItem.fileType || "");
    calllogFormData.append("description", docItem.description || "");
    calllogFormData.append("createdBy", "");

    return await uploadCalllogImage(targetCallNo, calllogFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsSaved(false);
  };

  const handleSave = async () => {
  try {
    setSaving(true);
    setError("");

    // 1. Safe Date Formatting (handles empty strings safely)
    const formattedDate = formData.service_close_dttime
      ? new Date(formData.service_close_dttime).toISOString()
      : null;

    const dataToSave = {
      ...formData,
      service_close_dttime: formattedDate,
    };

    // 2. Save main record
    const response = await saveCalllog(dataToSave, id);
    const callNo = response?.call_no || formData?.call_no || id;

    // 3. Process document uploads
    const validDocs = documentList.filter((doc) => doc.file && doc.description);
    let uploadErrorsCount = 0;

    if (validDocs.length > 0 && callNo) {
      for (const doc of validDocs) {
        try {
          await executeImageUpload(callNo, doc);
          console.log(`✓ SUCCESS - Uploaded ${doc.file.name}`);
        } catch (uploadErr) {
          uploadErrorsCount++;
          console.error(`⚠ ERROR - Failed uploading ${doc.file.name}:`, uploadErr);
        }
      }
    }

    // 4. Handle navigation & UI feedback based on upload results
    if (uploadErrorsCount > 0) {
      setError(`Call log saved, but ${uploadErrorsCount} document(s) failed to upload.`);
      setIsSaved(true);
    } else {
      setIsSaved(true);
      setDocumentList([{ file: null, description: "", fileType: "" }]);
      
      // Auto-redirect only on complete success
      setTimeout(() => {
        navigate("/crm/call-log");
      }, 1500);
    }

  } catch (err) {
    setError(err.message || "Error saving call log");
    console.error("Save error:", err);
  } finally {
    setSaving(false);
  }
};

  return (
    <Layout>
      <div className="employee-add">
        {/* Breadcrumb Header */}
        <div className="employee-add-breadcrumb">
          <span>CRM</span>
          <span className="separator">›</span>
          <span>Activity</span>
          <span className="separator">›</span>
          <span>{id ? "Edit" : "New"} Call Log</span>
        </div>

        {error && (
          <div style={{ 
            padding: "12px 16px", 
            marginBottom: "16px", 
            backgroundColor: "#fee", 
            color: "#c33", 
            borderRadius: "6px",
            border: "1px solid #fcc"
          }}>
            Error: {error}
          </div>
        )}

        {isSaved && !saving && (
          <div style={{ 
            padding: "12px 16px", 
            marginBottom: "16px", 
            backgroundColor: "#efe", 
            color: "#3c3", 
            borderRadius: "6px",
            border: "1px solid #cfc"
          }}>
            ✓ Call log saved successfully!
          </div>
        )}

        {loading && id && (
          <div style={{ 
            padding: "12px 16px", 
            marginBottom: "16px", 
            backgroundColor: "#f0f0f0", 
            color: "#666", 
            borderRadius: "6px",
            border: "1px solid #ddd"
          }}>
            ⏳ Loading call log data...
          </div>
        )}

        <>
           
            <div className="employee-add-heading">
              <div>
                <h1>{id ? "Edit" : "New"} Call Log</h1>
                <span className={`not-saved-badge ${isSaved ? "saved" : ""}`}>
                  {isSaved ? "Saved" : "Not Saved"}
                </span>
              </div>
              <button 
                type="button" 
                className="save-btn" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>

            <div className="employee-add-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`employee-tab ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="employee-add-form">
          {/* Tab 1: Call Details */}
          {activeTab === "Call Details" && (
            <div className="form-grid">
              {id && (
              <div className="form-field">
                <label>
                  Call Log No
                </label>
                <p><b>{formData.call_no}</b></p>
              </div>
              )}
              <div className="form-field">
                <label>
                  Hospital / Customer <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="customer"
                  value={formData.customer}
                  onChange={handleInputChange}
                  placeholder="Enter hospital or customer name"
                />
              </div>
              <div className="form-field">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Enter department"
                />
              </div>
              <div className="form-field">
                <label>Contact Person</label>
                <input
                  type="text"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleInputChange}
                  placeholder="Enter contact person name"
                />
              </div>
              <div className="form-field">
                <label>Mobile</label>
                <input
                  type="number"
                  name="mobile"
                  value={formData.mobile}
                  maxLength={10}
                  onInput={(e) => {
                    if (e.target.value.length > 10) {
                      e.target.value = e.target.value.slice(0, 10);
                    }
                  }}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number"
                />
              </div>
              <div className="form-field" ref={productDropdownRef} style={{ position: "relative" }}>
                <label>Product</label>
                <button
                  type="button"
                  className="multiselect-toggle"
                  onClick={() => setIsProductDropdownOpen((prev) => !prev)}
                >
                  <span>
                    {formData.products.length > 0
                      ? formData.products.join(", ")
                      : "-- Select Product --"}
                  </span>
                  <span className={`chevron ${isProductDropdownOpen ? "open" : ""}`}>▾</span>
                </button>

                {isProductDropdownOpen && (
                  <div className="multiselect-panel">
                    <input
                      type="text"
                      className="multiselect-search"
                      placeholder="Type to search product..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      autoFocus
                    />
                    {PRODUCT_OPTIONS.filter((product) =>
                      product.toLowerCase().includes(productSearch.toLowerCase())
                    ).map((product) => (
                      <label key={product} className="multiselect-option">
                        <input
                          type="checkbox"
                          checked={formData.products.includes(product)}
                          onChange={() => toggleProductSelection(product)}
                        />
                        {product}
                      </label>
                    ))}
                    {PRODUCT_OPTIONS.filter((product) =>
                      product.toLowerCase().includes(productSearch.toLowerCase())
                    ).length === 0 && (
                      <div className="multiselect-empty">No products found</div>
                    )}
                  </div>
                )}
              </div>

                <div className="form-field full-width"><label>Discussion Notes</label><textarea name="discussion_notes" rows="4" placeholder="Discussion Notes"></textarea></div>
           
            </div>
        
          )}
        </div>
          </>
      </div>
    </Layout>
  );
}
export default SaveCall;