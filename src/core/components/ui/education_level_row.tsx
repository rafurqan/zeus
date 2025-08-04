import { deleteEducationLevel } from "@/core/service/master";
import { EducationLevel } from "@/core/types/education-level";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useConfirm } from "../confirmDialog";


type Props = {
  item: EducationLevel;
  onDeleted: (id: string) => void;
  onEdit: (item: EducationLevel) => void;
};

export default function EducationLevelRow({ item, onDeleted, onEdit }: Props) {
  const [loading, setLoading] = useState(false);
  const { confirm, ConfirmDialog } = useConfirm();

  const handleRemove = async () => {
    const isConfirmed = await confirm({
      title: "Hapus Data",
      message: `Apakah Anda yakin ingin menghapus riwayat pendidikan ini?`,
      confirmText: "Ya, Lanjutkan",
      cancelText: "Batal",
    });
    if (isConfirmed) {
      try {
        await deleteEducationLevel(item.id);
        onDeleted(item.id);
      } catch (error: unknown) {
        toast.error(
          error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus data"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <tr className="border-b">
        <td className="px-4 py-2">{item.name}</td>
        <td className="px-4 py-2">{item.description}</td>
        <td className="px-4 py-2">{item.level}</td>
        <td className="px-4 py-2">
          <span
            className={`px-2 py-1 rounded-4xl text-xs font-medium ${item.status === "ACTIVE"
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-600"
              }`}
          >
            {item.status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
          </span>
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
            onClick={handleRemove}
            disabled={loading}
          >
            {loading ? <span className="text-xs">...</span> : <FaTrash />}
          </button>
        </td>
      </tr>
      {ConfirmDialog}
    </div>
  );
}
