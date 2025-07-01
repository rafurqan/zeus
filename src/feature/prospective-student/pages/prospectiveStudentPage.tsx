import { useEffect, useState, useContext } from "react";
import { Button } from "@/core/components/ui/button"
import { Navigate, useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import BaseLayout from "@/core/components/baseLayout";
import EducationLevelTableSkeleton from "@/core/components/ui/education_level_table_shimmer";
import { Plus, Search } from "lucide-react";
import ProspectiveStudentTable from "@/feature/prospective-student/components/prospectiveStudentTable";
import { ProspectiveStudent } from "../types/prospective-student";
import { AxiosError } from "axios";
import LoadingOverlay from "@/core/components/ui/loading_screen";
import toast from "react-hot-toast";
import { useProspectiveStudent } from "../hooks/useProspectiveStudent";
import Pagination from "@/core/components/forms/pagination";
import { useConfirm } from "@/core/components/confirmDialog";
import { FormSelect } from "@/core/components/forms/formSelect";


export default function ProspectiveStudentsPage() {
    const navigate = useNavigate();

    const { user, setUser } = useContext(AppContext);
    const [loadingOverlay, setLoadingOverlay] = useState(false);
    const { confirm, ConfirmDialog } = useConfirm();
    const [searchKeyword, setSearchKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("Semua");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const {
        data: prospectiveStudentData,
        meta: prospectiveStudentMeta,
        loading: prospectiveStudentLoading,
        error: prospectiveStudentError,
        fetchAll: fetchAllProspectiveStudents,
        remove: removeProspectiveStudent,
        approve: approveProspectiveStudent,
    } = useProspectiveStudent();

    const totalPages = prospectiveStudentMeta ? Math.ceil((prospectiveStudentMeta.total || 0) / itemsPerPage) : 0;
    const startItem = prospectiveStudentMeta ? ((currentPage - 1) * itemsPerPage) + 1 : 0;
    const endItem = prospectiveStudentMeta ? Math.min(currentPage * itemsPerPage, prospectiveStudentMeta.total || 0) : 0;


    useEffect(() => {
        const params = {
            page: currentPage,
            per_page: itemsPerPage,
            ...(searchKeyword && { keyword: searchKeyword }),
            ...(statusFilter !== 'Semua' && { status: statusFilter }),
        };
        if (!loadingOverlay) {
            fetchAllProspectiveStudents(params);
        }
    }, [searchKeyword, currentPage, fetchAllProspectiveStudents, loadingOverlay, statusFilter]);

    if (!user) {
        setUser(null);
        return <Navigate to="/login" />;
    }


    const handleRemove = async (item: ProspectiveStudent) => {
        const isConfirmed = await confirm({
            title: "Reject Data",
            message: `Apakah Anda yakin ingin reject calon siswa ini?`,
            confirmText: "Ya, Lanjutkan",
            cancelText: "Batal",
        });
        if (isConfirmed) {
            setLoadingOverlay(true);
            try {
                await removeProspectiveStudent(item.id);
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    toast.error(error.message || "Terjadi kesalahan");
                }
            } finally {
                setLoadingOverlay(false);
            }
        }

    };

    const handleApprove = async (item: ProspectiveStudent) => {
        const isConfirmed = await confirm({
            title: "Apporove Data",
            message: `Apakah Anda yakin ingin approve calon siswa ini?`,
            confirmText: "Ya, Lanjutkan",
            cancelText: "Batal",
        });
        if (isConfirmed) {
            setLoadingOverlay(true);
            try {
                await approveProspectiveStudent(item.id);
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    toast.error(error.message || "Terjadi kesalahan");
                }
            } finally {
                setLoadingOverlay(false);
            }
        }

    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
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
                                <h2 className="text-2xl font-bold">Calon Siswa</h2>
                                <h2 className="text-gray-500">
                                    Kelola data calon siswa yang tersedia di sekolah
                                </h2>
                            </div>
                            <Button onClick={() => navigate('/students/prospective/create')} className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white">
                                <span>Tambah Calon Siswa</span>
                                <Plus className="h-4 w-4" />
                            </Button>

                        </div>

                        <div className="flex flex-wrap gap-4 mb-4 items-end">
                            {/* Search */}
                            <div className="flex-grow max-w-[50%] min-w-[250px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cari Calon Siswa
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Cari berdasarkan nama, kode registrasi siswa..."
                                        value={searchKeyword}
                                        onChange={handleSearchChange}
                                        className="w-full pl-10 pr-4 h-10 border border-gray-300 rounded-md focus:ring-0 focus:border-gray-500"
                                    />
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                </div>
                            </div>

                            {/* Filter Dropdown */}
                            <div className="w-48">
                                <FormSelect
                                    label="Status"
                                    name="Status"
                                    value={statusFilter}
                                    onChange={handleStatusChange}
                                    options={[{ label: 'Semua', value: 'Semua' }, { label: 'Waiting', value: 'waiting' }, { label: 'Approved', value: 'approved' }, { label: 'Rejected', value: 'rejected' }]}
                                />

                            </div>
                        </div>

                        {prospectiveStudentLoading && <EducationLevelTableSkeleton />}
                        {prospectiveStudentError && <p className="text-red-500">Error: {prospectiveStudentError}</p>}

                        {!prospectiveStudentLoading && !prospectiveStudentError && (
                            <ProspectiveStudentTable
                                currentPage={currentPage}
                                perPage={itemsPerPage}
                                items={prospectiveStudentData}
                                onApproved={(item) => {
                                    handleApprove(item);
                                }}
                                onDeleted={(item) => {
                                    handleRemove(item);
                                }}
                                onEdit={(item) => {
                                    // setSelectedItem(item);
                                    navigate('/students/prospective/create', {
                                        state: { item: item }
                                    })
                                }}
                            />
                        )}

                        {/* Show "No results" message when filtered */}
                        {!prospectiveStudentLoading && !prospectiveStudentError && prospectiveStudentData.length === 0 && (searchKeyword) && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">
                                    Tidak ada data yang sesuai dengan pencarian .
                                </p>
                            </div>
                        )}

                        {prospectiveStudentMeta && prospectiveStudentData.length > 0 && (
                            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                                {/* Pagination Info */}
                                <p className="text-sm text-gray-700">
                                    Menampilkan <span className="font-medium">{startItem}</span>
                                    {' '}sampai <span className="font-medium">{endItem}</span>
                                    {' '}dari <span className="font-medium">{prospectiveStudentMeta.total || 0}</span> hasil
                                    {(searchKeyword) && (
                                        <span className="text-gray-500">
                                            {' '}(difilter berdasarkan "{searchKeyword}")
                                        </span>
                                    )}
                                </p>


                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                        className="mt-4"
                                    />
                                )}

                            </div>
                        )}

                    </main>
                    {ConfirmDialog}
                </div>
            </div>

        </BaseLayout>
    );
}
