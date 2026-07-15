import api from "./api";

export const getGalleryImages = (category) =>
  api.get("/gallery", { params: category && category !== "All" ? { category } : {} }).then((res) => res.data);

export const createGalleryImage = (formData) =>
  api.post("/gallery", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((res) => res.data);

export const deleteGalleryImage = (id) => api.delete(`/gallery/${id}`).then((res) => res.data);
