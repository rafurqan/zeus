import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import { invoiceService } from "../service/invoiceService";
import BaseLayout from "@/core/components/baseLayout";

const InvoiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!token || !id) return;
      try {
        const data = await invoiceService.showDataById(id, token);
        setInvoice(data as any);
      } catch (error) {
        setInvoice(null);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id, token]);

  if (loading) return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <svg
          className="animate-spin h-10 w-10 text-blue-500 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <p className="text-gray-700 font-medium">Memuat detail faktur...</p>
      </div>
    </div>
  );

  if (!invoice) return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
        <svg
          className="h-16 w-16 text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-gray-700 font-medium">Faktur tidak ditemukan</p>
      </div>
    </div>
  );

  const totalAmount = (invoice as any).items?.reduce(
    (sum: number, item: { amount_rate: number; frequency: number }) => sum + item.amount_rate * item.frequency,
    0
  );

  return (
    <BaseLayout>
      <div className="w-full px-6 py-6">
        <div
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 cursor-pointer mb-2 hover:underline"
        >
          &larr; Kembali
        </div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Detail Faktur {(invoice as any).code}</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Kiri */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold mb-4">Informasi Faktur</h2>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-semibold w-1/3">Nomor Faktur</td>
                    <td className="py-2">: {(invoice as any).code}</td>
                    <td className="py-2 font-semibold w-1/3">Siswa</td>
                    <td className="py-2">: {(invoice as any).entity?.full_name}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-semibold">Tanggal Terbit</td>
                    <td className="py-2">: {new Date((invoice as any).publication_date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</td>
                    <td className="py-2 font-semibold">NIS</td>
                    <td className="py-2">: {(invoice as any).entity?.nis || '-'}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-semibold">Jatuh Tempo</td>
                    <td className="py-2">: {new Date((invoice as any).due_date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</td>
                    <td className="py-2 font-semibold">Kelas</td>
                    <td className="py-2">: {(invoice as any).student_class?.name}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-semibold">Status</td>
                    <td className="py-2">: <span className={`rounded px-2 ${
                      (invoice as any).status === 'unpaid' 
                        ? 'bg-red-200 text-red-800'
                        : (invoice as any).status === 'paid'
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-yellow-200 text-yellow-800'
                    }`}>{
                      (invoice as any).status === 'unpaid' 
                        ? 'Belum Lunas'
                        : (invoice as any).status === 'paid'
                        ? 'Lunas'
                        : 'Sebagian'
                    }</span></td>
                    <td className="py-2 font-semibold">Tipe</td>
                    <td className="py-2">: Siswa Reguler</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-semibold">Jenis Tagihan</td>
                    <td className="py-2">: Bulanan</td>
                    <td className="py-2 font-semibold">Bulan</td>
                    <td className="py-2">: April</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Catatan</td>
                    <td className="py-2 italic" colSpan={3}>: {(invoice as any).notes}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold mb-4">Item Tagihan</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Item</th>
                    <th>Kategori</th>
                    <th>Deskripsi</th>
                    <th className="text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {(invoice as any).items?.map((item: any) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">{item.rate?.service?.name}</td>
                      <td>{(item.rate?.category as any) || '-'}</td>
                      <td>{item.rate?.description}</td>
                      <td className="text-right">Rp {(
                        item.amount_rate * item.frequency
                      ).toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} className="text-right font-semibold py-2">Subtotal:</td>
                    <td className="text-right font-semibold">Rp {totalAmount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-right font-bold py-2">Total:</td>
                    <td className="text-right font-bold">Rp {totalAmount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Kanan */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold mb-4">Informasi Pembayaran</h2>
              <div className="bg-yellow-100 text-yellow-800 p-4 rounded text-sm mb-4">
                <p>Faktur ini jatuh tempo pada {" "}
                {new Date((invoice as any).due_date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</p>
              </div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="font-semibold">Total Tagihan:</span>
                <span className="font-bold text-lg">Rp {totalAmount.toLocaleString()}</span>
              </div>
              <div className="mb-4">
                <b>Status:</b> <span className={`font-semibold ${
                  (invoice as any).status === 'unpaid'
                    ? 'text-red-600'
                    : (invoice as any).status === 'paid'
                    ? 'text-green-600'
                    : 'text-yellow-600'
                }`}>
                  {(invoice as any).status === 'unpaid'
                    ? 'Belum Lunas'
                    : (invoice as any).status === 'paid'
                    ? 'Lunas'
                    : 'Sebagian'}
                </span>
              </div>
              <div className="text-sm">
                <p className="mb-1"><b>Instruksi Pembayaran:</b></p>
                <ol className="list-decimal ml-6 space-y-1">
                  <li>Transfer ke rekening bank sekolah:</li>
                  <li><span className="ml-2">Bank Central Asia (BCA)</span></li>
                  <li><span className="ml-2">No. Rekening: 1234567890</span></li>
                  <li><span className="ml-2">Atas Nama: Sekolah Keuangan</span></li>
                  <li>Sertakan nomor faktur ({(invoice as any).code}) pada keterangan transfer</li>
                  <li>Simpan bukti pembayaran</li>
                  <li>Konfirmasi pembayaran ke bagian keuangan sekolah</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default InvoiceDetailPage;
