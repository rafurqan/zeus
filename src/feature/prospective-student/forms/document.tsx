import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/context/AppContext";
import { AxiosError } from "axios";
import { useConfirm } from "@/core/components/confirmDialog";
import { listDocumentType } from "@/core/service/master";
import { DocumentStudent } from "../types/document-student";
import { DocumentType } from "@/core/types/document-type";
import { FormInput } from "@/core/components/forms/formInput";
import { FormSelect } from "@/core/components/forms/formSelect";
import PdfUploadWithPreview from "./pdfInput";
import { FormLabel } from "@/core/components/ui/label_form";

type Props = {
    item?: DocumentStudent | null;
    onClose: () => void;
    onSuccess: (item: DocumentStudent) => void;
};

export default function StudentDocumentForm({
    item = null,
    onClose,
    onSuccess,
}: Props) {
    const isEdit = !!item;
    const { confirm, ConfirmDialog } = useConfirm();
    const { token, setUser, setToken } = useContext(AppContext);

    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [form, setForm] = useState<DocumentStudent>(
        item || {
            id: "",
            name: "",
            file: "",
            file_name: "",
            created_at: null,
            document_type: null,
            file_url: null,
        }
    );

    useEffect(() => {
        if (token) {
            fetchDocumentTypes();
        }
    }, []);

    async function fetchDocumentTypes() {
        try {
            const res = await listDocumentType();
            if (res.status === 401) {
                setUser(null);
                setToken(null);
            }
            setDocumentTypes(res.data || []);
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
    };

    const handleFileChange = (base64: string) => {
        setForm({ ...form, file: base64 });
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const selectedType = documentTypes.find((t) => t.id === e.target.value);
        if (selectedType) {
            setForm({ ...form, [e.target.name]: selectedType });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!form.document_type?.id)
            newErrors.document_type = "Tipe dokumen wajib dipilih";
        if (!form.name) newErrors.name = "Nama dokumen wajib diisi";
        if (!form.file && !form.file_name)
            newErrors.file = "File dokumen wajib diunggah";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const isConfirmed = await confirm({
            title: isEdit ? "Perbaharui Data" : "Submit Data",
            message: `Apakah Anda yakin ingin ${isEdit ? "memperbarui" : "menambahkan"
                } dokumen ini?`,
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
                            {isEdit ? "Edit Data Dokumen" : "Tambah Dokumen Baru"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {isEdit
                                ? "Lakukan perubahan pada data dokumen"
                                : "Tambahkan data dokumen baru ke dalam sistem"}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 text-xl">
                        ×
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Tipe Dokumen */}
                    <div>

                        <FormSelect
                            label={<FormLabel text="Tipe Dokumen" required />}
                            name="document_type"
                            value={form.document_type?.id ?? ""}
                            onChange={handleInputChange}
                            options={documentTypes.map((type) => ({
                                label: `(${type.code ?? ""}) ${type.name}`,
                                value: type.id,
                            }))}
                            error={errors.document_type}
                        />
                    </div>

                    {/* Nama Dokumen */}
                    <div>

                        <FormInput
                            label={<FormLabel text="Nama Dokumen" required />}
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Contoh: KTP Siswa"
                            error={errors.name}
                        />
                    </div>

                    {/* Upload Dokumen */}
                    <div>
                        <PdfUploadWithPreview
                            label={<FormLabel text="Upload Dokumen PDF" required />}
                            fileUrl={((form.file_name ?? "") !== "" ? (form.file_name ?? "") : (form.file ?? "") !== "" ? form.file : "") ?? ""}
                            onChange={handleFileChange}
                        />
                        {errors.file && (
                            <p className="text-xs text-red-500 mt-1">{errors.file}</p>
                        )}
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
