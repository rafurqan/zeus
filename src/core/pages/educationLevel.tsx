import { useEffect, useState, useContext } from "react";
import { Button } from "@/core/components/ui/button"
import { Navigate } from "react-router-dom";
import { EducationLevel } from "@/core/types/education-level";
import { AppContext } from "@/context/AppContext";
import BaseLayout from "@/core/components/baseLayout";
import EducationLevelTable from "@/core/components/ui/education_level_table";
import EducationLevelForm from "@/core/components/forms/educationLevel";
import EducationLevelTableSkeleton from "@/core/components/ui/education_level_table_shimmer";
import { Plus } from "lucide-react";
import { deleteEducationLevel, listEducationLevel } from "@/core/service/master";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useConfirm } from "../components/confirmDialog";
import LoadingOverlay from "../components/ui/loading_screen";


export default function EducationLevelsPage() {
    const { token, user, loading, setUser } = useContext(AppContext);
    const [data, setData] = useState<EducationLevel[]>([]);
    const [loadingPage, setLoadingPage] = useState(true);
    const [loadingOverlay, setLoadingOverlay] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<EducationLevel | null>(null);
    const { confirm, ConfirmDialog } = useConfirm();


    useEffect(() => {
        if (token) {
            fetchEducationLevels();
        }
    }, []);

    if (!user) {
        setUser(null);
        return <Navigate to="/login" />;
    }

    const handleRemove = async (item: EducationLevel) => {
        const isConfirmed = await confirm({
            title: "Hapus Data",
            message: `Apakah Anda yakin ingin menghapus riwayat pendidikan ini?`,
            confirmText: "Ya, Lanjutkan",
            cancelText: "Batal",
        });
        if (isConfirmed) {
            try {
                setLoadingOverlay(true);
                await deleteEducationLevel(item.id);
            } catch (error: unknown) {
                toast.error(
                    error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus data"
                );
            } finally {
                setLoadingOverlay(false);
                setLoadingPage(true);
                fetchEducationLevels();
            }
        }
    };

    async function fetchEducationLevels() {
        try {
            const res = await listEducationLevel();

            if (res.status === 401) {
                setUser(null);
            }
            setData(res.data || []);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.status === 401) {
                setUser(null);
                console.error("Fetch failed", err);
            }
            console.error("Fetch failed", err);
        } finally {
            setLoadingPage(false);
        }
    }


    return (
        <BaseLayout>
            <div className="flex min-h-screen">
                <div className="flex-1 w-full ">
                    <main className="p-4 ">
                        {loadingOverlay &&
                            <LoadingOverlay
                            />}
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-2xl font-bold">Daftar Riwayat Pendidikan</h2>
                                <h2 className="text-gray-500">
                                    Kelola Riwayat pendidikan yang tersedia di sekolah
                                </h2>
                            </div>
                            <Button onClick={() => setShowModal(true)} className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white">
                                <span>Tambah Riwayat Pendidikan</span>
                                <Plus className="h-4 w-4" />
                            </Button>

                        </div>

                        {loadingPage || loading ? (
                            <EducationLevelTableSkeleton />
                        ) : <EducationLevelTable
                            items={data}
                            onDeleted={(item) => {
                                handleRemove(item);
                            }}
                            onEdit={(item) => {
                                setSelectedItem(item);
                                setShowModal(true);
                            }}
                        />}

                        {showModal &&
                            <EducationLevelForm
                                item={selectedItem as EducationLevel}
                                onClose={() => {
                                    setShowModal(false);
                                    setSelectedItem(null);
                                }}
                                onSuccess={() => {
                                    setLoadingPage(true);
                                    fetchEducationLevels();
                                    setShowModal(false);
                                    setSelectedItem(null);
                                }}
                            />}
                    </main>
                    {ConfirmDialog}
                </div>
            </div>

        </BaseLayout>
    );
}
