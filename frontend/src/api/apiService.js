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
