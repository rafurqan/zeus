import { Billing } from "@/feature/billing/types/billing";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/core/components/ui/table";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Button } from "@/core/components/ui/button";
// import Pagination from "@/core/components/forms/pagination";

type Props = {
    items: Billing[];
    onDeleted: (item: Billing) => void;
    onEdit: (item: Billing) => void;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    meta?: any;
};

export default function BillingTable({ 
    items, 
    onDeleted, 
    onEdit, 
    currentPage = 1, 
    totalPages = 1, 
    onPageChange,
    meta 
}: Props) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Billing | null>(null);

    const handleDelete = (item: Billing) => {
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

    const startItem = meta ? ((currentPage - 1) * 10) + 1 : 0;

    return (
        <div className="overflow-x-auto">
            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black/30" onClick={() => setShowDeleteConfirm(false)} />
                    <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
                        <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus item ini?</p>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                className="text-blue-600 hover:text-blue-800 border-blue-600 hover:border-blue-800"
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setSelectedItem(null);
                                }}
                            >
                                Batal
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
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
                        <TableHead>ID</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Frekuensi</TableHead>
                        <TableHead>Berlaku Untuk</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{startItem + index}</TableCell>
                            <TableCell className="font-medium">{item.code ?? '-'}</TableCell>
                            <TableCell>{item.service_name ?? '-'}</TableCell>
                            <TableCell>
                                {(() => {
                                    switch (item.category) {
                                        case "1":
                                            return "Registrasi";
                                        case "2":
                                            return "Buku";
                                        case "3":
                                            return "Seragam";
                                        case "4":
                                            return "SPP";
                                        case "5":
                                            return "Uang Gedung";
                                        case "6":
                                            return "Kegiatan";
                                        case "7":
                                            return "Ujian";
                                        case "8":
                                            return "Wisuda";
                                        case "9":
                                            return "Lainnya";
                                        default:
                                            return "-";
                                    }
                                })()}
                            </TableCell>
                            <TableCell>{item.program ?? '-'}</TableCell>
                            <TableCell>{new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR'
                            }).format(item.price)}</TableCell>
                            <TableCell>
                                {(() => {
                                    const frequencyMap: Record<string, string> = {
                                        "0": "Bulanan",
                                        "1": "Per Semester", 
                                        "2": "Tahunan",
                                        "3": "Satu Kali"
                                    };
                                    return frequencyMap[item.frequency] || "-";
                                })()}
                            </TableCell>
                            <TableCell>{item.applies_to ?? '-'}</TableCell>
                            <TableCell>
                                {item.is_active === 'Y' ? (
                                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Aktif</span>
                                ) : (
                                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Tidak Aktif</span>
                                )}
                            </TableCell>
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

            {/* Pagination */}
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