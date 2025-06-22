import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import { invoiceService } from "../service/invoiceService";
import BaseLayout from "@/core/components/baseLayout";
import { Button } from "@/core/components/ui/button";

const categoryMap = {
  "1": "Registrasi",
  "2": "Buku",
  "3": "Seragam",
  "4": "SPP",
  "5": "Uang Gedung",
  "6": "Kegiatan",
  "7": "Ujian",
  "8": "Wisuda",
  "9": "Lainnya"
};

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
        setInvoice(data);
      } catch (error) {
        setInvoice(null);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id, token]);

  if (loading) return <div>Memuat detail faktur...</div>;
  if (!invoice) return <div>Faktur tidak ditemukan.</div>;

  const totalAmount = invoice.items?.reduce(
    (sum, item) => sum + item.amount_rate * item.frequency,
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
          <h1 className="text-2xl font-bold">Detail Faktur {invoice.code}</h1>
          <Button variant="outline">Cetak Invoice</Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Kiri */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold mb-4">Informasi Faktur</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><b>Nomor Faktur:</b> {invoice.code}</div>
                <div><b>Siswa:</b> {invoice.entity?.full_name}</div>
                <div><b>Tanggal Terbit:</b> {new Date(invoice.publication_date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</div>
                <div><b>NIS:</b> {invoice.entity?.nis || '-'}</div>
                <div><b>Jatuh Tempo:</b> {new Date(invoice.due_date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}</div>
                <div><b>Kelas:</b> {invoice.student_class?.name}</div>
                <div><b>Status:</b> <span className="bg-yellow-200 text-yellow-800 rounded px-2">Menunggu</span></div>
                <div><b>Tipe:</b> Siswa Reguler</div>
                <div><b>Jenis Tagihan:</b> Bulanan</div>
                <div><b>Bulan:</b> April</div>
                <div className="md:col-span-2"><b>Catatan:</b> <i>{invoice.notes}</i></div>
              </div>
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
                  {invoice.items?.map(item => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">{item.rate?.service?.name}</td>
                      <td>{categoryMap[item.rate?.category] || '-'}</td>
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
                <p><b>Faktur belum dibayar</b></p>
                <p>Faktur ini jatuh tempo pada {" "}
                {new Date(invoice.due_date).toLocaleDateString('id-ID', {
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
                <b>Status:</b> <span className="text-yellow-600 font-semibold">Menunggu</span>
              </div>
              <div className="text-sm">
                <p className="mb-1"><b>Instruksi Pembayaran:</b></p>
                <ol className="list-decimal ml-6 space-y-1">
                  <li>Transfer ke rekening bank sekolah:</li>
                  <li><span className="ml-2">Bank Central Asia (BCA)</span></li>
                  <li><span className="ml-2">No. Rekening: 1234567890</span></li>
                  <li><span className="ml-2">Atas Nama: Sekolah Keuangan</span></li>
                  <li>Sertakan nomor faktur ({invoice.code}) pada keterangan transfer</li>
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
