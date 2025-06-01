import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/core/components/ui/table";
import { StudentClass } from "../types/student-class";



type Props = {
    items: StudentClass[];
};

export default function ManagementClassMembershipTable({ items }: Props) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama Kelas</TableHead>
                        <TableHead>Wali Kelas</TableHead>
                        <TableHead>Jumlah Siswa</TableHead>
                        <TableHead>Kapasitas</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{`${item.name} ${item.part}`}</TableCell>
                            <TableCell>{item.teacher?.name ?? "-"}</TableCell>
                            <TableCell>{item.class_membership_count ?? ""}</TableCell>
                            <TableCell>{item.capacity}</TableCell>
                            <TableCell>
                                <span
                                    className={`px-2 py-1 rounded-4xl text-xs font-bold ${parseInt((item.capacity ?? "0"), 10) === item.class_membership_count
                                        ? "bg-black text-white" : parseInt((item.capacity ?? "0"), 10) - (item.class_membership_count ?? 0) > 5 ? "bg-green-300 text-green-700" : "bg-gray-200 text-gray-600"
                                        }`}
                                >
                                    {parseInt((item.capacity ?? "0"), 10) === (item.class_membership_count ?? 0)
                                        ? "Penuh"
                                        : parseInt((item.capacity ?? "0"), 10) - (item.class_membership_count ?? 0) > 5
                                            ? "Tersedia"
                                            : "Hampir Penuh"}
                                </span>
                            </TableCell>
                        </TableRow>

                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
