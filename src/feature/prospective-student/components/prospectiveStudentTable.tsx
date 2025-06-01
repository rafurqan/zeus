import { ProspectiveStudent } from "../types/prospective-student";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/core/components/ui/table";


type Props = {
    items: ProspectiveStudent[];
    onDeleted: (item: ProspectiveStudent) => void;
    onEdit: (item: ProspectiveStudent) => void;
};

export default function ProspectiveStudentTable({ items, onDeleted, onEdit }: Props) {
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
                            <TableCell>{index + 1}</TableCell>
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
                            <TableCell>
                                <span
                                    className={`px-2 py-1 rounded-4xl text-xs font-bold ${item.status === "rejected"
                                        ? "bg-red-500 text-white"
                                        : item.status === "approved"
                                            ? "bg-green-200 text-black" : "bg-gray-200 text-gray-600"
                                        }`}
                                >
                                    {item.status}
                                </span>
                            </TableCell>
                            <TableCell>
                                <span
                                    className={`whitespace-nowrap px-2 py-1 rounded-4xl text-xs font-medium ${item.document_status === "Lengkap"
                                        ? "bg-black text-white"
                                        : "bg-gray-200 text-gray-600"
                                        }`}
                                >
                                    {item.document_status}
                                </span>
                            </TableCell>
                            <TableCell>
                                NULL
                            </TableCell>
                            <TableCell>
                                <span
                                    className={`px-2 py-1 rounded-4xl text-xs font-medium ${item.full_name === "ACTIVE"
                                        ? "bg-black text-white"
                                        : "bg-gray-200 text-gray-600"
                                        }`}
                                >
                                    {item.full_name === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-end items-center space-x-2">
                                    <button
                                        className="text-blue-600 hover:text-blue-800 text-lg"
                                        onClick={() => onEdit(item)}
                                    >
                                        <FaEdit />
                                    </button>
                                    {item.status !== "rejected" && (
                                        <button
                                            className="text-red-600 hover:text-red-800 text-lg disabled:opacity-50"
                                            onClick={() => onDeleted(item)}>
                                            <FaTrash />
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
