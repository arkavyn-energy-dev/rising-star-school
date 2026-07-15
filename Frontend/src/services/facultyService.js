import api from "./api";

export const getFaculty = () => api.get("/faculty").then((res) => res.data);

export const createFaculty = (formData) =>
  api.post("/faculty", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((res) => res.data);

export const updateFaculty = (id, formData) =>
  api.put(`/faculty/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }).then((res) => res.data);

export const deleteFaculty = (id) => api.delete(`/faculty/${id}`).then((res) => res.data);
