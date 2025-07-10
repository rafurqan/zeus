export type Billing = {
  id: string;
  code?: string;
  nama_tarif: string;
  price: number;
  description: string; 
  program_id: string;
  program: string; 
  is_active: "Y" | "N";
  frequency: string;
  applies_to: string;
  service_name: string;
  service_id?: string;
  category?: string;
  child_ids?: string[]; 
};

export type CreateBillingResponse = {
  message: string;
  data: Billing;
};

export type UpdateBillingResponse = {
  message: string;
  data: Billing;
};