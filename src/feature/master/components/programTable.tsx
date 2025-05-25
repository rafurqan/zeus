
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/core/components/ui/table";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Program } from "../types/program";



type Props = {
    items: Program[];
    onDeleted: (item: Program) => void;
    onEdit: (item: Program) => void;
};

export default function ProgramTable({ items, onDeleted, onEdit }: Props) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead>Jenjang</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.level}</TableCell>
                            <TableCell><span
                                className={`px-2 py-1 rounded-4xl text-xs font-medium ${item.status === "ACTIVE"
                                    ? "bg-black text-white"
                                    : "bg-gray-200 text-gray-600"
                                    }`}
                            >
                                {item.status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
                            </span></TableCell>
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
