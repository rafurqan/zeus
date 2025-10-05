import { useContext, useEffect, useState, useMemo } from "react";
import { AppContext } from "@/context/AppContext";
import { Billing } from "@/feature/billing/types/billing";
import { billingService } from "@/feature/billing/service/billingService";
import { useConfirm } from "@/core/components/confirmDialog";
import { FormInput } from "@/core/components/forms/formInput";
import { FormSelect } from "@/core/components/forms/formSelect";
import { DollarSign } from "lucide-react";
import { useProgram } from "@/feature/master/hook/useProgram";

type BillingPackage = {
  id: string;
  name: string;
  service_name: string;
  service_id?: string;
  price: number;
  program_id: string;
  description: string;
  rates: string[];
  discount: number;
  is_active: "Y" | "N";
  isActiveCheckbox?: boolean;
  category: string;
  child_ids?: string[];
};

type Props = {
  item?: BillingPackage | null;
  onClose: () => void;
  onSuccess: (item: BillingPackage) => void;
};

export default function BillingPackageForm({ item = null, onClose, onSuccess }: Props) {
  const isEdit = !!item;
  const { confirm, ConfirmDialog } = useConfirm();
  const { token } = useContext(AppContext);

  const { data: programs } = useProgram();
  const [rates, setRates] = useState<Billing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading] = useState(false);

  const [form, setForm] = useState<BillingPackage>(() => {
    const initialRates = item?.child_ids || [];
    return {
      id: item?.id || "",
      name: item?.name || "",
      service_name: item?.service_name || "",
      price: item?.price || 0,
      program_id: item?.program_id || "",
      description: item?.description || "",
      rates: initialRates,
      discount: item?.discount || 0,
      is_active: item?.is_active || "Y",
      isActiveCheckbox: item ? item.is_active === "Y" : true,
      category: item?.category || "",
      service_id: item?.service_id || "",
    };
  });

  useEffect(() => {
    if (token) {
      fetchRates();
    }
  }, [token]);

  useEffect(() => {
    // Update price jika rates berhasil di-load ulang (misal saat edit)
    if (rates.length && form.rates.length) {
      const total = calculateTotalPrice(form.rates);
      setForm(prev => ({ ...prev, price: total }));
    }
  }, [rates]);

  useEffect(() => {
    if (rates.length && item && Array.isArray(item.rates)) {
      const validRates = item.rates.filter(rateId =>
        rates.some(rate => rate.id === rateId)
      );

      const totalPrice = calculateTotalPrice(validRates);

      setForm(prev => ({
        ...prev,
        rates: validRates,
        price: totalPrice,
      }));
    }
  }, [rates, item]);

  // Update useEffect yang menghitung harga dari rates dan form.rates agar sinkron:
  useEffect(() => {
    if (form.rates.length && rates.length) {
      const total = calculateTotalPrice(form.rates);
      if (total !== form.price) {
        setForm(prev => ({ ...prev, price: total }));
      }
    }
  }, [form.rates, rates]);



  const fetchRates = async () => {
    try {
      // Gunakan getAllWithPagination dengan parameter default
      const response = await billingService.getAllWithPagination(token!, 1, 100, "");
      // Ambil data dari response.data.data (sesuai struktur paginasi)
      setRates(response.data.data);
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({
        ...prev,
        isActiveCheckbox: checked,
        is_active: checked ? "Y" : "N"
      }));
    } else if (name === 'discount') {
      const numValue = parseFloat(value) || 0;
      setForm(prev => ({ ...prev, [name]: numValue }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const calculateTotalPrice = (selectedIds: string[]) => {
    return rates
      .filter(rate => selectedIds.includes(rate.id))
      .reduce((sum, rate) => sum + rate.price, 0);
  };

  const handleRateToggle = (rateId: string) => {
    const updatedRates = form.rates.includes(rateId)
      ? form.rates.filter(id => id !== rateId)
      : [...form.rates, rateId];

    setForm(prev => ({
      ...prev,
      rates: updatedRates,
      price: calculateTotalPrice(updatedRates),
    }));
  };

  const handleSubmit = async () => {
    const isConfirmed = await confirm({
      title: isEdit ? "Perbaharui Data" : "Submit Data",
      message: `Apakah Anda yakin ingin ${isEdit ? "memperbarui" : "menambahkan"} paket biaya ini?`,
      confirmText: "Ya, Lanjutkan",
      cancelText: "Batal",
    });

    if (isConfirmed) {
      try {
        await onSuccess(form);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

  // Item Biaya
  const filteredRates = rates.filter(
    rate =>
      rate.is_active === 'Y' &&
      (rate.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rate.program?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedRates = useMemo(() => {
    return rates.filter((rate) => form.rates.includes(rate.id));
  }, [form.rates, rates]);

  const totalPrice = useMemo(() => {
    return selectedRates.reduce((sum, rate) => sum + rate.price, 0);
  }, [selectedRates]);
  // end item biaya

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold">
              {isEdit ? 'Edit Paket Biaya' : 'Tambah Paket Biaya'}
            </h2>
            <p className="text-sm text-gray-500">Tambahkan paket biaya baru</p>
          </div>
          <button onClick={onClose} className="text-gray-500 text-xl">×</button>
        </div>
        {/* hidden category */}
        <input
          type="hidden"
          name="category"
          value={form.category}
          onChange={handleChange}
        />
        {/* end  */}
        <div className="space-y-4">
          <FormInput
            label={<>Nama Paket <span className="text-red-500">*</span></>}
            name="service_name"
            placeholder="Contoh: Paket Siswa Baru SD"
            value={form.service_name}
            onChange={handleChange}
          />

          <FormSelect
            label="Program *"
            name="program_id"
            value={form.program_id}
            options={programs.map(program => ({ value: program.id, label: program.name }))}
            onChange={handleChange}
          />

          <FormInput
            label="Deskripsi"
            name="description"
            placeholder="Deskripsi paket biaya"
            value={form.description}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                Item Biaya <span className="text-red-500">*</span>
              </span>
            </label>

            {/* // item biaya */}
            <input
              type="text"
              placeholder="Cari item biaya..."
              className="w-full px-3 py-2 border rounded-lg mb-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="space-y-2 max-h-48 overflow-y-auto rounded-lg border border-gray-200 p-2">
              {filteredRates.map(rate => (
                <label
                  key={rate.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.rates?.includes(rate.id)}
                      onChange={() => handleRateToggle(rate.id)}
                      className="h-4 w-4 text-gray-600 rounded border-gray-300"
                    />
                    <span>{rate.service_name} ({rate.program})</span>
                  </div>
                  <span className="text-gray-600">Rp {rate.price.toLocaleString()}</span>
                </label>
              ))}
            </div>
            {selectedRates.length > 0 && (
              <div className="mt-3 text-sm text-red-600 space-y-1">
                {selectedRates.map((rate, index) => (
                  <div key={rate.id}>
                    {index + 1}. {rate.service_name} Rp {rate.price.toLocaleString()}
                  </div>
                ))}
                <div className="font-semibold mt-1">
                  Total Tarif: Rp {totalPrice.toLocaleString()}
                </div>
              </div>
            )}
          </div>
          {/* end item biaya */}

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActiveCheckbox}
              onChange={handleChange}
              className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <span className="text-sm font-medium text-gray-700">Aktif</span>
          </label>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
            >
              Simpan
            </button>
          </div>
        </div>

        {ConfirmDialog}
      </div>
    </div>
  );
}
