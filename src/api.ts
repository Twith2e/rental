import axios from "axios";

// Create an Axios instance
const api = axios.create({
  // baseURL: "http://localhost:3000/",
  baseURL: "https://rental-server-production-4619.up.railway.app",
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Example: Add Authorization header if token exists
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    // Example: Log error or show notification
    console.error("API error:", error);
    return Promise.reject(error);
  }
);

export default api;
