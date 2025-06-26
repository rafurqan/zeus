import { useCallback, useState } from "react";

import { AxiosError } from "axios";
import toast from "react-hot-toast";
import {
  ListProspectiveStudentRequest,
  ProspectiveStudent,
  ProspectiveStudentResponse,
} from "../types/prospective-student";
import { prospectiveStudentService } from "../service/prospectiveStudentService";

export const useProspectiveStudent = () => {
  const [data, setData] = useState<ProspectiveStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<ProspectiveStudentResponse["meta"] | null>();

  const fetchAll = useCallback(
    async (params: ListProspectiveStudentRequest = {}) => {
      try {
        setLoading(true);
        setError(null); // Reset error sebelum fetch baru
        const result = await prospectiveStudentService.getAll(params);

        if (result && result.data && result.meta) {
          setData(result.data);
          setMeta(result.meta);
        } else {
          // Handle kasus jika respons tidak sesuai format yang diharapkan
          setData([]);
          setMeta(null);
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
    },
    []
  );

  const create = async (payload: ProspectiveStudent) => {
    try {
      setLoadingOverlay(true);
      const result = await prospectiveStudentService.create(payload);
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

  const update = async (payload: ProspectiveStudent) => {
    try {
      setLoadingOverlay(true);
      const result = await prospectiveStudentService.update(payload);
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
      await prospectiveStudentService.remove(id);
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
  const approve = async (id: string) => {
    try {
      setLoadingOverlay(true);
      await prospectiveStudentService.approve(id);
      setLoadingOverlay(false);
      toast.success("Berhasil approve data.");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data.message ?? "Terjadi kesalahan saat approve data."
        );
        setError(
          err.response?.data.message || "Terjadi kesalahan saat approve data."
        );
      }
    } finally {
      setLoadingOverlay(false);
    }
  };

  return {
    data,
    loading,
    loadingOverlay,
    error,
    meta,
    fetchAll,
    create,
    update,
    remove,
    approve,
  };
};
