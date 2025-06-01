import { useState, useEffect, useContext } from "react";
import { Button } from "@/core/components/ui/button";
import { Navigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import BaseLayout from "@/core/components/baseLayout";
import StudentClassTableSkeleton from "@/core/components/ui/education_level_table_shimmer";
import { Plus, Search } from "lucide-react";

import LoadingOverlay from "@/core/components/ui/loading_screen";
import { useConfirm } from "@/core/components/confirmDialog";
import { useStudentClass } from "../hooks/useStudentClass";
import StudentClassForm from "../forms/studentClassForm";
import StudentClassTable from "../components/studentClassTable";
import { StudentClass } from "../types/student-class";

import { useClassMembership } from "../hooks/useClassMembership";
import ClassMembershipTable from "../components/classMembershipTable";
import ManagementClassMembershipTable from "../components/managementClassTable";
import { ClassMembership, CreateClassMembershipRequest } from "../types/student-class-membership";
import ChangeClassMembershipForm from "../forms/changeClassMembershipForm";
import { useActiveStudentClass } from "../hooks/useActiveStudentClass";
import Pagination from "@/core/components/forms/pagination";


const ClassMembershipTableSkeleton = () => (
    <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
        ))}
    </div>
);

export default function StudentClassPage() {
    const { user, setUser } = useContext(AppContext);
    const { data, loading, error, loadingOverlay, remove, create, update } = useStudentClass();

    const {
        data: classMembershipData,
        meta: classMembershipMeta,
        loading: classMembershipLoading,
        error: classMembershipError,
        create: createClassMembership,
        fetchAll: fetchAllClassMemberships,
    } = useClassMembership();

    const {
        data: activeClassData,
        loading: activeClassLoading,
        fetchAll: fetchAllActiveStudentClasses,
    } = useActiveStudentClass();

    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<StudentClass | null>(null);
    const [membershipSelected, setSelectedMembership] = useState<ClassMembership | null>(null);
    const [activeTab, setActiveTab] = useState("Daftar Kelas");

    // New state for search and filter
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { confirm, ConfirmDialog } = useConfirm();
    const tabs = ["Daftar Kelas", "Daftar Siswa", "Manajemen Kelas"];

    // Generate class options from available data
    const classOptions = data ? [
        { label: "Semua Kelas", value: "" },
        ...data.map((studentClass) => ({
            label: `${studentClass.name} - ${studentClass.part}`,
            value: studentClass.id.toString()
        }))
    ] : [{ label: "Semua Kelas", value: "" }];

    useEffect(() => {
        if (activeTab === "Daftar Siswa") {
            // Include search and filter parameters when fetching
            const params = {
                page: currentPage,
                per_page: itemsPerPage,
                ...(searchKeyword && { keyword: searchKeyword }),
                ...(selectedClass && { student_class_id: selectedClass })
            };
            fetchAllClassMemberships(params);
        }
    }, [activeTab, searchKeyword, selectedClass, currentPage, fetchAllClassMemberships]);

    // Reset to page 1 when search or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchKeyword, selectedClass]);

    useEffect(() => {
        if (activeTab === "Manajemen Kelas") {
            fetchAllActiveStudentClasses(new Date().getFullYear().toString());
        }
    }, [activeTab]);

    if (!user) {
        setUser(null);
        return <Navigate to="/login" />;
    }

    // Handle search input change with debounce
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value);
    };

    
    // Calculate pagination info
    const totalPages = classMembershipMeta ? Math.ceil((classMembershipMeta.total || 0) / itemsPerPage) : 0;
    const startItem = classMembershipMeta ? ((currentPage - 1) * itemsPerPage) + 1 : 0;
    const endItem = classMembershipMeta ? Math.min(currentPage * itemsPerPage, classMembershipMeta.total || 0) : 0;

    // Handle class filter change
    const handleClassFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedClass(e.target.value);
    };

    // Handle hapus data StudentClass
    const handleRemove = async (item: StudentClass) => {
        const isConfirmed = await confirm({
            title: "Hapus Data",
            message: `Apakah Anda yakin ingin menghapus kelas ini?`,
            confirmText: "Ya, Lanjutkan",
            cancelText: "Batal",
        });
        if (isConfirmed) {
            remove(item.id);
        }
    };

    const handleChangeClass = async (item: CreateClassMembershipRequest) => {
        try {
            await createClassMembership(item);
            setShowModal(false);
            setSelectedItem(null);
        } catch (error) {
            console.error("Gagal menyimpan data perubahan kelas:", error);
        }
    };

    return (
        <BaseLayout>
            <div className="space-y-4 p-4">
                <h2 className="text-2xl font-bold">Kelas</h2>
                <div className="space-y-2">
                    {/* Your main content */}
                    {loadingOverlay && <LoadingOverlay />}
                    <div className="bg-white p-8 space-y-1">

                        {/* Tabs */}
                        <div className="flex gap-2 mb-8 border-b border-gray-200">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`relative px-4 py-2 font-semibold transition-colors duration-300 rounded-t-md 
                                                ${isActive ? 'text-black bg-white border border-b-0 border-gray-300' : 'text-gray-500 hover:text-black'}`}
                                    >
                                        {tab}
                                        {isActive && (
                                            <span className="absolute bottom-0 left-0 w-full h-1 bg-black rounded-t-md"></span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Konten Tab: Daftar Kelas */}
                        {activeTab === "Daftar Kelas" && (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h2 className="text-lg font-bold">Daftar Kelas</h2>
                                        <p className="text-gray-500">Kelola data kelas yang tersedia di sekolah</p>
                                    </div>
                                    <Button
                                        onClick={() => setShowModal(true)}
                                        className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white"
                                    >
                                        <span>Tambah Kelas</span>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                {loading ? (
                                    <StudentClassTableSkeleton />
                                ) : (
                                    <StudentClassTable
                                        items={data}
                                        onDeleted={handleRemove}
                                        onEdit={(item) => {
                                            setSelectedItem(item);
                                            setShowModal(true);
                                        }}
                                    />
                                )}
                                {showModal && (
                                    <StudentClassForm
                                        item={selectedItem}
                                        onClose={() => {
                                            setShowModal(false);
                                            setSelectedItem(null);
                                        }}
                                        onSuccess={(item) => {
                                            if (selectedItem) {
                                                update(item);
                                            } else {
                                                create(item);
                                            }
                                            setShowModal(false);
                                            setSelectedItem(null);
                                        }}
                                    />
                                )}
                            </>
                        )}

                        {/* Konten Tab: Daftar Siswa */}
                        {activeTab === "Daftar Siswa" && (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h2 className="text-lg font-bold">Manajemen Keanggotaan Kelas</h2>
                                        <p className="text-gray-500">Lihat dan kelola siswa dalam kelas.</p>
                                    </div>
                                    {/* Search and Filter Section */}
                                    <div className="mb-6 flex justify-end">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                                            {/* Search Input */}
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Cari Siswa
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Cari berdasarkan nama siswa..."
                                                        value={searchKeyword}
                                                        onChange={handleSearchChange}
                                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-0 focus:border-gray-500"
                                                    />
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                </div>
                                            </div>
                                            {/* Class Filter */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Filter Kelas
                                                </label>
                                                <select
                                                    value={selectedClass}
                                                    onChange={handleClassFilterChange}
                                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    {classOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                {classMembershipLoading && <ClassMembershipTableSkeleton />}
                                {classMembershipError && <p className="text-red-500">Error: {classMembershipError}</p>}

                                {!classMembershipLoading && !classMembershipError && (
                                    <ClassMembershipTable
                                        items={classMembershipData}
                                        onChange={(item) => {
                                            setShowModal(true);
                                            setSelectedMembership(item);
                                        }}
                                    />
                                )}

                                {/* Show "No results" message when filtered */}
                                {!classMembershipLoading && !classMembershipError && classMembershipData.length === 0 && (searchKeyword || selectedClass) && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">
                                            Tidak ada data yang sesuai dengan pencarian atau filter yang dipilih.
                                        </p>
                                    </div>
                                )}

                                {classMembershipMeta && classMembershipData.length > 0 && (
                                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                                        {/* Pagination Info */}
                                        <p className="text-sm text-gray-700">
                                            Menampilkan <span className="font-medium">{startItem}</span>
                                            {' '}sampai <span className="font-medium">{endItem}</span>
                                            {' '}dari <span className="font-medium">{classMembershipMeta.total || 0}</span> hasil
                                            {(searchKeyword || selectedClass) && (
                                                <span className="text-gray-500">
                                                    {' '}(difilter)
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

                                {showModal && (
                                    <ChangeClassMembershipForm
                                        item={membershipSelected}
                                        onClose={() => {
                                            setShowModal(false);
                                            setSelectedItem(null);
                                        }}
                                        onSuccess={handleChangeClass}
                                    />
                                )}
                            </>
                        )}

                        {/* Konten Tab: Manajemen Kelas */}
                        {activeTab === "Manajemen Kelas" && (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h2 className="text-lg font-bold">Manajemen Kelas</h2>
                                        <p className="text-gray-500">Semua kelas yang aktif pada tahun ajaran saat ini</p>
                                    </div>
                                </div>

                                {activeClassLoading && <ClassMembershipTableSkeleton />}
                                {error && <p className="text-red-500">Error: {error}</p>}

                                {!loading && !error && (
                                    <ManagementClassMembershipTable
                                        items={activeClassData}
                                    />
                                )}
                            </>
                        )}
                    </div>
                    {ConfirmDialog}
                </div>
            </div>
        </BaseLayout>
    );
}