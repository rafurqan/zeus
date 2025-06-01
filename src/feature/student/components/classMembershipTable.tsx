import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/core/components/ui/table";
import { FaSync } from "react-icons/fa";
import { ClassMembership } from "../types/student-class-membership";



type Props = {
    items: ClassMembership[];
    onChange: (item: ClassMembership) => void;
};

export default function ClassMembershipTable({ items, onChange }: Props) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama Siswa</TableHead>
                        <TableHead>Jenis Kelamin</TableHead>
                        <TableHead>NISN</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Kelas</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.full_name}</TableCell>
                            <TableCell>{item.gender === "male" ? "L" : "P"}</TableCell>
                            <TableCell>{item.nisn || '-'}</TableCell>
                            <TableCell>{item.type === "student" ? "Siswa" : "Calon Siswa"}</TableCell>
                            <TableCell>{`${item.active_class?.name ?? "-"} - ${item.active_class?.part ?? ""}`}</TableCell>
                            <TableCell>
                                <div className=" py-2 space-x-2">
                                    <button
                                        className="text-blue-600 hover:text-blue-800"
                                        onClick={() => onChange(item)}
                                    >
                                        <FaSync />
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
