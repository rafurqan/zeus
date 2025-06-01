import { FaEdit, FaFilePdf, FaTrash } from "react-icons/fa";
import { DocumentStudent } from "../types/document-student";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/core/components/ui/table";



type Props = {
    items: DocumentStudent[];
    onDeleted: (item: DocumentStudent) => void;
    onEdit: (item: DocumentStudent) => void;
};

export default function TableDocument({ items, onDeleted, onEdit }: Props) {
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
                            <TableCell>{(item.file !== "") ? (
                                <div className="ml-2 mt-2 ">
                                    <FaFilePdf className="w-6 h-6 text-red-500" />
                                </div>
                            ) : (
                                <div className="ml-2 w-6 h-6" />  // Placeholder kosong untuk menjaga lebar tetap
                            )}</TableCell>
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
        </div>

    );
}
