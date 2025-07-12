import { useState, useContext } from "react";
import { Button } from "@/core/components/ui/button"
import { Navigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import BaseLayout from "@/core/components/baseLayout";
import Table from "@/feature/billing/components/table";
import GrantTable from "@/feature/billing/components/grantTable";
import PackageTable from "@/feature/billing/components/BillingPackageTable";
import BillingTableSkeleton from "@/core/components/ui/education_level_table_shimmer";
import { Plus, Search, FileText, RefreshCcw } from "lucide-react";
import { useBilling } from "../hook/useBilling";
import { useGrant } from "../hook/useGrant";
import { usePackage } from "../hook/usePackage";


import LoadingOverlay from "@/core/components/ui/loading_screen";
import BillingForm from "../forms/billingForm";
import GrantForm from "../forms/grantForm";
import BillingPackageForm from "../forms/billingPackageForm";

// Tab
const tabs = ['Biaya', 'Paket Biaya', 'Metode Pembayaran', 'Diskon & Beasiswa', 'Dana Hibah'];

export default function BillingPage() {
    const { user, setUser } = useContext(AppContext);
    const { data, loading, loadingOverlay, remove, create, update } = useBilling();
    const { data: grantData, remove: removeGrant, reset, create: createGrant, update: updateGrant } = useGrant();
    const { data: packageData, remove: removePackage, create: createPackage, update: updatePackage } = usePackage();
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [modalType, setModalType] = useState<"billing" | "grant" | "package">("billing");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("Biaya");

    if (!user) {
        setUser(null);
        return <Navigate to="/login" />;
    }
    
    //create dan update dari hook useBilling, useGrant, dan usePackage
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


    // Filter data based on search term
    // Menggunakan data dari hook useBilling, useGrant, dan usePackage
    const filteredData = data?.filter(item =>
        (item?.service_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item?.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item?.applies_to || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item?.code || '').toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const filteredGrantData = grantData.filter(item =>
        item.grants_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.donor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPackageData = packageData.filter(item =>
        (item?.service_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    // end filter
    

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
                                <Button variant="outline" className="flex items-center gap-1">
                                    <FileText className="h-4 w-4" />
                                    <span>Impor / Ekspor</span>
                                </Button>
                                <Button variant="outline" className="flex items-center gap-1">
                                    <RefreshCcw className="h-4 w-4" />
                                    <span>Segarkan</span>
                                </Button>
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
                        {activeTab === "Biaya" && ( // Only render this section if "Biaya" tab is active
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
                                {/* Menggunakan loading dari hook useBilling */}
                                {loading ? (
                                    <BillingTableSkeleton />
                                ) : <Table
                                    items={filteredData} // Use filtered data
                                    onDeleted={(item) => {
                                        // Menggunakan remove dari hook useBilling
                                        remove(item.id)
                                    }}

                                    onEdit={(item) => {
                                        setSelectedItem(item);
                                        setShowModal(true);
                                    }}
                                />}
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
                                            setModalType("package"); // Change this from "billing" to "package"
                                            setShowModal(true); 
                                            setSelectedItem(null); 
                                        }} 
                                        className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white"
                                    >
                                        <span>Tambah Paket</span> {/* Also update the button text to match the action */}
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                {/* Placeholder Table for Paket Biaya */}
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
                                {/* Menggunakan loading dari hook usePakcage */}
                                {loading ? (
                                    <BillingTableSkeleton />
                                ) : <PackageTable
                                    items={filteredPackageData} // Use filtered data
                                    onDeleted={(item) => {
                                        // Menggunakan remove dari hook useBilling
                                        removePackage(item.id)
                                    }}

                                    onEdit={(item) => {
                                        setSelectedItem(item);
                                        setShowModal(true);
                                    }}
                                />}
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
                                        // Menggunakan remove dari hook useBilling
                                        removeGrant(item.id)
                                        }}
                                        onEdit={(item) => {
                                            setSelectedItem(item);
                                            setShowModal(true);
                                        }}
                                        onReset={(item) => reset(item.id)}
                                    />
                                )}
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