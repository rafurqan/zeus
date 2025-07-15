import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { AxiosError } from "axios";
import { useConfirm } from "@/core/components/confirmDialog";
import { Parent } from "../types/parent";
import { MasterData } from "@/core/types/master-data";
import { listEducationLevel, listIncomeRange, listParentType } from "@/core/service/master";
import { EducationLevel } from "@/core/types/education-level";
import { FormInput } from "@/core/components/forms/formInput";
import { FormSelect } from "@/core/components/forms/formSelect";




type Props = {
    item?: Parent | null;
    onClose: () => void;
    onSuccess: (item: Parent) => void;
};

export default function StudentParentForm({
    item = null,
    onClose,
    onSuccess,
}: Props) {
    const isEdit = !!item;
    const { confirm, ConfirmDialog } = useConfirm();

    const { token, setUser, setToken } = useContext(AppContext);
    const [incomeRanges, setIncomeRanges] = useState<MasterData[]>([]);
    const [parentTypes, setParentTypes] = useState<MasterData[]>([]);
    const [educationLevels, setEducationLevels] = useState<EducationLevel[]>([]);

    const [form, setForm] = useState<Parent>(item || {
        id: "", full_name: "", parent_type: null, education_level: null, income_range: null, occupation: "", phone: "", address: "", is_main_contact: false, is_emergency_contact: false, email: null, nik: null
    });


    useEffect(() => {
        if (token) {
            fetchIncomeRange();
            fetchEducationLevels();
            fetchParentType();
        }
    }, []);

    async function fetchIncomeRange() {
        try {
            const res = await listIncomeRange();

            if (res.status === 401) {
                setUser(null);
                setToken(null);
                // toast.error("Akses ditolak. Silakan login ulang.");
            }
            setIncomeRanges(res.data || []);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.status === 401) {
                console.error("Fetch failed", err);
                setUser(null);
            }
        }
    }

    async function fetchParentType() {
        try {
            const res = await listParentType();

            if (res.status === 401) {
                setUser(null);
                setToken(null);
                // toast.error("Akses ditolak. Silakan login ulang.");
            }
            setParentTypes(res.data || []);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.status === 401) {
                console.error("Fetch failed", err);
                setUser(null);
            }
        }
    }

    async function fetchEducationLevels() {
        try {
            const res = await listEducationLevel();

            if (res.status === 401) {
                setUser(null);
                setToken(null);
                // toast.error("Akses ditolak. Silakan login ulang.");
            }
            setEducationLevels(res.data || []);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.status === 401) {
                console.error("Fetch failed", err);
                setUser(null);
            }
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleInputIncomeRange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const selected = incomeRanges.find(value => value.id === e.target.value);
        if (selected) {
            setForm({ ...form, [e.target.name]: selected });
        }
    };

    const handleInputParentType = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const selected = parentTypes.find(value => value.id === e.target.value);
        if (selected) {
            setForm({ ...form, [e.target.name]: selected });
        }
    };

    const handleInputEducationLevel = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const selected = educationLevels.find(value => value.id === e.target.value);
        if (selected) {
            setForm({ ...form, [e.target.name]: selected });
        }
    };

    const handleSubmit = async () => {
        const isConfirmed = await confirm({
            title: isEdit ? "Perbaharui Data" : "Submit Data",
            message: `Apakah Anda yakin ingin ${isEdit ? "perbaharui" : "menambahkan data"} keluarga ini?`,
            confirmText: "Ya, Lanjutkan",
            cancelText: "Batal",
        });
        if (isConfirmed) {
            onSuccess(form);
        }

    };


    const labelClass = "block text-sm font-medium mb-1";

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold">
                            {isEdit ? "Edit Data Keluarga" : "Tambah Keluarga Baru"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {isEdit
                                ? "Lakukan perubahan pada data keluarga"
                                : "Tambahkan data keluarga baru ke dalam sistem"}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 text-xl">
                        ×
                    </button>
                </div>

                <div className="space-y-4">

                    <FormInput
                        label="Nama"
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        placeholder="Contoh: Fulan"
                    />

                    <FormInput
                        label="Nik"
                        name="nik"
                        value={form.nik ?? ""}
                        onChange={handleChange}
                        placeholder="12345"
                    />

                    <FormSelect
                        label="Hubungan Keluarga"
                        name="parent_type"
                        value={form.parent_type?.id ?? ''}
                        onChange={handleInputParentType}
                        options={parentTypes.map((type) => ({ label: `${type.code ?? ''} ${type.name}`, value: type.id }))}
                    />


                    <FormSelect
                        label="Pilih Penghasilan"
                        name="income_range"
                        value={form.income_range?.id ?? ''}
                        onChange={handleInputIncomeRange}
                        options={incomeRanges.map((income) => ({ label: `${income.code ?? ''} ${income.name}`, value: income.id }))}
                    />

                    <FormInput
                        label="Pekerjaan"
                        name="occupation"
                        value={form.occupation ?? ""}
                        onChange={handleChange}
                        placeholder="Contoh: Wiraswasta"
                    />

                    <FormSelect
                        label="Pendidikan Terakhir"
                        name="education_level"
                        value={form.education_level?.id ?? ''}
                        onChange={handleInputEducationLevel}
                        options={educationLevels.map((education) => ({ label: education.name, value: education.id }))}
                    />


                    <div>
                        <label className={labelClass}>Alamat (Opsional)</label>
                        <textarea
                            name="address"
                            value={form.address ?? ""}
                            onChange={handleChange}
                            placeholder="Tulis alamat lengkap"
                            className="w-full border border-gray-100 shadow-none rounded px-3 py-2 focus:outline-none focus:border-black hover:border-black focus:ring-0"
                        />
                    </div>

                    {
                        <div className="mt-10 space-y-4">
                            <h3 className="font-bold mb-4">Kontak</h3>
                            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <FormInput
                                        label="Nomor Telephon"
                                        name="phone"
                                        value={form.phone ?? ""}
                                        onChange={handleChange}
                                        placeholder="Contoh: 081283xxx"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <FormInput
                                        label="Email"
                                        name="email"
                                        value={form.email ?? ""}
                                        onChange={handleChange}
                                        placeholder="xxx@gmail.com"
                                    />
                                </div>
                            </form>
                            <label className="inline-flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_main_contact"
                                    checked={form.is_main_contact}
                                    onChange={(e) => setForm({ ...form, is_main_contact: e.target.checked })}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span className="text-sm text-gray-700">Kontak Utama</span>
                            </label>

                            <label className="inline-flex items-center space-x-2 cursor-pointer ml-10">
                                <input
                                    type="checkbox"
                                    name="is_emergency_contact"
                                    checked={form.is_emergency_contact}
                                    onChange={(e) => setForm({ ...form, is_emergency_contact: e.target.checked })}
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span className="text-sm text-gray-700">Kontak Darurat</span>
                            </label>
                        </div>
                    }


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
                    >
                        Simpan
                    </button>
                </div>

                {ConfirmDialog}
            </div>

        </div>
    );
}
