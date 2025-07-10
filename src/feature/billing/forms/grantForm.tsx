import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { FormInput } from "@/core/components/forms/formInput";
import { FormSelect } from "@/core/components/forms/formSelect";
import { useConfirm } from "@/core/components/confirmDialog";
import { Grant } from "../types/grant";

type Props = {
    item?: Grant | null;
    onClose: () => void;
    onSuccess: (item: Grant) => void;
};

export default function GrantForm({ item = null, onClose, onSuccess }: Props) {
    const isEdit = !!item;
    const { confirm, ConfirmDialog } = useConfirm();

    const [form, setForm] = useState<Grant & { isActiveCheckbox: boolean }>(() => {
        if (item) {
            // Ambil hanya bagian tanggal (YYYY-MM-DD) dari string tanggal
            const formattedDate = item.acceptance_date 
                ? item.acceptance_date.split(' ')[0]
                : '';
            return {
                ...item,
                acceptance_date: formattedDate,
                isActiveCheckbox: item.is_active === "Y"
            };
        }

        return {
            id: "",
            grants_name: "",
            donor_name: "",
            donation_type: "",
            description: "",
            total_funds: 0,
            created_at: "",
            notes: "",
            code: "",
            is_active: "Y",
            isActiveCheckbox: true
        };
    });

    const donorTypeOptions = [
        { value: "1", label: "Individu" },
        { value: "2", label: "Organisasi" },
        { value: "3", label: "Kelompok" }
    ];

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;

        if (type === 'checkbox') {
            setForm({
                ...form,
                isActiveCheckbox: checked,
                is_active: checked ? "Y" : "N"
            });
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async () => {
        const isConfirmed = await confirm({
            title: isEdit ? "Perbaharui Data" : "Submit Data",
            message: `Apakah Anda yakin ingin ${isEdit ? "perbaharui" : "menambahkan"} data dana hibah ini?`,
            confirmText: "Ya, Lanjutkan",
            cancelText: "Batal",
        });
    
        if (isConfirmed) {
            try {
                const payload = {
                    ...form,
                    total_funds: Number(form.total_funds)
                };
                onSuccess(payload);  // Biarkan parent component yang menangani create/update
                onClose();
            } catch (error) {
                console.error("Error submitting grant:", error);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold">
                            {isEdit ? 'Edit Dana Hibah' : 'Tambah Dana Hibah'}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {isEdit
                                ? 'Lakukan perubahan pada data dana hibah'
                                : 'Tambahkan data dana hibah baru ke dalam sistem'}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 text-xl">×</button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <FormInput
                            label={<>Nama Dana Hibah <span className="text-red-500">*</span></>}
                            name="grants_name"
                            value={form.grants_name}
                            onChange={handleChange}
                            placeholder="Contoh: Donasi Yayasan ABC"
                        />
                    </div>

                    <div className="col-span-2">
                        <FormInput
                            label="Nama Donatur"
                            name="donor_name"
                            value={form.donor_name}
                            onChange={handleChange}
                            placeholder="Contoh: Yayasan ABC"
                        />
                    </div>

                    <div className="col-span-2">
                        <FormSelect
                            label="Tipe Donatur"
                            name="donation_type"
                            value={form.donation_type}
                            onChange={handleChange}
                            options={donorTypeOptions}
                            disabled={isEdit}
                        />
                    </div>

                    <div className="col-span-2">
                        <FormInput
                            label="Deskripsi"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Deskripsi dana hibah"
                        />
                    </div>

                    <div className="col-span-2">
                        <FormInput
                            label={<>Jumlah <span className="text-red-500">*</span></>}
                            name="total_funds"
                            type="number"
                            value={form.total_funds}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-2">
                        <FormInput
                            label={<>Tanggal Diterima <span className="text-red-500">*</span></>}
                            name="acceptance_date"
                            type="date"
                            value={form.acceptance_date || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-span-2">
                        <FormInput
                            label="Catatan"
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            placeholder="Catatan tambahan tentang dana hibah"
                        />
                    </div>

                    <div className="col-span-2 flex items-center">
                        <input
                            type="checkbox"
                            name="isActiveCheckbox"
                            checked={form.isActiveCheckbox}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <label className="text-sm font-medium text-gray-700">
                            Status Aktif
                        </label>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-black hover:bg-gray-800 text-white"
                    >
                        Simpan
                    </Button>
                </div>
            </div>
            {ConfirmDialog}
        </div>
    );
}