import { apiRequest } from "../api/apiService";

//   Function for Employee
export const login = (data) => {
  return apiRequest("POST", "/auth/login", data);
};
