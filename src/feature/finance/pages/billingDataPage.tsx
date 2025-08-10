import { useInvoice } from "../hook/useInvoice";
import { InvoiceTable } from "../components/InvoiceTable";
import BaseLayout from "@/core/components/baseLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUndo } from "react-icons/fa";

export const BillingDataPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    invoices,
    page,
    setPage,
    lastPage,
    setSelectedStatus
  } = useInvoice(searchTerm); // <-- pass searchTerm ke hook

  const navigate = useNavigate();
  const handleRefresh = () => window.location.reload();
  const handleDelete = () => {
    window.location.reload();
  };

  return (
    <BaseLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Faktur</h1>
          <div className="space-x-2 flex">
          <button className="px-4 py-2 bg-white text-black-700 border border-black-300 rounded-md shadow-sm hover:bg-black-50 flex items-center gap-2" onClick={handleRefresh}><FaUndo className="h-4 w-4" /> 
            <span>Segarkan</span>
          </button>
          <button onClick={() => navigate("/finance/billingData/create")} className="px-4 py-2 bg-black text-white rounded-md shadow-sm hover:bg-black-800">Buat Faktur
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Daftar Faktur</h2>
            <p className="text-sm text-black-500">Kelola semua faktur siswa di sini</p>
          </div>

          <InvoiceTable 
            invoices={invoices} 
            onDelete={handleDelete} 
            page={page} 
            setPage={setPage} 
            lastPage={lastPage}
            setSelectedStatus={setSelectedStatus}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          
          {/* Pagination Info */}
          {invoices.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-700">
                Menampilkan <span className="font-medium">{((page - 1) * 10) + 1}</span>
                {' '}sampai <span className="font-medium">{Math.min(page * 10, invoices.length)}</span>
                {' '}dari <span className="font-medium">{invoices.length}</span> hasil
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