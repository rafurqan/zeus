// src/api/http.ts
import axios from "axios";

const http = (token: string | null) => {
  return axios.create({
    baseURL: "http://eudora.railway.internal:8080/api/v1",
    withCredentials: true,
    headers: {
      Authorization: token ? `Bearer ${token}` : null,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

export default http;
