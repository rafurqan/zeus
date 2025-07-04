import { useInvoice } from "../hook/useInvoice";
import { InvoiceTable } from "../components/InvoiceTable";
import BaseLayout from "@/core/components/baseLayout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { invoiceService } from "../service/invoiceService";

export const BillingDataPage = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  const {
    invoices,
    originalInvoices,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    page,
    setPage,
    lastPage,
  } = useInvoice();  

  const [statistics, setStatistics] = useState({
    total: { count: 0, amount: 0 },
    per_status: [
      { status: "Menunggu Pembayaran", count: 0, amount: 0 },
      { status: "Terlambat", count: 0, amount: 0 },
      { status: "Lunas", count: 0, amount: 0 }
    ]
  });

  useEffect(() => {
    if (!token) return;
    invoiceService.getStatistics(token).then(res => {
      setStatistics(res);
    });
  }, [token]);

  const getStatusStat = (status) => statistics.per_status.find(s => s.status === status) || { count: 0, amount: 0 };

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

        {/* <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-black-500">Total Faktur</div>
            <div className="text-2xl font-bold">{statistics.total.count}</div>
            <div className="text-sm text-black-500">Rp {statistics.total.amount.toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-black-500">Menunggu Pembayaran</div>
            <div className="text-2xl font-bold">{getStatusStat("Menunggu Pembayaran").count}</div>
            <div className="text-sm text-black-500">Rp {getStatusStat("Menunggu Pembayaran").amount.toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-black-500">Terlambat</div>
            <div className="text-2xl font-bold">{getStatusStat("Terlambat").count}</div>
            <div className="text-sm text-black-500">Rp {getStatusStat("Terlambat").amount.toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-black-500">Lunas</div>
            <div className="text-2xl font-bold">{getStatusStat("Lunas").count}</div>
            <div className="text-sm text-black-500">Rp {getStatusStat("Lunas").amount.toLocaleString()}</div>
          </div>
        </div> */}

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
          />
        </div>
      </div>
    </BaseLayout>
  );
};