import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { programService } from "../services/programService";
import { Program } from "../types/program";

export const useProgram = () => {
  const [data, setData] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const result = await programService.getAll();
      setData(result);
      setError(null); // Bersihkan error setelah sukses
    } catch (err: unknown) {
      console.error("Gagal memuat data program:", err);
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || "Gagal memuat data program.";
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

  const create = async (payload: Program) => {
    try {
      setLoadingOverlay(true);
      const result = await programService.create(payload);
      await fetchAll(); // Refresh data
      toast.success("Berhasil menambah data program.");
      return result;
    } catch (err: unknown) {
      console.error("Gagal membuat data program:", err);
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message ?? "Gagal menyimpan data program.";
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

  const update = async (payload: Program) => {
    try {
      setLoadingOverlay(true);
      const result = await programService.update(payload);
      await fetchAll(); // Refresh data
      toast.success("Berhasil memperbarui data program.");
      return result;
    } catch (err: unknown) {
      console.error("Gagal memperbarui data program:", err);
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message ?? "Gagal memperbarui data program.";
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
      await programService.remove(id);
      await fetchAll(); // Refresh data
      toast.success("Berhasil menghapus data program.");
    } catch (err: unknown) {
      console.error("Gagal menghapus data program:", err);
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message ?? "Gagal menghapus data program.";
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
