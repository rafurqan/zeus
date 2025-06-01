import { useState } from "react";

import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { StudentClass } from "../types/student-class";
import { studentClassService } from "../services/studentClassService";

export const useActiveStudentClass = () => {
  const [data, setData] = useState<StudentClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async (academic_year: string) => {
    try {
      setLoading(true);
      const result = await studentClassService.getAll(academic_year);
      setData(result);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data.message || "Gagal memuat data");
        toast.error(
          err.response?.data.message ??
            "Terjadi kesalahan saat merubah kelas siswa."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    fetchAll,
  };
};
