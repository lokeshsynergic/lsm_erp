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

export const uploadCalllogImage = (callNo, formData) => {
  return apiRequest("POST", `/crm/call-log/${callNo}/upload-image`, formData);
};

// export const uploadCalllogImage = (callNo, file, description, fileType) => {
//   const formData = new FormData();
//   formData.append("file", file); // Must match backend @UseInterceptors(FileInterceptor('file'))
//   formData.append("description", description);
//   formData.append("fileType", fileType);

//   return apiRequest("POST", `/crm/call-log/${callNo}/upload`, formData, {
//     "Content-Type": "multipart/form-data",
//   });
// };

// Fetch documents uploaded for a specific call log
export const getCalllogDocuments = (callNo) => {
  return apiRequest("GET", `/crm/call-log/${callNo}/documents`);
};
