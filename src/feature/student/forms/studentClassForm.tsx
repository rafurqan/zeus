import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { Program } from "@/feature/master/types/program";
import { AxiosError } from "axios";
import { useConfirm } from "@/core/components/confirmDialog";
import { listProgram } from "@/core/service/master";
import { FormInput } from "@/core/components/forms/formInput";
import { FormSelect } from "@/core/components/forms/formSelect";
import { StudentClass } from "../types/student-class";
import toast from "react-hot-toast";
import { useTeacher } from "@/feature/teacher/hook/useTeacher";



type Props = {
    item?: StudentClass | null;
    onClose: () => void;
    onSuccess: (item: StudentClass) => void;
};

export default function StudentClassForm({
    item = null,
    onClose,
    onSuccess,
}: Props) {
    const isEdit = !!item;
    const { confirm, ConfirmDialog } = useConfirm();

    const { token, setUser, setToken } = useContext(AppContext);
    const [programs, setPrograms] = useState<Program[]>([]);
    const { data } = useTeacher();

    const [form, setForm] = useState<StudentClass>(item || {
        id: "", name: "", part: "", program: null, capacity: null, academic_year: null, status: null, teacher: null, class_membership_count: null
    });






    useEffect(() => {
        if (token) {
            fetchPrograms();
        }
    }, []);

    async function fetchPrograms() {
        try {
            const res = await listProgram();

            if (res.status === 401) {
                setUser(null);
                setToken(null);
                toast.error("Akses ditolak. Silakan login ulang.");
            }
            setPrograms(res.data || []);
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

    const handleProgramChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const selected = programs.find(level => level.id === e.target.value);
        if (selected) {
            setForm({ ...form, [e.target.name]: selected });
        }
    };

    const handleTeacherChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const selected = data.find(value => value.id === e.target.value);
        if (selected) {
            setForm({ ...form, [e.target.name]: selected });
        }
    };

    const handleSubmit = async () => {
        const isConfirmed = await confirm({
            title: isEdit ? "Perbaharui Data" : "Submit Data",
            message: `Apakah Anda yakin ingin ${isEdit ? "perbaharui" : "menambahkan data"} kelas ini?`,
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
                            {isEdit ? "Edit Data kelas" : "Tambah kelas Baru"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {isEdit
                                ? "Lakukan perubahan pada data kelas"
                                : "Tambahkan data kelas baru ke dalam sistem"}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 text-xl">
                        ×
                    </button>
                </div>

                <div className="space-y-4">

                    <FormInput
                        label="Nama Kelas"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Isi nama kelas"
                    />


                    <FormInput
                        label="Bagian"
                        name="part"
                        value={form.part}
                        onChange={handleChange}
                        placeholder="Isi Bagian kelas"
                    />

                    <FormSelect
                        label="Program"
                        name="program"
                        value={form.program?.id ?? ''}
                        onChange={handleProgramChange}
                        options={programs.map((value) => ({ label: value.name, value: value.id }))}
                    />

                    <FormInput
                        label="Kapasitas"
                        name="capacity"
                        value={form.capacity ?? ""}
                        onChange={handleChange}
                        placeholder="Isi jumlah kapasitas"
                    />

                    <FormSelect
                        label="Tahun Ajaran"
                        name="academic_year"
                        value={form.academic_year ?? ''}
                        onChange={handleChange}
                        options={Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - 2 + i;
                            return { label: `${year.toString()}/${(year + 1).toString()}`, value: `${year.toString()}/${(year + 1).toString()}` };
                        })}
                    />

                    <FormSelect
                        label="Wali Kelas"
                        name="teacher"
                        value={form.teacher?.id ?? ''}
                        onChange={handleTeacherChange}
                        options={data.map((value) => ({ label: value.name, value: value.id }))}
                    />

                    <FormSelect
                        label="Status"
                        name="status"
                        value={form.status ?? ''}
                        onChange={handleChange}
                        options={[{ label: 'Aktif', value: 'ACTIVE' }, { label: 'Tidak Aktif', value: 'INACTIVE' }]}
                    />


                </div>

                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded text-gray-600"
                    >Batal</button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
                    >Simpan</button>
                </div>
                {ConfirmDialog}
            </div>

        </div>
    );
}
