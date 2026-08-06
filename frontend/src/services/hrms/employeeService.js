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

export const getEmployeeById = (id) => {
  return apiRequest("GET", `/master/emp/${id}`);
};
