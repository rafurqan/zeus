import { Parent } from "../types/parent";
import ParentRow from "./parentRow";



type Props = {
    items: Parent[];
    onDeleted: (item: Parent) => void;
    onEdit: (item: Parent) => void;
};

export default function ParentTable({ items, onDeleted, onEdit }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                    <tr>
                        <th className="px-4 py-2">Nama</th>
                        <th className="px-4 py-2">Hubungan</th>
                        <th className="px-4 py-2">Pekerjaan</th>
                        <th className="px-4 py-2">Penghasilan</th>
                        <th className="px-4 py-2">Pendidikan</th>
                        <th className="px-4 py-2">Kontak</th>
                        <th className="px-4 py-2">Kontak Utama</th>
                        <th className="px-4 py-2 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <ParentRow
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
