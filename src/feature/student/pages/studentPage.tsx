import { useEffect, useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import BaseLayout from "@/core/components/baseLayout";
import EducationLevelTableSkeleton from "@/core/components/ui/education_level_table_shimmer";
import { Search } from "lucide-react";
import Pagination from "@/core/components/forms/pagination";
import { useStudent } from "../hooks/useStudent";
import StudentTable from "../components/studentTable";


export default function StudentsPage() {
    const navigate = useNavigate();

    const { user, setUser } = useContext(AppContext);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const {
        data: studentData,
        meta: studentMeta,
        loading: studentLoading,
        error: studentError,
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
        fetchAllStudents(params);
    }, [searchKeyword, currentPage, fetchAllStudents,]);

    if (!user) {
        setUser(null);
        return <Navigate to="/login" />;
    }



    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value);
    };



    return (
        <BaseLayout>
            <div className="flex min-h-screen">
                <div className="flex-1 w-full ">
                    <main className="p-4 ">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-2xl font-bold">Siswa</h2>
                                <h2 className="text-gray-500">
                                    Kelola data siswa yang tersedia di sekolah
                                </h2>
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
                                onApproved={(item) => {
                                    console.log(item);
                                }}
                                onDeleted={(item) => {
                                    console.log(item);
                                }}
                                onEdit={(item) => {
                                    console.log(item);
                                    navigate(`/students/student/${item.id}`);
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
                </div>
            </div>

        </BaseLayout>
    );
}
