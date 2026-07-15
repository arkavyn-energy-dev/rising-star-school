import api from "./api";

export const getTestAttempts = (params = {}) =>
  api.get("/test-attempts", { params }).then((res) => res.data);

export const updateTestAttemptStatus = (id, status) =>
  api.patch(`/test-attempts/${id}`, { status }).then((res) => res.data);

export const deleteTestAttempt = (id) => api.delete(`/test-attempts/${id}`).then((res) => res.data);

export const sendTestAttemptMessage = (id, data) =>
  api.post(`/test-attempts/${id}/message`, data).then((res) => res.data);

export const getTestNotifyConfig = () => api.get("/test-attempts/notify-config").then((res) => res.data);
