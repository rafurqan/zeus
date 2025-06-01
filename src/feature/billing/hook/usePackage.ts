import { useContext, useEffect, useState } from "react";

import { packageService } from "../service/packageService";
import { AxiosError } from "axios";
import { AppContext } from "@/context/AppContext";
import { RatePackage } from "../types/ratePackage";
import toast from "react-hot-toast";

export const usePackage = () => {
    const [data, setData] = useState<RatePackage[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingOverlay, setLoadingOverlay] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useContext(AppContext);

    const fetchAll = async () => {
        try {
            setLoading(true);
            const result = await packageService.getAll(token ?? "");
            setData(result);
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
            await fetchAll(); // Pastikan ada fetchAll setelah create
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
            await fetchAll(); // Pastikan ada fetchAll setelah update
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
            await fetchAll(); // sudah ada fetchAll
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