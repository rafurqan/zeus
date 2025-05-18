import { Teacher } from "@/feature/teacher/types/teacher";
import Row from "./row";



type Props = {
    items: Teacher[];
    onDeleted: (item: Teacher) => void;
    onEdit: (item: Teacher) => void;
};

export default function Table({ items, onDeleted, onEdit }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                    <tr>
                        <th className="px-4 py-2">Nama</th>
                        <th className="px-4 py-2">Nip</th>
                        <th className="px-4 py-2">Tempat, Tanggal Lahir</th>
                        <th className="px-4 py-2">Lulusan Dari</th>
                        <th className="px-4 py-2">Pendidikan Terakhir</th>
                        <th className="px-4 py-2 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <Row
                            key={item.id}
                            item={item}
                            onDeleted={onDeleted}
                            onEdit={onEdit}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
