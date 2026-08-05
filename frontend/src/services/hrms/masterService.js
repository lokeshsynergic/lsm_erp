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
