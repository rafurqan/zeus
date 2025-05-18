import http from "../../../core/service/https";
import {
  LoginRequest,
  LoginResponse,
} from "@/feature/authentication/types/auth";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await http(null).post<LoginResponse>("/auth/login", data);
  return response.data;
};

export const logout = (token: string | null) => {
  return http(token).post("/auth/logout");
};
