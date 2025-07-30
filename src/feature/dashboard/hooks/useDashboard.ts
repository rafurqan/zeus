import { useCallback, useState } from "react";

import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { DashboardSummary } from "@/core/types/dashboard";
import { dashboardService } from "../services/dashboardService";

export const useDashboard = () => {
  const [data, setData] = useState<DashboardSummary | null>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dashboardService.getDashboard();

      setData(result);
    } catch (err: unknown) {
      let errorMessage = "Gagal memuat data dashboard";
      if (err instanceof AxiosError) {
        errorMessage =
          err.response?.data?.message || err.message || errorMessage;
      }
      setError(errorMessage);
      toast.error(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    getDashboard,
  };
};
