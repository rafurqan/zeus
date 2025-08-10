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

        <div className="bg-white p-4 rounded-lg shadow">
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
            
            {/* Pagination Info */}
            {payments.length > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-700">
                  Menampilkan <span className="font-medium">{((page - 1) * 10) + 1}</span>
                  {' '}sampai <span className="font-medium">{Math.min(page * 10, payments.length)}</span>
                  {' '}dari <span className="font-medium">{payments.length}</span> hasil
                  {searchTerm && (
                    <span className="text-gray-500">
                      {' '}(difilter berdasarkan "{searchTerm}")
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

    </BaseLayout>
  );
};