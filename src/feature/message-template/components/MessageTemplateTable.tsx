import { MessageTemplate } from "../types/messageTemplate";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/core/components/ui/table";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Button } from "@/core/components/ui/button";

type Props = {
    items: MessageTemplate[];
    onDeleted: (item: MessageTemplate) => void;
    onEdit: (item: MessageTemplate) => void;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    meta?: any;
};

export default function MessageTemplateTable({ 
    items, 
    onDeleted, 
    onEdit, 
    currentPage = 1, 
    totalPages = 1, 
    onPageChange 
}: Props) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MessageTemplate | null>(null);

    const handleDelete = (item: MessageTemplate) => {
        setSelectedItem(item);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (selectedItem) {
            onDeleted(selectedItem);
            setShowDeleteConfirm(false);
            setSelectedItem(null);
        }
    };

    return (
        <div className="overflow-x-auto">
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black/30" onClick={() => setShowDeleteConfirm(false)} />
                    <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
                        <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus template pesan ini?</p>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setSelectedItem(null);
                                }}
                            >
                                Batal
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
                            >
                                Hapus
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Body</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{((currentPage - 1) * 10) + index + 1}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell><div className="truncate">{item.body}</div></TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <button
                                        className="text-blue-600 hover:text-blue-800"
                                        onClick={() => onEdit(item)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => handleDelete(item)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => onPageChange && onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm">Halaman {currentPage} dari {totalPages}</span>
                <button
                    onClick={() => onPageChange && onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}