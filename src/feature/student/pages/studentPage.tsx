import { useEffect, useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import BaseLayout from "@/core/components/baseLayout";
import EducationLevelTableSkeleton from "@/core/components/ui/education_level_table_shimmer";
import { LeafIcon, Search } from "lucide-react";
import Pagination from "@/core/components/forms/pagination";
import { useStudent } from "../hooks/useStudent";
import StudentTable from "../components/studentTable";
import { ChangeStatusRequest } from "../types/student";
import { useConfirm } from "@/core/components/confirmDialog";
import LoadingOverlay from "@/core/components/ui/loading_screen";
import toast from "react-hot-toast";
import { AxiosError } from "axios";


export default function StudentsPage() {
    const navigate = useNavigate();

    const { user, setUser } = useContext(AppContext);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingOverlay, setLoadingOverlay] = useState(false);
    const { confirm, ConfirmDialog } = useConfirm();
    const itemsPerPage = 10;
    const {
        data: studentData,
        meta: studentMeta,
        summary: studentSummary,
        loading: studentLoading,
        error: studentError,
        changeStatus: changeStatusStudent,
        fetchAll: fetchAllStudents,
    } = useStudent();

    const totalPages = studentMeta ? Math.ceil((studentMeta.total || 0) / itemsPerPage) : 0;
    const startItem = studentMeta ? ((currentPage - 1) * itemsPerPage) + 1 : 0;
    const endItem = studentMeta ? Math.min(currentPage * itemsPerPage, studentMeta.total || 0) : 0;


    useEffect(() => {
        const params = {
            page: currentPage,
            per_page: itemsPerPage,
            ...(searchKeyword && { keyword: searchKeyword }),
        };
        if (!loadingOverlay) {
            fetchAllStudents(params);
        }

    }, [searchKeyword, currentPage, loadingOverlay, fetchAllStudents,]);

    if (!user) {
        setUser(null);
        return <Navigate to="/login" />;
    }



    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value);
    };

    const handleChangeStatus = async (data: ChangeStatusRequest) => {
        const isConfirmed = await confirm({
            title: `Ubah status jadi ${data.status}`,
            message: `Apakah Anda yakin ingin ubah status siswa ini?`,
            confirmText: "Ya, Lanjutkan",
            cancelText: "Batal",
        });
        if (isConfirmed) {
            setLoadingOverlay(true);
            try {
                await changeStatusStudent(data);
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    toast.error(error.message || "Terjadi kesalahan");
                }
            } finally {
                setLoadingOverlay(false);
            }
        }

    };

    const getCardValue = (value: number, loading: boolean) => {
        if (loading) {
            return <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mt-1 mb-1" />;
        }

        return <p className="text-2xl font-bold">{value}</p>;
    };

    return (
        <BaseLayout>
            <div className="flex min-h-screen">
                <div className="flex-1 w-full ">
                    <main className="p-4 ">
                        {loadingOverlay &&
                            <LoadingOverlay />}
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-2xl font-bold">Siswa</h2>
                                <h2 className="text-gray-500">
                                    Kelola data siswa yang tersedia di sekolah
                                </h2>
                            </div>


                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                            <div className="bg-white p-4 rounded-md shadow-md flex items-center">
                                <div className="mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 5.197M15 21a6 6 0 00-9-5.197" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold">Total Siswa</h3>
                                    {getCardValue(studentSummary?.total ?? 0, studentLoading)}
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-md shadow-md flex items-center">
                                <div className="mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold">Siswa Aktif</h3>
                                    {getCardValue(studentSummary?.approved ?? 0, studentLoading)}
                                </div>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-md shadow-md flex items-center">
                                <div className="mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold">Siswa Yatim</h3>
                                    {getCardValue(studentSummary?.orphan ?? 0, studentLoading)}
                                </div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-md shadow-md flex items-center">
                                <div className="mr-4">
                                    <LeafIcon className="h-8 w-8 text-green-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold">Bina Lingkungan</h3>
                                    {getCardValue(studentSummary?.surrounding_environment ?? 0, studentLoading)}
                                </div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-md shadow-md flex items-center">
                                <div className="mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v7" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold">Anak Guru</h3>
                                    {getCardValue(studentSummary?.teacher_child ?? 0, studentLoading)}
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-md shadow-md flex items-center">
                                <div className="mr-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 5.636l12.728 12.728" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold">Berkebutuhan Khusus</h3>
                                    {getCardValue(studentSummary?.special_needs ?? 0, studentLoading)}
                                </div>
                            </div>
                        </div>
                        {/* Search */}
                        <div className="relative mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cari Calon Siswa
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari berdasarkan nama, kode registrasi siswa..."
                                    value={searchKeyword}
                                    onChange={handleSearchChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:border-gray-500"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                        {studentLoading && <EducationLevelTableSkeleton />}
                        {studentError && <p className="text-red-500">Error: {studentError}</p>}

                        {!studentLoading && !studentError && studentData.length > 0 && (
                            <StudentTable
                                currentPage={currentPage}
                                perPage={itemsPerPage}
                                items={studentData}
                                onEdit={(item) => {
                                    navigate(`/students/student/${item.id}`, {
                                        state: { from: '/students/student' }
                                    });
                                }}
                                onStatusChange={(item, checked) => {
                                    handleChangeStatus({ id: item.id, status: checked ? "active" : "inactive" })
                                }}
                            />
                        )}

                        {/* Show "No results" message when filtered */}
                        {!studentLoading && !studentError && studentData.length === 0 && (searchKeyword) && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">
                                    Tidak ada data yang sesuai dengan pencarian .
                                </p>
                            </div>
                        )}

                        {studentMeta && studentData.length > 0 && (
                            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                                {/* Pagination Info */}
                                <p className="text-sm text-gray-700">
                                    Menampilkan <span className="font-medium">{startItem}</span>
                                    {' '}sampai <span className="font-medium">{endItem}</span>
                                    {' '}dari <span className="font-medium">{studentMeta.total || 0}</span> hasil
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
