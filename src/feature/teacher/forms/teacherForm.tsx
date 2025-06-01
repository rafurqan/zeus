import { useContext, useEffect, useState } from "react";
import { Teacher } from "@/feature/teacher/types/teacher";
import { AppContext } from "@/context/AppContext";
import { EducationLevel } from "@/core/types/education-level";
import { AxiosError } from "axios";
import { useConfirm } from "@/core/components/confirmDialog";
import { listEducationLevel } from "@/core/service/master";
import { FormInput } from "@/core/components/forms/formInput";
import { FormSelect } from "@/core/components/forms/formSelect";
import LoadingOverlay from "@/core/components/ui/loading_screen";
import { useTeacher } from "../hook/useTeacher";
import toast from "react-hot-toast";


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
    const { confirm, ConfirmDialog } = useConfirm();
    const { loadingOverlay: isSaving } = useTeacher();
    const { token, setUser, setToken } = useContext(AppContext);
    const [educationLevels, setEducationLevel] = useState<EducationLevel[]>([]);
    const [form, setForm] = useState<Teacher>(item || {
        id: "", name: "", nip: "", birth_date: "", birth_place: "", graduated_from: "", education_level: null
    });
    const [formLoading, setFormLoading] = useState(false); // State loading khusus untuk fetch education levels


    useEffect(() => {
        if (token) {
            fetchEducationLevels();
        } 
    }, [token, setUser, setToken]);

    async function fetchEducationLevels() {
        setFormLoading(true); // Mulai loading untuk fetch dropdown
        try {
            const res = await listEducationLevel();
            if (res.status === 401) {
                toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
                setUser(null);
                setToken(null);
            }
            setEducationLevel(res.data || []);
        } catch (err: unknown) {
            console.error("Gagal memuat tingkat pendidikan:", err);
            if (err instanceof AxiosError) {
                // Pengecekan status 401 dari response error
                if (err.response?.status === 401) {
                    toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
                    setUser(null);
                    setToken(null);
                } else {
                    toast.error(err.response?.data?.message ?? "Gagal memuat daftar pendidikan.");
                }
            } else {
                toast.error("Terjadi kesalahan tak terduga saat memuat daftar pendidikan.");
            }
        } finally {
            setFormLoading(false); // Selesai loading
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
            setForm({ ...form, education_level: selectedEducation });
        } else {
            setForm({ ...form, education_level: null });
        }
    };

    const handleSubmit = async () => {
        const isConfirmed = await confirm({
            title: isEdit ? "Perbaharui Data" : "Submit Data",
            message: `Apakah Anda yakin ingin ${isEdit ? "memperbarui" : "menambahkan data"} guru ini?`,
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
            {isSaving && <LoadingOverlay />} {/* Menggunakan isSaving dari useTeacher */}

            {/* Modal content container */}
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
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

                {formLoading ? ( // Tampilkan loading state untuk form select
                    <p>Memuat pilihan pendidikan...</p>
                ) : (
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
                )}


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
                        disabled={isSaving || formLoading} // Disable saat menyimpan atau memuat pilihan
                    >
                        {isSaving ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
                {ConfirmDialog}
            </div>
        </div>
    );
}