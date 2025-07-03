import { FaEdit, FaFilePdf, FaTrash } from "react-icons/fa";
import { DocumentStudent } from "../types/document-student";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/core/components/ui/table";
import { useState } from "react";
import PDFPreviewModal from "@/core/components/ui/pdf_viewer";



type Props = {
    items: DocumentStudent[];
    onDeleted: (item: DocumentStudent) => void;
    onEdit: (item: DocumentStudent) => void;
};

type PDFSource = { type: 'url'; value: string } | { type: 'base64'; value: string };


export default function TableDocument({ items, onDeleted, onEdit }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activePdfSource, setActivePdfSource] = useState<PDFSource | null>(null);

    const openModal = (source: PDFSource) => {
        setActivePdfSource(source);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setActivePdfSource(null); 
    };


    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tipe Dokumen</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>File</TableHead>
                        <TableHead>Tanggal Dibuat</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.document_type?.name}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                                {item.file_name || item.file ? (
                                    <button
                                        onClick={() =>
                                            openModal({
                                                type: item.file_url ? "url" : "base64",
                                                value: item.file_url || item.file || "",
                                            })
                                        }
                                        className="ml-2 mt-2 flex flex-col items-center cursor-pointer transition-opacity opacity-90 hover:opacity-100 hover:text-red-600"
                                        title="Lihat Dokumen"
                                        aria-label="Lihat dokumen PDF"
                                    >
                                        <FaFilePdf className="w-6 h-6 text-red-500" />
                                        <span className="text-xs mt-1 text-red-600">Lihat</span>
                                    </button>
                                ) : (
                                    <div className="ml-2 w-6 h-6" />
                                )}
                            </TableCell>
                            <TableCell>{item.created_at} {new Intl.DateTimeFormat('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            }).format(new Date(item.created_at ?? new Date()))}</TableCell>
                            <TableCell>
                                <div className="px-4 py-2 space-x-2">
                                    <button
                                        className="text-blue-600 hover:text-blue-800"
                                        onClick={() => onEdit(item)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className={`text-red-600 hover:text-red-800 disabled:opacity-50`}
                                        onClick={() => onDeleted(item)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>

                            </TableCell>
                        </TableRow>

                    ))}
                </TableBody>
            </Table>
            {activePdfSource && (
                <PDFPreviewModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    source={activePdfSource}
                    title="Pratinjau Dokumen PDF"
                />
            )}
        </div>

    );
}
