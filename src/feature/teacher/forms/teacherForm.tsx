import { useContext, useEffect, useState } from "react";
import { Teacher } from "@/feature/teacher/types/teacher";
import { AppContext } from "@/context/AppContext";
import { EducationLevel } from "@/core/types/education-level";
import { AxiosError } from "axios";
import { useConfirm } from "@/core/components/confirmDialog";
import { listEducationLevel } from "@/core/service/master";
// import { createTeacher, updateTeacher } from "../service/teacherService";
import { FormInput } from "@/core/components/forms/formInput";
import { FormSelect } from "@/core/components/forms/formSelect";



type Props = {
    item?: Teacher | null;
    onClose: () => void;
    onSuccess: (item: Teacher) => void;
};

export default function TeacherForm({
    item = null,
    onClose,
    onSuccess,
}: Props) {
    const isEdit = !!item;
    const [loading] = useState(false);
    const { confirm, ConfirmDialog } = useConfirm();

    const { token, setUser, setToken } = useContext(AppContext);
    const [educationLevels, setEducationLevel] = useState<EducationLevel[]>([]);

    const [form, setForm] = useState<Teacher>(item || {
        id: "", name: "", nip: "", birth_date: "", birth_place: "", graduated_from: "", education_level: null
    });






    useEffect(() => {
        if (token) {
            fetchEducationLevels();
        }
    }, []);

    async function fetchEducationLevels() {
        try {
            const res = await listEducationLevel(token);

            if (res.status === 401) {
                setUser(null);
                setToken(null);
                // toast.error("Akses ditolak. Silakan login ulang.");
            }
            setEducationLevel(res.data || []);
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const selectedEducation = educationLevels.find(level => level.id === e.target.value);
        if (selectedEducation) {
            setForm({ ...form, [e.target.name]: selectedEducation });
        }
    };

    const handleSubmit = async () => {
        console.log("print confirmation");
        const isConfirmed = await confirm({
            title: isEdit ? "Perbaharui Data" : "Submit Data",
            message: `Apakah Anda yakin ingin ${isEdit ? "perbaharui" : "menambahkan data"} guru ini?`,
            confirmText: "Ya, Lanjutkan",
            cancelText: "Batal",
        });
        if (isConfirmed) {
            onSuccess(form);
        }

    };

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold">
                            {isEdit ? "Edit Data Guru" : "Tambah Guru Baru"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {isEdit
                                ? "Lakukan perubahan pada data guru"
                                : "Tambahkan data guru baru ke dalam sistem"}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 text-xl">
                        ×
                    </button>
                </div>

                <div className="space-y-4">

                    <FormInput
                        label="Nama Guru"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Contoh: Fulan"
                    />


                    <FormInput
                        label="Nip"
                        name="nip"
                        value={form.nip}
                        onChange={handleChange}
                        placeholder="Contoh: 123456789"
                    />


                    <FormInput
                        label="Tempat Lahir"
                        name="birth_place"
                        value={form.birth_place}
                        onChange={handleChange}
                        placeholder="Tempat lahir"
                    />


                    <FormInput
                        label="Tanggal Lahir"
                        name="birth_date"
                        value={form.birth_date}
                        onChange={handleChange}
                        type="date"
                    />

                    <FormSelect
                        label="Pendidikan Terakhir"
                        name="education_level"
                        value={form.education_level?.id ?? ''}
                        onChange={handleInputChange}
                        options={educationLevels.map((education) => ({ label: education.name, value: education.id }))}
                    />

                    <FormInput
                        label="Lulusan Dari"
                        name="graduated_from"
                        value={form.graduated_from}
                        onChange={handleChange}
                        placeholder="Lulusan dari"
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
                        disabled={loading}
                    >
                        {loading ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
                {ConfirmDialog}
            </div>

        </div>
    );
}
