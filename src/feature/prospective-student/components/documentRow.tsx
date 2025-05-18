import { FaEdit, FaFilePdf, FaTrash } from "react-icons/fa";
import { DocumentStudent } from "../types/document-student";


type Props = {
    item: DocumentStudent;
    onDeleted: (item: DocumentStudent) => void;
    onEdit: (item: DocumentStudent) => void;
};

export default function DocumentRow({ item, onDeleted, onEdit }: Props) {


    return (
        <tr className="border-b">
            <td className="px-4 py-2">{item.document_type?.name}</td>
            <td className="px-4 py-2">{item.name}</td>
            {(item.file !== "") ? (
                <div className="ml-2 mt-2 ">
                    <FaFilePdf className="w-6 h-6 text-red-500" />
                </div>
            ) : (
                <div className="ml-2 w-6 h-6" />  // Placeholder kosong untuk menjaga lebar tetap
            )}
            <td className="px-4 py-2">{item.created_at} {new Intl.DateTimeFormat('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(new Date(item.created_at ?? new Date()))}</td>
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
