import { useInvoice } from "../hook/useInvoice";
import { InvoiceTable } from "../components/InvoiceTable";
import BaseLayout from "@/core/components/baseLayout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
          <div className="space-x-2">
            <button className="px-4 py-2 bg-white text-black-700 border border-black-300 rounded-md shadow-sm hover:bg-black-50" onClick={handleRefresh}>
              Segarkan
            </button>
            <button 
              onClick={() => navigate("/finance/billingData/create")} 
              className="px-4 py-2 bg-black text-white rounded-md shadow-sm hover:bg-black-800"
            >
              Buat Faktur
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
        </div>
      </div>
    </BaseLayout>
  );
};