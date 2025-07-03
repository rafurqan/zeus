export type Payment = {
  id: string;
  invoice_id: string;
  payment_method: string;
  payment_date: Date;
  bank_name: string;
  account_name: string;
  account_number: string;
  reference_number: string;
  nominal_payment: number;
  notes: string;
  id_log_grant: string;
  id_grant: string;
  created_by_id: string;
  updated_by_id: string;
};

export type createPayment = {
  message: string;
  data: Payment;
};

export type updatePayment = {
  message: string;
  data: Payment;
};