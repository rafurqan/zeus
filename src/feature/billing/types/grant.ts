export interface Grant {
  id: string;
  grants_name: string;
  donor_name: string;
  donation_type: string;
  description: string | null;
  total_funds: number;
  created_at: string | null;
  acceptance_date?: string;
  notes: string | null;
  is_active: "Y" | "N";
  code?: string;
  total_used_funds?: number;
}

export type CreateGrantResponse = {
    message: string;
    data: Grant;
  };
  
  export type UpdateGrantResponse = {
    message: string;
    data: Grant;
  };