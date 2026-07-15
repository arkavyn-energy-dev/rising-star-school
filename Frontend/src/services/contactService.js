import api from "./api";

export const submitContactMessage = (data) => api.post("/contact", data).then((res) => res.data);

export const getContactMessages = (status) =>
  api.get("/contact", { params: status ? { status } : {} }).then((res) => res.data);

export const updateContactStatus = (id, status) => api.patch(`/contact/${id}`, { status }).then((res) => res.data);

export const deleteContactMessage = (id) => api.delete(`/contact/${id}`).then((res) => res.data);
