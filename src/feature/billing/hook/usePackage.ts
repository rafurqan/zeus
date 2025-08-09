import { useContext, useEffect, useState } from "react";

import { packageService } from "../service/packageService";
import { AxiosError } from "axios";
import { AppContext } from "@/context/AppContext";
import { RatePackage } from "../types/ratePackage";
import toast from "react-hot-toast";

export const usePackage = (searchTerm = "") => {
    const [data, setData] = useState<RatePackage[]>([]);
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
            const response = await packageService.getAllWithPagination(
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

    const create = async (payload: RatePackage) => {
        try {
            setLoadingOverlay(true);
            const result = await packageService.create(token ?? "", payload);
            await fetchWithPagination(); // Ganti fetchAll dengan fetchWithPagination
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

    const update = async (payload: RatePackage) => {
        try {
            setLoadingOverlay(true);
            const result = await packageService.update(token ?? "", payload);
            await fetchWithPagination(); // Ganti fetchAll dengan fetchWithPagination
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
            await packageService.remove(token ?? "", id);
            await fetchWithPagination(); // Ganti fetchAll dengan fetchWithPagination
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