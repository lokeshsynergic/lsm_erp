import apiClient from "./apiClient";

export const apiRequest = async (method, url, data = null, params = {}) => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      params,
    });

    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Auth APIs
export const authLogin = async (user_id, password) => {
  return apiRequest("POST", "/auth/login", { user_id, password });
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getStoredToken = () => {
  return localStorage.getItem("token");
};
