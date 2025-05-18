import { useState, useContext } from "react";
import { Button } from "@/core/components/ui/button"
import { Navigate } from "react-router-dom";
import { Teacher } from "@/feature/teacher/types/teacher";
import { AppContext } from "@/context/AppContext";
import BaseLayout from "@/core/components/baseLayout";
import Table from "@/feature/teacher/components/table";
import TeacherTableSkeleton from "@/core/components/ui/education_level_table_shimmer";
import { Plus } from "lucide-react";
import { useTeacher } from "../hook/useTeacher";

import LoadingOverlay from "@/core/components/ui/loading_screen";
import TeacherForm from "../forms/teacherForm";



export default function TeacherPage() {
    const { user, setUser } = useContext(AppContext);
    const { data, loading, loadingOverlay, remove, create, update } = useTeacher();
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Teacher | null>(null);



    if (!user) {
        setUser(null);
        return <Navigate to="/login" />;
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
                                <h2 className="text-2xl font-bold">Daftar Guru</h2>
                                <h2 className="text-gray-500">
                                    Kelola data guru yang tersedia di sekolah
                                </h2>
                            </div>
                            <Button onClick={() => setShowModal(true)} className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white">
                                <span>Tambah Guru</span>
                                <Plus className="h-4 w-4" />
                            </Button>

                        </div>

                        {loading ? (
                            <TeacherTableSkeleton />
                        ) : <Table
                            items={data}
                            onDeleted={(item) => {
                                // setLoadingPage(true);
                                remove(item.id)
                            }}
                            onEdit={(item) => {
                                setSelectedItem(item);
                                setShowModal(true);
                            }}
                        />}

                        {showModal &&
                            <TeacherForm
                                item={selectedItem as Teacher}
                                onClose={() => {
                                    setShowModal(false);
                                    setSelectedItem(null);
                                }}
                                onSuccess={(item) => {
                                    // setLoadingPage(true);
                                    if (selectedItem) {
                                        update(item);
                                    } else {
                                        create(item);
                                    }
                                    setShowModal(false);
                                    setSelectedItem(null);
                                }}
                            />}
                    </main>
                </div>
            </div>

        </BaseLayout>
    );
}
