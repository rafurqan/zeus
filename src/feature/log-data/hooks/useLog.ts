import { useCallback, useState } from "react";

import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { ListLogRequest, LogEntry, LogResponse } from "../types/logs";
import { logService } from "../services/logService";

export const useLog = () => {
  const [data, setData] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<LogResponse["meta"] | null>();

  const getLogs = useCallback(async (params: ListLogRequest = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await logService.getLogs(params);

      if (result && result.data && result.meta) {
        setData(result.data);
        setMeta(result.meta);
      } else {
        setData([]);
        setMeta(null);
        console.warn("Format respons tidak sesuai", result);
        toast.error("Gagal memuat data: format respons tidak valid.");
      }
    } catch (err: unknown) {
      console.error("Error fetching logs:", err);
      let errorMessage = "Gagal memuat data log";
      if (err instanceof AxiosError) {
        errorMessage =
          err.response?.data?.message || err.message || errorMessage;
      }
      setError(errorMessage);
      toast.error(errorMessage);
      setData([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    meta,
    getLogs,
  };
};
