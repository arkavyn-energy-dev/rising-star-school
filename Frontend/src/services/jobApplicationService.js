import api from "./api";

export const submitJobApplication = (data) => api.post("/careers", data).then((res) => res.data);

export const getJobApplications = (status) =>
  api.get("/careers", { params: status ? { status } : {} }).then((res) => res.data);

export const updateJobApplicationStatus = (id, status) =>
  api.patch(`/careers/${id}`, { status }).then((res) => res.data);

export const deleteJobApplication = (id) => api.delete(`/careers/${id}`).then((res) => res.data);
