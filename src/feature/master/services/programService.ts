import http from "@/core/service/auth";
import {
  CreateProgramResponse,
  Program,
  UpdateProgramResponse,
} from "../types/program";

export const programService = {
  async getAll(): Promise<Program[]> {
    const response = await http.get("/master/programs");
    return response.data.data;
  },

  async create(data: Program): Promise<CreateProgramResponse> {
    const response = await http.post<CreateProgramResponse>(
      "/master/programs",
      data
    );
    return response.data;
  },

  async update(data: Program): Promise<CreateProgramResponse> {
    const response = await http.put<UpdateProgramResponse>(
      `/master/programs/${data.id}`,
      data
    );
    return response.data;
  },

  async remove(id: string): Promise<CreateProgramResponse> {
    const response = await http.delete(`/master/programs/${id}`);
    return response.data;
  },
};
