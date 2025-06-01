import http from "@/core/service/auth";
import {
  StudentClass,
  CreateStudentClassResponse,
  UpdateStudentClassResponse,
  RemoveStudentClassResponse,
} from "../types/student-class";

export const studentClassService = {
  async getAll(academic_year?: string | null): Promise<StudentClass[]> {
    const response = await http.get("/master/student-classes", {
      params: {
        academic_year: academic_year,
      },
    });
    return response.data.data;
  },

  async create(data: StudentClass): Promise<CreateStudentClassResponse> {
    const response = await http.post<CreateStudentClassResponse>(
      "/master/student-classes",
      data
    );
    return response.data;
  },

  async update(data: StudentClass): Promise<CreateStudentClassResponse> {
    const response = await http.put<UpdateStudentClassResponse>(
      `/master/student-classes/${data.id}`,
      data
    );
    return response.data;
  },

  async remove(id: string): Promise<RemoveStudentClassResponse> {
    const response = await http.delete(`/master/student-classes/${id}`);
    return response.data;
  },
};
