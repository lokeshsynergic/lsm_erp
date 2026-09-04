import { apiRequest } from "../../api/apiService";

export const getvisitlog = (from_date, to_date, emp_code, outcome) => {
  return apiRequest(
    "GET",
    `/crm/meeting-visit/dashboard/visit-logs/?from_date=${from_date}&to_date=${to_date}&emp_code=${emp_code}&outcome=${outcome}`,
  );
};

export const updateVisitReview = (visitId, visitReviewStatus, remarks) => {
  return apiRequest("PUT", `/crm/meeting-visit/${visitId}/review`, {
    visitReviewStatus,
    remarks,
  });
};
