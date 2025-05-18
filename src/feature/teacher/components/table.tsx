import { Teacher } from "@/feature/teacher/types/teacher";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/core/components/ui/table";
import { FaEdit, FaTrash } from "react-icons/fa";



type Props = {
    items: Teacher[];
    onDeleted: (item: Teacher) => void;
    onEdit: (item: Teacher) => void;
};

export default function TeacherTable({ items, onDeleted, onEdit }: Props) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        {/* <TableHead className="w-12">No.</TableHead> */}
                        <TableHead>Nama</TableHead>
                        <TableHead>Nip</TableHead>
                        <TableHead>Tempat, Tanggal Lahir</TableHead>
                        <TableHead>Lulusan Dari</TableHead>
                        <TableHead>Pendidikan Terakhir</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.nip}</TableCell>
                            <TableCell>{new Intl.DateTimeFormat('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            }).format(new Date(item.birth_date))}</TableCell>
                            <TableCell>{item.graduated_from}</TableCell>
                            <TableCell>{item.education_level?.name ?? ""}</TableCell>
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
