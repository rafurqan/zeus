import { FaEdit, FaTrash } from "react-icons/fa";
import { Parent } from "../types/parent";


type Props = {
    item: Parent;
    onDeleted: (item: Parent) => void;
    onEdit: (item: Parent) => void;
};

export default function ParentRow({ item, onDeleted, onEdit }: Props) {
    function getParentTypeLabel(type: string | null | undefined): string {
        switch (type) {
            case 'father':
                return 'Ayah';
            case 'mother':
                return 'Ibu';
            case 'other':
                return 'Lainnya';
            default:
                return '-';
        }
    }

    return (
        <tr className="border-b">
            <td className="px-4 py-2">{item.full_name}</td>
            <td className="px-4 py-2">{getParentTypeLabel(item.parent_type)}</td>
            <td className="px-4 py-2">{item.occupation}</td>
            <td className="px-4 py-2">Rp.{item.income_range?.name ?? "0"}</td>
            <td className="px-4 py-2">{item.education_level?.name}</td>
            <td className="px-4 py-2">{item.phone}</td>
            <td className="px-4 py-2">
                {item.is_main_contact ? 'Iya' : 'Tidak'}
            </td>
            <td className="px-4 py-2 flex justify-center space-x-2">
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
            </td>
        </tr>
    );
}
