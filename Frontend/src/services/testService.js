import api from "./api";

export const getTests = (className) =>
  api.get("/tests", { params: className ? { className } : {} }).then((res) => res.data);

export const getTestById = (id) => api.get(`/tests/${id}`).then((res) => res.data);

export const submitTestAttempt = (testId, data) =>
  api.post(`/tests/${testId}/attempts`, data).then((res) => res.data);
