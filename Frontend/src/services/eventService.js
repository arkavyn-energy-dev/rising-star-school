import api from "./api";

export const getEvents = (type) =>
  api.get("/events", { params: type ? { type } : {} }).then((res) => res.data);

export const createEvent = (formData) =>
  api.post("/events", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((res) => res.data);

export const updateEvent = (id, formData) =>
  api.put(`/events/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }).then((res) => res.data);

export const deleteEvent = (id) => api.delete(`/events/${id}`).then((res) => res.data);
