import { apiRequest } from "../../api/apiService";

//   Function for Employee
export const getEmployee = (data) => {
  return apiRequest("GET", "/master/emp", data);
};
export const saveEmployee = (data, id) => {
  if (id) {
    // UPDATE existing employee (PUT /master/emp/4)
    return apiRequest("PUT", `/master/emp/${id}`, data);
  } else {
    // CREATE new employee (POST /master/emp)
    return apiRequest("POST", "/master/emp", data);
  }
};
export const uploadDocuments = (empCode, formData) => {
  return apiRequest("POST", `/master/emp/${empCode}/documents`, formData);
};

export const getEmployeeDocuments = (empCode) => {
  return apiRequest("GET", `/master/emp/${empCode}/documents`);
};

export const getEmployeeById = (id) => {
  return apiRequest("GET", `/master/emp/id/${id}`);
};

export const getEmployeeQualifications = (empCode) => {
  return apiRequest("GET", `/master/emp/${empCode}/qualifications`);
};
export const getEmployeeExperience = (empCode) => {
  return apiRequest("GET", `/master/emp/${empCode}/experience`);
};

export const todayattnsumm = () => {
  return apiRequest("GET", `/master/emp/todayattnsumm`);
};

export const getLast30DaysAttendance = () => {
  return apiRequest("GET", `/master/emp/lastthirtydaysattendance`);
};
export const getusersAttendance = (empCode) => {
  return apiRequest("GET", `/master/emp/${empCode}/lastthirtydaysattendance`);
};
