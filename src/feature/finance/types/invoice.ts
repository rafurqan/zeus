export type InvoiceStatus = 'Menunggu Pembayaran' | 'Terlambat' | 'Lunas';

export type Invoice = {
  id: string;
  student_class: string;
  entity_id: string;
  entity_type: string;
  code: string;
  publication_date: Date;
  due_date: Date;
  notes: string;
  status: InvoiceStatus;
  total: number;
  invoice_type: string;
  delivered_wa: boolean;
  created_at: Date;
  created_by_id: string;
  updated_at: Date;
  updated_by_id: string;
};

export type createInvoice = {
  message: string;
  data: Invoice;
};

export type updateInvoice = {
  message: string;
  data: Invoice;
};

export interface SendWaRequest {
  phones: string[];
  invoice_id?: string;
}

export interface WaResponse {
  success: boolean;
  message: string;
  response: {
    detail: string;
    id: string[];
    process: string;
    quota: Record<string, {
      details: string;
      quota: number;
      remaining: number;
      used: number;
    }>;
    requestid: number;
    status: boolean;
    target: string[];
  };
}
