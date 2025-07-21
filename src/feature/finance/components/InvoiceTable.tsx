import { useState, useContext } from "react";
import { invoiceService } from "../service/invoiceService";
import { AppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useConfirm } from "@/core/components/confirmDialog";

const TAB_LIST = [
  { key: "unpaid", label: "Belum Bayar" },
  { key: "", label: "Semua" },
  { key: "paid", label: "Sudah Bayar" }
];

interface InvoiceTableProps {
  invoices: any[];
  onDelete: () => void;
  page: number;
  setPage: (page: number) => void;
  lastPage: number;
  setSelectedStatus: (status: string) => void; 
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const InvoiceTable = ({ 
  invoices, 
  page, 
  setPage, 
  lastPage,
  setSelectedStatus,
  searchTerm,
  setSearchTerm
}: InvoiceTableProps) => {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("unpaid");
  const { confirm, ConfirmDialog } = useConfirm();

  const handleChangeTab = (status: string | null) => {
    setPage(1);
    setActiveTab(status || '');
    setSelectedStatus(status || '');
  };
  
  const handleDelete = async (id: number) => {
    if (!token) return;
    const result = await confirm({
      title: "Konfirmasi Hapus",
      message: "Apakah Anda yakin ingin menghapus faktur ini?",
      confirmText: "Ya, Hapus",
      cancelText: "Batal"
    });
    if (result) {
      try {
        await invoiceService.remove(token, id.toString());
        window.location.reload();
      } catch (error) {
        alert("Gagal menghapus faktur");
      }
    }
  };

  const handleEdit = (id: number) => navigate(`/finance/billingData/create?id=${id}`);
  const handleDetail = (id: number) => navigate(`/finance/billingData/detail/${id}`);

  return (
    <div className="overflow-x-auto">
      {/* Tab Filter */}
      <div className="flex mb-4">
        {TAB_LIST.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 mr-2 rounded ${activeTab === tab.key ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
            onClick={() => handleChangeTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search input */}
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Cari faktur, siswa, atau deskripsi..."
          value={searchTerm}
          onChange={(e) => {
            setPage(1);
            setSearchTerm(e.target.value);
          }}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
        />
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Siswa</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jatuh Tempo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <tr key={(invoice as { id: number }).id}>
                <td className="px-6 py-4 text-sm text-gray-700">{((page - 1) * 10) + invoices.indexOf(invoice) + 1}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{(invoice as { code: string }).code}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{(invoice as { entity: { full_name: string } }).entity?.full_name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{(invoice as { student_class: { name: string } }).student_class?.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{(invoice as { notes: string }).notes || "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">Rp {(invoice as { total: number }).total?.toLocaleString() || "-"}</td>
                <td className="px-6 py-4">
                  {(invoice as { status: string }).status === 'paid' && (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Lunas
                    </span>
                  )}
                  {(invoice as { status: string }).status === 'unpaid' && (
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      Belum Lunas
                    </span>
                  )}
                  {(invoice as { status: string }).status === 'partial' && (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      Sebagian
                    </span>
                  )}
                  {!(invoice as { status: string }).status && (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date((invoice as { due_date: string }).due_date).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 flex gap-2">
                  <button onClick={() => handleDetail((invoice as { id: number }).id)} className="text-blue-500 hover:text-blue-700" title="Lihat Detail">
                    <FaEye />
                  </button>
                  {!((invoice as { payment: { id: number } }).payment?.id) && (
                    <>
                      <button onClick={() => handleEdit((invoice as { id: number }).id)} className="text-yellow-500 hover:text-yellow-700" title="Edit">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete((invoice as { id: number }).id)} className="text-red-500 hover:text-red-700" title="Hapus">
                        <FaTrash />
                      </button>
                    </>
                  )}
                  
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">Tidak ada data ditemukan</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">Halaman {page} dari {lastPage}</span>
        <button
          onClick={() => setPage(Math.min(page + 1, lastPage))}
          disabled={page === lastPage}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {ConfirmDialog}
    </div>
  );
};
