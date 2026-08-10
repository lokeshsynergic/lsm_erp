import { apiRequest } from "../../api/apiService";

//   Function for Employee
export const getCalllog = (data) => {
  return apiRequest("GET", "/crm/call-log", data);
};
export const saveCalllog = (data, id) => {
  if (id) {
    // UPDATE existing call log (PUT /crm/call-log/4)
    return apiRequest("POST", `/crm/call-log/${id}`, data);
  } else {
    // CREATE new call log (POST /crm/call-log)
    return apiRequest("POST", "/crm/call-log", data);
  }
};

export const getCalllogById = (id) => {
  return apiRequest("GET", `/crm/call-log/${id}`);
};
