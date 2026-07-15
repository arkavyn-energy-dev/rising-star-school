import axios from "axios";

// withCredentials lets the browser send/receive the httpOnly JWT cookie
// set by the backend on login — no manual token handling needed.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default api;
