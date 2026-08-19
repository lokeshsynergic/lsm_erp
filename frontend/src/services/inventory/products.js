import { apiRequest } from "../../api/apiService";

// Product CRUD operations
export const getProducts = (data) => {
  return apiRequest("GET", "invt/product", data);
};

export const saveProduct = (data, id) => {
  if (id) {
    return apiRequest("PUT", `invt/product/${id}`, data);
  } else {
    return apiRequest("POST", "invt/product", data);
  }
};

export const getProductById = (id) => {
  return apiRequest("GET", `invt/product/${id}`);
};

export const deleteProduct = (id) => {
  return apiRequest("DELETE", `invt/product/${id}`);
};

// Product Image operations
export const addProductImage = (productId, data) => {
  return apiRequest("POST", `invt/product/${productId}/image`, data);
};

export const getProductImages = (productId) => {
  return apiRequest("GET", `invt/product/${productId}/images`);
};

export const updateProductImage = (imageId, data) => {
  return apiRequest("PUT", `invt/product/image/${imageId}`, data);
};

export const deleteProductImage = (imageId) => {
  return apiRequest("DELETE", `invt/product/image/${imageId}`);
};

// Product Document operations
export const addProductDocument = (productId, data) => {
  return apiRequest("POST", `invt/product/${productId}/document`, data);
};

export const getProductDocuments = (productId) => {
  return apiRequest("GET", `invt/product/${productId}/documents`);
};

export const updateProductDocument = (documentId, data) => {
  return apiRequest("PUT", `invt/product/document/${documentId}`, data);
};

export const deleteProductDocument = (documentId) => {
  return apiRequest("DELETE", `invt/product/document/${documentId}`);
};
