import { ProspectiveStudent } from "@/feature/prospective-student/types/prospective-student";
import http from "../../../core/service/https";

export const listProspectiveStudent = async (token: string | null) => {
  const response = await http(token).get("/prospective-students");
  return response.data;
};

export const createProspectiveStudent = async (
  token: string | null,
  data: ProspectiveStudent
) => {
  const response = await http(token).post("/prospective-students", data);
  return response.data;
};

export const updateProspectiveStudent = async (
  token: string | null,
  data: ProspectiveStudent
) => {
  console.log(JSON.stringify(data));
  const response = await http(token).put(
    `/prospective-students/${data.id}`,
    data
  );
  return response.data;
};

export const removeProspectiveStudent = async (
  token: string | null,
  id: string
) => {
  return await http(token).delete(`/prospective-students/${id}`);
};
