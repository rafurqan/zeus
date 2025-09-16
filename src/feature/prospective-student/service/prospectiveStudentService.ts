import http from "@/core/service/auth";
import {
  ApproveProspectiveStudentResponse,
  CreateProspectiveStudentResponse,
  GetRegistrationCodeResponse,
  ListProspectiveStudentRequest,
  ProspectiveStudent,
  ProspectiveStudentResponse,
  RemoveProspectiveStudentResponse,
  UpdateProspectiveStudentResponse,
} from "@/feature/prospective-student/types/prospective-student";
import { Student } from "@/feature/student/types/student";

export const listProspectiveStudent = async () => {
  const response = await http.get("/prospective-students");
  return response.data;
};

export const createProspectiveStudent = async (data: ProspectiveStudent) => {
  const response = await http.post("/prospective-students", data);
  return response.data;
};

export const updateProspectiveStudent = async (data: ProspectiveStudent) => {
  const response = await http.put(`/prospective-students/${data.id}`, data);
  return response.data;
};

export const updateStudent = async (data: Student) => {
  const response = await http.put(`/students/${data.id}`, data);
  return response.data;
};


export const removeProspectiveStudent = async (id: string) => {
  return await http.delete(`/prospective-students/${id}`);
};

export const prospectiveStudentService = {
  async getAll(
    params?: ListProspectiveStudentRequest | null
  ): Promise<ProspectiveStudentResponse> {
    const response = await http.get("/prospective-students", {
      params: params,
    });
    return response.data;
  },

  async create(
    data: ProspectiveStudent
  ): Promise<CreateProspectiveStudentResponse> {
    const response = await http.post<CreateProspectiveStudentResponse>(
      "/prospective-students",
      data
    );
    return response.data;
  },

  async update(
    data: ProspectiveStudent
  ): Promise<UpdateProspectiveStudentResponse> {
    const response = await http.put<UpdateProspectiveStudentResponse>(
      `/prospective-students/${data.id}`,
      data
    );
    return response.data;
  },

  async remove(id: string): Promise<RemoveProspectiveStudentResponse> {
    const response = await http.delete(`/prospective-students/${id}`);
    return response.data;
  },

  async getRegistrationCode(): Promise<GetRegistrationCodeResponse> {
    const response = await http.get<GetRegistrationCodeResponse>(
      "/prospective-students/registration-code/generate"
    );
    return response.data;
  },

  async approve(id: string): Promise<ApproveProspectiveStudentResponse> {
    const response = await http.post(`/prospective-students/${id}/approve`);
    return response.data;
  },
};
