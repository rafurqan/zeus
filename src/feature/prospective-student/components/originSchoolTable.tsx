
import { OriginSchool } from "../types/origin-school";
import OriginSchoolRow from "./originSchoolRow";



type Props = {
    items: OriginSchool[];
    onDeleted: (item: OriginSchool) => void;
    onEdit: (item: OriginSchool) => void;
};

export default function TableOriginSchool({ items, onDeleted, onEdit }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
                <thead className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                    <tr>
                        <th className="px-4 py-2">Nama Sekolah</th>
                        <th className="px-4 py-2">Tingkat Sekolah</th>
                        <th className="px-4 py-2">Jenis Sekolah</th>
                        <th className="px-4 py-2">NPSN Sekolah</th>
                        <th className="px-4 py-2">Tahun Lulus</th>
                        <th className="px-4 py-2">Alamat Sekolah</th>
                        <th className="px-4 py-2 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <OriginSchoolRow
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
