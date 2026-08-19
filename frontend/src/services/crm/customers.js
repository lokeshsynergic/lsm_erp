import { apiRequest } from "../../api/apiService";

export const getCustomers = (data) => {
  return apiRequest("GET", "invt/customer", data);
};

export const saveCustomer = (data, id) => {
  if (id) {
    return apiRequest("PUT", `invt/customer/${id}`, data);
  }

  return apiRequest("POST", "invt/customer", data);
};

export const getCustomerById = (id) => {
  return apiRequest("GET", `invt/customer/${id}`);
};

export const deleteCustomer = (id) => {
  return apiRequest("DELETE", `invt/customer/${id}`);
};

export const addCustomerBankDetail = (customerId, data) => {
  return apiRequest("POST", `invt/customer/${customerId}/bank-detail`, data);
};

export const getCustomerBankDetails = (customerId) => {
  return apiRequest("GET", `invt/customer/${customerId}/bank-details`);
};

export const deleteCustomerBankDetail = (bankAccountId) => {
  return apiRequest("DELETE", `invt/customer/bank-detail/${bankAccountId}`);
};

export const addCustomerDocument = (customerId, data) => {
  return apiRequest("POST", `invt/customer/${customerId}/document`, data);
};

export const getCustomerDocuments = (customerId) => {
  return apiRequest("GET", `invt/customer/${customerId}/documents`);
};

export const deleteCustomerDocument = (documentId) => {
  return apiRequest("DELETE", `invt/customer/document/${documentId}`);
};
