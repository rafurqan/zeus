import { useEffect, useState } from "react";

import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { StudentClass } from "../types/student-class";
import { studentClassService } from "../services/studentClassService";

export const useStudentClass = () => {
  const [data, setData] = useState<StudentClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const result = await studentClassService.getAll();
      setData(result);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.message || "Gagal memuat data");
      }
    } finally {
      setLoading(false);
    }
  };

  const create = async (payload: StudentClass) => {
    try {
      setLoadingOverlay(true);
      const result = await studentClassService.create(payload);
      setLoadingOverlay(false);
      await fetchAll();
      toast.success("Berhasil menambah data.");
      return result;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data.message ?? "Terjadi kesalahan saat menyimpan data."
        );
        setError(
          err.response?.data.message || "Terjadi kesalahan saat menyimpan data."
        );
      }
    } finally {
      setLoadingOverlay(false);
    }
  };

  const update = async (payload: StudentClass) => {
    try {
      setLoadingOverlay(true);
      const result = await studentClassService.update(payload);
      setLoadingOverlay(false);
      await fetchAll();
      toast.success("Berhasil perbaharui data.");
      return result;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data.message ?? "Terjadi kesalahan saat menyimpan data."
        );
        setError(
          err.response?.data.message || "Terjadi kesalahan saat menyimpan data."
        );
      }
    } finally {
      setLoadingOverlay(false);
    }
  };

  const remove = async (id: string) => {
    try {
      setLoadingOverlay(true);
      await studentClassService.remove(id);
      setLoadingOverlay(false);
      await fetchAll();
      toast.success("Berhasil menghapus data.");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data.message ?? "Terjadi kesalahan saat menghapus data."
        );
        setError(
          err.response?.data.message || "Terjadi kesalahan saat menghapus data."
        );
      }
    } finally {
      setLoadingOverlay(false);
    }
  };

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
