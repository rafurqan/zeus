import http from "@/core/service/https";
import { createInvoice, Invoice, updateInvoice, SendWaRequest, WaResponse } from "../types/invoice";

export const invoiceService = {
  async getAllPage(
    token: string,
    page: number = 1,
    perPage: number = 10,
    searchTerm: string = "",
    status: string = ""
  ) {
    const response = await http(token).get("finance/invoices", {
      params: {
        page,
        per_page: perPage,
        search: searchTerm,
        status: status !== "Semua Status" ? status : undefined,
      },
    });
    return response.data;
  },

  async showDataById(id: string, token: string): Promise<Invoice> {
    const response = await http(token).get(`finance/invoices/${id}`);
    return response.data.data;
  },

  async generateInvoiceCode(token: string): Promise<string> {
    const response = await http(token).get(
      "finance/invoices/generate-invoice-code"
    );
    return response.data.data.invoice_code;
  },

  async getStudents(
    token: string,
    keyword = "",
    perPage = 10
  ): Promise<unknown[]> {
    const response = await http(token).get("students", {
      params: {
        keyword,
        per_page: perPage,
      },
    });
    return response.data.data;
  },

  async create(token: string, data: Partial<Invoice>): Promise<createInvoice> {
    const response = await http(token).post<createInvoice>(
      "finance/invoices",
      data
    );
    return response.data;
  },

  async update(token: string, data: Partial<Invoice>): Promise<createInvoice> {
    const response = await http(token).put<updateInvoice>(
      `finance/invoices/${data.id}`,
      data
    );
    return response.data;
  },

  async remove(token: string, id: string): Promise<createInvoice> {
    const response = await http(token).delete(`finance/invoices/${id}`);
    return response.data;
  },

  async sendWa(token: string, data: SendWaRequest): Promise<WaResponse> {
    const response = await http(token).post<WaResponse>("wa/single-send", data);
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
    const response = await http(token).get("finance/invoices/statistics");
    return response.data.data;
  },
};
