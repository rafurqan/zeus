import http from "@/core/service/auth";
import {
  CreateTeacherResponse,
  Teacher,
  UpdateTeacherResponse,
} from "../types/teacher";

export const teacherService = {
  async getAll(): Promise<Teacher[]> {
    const response = await http.get("/teachers");
    return response.data.data;
  },

  async create(data: Teacher): Promise<CreateTeacherResponse> {
    const response = await http.post<CreateTeacherResponse>("/teachers", data);
    return response.data;
  },

  async update(data: Teacher): Promise<CreateTeacherResponse> {
    const response = await http.put<UpdateTeacherResponse>(
      `/teachers/${data.id}`,
      data
    );
    return response.data;
  },

  async remove(id: string): Promise<CreateTeacherResponse> {
    const response = await http.delete(`/teachers/${id}`);
    return response.data;
  },
};
