import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { FormInput } from "@/core/components/forms/formInput";
import { FormSelect } from "@/core/components/forms/formSelect";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { useConfirm } from "@/core/components/confirmDialog";
import { FileText, Tag, Home, DollarSign, Calendar, Users } from "lucide-react"; // Import icons
import { useGrant } from "../hook/useGrant"; // Pastikan path sesuai


interface GrantFormProps {
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function GrantForm({ item, onClose, onSuccess }: GrantFormProps) {
  const { confirm, ConfirmDialog } = useConfirm();
  const [form, setForm] = useState({
    grants_name: item?.grants_name || "",
    donor_name: item?.donor_name || "",
    donation_type: item?.donation_type || "",
    description: item?.description || "",
    total_funds: item?.total_funds || 0,
    created_at: item?.created_at ? new Date(item.created_at).toISOString().split('T')[0] : "",
    acceptance_date: item?.acceptance_date? new Date(item.acceptance_date).toISOString().split('T')[0] : "",
    notes: item?.notes || "",
    code: item?.code || "",
    is_active: item?.is_active || "Y",
    isActiveCheckbox: item ? item.is_active === "Y" : true // Set default true untuk form baru
});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      setForm({
        ...form,
        isActiveCheckbox: checked,
        is_active: checked ? "Y" : "N" // Konversi boolean ke "Y"/"N"
      });
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const TipeDonatur = [
    { value: "1", label: "Individu" },
    { value: "2", label: "Organisasi" },
    { value: "3", label: "Kelompok" }
  ];

  const [errors, setErrors] = useState({
    grants_name: "",
    donation_type: "",
    total_funds: "",
    created_at: "",
    grant_expiration_date: ""
  });


  const validateForm = () => {
    const newErrors = {
      grants_name: !form.grants_name ? "Nama Dana Hibah harus diisi" : "",
      donation_type: !form.donation_type ? "Nama Donatur harus diisi" : "",
      total_funds: form.total_funds <= 0 ? "Jumlah harus lebih dari 0" : "",
      acceptance_date: !form.acceptance_date ? "Tanggal Diterima harus diisi" : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const { create, update } = useGrant();

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (!validateForm()) {
          return;
      }
  
      try {
          const confirmed = await confirm({
              title: "Konfirmasi Simpan",
              message: "Apakah Anda yakin ingin menyimpan data dana hibah ini?",
              confirmText: "Simpan",
              cancelText: "Batal"
          });
  
          if (confirmed) {
              const payload = {
                  ...form,
                  total_funds: Number(form.total_funds),
                  is_active: form.isActiveCheckbox ? "Y" : "N"
              };
  
              if (item) {
                  await update({ ...item, ...payload });
              } else {
                  await create(payload as Grant);
              }
  
              onClose();
              onSuccess();
          }
      } catch (error) {
          console.error("Error submitting grant:", error);
      }
  };


  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Tambah Dana Hibah</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Nama Dana Hibah"
              name="grants_name"
              value={form.grants_name}
              onChange={handleChange}
              placeholder="Contoh: Donasi Yayasan ABC"
              error={errors.grants_name}
              required
            />

            <FormInput
              label="Nama Donatur"
              name="donor_name"
              value={form.donor_name}
              onChange={handleChange}
              placeholder="Contoh: Yayasan ABC"
              error={errors.donor_name}
              required
            />

            <FormSelect
              label="Tipe Donatur"
              name="donation_type"
              value={form.donation_type}
              onChange={handleChange}
              options={TipeDonatur}
              required
              disabled={!!item} // Disable the select when editing (item exists)
            />

            <FormInput
              label="Deskripsi"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Deskripsi dana hibah"
            />

            <FormInput
              label="Jumlah"
              name="total_funds"
              type="number"
              value={form.total_funds}
              icon={<DollarSign className="h-4 w-4 text-gray-400" />} // Tambahkan ikon
              onChange={handleChange}
              error={errors.total_funds}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Tanggal Diterima"
                name="acceptance_date"
                type="date"
                value={form.acceptance_date}
                onChange={handleChange}
                error={errors.acceptance_date}
                required
              />
            </div>

            <FormInput
              label="Catatan"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Catatan tambahan tentang dana hibah"
            />

            <div className="col-span-2 flex items-center"> {/* Checkbox ambil 2 kolom */}
              <input
                type="checkbox"
                name="isActiveCheckbox"
                checked={form.isActiveCheckbox}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <label htmlFor="isActiveCheckbox" className="text-sm font-medium text-gray-700">
                Status Aktif
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                onClick={onClose}
                className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              >
                Batal
              </Button>
              <Button type="submit" className="bg-black hover:bg-gray-800 text-white">
                Simpan
              </Button>
            </div>
          </form>
        </div>
      </div>
      {ConfirmDialog}
    </>,
    document.body
  );
}