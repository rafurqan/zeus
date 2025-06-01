import { useContext, useEffect, useState } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

import { teacherService } from "../service/teacherService";
import { AppContext } from "@/context/AppContext";
import { Teacher } from "../types/teacher";

export const useTeacher = () => {
  const [data, setData] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false); // Indikator loading untuk tabel/daftar
  const [loadingOverlay, setLoadingOverlay] = useState(false); // Indikator loading untuk overlay layar penuh
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useContext(AppContext);

  // Mengambil semua data guru
  const fetchAll = async () => {
    try {
      setLoading(true);
      const result = await teacherService.getAll();
      setData(result);
      setError(null); // Hapus error sebelumnya jika berhasil
    } catch (err: unknown) {
      console.error("Gagal memuat data guru:", err);
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
          setUser(null); // Memicu redirect ke halaman login
        } else {
          const errorMessage =
            err.response?.data?.message || "Gagal memuat data guru.";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } else {
        setError("Terjadi kesalahan tak terduga.");
        toast.error("Terjadi kesalahan tak terduga.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Membuat data guru baru
  const create = async (payload: Teacher) => {
    try {
      setLoadingOverlay(true);
      const result = await teacherService.create(payload);
      await fetchAll(); // Muat ulang data setelah berhasil membuat
      toast.success("Berhasil menambah data guru.");
      return result;
    } catch (err: unknown) {
      console.error("Gagal membuat data guru:", err);
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
          setUser(null);
        } else {
          const errorMessage =
            err.response?.data?.message ?? "Gagal menyimpan data guru.";
          toast.error(errorMessage);
          setError(errorMessage);
        }
      } else {
        toast.error("Terjadi kesalahan tak terduga saat membuat data.");
        setError("Terjadi kesalahan tak terduga.");
      }
      // Lempar kembali error agar komponen pemanggil (misalnya, handler submit form) dapat menangkapnya
      // dan mencegah tindakan yang tidak diinginkan seperti menutup modal.
      throw err;
    } finally {
      setLoadingOverlay(false);
    }
  };

  // Memperbarui data guru yang sudah ada
  const update = async (payload: Teacher) => {
    try {
      setLoadingOverlay(true);
      const result = await teacherService.update(payload);
      await fetchAll(); // Muat ulang data setelah berhasil memperbarui
      toast.success("Berhasil memperbarui data guru.");
      return result;
    } catch (err: unknown) {
      console.error("Gagal memperbarui data guru:", err);
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
          setUser(null);
        } else {
          const errorMessage =
            err.response?.data?.message ?? "Gagal memperbarui data guru.";
          toast.error(errorMessage);
          setError(errorMessage);
        }
      } else {
        toast.error("Terjadi kesalahan tak terduga saat memperbarui data.");
        setError("Terjadi kesalahan tak terduga.");
      }
      // Lempar kembali error dengan alasan yang sama seperti pada fungsi `create`.
      throw err;
    } finally {
      setLoadingOverlay(false);
    }
  };

  // Menghapus data guru
  const remove = async (id: string) => {
    try {
      setLoadingOverlay(true);
      await teacherService.remove(id);
      await fetchAll(); // Muat ulang data setelah berhasil menghapus
      toast.success("Berhasil menghapus data guru.");
    } catch (err: unknown) {
      console.error("Gagal menghapus data guru:", err);
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
          setUser(null);
        } else {
          const errorMessage =
            err.response?.data?.message ?? "Gagal menghapus data guru.";
          toast.error(errorMessage);
          setError(errorMessage);
        }
      } else {
        toast.error("Terjadi kesalahan tak terduga saat menghapus data.");
        setError("Terjadi kesalahan tak terduga.");
      }
      // Tidak perlu melempar error kembali di sini jika dialog konfirmasi komponen pemanggil sudah menangani alurnya.
    } finally {
      setLoadingOverlay(false);
    }
  };

  // Pengambilan data awal saat komponen dimuat
  useEffect(() => {
    fetchAll();
  }, []); // Array dependensi kosong memastikan ini hanya berjalan sekali

  return {
    data,
    loading,
    loadingOverlay,
    error,
    fetchAll,
    create,
    update,
    remove,
  };
};
