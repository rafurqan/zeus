import http from "@/core/service/https";
import { Payment, createPayment, updatePayment } from "../types/payment";

export const paymentService = {
    async getAllPage(token: string, page: number = 1, perPage: number = 10, searchTerm: string = "", status: string | null = null) {
        const response = await http(token).get("finance/payments", {
          params: {
            page,
            per_page: perPage,
            search: searchTerm || undefined,
            status: status || undefined,
          },
        });
        return response.data;
    },
    async showDataById(id: string, token: string): Promise<Payment> {
        const response = await http(token).get(`finance/payments/${id}`);
        return response.data.data;
    },
    async create(token: string, data: Payment) {
        const response = await http(token).post("finance/payments", data);
        return response.data;
    },
    async update(token: string, data: Payment): Promise<createPayment> {
      const response = await http(token).put<updatePayment>(`finance/payments/${data.id}`, data);
      return response.data;
    },
    async remove(token: string, id: string) {
        const response = await http(token).delete(`finance/payments/${id}`);
        return response.data;
    },
    async getStatistics(token: string): Promise<{
        total: number;
        total_amount: number;
        pending: number;
        pending_amount: number;
        late: number;
        late_amount: number;
        paid: number;
        paid_amount: number;
      }> {
        const response = await http(token).get("finance/payments/statistics");
        return response.data.data;
      },
};