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
import { listEducationLevel } from "@/core/service/master";
import { AxiosError } from "axios";


export default function EducationLevelsPage() {
    const { token, user, loading, setUser } = useContext(AppContext);
    const [data, setData] = useState<EducationLevel[]>([]);
    const [loadingPage, setLoadingPage] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<EducationLevel | null>(null);


    useEffect(() => {
        if (token) {
            fetchEducationLevels();
        }
    }, []);

    if (!user) {
        setUser(null);
        return <Navigate to="/login" />;
    }

    async function fetchEducationLevels() {
        try {
            const res = await listEducationLevel(token);

            if (res.status === 401) {
                setUser(null);
                // toast.error("Akses ditolak. Silakan login ulang.");
            }
            console.log(res);
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
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-2xl font-bold">Daftar Program</h2>
                                <h2 className="text-gray-500">
                                    Kelola program pendidikan yang tersedia di sekolah
                                </h2>
                            </div>
                            <Button onClick={() => setShowModal(true)} className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white">
                                <span>Tambah Program</span>
                                <Plus className="h-4 w-4" />
                            </Button>

                        </div>

                        {loadingPage || loading ? (
                            <EducationLevelTableSkeleton />
                        ) : <EducationLevelTable
                            items={data}
                            onDeleted={() => {
                                setLoadingPage(true);
                                fetchEducationLevels();
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
                </div>
            </div>

        </BaseLayout>
    );
}
