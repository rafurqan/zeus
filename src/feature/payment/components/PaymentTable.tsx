import { useEffect, useState, useContext } from "react";
import { paymentService } from "../service/paymentService";
import { AppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaEye, FaWallet, FaTimes, FaPrint } from "react-icons/fa";
import { useConfirm } from "@/core/components/confirmDialog";

import { PaymentDetailModal } from "./PaymentDetailModal";

const TAB_LIST = [
  { key: "unpaid", label: "Belum Bayar" },
  { key: null, label: "Semua" },
  { key: "paid", label: "Sudah Bayar" }
];



export const PaymentTable = ({
  payments,
  loading,
  page,
  lastPage,
  setPage,
  total,
  searchTerm,
  setSearchTerm,
  activeTab = null,
  setActiveTab,
}) => {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const { confirm, ConfirmDialog } = useConfirm();
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const handleChangeTab = (status: string | null) => {
    setPage(1);
    setActiveTab(status);
  };  

  const handleDelete = async (id: string) => {
    if (!token) return;
    const result = await confirm({
      title: "Konfirmasi Hapus",
      message: "Apakah Anda yakin ingin membatalkan pembayaran ini?",
      confirmText: "Ya, Hapus",
      cancelText: "Batal"
    });
    if (result) {
      try {
        await paymentService.remove(token, id);
        window.location.reload();
      } catch (error) {
        alert("Gagal menghapus pembayaran");
      }
    }
  };

  const handlePayment = (id: string) => navigate(`/payment/paymentData/paymentForm?id=${id}`);
  

  const handleDetail = (payment: any) => {
    setSelectedPayment(payment);
    setShowDetail(true);
  };

  const handleEdit = (id: string, paymentId: string) => {
    navigate(`/payment/paymentData/paymentForm?id=${id}&paymentId=${paymentId}&mode=edit`);
  };

  const handlePrint = (invoiceId: string, paymentId: string) => {
      window.open(`/payment/print?idInvoice=${invoiceId}&idPayment=${paymentId}`, '', 'width=800,height=600');
  };

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
          placeholder="Cari pembayaran (ID, Siswa, NIS, Kelas, Faktur)..."
          value={searchTerm}
          onChange={(e) => {
            setPage(1); // reset ke halaman pertama saat pencarian
            setSearchTerm(e.target.value);
          }}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
        />
      </div>
      {/* Table */}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Siswa</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIS</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Faktur</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metode</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Jatuh Tempo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Bayar</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment: any) => (
            <tr key={payment.id}>
              <td className="px-6 py-4 text-sm text-gray-700">{((page - 1) * 10) + payments.indexOf(payment) + 1}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{payment.payment?.code || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{payment.entity?.full_name || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{payment.entity?.nisn || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{payment.student_class?.name || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{payment.code || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-700">Rp {payment.total?.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{payment.payment?.payment_method || '-'}</td>
              <td className="px-6 py-4 text-sm">
                {payment.payment?.status === 'paid' && (
                    <span className="px-3 py-1 rounded-full text-white bg-green-600 font-semibold">
                    Lunas
                    </span>
                )}
                {payment.payment?.status === 'unpaid' && (
                    <span className="px-3 py-1 rounded-full text-white bg-yellow-600 font-semibold">
                    Belum Lunas
                    </span>
                )}
                {payment.payment?.status === 'late' && (
                    <span className="px-3 py-1 rounded-full text-white bg-red-500 font-semibold">
                    Terlambat
                    </span>
                )}
                {payment.payment?.status === 'partial' && (
                    <span className="px-3 py-1 rounded-full text-white bg-blue-500 font-semibold">
                    Sebagian
                    </span>
                )}
                {!payment.payment?.status && (
                    <span className="text-gray-500">-</span>
                )}
              </td>

              <td className="px-6 py-4 text-sm text-gray-700">
                {new Date(payment.due_date).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {payment.payment?.payment_date ? new Date(payment.payment?.payment_date).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric"
                  }) : '-'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                <button onClick={() => handleDetail(payment)} className="mr-2 text-blue-600"><FaEye /></button>
                {payment.payment?.id ? (
                  <>
                    <button onClick={() => handlePrint(payment.id, payment.payment?.id)} className="mr-2 text-gray-600"><FaPrint /></button>
                    <button onClick={() => handleEdit(payment.id, payment.payment?.id)} className="mr-2 text-yellow-600"><FaEdit /></button>
                  </>
                ) : (
                  <button onClick={() => handlePayment(payment.id)} className="mr-2 text-green-600"><FaWallet /></button>
                )}
                {payment.payment?.id && (
                  <button onClick={() => handleDelete(payment.payment?.id)} className="text-red-600"><FaTimes /></button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    <PaymentDetailModal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        payment={selectedPayment}
    />

      {ConfirmDialog}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={`px-3 py-2 rounded-md ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Halaman {page} dari {lastPage}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= lastPage}
          className={`px-3 py-2 rounded-md ${page >= lastPage ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};