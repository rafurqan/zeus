import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "@/context/AppContext";
import { FormInput } from "@/core/components/forms/formInput";
import { Button } from "@/core/components/ui/button";
import { billingService } from "@/feature/billing/service/billingService";
import { packageService } from "@/feature/billing/service/packageService";
import { invoiceService } from "@/feature/finance/service/invoiceService";
import BaseLayout from "@/core/components/baseLayout";
import { Billing } from "@/feature/billing/types/billing";
import { useConfirm } from "@/core/components/confirmDialog";
import { paymentService } from "../service/paymentService";
import { useStudentClass } from "@/feature/student/hooks/useStudentClass";
import { useGrant } from "@/feature/billing/hook/useGrant";
import { Grant } from "@/feature/billing/types/grant";

export const CreatePaymentForm = () => {
  const { confirm, ConfirmDialog } = useConfirm();
  const { token } = useContext(AppContext);
  useStudentClass();
  const [searchParams] = useSearchParams();
  const invoiceId = searchParams.get('id');
  const paymentId = searchParams.get('paymentId');
  const mode = searchParams.get('mode');
  const isEditMode = mode === 'edit';

  const [paymentMethod, setPaymentMethod] = useState("Tunai");
  const [paymentDate, setPaymentDate] = useState("");
  const [bankDetails, setBankDetails] = useState({
    bank_name: "",
    account_number: "",
    account_holder: "",
    reference_number: ""
  });
  const [paymentAmount, setPaymentAmount] = useState("");
  const [useGrantCheckbox, setUseGrantCheckbox] = useState(false);
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [grantAmount, setGrantAmount] = useState("");
  const { data: grants = [] } = useGrant();  // Pindahkan ini ke atas sebelum useEffect

  // Tambahkan useEffect untuk load data payment jika dalam mode edit
  useEffect(() => {
    const fetchPaymentData = async () => {
      if (isEditMode && paymentId && token) {
        try {
          const response = await paymentService.showDataById(paymentId, token);
          const payment = response;

          if (payment) {
            setPaymentMethod((payment as any).payment_method);
            setPaymentAmount((payment as any).nominal_payment.toString());

            setBankDetails({
              bank_name: (payment as any).bank_name || "",
              account_number: (payment as any).account_number || "",
              account_holder: (payment as any).account_name || "",
              reference_number: (payment as any).reference_number || ""
            });

            setForm(prev => ({
              ...prev,
              notes: (payment as any).notes || ""
            }));

            const paymentDate = (payment as any).payment_date.split(' ')[0];
            setPaymentDate(paymentDate);

            if ((payment as any).use_grant) {
              setUseGrantCheckbox(true);
              setGrantAmount((payment as any).grant_amount?.toString() || "");
              // Tunggu sampai grants tersedia sebelum mencoba mencari grant yang sesuai
              if (grants.length > 0) {
                const grant = grants.find(g => g.id === (payment as any).id_grant);
                setSelectedGrant(grant || null);
              }
            }
          }
        } catch (error) {
          console.error("Gagal memuat data pembayaran:", error);
          await confirm({
            title: "Error",
            message: "Gagal memuat data pembayaran. Silakan coba lagi.",
            confirmText: "OK",
            cancelText: "",
          });
        }
      }
    };

    fetchPaymentData();
  }, [isEditMode, paymentId, token, grants]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const numericPaymentAmount = parseInt(paymentAmount) || 0;
      const numericGrantAmount = useGrantCheckbox ? (parseInt(grantAmount) || 0) : 0;
      const totalPayment = numericPaymentAmount + numericGrantAmount;

      const paymentData = {
        invoice_id: invoiceId,
        payment_method: paymentMethod,
        payment_amount: numericPaymentAmount,
        payment_date: new Date().toISOString().split('T')[0],
        notes: (form as any).notes,
        bank_details: paymentMethod === "Transfer" ? {
          bank_name: bankDetails.bank_name,
          account_number: bankDetails.account_number,
          account_holder: bankDetails.account_holder,
          reference_number: bankDetails.reference_number
        } : null,
        id_grant: selectedGrant?.id,
        nominal_payment: numericPaymentAmount,
        grant_amount: numericGrantAmount,
        total_payment: totalPayment,
        use_grant: useGrantCheckbox
      };

      if (isEditMode && paymentId) {
        await paymentService.update(token as string, {
          id: paymentId,
          ...paymentData,
          total: totalBill,
          due_date: form.due_date
        });
      } else {
        await paymentService.create(token as string, {
          id: "",
          total: totalBill,
          due_date: form.due_date,
          ...paymentData
        });
      }

      await confirm({
        title: "Sukses",
        message: `Pembayaran berhasil ${isEditMode ? 'diperbarui' : 'disimpan'}!`,
        confirmText: "OK",
        cancelText: "",
      });

      setTimeout(() => {
        navigate('/payment/paymentData');
      }, 1000);
    } catch (error) {
      console.error("Gagal menyimpan pembayaran:", error);
      await confirm({
        title: "Error",
        message: `Gagal ${isEditMode ? 'memperbarui' : 'menyimpan'} pembayaran. Silakan coba lagi.`,
        confirmText: "OK",
        cancelText: "",
      });
    }
  };
  // const navigate = useNavigate();
  const [form, setForm] = useState({
    invoice_number: "",
    student_name: "",
    class: "",
    class_name: "",
    part_class: "",
    issue_date: "",
    due_date: "",
    student_type: "",
    selected_items: [] as Billing[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [] = await Promise.all([
          billingService.getAll(token as string),
          packageService.getAll(token as string),
        ]);
      } catch (error) {
        console.error("Gagal memuat data tagihan dan paket:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleCancel = async () => {
    const isConfirmed = await confirm({
      title: "Konfirmasi Batal",
      message: "Formulir akan di-reset. Yakin ingin kembali?",
      confirmText: "Ya, Lanjutkan",
      cancelText: "Tidak",
    });
    if (isConfirmed) {
      window.history.back();
    }
  };

  const navigate = useNavigate();

  // Tambahkan useEffect untuk memuat data invoice jika ada ID
  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (invoiceId && token) {
        try {
          const invoiceData = await invoiceService.showDataById(invoiceId, token);
          if (invoiceData) {
            const formatDate = (dateString: string | null) => {
              if (!dateString) return "";
              return dateString.split(' ')[0];
            };
            // Rebuild selected_items from invoice.items
            const selectedItemsFromItems = (invoiceData as any).items.map((item: { rate: { id: number; service: { id: number; name: string; }; category: string; description: string; }; amount_rate: number; frequency: number; }) => ({
              id: item.rate.id,
              rate_id: item.rate.id,
              service_id: item.rate.service.id,
              service_name: item.rate.service.name,
              category: item.rate.category,
              description: item.rate.description,
              price: item.amount_rate,
              frequency: item.frequency,
            }));

            setForm({
              ...form,
              invoice_number: invoiceData.code,
              student_name: (invoiceData as any).entity?.full_name || "",
              ...(((invoiceData as any).entity?.registration_code ? { registration_code: (invoiceData as any).entity.registration_code } : {}) as any),
              class: (invoiceData as any).student_class?.id || "",
              class_name: (invoiceData as any).student_class?.name || "",
              part_class: (invoiceData as any).student_class?.part || "",
              issue_date: formatDate((invoiceData as any).publication_date),
              due_date: formatDate((invoiceData as any).due_date),
              student_type: invoiceData.entity_type === "App\\Models\\Student" ? "Siswa" :
                invoiceData.entity_type === "App\\Models\\ProspectiveStudent" ? "Calon Siswa" : "",
              invoice_type: invoiceData.invoice_type || "",
              selected_items: selectedItemsFromItems,
            });

            // Set item frequencies dari items
            const frequencies: Record<string, number> = {};
            (invoiceData as any).items.forEach((item: { rate_id: number; frequency: number; }) => {
              if (item.rate_id) {
                frequencies[item.rate_id] = item.frequency;
              }
            });

          }
        } catch (error) {
          console.error("Gagal memuat data invoice:", error);
          alert("Gagal memuat data invoice");
        }
      }
    };

    fetchInvoiceData();
  }, [invoiceId, token]);

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const handleBankDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPaymentAmount(value);
  };

  const handleGrantAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numericValue = parseInt(value) || 0;

    if (selectedGrant && numericValue > selectedGrant.total_funds) {
      setGrantAmount(selectedGrant.total_funds.toString());
      // Sesuaikan pembayaran wali siswa
      const remainingPayment = Math.max(0, totalBill - selectedGrant.total_funds);
      setPaymentAmount(remainingPayment.toString());
    } else {
      setGrantAmount(value);
      // Sesuaikan pembayaran wali siswa
      const remainingPayment = Math.max(0, totalBill - numericValue);
      setPaymentAmount(remainingPayment.toString());
    }
  };

  const handleGrantCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseGrantCheckbox(e.target.checked);
    if (!e.target.checked) {
      setSelectedGrant(null);
      setGrantAmount("");
      // Reset pembayaran wali siswa ke total tagihan
      setPaymentAmount(totalBill.toString());
    } else {
      // Jika checkbox dicentang, set pembayaran wali siswa ke total tagihan dulu
      setPaymentAmount(totalBill.toString());
    }
  };

  const handleGrantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const grant = grants.find(g => g.id === selectedId);
    setSelectedGrant(grant || null);
    setGrantAmount("");
    // Reset pembayaran wali siswa ke total tagihan saat ganti dana hibah
    setPaymentAmount(totalBill.toString());
  };
  const totalBill = (form as any).selected_items.reduce((sum: number, item: { price: number; frequency: number; }) => sum + item.price * item.frequency, 0);
  const numericPaymentAmount = parseInt(paymentAmount) || 0;
  const numericGrantAmount = parseInt(grantAmount) || 0;
  const totalPayment = numericPaymentAmount + numericGrantAmount;
  const paymentDifference = totalPayment - totalBill;

  return (
    <BaseLayout>
      <div className="p-6 flex flex-col gap-6">
        <div
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 cursor-pointer mb-2 hover:underline"
        >
          &larr; Kembali
        </div>
        <div>
          <h2 className="text-2xl font-bold">Pembayaran Faktur {form.invoice_number}</h2>
        </div>

        {/* detail invoice */}
        <div className="w-full">
          <div className="w-full max-w-20xl mx-auto">
            <div className="bg-white rounded-lg border p-4 flex justify-between items-start w-full">
              <table className="text-sm">
                <tbody>
                  <tr>
                    <td className="text-gray-600 pr-4"><b>Tipe Siswa</b></td>
                    <td className="text-gray-600">: {form.student_type}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-600 pr-4"><b>Nama Siswa</b></td>
                    <td className="text-gray-600">: {form.student_name}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-600 pr-4"><b>No. Registrasi</b></td>
                    <td className="text-gray-600">: {(form as any).registration_code}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-600 pr-4"><b>Kelas</b></td>
                    <td className="text-gray-600">: {form.class_name} {form.part_class}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-600 pr-4 align-top"><b>Jatuh Tempo</b></td>
                    <td className="text-gray-600">:
                      <span className={`${new Date(form.due_date) < new Date(new Date().toDateString()) ? 'bg-red-400 text-white text-xs font-semibold px-3 py-1 rounded-full' : 'text-gray-500'}`}>
                        {new Date(form.due_date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Item Tagihan yang Ditambahkan */}
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-xl font-bold mb-1">Detail Pembayaran</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-sm text-gray-500">
                  <th className="px-2 py-1 rounded-l">Item</th>
                  <th className="px-2 py-1">Kategori</th>
                  <th className="px-2 py-1">Deskripsi</th>
                  <th className="px-2 py-1">Subtotal</th>
                  <th className="px-2 py-1">Frekuensi</th>
                  <th className="px-2 py-1 rounded-r">Total</th>
                </tr>
              </thead>
              <tbody>
                {form.selected_items.map(item => (
                  <tr key={item.id} className="bg-white shadow-sm">
                    <td className="px-2 py-2 rounded-l">{item.service_name}</td>
                    <td className="px-2 py-2">
                      {item.category === "1" && "Registrasi"}
                      {item.category === "2" && "Buku"}
                      {item.category === "3" && "Seragam"}
                      {item.category === "4" && "SPP"}
                      {item.category === "5" && "Uang Gedung"}
                      {item.category === "6" && "Kegiatan"}
                      {item.category === "7" && "Ujian"}
                      {item.category === "8" && "Wisuda"}
                      {item.category === "9" && "Lainnya"}
                    </td>
                    <td className="px-2 py-2">{item.description}</td>
                    <td className="px-2 py-2 whitespace-nowrap">Rp {item.price.toLocaleString('id-ID', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}</td>
                    <td className="px-2 py-2 text-center">{item.frequency}</td>
                    <td className="px-2 py-2 whitespace-nowrap rounded-r">
                      Rp {(item.price * (item as any).frequency * 1).toLocaleString('id-ID', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      })}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4}></td>
                  <td className="font-semibold text-right pr-2 rounded-l">Subtotal:</td>
                  <td className="text-left pr-2 rounded-r">
                    Rp {form.selected_items.reduce((sum, item) => sum + item.price * (item as any).frequency * 1, 0).toLocaleString('id-ID', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}
                  </td>
                </tr>
                <tr>
                  <td colSpan={4}></td>
                  <td className="font-bold text-right pr-2 rounded-l">Total: </td>
                  <td className="font-bold text-left pr-2 rounded-r">
                    Rp {form.selected_items.reduce((sum, item) => sum + item.price * (item as any).frequency * 1, 0).toLocaleString('id-ID', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Pembayaran */}
        <div className="w-full">
          <div className="w-full">
            <div className="bg-white rounded-lg border p-6 space-y-6">
              {/* Nominal Pembayaran */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="text-md font-semibold">Nominal Pembayaran</h3>

                {/* Dana Hibah */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useGrantCheckbox}
                    onChange={handleGrantCheckboxChange}
                  />
                  <span>Gunakan Dana Hibah untuk Sisa Pembayaran</span>
                </div>

                {useGrantCheckbox && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1">Pilih Dana Hibah</label>
                      <select
                        className="w-full border rounded px-3 py-2"
                        value={selectedGrant?.id || ""}
                        onChange={handleGrantChange}
                      >
                        <option value="">Pilih dana hibah</option>
                        {grants.map(grant => (
                          <option key={grant.id} value={grant.id}>
                            {grant.grants_name} (Rp {grant.total_funds.toLocaleString('id-ID', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            })})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Jumlah Dana Hibah</label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        placeholder="Masukkan jumlah dana hibah"
                        value={grantAmount ? `Rp ${parseInt(grantAmount).toLocaleString()}` : ""}
                        onChange={handleGrantAmountChange}
                      />
                      {selectedGrant && (
                        <div className="text-sm text-gray-600 mt-1">
                          Sisa dana hibah: Rp {selectedGrant.total_funds.toLocaleString('id-ID', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Pembayaran Wali Siswa */}
                <div>
                  <label className="block text-sm mb-1">Pembayaran Wali Siswa</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Masukkan jumlah pembayaran dari wali siswa"
                    value={paymentAmount ? `Rp ${parseInt(paymentAmount).toLocaleString()}` : ""}
                    onChange={handlePaymentChange}
                  />
                </div>
                {/* Informasi Pembayaran */}
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Total tagihan: Rp {totalBill.toLocaleString()}</div>
                  {paymentDifference > 0 && (
                    <div className="text-sm text-green-500">
                      Kembalian: Rp {paymentDifference.toLocaleString()}
                    </div>
                  )}
                  {paymentDifference === 0 && totalPayment > 0 && (
                    <div className="text-sm text-green-500">
                      Pembayaran sudah sesuai
                    </div>
                  )}
                </div>
                {paymentDifference < 0 && (
                  <div className="text-sm text-red-500">
                    Pembayaran kurang: Rp {Math.abs(paymentDifference).toLocaleString()}
                  </div>
                )}
                {paymentDifference > 0 && (
                  <div className="text-sm text-green-500">
                    Kembalian: Rp {paymentDifference.toLocaleString()}
                  </div>
                )}
                <div className="bg-gray-50 p-4 rounded space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pembayaran Wali Siswa:</span>
                    <span>Rp {numericPaymentAmount.toLocaleString()}</span>
                  </div>
                  {useGrantCheckbox && numericGrantAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Dana Hibah:</span>
                      <span>Rp {numericGrantAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total Pembayaran:</span>
                    <span>Rp {totalPayment.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Metode & Tanggal */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold mb-2">Metode Pembayaran</h3>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="metode"
                        value="Tunai"
                        checked={paymentMethod === "Tunai"}
                        onChange={handlePaymentMethodChange}
                      />
                      <span>Tunai</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="metode"
                        value="Transfer"
                        checked={paymentMethod === "Transfer"}
                        onChange={handlePaymentMethodChange}
                      />
                      <span>Transfer Bank</span>
                    </label>
                  </div>
                </div>

                <div>
                  <FormInput
                    label="Tanggal Pembayaran"
                    type="date"
                    value={paymentDate || (!isEditMode ? new Date().toISOString().split('T')[0] : '')}
                    onChange={(e) => setPaymentDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Detail Transfer Bank */}
              {paymentMethod === "Transfer" && (
                <div className="border rounded-lg p-4 space-y-4 mt-4">
                  <h3 className="text-md font-semibold">Detail Transfer Bank</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-1">Nama Bank</label>
                        <select
                          name="bank_name"
                          className="w-full border rounded px-3 py-2"
                          value={bankDetails.bank_name}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleBankDetailsChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
                        >
                          <option value="">Pilih Bank</option>
                          <option value="BCA">Bank Central Asia (BCA)</option>
                          <option value="BNI">Bank Negara Indonesia (BNI)</option>
                          <option value="BRI">Bank Rakyat Indonesia (BRI)</option>
                          <option value="Mandiri">Bank Mandiri</option>
                          <option value="BSI">Bank Syariah Indonesia (BSI)</option>
                          <option value="CIMB">CIMB Niaga</option>
                          <option value="Permata">Bank Permata</option>
                          <option value="BTN">Bank Tabungan Negara (BTN)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Nama Pemilik Rekening</label>
                        <input
                          type="text"
                          name="account_holder"
                          className="w-full border rounded px-3 py-2"
                          placeholder="Masukkan nama pemilik rekening"
                          value={bankDetails.account_holder}
                          onChange={handleBankDetailsChange}
                        />
                      </div>
                      <p className="text-gray-500 text-sm">Contoh: Nomor transaksi, kode pembayaran, atau nomor virtual account</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-1">Nomor Rekening</label>
                        <input
                          type="text"
                          name="account_number"
                          className="w-full border rounded px-3 py-2"
                          placeholder="Masukkan nomor rekening"
                          value={bankDetails.account_number}
                          onChange={handleBankDetailsChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Nomor Referensi</label>
                        <input
                          type="text"
                          name="reference_number"
                          className="w-full border rounded px-3 py-2"
                          placeholder="Masukkan nomor referensi"
                          value={bankDetails.reference_number}
                          onChange={handleBankDetailsChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Catatan */}
              <div>
                <label className="block text-sm mb-1 font-semibold">Catatan</label>
                <textarea
                  name="notes"
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  placeholder="Catatan tambahan"
                  value={(form as any).notes}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
          >
            Batal
          </Button>
          <Button
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
            onClick={handleSubmit}
          >
            {isEditMode ? 'Simpan Perubahan' : 'Bayar'}
          </Button>
        </div>
      </div>
      {ConfirmDialog}
    </BaseLayout>
  );
};