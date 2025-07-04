import { useContext, useEffect, useState } from "react";

import { grantService } from "../service/grantService";
import { AxiosError } from "axios";
import { AppContext } from "@/context/AppContext";
import { Grant } from "../types/grant";
import toast from "react-hot-toast";

export const useGrant = () => {
    const [data, setData] = useState<Grant[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingOverlay, setLoadingOverlay] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { token } = useContext(AppContext);

    const fetchAll = async () => {
        try {
            setLoading(true);
            const result = await grantService.getAll(token ?? "");
            setData(result);
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                setError(err.message || "Gagal memuat data");
            }
        } finally {
            setLoading(false);
        }
    };

    const create = async (payload: Grant) => {
        try {
            setLoadingOverlay(true);
            const result = await grantService.create(token ?? "", payload);
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

    const update = async (payload: Grant) => {
        try {
            setLoadingOverlay(true);
            const result = await grantService.update(token ?? "", payload);
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
            await grantService.remove(token ?? "", id);
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

    const reset = async (id: string) => {
        try {
        setLoadingOverlay(true);
        await grantService.reset(token ?? "", id);
        await fetchAll();
        toast.success("Dana hibah berhasil direset.");
        } catch (err: unknown) {
        if (err instanceof AxiosError) {
            toast.error(
            err.response?.data.message ?? "Gagal reset dana hibah."
            );
            setError(
            err.response?.data.message || "Gagal reset dana hibah."
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
        reset,
    };
};