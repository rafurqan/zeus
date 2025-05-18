import { EducationLevel } from "@/core/types/education-level";
import { MasterData } from "@/core/types/master-data";

export type Parent = {
  id: string;
  parent_type: string;
  full_name: string;
  education_level: EducationLevel | null;
  occupation: string | null;
  income_range: MasterData | null;
  phone: string | null;
  email: string | null;
  nik: string | null;
  address: string | null;
  is_main_contact: boolean;
  is_emergency_contact: boolean;
};
