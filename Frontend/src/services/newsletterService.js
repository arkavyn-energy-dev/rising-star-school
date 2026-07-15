import api from "./api";

export const subscribeNewsletter = (email) => api.post("/newsletter", { email }).then((res) => res.data);

export const getSubscribers = () => api.get("/newsletter").then((res) => res.data);
