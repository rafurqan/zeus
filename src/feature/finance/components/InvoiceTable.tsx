import { useEffect, useState, useContext } from "react";
import { invoiceService } from "../service/invoiceService";
import { AppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useConfirm } from "@/core/components/confirmDialog";

export const InvoiceTable = () => {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { confirm, ConfirmDialog } = useConfirm();

  const fetchInvoices = async () => {
    if (!token) return;
    try {
      const response = await invoiceService.getAllPage(token, page, 10, searchTerm);
      setInvoices(response.data?.data || []); // pastikan array
      setLastPage(response.data?.last_page || 1);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [page, searchTerm]);

  const handleDelete = async (id) => {
    if (!token) return;
    const result = await confirm({
      title: "Konfirmasi Hapus",
      message: "Apakah Anda yakin ingin menghapus faktur ini?",
      confirmText: "Ya, Hapus",
      cancelText: "Batal"
    });
    if (result) {
      try {
        await invoiceService.remove(token, id);
        window.location.reload();
      } catch (error) {
        alert("Gagal menghapus faktur");
      }
    }
  };

  const handleEdit = (id) => navigate(`/finance/billingData/create?id=${id}`);
  const handleDetail = (id) => navigate(`/finance/billingData/detail/${id}`);

  const getStatusColor = (status) => {
    switch (status) {
      case "Lunas": return "bg-green-100 text-green-800";
      case "Terlambat": return "bg-red-100 text-red-800";
      case "Menunggu Pembayaran": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto">
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
            setPage(1); // reset ke halaman pertama saat pencarian
            setSearchTerm(e.target.value);
          }}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
        />
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
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
              <tr key={invoice.id}>
                <td className="px-6 py-4 text-sm text-gray-700">{invoice.code}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{invoice.entity?.full_name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{invoice.student_class?.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{invoice.notes}</td>
                <td className="px-6 py-4 text-sm text-gray-700">Rp {invoice.total?.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {new Date(invoice.due_date).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 flex gap-2">
                  <button onClick={() => handleDetail(invoice.id)} className="text-blue-500 hover:text-blue-700" title="Lihat Detail">
                    <FaEye />
                  </button>
                  <button onClick={() => handleEdit(invoice.id)} className="text-yellow-500 hover:text-yellow-700" title="Edit">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(invoice.id)} className="text-red-500 hover:text-red-700" title="Hapus">
                    <FaTrash />
                  </button>
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
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">Halaman {page} dari {lastPage}</span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, lastPage))}
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
