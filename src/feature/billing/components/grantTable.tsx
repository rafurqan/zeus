import { Grant } from "@/feature/billing/types/grant";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/core/components/ui/table";
import { FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { Button } from "@/core/components/ui/button";
import { useState } from "react";

type Props = {
    items: Grant[];
    onDeleted: (item: Grant) => void;
    onEdit: (item: Grant) => void;
    onReset: (item: Grant) => void;
};

export default function GrantTable({ items, onDeleted, onEdit, onReset }: Props) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Grant | null>(null);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [resetItem, setResetItem] = useState<Grant | null>(null);

    const handleReset = (item: Grant) => {
        setResetItem(item);
        setShowResetConfirm(true);
    };

    const confirmReset = () => {
        if (resetItem) {
            onReset(resetItem);
            setShowResetConfirm(false);
            setResetItem(null);
        }
    };


    const handleDelete = (item: Grant) => {
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
                        <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus dana hibah ini?</p>
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

            {showResetConfirm && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black/30" onClick={() => setShowResetConfirm(false)} />
                    <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Konfirmasi Reset</h3>
                        <p className="text-gray-600 mb-6">
                            Anda akan mereset total dana terpakai untuk hibah <b>{resetItem?.grants_name}</b>. Lanjutkan?
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowResetConfirm(false);
                                    setResetItem(null);
                                }}
                            >
                                Batal
                            </Button>
                            <Button variant="default" onClick={confirmReset}>
                                Reset
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
                        <TableHead>Donatur</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Sisa</TableHead>
                        <TableHead>Tanggal Diterima</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell className="font-medium">{item.code}</TableCell>
                            <TableCell>{item.grants_name}</TableCell>
                            <TableCell>{item.donor_name}</TableCell>
                            <TableCell>
                                {item.donation_type === '1' ? 'Individu' :
                                 item.donation_type === '2' ? 'Organisasi' :
                                 item.donation_type === '3' ? 'Kelompok' :
                                 item.donation_type}
                            </TableCell>
                            <TableCell>{new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR'
                            }).format(item.total_funds)}</TableCell>
                            <TableCell>
                                {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR'
                                }).format(item.total_funds - (item.total_used_funds ?? 0))}
                                {' '}
                            </TableCell>
                            <TableCell>{`${item.acceptance_date ? new Date(item.acceptance_date).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            }) : '-'}`}</TableCell>
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
                                    <button
                                        className="text-red-600 hover:text-yellow-800 text-sm font-medium"
                                        onClick={() => handleReset(item)}
                                    >
                                        <FaTimes />
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