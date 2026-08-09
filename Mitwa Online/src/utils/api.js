import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// Auto-attach JWT token on every request
API.interceptors.request.use((config) => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const { token } = JSON.parse(userData);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {}
  }
  return config;
});

// Auto-logout on 401 (only if not already on login page)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname !== "/login") {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;
