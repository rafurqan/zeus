import { useState, useContext } from "react";
import { Button } from "@/core/components/ui/button"
import { Navigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import BaseLayout from "@/core/components/baseLayout";
import ProgramTableSkeleton from "@/core/components/ui/education_level_table_shimmer";
import { Plus } from "lucide-react";
import { useProgram } from "../hook/useProgram";

import LoadingOverlay from "@/core/components/ui/loading_screen";
import { useConfirm } from "@/core/components/confirmDialog";
import { Program } from "../types/program";
import ProgramTable from "../components/programTable";
import ProgramForm from "../forms/programForm";


export default function ProgramPage() {
    const { user, setUser } = useContext(AppContext);
    const { data, loading, loadingOverlay, remove, create, update } = useProgram();
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Program | null>(null);
    const { confirm, ConfirmDialog } = useConfirm();


    if (!user) {
        setUser(null);
        return <Navigate to="/login" />;
    }

    const handleRemove = async (item: Program) => {
        const isConfirmed = await confirm({
            title: "Hapus Data",
            message: `Apakah Anda yakin ingin menghapus program ini?`,
            confirmText: "Ya, Lanjutkan",
            cancelText: "Batal",
        });
        if (isConfirmed) {
            remove(item.id);
        }
    };

    const handleSubmit = async (item: Program) => {
        try {
            if (selectedItem) {
                await update(item); // Tunggu operasi update selesai
                // Jika berhasil, baru tutup modal
                setShowModal(false);
                setSelectedItem(null);
            } else {
                await create(item); // Tunggu operasi create selesai
                // Jika berhasil, baru tutup modal
                setShowModal(false);
                setSelectedItem(null);
            }
        } catch (error) {
            console.error("Gagal menyimpan data program:", error);

        }
    };

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
                                <h2 className="text-2xl font-bold">Daftar Program</h2>
                                <h2 className="text-gray-500">
                                    Kelola data program yang tersedia di sekolah
                                </h2>
                            </div>
                            <Button onClick={() => setShowModal(true)} className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white">
                                <span>Tambah Program</span>
                                <Plus className="h-4 w-4" />
                            </Button>

                        </div>

                        {loading ? (
                            <ProgramTableSkeleton />
                        ) : <ProgramTable
                            items={data}
                            onDeleted={handleRemove}
                            onEdit={(item) => {
                                setSelectedItem(item);
                                setShowModal(true);
                            }}
                        />}

                        {showModal &&
                            <ProgramForm
                                item={selectedItem as Program}
                                onClose={() => {
                                    setShowModal(false);
                                    setSelectedItem(null);
                                }}
                                onSuccess={handleSubmit}
                            />}
                    </main>
                    {ConfirmDialog}
                </div>
            </div>

        </BaseLayout>
    );
}