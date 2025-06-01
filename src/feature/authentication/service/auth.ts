import http from "@/core/service/auth";
import {
  LoginRequest,
  LoginResponse,
} from "@/feature/authentication/types/auth";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await http.post<LoginResponse>("/auth/login", data);
  return response.data;
};

export const logout = () => {
  return http.post("/auth/logout");
};
