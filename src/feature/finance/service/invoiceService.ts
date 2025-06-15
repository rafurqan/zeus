import http from "@/core/service/https";
import {
  createInvoice,
  Invoice,
  updateInvoice,
} from "../types/invoice";

export const invoiceService = {
  async getAll(token: string): Promise<Invoice[]> {
    const response = await http(token).get("finance/invoices");
    // console.log(response.data.data);
    return response.data.data;
  },

  async generateInvoiceCode(token: string): Promise<string> {
    // console.log(token);
    const response = await http(token).get("finance/invoices/generate-invoice-code");
    // console.log(response.data.data.invoice_code);
    return response.data.data.invoice_code;
  },

  async create(token: string, data: Invoice): Promise<createInvoice> {
    const response = await http(token).post<createInvoice>(
      "finance/invoices",
      data
    );
    return response.data;
  },

  async update(token: string, data: Invoice): Promise<createInvoice> {
    const response = await http(token).put<updateInvoice>(
      `finance/invoices/${data.id}`,
      data
    );
    console.log(response.data);
    return response.data;
  },

  async remove(token: string, id: string): Promise<createInvoice> {
    const response = await http(token).delete(`finance/invoices/${id}`);
    return response.data;
  },
};