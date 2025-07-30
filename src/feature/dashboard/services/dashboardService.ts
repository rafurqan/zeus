import http from "@/core/service/auth";
import { DashboardSummary } from "@/core/types/dashboard";
export const dashboardService = {
  async getDashboard(): Promise<DashboardSummary> {
    const response = await http.get("/dashboard");
    return response.data;
  },
};
