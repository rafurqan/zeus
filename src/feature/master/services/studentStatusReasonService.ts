import http from "@/core/service/auth";
import {
  CreateStudentStatusReasonResponse,
  StudentStatusReason,
  UpdateStudentStatusReasonResponse,
} from "../types/studentStatusReason";

export const studentStatusReasonService = {
  async getAll(): Promise<StudentStatusReason[]> {
    const response = await http.get("/master/student-status-reasons");
    return response.data.data;
  },

  async create(
    data: StudentStatusReason
  ): Promise<CreateStudentStatusReasonResponse> {
    const response = await http.post<CreateStudentStatusReasonResponse>(
      "/master/student-status-reasons",
      data
    );
    return response.data;
  },

  async update(
    data: StudentStatusReason
  ): Promise<CreateStudentStatusReasonResponse> {
    const response = await http.put<UpdateStudentStatusReasonResponse>(
      `/master/student-status-reasons/${data.id}`,
      data
    );
    return response.data;
  },

  async remove(id: string): Promise<CreateStudentStatusReasonResponse> {
    const response = await http.delete(`/master/student-status-reasons/${id}`);
    return response.data;
  },
};
