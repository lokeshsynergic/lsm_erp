import { useState } from "react";
import Layout from "../../components/Layout";
import "../../styles/employeeAdd.css";

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
          <button type="button" className="save-btn">
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
                  <input type="text" />
                </div>
                <div className="form-field">
                  <label>
                    First Name <span className="required">*</span>
                  </label>
                  <input type="text" />
                </div>

                <div className="form-field">
                  <label>Middle Name</label>
                  <input type="text" />
                </div>
                <div className="form-field">
                  <label>Last Name</label>
                  <input type="text" />
                </div>
                <div className="form-field">
                  <label>
                    Gender <span className="required">*</span>
                  </label>
                  <select>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>
                    Date of Joining <span className="required">*</span>
                  </label>
                  <input type="date" />
                </div>

                <div className="form-field">
                  <label>
                    Date of Birth <span className="required">*</span>
                  </label>
                  <input type="date" />
                </div>

                <div className="form-field">
                  <label>Marital Status</label>
                  <select>
                    <option>Single</option>
                    <option>Married</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Blood Group</label>
                  <select>
                    <option>O+</option>
                    <option>A+</option>
                    <option>B+</option>
                    <option>AB+</option>
                  </select>
                </div>
                <div className="form-field" />
              </div>
            </>
          )}

          {activeTab === "Joining" && (
            <div className="form-grid">
              <div className="form-field">
                <label>Job Applicant</label>
                <input type="text" />
              </div>

              <div className="form-field">
                <label>Confirmation Date</label>
                <input type="date" />
              </div>

              <div className="form-field">
                <label>Notice (days)</label>
                <input type="number" />
              </div>

              <div className="form-field">
                <label>Offer Date</label>
                <input type="date" />
              </div>

              <div className="form-field">
                <label>Contract End Date</label>
                <input type="date" />
              </div>

              <div className="form-field">
                <label>Date Of Retirement</label>
                <input type="date" />
              </div>
            </div>
          )}

          {activeTab === "Address & Contacts" && (
            <div className="form-grid">
              <div className="form-field">
                <label>Personal Email</label>
                <input type="email" />
              </div>

              <div className="form-field">
                <label>Mobile Number</label>
                <input type="text" />
              </div>
              <div className="form-field">
                <label>Mobile Number 2</label>
                <input type="text" />
              </div>

              <div className="form-field">
                <label>Address Line 1</label>
                <input type="text" />
              </div>

              <div className="form-field">
                <label>Address Line 2</label>
                <input type="text" />
              </div>

              <div className="form-field">
                <label>Landmark/Location</label>
                <input type="text" />
              </div>

              <div className="form-field">
                <label>City</label>
                <input type="text" />
              </div>
              <div className="form-field">
                <label>Pin</label>
                <input type="text" />
              </div>
              <div className="form-field">
                <label>State/Province</label>
                <input type="text" />
              </div>
            </div>
          )}

          {activeTab === "Salary" && (
            <div className="form-grid">
              <div className="form-field">
                <label>Bank Name</label>
                <input type="text" />
              </div>

              <div className="form-field">
                <label>Bank Account No.</label>
                <input type="text" />
              </div>

              <div className="form-field">
                <label>IFSC CODE</label>
                <input type="text" />
              </div>

              <div className="form-field">
                <label>Cost to Company(CTC)</label>
                <input type="text" />
              </div>
            </div>
          )}

          {/* INTEGRATED EDU/EXPE TAB */}
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
        </div>
      </div>
    </Layout>
  );
}

export default EmployeeAdd;