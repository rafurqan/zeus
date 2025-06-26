import React, { useRef, useState, useEffect } from "react";
import { FilePlus, FileCheck } from "lucide-react";

interface Props {
    label?: string;
    fileUrl?: string; // untuk edit, file URL dari API
    onChange: (base64: string) => void; // Pastikan menerima string (bukan string | null)
}

const PdfUploadWithPreview: React.FC<Props> = ({ label = "Upload PDF", fileUrl, onChange }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileBase64, setFileBase64] = useState<string>(""); // Ganti dengan string kosong

    useEffect(() => {
        if (fileUrl) {
            // Jika sudah ada file URL (misalnya edit form), tampilkan ikon check
            setFileBase64(fileUrl); // Kirimkan URL ke base64 sebagai string
        }
    }, [fileUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);

            // Mengubah file menjadi base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setFileBase64(base64);
                onChange(base64); // Pastikan mengirimkan string
            };
            reader.readAsDataURL(file);
        } else {
            alert("Hanya file PDF yang diperbolehkan.");
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className="flex flex-col justify-center gap-2">
            <label className="block text-sm font-medium  text-gray-700">{label}</label>

            <div
                className="w-32 h-32 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={handleClick}
            >
                {fileBase64 ? (
                    <FileCheck className="w-10 h-10 text-green-600" />
                ) : (
                    <FilePlus className="w-10 h-10 text-gray-400" />
                )}
            </div>

            {fileBase64 ? (
                <p className="text-sm text-gray-700 ">{selectedFile ? selectedFile.name : "File PDF Terpilih"}</p>
            ) : (
                <p className="text-sm text-gray-500 ">Pilih File PDF</p>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
};

export default PdfUploadWithPreview;
