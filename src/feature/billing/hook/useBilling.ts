import { useContext, useEffect, useState } from "react";

import { billingService } from "../service/billingService";
import { AxiosError } from "axios";
import { AppContext } from "@/context/AppContext";
import { Billing } from "../types/billing";
import toast from "react-hot-toast";

export const useBilling = () => {
  const [data, setData] = useState<Billing[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useContext(AppContext);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const result = await billingService.getAll(token ?? "");
      setData(result);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.message || "Gagal memuat data");
      }
    } finally {
      setLoading(false);
    }
  };

  // const fetchServiceSuggestions = async (query: string) => {
  //     if (!query || query.length < 2) {
  //         setSuggestions([]);
  //         return;
  //     }

  //     try {
  //         setSearchLoading(true);
  //         const response = await axios.get(`/api/rates`, {
  //             headers: { Authorization: `Bearer ${token}` },
  //             params: { search: query }
  //         });
  //         setSuggestions(response.data.data || []); // asumsi struktur response-nya
  //     } catch (error) {
  //         console.error("Failed to fetch suggestions", error);
  //     } finally {
  //         setSearchLoading(false);
  //     }
  // };

  const create = async (payload: Billing) => {
    try {
      setLoadingOverlay(true);
      const result = await billingService.create(token ?? "", payload);
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

  const update = async (payload: Billing) => {
    try {
      setLoadingOverlay(true);
      const result = await billingService.update(token ?? "", payload);
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
      await billingService.remove(token ?? "", id);
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
    create,
    update,
    remove,
  };
};