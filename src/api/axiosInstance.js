import axios from "axios";
import { BASE_URL } from "../data/data";

const axiosInstance = axios.create({
  baseURL: BASE_URL || "http://localhost:3000",
});

// 🔒 Automatically attach token if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
