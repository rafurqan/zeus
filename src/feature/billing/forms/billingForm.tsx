import { useContext, useEffect, useState } from "react";
import { Billing } from "@/feature/billing/types/billing";
import { AppContext } from "@/context/AppContext";
import { EducationLevel } from "@/core/types/education-level";
import { AxiosError } from "axios";
import { useConfirm } from "@/core/components/confirmDialog";
import { listEducationLevel } from "@/core/service/master";
import { FormInput } from "@/core/components/forms/formInput";
import { FormSelect } from "@/core/components/forms/formSelect";


type Props = {
    item?: Billing | null;
    onClose: () => void;
    onSuccess: (item: Billing) => void;
};

export default function BillingForm({
    item = null,
    onClose,
    onSuccess,
}: Props) {
    const isEdit = !!item;
    const [loading] = useState(false); // Gunakan loading dari hook useBilling jika tersedia
    const { confirm, ConfirmDialog } = useConfirm();

    const { token, setUser, setToken } = useContext(AppContext);
    const [educationLevels, setEducationLevel] = useState<EducationLevel[]>([]);

    const [form, setForm] = useState<Billing & { isActiveCheckbox: boolean }>(() => {
        if (item) {
            return {
                ...item,
                isActiveCheckbox: item.is_active === "Y"
            };
        }
        
        return {
            id: "",
            nama_tarif: "",
            price: 0,
            description: "",
            program_id: "",
            program: "",
            is_active: "Y",
            frequency: 0,
            applies_to: "",
            service_name: "",
            service_id: "",
            category: "",
            child_ids: [],
            isActiveCheckbox: true
        };
    });

    const frequencyOptions = [
        { value: "Bulanan", label: "Bulanan" },
        { value: "Per Semester", label: "Per Semester" },
        { value: "Tahunan", label: "Tahunan" },
        { value: "Satu Kali", label: "Satu Kali" }
    ];

    const berlakuUntukOptions = [
        { value: "Semua Siswa", label: "Semua Siswa" },
        { value: "Siswa", label: "Siswa" },
        { value: "Siswa Baru", label: "Siswa Baru" }
    ];

    const categoryOptions = [
        { value: "1", label: "Registrasi" },
        { value: "2", label: "Buku" },
        { value: "3", label: "Seragam" },
        { value: "4", label: "SPP" },
        { value: "5", label: "Uang Gedung" },
        { value: "6", label: "Kegiatan" },
        { value: "7", label: "Ujian" },
        { value: "8", label: "Wisuda" },
        { value: "9", label: "Lainnya" }
    ];


    useEffect(() => {
        if (token) {
            fetchEducationLevels();
        }
    }, [token]); // Tambahkan token sebagai dependency

    async function fetchEducationLevels() {
        try {
            const res = await listEducationLevel();

            if (res.status === 401) {
                setUser(null);
                setToken(null);
            }
            setEducationLevel(res.data || []);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.response?.status === 401) { 
                console.error("Fetch failed", err);
                setUser(null);
                setToken(null);
            } else {
                 console.error("Fetch failed", err);
            }
        }
    }

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
            setForm({ ...form, [name]: value });
        }
    };

    const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
         const selectedEducationId = e.target.value;
         // Simpan hanya ID program, bukan objek EducationLevel
         setForm({ ...form, program_id: selectedEducationId });
     };

     const formatRupiah = (value: string | number) => {
        const numberString = value.toString().replace(/[^\d]/g, "");
        return numberString ? `Rp ${parseInt(numberString, 10).toLocaleString('id-ID')}` : "";
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/[^\d]/g, "");
        setForm({
            ...form,
            price: rawValue ? parseInt(rawValue, 10) : 0
        });
    };


    const handleSubmit = async () => {
        const isConfirmed = await confirm({
            title: isEdit ? "Perbaharui Data" : "Submit Data",
            message: `Apakah Anda yakin ingin ${isEdit ? "perbaharui" : "menambahkan"} data biaya ini?`,
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

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold">
                            {isEdit ? 'Edit Master Biaya' : 'Tambah Master Biaya'}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {isEdit
                                ? 'Lakukan perubahan pada data biaya'
                                : 'Tambahkan data biaya baru ke dalam sistem'}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 text-xl">
                        ×
                    </button>
                </div>

                {/* Hidden input for service_id */}
                <input type="hidden" name="service_id" value={form.service_id} />

                <div className="grid grid-cols-2 gap-4"> {/* Gunakan grid untuk layout 2 kolom */}
                    <div className="col-span-1">
                         <FormInput
                            label={<>Nama <span className="text-red-500">*</span></>} 
                            placeholder="Cth: SPP Bulanan"
                            name="service_name"
                            value={form.service_name || ''}
                            onChange={handleChange}
                        />
                    </div>
                     <div className="col-span-1">
                         <FormSelect
                            label="Kategori *"
                            name="category"
                            value={form.category || ''}
                            options={categoryOptions}
                            onChange={handleChange}
                            disabled={isEdit}
                        />
                    </div>
                     <div className="col-span-2"> {/* Program ambil 2 kolom */}
                         <FormSelect
                            label="Program *"
                            name="program_id"
                            value={form.program_id}
                            options={educationLevels.map(level => ({ value: level.id, label: level.name }))}
                            onChange={handleProgramChange} 
                        />
                    </div>
                    <div className="col-span-2">
                         <FormInput
                            label="Deskripsi"
                            name="description"
                            placeholder="Deskripsi biaya"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>
                     <div className="col-span-2">
                         <FormInput
                            label={<>Jumlah <span className="text-red-500">*</span></>}
                            name="price"
                            type="text"
                            value={formatRupiah(form.price || "")}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => handlePriceChange(e as React.ChangeEvent<HTMLInputElement>)}
                        />
                    </div>
                     <div className="col-span-1">
                         <FormSelect
                            label="Frekuensi"
                            name="frequency"
                            value={form.frequency.toString()}
                            options={frequencyOptions}
                            onChange={handleChange}
                        />
                    </div>
                     <div className="col-span-1">
                         <FormSelect
                            label="Berlaku Untuk"
                            name="applies_to"
                            value={form.applies_to}
                            options={berlakuUntukOptions}
                            onChange={handleChange}
                        />
                    </div>
                     <div className="col-span-2 flex items-center"> {/* Checkbox ambil 2 kolom */}
                         <input
                            type="checkbox"
                            name="isActiveCheckbox" 
                            checked={form.isActiveCheckbox} 
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                         />
                         <label htmlFor="isActiveCheckbox" className="text-sm font-medium text-gray-700">
                            Aktif
                         </label>
                     </div>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        onClick={() => onClose()}
                        className="px-4 py-2 border rounded text-gray-600"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
                {ConfirmDialog}
            </div>
        </div>
    );
}