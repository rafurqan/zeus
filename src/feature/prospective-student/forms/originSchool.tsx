import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { AxiosError } from "axios";
import { useConfirm } from "@/core/components/confirmDialog";
import { MasterData } from "@/core/types/master-data";
import { listEducation, listSchoolType } from "@/core/service/master";
import { FormInput } from "@/core/components/forms/formInput";
import { FormSelect } from "@/core/components/forms/formSelect";
import { OriginSchool } from "../types/origin-school";
import { Education } from "@/core/types/education";




type Props = {
    item?: OriginSchool | null;
    onClose: () => void;
    onSuccess: (item: OriginSchool) => void;
};

export default function StudentOriginSchoolForm({
    item = null,
    onClose,
    onSuccess,
}: Props) {
    const isEdit = !!item;
    const { confirm, ConfirmDialog } = useConfirm();

    const { token, setUser, setToken } = useContext(AppContext);
    const [schoolTypes, setSchoolTypes] = useState<MasterData[]>([]);
    const [educationLevels, setEducationLevels] = useState<Education[]>([]);

    const [form, setForm] = useState<OriginSchool>(item || {
        address_name: "",
        education: null,
        id: "",
        npsn: "",
        school_name: "",
        graduation_year: "",
        aggregate_id: "",
        school_type: null,
    });


    useEffect(() => {
        if (token) {
            fetchSchoolType();
            fetchEducationLevels();
        }
    }, []);

    async function fetchSchoolType() {
        try {
            const res = await listSchoolType();

            if (res.status === 401) {
                setUser(null);
                setToken(null);
            }
            setSchoolTypes(res.data || []);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.status === 401) {
                console.error("Fetch failed", err);
                setUser(null);
            }
        }
    }

    async function fetchEducationLevels() {
        try {
            const res = await listEducation();

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
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleInputSchoolType = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const selected = schoolTypes.find(value => value.id === e.target.value);
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
            message: `Apakah Anda yakin ingin ${isEdit ? "perbaharui" : "menambahkan data"} asal sekolah ini?`,
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
                            {isEdit ? "Edit Data asal sekolah" : "Tambah asal sekolah Baru"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {isEdit
                                ? "Lakukan perubahan pada data asal sekolah"
                                : "Tambahkan data asal sekolah baru ke dalam sistem"}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 text-xl">
                        ×
                    </button>
                </div>

                <div className="space-y-4">

                    <FormInput
                        label="Nama"
                        name="school_name"
                        value={form.school_name}
                        onChange={handleChange}
                        placeholder="Isi nama asal sekolah"
                    />

                    <FormSelect
                        label="Pendidikan"
                        name="education"
                        value={form.education?.id ?? ''}
                        onChange={handleInputEducationLevel}
                        options={educationLevels.map((education) => ({ label: education.name, value: education.id }))}
                    />

                    <FormSelect
                        label="Jenis Sekolah"
                        name="school_type"
                        value={form.school_type?.id ?? ''}
                        onChange={handleInputSchoolType}
                        options={schoolTypes.map((type) => ({ label: type.name, value: type.id }))}
                    />

                    <FormInput
                        label="NPSN Sekolah"
                        name="npsn"
                        value={form.npsn ?? ""}
                        onChange={handleChange}
                        placeholder="Masukkan NPSN sekolah"
                    />

                    <FormSelect
                        label="Tahun Lulus"
                        name="graduation_year"
                        value={form.graduation_year ?? ''}
                        onChange={handleChange}
                        options={Array.from({ length: 16 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return { label: year.toString(), value: year.toString() };
                        })}
                    />



                    <div>
                        <label className={labelClass}>Alamat Sekolah</label>
                        <textarea
                            name="address_name"
                            value={form.address_name ?? ""}
                            onChange={handleChange}
                            placeholder="Tulis alamat lengkap"
                            className="w-full border border-gray-100 shadow-none rounded px-3 py-2 focus:outline-none focus:border-black hover:border-black focus:ring-0"
                        />
                    </div>

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
