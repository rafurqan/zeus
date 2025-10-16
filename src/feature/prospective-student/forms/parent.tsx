import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { AxiosError } from "axios";
import { useConfirm } from "@/core/components/confirmDialog";
import { Parent } from "../types/parent";
import { MasterData } from "@/core/types/master-data";
import {
    listEducationLevel,
    listIncomeRange,
    listOccupations,
    listParentType,
} from "@/core/service/master";
import { EducationLevel } from "@/core/types/education-level";
import { FormInput } from "@/core/components/forms/formInput";
import { FormSelect } from "@/core/components/forms/formSelect";
import toast from "react-hot-toast";
import { FormLabel } from "@/core/components/ui/label_form";

type Props = {
    item?: Parent | null;
    currentStudentParents?: Parent[] | null;
    onClose: () => void;
    onSuccess: (item: Parent) => void;
};

export default function StudentParentForm({
    item = null,
    currentStudentParents = null,
    onClose,
    onSuccess,
}: Props) {
    const isEdit = !!item;
    const { confirm, ConfirmDialog } = useConfirm();
    const { token, setUser, setToken } = useContext(AppContext);

    const [incomeRanges, setIncomeRanges] = useState<MasterData[]>([]);
    const [parentTypes, setParentTypes] = useState<MasterData[]>([]);
    const [occupations, setOccupations] = useState<MasterData[]>([]);
    const [educationLevels, setEducationLevels] = useState<EducationLevel[]>([]);

    const [form, setForm] = useState<Parent>(
        item || {
            id: "",
            full_name: "",
            parent_type: null,
            education_level: null,
            income_range: null,
            occupation: null,
            phone: "",
            address: "",
            is_main_contact: false,
            is_emergency_contact: false,
            email: "",
            nik: "",
        }
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (token) {
            fetchIncomeRange();
            fetchEducationLevels();
            fetchParentType();
            fetchOccupations();
        }
    }, []);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    async function fetchIncomeRange() {
        try {
            const res = await listIncomeRange();
            if (res.status === 401) {
                setUser(null);
                setToken(null);
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
            }
            setParentTypes(res.data || []);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.status === 401) {
                console.error("Fetch failed", err);
                setUser(null);
            }
        }
    }

    async function fetchOccupations() {
        try {
            const res = await listOccupations();
            if (res.status === 401) {
                setUser(null);
                setToken(null);
            }
            setOccupations(res.data || []);
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
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleSelectChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
        list: MasterData[] | EducationLevel[],
        key: keyof Parent
    ) => {
        const selected = list.find((val) => val.id === e.target.value);
        setForm({ ...form, [key]: selected || null });
        setErrors({ ...errors, [key]: "" });
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!form.full_name) newErrors.full_name = "Nama wajib diisi";
        if (!form.parent_type) newErrors.parent_type = "Hubungan keluarga wajib dipilih";
        if (!form.income_range) newErrors.income_range = "Rentang penghasilan wajib dipilih";
        if (!form.occupation) newErrors.occupation = "Pekerjaan wajib dipilih";
        if (!form.education_level) newErrors.education_level = "Pendidikan wajib dipilih";
        if (!form.phone) newErrors.phone = "Nomor telepon wajib diisi";


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error("Mohon lengkapi semua field wajib.");
            return;
        }

        const alreadyHasMainContact = currentStudentParents?.some(
            (p) => p.is_main_contact
        );

        if (alreadyHasMainContact && form.is_main_contact) {
            toast.error(
                "Sudah ada kontak utama. Hanya boleh satu kontak utama untuk data orang tua siswa."
            );
            return;
        }

        const isConfirmed = await confirm({
            title: isEdit ? "Perbaharui Data" : "Submit Data",
            message: `Apakah Anda yakin ingin ${isEdit ? "perbaharui" : "menambahkan data"
                } keluarga ini?`,
            confirmText: "Ya, Lanjutkan",
            cancelText: "Batal",
        });

        if (isConfirmed) {
            onSuccess(form);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] min-h-[60vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-gray-100">
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
                    <button
                        onClick={onClose}
                        className="text-gray-500 text-xl hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    <FormInput
                        label={<FormLabel text="Nama" required />}
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        placeholder="Contoh: Fulan"
                        error={errors.full_name}
                    />

                    <FormInput
                        label={<FormLabel text="NIK" />}
                        name="nik"
                        value={form.nik ?? ""}
                        onChange={handleChange}
                        onlyNumbers
                        placeholder="12345"
                    />

                    <FormSelect
                        label={<FormLabel text="Hubungan Keluarga" required />}
                        name="parent_type"
                        value={form.parent_type?.id ?? ""}
                        onChange={(e) =>
                            handleSelectChange(e, parentTypes, "parent_type")
                        }
                        options={parentTypes.map((t) => ({
                            label: t.name,
                            value: t.id,
                        }))}
                        error={errors.parent_type}
                    />

                    <FormSelect
                        label={<FormLabel text="Pilih Penghasilan" required />}
                        name="income_range"
                        value={form.income_range?.id ?? ""}
                        onChange={(e) =>
                            handleSelectChange(e, incomeRanges, "income_range")
                        }
                        options={incomeRanges.map((i) => ({
                            label: i.name,
                            value: i.id,
                        }))}
                        error={errors.income_range}
                    />

                    <FormSelect
                        label={<FormLabel text="Pekerjaan" required />}
                        name="occupation"
                        value={form.occupation?.id ?? ""}
                        onChange={(e) =>
                            handleSelectChange(e, occupations, "occupation")
                        }
                        options={occupations.map((o) => ({
                            label: o.name,
                            value: o.id,
                        }))}
                        error={errors.occupation}
                    />

                    <FormSelect
                        label={<FormLabel text="Pendidikan Terakhir" required />}
                        name="education_level"
                        value={form.education_level?.id ?? ""}
                        onChange={(e) =>
                            handleSelectChange(e, educationLevels, "education_level")
                        }
                        options={educationLevels.map((e) => ({
                            label: e.name,
                            value: e.id,
                        }))}
                        error={errors.education_level}
                    />

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Alamat (Opsional)
                        </label>
                        <textarea
                            name="address"
                            value={form.address ?? ""}
                            onChange={handleChange}
                            placeholder="Tulis alamat lengkap"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold">Kontak</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                                label={<FormLabel text="Nomor Telepon" required />}
                                name="phone"
                                onlyNumbers
                                value={form.phone ?? ""}
                                onChange={handleChange}
                                placeholder="Contoh: 081283xxx"
                                error={errors.phone}
                            />

                            <FormInput
                                label={<FormLabel text="Email" />}
                                name="email"
                                value={form.email ?? ""}
                                onChange={handleChange}
                                placeholder="xxx@gmail.com"
                                error={errors.email}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="inline-flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_main_contact"
                                    checked={form.is_main_contact}
                                    onChange={(e) =>
                                        setForm({ ...form, is_main_contact: e.target.checked })
                                    }
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span className="text-sm text-gray-700">Kontak Utama</span>
                            </label>

                            <label className="inline-flex items-center space-x-2 cursor-pointer ml-4">
                                <input
                                    type="checkbox"
                                    name="is_emergency_contact"
                                    checked={form.is_emergency_contact}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            is_emergency_contact: e.target.checked,
                                        })
                                    }
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span className="text-sm text-gray-700">Kontak Darurat</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                        Simpan
                    </button>
                </div>

                {ConfirmDialog}
            </div>
        </div>
    );
}
