import { useContext, useEffect, useState } from "react";

import { teacherService } from "../service/teacherService";
import { AxiosError } from "axios";
import { AppContext } from "@/context/AppContext";
import { Teacher } from "../types/teacher";
import toast from "react-hot-toast";

export const useTeacher = () => {
  const [data, setData] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useContext(AppContext);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const result = await teacherService.getAll(token ?? "");
      setData(result);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.message || "Gagal memuat data");
      }
    } finally {
      setLoading(false);
    }
  };

  const create = async (payload: Teacher) => {
    try {
      setLoadingOverlay(true);
      const result = await teacherService.create(token ?? "", payload);
      setLoadingOverlay(false);
      await fetchAll();
      toast.success("Berhasil menambah data.");
      return result;
    } catch (err: unknown) {
      console.log(err);
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

  const update = async (payload: Teacher) => {
    try {
      setLoadingOverlay(true);
      const result = await teacherService.update(token ?? "", payload);
      setLoadingOverlay(false);
      await fetchAll();
      toast.success("Berhasil perbaharui data.");
      return result;
    } catch (err: unknown) {
      console.log(err);
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
      await teacherService.remove(token ?? "", id);
      setLoadingOverlay(false);
      await fetchAll();
      toast.success("Berhasil menghapus data.");
    } catch (err: unknown) {
      console.log(err);
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
