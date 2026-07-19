import axios from "axios";

// withCredentials lets the browser send/receive the httpOnly JWT cookie
// set by the backend on login — no manual token handling needed.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  // Required when the API is reached through a localtunnel.me URL —
  // skips the "friendly reminder" interstitial page for non-browser requests.
  headers: { "Bypass-Tunnel-Reminder": "true" },
});

export default api;
