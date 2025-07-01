
import { FaEye } from "react-icons/fa";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/core/components/ui/table";
import { Student } from "../types/student";
import { Switch } from "@/core/components/ui/switch";
import { Invoice } from "@/feature/finance/types/invoice";


type Props = {
    items: Student[];
    onEdit: (item: Student) => void;
    onStatusChange: (item: Student, checked: boolean) => void;
    currentPage: number;
    perPage: number;
};

export default function StudentTable({ items, onEdit, onStatusChange, currentPage, perPage }: Props) {
    const getStatusBadge = (status: string) => {
        const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap";

        switch (status) {
            case "rejected":
                return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
            case "approved":
                return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
            case "waiting":
                return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
            case "active":
                return `${baseClasses} bg-black text-white border border-black`;
            case "inactive":
                return `${baseClasses} bg-gray-100 text-gray-600 border border-gray-200`;
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

    const getBackgroundColor = (item: Student) => {
        if (item.special_condition?.name === "Anak Guru") {
            return "bg-purple-50";
        } else if (item.special_condition?.name === "Anak Yatim") {
            return "bg-yellow-50";
        } else {
            return "bg-white";
        }
    };

    const getPaymentStatus = (item: Student) => {
        const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap";

        const totalInvoices = item.invoices ? item.invoices.length : 0
        const paidInvoices = item.invoices ? item.invoices.filter((p: Invoice) => p.status === "Lunas").length : 0
        const pendingInvoices = item.invoices ? item.invoices.filter((p: Invoice) => p.status === "Menunggu Pembayaran").length : 0
        const overdueInvoices = item.invoices ? item.invoices.filter((p: Invoice) => p.status === "Terlambat").length : 0

        const totalAmount = item.invoices ? item.invoices.reduce((sum: number, p: Invoice) => sum + p.total, 0) : 0

        const paidAmount = item.invoices
            ? item.invoices.filter((p: Invoice) => p.status === "Lunas").reduce((sum: number, p: Invoice) => sum + p.total, 0)
            : 0

        const pendingAmount = item.invoices
            ? item.invoices
                .filter((p: Invoice) => p.status === "Menunggu Pembayaran" || p.status === "Terlambat")
                .reduce((sum: number, p: Invoice) => sum + p.total, 0)
            : 0

        if (totalInvoices === 0) {
            return <span className={`${baseClasses} bg-gray-100 text-gray-600 border border-gray-200`}>
                Tidak ada tagihan
            </span>
        }
        if (paidInvoices === totalInvoices) {
            return <span className={`${baseClasses} bg-gray-800 text-white`}>
                {`Lunas (${formatCurrency(paidAmount)})`}
            </span>
        } else if (pendingInvoices > 0 || overdueInvoices > 0) {
            return <span className={`${baseClasses} bg-amber-500 text-white`}>
                {`Menunggu Pembayaran (${formatCurrency(pendingAmount)})`}
            </span>
        } else {
            return <span className={`${baseClasses} bg-red-500 text-white`}>
                {`Belum Dibayar (${formatCurrency(totalAmount - paidAmount)})`}
            </span>
        }
    }

    const handleStatusToggle = (item: Student, checked: boolean) => {
        onStatusChange(item, checked);
    }

    // Helper function to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }



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
                        <TableRow key={item.id} className={getBackgroundColor(item)}>
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
                                            item.status === "waiting" ? "Menunggu" :
                                                item.status === "active" ? "Aktif" :
                                                    item.status === "inactive" ? "Tidak Aktif" : item.status}
                                </span>
                            </TableCell>
                            <TableCell className="py-4">
                                <span className={getDocumentBadge(item.document_status)}>
                                    {item.document_status}
                                </span>
                            </TableCell>
                            <TableCell>
                                {
                                    formatCurrency(item.invoices ? item.invoices.reduce((sum: number, p: Invoice) => sum + p.total, 0) : 0)
                                }
                            </TableCell>
                            <TableCell className="py-4">
                                {getPaymentStatus(item)}
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-end items-center space-x-2">
                                    <button
                                        className="text-gray-400 hover:text-gray-600 text-lg"
                                        onClick={() => onEdit(item)}
                                    >
                                        <FaEye />
                                    </button>
                                    <Switch
                                        checked={item.status === "active"}
                                        onCheckedChange={(checked) => handleStatusToggle(item, checked)}
                                        aria-label="Ubah status"
                                    />
                                </div>

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

    );
}
