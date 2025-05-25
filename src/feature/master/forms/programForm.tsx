import { useState } from "react";
import { useConfirm } from "@/core/components/confirmDialog";
import { FormInput } from "@/core/components/forms/formInput";
import { FormSelect } from "@/core/components/forms/formSelect";
import LoadingOverlay from "@/core/components/ui/loading_screen";
import { useProgram } from "../hook/useProgram";
import { Program } from "../types/program";


type Props = {
    item?: Program | null;
    onClose: () => void;
    onSuccess: (item: Program) => void;
};

export default function ProgramForm({
    item = null,
    onClose,
    onSuccess,
}: Props) {
    const isEdit = !!item;
    const { confirm, ConfirmDialog } = useConfirm();
    const { loadingOverlay: isSaving } = useProgram();
    const [form, setForm] = useState<Program>(item || {
        id: "", name: "", level: "", status: "", description: ""
    });


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleSubmit = async () => {
        const isConfirmed = await confirm({
            title: isEdit ? "Perbaharui Data" : "Submit Data",
            message: `Apakah Anda yakin ingin ${isEdit ? "memperbarui" : "menambahkan data"} program ini?`,
            confirmText: "Ya, Lanjutkan",
            cancelText: "Batal",
        });
        if (isConfirmed) {
            onSuccess(form);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center">
            {/* Loading Overlay*/}
            {isSaving && <LoadingOverlay />} {/* Menggunakan isSaving dari useProgram */}

            {/* Modal content container */}
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold">
                            {isEdit ? "Edit Data Program" : "Tambah Program Baru"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {isEdit
                                ? "Lakukan perubahan pada data program"
                                : "Tambahkan data program baru ke dalam sistem"}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 text-xl">
                        ×
                    </button>
                </div>

                <div className="space-y-4">
                    <FormInput
                        label="Nama Program"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Contoh: MI Tahfidz"
                    />
                    <FormInput
                        label="Deskripsi"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Isi deskripsi"
                    />
                    <FormSelect
                        label="Jenjang"
                        name="level"
                        value={form.level}
                        onChange={handleChange}
                        options={[{ label: "Dasar", value: "Dasar" }, { label: "Menengah", value: "Menengah" }, { label: "Atas", value: "Atas" }]}
                    />
                    <FormSelect
                        label="Status"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        options={[{ label: "Aktif", value: "ACTIVE" }, { label: "Tidak Aktif", value: "INACTIVE" }]}
                    />
                </div>


                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded text-gray-600"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
                        disabled={isSaving}
                    >
                        {isSaving ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
                {ConfirmDialog}
            </div>
        </div>
    );
}