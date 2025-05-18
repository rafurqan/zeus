import { AppContext } from "@/context/AppContext";
import { useContext, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ProspectiveStudent } from "../types/prospective-student";
import { removeProspectiveStudent } from "../service/prospectiveStudentService";


type Props = {
    item: ProspectiveStudent;
    index: number;
    onDeleted: (id: string) => void;
    onEdit: (item: ProspectiveStudent) => void;
};

export default function ProspectiveStudentRow({ item, index, onDeleted, onEdit }: Props) {
    const [loading, setLoading] = useState(false);
    const { token } = useContext(AppContext);

    const handleRemove = async () => {
        if (!confirm(`Hapus "${item.full_name}"?`)) return;

        setLoading(true);
        try {
            const response = await removeProspectiveStudent(token, item.id);

            if (!response.data) {
                const error = await response.data.json();
                throw new Error(error.message || "Gagal menghapus data");
            }

            onDeleted(item.id);
        } catch (error: unknown) {
            alert(error instanceof Error ? error.message : "Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <tr className="border-b">
            <td className="px-4 py-2">{index}</td>
            <td className="px-4 py-2">{item.registration_code}</td>
            <td className="px-4 py-2">{item.full_name}</td>
            <td className="px-4 py-2">{item.parents?.[0]?.full_name ?? "Tidak ada data orang tua"}</td>
            <td className="px-4 py-2">{item.village?.sub_district?.city?.name ?? "-"}</td>
            <td className="px-4 py-2">{item.contacts?.[0]?.value ?? "kosong"}</td>
            <td className="px-4 py-2">{new Intl.DateTimeFormat('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(new Date(item.created_at))}</td>
            <td className="px-4 py-2">
                <span
                    className={`px-2 py-1 rounded-4xl text-xs font-bold ${item.status === "rejected"
                        ? "bg-red-500 text-white"
                        : item.status === "approved"
                            ? "bg-green-200 text-black" : "bg-gray-200 text-gray-600"
                        }`}
                >
                    {item.status}
                </span>
            </td>
            <td className="px-4 py-2">
                <span
                    className={`whitespace-nowrap px-2 py-1 rounded-4xl text-xs font-medium ${item.document_status === "Lengkap"
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-600"
                        }`}
                >
                    {item.document_status}
                </span>
            </td>
            <td className="px-4 py-2">NULL</td>
            <td className="px-4 py-2">
                <span
                    className={`px-2 py-1 rounded-4xl text-xs font-medium ${item.full_name === "ACTIVE"
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-600"
                        }`}
                >
                    {item.full_name === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
                </span>
            </td>
            <td className="px-4 py-2">
                <div className="flex justify-end items-center space-x-2">
                    <button
                        className="text-blue-600 hover:text-blue-800 text-lg"
                        onClick={() => onEdit(item)}
                    >
                        <FaEdit />
                    </button>
                    {item.status !== "rejected" && (
                        <button
                            className="text-red-600 hover:text-red-800 text-lg disabled:opacity-50"
                            onClick={handleRemove}
                            disabled={loading}
                        >
                            {loading ? <span className="text-xs">...</span> : <FaTrash />}
                        </button>
                    )}
                </div>
            </td>

        </tr>
    );
}
