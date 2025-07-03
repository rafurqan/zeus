import http from "@/core/service/auth";
import {
  ApproveStudentResponse,
  ChangeStatusRequest,
  ChangeStatusResponse,
  CreateStudentResponse,
  GetRegistrationCodeResponse,
  GetStudentResponse,
  ListStudentRequest,
  RemoveStudentResponse,
  Student,
  StudentResponse,
  UpdateStudentResponse,
} from "../types/student";
export const studentService = {
  async getAll(params?: ListStudentRequest | null): Promise<StudentResponse> {
    const response = await http.get("/students", {
      params: params,
    });
    return response.data;
  },

  async getById(id: string): Promise<Student> {
    const response = await http.get<GetStudentResponse>(`/students/${id}`);
    return response.data.data;
  },

  async create(data: Student): Promise<CreateStudentResponse> {
    const response = await http.post<CreateStudentResponse>("/students", data);
    return response.data;
  },

  async update(data: Student): Promise<UpdateStudentResponse> {
    const response = await http.put<UpdateStudentResponse>(
      `/students/${data.id}`,
      data
    );
    return response.data;
  },

  async remove(id: string): Promise<RemoveStudentResponse> {
    const response = await http.delete(`/students/${id}`);
    return response.data;
  },

  async getRegistrationCode(): Promise<GetRegistrationCodeResponse> {
    const response = await http.get<GetRegistrationCodeResponse>(
      "/students/registration-code/generate"
    );
    return response.data;
  },

  async approve(id: string): Promise<ApproveStudentResponse> {
    const response = await http.post(`/students/${id}/approve`);
    return response.data;
  },

  async changeStatus(data: ChangeStatusRequest): Promise<ChangeStatusResponse> {
    const response = await http.post(
      `/students/${data.id}/change-status`,
      data
    );
    return response.data;
  },
};
