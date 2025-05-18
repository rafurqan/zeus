import { DocumentStudent } from "../types/document-student";
import DocumentRow from "./documentRow";



type Props = {
    items: DocumentStudent[];
    onDeleted: (item: DocumentStudent) => void;
    onEdit: (item: DocumentStudent) => void;
};

export default function TableDocument({ items, onDeleted, onEdit }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                    <tr>
                        <th className="px-4 py-2">Tipe Dokumen</th>
                        <th className="px-4 py-2">Nama</th>
                        <th className="px-4 py-2">File</th>
                        <th className="px-4 py-2">Tanggal Dibuat</th>
                        <th className="px-4 py-2 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <DocumentRow
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
