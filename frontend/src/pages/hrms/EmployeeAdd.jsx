import { useState ,useEffect} from "react";
import Layout from "../../components/Layout";
import "../../styles/employeeAdd.css";
import { saveEmployee, getEmployeeById,uploadDocuments } from "../../services/hrms/employeeService";
import { useNavigate, useParams } from "react-router-dom";


const tabs = [
  "Personal",
  "Joining",
  "Address & Contacts",
  "Salary",
  "EDU/EXPE",
  "Documents",
];

function EmployeeAdd() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [showUserDetails, setShowUserDetails] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  // --- Personal Tab State ---
  const [empCode, setEmpCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("M");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("S");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [deptId, setDeptId] = useState("");
  const [desigId, setDesigId] = useState("");
  const [catId, setCatId] = useState("");

  // --- Joining Tab State ---
  const [jobApplicant, setJobApplicant] = useState("");
  const [confirmationDate, setConfirmationDate] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [offerDate, setOfferDate] = useState("");
  const [contractEndDate, setContractEndDate] = useState("");
  const [dateOfRetirement, setDateOfRetirement] = useState("");

  // --- Address & Contacts Tab State ---
  const [personalEmail, setPersonalEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileNumber2, setMobileNumber2] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [landmarkLocation, setLandmarkLocation] = useState("");
  const [city, setCity] = useState("");
  const [pin, setPin] = useState("");
  const [stateProvince, setStateProvince] = useState("");

  // --- Salary Tab State ---
  const [bankName, setBankName] = useState("");
  const [bankAccountNo, setBankAccountNo] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [ctc, setCtc] = useState("");

  // --- Dynamic State for Education Block ---
  const [educationList, setEducationList] = useState([
    { degree: "", institute: "", yearOfPassing: "" },
  ]);

  const handleEduChange = (index, field, value) => {
    const updated = [...educationList];
    updated[index][field] = value;
    setEducationList(updated);
  };

  const addEduRow = () => {
    setEducationList([
      ...educationList,
      { degree: "", institute: "", yearOfPassing: "" },
    ]);
  };

  const removeEduRow = (index) => {
    if (educationList.length > 1) {
      setEducationList(educationList.filter((_, i) => i !== index));
    }
  };

  // --- Dynamic State for Experience Block ---
  const [experienceList, setExperienceList] = useState([
    { organization: "", designation: "", fromDate: "", toDate: "" },
  ]);

  const handleExpeChange = (index, field, value) => {
    const updated = [...experienceList];
    updated[index][field] = value;
    setExperienceList(updated);
  };

  const addExpeRow = () => {
    setExperienceList([
      ...experienceList,
      { organization: "", designation: "", fromDate: "", toDate: "" },
    ]);
  };

  const removeExpeRow = (index) => {
    if (experienceList.length > 1) {
      setExperienceList(experienceList.filter((_, i) => i !== index));
    }
  };

  // --- Dynamic State for Documents Block ---
  const [documentList, setDocumentList] = useState([
    { documentName: "", documentId: "", upload: null },
  ]);

  const handleDocChange = (index, field, value) => {
    const updated = [...documentList];
    updated[index][field] = value;
    setDocumentList(updated);
  };

  const addDocRow = () => {
    setDocumentList([
      ...documentList,
      { documentName: "", documentId: "", upload: null },
    ]);
  };

  const removeDocRow = (index) => {
    if (documentList.length > 1) {
      setDocumentList(documentList.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    if (id) {
      loadEmployee();
    }
  }, [id]);

  const loadEmployee = async () => {
    try {
      const data = await getEmployeeById(id);
      if (data) {
        setEmpCode(data.empCode || "");
        setFirstName(data.firstName || "");
        setMiddleName(data.middleName || "");
        setLastName(data.lastName || "");
        setGender(data.gender || "M");
        setDateOfJoining(data.dateOfJoining || "");
        setDateOfBirth(data.dateOfBirth || "");
        setMaritalStatus(data.maritalStatus || "S");
        setBloodGroup(data.bloodGroup || "O+");
        setDeptId(data.deptId || "");
        setDesigId(data.desigId || "");
        setCatId(data.catId || "");
        setJobApplicant(data.jobApplicant || "");
        setConfirmationDate(data.confirmationDate || "");
        setNoticePeriod(data.noticePeriod || "");
        setOfferDate(data.offerDate || "");
        setContractEndDate(data.contractEndDate || "");
        setDateOfRetirement(data.dateOfRetirement || "");
        setPersonalEmail(data.personalEmail || "");
        setMobileNumber(data.mobileNumber || "");
        setMobileNumber2(data.mobileNumber2 || "");
        setAddressLine1(data.addressLine1 || "");
        setAddressLine2(data.addressLine2 || "");
        setLandmarkLocation(data.landmarkLocation || "");
        setCity(data.city || "");
        setPin(data.pin || "");
        setStateProvince(data.stateProvince || "");
        setBankName(data.bankName || "");
        setBankAccountNo(data.bankAccountNo || "");
        setIfscCode(data.ifscCode || "");
        setCtc(data.ctc || "");
      }
    } catch (error) {
      console.error("Failed to load employee details:", error);
    }
  };
   
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName.trim()) {
      console.error("First name is required");
      return;
    }

    if (!empCode.trim()) {
      console.error("Employee code is required");
      return;
    }

    const payload = {
      empCode: empCode,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      gender: gender,
      dateOfJoining: dateOfJoining,
      dateOfBirth: dateOfBirth,
      maritalStatus: maritalStatus,
      bloodGroup: bloodGroup,
      deptId: Number(deptId),
      desigId: Number(desigId),
      catId: Number(catId),
      jobApplicant: jobApplicant,
      confirmationDate: confirmationDate,
      noticePeriod: Number(noticePeriod),
      offerDate: offerDate,
      contractEndDate: contractEndDate,
      dateOfRetirement: dateOfRetirement,
      personalEmail: personalEmail,
      mobileNumber: mobileNumber,
      mobileNumber2: mobileNumber2,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      landmarkLocation: landmarkLocation,
      city: city,
      pin: pin,
      stateProvince: stateProvince,
      bankName: bankName,
      bankAccountNo: bankAccountNo,
      ifscCode: ifscCode,
      ctc: Number(ctc),
    };

    try {
      const response = await saveEmployee(payload, id);
      console.log("✓ SUCCESS - Employee saved:", response);
      // Upload documents if any exist
      const docsWithFiles = documentList.filter((doc) => doc.upload);
      
      if (docsWithFiles.length > 0) {
        const formData = new FormData();

        // Add all files to FormData
        docsWithFiles.forEach((doc, index) => {
          console.log(`Adding file ${index}:`, doc.upload);
          formData.append("files", doc.upload);
        });

        // Add document metadata (use the first document's info for now)
        // Backend expects docId and documentNo in the body
        formData.append("docId", docsWithFiles[0].documentName || "");
        formData.append("documentNo", docsWithFiles[0].documentId || "");

        console.log("FormData to send:", {
          filesCount: docsWithFiles.length,
          docId: docsWithFiles[0].documentName,
          documentNo: docsWithFiles[0].documentId,
        });

        try {
          const uploadResponse = await uploadDocuments(empCode, formData);
          console.log("✓ SUCCESS - Documents uploaded:", uploadResponse);
        } catch (uploadError) {
          console.error("⚠ WARNING - Documents upload failed:", uploadError);
          // Still navigate even if upload fails
        }
      }

      navigate("/hrms/employee");
    } catch (error) {
      console.error("✗ ERROR - Failed to save employee:", error);
    }
  };

  return (
    <Layout>
      <div className="employee-add">
        <div className="employee-add-breadcrumb">
          <span>HRMS</span>
          <span className="separator">›</span>
          <span>Employee</span>
          <span className="separator">›</span>
          <span>New Employee</span>
        </div>

        <div className="employee-add-heading">
          <div>
            <h1>New Employee</h1>
            <span className="not-saved-badge">Not Saved</span>
          </div>
          <button type="button" className="save-btn" onClick={handleSubmit}>
            Save
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
          {activeTab === "Personal" && (
            <>
              <div className="form-grid">
                <div className="form-field">
                  <label>
                    EMP CODE <span className="required">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="empCode" 
                    value={empCode}
                    onChange={(e) => setEmpCode(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>
                    First Name <span className="required">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="firstName" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label>Middle Name</label>
                  <input 
                    type="text" 
                    name="middleName" 
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>
                    Gender <span className="required">*</span>
                  </label>
                  <select 
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>
                    Date of Joining <span className="required">*</span>
                  </label>
                  <input 
                    type="date" 
                    name="dateOfJoining" 
                    value={dateOfJoining}
                    onChange={(e) => setDateOfJoining(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label>
                    Date of Birth <span className="required">*</span>
                  </label>
                  <input 
                    type="date" 
                    name="dateOfBirth" 
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>

                <div className="form-field">
                  <label>Marital Status</label>
                  <select 
                    name="maritalStatus"
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                  >
                    <option value="S">Single</option>
                    <option value="M">Married</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Blood Group</label>
                  <select 
                    name="bloodGroup"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                  </select>
                </div>
                 <div className="form-field">
                  <label>Department</label>
                  <select 
                    name="dept_id"
                    value={deptId}
                    onChange={(e) => setDeptId(e.target.value)}
                  >
                    <option value="">Select Department</option>
                    <option value="1">Department 1</option>
                    <option value="2">Department 2</option>
                    <option value="3">Department 3</option>
                    <option value="4">Department 4</option>
                  </select>
                </div>

                 <div className="form-field">
                  <label>Designation</label>
                  <select 
                    name="desig_id"
                    value={desigId}
                    onChange={(e) => setDesigId(e.target.value)}
                  >
                    <option value="">Select Designation</option>
                    <option value="1">Designation 1</option>
                    <option value="2">Designation 2</option>
                    <option value="3">Designation 3</option>
                    <option value="4">Designation 4</option>
                  </select>
                </div>

                 <div className="form-field">
                  <label>Category</label>
                  <select 
                    name="cat_id"
                    value={catId}
                    onChange={(e) => setCatId(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    <option value="1">Category 1</option>
                    <option value="2">Category 2</option>
                    <option value="3">Category 3</option>
                    <option value="4">Category 4</option>
                  </select>
                </div>

              </div>
            </>
          )}

          {activeTab === "Joining" && (
            <div className="form-grid">
              <div className="form-field">
                <label>Job Applicant</label>
                <input 
                  type="text" 
                  name="jobApplicant" 
                  value={jobApplicant}
                  onChange={(e) => setJobApplicant(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Confirmation Date</label>
                <input 
                  type="date" 
                  name="confirmationDate" 
                  value={confirmationDate}
                  onChange={(e) => setConfirmationDate(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Notice (days)</label>
                <input 
                  type="number" 
                  name="noticePeriod" 
                  value={noticePeriod}
                  onChange={(e) => setNoticePeriod(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Offer Date</label>
                <input 
                  type="date" 
                  name="offerDate" 
                  value={offerDate}
                  onChange={(e) => setOfferDate(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Contract End Date</label>
                <input 
                  type="date" 
                  name="contractEndDate" 
                  value={contractEndDate}
                  onChange={(e) => setContractEndDate(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Date Of Retirement</label>
                <input 
                  type="date" 
                  name="dateOfRetirement" 
                  value={dateOfRetirement}
                  onChange={(e) => setDateOfRetirement(e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === "Address & Contacts" && (
            <div className="form-grid">
              <div className="form-field">
                <label>Personal Email</label>
                <input 
                  type="email" 
                  name="personalEmail" 
                  value={personalEmail}
                  onChange={(e) => setPersonalEmail(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Mobile Number</label>
                <input 
                  type="text" 
                  name="mobileNumber" 
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Mobile Number 2</label>
                <input 
                  type="text" 
                  name="mobileNumber2" 
                  value={mobileNumber2}
                  onChange={(e) => setMobileNumber2(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Address Line 1</label>
                <input 
                  type="text" 
                  name="addressLine1" 
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Address Line 2</label>
                <input 
                  type="text" 
                  name="addressLine2" 
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Landmark/Location</label>
                <input 
                  type="text" 
                  name="landmarkLocation" 
                  value={landmarkLocation}
                  onChange={(e) => setLandmarkLocation(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>City</label>
                <input 
                  type="text" 
                  name="city" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Pin</label>
                <input 
                  type="text" 
                  name="pin" 
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>State/Province</label>
                <input 
                  type="text" 
                  name="stateProvince" 
                  value={stateProvince}
                  onChange={(e) => setStateProvince(e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === "Salary" && (
            <div className="form-grid">
              <div className="form-field">
                <label>Bank Name</label>
                <input 
                  type="text" 
                  name="bankName" 
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Bank Account No.</label>
                <input 
                  type="text" 
                  name="bankAccountNo" 
                  value={bankAccountNo}
                  onChange={(e) => setBankAccountNo(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>IFSC CODE</label>
                <input 
                  type="text" 
                  name="ifscCode" 
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Cost to Company(CTC)</label>
                <input 
                  type="text" 
                  name="ctc" 
                  value={ctc}
                  onChange={(e) => setCtc(e.target.value)}
                />
              </div>
            </div>
          )}

        
          {activeTab === "EDU/EXPE" && (
            <div className="edu-expe-wrapper">
              {/* SECTION 1: QUALIFICATIONS */}
              <div className="form-section">
                <h3 className="section-title">Qualification Details</h3>
                {educationList.map((edu, index) => (
                  <div key={`edu-${index}`} className="dynamic-row grid-3">
                    <div className="form-field">
                      <label>Degree / Qualification</label>
                      <input
                        type="text"
                        placeholder="e.g. B.Tech / MBA"
                        value={edu.degree}
                        onChange={(e) =>
                          handleEduChange(index, "degree", e.target.value)
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label>Institute / University</label>
                      <input
                        type="text"
                        placeholder="University Name"
                        value={edu.institute}
                        onChange={(e) =>
                          handleEduChange(index, "institute", e.target.value)
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label>Year of Passing</label>
                      <input
                        type="number"
                        placeholder="YYYY"
                        value={edu.yearOfPassing}
                        onChange={(e) =>
                          handleEduChange(index, "yearOfPassing", e.target.value)
                        }
                      />
                    </div>

                    {educationList.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeEduRow(index)}
                        title="Remove Qualification"
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn-add" onClick={addEduRow}>
                  + Add Qualification
                </button>
              </div>

              <hr className="form-divider" />

              {/* SECTION 2: WORK EXPERIENCE */}
              <div className="form-section">
                <h3 className="section-title">Work Experience</h3>
                {experienceList.map((exp, index) => (
                  <div key={`exp-${index}`} className="dynamic-row grid-3">
                    <div className="form-field">
                      <label>Organization Name</label>
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={exp.organization}
                        onChange={(e) =>
                          handleExpeChange(index, "organization", e.target.value)
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label>Designation</label>
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={exp.designation}
                        onChange={(e) =>
                          handleExpeChange(index, "designation", e.target.value)
                        }
                      />
                    </div>

                    {/* From - To Date inputs combined in 1 column */}
                    <div className="form-field">
                      <label>Duration (From - To)</label>
                      <div className="duration-inputs">
                        <input
                          type="date"
                          value={exp.fromDate}
                          onChange={(e) =>
                            handleExpeChange(index, "fromDate", e.target.value)
                          }
                        />
                        <span className="duration-separator">to</span>
                        <input
                          type="date"
                          value={exp.toDate}
                          onChange={(e) =>
                            handleExpeChange(index, "toDate", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {experienceList.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeExpeRow(index)}
                        title="Remove Experience"
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn-add" onClick={addExpeRow}>
                  + Add Experience
                </button>
              </div>
            </div>
          )}

             {activeTab === "Documents" && (
            <div className="edu-expe-wrapper">
           
              <div className="form-section">
                <h3 className="section-title">Document Details</h3>
                {documentList.map((doc, index) => (
                  <div key={`doc-${index}`} className="dynamic-row grid-3">
                    <div className="form-field">
                      <label>Document Name</label>
                       <select
                         value={doc.documentName}
                         onChange={(e) =>
                           handleDocChange(index, "documentName", e.target.value)
                         }
                       >
                         <option value="">Select Document</option>
                         <option value="1">Passport</option>
                         <option value="2">Aadhar</option>
                         <option value="3">PAN</option>
                       </select>
                      
                    </div>

                    <div className="form-field">
                      <label>Document ID</label>
                      <input
                        type="text"
                        placeholder="Document ID"
                        value={doc.documentId}
                        onChange={(e) =>
                          handleDocChange(index, "documentId", e.target.value)
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label>Upload</label>
                      <input
                        type="file"
                        onChange={(e) =>
                          handleDocChange(index, "upload", e.target.files[0])
                        }
                      />
                    </div>

                    {documentList.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeDocRow(index)}
                        title="Remove Document"
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn-add" onClick={addDocRow}>
                  + Add Document
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default EmployeeAdd;