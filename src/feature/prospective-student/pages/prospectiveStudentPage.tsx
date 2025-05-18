import { useEffect, useState, useContext } from "react";
import { Button } from "@/core/components/ui/button"
import { Navigate, useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import BaseLayout from "@/core/components/baseLayout";
import EducationLevelTableSkeleton from "@/core/components/ui/education_level_table_shimmer";
import { Plus } from "lucide-react";
import ProspectiveStudentTable from "@/feature/prospective-student/components/prospectiveStudentTable";
import { listProspectiveStudent } from "@/feature/prospective-student/service/prospectiveStudentService";
import { ProspectiveStudent } from "../types/prospective-student";
import { AxiosError } from "axios";


export default function ProspectiveStudentsPage() {
    const navigate = useNavigate();

    const { token, user, loading, setUser } = useContext(AppContext);
    const [data, setData] = useState<ProspectiveStudent[]>([]);
    const [loadingPage, setLoadingPage] = useState(true);

    const [selectedItem, setSelectedItem] = useState<ProspectiveStudent | null>(null);


    useEffect(() => {
        if (token) {
            fetchProspectiveStudent();
        }
    }, []);

    if (!user) {
        setUser(null);
        return <Navigate to="/login" />;
    }

    async function fetchProspectiveStudent() {
        try {
            const res = await listProspectiveStudent(token);
            setData(res.data || []);
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
                                <h2 className="text-2xl font-bold">Calon Siswa</h2>
                            </div>
                            <Button onClick={() => navigate('/students/prospective/create')} className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white">
                                <span>Tambah Calon Siswa</span>
                                <Plus className="h-4 w-4" />
                            </Button>

                        </div>

                        {loadingPage || loading ? (
                            <EducationLevelTableSkeleton />
                        ) : <ProspectiveStudentTable
                            items={data}
                            onDeleted={() => {
                                setLoadingPage(true);
                                fetchProspectiveStudent();
                            }}
                            onEdit={(item) => {
                                setSelectedItem(item);

                                navigate('/students/prospective/create', {
                                    state: { item: item }
                                })
                            }}
                        />}
                        {selectedItem && <div></div>}
                    </main>
                </div>
            </div>

        </BaseLayout>
    );
}
