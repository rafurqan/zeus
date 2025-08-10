import { useState, useContext, useEffect } from "react";
import { Button } from "@/core/components/ui/button"
import { Navigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import BaseLayout from "@/core/components/baseLayout";
import Table from "@/feature/billing/components/table";
import GrantTable from "@/feature/billing/components/grantTable";
import PackageTable from "@/feature/billing/components/BillingPackageTable";
import BillingTableSkeleton from "@/core/components/ui/education_level_table_shimmer";
import { Plus, Search } from "lucide-react";
import { useBilling } from "../hook/useBilling";
import { useGrant } from "../hook/useGrant";
import { usePackage } from "../hook/usePackage";
import { FaUndo } from "react-icons/fa";


import LoadingOverlay from "@/core/components/ui/loading_screen";
import BillingForm from "../forms/billingForm";
import GrantForm from "../forms/grantForm";
import BillingPackageForm from "../forms/billingPackageForm";

// Tab
const tabs = ['Biaya', 'Paket Biaya', 'Dana Hibah', 'Metode Pembayaran', 'Diskon & Beasiswa' ];

export default function BillingPage() {
    const { user, setUser } = useContext(AppContext);
    const { 
        data, 
        loading, 
        loadingOverlay, 
        remove, 
        create, 
        update,
        page,
        setPage,
        lastPage,
        meta,
        fetchWithPagination
    } = useBilling();
    
    const [searchTerm, setSearchTerm] = useState("");
    
    useEffect(() => {
        fetchWithPagination(searchTerm);
    }, [searchTerm]);
    
    const { 
        data: grantData, 
        remove: removeGrant, 
        reset, 
        create: createGrant, 
        update: updateGrant,
        page: grantPage,
        setPage: setGrantPage,
        lastPage: grantLastPage,
        meta: grantMeta,
    } = useGrant();
    const { 
        data: packageData, 
        remove: removePackage, 
        create: createPackage, 
        update: updatePackage,
        page: packagePage,
        setPage: setPackagePage,
        lastPage: packageLastPage,
        meta: packageMeta,
    } = usePackage();
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [modalType, setModalType] = useState<"billing" | "grant" | "package">("billing");
    const [activeTab, setActiveTab] = useState("Biaya");
    const handleRefresh = () => window.location.reload();

    if (!user) {
        setUser(null);
        return <Navigate to="/login" />;
    }
    
    const handleSuccess = (item: any) => {
        if (modalType === "grant") {
            if (selectedItem) {
                updateGrant(item);
            } else {
                createGrant(item);
            }
        } else if (modalType === "package") {
            if (selectedItem) {
                updatePackage(item);
            } else {
                createPackage(item);
            }
        } else {
            if (selectedItem) {
                update(item);
            } else {
                create(item);
            }
        }
        setShowModal(false);
        setSelectedItem(null);
    };

    const filteredData = data || [];

    const filteredGrantData = grantData.filter(item =>
        item.grants_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.donor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPackageData = packageData.filter(item =>
        (item?.service_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    

    return (
        <BaseLayout>
            <div className="flex min-h-screen">
                <div className="flex-1 w-full ">
                    <main className="p-4 ">
                        {/* Menggunakan loadingOverlay dari hook useBilling */}
                        {loadingOverlay &&
                            <LoadingOverlay
                            />}

                        {/* Header Section */}
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold">Master Data Penagihan</h1>
                            <div className="flex space-x-2">
                                <button className="px-4 py-2 bg-white text-black-700 border border-black-300 rounded-md shadow-sm hover:bg-black-50 flex items-center gap-2" onClick={handleRefresh}>
                                    <FaUndo className="h-4 w-4" /> <span>Segarkan</span>
                                </button>
                            </div>
                        </div>

                        {/* Tabs Section */}
                        <div className="mb-6 border-b border-gray-200">
                            <div className="flex space-x-8">
                                {tabs.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => {setActiveTab(tab); if (tab === "Biaya") {setModalType("billing");} else if (tab === "Paket Biaya") {setModalType("package");} else if (tab === "Dana Hibah") {setModalType("grant");}}}
                                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Biaya Section */}
                        {activeTab === "Biaya" && (
                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold">Biaya</h2>
                                        <p className="text-sm text-gray-500">
                                            Kelola kategori biaya yang dikenakan kepada siswa
                                        </p>
                                    </div>
                                    <Button onClick={() => { setShowModal(true); setSelectedItem(null); }} className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white">
                                        <span>Tambah Biaya</span>

                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Search Input */}
                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari master biaya..."
                                        className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Table Section */}
                                {loading ? (
                                    <BillingTableSkeleton />
                                ) : <Table
                                    items={filteredData}
                                    onDeleted={(item) => {
                                        remove(item.id)
                                    }}
                                    onEdit={(item) => {
                                        setSelectedItem(item);
                                        setShowModal(true);
                                    }}
                                    currentPage={page}
                                    totalPages={lastPage}
                                    onPageChange={setPage}
                                    meta={meta}
                                />}
                                {/* Pagination Info */}
                                {meta && filteredData.length > 0 && (
                                  <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <p className="text-sm text-gray-700">
                                      Menampilkan <span className="font-medium">{((page - 1) * 10) + 1}</span>
                                      {' '}sampai <span className="font-medium">{Math.min(page * 10, meta.total || 0)}</span>
                                      {' '}dari <span className="font-medium">{meta.total || 0}</span> hasil
                                      {searchTerm && (
                                        <span className="text-gray-500">
                                          {' '}(difilter berdasarkan "{searchTerm}")
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                )}
                            </div>
                        )}

                        {/* Paket Biaya Section */}
                        {activeTab === "Paket Biaya" && (
                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold">Paket Biaya</h2>
                                        <p className="text-sm text-gray-500">
                                            Kelola paket biaya yang terdiri dari beberapa item biaya
                                        </p>
                                    </div>
                                    <Button 
                                        onClick={() => { 
                                            setModalType("package");
                                            setShowModal(true); 
                                            setSelectedItem(null); 
                                        }} 
                                        className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white"
                                    >
                                        <span>Tambah Paket</span> 
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {/* Search Input */}
                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari master Paket Biaya..."
                                        className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Table Section */}
                                {loading ? (
                                    <BillingTableSkeleton />
                                ) : <PackageTable
                                    items={filteredPackageData}
                                    onDeleted={(item) => {
                                        removePackage(item.id)
                                    }}
                                    onEdit={(item) => {
                                        setSelectedItem(item);
                                        setShowModal(true);
                                    }}
                                    currentPage={packagePage}
                                    totalPages={packageLastPage}
                                    onPageChange={setPackagePage}
                                    meta={packageMeta}
                                />}
                                {/* Pagination Info */}
                                {packageMeta && filteredPackageData.length > 0 && (
                                  <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <p className="text-sm text-gray-700">
                                      Menampilkan <span className="font-medium">{((packagePage - 1) * 10) + 1}</span>
                                      {' '}sampai <span className="font-medium">{Math.min(packagePage * 10, packageMeta.total || 0)}</span>
                                      {' '}dari <span className="font-medium">{packageMeta.total || 0}</span> hasil
                                      {searchTerm && (
                                        <span className="text-gray-500">
                                          {' '}(difilter berdasarkan "{searchTerm}")
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                )}
                            </div>
                        )}

                        {/* Dana Hibah Section */}
                        {activeTab === "Dana Hibah" && (
                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold">Dana Hibah</h2>
                                        <p className="text-sm text-gray-500">
                                            Kelola dana hibah untuk membantu pembayaran siswa
                                        </p>
                                    </div>
                                    <Button 
                                        onClick={() => { 
                                            setModalType("grant");
                                            setShowModal(true); 
                                            setSelectedItem(null); 
                                        }} 
                                        className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white"
                                    >
                                        <span>Tambah Dana Hibah</span>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Search Input */}
                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari dana hibah..."
                                        className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Grant Table Section */}
                                {loading ? (
                                    <BillingTableSkeleton />
                                ) : (
                                    // Filter grant data
                                    <GrantTable
                                        items={filteredGrantData}
                                        onDeleted={(item) => {
                                        removeGrant(item.id)
                                        }}
                                        onEdit={(item) => {
                                            setSelectedItem(item);
                                            setShowModal(true);
                                        }}
                                        onReset={(item) => reset(item.id)}
                                        currentPage={grantPage}
                                        totalPages={grantLastPage}
                                        onPageChange={setGrantPage}
                                        meta={grantMeta}
                                    />
                                )}
                                {/* Pagination Info */}
                                {meta && filteredData.length > 0 && (
                                  <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <p className="text-sm text-gray-700">
                                      Menampilkan <span className="font-medium">{((page - 1) * 10) + 1}</span>
                                      {' '}sampai <span className="font-medium">{Math.min(page * 10, meta.total || 0)}</span>
                                      {' '}dari <span className="font-medium">{meta.total || 0}</span> hasil
                                      {searchTerm && (
                                        <span className="text-gray-500">
                                          {' '}(difilter berdasarkan "{searchTerm}")
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                )}
                            </div>
                        )}

                        {/* Metode Pembayaran Section (Placeholder) */}
                        {activeTab === "Metode Pembayaran" && (
                            <div className="bg-white p-6 rounded-lg shadow">
                                <p className="text-gray-500">Konten untuk tab "{activeTab}" akan ditampilkan di sini.</p>
                            </div>
                        )}

                        {/* Diskon & Beasiswa Section (Placeholder) */}
                        {activeTab === "Diskon & Beasiswa" && (
                            <div className="bg-white p-6 rounded-lg shadow">
                                <p className="text-gray-500">Konten untuk tab "{activeTab}" akan ditampilkan di sini.</p>
                            </div>
                        )}


                        {/* Modal Section */}
                        {showModal && (
                            activeTab === "Paket Biaya" ? (
                                <BillingPackageForm
                                    item={selectedItem}
                                    onClose={() => {
                                        setShowModal(false);
                                        setSelectedItem(null);
                                    }}
                                    onSuccess={handleSuccess}
                                />
                            ) : (
                                activeTab === "Dana Hibah" ? (
                                    <GrantForm
                                        item={selectedItem}
                                        onClose={() => {
                                            setShowModal(false);
                                            setSelectedItem(null);
                                        }}
                                        onSuccess={handleSuccess}
                                    />
                                ) : (
                                    <BillingForm
                                        item={selectedItem}
                                        onClose={() => {
                                            setShowModal(false);
                                            setSelectedItem(null);
                                        }}
                                        onSuccess={handleSuccess}
                                    />
                                )
                            )
                        )}
                    </main>
                </div>
            </div>

        </BaseLayout>
    );
}