import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Student } from "../types/student";
import { studentService } from "../services/studentService";

export const useStudentById = (id?: string) => {
  return useQuery<Student, AxiosError>({
    queryKey: ["student", id],
    queryFn: () => studentService.getById(id!), // `!` karena di-enable hanya jika ada id
    enabled: !!id, // query hanya jalan kalau id tersedia,
  });
};
