export interface Payment {
  id: string;
  code?: string;
  entity?: {
    full_name: string;
    nisn: string;
  };
  student_class?: {
    name: string;
  };
  total: number;
  due_date: string;
  payment?: {
    id: string;
    code: string;
    status: 'paid' | 'unpaid' | 'late' | 'partial';
    payment_method: string;
    payment_date: string;
  };
}


export type createPayment = {
  message: string;
  data: Payment;
};

export type updatePayment = {
  message: string;
  data: Payment;
};