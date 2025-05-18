import { Teacher } from "@/feature/teacher/types/teacher";
import { FaEdit, FaTrash } from "react-icons/fa";


type Props = {
    item: Teacher;
    onDeleted: (item: Teacher) => void;
    onEdit: (item: Teacher) => void;
};

export default function Row({ item, onDeleted, onEdit }: Props) {


    return (
        <tr className="border-b">
            <td className="px-4 py-2">{item.name}</td>
            <td className="px-4 py-2">{item.nip}</td>
            <td className="px-4 py-2">{item.birth_place} {new Intl.DateTimeFormat('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(new Date(item.birth_date))}</td>
            <td className="px-4 py-2">{item.graduated_from}</td>
            <td className="px-4 py-2">{item.education_level?.name}</td>
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
