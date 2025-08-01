import { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { paymentService } from '../service/paymentService';
import { invoiceService } from '@/feature/finance/service/invoiceService';
import { AppContext } from '@/context/AppContext';
import LoadingOverlay from '@/core/components/ui/loading_screen';
import { convertToRupiah } from '@/lib/utils';

export const PrintPayment = () => {

    const handlePrint = () => {
        document.title = `SLIP_PEMBAYARAN_${invoiceData?.code || 'unknown'}`;
        window.print();
    };

  const [searchParams] = useSearchParams();
  const idInvoice = searchParams.get('idInvoice');
  const idPayment = searchParams.get('idPayment');
  const { token } = useContext(AppContext);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (idInvoice && idPayment && token) {
          
          const invoiceResponse = await invoiceService.showDataById(idInvoice, token);
          console.log(invoiceResponse);
          const paymentResponse = await paymentService.showDataById(idPayment, token);
          
          // Periksa apakah response memiliki data dan tidak kosong
          if (invoiceResponse && Object.keys(invoiceResponse).length > 0 && 
              paymentResponse && Object.keys(paymentResponse).length > 0) {
            setPaymentData(paymentResponse);
            setInvoiceData(invoiceResponse);
          } else {
            console.error('Data tidak lengkap:', { invoiceResponse, paymentResponse });
            setPaymentData(null);
            setInvoiceData(null);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setPaymentData(null);
        setInvoiceData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idInvoice, idPayment, token]);

  if (loading) return <LoadingOverlay />;
  if (!paymentData || !invoiceData) return <div>Data tidak ditemukan</div>;

  return (
    <div className="p-4 print:p-0 flex justify-center">
    <div className="p-8 max-w-2xl w-full bg-white border border-black print:border print:border-black print:p-8" style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* Print Button - akan disembunyikan saat print */}
      <div className="text-right mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Cetak
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-center mb-6" style={{ fontFamily: 'Times New Roman, serif' }}>
        <img src="/school-logo.png" alt="Logo Sekolah" className="w-20 h-20 object-contain mr-4 print:mr-8" />
        <div className="text-center flex-1">
          <h1 className="text-xl font-bold">YAYASAN TA'MIRUL MASJID TEGALSARI</h1>
          <h2 className="text-lg">SD TA'MIRUL ISLAM SURAKARTA</h2>
          <h3>TAHUN PELAJARAN {new Date().getFullYear()}-{new Date().getFullYear() + 1}</h3>
        </div>
      </div>

      {/* Informasi Siswa */}
      <div className="mb-6 text-base" style={{ fontFamily: 'Times New Roman, serif' }}>
        <h2 className="text-lg font-bold mt-4 text-center">BUKTI PEMBAYARAN</h2> <br />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p>Telah Terima Dari</p>
            <p>Nama Siswa</p>
            <p>No Invoice</p>
            <p>No Pembayaran</p>
            <p>Guna Membayar</p>
            <p>Kelas</p>
            <p>Tanggal Pembayaran</p>
          </div>
          <div>
            <br />
            <p>: {invoiceData?.entity?.full_name}</p>
            <p>: {invoiceData?.code}</p>
            <p>: {paymentData?.code}</p>
            <p>: {invoiceData?.description || '-'}</p>
            <p>: {invoiceData?.student_class?.name} {invoiceData?.student_class?.part}</p>
            <p>: {new Date(paymentData?.payment_date).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long', 
              year: 'numeric'
            })}</p>
          </div>
        </div>
      </div>

      {/* Rincian Biaya */}
      <div className="mb-4 text-base">
        <div className="border-b-2 border-black font-semibold mb-2">
          <div className="grid grid-cols-5 gap-2 py-1">
            <div>No</div>
            <div>Nama Layanan</div>
            <div className="text-right">Harga Satuan</div>
            <div className="text-center">Frekuensi</div>
            <div className="text-right">Total</div>
          </div>
        </div>
        
        {invoiceData?.items?.map((item: any, index: number) => (
          <div key={index} className="grid grid-cols-5 gap-2 border-b border-gray-300 py-1">
            <div>{index + 1}</div>
            <div>{item.rate.service.name}</div>
            <div className="text-right">Rp {item.amount_rate?.toLocaleString()}</div>
            <div className="text-center">{item.frequency}</div>
            <div className="text-right">Rp {(item.amount_rate * item.frequency)?.toLocaleString()}</div>
          </div>
        ))}
      </div>
        
      {/* Payment Summary */}
      <div className="mb-4">
        <div className="grid grid-cols-[40%_60%] gap-2 text-base">
          <div className="space-y-2">
            <p>Jumlah Total</p>
            <p>Dibayarkan</p>
            <p>Terbilang</p>
            <p>Potongan</p>
            <p>Kekurangan</p>
            <p>Ket. Lunas</p>
          </div>
          <div className="space-y-2 text-left">
            <p className="flex justify-between">
              <span>:</span>
              <span>Rp {invoiceData?.total?.toLocaleString()}</span>
            </p>
            <p className="flex justify-between">
              <span>:</span>
              <span>Rp {paymentData?.total_payment?.toLocaleString()}</span>
            </p>
            <p className="italic flex justify-end">
              ({convertToRupiah(invoiceData?.total || 0)})
            </p>
            <p className="flex justify-between">
              <span>:</span>
              <span>Rp {paymentData?.grant_amount?.toLocaleString()}</span>
            </p>
            <p className="flex justify-between">
              <span>:</span>
              <span>Rp {(invoiceData?.total - paymentData?.total_payment)?.toLocaleString()}</span>
            </p>
            <p className="font-bold uppercase flex justify-end">
              {paymentData?.status === 'paid' ? 'LUNAS' :
               paymentData?.status === 'unpaid' ? 'BELUM LUNAS' :
               paymentData?.status === 'partial' ? 'SEBAGIAN' : 
               paymentData?.status}
            </p>
          </div>
        </div>
      </div>

      {/* Kotak Kurang */}
      {invoiceData?.total > paymentData?.total_payment && (
        <div className="mb-4">
          <p className="border border-black w-fit px-2 py-1 bg-yellow-200 text-base">
            <span className="font-bold">KURANG</span> Rp {(invoiceData?.total - paymentData?.nominal_payment)?.toLocaleString()}
          </p>
        </div>
      )}

      {/* Tanda Tangan */}
      <div className="grid grid-cols-2 mt-8 text-center text-base">
        <div>
          <p className="invisible">Surakarta,</p> {/* untuk menyamakan baris pertama */}
          <p>Pembayar,</p>
          <div className="h-16" />
          <p className="font-semibold underline">__________________</p>
          <p className="invisible">NIP.</p> {/* untuk menyamakan tinggi baris */}
        </div>
        <div>
          <p>Surakarta, {new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}</p>
          <p>Bendahara</p>
          <div className="h-16" />
          <p className="font-semibold underline">Muhammad Ridwan Yusuf, S.Ak.</p>
          <p>NIP.</p>
        </div>
      </div>


      <p className="mt-6 italic text-base">Nb. Harap disimpan.</p>
    </div>
    </div>
  );
};