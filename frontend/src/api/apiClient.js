import axios from "axios";

const apiClient = axios.create({
  //baseURL: "http://localhost:3001/",
  baseURL: "https://lsmadminapi.opentech4u.co.in/",
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Only set Content-Type for non-FormData requests
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  } else {
    // Remove Content-Type for FormData to let axios set it with boundary
    delete config.headers["Content-Type"];
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized");
    }

    return Promise.reject(error);
  },
);

export default apiClient;
