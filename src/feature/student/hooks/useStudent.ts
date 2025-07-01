import { useCallback, useState } from "react";

import { AxiosError } from "axios";
import toast from "react-hot-toast";
import {
  ChangeStatusRequest,
  ListStudentRequest,
  Student,
  StudentResponse,
  Summary,
} from "../types/student";
import { studentService } from "../services/studentService";

export const useStudent = () => {
  const [data, setData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<StudentResponse["meta"] | null>();
  const [summary, setSummary] = useState<Summary | null>();

  const fetchAll = useCallback(async (params: ListStudentRequest = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await studentService.getAll(params);

      if (result && result.data && result.meta) {
        setData(result.data);
        setMeta(result.meta);
        setSummary(result.extra?.summary || null);
      } else {
        // Handle kasus jika respons tidak sesuai format yang diharapkan
        setData([]);
        setMeta(null);
        setSummary(null);
        console.warn("Format respons tidak sesuai", result);
        toast.error("Gagal memuat data: format respons tidak valid.");
      }
    } catch (err: unknown) {
      console.error("Error fetching prospective student:", err);
      let errorMessage = "Gagal memuat data calon siswa";
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

  const changeStatus = async (data: ChangeStatusRequest) => {
    try {
      setLoadingOverlay(true);
      await studentService.changeStatus(data);
      setLoadingOverlay(false);
      toast.success("Berhasil update status.");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data.message ?? "Terjadi kesalahan saat update status."
        );
        setError(
          err.response?.data.message || "Terjadi kesalahan saat update status."
        );
      }
    } finally {
      setLoadingOverlay(false);
    }
  };

  return {
    data,
    loading,
    error,
    meta,
    summary,
    loadingOverlay,
    fetchAll,
    changeStatus,
  };
};
