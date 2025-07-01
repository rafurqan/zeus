// src/api/http.ts
import axios from "axios";

const getAccessToken = (): string | null => {
  return localStorage.getItem("access_token");
};

// Fungsi untuk menghapus token dan redirect ke login
const handleUnauthorized = () => {
  localStorage.removeItem("access_token"); // Hapus token yang tidak valid
  localStorage.removeItem("user"); // Hapus user yang tidak valid
  // Redirect ke halaman login.
  window.location.href = "/login";
};

const http = axios.create({
  baseURL: "http://eudora.railway.internal:8080/api/v1", // Ada typo disini
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Menambahkan Authorization header sebelum setiap request dikirim
http.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Menangani error 401 (Unauthorized)
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized request (401). Redirecting to login...");
      handleUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default http;
