import api from "./api";

export const submitAdmissionEnquiry = (data) => api.post("/admissions", data).then((res) => res.data);

export const getAdmissionEnquiries = (status) =>
  api.get("/admissions", { params: status ? { status } : {} }).then((res) => res.data);

export const updateAdmissionStatus = (id, status) =>
  api.patch(`/admissions/${id}`, { status }).then((res) => res.data);

export const deleteAdmissionEnquiry = (id) => api.delete(`/admissions/${id}`).then((res) => res.data);
