// src/api/http.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const http = (token: string | null) => {
  return axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      Authorization: token ? `Bearer ${token}` : null,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

export default http;
