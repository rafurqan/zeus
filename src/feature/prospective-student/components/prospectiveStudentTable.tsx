import { ProspectiveStudent } from "../types/prospective-student";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/core/components/ui/table";


type Props = {
    items: ProspectiveStudent[];
    onDeleted: (item: ProspectiveStudent) => void;
    onEdit: (item: ProspectiveStudent) => void;
    onApproved: (item: ProspectiveStudent) => void;
    currentPage: number;
    perPage: number;
};

export default function ProspectiveStudentTable({ items, onDeleted, onApproved, onEdit, currentPage, perPage }: Props) {
    const getStatusBadge = (status: string) => {
        const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap";

        switch (status) {
            case "rejected":
                return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
            case "approved":
                return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
            case "waiting":
                return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-600 border border-gray-200`;
        }
    };

    const getDocumentBadge = (status: string) => {
        const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap";

        return status === "Lengkap"
            ? `${baseClasses} bg-gray-800 text-white`
            : `${baseClasses} bg-gray-100 text-gray-600 border border-gray-200`;
    };

    const getPaymentBadge = (isActive: boolean) => {
        const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap";

        return isActive
            ? `${baseClasses} bg-gray-800 text-white`
            : `${baseClasses} bg-gray-100 text-gray-600 border border-gray-200`;
    };

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">No.</TableHead>
                        <TableHead>Nomor Registrasi</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Nama Orang Tua</TableHead>
                        <TableHead>Kota</TableHead>
                        <TableHead>Kontak</TableHead>
                        <TableHead>Tanggal Daftar</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Dokumen</TableHead>
                        <TableHead>Total Tagihan</TableHead>
                        <TableHead>Status Pembayaran</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell>{(currentPage - 1) * perPage + index + 1}</TableCell>
                            <TableCell>{item.registration_code}</TableCell>
                            <TableCell>{item.full_name}</TableCell>
                            <TableCell>{item.parents?.[0]?.full_name ?? "Tidak ada"}</TableCell>
                            <TableCell>{item.village?.sub_district?.city?.name ?? "-"}</TableCell>
                            <TableCell>{item.phone ?? "kosong"}</TableCell>
                            <TableCell>{new Intl.DateTimeFormat('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            }).format(new Date(item.created_at))}</TableCell>
                            <TableCell className="py-4">
                                <span className={getStatusBadge(item.status)}>
                                    {item.status === "approved" ? "Disetujui" :
                                        item.status === "rejected" ? "Ditolak" :
                                            item.status === "waiting" ? "Menunggu" : item.status}
                                </span>
                            </TableCell>
                            <TableCell className="py-4">
                                <span className={getDocumentBadge(item.document_status)}>
                                    {item.document_status}
                                </span>
                            </TableCell>
                            <TableCell>
                                NULL
                            </TableCell>
                            <TableCell className="py-4">
                                <span className={getPaymentBadge(item.full_name === "ACTIVE")}>
                                    {item.full_name === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
                                </span>
                            </TableCell>
                            <TableCell className="py-4">
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105"
                                        onClick={() => onEdit(item)}
                                        title="Edit"
                                    >
                                        <FaEdit className="w-4 h-4" />
                                    </button>
                                    {item.status === "waiting" && (
                                        <button
                                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-105"
                                            onClick={() => onApproved(item)}
                                            title="Approve"
                                        >
                                            <FaCheck className="w-4 h-4" />
                                        </button>
                                    )}
                                    {item.status === "waiting" && (
                                        <button
                                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105"
                                            onClick={() => onDeleted(item)}
                                            title="Delete"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

    );
}
