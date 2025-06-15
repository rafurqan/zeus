export interface RatePackage  {
  child_rates: boolean;
  service_name: any;
  id: string;
  code?: string; // Ditambahkan berdasarkan penggunaan di tabel
  nama_tarif: string;
  price: number;
  description: string; // Digunakan untuk 'Kategori' di form
  program_id: string; // Menyimpan ID program
  is_active: "Y" | "N";
  frequency: string;
  applies_to: string;
  service_id?: string; // Ditambahkan berdasarkan state form
  category?: string; // Ditambahkan berdasarkan state form, mungkin sama dengan description
  child_ids?: string[]; // Tambahkan properti ini untuk menyimpan child_ids
}

export type CreateRatePackageResponse = {
    message: string;
    data: packageRate;
  };
  
  export type UpdateRatePackageResponse = {
    message: string;
    data: packageRate;
  };


