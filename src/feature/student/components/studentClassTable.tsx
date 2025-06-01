import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/core/components/ui/table";
import { FaEdit, FaTrash } from "react-icons/fa";
import { StudentClass } from "../types/student-class";



type Props = {
    items: StudentClass[];
    onDeleted: (item: StudentClass) => void;
    onEdit: (item: StudentClass) => void;
};

export default function StudentClassTable({ items, onDeleted, onEdit }: Props) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Part</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Kapasitas</TableHead>
                        <TableHead>Tahun Ajaran</TableHead>
                        <TableHead>Guru</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.part}</TableCell>
                            <TableCell>{item.program?.name ?? ""}</TableCell>
                            <TableCell>{item.capacity}</TableCell>
                            <TableCell>{item.academic_year}</TableCell>
                            <TableCell>{item.teacher?.name ?? ""}</TableCell>
                            <TableCell>
                                <span
                                    className={`px-2 py-1 rounded-4xl text-xs font-bold ${item.status === "ACTIVE"
                                        ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                                        }`}
                                >
                                    {item.status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
                                </span>
                            </TableCell>
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
