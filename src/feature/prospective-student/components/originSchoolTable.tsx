
import { FaEdit, FaTrash } from "react-icons/fa";
import { OriginSchool } from "../types/origin-school";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/core/components/ui/table";



type Props = {
    items: OriginSchool[];
    onDeleted: (item: OriginSchool) => void;
    onEdit: (item: OriginSchool) => void;
};

export default function TableOriginSchool({ items, onDeleted, onEdit }: Props) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama Sekolah</TableHead>
                        <TableHead>Tingkat Sekolah</TableHead>
                        <TableHead>Jenis Sekolah</TableHead>
                        <TableHead>NPSN Sekolah</TableHead>
                        <TableHead>Tahun Lulus</TableHead>
                        <TableHead>Alamat Sekolah</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.school_name}</TableCell>
                            <TableCell>{item.education?.name}</TableCell>
                            <TableCell>{item.school_type?.name}</TableCell>
                            <TableCell>{item.npsn}</TableCell>
                            <TableCell>{item.graduation_year}</TableCell>
                            <TableCell>{item.address_name}</TableCell>
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
