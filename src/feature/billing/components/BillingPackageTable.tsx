import { packageRate, PackageRate } from "@/feature/billing/types/ratePackage";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/core/components/ui/table";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Button } from "@/core/components/ui/button";

type Props = {
    items: packageRate[];
    onDeleted: (item: packageRate) => void;
    onEdit: (item: packageRate) => void;
};

export default function BillingPackageTable({ items, onDeleted, onEdit }: Props) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedItem, setSelectedItem] = useState<packageRate | null>(null);

    const handleDelete = (item: packageRate) => {
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
                        <TableHead>ID</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Jumlah Item</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.code ?? '-'}</TableCell>
                            <TableCell>{item.service_name ?? '-'}</TableCell>
                            <TableCell>{item.program ?? '-'}</TableCell>
                            <TableCell>
                                {item.child_ids ? 
                                    (typeof item.child_ids === 'string' 
                                        ? JSON.parse(item.child_ids).length 
                                        : Array.isArray(item.child_ids) 
                                            ? item.child_ids.length 
                                            : Object.keys(item.child_ids).length) 
                                    : '-'}
                            </TableCell>
                            <TableCell>{new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR'
                            }).format(item.total_price)}</TableCell>
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
        </div>
    );
}