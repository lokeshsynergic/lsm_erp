import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../../components/Layout";
import "../../../styles/main.css";
import {
  addCustomerBankDetail,
  addCustomerDocument,
  deleteCustomerBankDetail,
  deleteCustomerDocument,
  getCustomerBankDetails,
  getCustomerById,
  getCustomerDocuments,
  saveCustomer,
} from "../../../services/crm/customers";

const tabs = [
  "Customer Details",
  "Contact",
  "Billing & Tax",
  "Account",
  "Bank & Documents",
];

function CustomerAdd() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const navigate = useNavigate();
  const { id } = useParams();

  const [customerCode, setCustomerCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [tradeName, setTradeName] = useState("");
  const [customerType, setCustomerType] = useState("Company");
  const [customerCategory, setCustomerCategory] = useState("Retail");

  const [primaryContactName, setPrimaryContactName] = useState("");
  const [primaryContactDesignation, setPrimaryContactDesignation] = useState("");
  const [primaryMobile, setPrimaryMobile] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [alternateEmail, setAlternateEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const [billingAddressLine1, setBillingAddressLine1] = useState("");
  const [billingAddressLine2, setBillingAddressLine2] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingPincode, setBillingPincode] = useState("");
  const [billingCountry, setBillingCountry] = useState("India");
  const [isShippingSameAsBilling, setIsShippingSameAsBilling] = useState(true);
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");
  const [tan, setTan] = useState("");
  const [licenseNo, setLicenseNo] = useState("");

  const [accountOwnerEmployeeId, setAccountOwnerEmployeeId] = useState("");
  const [leadSourceId, setLeadSourceId] = useState("");
  const [customerSince, setCustomerSince] = useState("");
  const [accountTier, setAccountTier] = useState("Standard");
  const [relationshipStatus, setRelationshipStatus] = useState("Active");
  const [remarks, setRemarks] = useState("");

  const [bankDetails, setBankDetails] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [isPrimaryBank, setIsPrimaryBank] = useState(false);
  const [documentType, setDocumentType] = useState("GST");
  const [documentName, setDocumentName] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [error, setError] = useState("");

  const formatDate = (value) => {
    if (!value) {
      return "";
    }

    return String(value).slice(0, 10);
  };

  const loadCustomer = useCallback(async () => {
    try {
      const data = await getCustomerById(id);
      if (data) {
        setCustomerCode(data.customer_code || "");
        setCustomerName(data.customer_name || "");
        setTradeName(data.trade_name || "");
        setCustomerType(data.customer_type || "Company");
        setCustomerCategory(data.customer_category || "Retail");
        setPrimaryContactName(data.primary_contact_name || "");
        setPrimaryContactDesignation(data.primary_contact_designation || "");
        setPrimaryMobile(data.primary_mobile || "");
        setAlternatePhone(data.alternate_phone || "");
        setPrimaryEmail(data.primary_email || "");
        setAlternateEmail(data.alternate_email || "");
        setWhatsappNumber(data.whatsapp_number || "");
        setBillingAddressLine1(data.billing_address_line1 || "");
        setBillingAddressLine2(data.billing_address_line2 || "");
        setBillingCity(data.billing_city || "");
        setBillingState(data.billing_state || "");
        setBillingPincode(data.billing_pincode || "");
        setBillingCountry(data.billing_country || "India");
        setIsShippingSameAsBilling(
          data.is_shipping_same_as_billing !== undefined ? data.is_shipping_same_as_billing : true
        );
        setGstin(data.gstin || "");
        setPan(data.pan || "");
        setTan(data.tan || "");
        setLicenseNo(data.license_no || "");
        setAccountOwnerEmployeeId(data.account_owner_employee_id || "");
        setLeadSourceId(data.lead_source_id || "");
        setCustomerSince(formatDate(data.customer_since));
        setAccountTier(data.account_tier || "Standard");
        setRelationshipStatus(data.relationship_status || "Active");
        setRemarks(data.remarks || "");

        const customerBanks = await getCustomerBankDetails(id);
        setBankDetails(Array.isArray(customerBanks) ? customerBanks : []);

        const customerDocs = await getCustomerDocuments(id);
        setDocuments(Array.isArray(customerDocs) ? customerDocs : []);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadCustomer();
    }
  }, [id, loadCustomer]);

  const buildPayload = () => ({
    customer_code: customerCode.trim(),
    customer_name: customerName.trim(),
    trade_name: tradeName.trim() || null,
    customer_type: customerType,
    customer_category: customerCategory,
    primary_contact_name: primaryContactName.trim(),
    primary_contact_designation: primaryContactDesignation.trim() || null,
    primary_mobile: primaryMobile.trim(),
    alternate_phone: alternatePhone.trim() || null,
    primary_email: primaryEmail.trim(),
    alternate_email: alternateEmail.trim() || null,
    whatsapp_number: whatsappNumber.trim() || null,
    billing_address_line1: billingAddressLine1.trim(),
    billing_address_line2: billingAddressLine2.trim() || null,
    billing_city: billingCity.trim(),
    billing_state: billingState.trim(),
    billing_pincode: billingPincode.trim(),
    billing_country: billingCountry.trim() || "India",
    is_shipping_same_as_billing: isShippingSameAsBilling,
    gstin: gstin.trim() || null,
    pan: pan.trim() || null,
    tan: tan.trim() || null,
    license_no: licenseNo.trim() || null,
    account_owner_employee_id: accountOwnerEmployeeId.trim(),
    lead_source_id: leadSourceId.trim() || null,
    customer_since: customerSince || null,
    account_tier: accountTier,
    relationship_status: relationshipStatus,
    remarks: remarks.trim() || null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!customerCode.trim() || !customerName.trim()) {
      setError("Customer code and name are required");
      return;
    }

    try {
      await saveCustomer(buildPayload(), id);
      navigate("/inventory/customer");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddBankDetail = async () => {
    if (!id) {
      setError("Save customer before adding bank details");
      return;
    }

    if (!bankName.trim() || !accountNumber.trim() || !ifscCode.trim() || !accountHolderName.trim()) {
      setError("Bank name, account number, IFSC and holder name are required");
      return;
    }

    try {
      const newBank = await addCustomerBankDetail(id, {
        customer_id: Number(id),
        bank_name: bankName,
        account_number: accountNumber,
        ifsc_code: ifscCode,
        account_holder_name: accountHolderName,
        is_primary: isPrimaryBank,
      });
      setBankDetails([...bankDetails, newBank]);
      setBankName("");
      setAccountNumber("");
      setIfscCode("");
      setAccountHolderName("");
      setIsPrimaryBank(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveBankDetail = async (bankAccountId) => {
    try {
      await deleteCustomerBankDetail(bankAccountId);
      setBankDetails(bankDetails.filter((bank) => bank.bank_account_id !== bankAccountId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddDocument = async () => {
    if (!id) {
      setError("Save customer before adding documents");
      return;
    }

    if (!documentName.trim() || !documentUrl.trim()) {
      setError("Document name and URL are required");
      return;
    }

    try {
      const newDocument = await addCustomerDocument(id, {
        customer_id: Number(id),
        document_type: documentType,
        document_name: documentName,
        document_url: documentUrl,
      });
      setDocuments([...documents, newDocument]);
      setDocumentType("GST");
      setDocumentName("");
      setDocumentUrl("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveDocument = async (documentId) => {
    try {
      await deleteCustomerDocument(documentId);
      setDocuments(documents.filter((document) => document.document_id !== documentId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      <div className="product-add">
        <div className="product-add-breadcrumb">
          <span>INVENTORY</span>
          <span className="separator">›</span>
          <span>Customer</span>
          <span className="separator">›</span>
          <span>{id ? "Edit Customer" : "New Customer"}</span>
        </div>

        <div className="product-add-heading">
          <div>
            <h1>{id ? "Edit Customer" : "New Customer"}</h1>
            <span className="not-saved-badge">{id ? "Editing" : "Not Saved"}</span>
          </div>
          <button type="button" className="save-btn" onClick={handleSubmit}>
            {id ? "Update" : "Save"}
          </button>
        </div>

        <div className="product-add-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`product-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="product-add-form">
          {activeTab === "Customer Details" && (
            <div className="form-grid">
              <div className="form-field">
                <label>
                  Customer Code <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={customerCode}
                  onChange={(e) => setCustomerCode(e.target.value)}
                  disabled={id ? true : false}
                  placeholder="Enter customer code"
                />
              </div>

              <div className="form-field">
                <label>
                  Customer Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>

              <div className="form-field">
                <label>Trade Name</label>
                <input
                  type="text"
                  value={tradeName}
                  onChange={(e) => setTradeName(e.target.value)}
                  placeholder="Enter trade name"
                />
              </div>

              <div className="form-field">
                <label>Customer Type</label>
                <select value={customerType} onChange={(e) => setCustomerType(e.target.value)}>
                  <option value="Individual">Individual</option>
                  <option value="Proprietorship">Proprietorship</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Pvt Ltd">Pvt Ltd</option>
                  <option value="Public Ltd">Public Ltd</option>
                  <option value="Hospital">Hospital</option>
                  <option value="Clinic">Clinic</option>
                  <option value="Government">Government</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="form-field">
                <label>Customer Category</label>
                <select
                  value={customerCategory}
                  onChange={(e) => setCustomerCategory(e.target.value)}
                >
                  
                 
                  <option value="Distributor">Wholesale</option>
                  <option value="Dealer">Corporate</option>
                  <option value="Institutional">Institutional</option>
                  <option value="Retail">Retail</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "Contact" && (
            <div className="form-grid">
              <div className="form-field">
                <label>
                  Primary Contact Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={primaryContactName}
                  onChange={(e) => setPrimaryContactName(e.target.value)}
                  placeholder="Enter contact name"
                />
              </div>

              <div className="form-field">
                <label>Designation</label>
                <input
                  type="text"
                  value={primaryContactDesignation}
                  onChange={(e) => setPrimaryContactDesignation(e.target.value)}
                  placeholder="Enter designation"
                />
              </div>

              <div className="form-field">
                <label>
                  Primary Mobile <span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={primaryMobile}
                  onChange={(e) => setPrimaryMobile(e.target.value)}
                  placeholder="Enter mobile number"
                />
              </div>

              <div className="form-field">
                <label>Alternate Phone</label>
                <input
                  type="text"
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value)}
                  placeholder="Enter alternate phone"
                />
              </div>

              <div className="form-field">
                <label>
                  Primary Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  value={primaryEmail}
                  onChange={(e) => setPrimaryEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </div>

              <div className="form-field">
                <label>Alternate Email</label>
                <input
                  type="email"
                  value={alternateEmail}
                  onChange={(e) => setAlternateEmail(e.target.value)}
                  placeholder="Enter alternate email"
                />
              </div>

              <div className="form-field">
                <label>WhatsApp Number</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="Enter WhatsApp number"
                />
              </div>
            </div>
          )}

          {activeTab === "Billing & Tax" && (
            <>
              <div className="form-grid">
                <div className="form-field">
                  <label>
                    Billing Address Line 1 <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={billingAddressLine1}
                    onChange={(e) => setBillingAddressLine1(e.target.value)}
                    placeholder="Enter address line 1"
                  />
                </div>

                <div className="form-field">
                  <label>Billing Address Line 2</label>
                  <input
                    type="text"
                    value={billingAddressLine2}
                    onChange={(e) => setBillingAddressLine2(e.target.value)}
                    placeholder="Enter address line 2"
                  />
                </div>

                <div className="form-field">
                  <label>
                    City <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={billingCity}
                    onChange={(e) => setBillingCity(e.target.value)}
                    placeholder="Enter city"
                  />
                </div>

                <div className="form-field">
                  <label>
                    State <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={billingState}
                    onChange={(e) => setBillingState(e.target.value)}
                    placeholder="Enter state"
                  />
                </div>

                <div className="form-field">
                  <label>
                    Pincode <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={billingPincode}
                    onChange={(e) => setBillingPincode(e.target.value)}
                    placeholder="Enter pincode"
                  />
                </div>

                <div className="form-field">
                  <label>Country</label>
                  <input
                    type="text"
                    value={billingCountry}
                    onChange={(e) => setBillingCountry(e.target.value)}
                    placeholder="Enter country"
                  />
                </div>

                <div className="form-field">
                  <label>GSTIN</label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="Enter GSTIN"
                  />
                </div>

                <div className="form-field">
                  <label>PAN</label>
                  <input
                    type="text"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    placeholder="Enter PAN"
                  />
                </div>

                <div className="form-field">
                  <label>TAN</label>
                  <input
                    type="text"
                    value={tan}
                    onChange={(e) => setTan(e.target.value)}
                    placeholder="Enter TAN"
                  />
                </div>

                <div className="form-field">
                  <label>License No</label>
                  <input
                    type="text"
                    value={licenseNo}
                    onChange={(e) => setLicenseNo(e.target.value)}
                    placeholder="Enter license no"
                  />
                </div>

                <div className="form-field checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={isShippingSameAsBilling}
                      onChange={(e) => setIsShippingSameAsBilling(e.target.checked)}
                    />
                    Shipping same as billing
                  </label>
                </div>
              </div>
            </>
          )}

          {activeTab === "Account" && (
            <>
              <div className="form-grid">
                <div className="form-field">
                  <label>
                    Account Owner Employee ID <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    value={accountOwnerEmployeeId}
                    onChange={(e) => setAccountOwnerEmployeeId(e.target.value)}
                    placeholder="Enter employee"
                  />
                </div>

                <div className="form-field">
                  <label>Lead Source ID</label>
                  <input
                    type="text"
                    value={leadSourceId}
                    onChange={(e) => setLeadSourceId(e.target.value)}
                    placeholder="Enter lead source"
                  />
                </div>

                <div className="form-field">
                  <label>Customer Since</label>
                  <input
                    type="date"
                    value={customerSince}
                    onChange={(e) => setCustomerSince(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label>Account Tier</label>
                  <select value={accountTier} onChange={(e) => setAccountTier(e.target.value)}>
                    <option value="Key Account">Standard</option>
                    <option value="Standard">Premium</option>
                    <option value="Prospect">Enterprise</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Relationship Status</label>
                  <select
                    value={relationshipStatus}
                    onChange={(e) => setRelationshipStatus(e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Dormant">Dormant</option>
                    <option value="Blacklisted">Blacklisted</option>
                  </select>
                </div>
              </div>

              <div className="form-field full-width">
                <label>Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Enter remarks"
                  rows="4"
                />
              </div>
            </>
          )}

          {activeTab === "Bank & Documents" && (
            <>
              <div className="section-title">Bank Details</div>
              <div className="document-upload-section">
                <div className="form-grid">
                  <div className="form-field">
                    <label>Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="Enter bank name"
                    />
                  </div>

                  <div className="form-field">
                    <label>Account Number</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Enter account number"
                    />
                  </div>

                  <div className="form-field">
                    <label>IFSC Code</label>
                    <input
                      type="text"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      placeholder="Enter IFSC code"
                    />
                  </div>

                  <div className="form-field">
                    <label>Account Holder Name</label>
                    <input
                      type="text"
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      placeholder="Enter holder name"
                    />
                  </div>

                  <div className="form-field checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={isPrimaryBank}
                        onChange={(e) => setIsPrimaryBank(e.target.checked)}
                      />
                      Primary Account
                    </label>
                  </div>
                </div>

                <button type="button" className="add-btn" onClick={handleAddBankDetail}>
                  Add Bank Detail
                </button>
              </div>

              {bankDetails.length > 0 && (
                <div className="documents-list">
                  <table>
                    <thead>
                      <tr>
                        <th>Bank Name</th>
                        <th>Account Number</th>
                        <th>IFSC</th>
                        <th>Holder Name</th>
                        <th>Primary</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bankDetails.map((bank) => (
                        <tr key={bank.bank_account_id}>
                          <td>{bank.bank_name}</td>
                          <td>{bank.account_number}</td>
                          <td>{bank.ifsc_code}</td>
                          <td>{bank.account_holder_name}</td>
                          <td>{bank.is_primary ? "Yes" : "No"}</td>
                          <td>
                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() => handleRemoveBankDetail(bank.bank_account_id)}
                              title="Delete Bank Detail"
                              aria-label="Delete Bank Detail"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="section-title" style={{ marginTop: "30px" }}>
                Customer Documents
              </div>
              <div className="document-upload-section">
                <div className="form-grid">
                  <div className="form-field">
                    <label>Document Type</label>
                    <select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
                      <option value="GST Certificate">GST Certificate</option>
                      <option value="PAN Card">PAN Card</option>
                      <option value="Drug License Copy">Drug License Copy</option>
                      <option value="Signed Agreement/Contract">Signed Agreement/Contract</option>
                      <option value="Other KYC">Other</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>Document Name</label>
                    <input
                      type="text"
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                      placeholder="Enter document name"
                    />
                  </div>

                  <div className="form-field">
                    <label>Document URL</label>
                    <input
                      type="text"
                      value={documentUrl}
                      onChange={(e) => setDocumentUrl(e.target.value)}
                      placeholder="Enter document URL or path"
                    />
                  </div>
                </div>

                <button type="button" className="add-btn" onClick={handleAddDocument}>
                  Add Document
                </button>
              </div>

              {documents.length > 0 && (
                <div className="documents-list">
                  <table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Document Name</th>
                        <th>URL</th>
                        <th>Uploaded At</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((document) => (
                        <tr key={document.document_id}>
                          <td>{document.document_type}</td>
                          <td>{document.document_name}</td>
                          <td>{document.document_url}</td>
                          <td>{new Date(document.uploaded_at).toLocaleDateString()}</td>
                          <td>
                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() => handleRemoveDocument(document.document_id)}
                              title="Delete Document"
                              aria-label="Delete Document"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </Layout>
  );
}

export default CustomerAdd;
