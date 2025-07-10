export interface RatePackage  {
  id: string;
  code?: string;
  price: number;
  description: string; 
  program_id: string; 
  is_active: "Y" | "N";
  frequency: string;
  applies_to: string;
  service_id?: string; 
  category?: string; 
  child_ids?: string[]; 
  service_name?: string;
  program?: string;
  total_price?: number;
}

export type CreateRatePackageResponse = {
    message: string;
    data: RatePackage;
  };
  
  export type UpdateRatePackageResponse = {
    message: string;
    data: RatePackage;
  };


