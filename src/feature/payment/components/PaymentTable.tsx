import { useState, useContext } from "react";
import { paymentService } from "../service/paymentService";
import { AppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaEye, FaWallet, FaTimes, FaPrint } from "react-icons/fa";
import { useConfirm } from "@/core/components/confirmDialog";
import { Payment } from "../types/payment";

import { PaymentDetailModal } from "./PaymentDetailModal";

const TAB_LIST = [
  { key: "unpaid", label: "Belum Bayar" },
  { key: null, label: "Semua" },
  { key: "paid", label: "Sudah Bayar" }
];

// Tambahkan interface untuk props
interface PaymentTableProps {
  payments: Payment[];
  loading: boolean;
  page: number;
  lastPage: number;
  setPage: (page: number) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeTab: string | null;
  setActiveTab: (tab: string | null) => void;
}

export const PaymentTable  = ({
  payments,
  page,
  lastPage,
  setPage,
  searchTerm,
  setSearchTerm,
  activeTab = 'unpaid',
  setActiveTab,
}: PaymentTableProps) => {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const { ConfirmDialog } = useConfirm();
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState("");

  const handleChangeTab = (status: string | null) => {
    setPage(1);
    setActiveTab(status);
  };  

  const handleDeleteClick = (id: string) => {
    setSelectedPaymentId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!token || !selectedPaymentId || !deleteReason.trim()) return;
    
    try {
      await paymentService.remove(token, selectedPaymentId);
      setShowDeleteModal(false);
      setDeleteReason("");
      window.location.reload();
    } catch (error) {
      alert("Gagal menghapus pembayaran");
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteReason("");
    setSelectedPaymentId(null);
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
      // navigate(`/payment/print?idInvoice=${invoiceId}&idPayment=${paymentId}`);
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
            setPage(1);
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
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Lunas
                    </span>
                )}
                {payment.payment?.status === 'unpaid' && (
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                    Belum Lunas
                    </span>
                )}
                {payment.payment?.status === 'late' && (
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                    Terlambat
                    </span>
                )}
                {payment.payment?.status === 'partial' && (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
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
                  <button onClick={() => handleDeleteClick(payment.payment?.id)} className="text-red-600"><FaTimes /></button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white/90 rounded-lg p-6 w-96 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Konfirmasi Pembatalan Pembayaran</h3>
              <button onClick={closeDeleteModal} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alasan Pembatalan
              </label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={4}
                placeholder="Masukkan alasan pembatalan pembayaran..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Tutup
              </button>
              <button
                onClick={handleDelete}
                disabled={!deleteReason.trim()}
                className={`px-4 py-2 text-white rounded-md ${deleteReason.trim() ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300 cursor-not-allowed'}`}
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      <PaymentDetailModal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        payment={selectedPayment}
        invoice={selectedPayment}
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