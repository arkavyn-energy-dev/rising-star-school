import api from "./api";

export const getTestimonials = () => api.get("/testimonials").then((res) => res.data);

export const createTestimonial = (formData) =>
  api.post("/testimonials", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((res) => res.data);

export const updateTestimonial = (id, formData) =>
  api
    .put(`/testimonials/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
    .then((res) => res.data);

export const deleteTestimonial = (id) => api.delete(`/testimonials/${id}`).then((res) => res.data);
