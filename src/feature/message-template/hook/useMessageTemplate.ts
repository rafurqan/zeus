import { useContext, useEffect, useState } from "react";
import { messageTemplateService } from "../services/messageTemplateService";
import { AxiosError } from "axios";
import { AppContext } from "@/context/AppContext";
import { MessageTemplate } from "../types/messageTemplate";
import toast from "react-hot-toast";

export const useMessageTemplate = (searchTerm = "") => {
  const [data, setData] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingOverlay, setLoadingOverlay] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useContext(AppContext);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);

  const fetchWithPagination = async (search = searchTerm) => {
    try {
      setLoading(true);
      const response = await messageTemplateService.getAllWithPagination(
        token ?? "",
        page,
        10,
        search
      );
      setData(response.data.data);
      setLastPage(response.data.last_page || 1);
      setMeta(response.data);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.message || "Gagal memuat data");
      }
    } finally {
      setLoading(false);
    }
  };

  const create = async (payload: MessageTemplate) => {
    try {
      setLoadingOverlay(true);
      const result = await messageTemplateService.create(token ?? "", payload);
      setLoadingOverlay(false);
      await fetchWithPagination();
      toast.success("Berhasil menambah template.");
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

  const update = async (payload: MessageTemplate) => {
    try {
      setLoadingOverlay(true);
      const result = await messageTemplateService.update(token ?? "", payload);
      setLoadingOverlay(false);
      await fetchWithPagination();
      toast.success("Berhasil perbaharui template.");
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
      await messageTemplateService.remove(token ?? "", id);
      setLoadingOverlay(false);
      await fetchWithPagination();
      toast.success("Berhasil menghapus template.");
    } catch (err: unknown) {
      console.log(err);
      if (err instanceof AxiosError) {
        const errorMessage = `Terjadi kesalahan saat menghapus data. ${err.response?.data.meta.message ?? ''}`;
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } finally {
      setLoadingOverlay(false);
    }
  };

  useEffect(() => {
    fetchWithPagination();
  }, [page, searchTerm]);

  return {
    data,
    loading,
    loadingOverlay,
    error,
    create,
    update,
    remove,
    page,
    setPage,
    lastPage,
    meta,
    fetchWithPagination
  };
};