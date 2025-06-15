import { useInvoice } from "../hook/useInvoice";
import { InvoiceTable } from "../components/InvoiceTable";
import BaseLayout from "@/core/components/baseLayout";
import { useNavigate } from "react-router-dom";

export const BillingDataPage = () => {
  const navigate = useNavigate();
  const { invoices, searchQuery, setSearchQuery } = useInvoice();

  const stats = {
    total: invoices.length,
    pending: invoices.filter((i) => i.status === "Menunggu Pembayaran").length,
    late: invoices.filter((i) => i.status === "Terlambat").length,
    paid: invoices.filter((i) => i.status === "Lunas").length,
  };

  return (
    <BaseLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Faktur</h1>
          <div className="space-x-2">
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
              Segarkan
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
              Buat Faktur Kolektif
            </button>
            <button 
              onClick={() => navigate("/finance/billingData/create")} 
              className="px-4 py-2 bg-black text-white rounded-md shadow-sm hover:bg-gray-800"
            >
              Buat Faktur
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Total Faktur</div>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-500">Rp {invoices.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Menunggu Pembayaran</div>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <div className="text-sm text-gray-500">Rp {invoices.filter(i => i.status === "Menunggu Pembayaran").reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Terlambat</div>
            <div className="text-2xl font-bold">{stats.late}</div>
            <div className="text-sm text-gray-500">Rp {invoices.filter(i => i.status === "Terlambat").reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Lunas</div>
            <div className="text-2xl font-bold">{stats.paid}</div>
            <div className="text-sm text-gray-500">Rp {invoices.filter(i => i.status === "Lunas").reduce((sum, i) => sum + i.amount, 0).toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Daftar Faktur</h2>
            <p className="text-sm text-gray-500">Kelola semua faktur siswa di sini</p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari faktur, siswa, atau deskripsi..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-2.5">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="relative inline-block text-left">
              <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 flex items-center">
                Semua Status
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          <InvoiceTable invoices={invoices} />
        </div>
      </div>
    </BaseLayout>
  );
};