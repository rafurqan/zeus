import http from "@/core/service/https";
import {
  CreateTeacherResponse,
  Teacher,
  UpdateTeacherResponse,
} from "../types/teacher";

export const teacherService = {
  async getAll(token: string): Promise<Teacher[]> {
    const response = await http(token).get("/teachers");
    return response.data.data;
  },

  async create(token: string, data: Teacher): Promise<CreateTeacherResponse> {
    const response = await http(token).post<CreateTeacherResponse>(
      "/teachers",
      data
    );
    return response.data;
  },

  async update(token: string, data: Teacher): Promise<CreateTeacherResponse> {
    console.log(data);
    const response = await http(token).put<UpdateTeacherResponse>(
      `/teachers/${data.id}`,
      data
    );
    return response.data;
  },

  async remove(token: string, id: string): Promise<CreateTeacherResponse> {
    const response = await http(token).delete(`/teachers/${id}`);
    return response.data;
  },
};
