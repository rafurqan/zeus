import http from "@/core/service/auth";
import { ListLogRequest, LogResponse } from "../types/logs";
export const logService = {
  async getLogs(params?: ListLogRequest | null): Promise<LogResponse> {
    const response = await http.get("/logs", {
      params: params,
    });
    return response.data;
  },
};
