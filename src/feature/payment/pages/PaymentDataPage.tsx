import { usePayment } from "../hook/usePayment";
import { PaymentTable } from "../components/PaymentTable";
import BaseLayout from "@/core/components/baseLayout";

export const PaymentDataPage = () => {
  const {
    payments,
    loading,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    lastPage,
    activeTab,
    setActiveTab,
  } = usePayment();
  
  const handleRefresh = () => window.location.reload();

  return (
    <BaseLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Pembayaran</h1>
          <div className="space-x-2">
            <button className="px-4 py-2 bg-white text-black-700 border border-black-300 rounded-md shadow-sm hover:bg-black-50" onClick={handleRefresh}>
              Segarkan
            </button>
          </div>
        </div>

        <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Daftar Pembayaran</h2>
            <p className="text-sm text-black-500">Kelola semua pembayaran siswa di sini</p>
        </div>

        <PaymentTable
          payments={payments}
          loading={loading}
          page={page}
          setPage={setPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lastPage={lastPage}
        />
      </div>
    </BaseLayout>
  );
};