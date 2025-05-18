import { EducationLevel } from "@/core/types/education-level";
import EducationLevelRow from "./education_level_row";



type Props = {
  items: EducationLevel[];
  onDeleted: () => void;
  onEdit: (item: EducationLevel) => void;
};

export default function EducationLevelTable({ items, onDeleted, onEdit }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100 text-left text-sm font-medium text-gray-700">
          <tr>
            <th className="px-4 py-2">Nama Program</th>
            <th className="px-4 py-2">Deskripsi</th>
            <th className="px-4 py-2">Jenjang</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <EducationLevelRow
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
