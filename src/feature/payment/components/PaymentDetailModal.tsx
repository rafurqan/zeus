interface PaymentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: {
    payment?: {
      code?: string;
      nominal_payment: number;
      total_payment: number;
      payment_method?: string;
      status?: 'paid' | 'unpaid' | 'late' | 'partial';
      payment_date?: string;
      reference_number?: string;
      bank_name?: string;
      account_number?: string;
      account_name?: string;
      notes?: string;
    };
    code?: string;
    description?: string;
    total: number;
    publication_date?: string;
    entity?: {
      full_name?: string;
      nisn?: string;
      phone?: string;
    };
    student_class?: {
      name?: string;
    };
  };
  invoice: any; // Add proper type if needed
}

export const PaymentDetailModal = ({ isOpen, onClose, payment, invoice }: PaymentDetailModalProps) => {
    if (!isOpen || !payment) return null;

    console.log(payment);
    console.log(invoice);
  
    const formatDate = (dateStr: string | undefined) => {
      return dateStr ? new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric"
      }) : "-";
    };
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]">
          {/* Tombol Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg"
          >
            &times;
          </button>
  
          {/* Header */}
          <h2 className="text-xl font-semibold mb-1">Detail Pembayaran</h2>
          <p className="text-sm text-gray-500 mb-4">Informasi lengkap tentang pembayaran</p>
  
          {/* Informasi Utama */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Kolom 1 */}
            <div>
              <h3 className="font-semibold mb-2">Informasi Pembayaran</h3>
              <table className="text-sm text-gray-700 w-full">
                <tbody>
                  <tr>
                    <td className="py-1 font-semibold w-1/3">ID Pembayaran</td>
                    <td className="py-1">: {payment.payment?.code || "-"}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">ID Faktur</td>
                    <td className="py-1 whitespace-nowrap">: {payment.code || "-"}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">Deskripsi</td>
                    <td className="py-1">: {payment.description || "-"}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold whitespace-nowrap bg-orange-100">Jumlah Tagihan</td>
                    <td className="py-1 bg-orange-100">: Rp {payment.total.toLocaleString() || "-"}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold whitespace-nowrap bg-orange-100">Jumlah Bayar</td>
                    <td className="py-1 bg-orange-100">: Rp {payment.payment?.total_payment.toLocaleString() || "-"}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold bg-orange-100">Kekurangan</td>
                    <td className="py-1 bg-orange-100">: Rp {(payment.total - (payment.payment?.total_payment || 0)).toLocaleString() || "-"}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">Metode</td>
                    <td className="py-1">: {payment.payment?.payment_method || "-"}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">Status</td>
                    <td className="py-1">: {(() => {
                      const status = payment.payment?.status;
                      switch (status) {
                        case "partial":
                          return (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              Sebagian
                            </span>
                          );
                        case "late":
                          return (
                            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                              Terlambat
                            </span>
                          );
                        case "unpaid":
                          return (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              Belum Lunas
                            </span>
                          );
                        case "paid":
                          return (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              Lunas
                            </span>
                          );
                        default:
                          return (
                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                              {status || "-"}
                            </span>
                          );
                      }
                    })()}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">Tanggal Faktur</td>
                    <td className="py-1">: {formatDate(payment.publication_date)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">Tanggal Bayar</td>
                    <td className="py-1">: {formatDate(payment.payment?.payment_date)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold whitespace-nowrap">Nomor Referensi</td>
                    <td className="py-1">: {payment.payment?.reference_number || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
  
            {/* Kolom 2 */}
            <div>
              <h3 className="font-semibold mb-2">Informasi Siswa</h3>
              <table className="text-sm text-gray-700 w-full">
                <tbody>
                  <tr>
                    <td className="py-1 font-semibold w-1/3 bg-green-100">Nama</td>
                    <td className="py-1 bg-green-100">: {payment.entity?.full_name || "-"}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">NIS</td>
                    <td className="py-1">: {payment.entity?.nisn || "-"}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold w-1/3 bg-green-100">Kelas</td>
                    <td className="py-1 bg-green-100">: {payment.student_class?.name || "-"}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">No. Telepon</td>
                    <td className="py-1">: {payment.entity?.phone || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
  
          {/* Detail Transfer */}
          {payment.payment?.payment_method === 'Transfer' && (
            <div className="border rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-2">Detail Transfer</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 text-sm text-gray-700 gap-y-1">
                <p><strong>Bank:</strong> {payment.payment?.bank_name || "-"}</p>
                <p><strong>Tanggal Transfer:</strong> {formatDate(payment.payment?.payment_date)}</p>
                <p><strong>Nomor Rekening:</strong> {payment.payment?.account_number || "-"}</p>
                <p><strong>Nomor Referensi:</strong> {payment.payment?.reference_number || "-"}</p>
                <p><strong>Atas Nama:</strong> {payment.payment?.account_name || payment.entity?.full_name || "-"}</p>
              </div>
            </div>
          )}
  
          {/* Catatan */}
          <div className="mb-4">
            <label className="block font-semibold text-sm mb-1">Catatan</label>
            <div className="p-2 border rounded bg-gray-50 text-sm text-gray-700">
              {payment.payment?.notes || "-"}
            </div>
          </div>
  
          {/* Tombol Aksi */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded border text-sm text-gray-700 hover:bg-gray-100"
            >
              Tutup
            </button>
            {/* <button className="px-4 py-2 rounded border text-sm text-gray-700 hover:bg-gray-100">
              <i className="fab fa-whatsapp mr-1"></i> Kirim WhatsApp
            </button> */}
          </div>
        </div>
      </div>
    );
  };