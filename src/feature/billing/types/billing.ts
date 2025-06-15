export type Billing = {
  id: string;
  code?: string; // Ditambahkan berdasarkan penggunaan di tabel
  nama_tarif: string;
  price: number;
  description: string; // Digunakan untuk 'Kategori' di form
  program_id: string; // Menyimpan ID program
  program: string; // Menyimpan ID program
  is_active: "Y" | "N";
  frequency: string;
  applies_to: string;
  service_id?: string; // Ditambahkan berdasarkan state form
  category?: string; // Ditambahkan berdasarkan state form, mungkin sama dengan description
};

// Ditambahkan berdasarkan penggunaan di billingService.ts
export type CreateBillingResponse = {
  message: string;
  data: Billing;
};

// Ditambahkan berdasarkan penggunaan di billingService.ts
export type UpdateBillingResponse = {
  message: string;
  data: Billing;
};