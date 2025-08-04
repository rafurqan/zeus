import { useState } from "react";
import { EducationLevel } from "@/core/types/education-level";
import toast from "react-hot-toast";
import { addEducationLevel, updateEducationLevel } from "@/core/service/master";
import { AxiosError } from "axios";



type Props = {
  item?: EducationLevel | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EducationLevelForm({
  item = null,
  onClose,
  onSuccess,
}: Props) {
  const isEdit = !!item;

  const [form, setForm] = useState({
    name: item?.name || "",
    description: item?.description || "",
    level: item?.level || "Dasar",
    status: item?.status || "ACTIVE",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {

      if (isEdit) {
        await updateEducationLevel({
          id: item?.id || "",
          description: form.description,
          level: form.level,
          name: form.name,
          status: form.status,
        });
      } else {
        await addEducationLevel({
          id: "",
          description: form.description,
          level: form.level,
          name: form.name,
          status: form.status,
        });
      }

      onSuccess();
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data.message ?? "Terjadi kesalahan saat menyimpan data."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold">
              {isEdit ? "Edit Riwayat Pendidikan" : "Tambah Riwayat Pendidikan Baru"}
            </h2>
            <p className="text-sm text-gray-500">
              {isEdit
                ? "Ubah data riwayat pendidikan"
                : "Tambahkan riwayat pendidikan baru ke dalam sistem"}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 text-xl">
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-medium">Nama Pendidikan</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Sekolah Dasar"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black hover:border-black focus:ring-0"
            />
          </div>

          <div>
            <label className="block font-medium">Deskripsi</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Deskripsi singkat tentang program"
              className="w-full border border-gray-100 shadow-none rounded px-3 py-2 focus:outline-none focus:border-black hover:border-black focus:ring-0"
            />
          </div>

          <div>
            <label className="block font-medium">Jenjang</label>
            <select
              name="level"
              value={form.level}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black hover:border-black focus:ring-0"
            >
              <option value="Dasar">Dasar</option>
              <option value="Menengah">Menengah</option>
              <option value="Atas">Atas</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black hover:border-black focus:ring-0"
            >
              <option value="ACTIVE">Aktif</option>
              <option value="INACTIVE">Tidak Aktif</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
