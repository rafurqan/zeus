import { useState, useCallback } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { classMembershipService } from "../services/classMembershipService"; // Asumsi ada service ini
import {
  ClassMembership,
  ClassMembershipResponse,
  CreateClassMembershipRequest,
  FetchAllParams,
} from "../types/student-class-membership";

export const useClassMembership = () => {
  const [data, setData] = useState<ClassMembership[]>([]);
  const [meta, setMeta] = useState<ClassMembershipResponse["meta"] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async (params: FetchAllParams = {}) => {
    try {
      setLoading(true);
      setError(null); // Reset error sebelum fetch baru
      const result = await classMembershipService.getAll(params);

      if (result && result.data && result.meta) {
        setData(result.data);
        setMeta(result.meta);
      } else {
        // Handle kasus jika respons tidak sesuai format yang diharapkan
        setData([]);
        setMeta(null);
        console.warn(
          "Format respons tidak sesuai dari classMembershipService.getAll",
          result
        );
        toast.error("Gagal memuat data: format respons tidak valid.");
      }
    } catch (err: unknown) {
      console.error("Error fetching class memberships:", err);
      let errorMessage = "Gagal memuat data keanggotaan kelas.";
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

  const create = async (payload: CreateClassMembershipRequest) => {
    try {
      setLoadingOverlay(true);
      const result = await classMembershipService.create(payload);
      setLoadingOverlay(false);
      await fetchAll();
      toast.success("Berhasil merubah kelas siswa.");
      return result;
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.log("Error creating class membership:", err);
        toast.error(
          err.response?.data.meta.message ??
            "Terjadi kesalahan saat merubah kelas siswa."
        );
      }
    } finally {
      setLoadingOverlay(false);
    }
  };

  return {
    data,
    meta,
    loading,
    loadingOverlay,
    error,
    fetchAll,
    create,
  };
};
