import { apiRequest } from "../../api/apiService";

export const saveDepartment = (data, id) => {
  if (id) {
    // UPDATE existing department (PUT /master/dept/4)
    return apiRequest("PUT", `/master/dept/${id}`, data);
  } else {
    // CREATE new department (POST /master/dept)
    return apiRequest("POST", "/master/dept", data);
  }
};

export const getDepartment = (data) => {
  return apiRequest("GET", "/master/dept", data);
};

export const getDepartmentById = (id) => {
  return apiRequest("GET", `/master/dept/${id}`);
};

export const getDesignation = (data) => {
  return apiRequest("GET", "/master/desig", data);
};

export const saveDesignation = (data, id) => {
  if (id) {
    // UPDATE existing designation (PUT /master/desig/4)
    return apiRequest("PUT", `/master/desig/${id}`, data);
  } else {
    // CREATE new designation (POST /master/desig)
    return apiRequest("POST", "/master/desig", data);
  }
};

export const getDesignationById = (id) => {
  return apiRequest("GET", `/master/desig/${id}`);
};

//   Function for Category
export const getCategory = (data) => {
  return apiRequest("GET", "/master/category", data);
};
export const saveCategory = (data, id) => {
  if (id) {
    // UPDATE existing category (PUT /master/category/4)
    return apiRequest("PUT", `/master/category/${id}`, data);
  } else {
    // CREATE new category (POST /master/category)
    return apiRequest("POST", "/master/category", data);
  }
};

export const getCategoryById = (id) => {
  return apiRequest("GET", `/master/category/${id}`);
};

//   Function for Document
export const getDocument = (data) => {
  return apiRequest("GET", "/master/document", data);
};
export const saveDocument = (data, id) => {
  if (id) {
    // UPDATE existing document (PUT /master/document/4)
    return apiRequest("PUT", `/master/document/${id}`, data);
  } else {
    // CREATE new document (POST /master/document)
    return apiRequest("POST", "/master/document", data);
  }
};

export const getDocumentById = (id) => {
  return apiRequest("GET", `/master/document/${id}`);
};

//   Function for Branch
export const getBranch = (data) => {
  return apiRequest("GET", "/master/branch", data);
};
export const saveBranch = (data, id) => {
  if (id) {
    // UPDATE existing branch (PUT /master/branch/4)
    return apiRequest("PUT", `/master/branch/${id}`, data);
  } else {
    // CREATE new branch (POST /master/branch)
    return apiRequest("POST", "/master/branch", data);
  }
};

export const getBranchById = (id) => {
  return apiRequest("GET", `/master/branch/${id}`);
};

//   Function for Shift
export const getShift = (data) => {
  return apiRequest("GET", "/master/shift", data);
};
export const saveShift = (data, id) => {
  if (id) {
    // UPDATE existing shift (PUT /master/shift/4)
    return apiRequest("PUT", `/master/shift/${id}`, data);
  } else {
    // CREATE new shift (POST /master/shift)
    return apiRequest("POST", "/master/shift", data);
  }
};

export const getShiftById = (id) => {
  return apiRequest("GET", `/master/shift/${id}`);
};

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

export const getEmployeeById = (id) => {
  return apiRequest("GET", `/master/emp/${id}`);
};
