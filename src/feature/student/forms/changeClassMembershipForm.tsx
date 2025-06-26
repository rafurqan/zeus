import { useState } from "react";
import { useConfirm } from "@/core/components/confirmDialog";
import { FormInput } from "@/core/components/forms/formInput";
import { FormSelect } from "@/core/components/forms/formSelect";
import { StudentClass } from "../types/student-class";
import { useStudentClass } from "../hooks/useStudentClass";
import { ClassMembership, CreateClassMembershipRequest } from "../types/student-class-membership";
import LoadingOverlay from "@/core/components/ui/loading_screen";
import { useClassMembership } from "../hooks/useClassMembership";



type Props = {
    item?: ClassMembership | null;
    onClose: () => void;
    onSuccess: (item: CreateClassMembershipRequest) => void;
};

export default function ChangeClassMembershipForm({
    item,
    onClose,
    onSuccess,
}: Props) {
    const { confirm, ConfirmDialog } = useConfirm();

    const { loadingOverlay: isSaving } = useClassMembership();
    const { data } = useStudentClass();
    const [reason, setReason] = useState<string>("");
    const [form, setForm] = useState<StudentClass>({
        id: "", name: "", part: "", program: null, capacity: null, academic_year: null, status: null, teacher: null, class_membership_count: null
    });


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleSubmit = async () => {
        const isConfirmed = await confirm({
            title: "Submit Data",
            message: `pindah kelas siswa ini?`,
            confirmText: "Ya, Lanjutkan",
            cancelText: "Batal",
        });
        if (isConfirmed) {
            onSuccess({ prospective_student_id: item?.type === "prospective_student" ? item?.id ?? null : null, student_id: item?.type === "student" ? item?.id ?? null : null, student_class_id: form.id, start_at: new Date().toISOString() });
        }

    };

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                {isSaving && <LoadingOverlay />}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold">
                            {"Pindahkan Siswa"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {"Pindahkan siswa ke kelas yang baru"}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 text-xl">
                        ×
                    </button>
                </div>

                <div className="space-y-4">

                    <FormInput
                        label="Kelas Saat ini"
                        name="name"
                        value={item?.active_class?.name ?? "-"}
                        onChange={() => { }}
                        placeholder="-"
                        disabled={true}
                    />


                    <FormSelect
                        label="Kelas Baru"
                        name="id"
                        value={form.id ?? ''}
                        onChange={handleChange}
                        options={data.filter((value) => value.id !== item?.active_class?.id).map((value) => ({ label: `${value.name} ${value.part} (${value.academic_year}) - ${value.teacher?.name ?? ""}`, value: value.id }))}
                    />

                    <FormInput
                        label="Alasan"
                        name="reason"
                        value={reason ?? ""}
                        onChange={(e) => setReason(e.target.value)}
                        type="text"
                        placeholder="Isi Alasan perpindahan kelas siswa"
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
