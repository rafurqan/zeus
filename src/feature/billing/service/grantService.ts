import http from "@/core/service/https";
import {
  CreateGrantResponse,
  Grant,
  UpdateGrantResponse,
} from "../types/grant";

export const grantService = {
  async getAll(token: string): Promise<Grant[]> {
    const response = await http(token).get("master/grants");
    // console.log(response.data.data);
    return response.data.data;
  },

  async create(token: string, data: Grant): Promise<CreateGrantResponse> {
    const response = await http(token).post<CreateGrantResponse>(
      "master/grants",
      data
    );
    return response.data;
  },

  async update(token: string, data: Grant): Promise<CreateGrantResponse> {
    const response = await http(token).put<UpdateGrantResponse>(
      `master/grants/${data.id}`,
      data
    );
    // console.log(response.data);
    return response.data;
  },

  async remove(token: string, id: string): Promise<CreateGrantResponse> {
    const response = await http(token).delete(`master/grants/${id}`);
    console.log(response.data);
    return response.data;
  },

  async reset(token: string, id: string): Promise<CreateGrantResponse> {
    const response = await http(token).post<CreateGrantResponse>(
      `master/grants/${id}/reset`
    );
    return response.data;
  },
};