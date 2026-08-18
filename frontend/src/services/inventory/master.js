import { apiRequest } from "../../api/apiService";

export const getCategory = (data) => {
  return apiRequest("GET", "invt/master/category", data);
};
export const saveCategory = (data, id) => {
  if (id) {
    // UPDATE existing category (PUT /master/category/4)
    return apiRequest("PUT", `invt/master/category/${id}`, data);
  } else {
    // CREATE new category (POST /master/category)
    return apiRequest("POST", "invt/master/category", data);
  }
};

export const getCategoryById = (id) => {
  return apiRequest("GET", `invt/master/category/${id}`);
};

//    Function for Subcategory
export const getSubCategory = (data) => {
  return apiRequest("GET", "invt/master/subcategory", data);
};
export const saveSubCategory = (data, id) => {
  if (id) {
    // UPDATE existing subcategory (PUT /master/subcategory/4)
    return apiRequest("PUT", `invt/master/subcategory/${id}`, data);
  } else {
    // CREATE new subcategory (POST /master/subcategory)
    return apiRequest("POST", "invt/master/subcategory", data);
  }
};

export const getSubCategoryById = (id) => {
  return apiRequest("GET", `invt/master/subcategory/${id}`);
};

//    Function for Manufacturer
export const getManufacturer = (data) => {
  return apiRequest("GET", "invt/master/manufacturer", data);
};
export const saveManufacturer = (data, id) => {
  if (id) {
    // UPDATE existing manufacturer (PUT /master/manufacturer/4)
    return apiRequest("PUT", `invt/master/manufacturer/${id}`, data);
  } else {
    // CREATE new manufacturer (POST /master/manufacturer)
    return apiRequest("POST", "invt/master/manufacturer", data);
  }
};

export const getManufacturerById = (id) => {
  return apiRequest("GET", `invt/master/manufacturer/${id}`);
};

//    Function for Unit
export const getUnit = (data) => {
  return apiRequest("GET", "invt/master/unit", data);
};
export const saveUnit = (data, id) => {
  if (id) {
    // UPDATE existing unit (PUT /master/unit/4)
    return apiRequest("PUT", `invt/master/unit/${id}`, data);
  } else {
    // CREATE new unit (POST /master/unit)
    return apiRequest("POST", "invt/master/unit", data);
  }
};

export const getUnitById = (id) => {
  return apiRequest("GET", `invt/master/unit/${id}`);
};
