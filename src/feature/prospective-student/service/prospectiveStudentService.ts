import http from "@/core/service/auth";
import { ProspectiveStudent } from "@/feature/prospective-student/types/prospective-student";

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

export const removeProspectiveStudent = async (id: string) => {
  return await http.delete(`/prospective-students/${id}`);
};
