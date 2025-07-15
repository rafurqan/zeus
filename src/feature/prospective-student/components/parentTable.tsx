import { FaEdit, FaTrash } from "react-icons/fa";
import { Parent } from "../types/parent";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/core/components/ui/table";



type Props = {
    items: Parent[];
    onDeleted: (item: Parent) => void;
    onEdit: (item: Parent) => void;
};

export default function ParentTable({ items, onDeleted, onEdit }: Props) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Hubungan</TableHead>
                        <TableHead>Pekerjaan</TableHead>
                        <TableHead>Penghasilan</TableHead>
                        <TableHead>Pendidikan</TableHead>
                        <TableHead>Kontak</TableHead>
                        <TableHead>Kontak Utama</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.full_name}</TableCell>
                            <TableCell>{item.parent_type?.name ?? '-'}</TableCell>
                            <TableCell>{item.occupation}</TableCell>
                            <TableCell>{item.income_range?.name ?? ""}</TableCell>
                            <TableCell>{item.education_level?.name ?? ""}</TableCell>
                            <TableCell>{item.phone}</TableCell>
                            <TableCell>{item.is_main_contact ? 'Iya' : 'Tidak'}</TableCell>
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
