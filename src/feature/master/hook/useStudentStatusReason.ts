import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { StudentStatusReason } from "../types/studentStatusReason";
import { studentStatusReasonService } from "../services/studentStatusReasonService";

export const useStudentStatusReason = () => {
  const [data, setData] = useState<StudentStatusReason[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const result = await studentStatusReasonService.getAll();
      setData(result);
      setError(null);
    } catch (err: unknown) {
      console.error("Gagal memuat data status reason:", err);
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || "Gagal memuat data status reason.";
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        setError("Terjadi kesalahan tak terduga.");
        toast.error("Terjadi kesalahan tak terduga.");
      }
    } finally {
      setLoading(false);
    }
  };

  const create = async (payload: StudentStatusReason) => {
    try {
      setLoadingOverlay(true);
      const result = await studentStatusReasonService.create(payload);
      await fetchAll(); // Refresh data
      toast.success("Berhasil menambah data status reason.");
      return result;
    } catch (err: unknown) {
      console.error("Gagal membuat data status reason:", err);
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message ?? "Gagal menyimpan data status reason.";
        toast.error(errorMessage);
        setError(errorMessage);
      } else {
        toast.error("Terjadi kesalahan tak terduga saat membuat data.");
        setError("Terjadi kesalahan tak terduga.");
      }
      throw err;
    } finally {
      setLoadingOverlay(false);
    }
  };

  const update = async (payload: StudentStatusReason) => {
    try {
      setLoadingOverlay(true);
      const result = await studentStatusReasonService.update(payload);
      await fetchAll(); // Refresh data
      toast.success("Berhasil memperbarui data status reason.");
      return result;
    } catch (err: unknown) {
      console.error("Gagal memperbarui data status reason:", err);
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message ??
          "Gagal memperbarui data status reason.";
        toast.error(errorMessage);
        setError(errorMessage);
      } else {
        toast.error("Terjadi kesalahan tak terduga saat memperbarui data.");
        setError("Terjadi kesalahan tak terduga.");
      }
      throw err;
    } finally {
      setLoadingOverlay(false);
    }
  };

  const remove = async (id: string) => {
    try {
      setLoadingOverlay(true);
      await studentStatusReasonService.remove(id);
      await fetchAll(); // Refresh data
      toast.success("Berhasil menghapus data status reason.");
    } catch (err: unknown) {
      console.error("Gagal menghapus data status reason:", err);
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message ?? "Gagal menghapus data status reason.";
        toast.error(errorMessage);
        setError(errorMessage);
      } else {
        toast.error("Terjadi kesalahan tak terduga saat menghapus data.");
        setError("Terjadi kesalahan tak terduga.");
      }
    } finally {
      setLoadingOverlay(false);
    }
  };

  // Fetch data awal saat komponen mount
  useEffect(() => {
    fetchAll();
  }, []);

  return {
    data,
    loading,
    loadingOverlay,
    error,
    fetchAll,
    create,
    update,
    remove,
  };
};
