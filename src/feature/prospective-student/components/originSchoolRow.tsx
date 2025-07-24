import { FaEdit, FaTrash } from "react-icons/fa";
import { OriginSchool } from "../types/origin-school";


type Props = {
    item: OriginSchool;
    onDeleted: (item: OriginSchool) => void;
    onEdit: (item: OriginSchool) => void;
};

export default function OriginSchoolRow({ item, onDeleted, onEdit }: Props) {


    return (
        <tr className="border-b">

            <td className="px-4 py-2">{item.school_name}</td>
            <td className="px-4 py-2">{item.education?.name}</td>
            <td className="px-4 py-2">{item.school_type?.name}</td>
            <td className="px-4 py-2">{item.npsn}</td>
            <td className="px-4 py-2">{item.graduation_year}</td>
            <td className="px-4 py-2">{item.address_name}</td>
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
