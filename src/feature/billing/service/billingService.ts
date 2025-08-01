import http from "@/core/service/https";
import {
  CreateBillingResponse,
  Billing,
  UpdateBillingResponse,
} from "../types/billing";

export const billingService = {
  async getAll(token: string): Promise<Billing[]> {
    const response = await http(token).get("master/rates");
    return response.data.data;
  },

  async getAllActive(token: string): Promise<Billing[]> {
    const response = await http(token).get("master/rates/active");
    return response.data.data;
  },

  async create(token: string, data: Billing): Promise<CreateBillingResponse> {
    const response = await http(token).post<CreateBillingResponse>(
      "master/rates",
      data
    );
    return response.data;
  },

  async update(token: string, data: Billing): Promise<CreateBillingResponse> {
    const response = await http(token).put<UpdateBillingResponse>(
      `master/rates/${data.id}`,
      data
    );
    console.log(response.data);
    return response.data;
  },

  async remove(token: string, id: string): Promise<CreateBillingResponse> {
    const response = await http(token).delete(`master/rates/${id}`);
    return response.data;
  },
};