import { apiRequest } from "../../api/apiService";

export const getWebUsers = () => {
  return apiRequest("GET", "/users/web");
};

export const getMobileUsers = () => {
  return apiRequest("GET", "/users/mobile");
};

export const getAllUsers = () => {
  return apiRequest("GET", "/users");
};

export const getUserById = (id) => {
  return apiRequest("GET", `/auth/getuserbyid/${id}`);
};
export const getUsersByType = (type) => {
  return apiRequest("GET", `/users/by-type?type=${type}`);
};
export const saveUser = (userData, id) => {
  if (id) {
    return apiRequest("POST", `/auth/update/${id}`, userData);
  }
  return apiRequest("POST", "/users", userData);
};

export const getPendingApprovals = () => {
  return apiRequest("GET", "/users/pending-approvals");
};

export const approveUser = (userId, approvedBy) => {
  return apiRequest("POST", `/users/${userId}/approve`, {
    approved_by: approvedBy,
  });
};

export const rejectUser = (userId, reason) => {
  return apiRequest("POST", `/users/${userId}/reject`, { reason });
};

export const deleteUser = (userId) => {
  return apiRequest("DELETE", `/users/${userId}`);
};
